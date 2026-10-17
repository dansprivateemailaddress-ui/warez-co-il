# Warez.co.il

A static software discovery website for independent businesses. No framework, package installation, database, or paid API is required. Serve `dist/` from any static host.

## Cloudflare Pages deployment

- Repository: `dansprivateemailaddress-ui/warez-co-il`
- Production branch: `main`
- Framework preset: None
- Build command: `node generate-pages.cjs`
- Build output directory: `dist`
- Root directory: repository root

Cloudflare automatically deploys commits to `main` to https://warez.co.il. The www hostname redirects permanently to the HTTPS apex, preserving paths and query strings. The dependency-free Node build refreshes the tool pages, field notes, homepage catalogue, metadata, sitemap, robots.txt and 404 page. Generated files are build outputs: edit `dist/data.js`, the guide content in `dist/app.js`, or `generate-pages.cjs` rather than editing generated tool/guide HTML directly.

## Run

Run `node generate-pages.cjs` first. Then, from `dist/`, run `python -m http.server 8765` and open http://localhost:8765. ES scripts are ordinary deferred browser scripts.

## Edit

- `dist/data.js`: 24 editorial product records and official source URLs.
- `dist/config.js`: verified contact destinations, approved affiliate URLs, proposed sponsor price.
- `dist/index.html`, `styles.css`, `app.js`: main interface and behavior.
- `generate-pages.cjs`: generates crawlable pages, canonical URLs, structured data, sharing metadata, related tool links, sitemap and 404 page. Preserve the SEO marker comments in `dist/index.html`.

Core interface and product summaries support English/Hebrew and RTL. Extended editorial notes, source citations, plan model labels, legal text and some illustrations remain in English. This is bilingual navigation and discovery, not a fully localized publication.

## Real functionality

Search across names, descriptions, Hebrew summaries, categories and tags; category/free filters; alphabetical sort; expansion to 24 tools; local saved shortlist; 2–3 tool comparison; starter stacks; editorial guides; sponsorship brief download; local-data erasure; crawlable static tool pages. Preferences stay in browser local storage. No data is sent by the sponsorship form: it downloads a text brief.

## Monetization setup

There is no active revenue integration at launch. No money can flow until the owner configures an actual commercial route, gets partner approval, and attracts converting visitors.

1. Choose a verified business email or hosted inquiry form. Set `contactEmail` or an HTTPS `sponsorFormUrl` in `dist/config.js`. These appear in the partnership dialog. Do not invent a mailbox.
2. Apply for relevant vendor partner programs and read eligibility, attribution, territorial and promotional terms. Research found explicit partner-program routes at iCount and EasyCount; these are prospects, not current partnerships.
3. Add only approved referral URLs keyed by tool ID to `affiliateLinks`. The interactive tool dialog will disclose affiliate compensation and apply `rel=sponsored`. Static product notes remain direct vendor links; update them intentionally if adding affiliates there.
4. Sponsor proposal defaults to ILS 490 / 30 days, a proposed launch rate rather than validated market pricing. Confirm audience fit, actual deliverable, display period, payment/refund terms, and reporting with each advertiser. Do not promise conversions. Do not accept payment until a placement can actually be delivered.
5. Implement any real sponsor placement with an explicit `Sponsored` label. The current placeholder says future placement and is not a paid listing.
6. Use an external invoicing/payment provider the owner can legally operate, after agreeing terms. This static website does not collect payments or issue tax documents.

## Existing hosting

Back up the current document root. Upload CONTENTS of `dist/` into the hosting document root (`public_html`, `www`, or equivalent), preserving the `tools/` folder. This is a static site and needs no PHP rewrite rules or Node server. Keep HTTPS enabled. The live domain is connected to the GitHub-backed Cloudflare Pages project.

`sitemap.xml` and `robots.txt` target https://warez.co.il. Change them if the final canonical hostname differs. After deployment submit sitemap through the owner's search console. The static catalogue, 24 vendor notes and three editorial guides are crawlable; interactive filters/comparisons are browser-local. There are no fake structured reviews or ratings.

## Launch and growth

Before public launch: set a verified contact, confirm business identity/required policies with local advice, test your actual domain and SSL, check every vendor's current plans, and decide whether a fully Hebrew editorial edition is needed. The privacy notice describes this launch implementation; update it before adding analytics, tracking, a form processor or a mailing list.

First month: publish genuinely useful comparisons for a narrow Israeli freelance workflow, interview target users, and submit partner applications. Bring qualified traffic through original guides and relevant communities where promotion is permitted. No outreach is sent by this project. Validate click-through and partner conversions before expanding inventory.

Review vendor content monthly and whenever feedback identifies a change. The research and initial directory date is 16 October 2026. No automated freshness process is scheduled. Sponsorship, affiliate approval, traffic and revenue are never guaranteed.

## Checks

`node --check dist/app.js` and `node --check dist/data.js` validate syntax. Browser QA covers search, reset, comparison limit, saved persistence, language/RTL, mobile layout, sponsor form and local download. All styling uses CSS/vector typography; no external image downloads or copied competitor content are included. Google Fonts is optional and system-font fallbacks are provided.

## SEO conventions

Use `https://warez.co.il/` as the preferred origin. Canonicals, internal links and sitemap entries use extensionless tool/guide URLs and trailing slashes for directory indexes. Cloudflare Pages redirects `.html` and `index.html` forms automatically. The www-to-apex redirect is configured in the zone Ruleset phase `http_request_dynamic_redirect`. Preserve queries and paths when changing it.

The language toggle is browser-local and is not a separate Hebrew URL. Do not add hreflang claims until complete, independently addressable translations exist. Structured data describes actual pages and editorial lists; do not add invented review ratings, partner relationships or product prices. Submit `https://warez.co.il/sitemap.xml` in the owner’s Google Search Console after ownership verification; no account or indexing submission is configured by this source change.


## Private analytics

Visit https://warez.co.il/analytics and use the owner password. Authentication is handled server-side with an eight-hour secure session. Credentials live in Cloudflare production secrets, never in this repository. The build attaches the first-party tracker to every public HTML page and bundles the Pages worker.

Required production bindings: `ANALYTICS_DB` (D1), `ANALYTICS_SECRET` (random HMAC secret), and `ANALYTICS_PASSWORD_HASH` (hex salt + colon + PBKDF2 SHA-256, 100000 iterations, 32 bytes). Database schema is in analytics-schema.sql. Rotate the session secret to invalidate all logins.

Traffic starts at installation. Daily visitor estimates are not identifiable people. Raw IPs and browser strings are not retained. Events expire after 90 days; cleanup runs opportunistically during collection. DNT, GPC and the privacy dialog opt-out stop tracking. Search Console query CSV imports are manual snapshots, separate from automatically tracked UTM terms and on-site searches.

### Changing the owner password

Inside analytics, choose **Settings → Change password**. Supply the current password and a matching new password of 12–256 characters. Only salted PBKDF2 hashes are saved in the private D1 `analytics_auth` table; the plaintext password is never logged or committed. A version change invalidates all existing analytics sessions. Password changes require authentication, same-origin requests, current-password verification and attempt limiting. The Cloudflare hash is a bootstrap credential only and stops working after the first owner password change. Back up the authentication row with the database and do not remove it during routine schema updates or redeploys.
