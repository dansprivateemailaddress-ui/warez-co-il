// The build prepends TRACKER_JS and DASHBOARD_HTML; credentials are runtime secrets only.
const encoder = new TextEncoder();
const cookieName = '__Secure-warez_analytics';
const origin = 'https://warez.co.il';
const sessionSeconds = 8 * 60 * 60;
const hex = bytes => Array.from(new Uint8Array(bytes), b => b.toString(16).padStart(2, '0')).join('');
const unhex = value => /^[0-9a-f]+$/i.test(value) && value.length % 2 === 0 ? Uint8Array.from(value.match(/../g), b => parseInt(b, 16)) : new Uint8Array();
function equal(a, b) { if (a.length !== b.length) return false; let diff = 0; for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i]; return diff === 0; }
async function mac(secret, value) { const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']); return hex(await crypto.subtle.sign('HMAC', key, encoder.encode(value))); }
async function passwordMatches(password, stored) {
  const [salt, expected] = (stored || '').split(':');
  if (!salt || !expected || password.length > 256) return false;
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const actual = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: unhex(salt), iterations: 100000, hash: 'SHA-256' }, key, 256);
  return equal(new Uint8Array(actual), unhex(expected));
}
function secureHeaders(type = 'text/html; charset=utf-8', nonce = '') {
  return { 'Content-Type': type, 'Cache-Control': 'no-store, private', 'X-Robots-Tag': 'noindex, nofollow', 'X-Content-Type-Options': 'nosniff', 'X-Frame-Options': 'DENY', 'Referrer-Policy': 'same-origin', 'Content-Security-Policy': `default-src 'none'; script-src 'nonce-${nonce}'; style-src 'nonce-${nonce}'; connect-src 'self'; img-src 'self' data:; form-action 'self'; frame-ancestors 'none'; base-uri 'none'` };
}
function html(text, status = 200, extra = {}) { const nonce = hex(crypto.getRandomValues(new Uint8Array(16))); return new Response(text.replaceAll('{{NONCE}}', nonce), { status, headers: { ...secureHeaders(undefined, nonce), ...extra } }); }
function json(data, status = 200) { return new Response(JSON.stringify(data), { status, headers: secureHeaders('application/json; charset=utf-8') }); }
function redirect(cookie = '') { return new Response(null, { status: 303, headers: { ...secureHeaders(), Location: '/analytics', ...(cookie ? { 'Set-Cookie': cookie } : {}) } }); }
function loginPage(error = '') { return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Analytics Login | Warez.co.il</title><style nonce="{{NONCE}}">*{box-sizing:border-box}body{margin:0;background:#f5f5ef;color:#17281e;font:16px system-ui;display:grid;place-items:center;min-height:100vh}.card{width:min(430px,calc(100% - 36px));background:white;border:1px solid #dbe2d4;padding:40px;border-radius:18px;box-shadow:0 20px 70px #1730210b}.brand{font-weight:800;font-size:24px}h1{font-size:30px;margin-bottom:8px}p{line-height:1.6;color:#647064}label{display:block;margin:28px 0 8px;font-weight:600}input,button{font:inherit;width:100%;padding:14px;border-radius:8px}input{border:1px solid #a7b4a4}button{border:0;background:#1b3b29;color:white;font-weight:700;margin-top:18px;cursor:pointer}.error{color:#9d2828}small{color:#687467}</style></head><body><main class="card"><div class="brand">warez ✳ <small>ANALYTICS</small></div><h1>Welcome back.</h1><p>Your website, in numbers.<br>Enter your analytics password to continue.</p>${error ? `<p role="alert" class="error">${error}</p>` : ''}<form action="/analytics/login" method="post"><label for="password">Password</label><input id="password" name="password" type="password" autocomplete="current-password" maxlength="256" required autofocus><button type="submit">Open analytics →</button></form></main></body></html>`; }
async function authenticated(request, env) {
  const value = (request.headers.get('Cookie') || '').split(';').map(x => x.trim()).find(x => x.startsWith(cookieName + '='))?.slice(cookieName.length + 1);
  if (!value || value.length > 300) return false;
  const [nonce, expiry, signature] = value.split('.');
  const now = Math.floor(Date.now() / 1000), exp = Number(expiry);
  if (!/^[a-f0-9]{32}$/.test(nonce || '') || !Number.isInteger(exp) || exp < now || exp > now + sessionSeconds + 60 || !/^[a-f0-9]{64}$/.test(signature || '')) return false;
  return equal(unhex(signature), unhex(await mac(env.ANALYTICS_SECRET, nonce + '.' + expiry)));
}
function sameOrigin(request) { return request.headers.get('Origin') === origin; }
async function smallBody(request, limit) {
  if (Number(request.headers.get('Content-Length') || 0) > limit) throw new Error('too_large');
  const reader = request.body?.getReader(); if (!reader) return '';
  let bytes = 0; const chunks = [];
  while (true) { const next = await reader.read(); if (next.done) break; bytes += next.value.byteLength; if (bytes > limit) { await reader.cancel(); throw new Error('too_large'); } chunks.push(next.value); }
  const all = new Uint8Array(bytes); let offset = 0; for (const chunk of chunks) { all.set(chunk, offset); offset += chunk.length; }
  return new TextDecoder().decode(all);
}
function clean(value, limit = 100) { const s = String(value || '').replace(/[\x00-\x1f<>]/g, '').trim().slice(0, limit); return /[\w.+-]+@[\w.-]+\.[a-z]{2,}|\b\+?\d[\d ()-]{8,}\d\b/i.test(s) ? '[redacted]' : s; }
function publicPath(value) { try { const u = new URL(String(value), origin); let p = u.pathname.slice(0, 200); if (/^\/(analytics|_stats)(\/|$)/i.test(p)) return ''; if (p.includes('@')) return '/[redacted]'; return p.replace(/\/[a-f0-9]{24,}(?=\/|$)/gi, '/[redacted]'); } catch { return ''; } }
function client(ua) {
  const device = /ipad|tablet/i.test(ua) ? 'Tablet' : /mobile|iphone|android/i.test(ua) ? 'Mobile' : 'Desktop';
  const browser = /Edg\//.test(ua) ? 'Edge' : /OPR\//.test(ua) ? 'Opera' : /Firefox\//.test(ua) ? 'Firefox' : /Chrome\//.test(ua) ? 'Chrome' : /Safari\//.test(ua) ? 'Safari' : 'Other';
  const os = /Windows/.test(ua) ? 'Windows' : /Android/.test(ua) ? 'Android' : /iPhone|iPad/.test(ua) ? 'iOS' : /Mac OS/.test(ua) ? 'macOS' : /Linux/.test(ua) ? 'Linux' : 'Other';
  return { device, browser, os };
}
async function collect(request, env, ctx) {
  if (!sameOrigin(request) || !request.headers.get('Content-Type')?.startsWith('application/json')) return new Response(null, { status: 403 });
  const ua = request.headers.get('User-Agent') || '';
  if (/bot|crawl|spider|headless|lighthouse/i.test(ua) || request.cf?.botManagement?.verifiedBot || request.headers.get('DNT') === '1' || request.headers.get('Sec-GPC') === '1') return new Response(null, { status: 204 });
  const event = JSON.parse(await smallBody(request, 3000));
  const path = publicPath(event.path);
  if (!path || !['view','search','outbound','engagement'].includes(event.kind) || !/^[a-f0-9-]{36}$/i.test(event.id || '') || !/^[a-f0-9-]{36}$/i.test(event.session || '')) return json({ error: 'Invalid event' }, 400);
  const ts = Math.floor(Date.now() / 1000), day = new Date(ts * 1000).toISOString().slice(0, 10);
  const visitor = (await mac(env.ANALYTICS_SECRET, 'visitor:' + day + ':' + (request.headers.get('CF-Connecting-IP') || '') + ':' + ua)).slice(0, 32);
  const rate = await env.ANALYTICS_DB.prepare('INSERT INTO login_limits (key,window,attempts) VALUES (?,?,1) ON CONFLICT(key) DO UPDATE SET attempts=CASE WHEN window=excluded.window THEN attempts+1 ELSE 1 END,window=excluded.window RETURNING attempts').bind('collect:' + visitor, Math.floor(ts / 60)).first();
  if (rate.attempts > 120) return new Response(null, { status: 429 });
  const session = (await mac(env.ANALYTICS_SECRET, 'session:' + event.session)).slice(0, 32);
  let referrer = ''; try { const ref = new URL(event.referrer); if (ref.protocol === 'https:' || ref.protocol === 'http:') { if (!['warez.co.il','www.warez.co.il'].includes(ref.hostname)) referrer = ref.hostname; } } catch {}
  const source = clean(event.source) || (/google\./i.test(referrer) ? 'Google' : /bing\./i.test(referrer) ? 'Bing' : /duckduckgo\./i.test(referrer) ? 'DuckDuckGo' : referrer || 'Direct / unknown');
  const medium = clean(event.medium) || (/google\.|bing\.|duckduckgo\./i.test(referrer) ? 'organic' : referrer ? 'referral' : 'direct');
  const info = client(ua), seconds = event.kind === 'engagement' ? Math.max(0, Math.min(1800, Math.floor(Number(event.seconds) || 0))) : 0;
  const statement = env.ANALYTICS_DB.prepare('INSERT OR IGNORE INTO events (id,ts,day,visitor,session,kind,path,referrer,source,medium,campaign,term,country,city,device,browser,os,seconds,destination) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)').bind(event.id,ts,day,visitor,session,event.kind,path,referrer,source,medium,clean(event.campaign),clean(event.term),clean(request.cf?.country || 'Unknown'),clean(request.cf?.city || ''),info.device,info.browser,info.os,seconds,clean(event.destination));
  ctx.waitUntil((async () => { await statement.run(); if (crypto.getRandomValues(new Uint8Array(1))[0] === 0) await env.ANALYTICS_DB.batch([env.ANALYTICS_DB.prepare('DELETE FROM events WHERE ts < ?').bind(ts - 90 * 86400), env.ANALYTICS_DB.prepare("DELETE FROM login_limits WHERE (key LIKE 'collect:%' AND window < ?) OR (key NOT LIKE 'collect:%' AND window < ?)").bind(Math.floor(ts / 60) - 60, Math.floor(ts / 900) - 4)]); })().catch(() => console.error('analytics_write_failed')));
  return new Response(null, { status: 204, headers: { 'Cache-Control': 'no-store' } });
}
async function report(request, env) {
  const days = Math.max(1, Math.min(90, parseInt(new URL(request.url).searchParams.get('days') || '7', 10) || 7));
  const since = Math.floor(Date.now() / 86400000) * 86400 - (days - 1) * 86400;
  const top = (field, extra = '') => env.ANALYTICS_DB.prepare(`SELECT ${field} AS name, COUNT(*) AS views, COUNT(DISTINCT visitor) AS visitors FROM events WHERE ts >= ? AND kind='view' ${extra} GROUP BY ${field} ORDER BY views DESC LIMIT 50`).bind(since);
  const statements = [
    env.ANALYTICS_DB.prepare("SELECT COUNT(*) AS pageviews,COUNT(DISTINCT visitor) AS visitors,COUNT(DISTINCT session) AS sessions FROM events WHERE ts>=? AND kind='view'").bind(since),
    env.ANALYTICS_DB.prepare("SELECT day,COUNT(*) AS views,COUNT(DISTINCT visitor) AS visitors FROM events WHERE ts>=? AND kind='view' GROUP BY day ORDER BY day").bind(since),
    top('path'), top('source'), top('country'), top('city', "AND city<>''"), top('device'), top('browser'), top('os'), top('campaign', "AND campaign<>''"),
    env.ANALYTICS_DB.prepare("SELECT term AS name,COUNT(*) AS searches FROM events WHERE ts>=? AND kind='search' AND term<>'' GROUP BY term ORDER BY searches DESC LIMIT 50").bind(since),
    top('term', "AND term<>''"),
    env.ANALYTICS_DB.prepare("SELECT destination AS name,COUNT(*) AS clicks FROM events WHERE ts>=? AND kind='outbound' AND destination<>'' GROUP BY destination ORDER BY clicks DESC LIMIT 50").bind(since),
    env.ANALYTICS_DB.prepare("SELECT path,source,country,city,device,ts FROM events WHERE ts>=? AND kind='view' ORDER BY ts DESC LIMIT 30").bind(since),
    env.ANALYTICS_DB.prepare('SELECT COUNT(DISTINCT visitor) AS visitors FROM events WHERE ts>=?').bind(Math.floor(Date.now()/1000)-300),
    env.ANALYTICS_DB.prepare("SELECT COUNT(*) AS bounced FROM (SELECT session FROM events WHERE ts>=? AND kind='view' GROUP BY session HAVING COUNT(*)=1)").bind(since),
    env.ANALYTICS_DB.prepare("SELECT COALESCE(SUM(seconds),0) AS seconds FROM events WHERE ts>=? AND kind='engagement'").bind(since),
    env.ANALYTICS_DB.prepare('SELECT imported_at,label,rows_json FROM search_imports WHERE id=1')
  ];
  const results = await env.ANALYTICS_DB.batch(statements), rows = i => results[i].results || [], summary = rows(0)[0] || {};
  return { days, generatedAt: new Date().toISOString(), summary: { ...summary, recentVisitors: rows(14)[0]?.visitors || 0, bounced: rows(15)[0]?.bounced || 0, engagedSeconds: rows(16)[0]?.seconds || 0 }, daily: rows(1), pages: rows(2), sources: rows(3), countries: rows(4), cities: rows(5), devices: rows(6), browsers: rows(7), systems: rows(8), campaigns: rows(9), searches: rows(10), campaignTerms: rows(11), outbound: rows(12), recent: rows(13), google: rows(17)[0] ? { importedAt: rows(17)[0].imported_at, label: rows(17)[0].label, rows: JSON.parse(rows(17)[0].rows_json) } : null };
}
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url), path = url.pathname.replace(/\/$/, '') || '/';
    if (!path.startsWith('/analytics') && !path.startsWith('/_stats/')) return env.ASSETS.fetch(request);
    try {
      if (url.hostname !== 'warez.co.il') return json({ error: 'Use https://warez.co.il/analytics' },404);
      if (path === '/_stats/tracker.js' && request.method === 'GET') return new Response(TRACKER_JS, { headers: { 'Content-Type': 'application/javascript; charset=utf-8', 'Cache-Control': 'public,max-age=300', 'X-Content-Type-Options': 'nosniff' } });
      if (!env.ANALYTICS_DB || !env.ANALYTICS_SECRET || !env.ANALYTICS_PASSWORD_HASH) return json({ error: 'Analytics is being configured. Please try again shortly.' }, 503);
      if (path === '/_stats/collect' && request.method === 'POST') return await collect(request, env, ctx);
      if (path.startsWith('/_stats/')) return json({ error: 'Not found' }, 404);
      if (path === '/analytics/login' && request.method === 'POST') {
        if (!sameOrigin(request) || !request.headers.get('Content-Type')?.startsWith('application/x-www-form-urlencoded')) return json({ error: 'Invalid request' }, 403);
        const key = await mac(env.ANALYTICS_SECRET, 'login:' + (request.headers.get('CF-Connecting-IP') || 'unknown')), window = Math.floor(Date.now()/900000);
        const limit = await env.ANALYTICS_DB.prepare('INSERT INTO login_limits (key,window,attempts) VALUES (?,?,1) ON CONFLICT(key) DO UPDATE SET attempts=CASE WHEN window=excluded.window THEN attempts+1 ELSE 1 END,window=excluded.window RETURNING attempts').bind(key,window).first();
        if (limit.attempts > 10) return html(loginPage('Too many attempts. Please try again in 15 minutes.'),429,{'Retry-After':'900'});
        const data = new URLSearchParams(await smallBody(request, 1500));
        if (!await passwordMatches(data.get('password') || '', env.ANALYTICS_PASSWORD_HASH)) return html(loginPage('That password did not match. Please try again.'),401);
        const value = hex(crypto.getRandomValues(new Uint8Array(16))) + '.' + (Math.floor(Date.now()/1000) + sessionSeconds), token = value + '.' + await mac(env.ANALYTICS_SECRET,value);
        return redirect(`${cookieName}=${token}; Path=/analytics; Max-Age=${sessionSeconds}; HttpOnly; Secure; SameSite=Strict`);
      }
      const auth = await authenticated(request,env);
      if (path === '/analytics' && request.method === 'GET') return html(auth ? DASHBOARD_HTML : loginPage());
      if (!auth) return json({ error: 'Please sign in' },401);
      if (path === '/analytics/logout' && request.method === 'POST') { if (!sameOrigin(request)) return json({ error: 'Invalid origin' },403); return redirect(`${cookieName}=; Path=/analytics; Max-Age=0; HttpOnly; Secure; SameSite=Strict`); }
      if (path === '/analytics/api' && request.method === 'GET') return json(await report(request,env));
      if (path === '/analytics/import' && request.method === 'POST') {
        if (!sameOrigin(request)) return json({ error: 'Invalid origin' },403);
        const data = JSON.parse(await smallBody(request, 1000000));
        if (!Array.isArray(data.rows) || data.rows.length > 2000) return json({ error: 'Use up to 2,000 query rows.' },400);
        const rows = data.rows.map(r => ({ query:clean(r.query,160), clicks:Math.max(0,Math.floor(Number(r.clicks)||0)), impressions:Math.max(0,Math.floor(Number(r.impressions)||0)), ctr:Math.max(0,Math.min(100,Number(r.ctr)||0)), position:Math.max(0,Number(r.position)||0) })).filter(r=>r.query);
        if (!rows.length) return json({ error: 'No query rows found.' },400);
        await env.ANALYTICS_DB.prepare('INSERT INTO search_imports (id,imported_at,label,rows_json) VALUES (1,?,?,?) ON CONFLICT(id) DO UPDATE SET imported_at=excluded.imported_at,label=excluded.label,rows_json=excluded.rows_json').bind(Math.floor(Date.now()/1000),clean(data.label,100),JSON.stringify(rows)).run();
        return json({ imported: rows.length });
      }
      return json({ error: 'Not found' },404);
    } catch (error) { console.error('analytics_request_failed', { category: error?.message === 'too_large' ? 'size_limit' : 'request_error' }); return json({ error:'Unable to process this request. Please try again.' }, error?.message === 'too_large' ? 413 : 500); }
  }
};
