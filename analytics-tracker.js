(() => {
  'use strict';
  if (!['warez.co.il', 'www.warez.co.il'].includes(location.hostname) || location.pathname.startsWith('/analytics') || navigator.doNotTrack === '1' || navigator.globalPrivacyControl) return;
  try { if (localStorage.getItem('warez-analytics-optout') === '1') return; } catch {}
  let session;
  const page = location.pathname, params = new URLSearchParams(location.search);
  let referrer = document.referrer;
  try { referrer = referrer ? new URL(referrer).origin + new URL(referrer).pathname : ''; } catch { referrer = ''; }
  let tags = Object.fromEntries(['source', 'medium', 'campaign', 'term'].map(k => [k, (params.get('utm_' + k) || '').slice(0, 100)]));
  // Click identifiers indicate a source; their values are never stored or transmitted.
  if(!tags.source && ['gclid','dclid','gbraid','wbraid'].some(k=>params.has(k))) tags={...tags,source:'Google',medium:tags.medium||'cpc'};
  else if(!tags.source && params.has('msclkid')) tags={...tags,source:'Bing',medium:tags.medium||'cpc'};
  else if(!tags.source && params.has('fbclid')) tags={...tags,source:'Facebook',medium:tags.medium||'social'};
  try {
    const now=Date.now(), previous = JSON.parse(sessionStorage.getItem('warez-attribution') || 'null');
    const external = referrer && !['warez.co.il','www.warez.co.il'].includes(new URL(referrer).hostname);
    const tagged=Object.values(tags).some(Boolean);
    const changed=!!previous && (tagged && Object.keys(tags).some(k=>tags[k]!==previous.tags?.[k]) || external && referrer!==previous.referrer);
    const fresh=!previous||previous.version!==2||now-previous.last>30*60*1000||changed;
    session=!fresh?sessionStorage.getItem('warez-visit'):null;
    if(!session)session=crypto.randomUUID();
    sessionStorage.setItem('warez-visit',session);
    if(!fresh){referrer=previous.referrer;tags=previous.tags;}
    sessionStorage.setItem('warez-attribution',JSON.stringify({version:2,referrer,tags,last:now}));
  } catch { session=crypto.randomUUID(); }
  function send(kind, extra = {}) {
    try {
      if (localStorage.getItem('warez-analytics-optout') === '1') return;
    } catch {}
    const body = JSON.stringify({ id: crypto.randomUUID(), session, kind, path: page, referrer, ...tags, ...extra });
    fetch('/_stats/collect', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true, credentials: 'same-origin' }).catch(() => {});
  }
  send('view');
  if (params.get('q')) send('search', { term: params.get('q') });
  let activeAt = document.visibilityState === 'visible' ? Date.now() : 0, activeMs = 0;
  function flush() {
    if (activeAt) { activeMs += Date.now() - activeAt; activeAt = 0; }
    const seconds = Math.min(1800, Math.floor(activeMs / 1000));
    if (seconds > 0) { activeMs -= seconds * 1000; send('engagement', { seconds }); }
  }
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flush(); else activeAt = Date.now(); });
  addEventListener('pagehide', flush);
  document.addEventListener('submit', event => { if (event.target.id === 'search-form') send('search', { term: document.querySelector('#search')?.value || '' }); }, true);
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (link) { try { const u = new URL(link.href); if (u.protocol === 'https:' && u.origin !== location.origin) send('outbound', { destination: u.hostname }); } catch {} }
    const suggestion = event.target.closest('button[data-search]');
    if (suggestion) send('search', { term: suggestion.dataset.search });
  }, true);
})();
