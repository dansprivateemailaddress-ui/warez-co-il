# Warez.co.il

A buildless software discovery website for independent businesses. No framework, package installation, database, or paid API is required. Serve `dist/` from any static host.

## Cloudflare Pages deployment

- Repository: `dansprivateemailaddress-ui/warez-co-il`
- Production branch: `main`
- Framework preset: None
- Build command: leave empty
- Build output directory: `dist`
- Root directory: repository root

Connect this repository in Cloudflare Pages to deploy future commits automatically. All static pages are checked in; no build or package installation is needed. Custom domain setup is a separate step after the first successful deployment.

## Run

From `dist/`, run `python -m http.server 8765` and open http://localhost:8765. ES scripts are ordinary deferred browser scripts.

## Edit

- `dist/data.js`: 24 editorial product records and official source URLs.
- `dist/config.js`: verified contact destinations, approved affiliate URLs, proposed sponsor price.
- `dist/index.html`, `styles.css`, `app.js`: main interface and behavior.
- `generate-pages.cjs`: regenerate crawlable product notes, catalog, sitemap and robots with `node generate-pages.cjs` after data changes.

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

Back up the current document root. Upload CONTENTS of `dist/` into the hosting document root (`public_html`, `www`, or equivalent), preserving the `tools/` folder. This is a static site and needs no PHP rewrite rules or Node server. Keep HTTPS enabled. The private preview is independent of the domain and does not change DNS or existing hosting.

`sitemap.xml` and `robots.txt` target https://warez.co.il. Change them if the final canonical hostname differs. After deployment submit sitemap through the owner's search console. The static catalog and 24 vendor notes are crawlable; interactive filters/comparisons are browser-local. There are no fake structured reviews or ratings.

## Launch and growth

Before public launch: set a verified contact, confirm business identity/required policies with local advice, test your actual domain and SSL, check every vendor's current plans, and decide whether a fully Hebrew editorial edition is needed. The privacy notice describes this launch implementation; update it before adding analytics, tracking, a form processor or a mailing list.

First month: publish genuinely useful comparisons for a narrow Israeli freelance workflow, interview target users, and submit partner applications. Bring qualified traffic through original guides and relevant communities where promotion is permitted. No outreach is sent by this project. Validate click-through and partner conversions before expanding inventory.

Review vendor content monthly and whenever feedback identifies a change. The research and initial directory date is 16 October 2026. No automated freshness process is scheduled. Sponsorship, affiliate approval, traffic and revenue are never guaranteed.

## Checks

`node --check dist/app.js` and `node --check dist/data.js` validate syntax. Browser QA covers search, reset, comparison limit, saved persistence, language/RTL, mobile layout, sponsor form and local download. All styling uses CSS/vector typography; no external image downloads or copied competitor content are included. Google Fonts is optional and system-font fallbacks are provided.
