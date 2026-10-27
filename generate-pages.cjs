'use strict';
const fs = require('node:fs');
const vm = require('node:vm');
const origin = 'https://warez.co.il';
const gear = require('./desk-essentials.cjs');
const styleVersion = require('node:crypto').createHash('sha256').update(fs.readFileSync('dist/styles.css')).digest('hex').slice(0,12);
const context = { window: {} };
vm.runInNewContext(fs.readFileSync('dist/data.js', 'utf8'), context);
const tools = context.window.WAREZ_TOOLS;
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const json = value => JSON.stringify(value).replace(/</g, '\\u003c');
const toolPath = t => `/tools/${t.id}`;
const categoryPath = category => '/categories/' + category.toLowerCase();
const publisher = { '@type': 'Organization', name: 'Warez.co.il', url: origin + '/' };
const metadata = (title, description, path, schema) => `<title>${esc(title)}</title><meta name="description" content="${esc(description)}"><link rel="canonical" href="${origin}${path}"><meta name="robots" content="index,follow,max-image-preview:large"><meta property="og:type" content="${schema['@graph']?.some(x => x['@type'] === 'Article') ? 'article' : 'website'}"><meta property="og:site_name" content="Warez.co.il"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${origin}${path}"><meta name="twitter:card" content="summary"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(description)}"><script type="application/ld+json">${json(schema)}</script>`;
const breadcrumb = (name, path, section = 'Software tools', sectionPath = '/tools/') => ({ '@type': 'BreadcrumbList', itemListElement: [ { '@type': 'ListItem', position: 1, name: 'Home', item: origin + '/' }, ...(path === sectionPath ? [] : [{ '@type': 'ListItem', position: 2, name: section, item: origin + sectionPath }]), { '@type': 'ListItem', position: path === sectionPath ? 2 : 3, name, item: origin + path } ] });
const listing = { '@type': 'ItemList', numberOfItems: tools.length, itemListElement: tools.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.name, url: origin + toolPath(t) })) };
const pageSchema = (name, description, path, extra = {}) => ({ '@context': 'https://schema.org', '@graph': [ { '@type': 'WebPage', '@id': origin + path, url: origin + path, name, description, inLanguage: 'en', isPartOf: { '@id': origin + '/#website' }, ...extra }, { '@type': 'WebSite', '@id': origin + '/#website', url: origin + '/', name: 'Warez.co.il', publisher } ] });
const articleStyle = `<style>.tool-article{max-width:820px;padding-block:60px}.tool-article h1{font-size:clamp(32px,6vw,48px);line-height:1.15}.tool-article h2{font-size:24px;margin-block:30px 12px}.tool-article h3{margin-block:26px 10px}.tool-article p{color:#626b58;line-height:1.85;margin-block:15px}.tool-article ul{padding-left:20px;line-height:2}.tool-article a{text-decoration:underline;text-underline-offset:4px}.tool-article .dark{text-decoration:none;margin-top:20px}.tool-article .source-note{border-top:1px solid #dce0d1;padding-top:20px}.breadcrumbs{font-size:14px;margin-bottom:24px}</style>`;
function shell(title, description, path, body, schema) { return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${metadata(title, description, path, schema)}<link rel="stylesheet" href="/styles.css?v=${styleVersion}"><link rel="icon" href="/icon.svg" type="image/svg+xml">${articleStyle}</head><body><header class="header"><a class="wordmark" href="/" aria-label="Warez home">warez<span>✳</span><small>CO.IL</small></a><nav aria-label="Main navigation"><a href="/#discover">Interactive directory</a><a href="/tools/">All tool notes</a><a href="/guides/">Field notes</a><a href="/about">About</a></nav></header><main class="wrap tool-article">${body}</main><footer class="wrap"><p class="source-note">© 2026 Warez.co.il · Independent editorial summaries. Product names belong to their owners. <a href="/about">About &amp; methodology</a> · <a href="/">Home</a></p></footer></body></html>\n`; }
fs.mkdirSync('dist/tools', { recursive: true });
for (const t of tools) {
  const path = toolPath(t), title = `${t.name}: Uses, Costs & Tradeoffs | Warez.co.il`;
  const schema = pageSchema(title, t.desc, path);
  schema['@graph'].push(breadcrumb(t.name, path));
  const related = tools.filter(x => x.category === t.category && x.id !== t.id);
  const body = `<nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/tools/">Software tools</a> / ${esc(t.name)}</nav><div class="eyebrow">THE TOOLBOX / ${esc(t.category.toUpperCase())}</div><h1>${esc(t.name)}</h1><p>${esc(t.desc)}</p><p lang="he" dir="rtl">${esc(t.he)}</p><span class="pill">${esc(t.model)}</span><h2>When it makes sense</h2><p>${esc(t.best)}</p><h2>What to check before choosing</h2><p>${esc(t.watch)}</p><h2>For an Israeli team</h2><p>Test Hebrew input and exported documents, text direction, booking timezones, invoicing requirements, your actual billing currency, and support availability. A listing here is not a certification of local suitability.</p><a class="dark" href="${esc(t.url)}" rel="noopener noreferrer" target="_blank">Visit the official website ↗</a><h2>Compare ${esc(t.category.toLowerCase())} tools</h2><p><a href="${categoryPath(t.category)}">Read the ${esc(t.category.toLowerCase())} software selection guide</a>.</p><p><a href="/?category=${encodeURIComponent(t.category)}#discover">Use the interactive comparison</a> or explore other tools for this task:</p><ul>${related.map(x => `<li><a href="${toolPath(x)}">${esc(x.name)}</a> — ${esc(x.desc)}</li>`).join('')}</ul><p class="source-note">Source: <a href="${esc(t.source)}" rel="noopener noreferrer" target="_blank">official product / pricing information</a>. Accessed 16 October 2026. This is a sourced editorial summary, not a hands-on review. Check current plans with the vendor. Direct link; this static note has no configured affiliate relationship.</p>`;
  fs.writeFileSync(`dist/tools/${t.id}.html`, shell(title, t.desc, path, body, schema));
}
const categories = [...new Set(tools.map(t => t.category))];
const catalog = categories.map(c => `<h2><a href="${categoryPath(c)}">${esc(c)}</a></h2><ul>${tools.filter(t => t.category === c).map(t => `<li><a href="${toolPath(t)}">${esc(t.name)}</a> — ${esc(t.desc)}</li>`).join('')}</ul>`).join('');
const catalogTitle = 'Software Tools for Freelancers & Small Teams | Warez.co.il';
const catalogDescription = 'Browse 24 software tools for productivity, design, marketing, automation, operations and sales. Compare uses, cost models and tradeoffs.';
const catalogSchema = pageSchema(catalogTitle, catalogDescription, '/tools/', { '@type': 'CollectionPage', mainEntity: listing });
catalogSchema['@graph'].push(breadcrumb('Software tools', '/tools/'));
fs.writeFileSync('dist/tools/index.html', shell(catalogTitle, catalogDescription, '/tools/', `<nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a> / Software tools</nav><div class="eyebrow">THE TOOLBOX / ALL NOTES</div><h1>Software tools for small teams.</h1><p>Independent software notes, organized by the job you need to do. Use the <a href="/#discover">interactive directory</a> to filter, save, and compare.</p>${catalog}`, catalogSchema));
// Reuse the existing editorial guides; do not invent reviews or ratings.
const app = fs.readFileSync('dist/app.js', 'utf8');
const guideMatch = app.match(/const guides=(\{.*?\});\nfunction guide/s);
if (!guideMatch) throw new Error('Could not find editorial guide source');
const guides = vm.runInNewContext('(' + guideMatch[1] + ')');
const guidePaths = { free: '/guides/hidden-cost-free-plans', israel: '/guides/software-checklist-israeli-teams', automation: '/guides/automate-repetitive-work' };
fs.mkdirSync('dist/guides', { recursive: true });
for (const [key, g] of Object.entries(guides)) {
  const path = guidePaths[key];
  const description = g.body.match(/<p>(.*?)<\/p>/s)[1].replace(/<[^>]*>/g, '');
  const schema = pageSchema(g.title, description, path);
  schema['@graph'].push({ '@type': 'Article', headline: g.title, description, mainEntityOfPage: origin + path, author: publisher, publisher, inLanguage: 'en', datePublished: '2026-10-16' }, breadcrumb(g.title, path, 'Field notes', '/guides/'));
  const body = `<nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/guides/">Field notes</a> / ${esc(g.title)}</nav><div class="eyebrow">FIELD NOTES / ENGLISH EDITION</div><h1>${esc(g.title)}</h1>${g.body.replace(/<h3>/g, '<h2>').replace(/<\/h3>/g, '</h2>')}<p class="source-note">Warez editorial guidance · 16 October 2026 · General decision support, not a vendor review.</p><h2>More field notes</h2><ul>${Object.entries(guides).filter(([k]) => k !== key).map(([k, value]) => `<li><a href="${guidePaths[k]}">${esc(value.title)}</a></li>`).join('')}</ul><p><a href="/tools/">Explore the software directory</a></p>`;
  fs.writeFileSync(`dist${path}.html`, shell(`${g.title} | Warez.co.il`, description, path, body, schema));
}
const guideDescription = 'Practical software buying and workflow guides for freelancers, small businesses and Israeli teams.';
fs.writeFileSync('dist/guides/index.html', shell('Software Buying & Workflow Guides | Warez.co.il', guideDescription, '/guides/', `<nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a> / Field notes</nav><h1>Choose software with context.</h1><p>${guideDescription}</p><ul>${Object.entries(guides).map(([key, g]) => `<li><a href="${guidePaths[key]}">${esc(g.title)}</a></li>`).join('')}</ul>`, pageSchema('Software Buying & Workflow Guides', guideDescription, '/guides/', { '@type': 'CollectionPage' })));
const guideIndex = 'dist/guides/index.html';
for (const g of gear.sections) {
  const gearSchema = pageSchema(g.title, g.description, g.guidePath);
  gearSchema['@graph'].push(breadcrumb(g.title, g.guidePath, 'Field notes', '/guides/'));
  gearSchema['@graph'].push({ '@type':'Article', headline:g.title, description:g.description, author:publisher, publisher, datePublished:g.date, dateModified:g.date, image:g.products.map(p=>p.image), mainEntityOfPage:origin+g.guidePath });
  gearSchema['@graph'].push({ '@type':'ItemList', name:g.title, numberOfItems:g.products.length, itemListElement:g.products.map((p,i)=>({'@type':'ListItem',position:i+1,name:p.name,url:origin+g.guidePath+'#'+p.asin})) });
  const html = shell(g.title + ' | Warez.co.il', g.description, g.guidePath, `<nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/guides/">Field notes</a> / ${esc(g.label)}</nav><div class="eyebrow">THE WAREZ EDIT / WORK GEAR</div><h1>${esc(g.title)}</h1>${g.body}`, gearSchema);
  fs.writeFileSync('dist' + g.guidePath + '.html', html.replace('</head>', `<meta property="og:image" content="${esc(g.products[0].image)}"><meta name="twitter:image" content="${esc(g.products[0].image)}"></head>`));
}
fs.writeFileSync(guideIndex, fs.readFileSync(guideIndex, 'utf8').replace('</ul>', gear.sections.map(g=>`<li><a href="${g.guidePath}">${esc(g.title)}</a></li>`).join('')+'</ul>'));
// Category pages support a real selection task, with distinct criteria and source-linked tool notes.
const categoryNotes = {
  Productivity: { intro: 'Choose a place for tasks, documents, or personal knowledge before moving your whole team. A task board, a shared workspace, and a local notes library solve different problems.', checks: ['Try one actual project with the people who will maintain it. Check ownership, permissions, search, and the amount of setup required.', 'Export a sample document and task list before committing. Check how much version history and guest access your workflow needs.'], guide: 'free' },
  Design: { intro: 'Match the design tool to the deliverable. Marketing graphics, interface prototypes, and detailed raster editing need different workflows; one application does not have to do every job.', checks: ['Open a real client file, edit it, and export the exact format the recipient needs. Test fonts, transparency, and mixed Hebrew and English text.', 'Confirm who needs an editing seat, whether templates or assets require a separate license, and how feedback reaches the designer.'], guide: 'free' },
  Automation: { intro: 'Start with a repeatable handoff: a form submission, a task, and a notification. Compare the connectors, error handling, and operating effort before expanding the workflow.', checks: ['Use test records to check missing fields, duplicate events, and expired connections. Assign someone to review failures.', 'Estimate normal and peak monthly volume using each provider’s billing unit. Include hosting and maintenance when considering a self-hosted option.'], guide: 'automation' },
  Operations: { intro: 'Choose tools around the administrative bottleneck you need to remove. Forms, scheduling, password management, time tracking, and video calls have separate requirements.', checks: ['Follow one complete client interaction from intake to appointment and project handoff. Check timezones, exports, and the permissions each participant needs.', 'Document account recovery and data ownership. Compare team controls and reporting requirements with the current vendor plans.'], guide: 'israel' },
  Marketing: { intro: 'Decide whether your main job is a customer newsletter, a publishing business, or a social content calendar. Choose the workflow first, then compare growth limits and reporting.', checks: ['List your current audience size, expected sends, and publishing channels. Compare costs at today’s volume and at twice that level.', 'Test contact import and export, consent records, unsubscribe handling, and the approval process for a draft campaign.'], guide: 'free' },
  Sales: { intro: 'A useful CRM makes the next customer action clear. Start with contacts, pipeline stages, and ownership before adding complex automation or marketing features.', checks: ['Import a small test dataset, record a conversation, and move a lead through your actual stages. Check duplicate handling and export quality.', 'Separate essential seats and reports from optional hubs, onboarding, and integrations. Ask how the bill changes as contacts and users grow.'], guide: 'free' }
};
fs.mkdirSync('dist/categories', { recursive: true });
for (const category of categories) {
  const path = categoryPath(category), note = categoryNotes[category];
  const selected = tools.filter(t => t.category === category);
  const title = `${category} Software for Freelancers & Small Teams | Warez.co.il`;
  const description = `Compare ${selected.length} ${category.toLowerCase()} tools by use case, cost model, and tradeoffs. Practical selection criteria for freelancers and small teams.`;
  const schema = pageSchema(title, description, path, { '@type': 'CollectionPage', mainEntity: { '@type': 'ItemList', numberOfItems: selected.length, itemListElement: selected.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.name, url: origin + toolPath(t) })) } });
  schema['@graph'].push(breadcrumb(category + ' software', path));
  const body = `<nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/tools/">Software tools</a> / ${esc(category)}</nav><div class="eyebrow">SOFTWARE BY TASK</div><h1>${esc(category)} software for small teams</h1><p>${esc(note.intro)}</p><h2>What to compare before choosing</h2><ul>${note.checks.map(c => `<li>${esc(c)}</li>`).join('')}</ul><h2>Explore the shortlist</h2>${selected.map(t => `<section><h3><a href="${toolPath(t)}">${esc(t.name)}</a></h3><p>${esc(t.desc)}</p><p><strong>Useful for:</strong> ${esc(t.best)}<br><strong>Cost model:</strong> ${esc(t.model)}<br><strong>Check first:</strong> ${esc(t.watch)}</p></section>`).join('')}<h2>Put the choice in context</h2><p><a href="${guidePaths[note.guide]}">${esc(guides[note.guide].title)}</a>. Use the <a href="/?category=${encodeURIComponent(category)}#discover">interactive directory</a> to make a shortlist.</p><p class="source-note">Editorial summaries, not hands-on tests or rankings. Read the linked tool notes for official vendor sources and verify current plans. <a href="/about">How we select tools</a>.</p><h2>Other software categories</h2><ul>${categories.filter(c => c !== category).map(c => `<li><a href="${categoryPath(c)}">${esc(c)}</a></li>`).join('')}</ul>`;
  fs.writeFileSync(`dist${path}.html`, shell(title, description, path, body, schema));
}
const aboutTitle = 'About Warez.co.il & Our Editorial Methodology';
const aboutDescription = 'How Warez.co.il selects software for freelancers and small teams, uses official sources, and discloses affiliate links and sponsorships.';
fs.writeFileSync('dist/about.html', shell(aboutTitle, aboutDescription, '/about', `<nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a> / About</nav><h1>About Warez.co.il</h1><p>Warez.co.il is an independent software discovery project for freelancers and small businesses, with practical context for Israeli teams. The directory helps readers build a shortlist by comparing use cases, cost models, and tradeoffs.</p><h2>How the shortlist works</h2><p>We select tools for a clear small-business task, an official product destination, and a range of cost and ownership models. The collection is deliberately small and does not represent the entire market. Inclusion is editorial judgment, not a numerical ranking.</p><h2>Sources and limitations</h2><p>Software notes summarize official vendor information and link to their sources. They are editorial summaries, not hands-on reviews, security audits, or certifications. Dates on individual notes describe when their sources were checked; current prices, eligibility, and features must be verified with the vendor.</p><h2>Local context and language</h2><p>The core directory supports English and Hebrew navigation. Extended guides remain in English. We encourage readers to test Hebrew input, right-to-left exports, billing currency, and timezone settings in their own workflows. Listings do not certify suitability for Israeli accounting or legal requirements.</p><h2>Commercial disclosure</h2><p>As an Amazon Associate, Warez.co.il earns from qualifying purchases. Amazon links in the work-gear and digital-book sections are affiliate links and are labeled. Software notes currently link directly to vendors without configured affiliate relationships. Any future sponsored placement must be clearly labeled; product names and listings do not imply a partnership.</p><h2>Explore the publication</h2><ul><li><a href="/tools/">Browse all software notes</a></li><li><a href="/guides/">Read the buying and workflow guides</a></li><li><a href="/#partners">Partnership information</a></li></ul>`, pageSchema(aboutTitle, aboutDescription, '/about', { '@type': 'AboutPage' })));

// This catalogue stays in source HTML even when JavaScript filters the interactive grid.
let home = fs.readFileSync('dist/index.html', 'utf8');
home = home.replace(/<!-- DESK-ESSENTIALS-START -->.*?<!-- DESK-ESSENTIALS-END -->/s, `<!-- DESK-ESSENTIALS-START -->${gear.home}<!-- DESK-ESSENTIALS-END -->`);
home = home.replace(/href="\/?styles\.css(?:\?v=[a-f0-9]+)?"/, `href="/styles.css?v=${styleVersion}"`);
if (!home.includes('<!-- DIGITAL-PICKS-START -->')) home = home.replace('<div class="category-tabs"', '<!-- DIGITAL-PICKS-START --><!-- DIGITAL-PICKS-END --><div class="category-tabs"');
home = home.replace(/<!-- DIGITAL-PICKS-START -->.*?<!-- DIGITAL-PICKS-END -->/s, `<!-- DIGITAL-PICKS-START -->${gear.digitalHome}<!-- DIGITAL-PICKS-END -->`);
const homeCatalog = `<details class="static-catalog"><summary>Browse all software tools by category</summary><p>Explore independent notes on ${tools.length} tools for freelancers and small teams.</p>${catalog}</details>`;
home = home.replace('<button data-legal=\"about\" data-t=\"about\">About & methodology</button>', '<a href=\"/about\" data-t=\"about\">About & methodology</a>');
home = home.replace(/<!-- SEO-CATALOG-START -->.*?<!-- SEO-CATALOG-END -->/s, `<!-- SEO-CATALOG-START -->${homeCatalog}<!-- SEO-CATALOG-END -->`);
const homeSchema = pageSchema(catalogTitle, 'Discover and compare software for freelancers and small teams, with practical context for Israeli businesses.', '/', { mainEntity: listing });
homeSchema['@graph'].push({ '@type':'ItemList', name:'Digital books for freelancers and small teams', numberOfItems:gear.digitalProducts.length, itemListElement:gear.digitalProducts.map((p,i)=>({'@type':'ListItem',position:i+1,item:{'@type':'Book',name:p.name,author:{'@type':'Person',name:p.author},bookFormat:'https://schema.org/EBook',inLanguage:'en',image:p.image,url:`https://www.amazon.com/dp/${p.asin}?tag=warezcoil-20`}})) });
home = home.replace(/<!-- SEO-SCHEMA-START -->.*?<!-- SEO-SCHEMA-END -->/s, `<!-- SEO-SCHEMA-START --><script type="application/ld+json">${json(homeSchema)}</script><!-- SEO-SCHEMA-END -->`);
const appVersion = require('node:crypto').createHash('sha256').update(app).digest('hex').slice(0,12);
home = home.replace(/src="\/?app\.js(?:\?v=[a-f0-9]+)?"/, 'src="/app.js?v=' + appVersion + '"');
fs.writeFileSync('dist/index.html', home);
const urls = ['/', '/about', ...categories.map(categoryPath), '/tools/', ...tools.map(toolPath), '/guides/', ...Object.values(guidePaths), ...gear.sections.map(g=>g.guidePath)];
fs.writeFileSync('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(path => `<url><loc>${origin}${path}</loc></url>`).join('')}</urlset>\n`);
// Public ownership proof for IndexNow; no account access is granted by this key.
fs.writeFileSync('dist/bf058a3c81350b2cc5b34815416ec48c.txt', 'bf058a3c81350b2cc5b34815416ec48c');
fs.writeFileSync('dist/robots.txt', `User-agent: *\nAllow: /\nDisallow: /analytics\nSitemap: ${origin}/sitemap.xml\n`);
// A top-level 404 prevents Pages from returning the homepage with HTTP 200 for missing URLs.
fs.writeFileSync('dist/404.html', '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page Not Found | Warez.co.il</title><meta name="robots" content="noindex,follow"><link rel="stylesheet" href="/styles.css"></head><body><main class="wrap" style="padding-block:90px;max-width:760px"><p class="eyebrow">WAREZ / 404</p><h1>That page is not here.</h1><p>The address may have changed. Browse our software directory or return to the homepage.</p><p><a class="dark" href="/">Warez home ↗</a> <a href="/tools/">Browse all software tools</a></p></main></body></html>\n');
console.log(`Generated ${urls.length} canonical pages, sitemap, robots.txt and 404 page.`);

// Build the private analytics worker and attach the same first-party tracker to every public page.
const trackerTag = '<script defer src="/_stats/tracker.js"></script>';
function trackDirectory(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = dir + '/' + entry.name;
    if (entry.isDirectory()) trackDirectory(file);
    else if (entry.name.endsWith('.html')) {
      let content = fs.readFileSync(file, 'utf8').replaceAll(trackerTag, '');
      fs.writeFileSync(file, content.replace('</head>', trackerTag + '</head>'));
    }
  }
}
trackDirectory('dist');
fs.writeFileSync('dist/_worker.js', 'const TRACKER_JS=' + JSON.stringify(fs.readFileSync('analytics-tracker.js','utf8')) + ';\nconst DASHBOARD_HTML=' + JSON.stringify(fs.readFileSync('analytics-ui.html','utf8')) + ';\n' + fs.readFileSync('analytics-worker.mjs','utf8'));
fs.writeFileSync('dist/_routes.json', JSON.stringify({ version:1, include:['/analytics','/analytics/*','/_stats/*'], exclude:[] }));
