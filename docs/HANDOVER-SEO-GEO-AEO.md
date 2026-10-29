# Handover: SEO, GEO and AEO for casaabdulrahim.in

Prepared on 29 October 2026 for the external specialist taking over organic growth of https://casaabdulrahim.in, the website of CA S. A. Abdul Rahim, Chartered Accountant, Adyar, Chennai.

All figures in this document were taken from the repository and from a fresh `npm run build` and `npm run check:all` run on 29 October 2026 (196 pages built, all five checks passing). Where a statement comes from the owner and not from the repository, it is marked "per the owner". Where something could not be verified from the repository, it is said so.

## Contents

1. Summary and access
2. Non-negotiable rules
3. Site inventory
4. Technical SEO as built
5. AEO and GEO as built, and recommended next steps
6. How to work on the codebase safely
7. Pending owner actions and the 30/60/90-day plan
8. Known limitations, inconsistencies and open questions
9. Appendix: the 165 calculator URLs by category

---

## 1. Summary and access

### 1.1 What exists

casaabdulrahim.in is a static website for a single-practitioner Chartered Accountant's office. It is built with Astro 7 (installed version 7.4.4) in static output mode, plain CSS, self-hosted fonts and one small script. It has no database, no forms, no cookies and no analytics. The only dynamic part is a set of 165 browser-side calculators (React, rendered client-side) ported from the owner's other site's toolkit with the original branding, team names, WhatsApp booking links and reminder sign-up form removed.

| Item | Value |
|---|---|
| Live URL (canonical) | https://casaabdulrahim.in/ (apex, https, trailing slash on every page URL) |
| Pages built | 196 files (195 indexable URLs in the sitemap plus the 404 page) |
| Hosting | Vercel, Hobby plan, project "casaabdulrahim" (per the owner) |
| Source repository | https://github.com/contactmihassociates/CA-S.-A.-Abdul-Rahim, branch `main` (per the owner: currently public, and the owner has been advised to make it private) |
| Deployment | Every push to `main` triggers a Vercel build with `npm run build`, output directory `dist` |
| DNS | GoDaddy: A record `@` to 216.198.79.1, CNAME `www` to Vercel (per the owner). `www` redirects to the apex with a 308; http redirects to https |
| TLS | Let's Encrypt certificate issued through Vercel (per the owner) |
| Email | enquiry@casaabdulrahim.in, a GoDaddy/Titan mailbox. MX, SPF, DKIM and DMARC (p=quarantine) are already set (per the owner) |
| Google Business Profile | Exists. Maps CID 16323173430388216385. Latitude 13.0003461, longitude 80.2571196 |
| Git history | See git log on main; the calculators and redesign were committed and deployed on 29 October 2026 |

### 1.2 State of the working tree at handover

At the time of writing the working tree contains work that is not in the last commit. `git status` shows 19 modified files (including `src/data/site.ts`, `src/layouts/Base.astro`, `src/layouts/Service.astro`, `src/pages/index.astro`, `src/pages/llms.txt.ts`, `src/pages/sitemap.xml.ts`, `src/styles/global.css`, `public/js/site.js`, `scripts/check-pages.mjs`) and a set of new, untracked paths: `toolkit/`, `public/toolkit/`, `scripts/build-toolkit.mjs`, `scripts/check-tools.mjs`, `scripts/serve-dist.mjs`, `src/data/tools.ts`, `src/data/tools.json`, `src/data/tool-copy.json`, `src/pages/tools/`, and three components (`Icon`, `PageHero`, `SideContact`). In other words, the calculator section and the redesign described in this document may not be live until the owner or the engineer commits and pushes. Another engineer is still polishing CSS and layout files in parallel.

How to confirm what is live: open https://casaabdulrahim.in/sitemap.xml. After the current build is deployed it lists 195 URLs, including `/tools/` and 165 `/tools/<key>/` pages. If it lists fewer, the calculator release has not been pushed. Do not assume; check before reporting on indexation.

### 1.3 Who to ask for what

| Need | Who | Notes |
|---|---|---|
| Any professional or factual question (law, section numbers, due dates, ICAI membership number, landmarks) | CA S. A. Abdul Rahim | He is the final authority on every statement on the site |
| Google Search Console, Bing Webmaster Tools, Google Business Profile, GoDaddy DNS, Vercel and GitHub logins | The owner | No logins are held by the specialist. Ask for delegated access (GSC "Full" user, GBP "Manager", GitHub collaborator or pull-request route) rather than shared passwords |
| GA4 measurement ID | The owner | Not yet created; see section 7 |
| Code or layout questions | The engineer currently working on CSS and layout | Do not change layout or CSS files without coordinating |

### 1.4 What the specialist can and cannot change

| Area | Position |
|---|---|
| Page copy, titles, descriptions, FAQs, internal links, structured data, llms.txt, sitemap, robots.txt | May change, subject to the rules in section 2 and after `npm run build && npm run check:all` passes |
| Calculator page copy in `src/data/tool-copy.json` | May and should improve it by hand (see 6.5), with a CA check on any statement of law |
| NAP (name, address, phones, email, hours) | Never change. Source of truth is `src/data/site.ts`; it must match Google Business Profile exactly |
| `[VERIFY]` and `[CONFIRM]` markers | Do not remove or "resolve" by guessing; only the owner or the CA can supply the fact |
| `vercel.json` (headers, CSP, redirects) | Change only with the owner's agreement; every change to the Content Security Policy has security consequences (4.9) |
| The calculators' interactive logic (`toolkit/`) | Out of scope for SEO work; changes need a CA check of the tax logic |
| Layout, CSS (`src/styles/global.css`, components) | Currently being edited by another engineer; coordinate first |
| Anything that appears on the site to promote the firm | Only within ICAI rules (section 2) |

---

## 2. Non-negotiable rules

These override every SEO, GEO and AEO tactic. They come from the ICAI advertising guidelines as the owner has applied them to this site. This document summarises the owner's instructions; it is not legal advice, and the CA decides any doubtful case.

### 2.1 ICAI conduct rules for the website

- No solicitation. No calls to action that invite work ("hire us", "book now", "contact us today for the best service").
- No superlatives or claims of superiority: best, leading, top, expert, No. 1, guaranteed, and the like.
- No testimonials, client reviews or star ratings on the site or in structured data. No `aggregateRating` or `review` markup of any kind.
- No fees, prices, discounts or "free consultation" offers.
- No comparison with other firms or with other professionals.
- No logo or monogram for the firm.
- No advertisements or paid promotion in the CA's name (this includes paid search, paid social and sponsored listings).
- No promised outcomes.
- No lead-capture popups, and no forms (the site deliberately has none).
- Educational content is allowed: general information, explainers, calculators and guides, always with official sources and a "general information only" notice.
- Genuine Google reviews from clients are allowed only through a neutral request: no incentive, no scripted text, no selection of who is asked. They must never be displayed or marked up on the site.

### 2.2 The banned-word list (exact, from `scripts/check-banned.mjs`)

The build check fails if any of these appear, case-insensitively and as whole words, in the title, meta description, visible text or JSON-LD of any built HTML page:

`best`, `leading`, `top`, `expert`, `experts`, `No. 1` (pattern `No\. ?1`, so both "No. 1" and "No.1"), `number one`, `guaranteed`, `guarantee`, `cheapest`, `free consultation`, `why choose us`, `testimonial`, `testimonials`, `review`, `reviews`, `rating`, `discount`, `price`, `prices`, `pricing`, `hire us`, `book now`, `limited offer`, `trusted by`.

Points the specialist must understand about this check:

- It is a floor, not the full rule. It does not catch other promotional wording such as "premier", "foremost", "renowned", "specialist", "highest", "trusted" (without "by"), "affordable", "unmatched" or "proven". Apply the rule in 2.1 yourself, not only the list.
- Whole-word matching means "Last reviewed" passes ("reviewed" is not "review") and "ratings" would pass ("rating" only). Do not use these as loopholes; avoid the idea, not only the word.
- It scans built `.html` files only. It does not scan `llms.txt`, `sitemap.xml` or `robots.txt`, so apply the same discipline there. (A manual search of the current `llms.txt` found none of the listed words.)
- Do not add the specialist's own work to the exclusion logic. If the check fails, change the content.

### 2.3 NAP: character-identical everywhere

| Field | Exact value |
|---|---|
| Name | CA S. A. Abdul Rahim |
| Person name in schema | S. A. Abdul Rahim |
| Address | 14/2, 15th Cross Street, Shastri Nagar, Adyar, Chennai, Tamil Nadu 600020 |
| Primary phone | 07397 283 223 (`+917397283223`) |
| Other phone | 099402 78603 (`+919940278603`) |
| WhatsApp | +91 99402 78603 |
| Email | enquiry@casaabdulrahim.in |
| Hours | Monday to Saturday, 8:00 am to 8:00 pm. Sunday closed. (Schema: 08:00 to 20:00, Monday to Saturday) |
| Languages | Tamil, English, Hindi |
| In practice since | 12 April 1985 |

Never use the numbers 094447 97222 or 095510 78603 anywhere. `scripts/check-nap.mjs` fails the build if either appears in any built `.html`, `.txt`, `.xml`, `.js` or `.json` file, and also fails if a page lacks the exact name, address and primary phone in visible text, or the name, telephone, street and postcode in its JSON-LD.

The same strings must be used on Google Business Profile, Bing Places, Apple Business Connect, Justdial, Sulekha and every other listing. Do not abbreviate "Street", add "No.", change "Tamil Nadu" to "TN", reorder lines or format the phone differently from the table above.

### 2.4 Structured data restrictions

No `aggregateRating`, `review`, `Review`, `priceRange`, `logo` or offers/pricing markup. `scripts/check-jsonld.mjs` fails on any `aggregateRating` or `review` key. Do not add `memberOf` or `hasCredential` for ICAI until the membership number is confirmed by the CA.

### 2.5 The [VERIFY] and [CONFIRM] policy

There are 53 visible markers in the built HTML (45 `[VERIFY]`, 8 `[CONFIRM]`) on 24 pages. `npm run check:all` lists the pages and counts at the end of `check-pages`. They mark facts that only the owner or the CA can supply: the ICAI membership number, landmarks near the office, travel directions and times, and a number of new-Act (Income-tax Act, 2025) section and form numbers and due dates.

Rules:

1. Do not remove a marker without a fact supplied by the CA, in writing.
2. Do not replace a marker with a guess, a figure from a third-party site, or a figure from an AI tool. If an official source (incometax.gov.in, incometaxindia.gov.in, gst.gov.in, cbic-gst.gov.in, mca.gov.in and similar) states the fact, send the CA the link and let him confirm.
3. When the CA confirms a fact, remove the `<V />` component from that sentence and update the review date (6.6).
4. Be aware that the markers are currently visible to the public and to crawlers on the live pages. Their presence is an honest signal to the owner; clearing them is a priority for both quality and AI-answer accuracy (section 7).

### 2.6 No invented facts, and scope exclusions

- Do not invent credentials, years of experience beyond "in practice since 12 April 1985", client numbers, awards, memberships, staff names or office photos.
- The Income-tax Act, 2025 replaced the Income-tax Act, 1961 from 1 April 2026 (tax year 2026-27). Use new section and form numbers only when verified against an official source and confirmed by the CA. Where unverified, the site uses wording such as "earlier section 54EC" or "check the current form".
- Out of scope by the owner's instruction: no pages for patta, encumbrance certificate (EC), sale deed, Fire NOC or legal heir certificates. Do not propose or build them.

---

## 3. Site inventory

### 3.1 Totals

| Group | Count | URL pattern |
|---|---|---|
| Home | 1 | `/` |
| About | 1 | `/about/` |
| Contact | 1 | `/contact/` |
| Areas and directions | 1 | `/areas/` |
| Service pages | 16 | listed in 3.2 |
| Guides hub | 1 | `/guides/` |
| Guides | 6 | `/guides/<slug>/` |
| Calculators hub | 1 | `/tools/` |
| Calculator pages | 165 | `/tools/<key>/` |
| Disclaimer | 1 | `/disclaimer/` |
| Privacy | 1 | `/privacy/` |
| 404 | 1 | `404.html` (not in the sitemap) |
| Total built | 196 | |
| In sitemap | 195 | everything above except the 404 |

Non-HTML files: `/robots.txt`, `/sitemap.xml` (generated), `/llms.txt` (generated), `/favicon.svg`, `/og-image.png` (1200 by 630, text only, no logo), `/fonts/*.woff2`, `/js/site.js`, and `/toolkit/*` (calculator code).

### 3.2 The 16 service pages

The "target query themes" below are inferred from each page's title, H1, description and FAQs as built. No keyword-research data exists in the repository; the specialist should validate and extend them with real search data.

| # | URL | Title tag (as built) | Target query themes |
|---|---|---|---|
| 1 | `/income-tax-return-filing-chennai/` | Income Tax Return (ITR) Filing in Chennai, Adyar | ITR filing Chennai/Adyar; ITR for salaried, pensioners, senior citizens, business, professionals, rental income; refunds |
| 2 | `/income-tax-notice-reply-chennai/` | Income Tax Notice Reply in Chennai, Adyar | income tax notice reply; demand notices; appeal before CIT(A); updated return |
| 3 | `/capital-gains-tax-property-sale/` | Capital Gains Tax on Property Sale, Chennai | capital gains on sale of house, flat, land; exemptions; reporting |
| 4 | `/nri-taxation-itr-chennai/` | NRI Income Tax and ITR Filing, Chennai | NRI income tax; residential status; NRI ITR filing |
| 5 | `/tds-on-property-purchase-26qb/` | TDS on Property Purchase: Form 141 (earlier 26QB) | TDS on property purchase; Form 26QB / Form 141; buying from an NRI |
| 6 | `/nri-property-sale-tds-lower-tds-certificate/` | NRI Property Sale TDS and Lower TDS Certificate | NRI property sale TDS; lower or nil TDS certificate; repatriation basics |
| 7 | `/tds-return-filing/` | TDS Return Filing in Chennai, Adyar | quarterly TDS return; TDS certificates; TRACES defaults |
| 8 | `/gst-registration-chennai/` | GST Registration in Chennai: Documents and Steps | GST registration Chennai; documents; portal steps |
| 9 | `/gst-return-filing/` | GST Return Filing in Chennai: GSTR-1, GSTR-3B | GST return filing; GSTR-1, GSTR-3B; annual return; ITC reconciliation |
| 10 | `/gst-notice-reply/` | GST Notice Reply in Chennai: Scrutiny and Audit | GST notice reply; scrutiny; assessment; audit |
| 11 | `/tax-audit/` | Tax Audit in Chennai: Who Needs It, What to Prepare | tax audit applicability; section 44AB; preparation |
| 12 | `/statutory-audit/` | Statutory Audit of Companies in Chennai | statutory audit of private limited companies; Companies Act, 2013 |
| 13 | `/accounting-bookkeeping/` | Accounting and Bookkeeping in Chennai (Tally) | accounting and bookkeeping; Tally; bank reconciliation; year-end closing |
| 14 | `/company-llp-registration-chennai/` | Company and LLP Registration in Chennai | private limited, LLP, partnership firm registration; ROC compliance |
| 15 | `/trust-ngo-12a-80g-registration/` | Trust and NGO Registration, 12A and 80G, Chennai | trust/society registration; 12A, 80G; ITR-7 and audit |
| 16 | `/udyam-msme-registration/` | Udyam (MSME) Registration in Chennai | Udyam registration; MSME classification; benefits |

Each service page has an answer-first lead paragraph, a "Who needs this" style structure, a due-date or requirements table where relevant, five FAQs (40 to 60 words each, enforced), a contact block, a sources list with official links, a "Last reviewed" line, a related-calculators card (from `SERVICE_TOOLS`) and a related-pages card. Word counts range from 763 (GST return filing) to 1,232 (ITR filing); the check requires at least 600.

### 3.3 The six guides

All carry the author byline "By CA S. A. Abdul Rahim, Chartered Accountant", a published date and a "Last reviewed" date (all 29 October 2026), four FAQs, and Article schema. The check requires 900 to 1,700 words.

| # | URL | H1 | Words |
|---|---|---|---|
| 1 | `/guides/documents-for-itr-filing-salaried-pensioners/` | Documents needed for ITR filing (salaried and pensioners) | 1,495 |
| 2 | `/guides/tds-on-property-purchase-50-lakh-step-by-step/` | TDS when you buy a property worth Rs 50 lakh or more: step by step | 1,405 |
| 3 | `/guides/nri-selling-property-chennai-tds-lower-certificate/` | NRI selling property in Chennai: TDS and lower TDS certificate | 1,404 |
| 4 | `/guides/gst-registration-documents-process/` | GST registration documents and process | 1,224 |
| 5 | `/guides/income-tax-notice-first-steps/` | Received an income tax notice: first steps | 1,272 |
| 6 | `/guides/tax-audit-who-needs-it-what-to-prepare/` | Tax audit: who needs it and what to prepare | 1,231 |

The guides hub `/guides/` (226 words) lists the six guides and links to all 16 service pages.

### 3.4 Other pages

| URL | Title tag | H1 | Notes |
|---|---|---|---|
| `/` | CA S. A. Abdul Rahim, Chartered Accountant in Adyar | CA S. A. Abdul Rahim, Chartered Accountant in Adyar, Chennai | 1,085 words; services by group, ten popular calculators, map embed; no FAQ block |
| `/about/` | About CA S. A. Abdul Rahim, Chartered Accountant | About CA S. A. Abdul Rahim, Chartered Accountant in Chennai | Fact table; ICAI line and membership number are `[CONFIRM]` |
| `/contact/` | Contact CA S. A. Abdul Rahim, Adyar, Chennai | same as title | NAP, hours, map embed, three route descriptions marked `[CONFIRM]` |
| `/areas/` | CA Office near Adyar: Areas Served and Directions | Areas served and how to reach the CA office in Adyar | 20 areas, distances and times (marked `[CONFIRM]`), landmark placeholder |
| `/tools/` | Tax, GST and TDS Calculators \| CA S. A. Abdul Rahim | 165 tax, GST and finance calculators | ItemList schema; client-side search; category navigation |
| `/disclaimer/`, `/privacy/` | Disclaimer / Privacy Policy, each with "\| CA S. A. Abdul Rahim" | Disclaimer / Privacy policy | Privacy states no cookies, no forms, no analytics, no data collected |
| 404 | Page not found \| CA S. A. Abdul Rahim | Page not found | Served with a 404 status by Vercel |

The 20 areas named in schema and on `/areas/` (from `AREAS` in `site.ts`): Adyar, Indira Nagar, Gandhi Nagar, Kasturba Nagar, Shastri Nagar, Kotturpuram, Besant Nagar, Thiruvanmiyur, Kottivakkam, Mylapore, Mandaveli, R.A. Puram, Teynampet, Taramani, Alwarpet, Velachery, Guindy, Saidapet, T. Nagar, Nungambakkam.

### 3.5 Calculators by category (165 in total)

| Category key | Label shown | Calculators | Hub anchor | Linked service page (`CATEGORY_SERVICE`) |
|---|---|---|---|---|
| `tax` | Direct tax | 65 | `/tools/#tax` | `/income-tax-return-filing-chennai/` |
| `indirect` | GST | 19 | `/tools/#indirect` | `/gst-return-filing/` |
| `tds` | TDS and TCS | 23 | `/tools/#tds` | `/tds-return-filing/` |
| `compliance` | Compliance | 28 | `/tools/#compliance` | `/tax-audit/` |
| `finance` | Money and loans | 17 | `/tools/#finance` | `/income-tax-return-filing-chennai/` |
| `nri` | NRI and cross-border | 11 | `/tools/#nri` | `/nri-taxation-itr-chennai/` |
| `utilities` | Generators and utilities | 2 | `/tools/#utilities` | `/income-tax-return-filing-chennai/` |

The full list with H1s is in the Appendix.

### 3.6 Page templates

| Template | File | Used by | Notes |
|---|---|---|---|
| Base | `src/layouts/Base.astro` | every page | head tags, canonical, robots meta, Open Graph, Twitter card, the JSON-LD graph, header with mega menu, footer with NAP, mobile Call/WhatsApp bar |
| Service | `src/layouts/Service.astro` | 16 services and 6 guides | lead, body slot, FAQ block, contact block, sources, last reviewed, sidebar with related calculators and related pages. Emits Service or Article schema plus FAQPage |
| Calculator page | `src/pages/tools/[key].astro` | 165 calculator pages | hero, mount point for the React calculator, how-to steps, note, related calculators (8), category link, service link, sources, last reviewed. Emits WebApplication |
| Calculator hub | `src/pages/tools/index.astro` | `/tools/` | category sections, search, ItemList schema |
| Plain pages | `src/pages/*.astro` | home, about, contact, areas, guides hub, disclaimer, privacy, 404 | use Base directly |

---

## 4. Technical SEO as built

### 4.1 Rendering

Static HTML generated at build time (`output: 'static'`, `build.format: 'directory'`, `compressHTML: true`, stylesheets inlined with `inlineStylesheets: 'always'`). Every page's content, headings, FAQs, links and JSON-LD are present in the served HTML without JavaScript.

The calculators are the exception: the interactive tool is rendered client-side by React inside `<div id="app" data-tool="<key>">`, which in the static HTML holds only the text "Loading the calculator…". Crawlers that do not run JavaScript see the page copy (H1, summary, steps, note, related links, sources) but not the calculator interface. That is why the static copy matters (section 5.5). A `<noscript>` message tells users the calculator needs JavaScript and gives the phone number.

### 4.2 Canonical URLs and trailing slash

- Every page has `<link rel="canonical" href="https://casaabdulrahim.in<path>">` with a trailing slash. `check-pages` verifies this on every page.
- `astro.config.mjs` sets `trailingSlash: 'always'`; `vercel.json` sets `"trailingSlash": true`.
- `check-links` verifies that every internal `href` or `src` resolves to a built file and that page links end with a slash (18,004 internal links and assets checked, 0 broken, on the 29 October build).

### 4.3 Redirects

| From | To | Mechanism |
|---|---|---|
| `www.casaabdulrahim.in/<path>` | `https://casaabdulrahim.in/<path>` | `redirects` rule in `vercel.json` with `permanent: true` (308) |
| `http://` | `https://` | Vercel platform behaviour; also `upgrade-insecure-requests` in the CSP and HSTS |
| Path without trailing slash | path with trailing slash | `trailingSlash: true` |

There are no other redirects. If URLs are ever renamed, add 301/308 rules in `vercel.json` and update the sitemap and internal links.

Verify with, for example: `curl -sI http://www.casaabdulrahim.in/tax-audit` and follow the chain to confirm a single hop to `https://casaabdulrahim.in/tax-audit/`.

### 4.4 robots.txt (`public/robots.txt`, 304 bytes)

```
User-agent: *
Allow: /

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /

Sitemap: https://casaabdulrahim.in/sitemap.xml
```

Everything is allowed. The named AI-related crawlers are: GPTBot, OAI-SearchBot (OpenAI), PerplexityBot (Perplexity), ClaudeBot (Anthropic) and Google-Extended (Google's control for Gemini training and grounding). Because the `*` group already allows everything, the named groups are explicit signals rather than functional differences. Crawlers that fall under `*` and are not named: ChatGPT-User, Claude-User, Claude-SearchBot, Perplexity-User, Applebot and Applebot-Extended, CCBot, and Meta's crawlers. Whether to name them is a policy decision for the owner; naming them is harmless.

Nothing is disallowed. The 404 template carries `index, follow` but Vercel serves it with a 404 status, which is correct.

### 4.5 Sitemap (`src/pages/sitemap.xml.ts`)

Generated at build time. It contains 195 URLs: `/`, `/about/`, the 16 services, `/areas/`, `/guides/`, the 6 guides, `/tools/`, the 165 calculator pages, `/contact/`, `/disclaimer/`, `/privacy/`. Each entry has `<loc>` and `<lastmod>`; there is no `changefreq` or `priority` (both are ignored by Google anyway). Every `lastmod` is the single value `REVIEWED_ISO` from `site.ts` (currently 2026-10-29), not a per-page modification date. A new page added to `SERVICES`, `GUIDES` or the tool data appears in the sitemap automatically.

### 4.6 Meta tags and social

Set in `Base.astro` for every page:

- `<title>` and `<meta name="description">` per page. Checks: title at most 60 characters and unique; description 70 to 155 characters. Calculator titles are `<copy.title> | CA Abdul Rahim`, so the copy title should stay at or below 44 characters.
- `<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">`.
- `lang="en-IN"`, `theme-color`, SVG favicon, preload of two fonts.
- Open Graph: `og:type` (article for guides, website otherwise), `og:site_name`, `og:title`, `og:description`, `og:url`, `og:locale` en_IN, `og:image` (the same `/og-image.png` for all pages), width 1200, height 630, alt text.
- Twitter card `summary_large_image` with title, description and image.
- No `hreflang` (single language, single region), no `rel=alternate`, no `rel=prev/next`.

### 4.7 Structured data

One `<script type="application/ld+json">` per page containing a single `@graph`. `check-jsonld` parses every block, enforces required properties per type, rejects dangling `@id` references, rejects rating/review markup and requires that every FAQ question and answer in the schema appears verbatim in the visible page.

| Type | Where | Key properties |
|---|---|---|
| `AccountingService` (`@id` `https://casaabdulrahim.in/#accountingservice`) | every page | name, url, telephone `+917397283223`, email, image (`/og-image.png`), `PostalAddress`, `GeoCoordinates`, `hasMap` (Google Maps CID link), `openingHoursSpecification` (Mon to Sat, 08:00 to 20:00), `areaServed` (20 `Place` entries), `knowsLanguage`, `foundingDate` 1985-04-12, `founder` (the Person), `sameAs` (Maps listing and the Blogger site) |
| `Person` (`#person`) | every page | name "S. A. Abdul Rahim", jobTitle "Chartered Accountant", `worksFor`, `knowsLanguage`, url `/about/`. No `sameAs`, no credentials |
| `BreadcrumbList` | every page | Home, then page crumbs. Services: Home > service name. Guides: Home > Guides > guide. Calculators: Home > Calculators > calculator |
| `Service` | 16 service pages | name, serviceType, url, description, `provider` (by `@id`), `areaServed` City Chennai |
| `FAQPage` | 16 service pages (5 questions each) and 6 guides (4 each) | `Question` and `Answer` text identical to visible FAQ |
| `Article` | 6 guides | headline, description, url, `mainEntityOfPage`, image, `datePublished`, `dateModified` (currently equal to published), `inLanguage` en-IN, author (Person by `@id`), publisher (the AccountingService by `@id`) |
| `WebApplication` (`/tools/<key>/#app`) | 165 calculator pages | name, url, description, `applicationCategory` FinanceApplication, `operatingSystem`, `inLanguage`, `isAccessibleForFree`, provider by `@id` |
| `ItemList` (`/tools/#list`) | `/tools/` | name, `numberOfItems` 165, 165 `ListItem` entries with name and url |

Not present: `WebSite` with `SearchAction`, `HowTo` (the calculator steps are plain lists), `FAQPage` on tool pages, `sameAs` on the Person, `memberOf`. Note that Google restricted FAQ rich results to a small set of authoritative sites in 2023, so the FAQ markup here serves entity understanding and answer extraction by AI systems, not a visible SERP feature. Do not promise rich-result outcomes to the owner.

### 4.8 Performance as built

No script enforces a performance budget. As-built figures from the 29 October build (uncompressed unless stated):

| Item | Size |
|---|---|
| Home HTML | 63,857 bytes |
| A service page (`/tax-audit/`) | 53,498 bytes |
| A calculator page (`/tools/hra/`) | 48,316 bytes |
| `/tools/` hub | 126,010 bytes |
| Site script `/js/site.js` | 2,013 bytes (open/closed status, calculator search, optional GA4 click events) |
| Fonts (3 woff2: Source Sans 400 and 600, Source Serif 600) | 52,896 bytes in total, self-hosted, two preloaded |
| Calculator shell `app.<hash>.js` | 168,329 bytes |
| Calculator CSS `toolkit.<hash>.css` | 97,501 bytes |
| React 10,782 + React DOM 132,102 + QR code 19,927 | 162,811 bytes |
| One calculator module `tools/<key>.<hash>.js` | about 5 KB to 12 KB each, loaded on demand |

Service pages, guides and the home page load none of the calculator code. Calculator pages load the three vendor scripts, the shell and the stylesheet with `defer`.

Lighthouse (mobile, local server with the production headers from vercel.json, after the redesign, 29 October 2026): home 100/100/100/100 (LCP 1.5 s, CLS 0.03, TBT 0 ms, 121 KiB); TDS on property service page 100/100/100/100 (LCP 1.7 s); contact 100/100/100/100 (LCP 1.5 s; 569 KiB because of the Google Maps iframe); /tools/ hub 98/100/100/100 (LCP 1.8 s); calculator page /tools/hra/ 87/100/100/100 (LCP 3.9 s, TBT 50 ms, about 537 KiB including React). Calculator pages are the heaviest template; re-measure on production with PageSpeed Insights.

Note: some intermediate Lighthouse runs failed with the tool error NO_NAVSTART (a tracing glitch, not a site fault) and were re-run. The gold-button colour-contrast issue they showed in the sidebar has been fixed.

Caching: vercel.json sets one-year immutable caching for /fonts/* and for /toolkit/* (all calculator files are content-hashed, and their names change on every build), and one-day caching for /js/*. HTML uses Vercel defaults.

### 4.9 Security headers and what they imply for SEO tooling

Set on every route in `vercel.json`:

- `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()`
- `Cross-Origin-Opener-Policy: same-origin`
- `Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; frame-src https://www.google.com https://maps.google.com; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'; frame-ancestors 'none'; upgrade-insecure-requests`
- `Content-Type: text/plain; charset=utf-8` forced for `/llms.txt`.

Consequences:

- Any third-party script is blocked until the CSP is changed: Google Analytics 4 (gtag), Google Tag Manager, chat widgets, heatmaps, consent tools, schema/SEO plugins, reviews widgets (which are in any case prohibited by section 2). Inline scripts are blocked too, because `script-src` has no `'unsafe-inline'`. A standard GA4 snippet has an inline initialisation block, so it must be moved to a same-origin file or covered by a hash.
- Search Console verification by DNS TXT record needs no site change. Verification by HTML meta tag is fine under the CSP (meta tags are not scripts) but needs a code edit in `Base.astro`'s head.
- Google Maps is the only allowed embed (`frame-src` for google.com and maps.google.com).
- `img-src` is `'self' data:`, so images must be hosted on the site itself.
- `form-action 'none'` means no form can submit anywhere, which matches the no-forms policy.
- `X-Frame-Options: DENY` and `frame-ancestors 'none'` prevent the site being framed (including by some SEO preview tools).

Calculators and storage: the toolkit saves inputs and saved scenarios in the browser's localStorage (internal keys beginning finclar., kept so stored state stays compatible). The Privacy page explains this: data stays on the device, is never sent to any server, and can be cleared with the Reset button or by clearing site data.

---

## 5. AEO and GEO as built, and recommended next steps

### 5.1 What is built

| Tactic | Implementation | Where to see it |
|---|---|---|
| Answer-first leads | Each service page and guide opens with a definition-style lead paragraph that answers the core question and names the office and area | `lead` prop in `Service.astro`; example: `/udyam-msme-registration/` |
| FAQ answers of 40 to 60 words | Enforced by `check-pages` for every question heading that ends in "?" inside the FAQ block. 5 FAQs per service page, 4 per guide | FAQ sections; FAQPage schema mirrors them |
| Visible-equals-schema | `check-jsonld` fails if any FAQ question or answer in JSON-LD is not in the visible text | `scripts/check-jsonld.mjs` |
| Official-source citations | Every page must link at least one official domain (incometax.gov.in, incometaxindia.gov.in, gst.gov.in, reg.gst.gov.in, cbic-gst.gov.in, mca.gov.in, tnreginet.gov.in, udyamregistration.gov.in, tdscpc.gov.in, rbi.org.in, icai.org, meity.gov.in); `Sources` sections list them. Source definitions are in `SRC` in `site.ts` | `check-pages` rule "no official source link" |
| "Last reviewed" dates | Visible on every page and in the footer ("Content reviewed on 29 October 2026"); `<time datetime>` markup; Article `dateModified` on guides | `check-pages` fails if absent |
| Author byline on guides | "By CA S. A. Abdul Rahim, Chartered Accountant · Published … · Last reviewed …" plus `author` in Article schema pointing to the Person node | `Service.astro` |
| Entity consistency | One NAP source (`site.ts`); the same AccountingService node on all 196 pages; `check-nap` enforces identity | `schema.ts`, `check-nap.mjs` |
| Disclaimers | Footer line on every page, a `/disclaimer/` page, and a "general information only" line in each Sources block | `Base.astro` |
| llms.txt | Generated at `/llms.txt` (about 39.6 KB, 224 lines) | below |
| AI crawlers allowed | See 4.4 | `public/robots.txt` |
| Calculator pages as citable utilities | Each of 165 has a unique H1, a 49 to 78 word summary, 3 steps, a note, sources by category, and WebApplication schema | `tool-copy.json`, `tools/[key].astro` |

### 5.2 What llms.txt contains (`src/pages/llms.txt.ts`)

A plain-text file in the llms.txt convention, generated from the same data as the site:

1. Title "CA S. A. Abdul Rahim" and a blockquote summary: Chartered Accountant in practice in Adyar, Chennai, since 1985 (opening date 12 April 1985), the full address, both phone numbers, WhatsApp, email, hours and languages.
2. A paragraph on the scope of the practice and a statement that the site does not solicit or advertise, content is general information only, the content review date, and that the Income-tax Act, 2025 replaced the 1961 Act from 1 April 2026.
3. "Areas near the office": the 20 areas.
4. Sections "Services" (16 links with one-line descriptions), "Guides" (6 links), "Calculators" (a link to `/tools/` and then every one of the 165 calculators grouped by category, each with its description), and "About and contact" (About, Areas, Contact, the Google Maps listing, Disclaimer).

In total it has 193 link entries. It is not a standard that major search engines are known to rely on; treat it as a low-cost aid for AI agents and keep it accurate.

Note that the file states "Member of the Institute of Chartered Accountants of India (ICAI)" as fact, while the About page still marks that line `[CONFIRM]`. Resolve this inconsistency with the CA (section 8).

### 5.3 Recommended next steps (all within section 2)

1. **Clear the 53 markers first.** AI systems quote the page as it stands. A fact marked as unverified is a weak citation and a risk to the owner. Prepare a single list for the CA of every marker with the page, the sentence, and the official source link to check (section 7, days 0 to 30).
2. **llms-full.txt.** Add `/llms-full.txt` generated from the same data, containing the full text of the service pages and guides (FAQ answers included) in Markdown. This needs a new endpoint file next to `llms.txt.ts`; add a header rule for its content type in `vercel.json` only if needed.
3. **More FAQ coverage on calculator pages.** The 165 calculator pages have no FAQ block and no FAQPage schema. For the high-intent tools (`it`, `hra`, `capgains`, `sec194ia`, `advtax`, `gst`, `emi`, `gratuity`, `tds`, `sec195`, `nri`) add three to five question-and-answer pairs each, 40 to 60 words, with an official source, verified by the CA. This requires a template change in `tools/[key].astro` and a place in `tool-copy.json` for the FAQ data; coordinate with the engineer and extend `check-jsonld` and `check-pages` so the same visible-equals-schema and length rules apply.
4. **Rewrite the calculator copy by hand.** All 165 summaries begin "This tool …" and follow one template, with exactly three steps each. Rewrite the high-intent tools first so that each opens with the plain-language answer to the user's question ("HRA exemption is the least of three amounts: …") and states the tax-year rule used.
5. **Q&A-style guides.** Convert or add guides whose H2s are the questions people ask, with the answer in the first sentence under each heading. Candidate topics already within scope: "Is a tax audit required if my turnover is below the limit?", "Do I need GST registration to sell online from Chennai?", "How is TDS on property purchase paid and how is the certificate given?", "How do I respond to a notice under the new Act?". Each needs CA review and an official source.
6. **Entity consistency off-site.** Make the following identical to section 2.3 and to this site: Google Business Profile (name, address, phone, hours, website), Bing Places, Apple Business Connect, Justdial, Sulekha. Use the same primary category (Chartered Accountant) and the same service descriptions. Add the confirmed profile URLs to the `sameAs` array in `schema.ts` once they exist.
7. **Person and credentials.** After the CA confirms the ICAI membership number, add it to the About page and consider `memberOf` or `hasCredential` in the Person node. Not before.
8. **Monitor AI answers.** Once a month, ask the main assistants (Google AI Overviews and AI Mode, ChatGPT search, Perplexity, Gemini, Copilot) a fixed set of 20 or so questions, for example: "CA in Adyar", "chartered accountant near Shastri Nagar Chennai", "TDS on property purchase above 50 lakh", "NRI selling property in Chennai TDS", "GST registration documents Chennai", "income tax notice what to do", and record in a spreadsheet whether the site is cited, which URL, and whether the quoted facts (phone, address, hours, law) are right. Report errors to the owner; fix the source page, not the AI. Do not ask any AI tool to generate reviews or listings about the firm.
9. **Date discipline.** Several pages quote due dates for 2026 (for example 31 October 2026 for audited taxpayers, 31 December 2026 for belated returns). After each date passes, review the page the same week; stale dates are a common reason for being dropped from answers.
10. **Verifiability, not promotion.** The site already carries a factual About page and disclaimers; do not add trust claims. To improve verifiability, link the About page to the CA's ICAI directory entry only if the CA agrees.

---

## 6. How to work on the codebase safely

### 6.1 Setup and commands

Requirements: Node.js 24.x (Vercel's default; the build was run on 24.14.1), npm. Calculator smoke tests also need Google Chrome installed (Playwright uses the `chrome` channel).

| Command | What it does |
|---|---|
| `npm install` | Install dependencies |
| `npm run dev` | Astro dev server at http://localhost:4321 |
| `npm run build` | Runs `node scripts/build-toolkit.mjs` and then `astro build`. Output in `dist/`; 196 pages in about 3 seconds |
| `npm run check:all` | Runs, in order: `check-banned`, `check-nap`, `check-links`, `check-jsonld`, `check-pages`, all against `dist/`. Run after every build |
| `node scripts/serve-dist.mjs [port]` | Serves `dist/` with the headers from `vercel.json` (default port 4322) so tests run under the production CSP |
| `npm run check:tools` | Browser smoke test: every calculator page must mount with no console, page or network error, and a light input interaction must not throw. Needs a server running. Default `BASE` is http://localhost:4321, so when using `serve-dist` set `BASE` (PowerShell: `$env:BASE='http://localhost:4322'; npm run check:tools`). `CONCURRENCY` defaults to 6. Writes `reports/check-tools.json` |
| `npm run build:toolkit` | Rebuilds only the calculators (also runs inside `npm run build`) |
| `node scripts/make-og.mjs` | Rebuilds `public/og-image.png` (text only; no logo) |
| `node scripts/screenshots.mjs` | Screenshots at 390 px and 1366 px (needs `astro preview` running and Chrome) |

State on 29 October 2026: `check-banned` 0 hits in 196 pages; `check-nap` identical on all 196 pages; `check-links` 18,004 checked and 0 broken; `check-jsonld` 0 errors; `check-pages` passes with 24 pages carrying open markers. The last saved `reports/check-tools.json` shows 165 of 165 calculators passing.

What each check enforces, so a failure can be understood:

- `check-banned`: section 2.2.
- `check-nap`: section 2.3.
- `check-links`: internal links and assets resolve; page links have a trailing slash.
- `check-jsonld`: valid JSON, `@context` https://schema.org, AccountingService, Person and BreadcrumbList present on every page, required properties per type, no rating/review markup, no dangling `@id`, FAQ question and answer visible, breadcrumb positions sequential and on this domain.
- `check-pages` (skips the 404): title at most 60 characters and unique; description 70 to 155; exactly one `<h1>`; canonical exact; "Last reviewed" and "Content reviewed on" present; at least one official-source link; service pages at least 600 words; guides 900 to 1,700 words; FAQ answers 40 to 60 words; lists open markers.

### 6.2 Where each piece of content lives

| Content | Location |
|---|---|
| NAP, hours, areas, service list and blurbs, guide list, official source links (`SRC`), review date, calculator-to-service links (`SERVICE_TOOLS`) | `src/data/site.ts` |
| JSON-LD builders (AccountingService, Person, BreadcrumbList, FAQPage, Service, Article) | `src/data/schema.ts` |
| WebApplication and ItemList schema | inline in `src/pages/tools/[key].astro` and `src/pages/tools/index.astro` |
| Head tags, navigation, footer, action bar | `src/layouts/Base.astro` |
| Service and guide layout (FAQ block, byline, sources) | `src/layouts/Service.astro` |
| Service page copy and FAQs | `src/pages/<slug>.astro` (frontmatter `faqs` array and body) |
| Guide copy and FAQs | `src/pages/guides/<slug>.astro` |
| Calculator page copy (h1, title, description, summary, 3 steps, note) | `src/data/tool-copy.json` |
| Calculator category labels, intros, linked service, sources | `src/data/tools.ts` |
| Calculator keys, labels, categories, hashed asset paths | `src/data/tools.json` (generated; never edit by hand) |
| Calculator code, tax rules, CSS | `toolkit/src/toolkit.jsx`, `toolkit/core/`, `toolkit/css/`, `toolkit/tax-rules.json`, `toolkit/vendor/` |
| robots, sitemap, llms.txt | `public/robots.txt`, `src/pages/sitemap.xml.ts`, `src/pages/llms.txt.ts` |
| Headers, CSP, cache rules, redirect | `vercel.json` |
| Open markers | the `<V />` component (`src/components/V.astro`) in page files |

`public/toolkit/` and `src/data/tools.json` are regenerated by every build (`build-toolkit.mjs` deletes and recreates `public/toolkit/`). Do not edit generated files.

### 6.3 Add a service page

1. Create `src/pages/<slug>.astro` using `Service.astro`, copying the structure of an existing page such as `src/pages/udyam-msme-registration.astro`: `title`, `description`, `path`, `h1`, `name`, `topic`, `lead`, `faqs` (five items, 40 to 60 words each), `related`, `sources`.
2. Add an entry to `SERVICES` in `src/data/site.ts` with `group`, `href`, `label`, `blurb`. This adds the page to the menu, footer, sitemap and llms.txt automatically.
3. Mind the footer: it splits the list with `SERVICES.slice(0, 7)` ("Tax and TDS") and `SERVICES.slice(7)` ("GST, audit and registrations"). Inserting a new entry in the wrong position moves other links between columns. Add after existing entries of the same group, and ask the engineer if the split needs changing. The menu groups by the `group` string.
4. Optionally add calculators for the page's sidebar in `SERVICE_TOOLS`.
5. Meet the content rules in section 2: at least 600 words, an official source, no markers invented, no banned wording.
6. `npm run build && npm run check:all`.

### 6.4 Add a guide

1. Create `src/pages/guides/<slug>.astro` using `Service.astro` with `guide={{ published, modified }}`, as in the existing guides (each declares `const pub = '…'` and passes `modified: pub`).
2. Add an entry to `GUIDES` in `site.ts` (`href`, `title`, `published`). The first three guides in the array are shown in the services mega menu.
3. Write 900 to 1,700 words, four or five FAQs of 40 to 60 words, an official source, and the `related` links (a guide's sidebar calculators are taken from the first related page that has an entry in `SERVICE_TOOLS`).
4. Build and check.

### 6.5 Edit calculator page copy

Edit `src/data/tool-copy.json`. Each key matches a calculator key and holds `h1`, `title`, `description`, `summary`, `steps` (an array; the template renders however many are given), and `note`. Constraints: title at most 44 characters (the template adds " | CA Abdul Rahim" and the page title must be at most 60); description 70 to 155 characters (currently 110 to 137); H1, title and description unique; no banned wording; no claims about law that the CA has not checked. Despite its being described as generated, no script in the repository writes this file, so hand-editing is safe. If a key is missing from the file, `tools.ts` falls back to generic text. Some notes in this file are general knowledge and need a CA check before they are treated as reliable.

Priority tools: `it`, `hra`, `capgains`, `sec194ia`, `advtax`, `gst`, `emi`, `gratuity`, `tds`, `sec195`, `nri`.

### 6.6 Bump the "Last reviewed" date

The README says to update `REVIEWED_ISO` and `REVIEWED_TEXT` in `site.ts`. That is necessary but not sufficient. The date is also written by hand in the following places, which must be changed together or the site will show different dates on different pages:

- `src/layouts/Service.astro`: `<time datetime="2026-10-29">` in the Sources block, and the text "29 October 2026" in the guide byline "Published …".
- `src/pages/tools/[key].astro` and `src/pages/tools/index.astro`: `<time datetime="2026-10-29">`.
- `src/pages/about.astro`, `areas.astro`, `contact.astro`, `disclaimer.astro`, `privacy.astro`, `index.astro`, `guides/index.astro`: both the `datetime` and the visible text.
- Each guide file: `const pub = '2026-10-29'` (used for both `published` and `modified`), and the matching `published` value in `GUIDES`.

Search the whole of `src` for `2026-10-29` and `29 October 2026` after changing. Only bump the date on pages whose content has genuinely been re-checked; a blanket bump of all 196 pages is misleading. For a guide that is updated after publication, change `modified` separately from `published` (today both equal 2026-10-29). Suggest to the engineer that the hard-coded dates be replaced by the constants.

### 6.7 Deployment

1. Work on a branch or in a pull request if the owner grants repository access in that way.
2. Run `npm run build` and `npm run check:all`; all five must pass.
3. Merge or push to `main`. Vercel builds automatically with `npm run build` and publishes `dist`.
4. After deployment, spot-check three URLs, the sitemap URL count, the `Content-Security-Policy` header (`curl -sI https://casaabdulrahim.in/`), and request indexing in Search Console for changed pages.

Do not run `git commit` or `git push` on the owner's behalf unless told to. The calculators build needs the devDependencies (`@babel/core`, `@babel/preset-react`, `postcss`); Vercel installs them by default.

---

## 7. Pending owner actions and the 30/60/90-day plan

### 7.1 Pending items that need the owner's logins or decisions

| # | Item | Owner action | Why it matters |
|---|---|---|---|
| 1 | Google Search Console | Create a Domain property for casaabdulrahim.in; verify with the DNS TXT record at GoDaddy; grant the specialist Full access | No search data, no index coverage, no sitemap submission today |
| 2 | Sitemap submission | Submit `https://casaabdulrahim.in/sitemap.xml` in GSC | Tells Google the 195 URLs |
| 3 | Bing Webmaster Tools | Sign in and import the site from GSC | Bing also feeds Copilot and several AI assistants |
| 4 | Google Business Profile website link | Decide whether to change the website field from the Blogger site (casaabdulrahim-notes.blogspot.com) to https://casaabdulrahim.in/ | The profile currently sends users and signals to a different site. The owner has not yet decided |
| 5 | Directory citations | Create or claim Justdial, Sulekha, Bing Places, Apple Business Connect listings with NAP exactly as in 2.3 | Consistent NAP across the web |
| 6 | GA4 | Create a GA4 property and give the measurement ID | None installed. `site.js` already sends `click_call`, `click_whatsapp` and `click_directions` events if `gtag` exists |
| 7 | `[VERIFY]`/`[CONFIRM]` markers | CA to confirm 53 facts (ICAI membership number, landmarks, routes, new-Act section numbers, due dates) | Public pages currently show the markers |
| 8 | GitHub repository visibility | Make the repository private (advice already given to the owner) | Public source exposes the draft content and the verification trail |
| 9 | Vercel plan | Decide whether the Hobby plan is acceptable for a business website | See section 8 |
| 10 | Deployment of the calculators and redesign | Done 29 Oct 2026 (pushed to main, Vercel auto-deploy); verify the live sitemap lists 195 URLs | See 1.2 |
| 11 | Access for the specialist | GSC, Bing, GBP manager role, GitHub collaborator or PR route | Needed for every item below |

### 7.2 Plan: first 30 days (29 October to 28 November 2026)

| Priority | Task | Depends on |
|---|---|---|
| 1 | Obtain GSC and Bing access; verify the domain; submit the sitemap; request indexing for the home page, the 16 services and the 6 guides; check coverage and the "Pages" report for the 196-page build | Owner items 1 to 3 |
| 2 | Confirm what is live (1.2): sitemap count, `/tools/` reachable, headers present, the www and http redirects each a single hop | Owner item 10 |
| 3 | Ask the owner to decide on the GBP website link (item 4); when approved, set it to `https://casaabdulrahim.in/` and check the link on mobile | Owner decision |
| 4 | Prepare the marker list for the CA: all 53 markers with page, sentence, and the official source to check. Apply confirmed facts only | CA |
| 5 | Re-measure Lighthouse and PageSpeed on the deployed site (home, a service, a guide, `/tools/`, a calculator); report the gold-button contrast failure to the CSS engineer | Deployment |
| 6 | Baseline: record GSC impressions, clicks and indexed pages; record the first AI-answer monitoring run (5.3 item 8) | GSC |
| 7 | Review pages with time-sensitive dates after 31 October 2026 (audit report and return dates, ITR dates) with the CA | CA |

### 7.3 Days 31 to 60 (29 November to 28 December 2026)

| Priority | Task |
|---|---|
| 1 | Create the NAP-identical directory listings (Bing Places via import from GBP, Apple Business Connect, Justdial, Sulekha); log each URL and the exact text used in a sheet; add confirmed profile URLs to `sameAs` |
| 2 | Rewrite the calculator copy for the 11 priority tools by hand; get CA review; build and run all checks |
| 3 | Add FAQ blocks and FAQPage schema to the 11 priority tool pages (needs the template and checker change in 5.3 item 3) |
| 4 | Fix the date-handling inconsistencies in section 6.6 with the engineer, so that a single constant controls the review date |
| 5 | Review GSC queries: which queries already show impressions; mark queries where a page's lead does not answer the question directly and tighten the lead |
| 6 | Genuine reviews: advise the owner on a neutral, unincentivised way to let clients know the Google profile exists (no scripts, no gating, no display on the site) |
| 7 | Decide on and ship `llms-full.txt` |

### 7.4 Days 61 to 90 (29 December 2026 to 27 January 2027)

| Priority | Task |
|---|---|
| 1 | Measurement: once the owner supplies a GA4 ID, install GA4 (7.5). Define conversions as `click_call`, `click_whatsapp`, `click_directions` |
| 2 | Publish two or three Q&A-style guides from the topic list in 5.3 item 5, CA-reviewed, each with official sources and no markers |
| 3 | Review seasonal pages ahead of the next cycle (GST annual return, advance tax, TDS return dates); update with verified dates |
| 4 | Local landing pages by area: only if each can carry unique, useful, ICAI-safe content (for example verified route and travel information, a real landmark, nearby public-transport details) and not simply the same text with a different place name. The existing `/areas/` page already covers the 20 areas. Do not build doorway pages, and do not start until the `[CONFIRM]` landmark and route markers are resolved |
| 5 | Second AI-answer monitoring run; compare with the baseline; report accuracy errors to the owner |
| 6 | Quarterly review of the banned-word and NAP checks with any new content; produce a short report to the owner |

### 7.5 Measurement plan and the CSP change

Today there is no analytics. Search Console and Bing Webmaster Tools will be the main data until a GA4 ID exists.

Installing GA4 requires coordination with the owner and a security review:

1. Because `script-src 'self'` blocks external and inline scripts, the Content Security Policy in `vercel.json` must be changed. Typical additions for GA4 are `https://www.googletagmanager.com` in `script-src`, and `https://www.google-analytics.com`, `https://*.google-analytics.com`, `https://*.analytics.google.com` and `https://*.googletagmanager.com` in `connect-src` and `img-src`. Confirm the current list in Google's documentation before editing; do not copy this list blindly.
2. Put the gtag initialisation in a same-origin file (for example `/js/analytics.js`) rather than inline, or use a script hash, so that `'unsafe-inline'` is not added to `script-src`.
3. Load the Google script from a separate file added in `Base.astro`'s head; `site.js` needs no change because it already checks `typeof window.gtag === 'function'`.
4. Update `src/pages/privacy.astro`: it currently states there are no analytics or tracking cookies and that nothing is stored in the browser. Those statements would become false. The owner should take advice on the cookie and consent position (including India's data-protection law) before launch; at minimum, the Privacy page must describe the analytics truthfully. Because `check-banned` and the ICAI rules still apply, no consent banner may contain promotional wording.
5. Alternative to evaluate with the owner: a cookieless, first-party analytics option available on Vercel (Vercel Web Analytics), which is served from the site's own origin and might need no CSP change. Verify its terms, the plan it needs and its privacy statements before recommending it.
6. Whatever is chosen, do not add pixels for advertising. Paid promotion in the CA's name is prohibited.

---

## 8. Known limitations, inconsistencies and open questions

Everything below was found in the repository on 29 October 2026. None has been changed by this handover.

### 8.1 Inconsistencies in the repository

| # | Finding | Effect | Suggested resolution |
|---|---|---|---|
| 1 | The review date is hard-coded in about 15 places in addition to `REVIEWED_ISO`/`REVIEWED_TEXT` (see 6.6). The README tells the user to change only the two constants | A date bump changes the sitemap, footer, llms.txt and some blocks but not others | Replace literals with the constants |
| 2 | Guide `modified` always equals `published` (both are set from one `pub` constant); the byline's visible "Published" text is hard-coded to 29 October 2026 | Updating a guide cannot show a distinct modified date without code changes | Separate the two values |
| 3 | Resolved 29 Oct 2026: the Privacy page now explains that calculators keep inputs in local storage on the device | - | - |
| 4 | Original identifiers remain in the served calculator code: `FinclarToolLoader`, `FINCLAR_TAX_RULES`, `FinclarHRA`, a comment "Finclar toolkit", the `finclar.` storage keys, CSS ids such as `finclar-report`, `window.__FINCLAR_TEST__`; 167 files in `dist/toolkit/` contain the string (the shell, the stylesheet and all 165 calculator modules, because each registers through `FinclarToolLoader`) | Not visible on pages, but present in public code; contrary to the "all Finclar branding removed" intent | Rename internally in `toolkit/` and rebuild, with a test run; owner decision |
| 5 | The calculators still contain a "share on WhatsApp" link pattern (`https://wa.me/?text=`), a Google Calendar link (`calendar.google.com/calendar/render`) and QR code generation | These are user-initiated outbound links, not booking links, but the owner should confirm they are acceptable under the ICAI position | Confirm with the owner |
| 6 | The About page marks ICAI membership number as [CONFIRM]. llms.txt no longer asserts membership; it states the ICAI no-solicitation rule only | Low | Confirm membership details with the owner, then update About |
| 7 | Calculator page titles end in "\| CA Abdul Rahim", while all other pages use "\| CA S. A. Abdul Rahim" | Entity name inconsistency; `check-nap` does not test titles | Change the suffix in `tools/[key].astro` (the suffix would grow from 16 to 23 characters, so the copy title limit would drop from 44 to 37) |
| 8 | The README is out of date: it omits `tools/`, `build-toolkit.mjs`, `check-tools.mjs`, `serve-dist.mjs`, the WebApplication and ItemList schema, and the `tool-copy.json` workflow | New staff may miss steps | Update the README |
| 9 | All sitemap `lastmod` values are identical | Weak freshness signal | Per-page dates once review dates are page-specific |
| 10 | `tool-copy.json` is described as generated but no script produces it; all 165 summaries start "This tool", each has exactly three steps, and the notes are general-knowledge text | Thin, uniform copy on 165 pages | See 5.3 item 4 |
| 11 | The Footer's two link columns are built by `slice(0, 7)` / `slice(7)` | Adding services can break the grouping | See 6.3 |
| 12 | `og-image.png` is drawn in colours (#1B2A4A, #BE9B5A) from the earlier design, while `theme-color` is #0c1a36 | Minor visual mismatch after the redesign | Regenerate with `make-og.mjs` once the palette is final |
| 13 | Resolved: reports/check-tools.json and the generated public/toolkit/ are git-ignored | - | - |
| 14 | `robots.txt` repeats the `*` rule for each named bot | Harmless; only documentation value | Leave, or extend deliberately |
| 15 | Resolved: Lighthouse re-run after the redesign (figures in section 4); the gold-button contrast issue was fixed | - | - |

### 8.2 Limitations

- No analytics, no search data and no ranking data exist in the repository. Every statement about performance in this document is technical, not about traffic.
- The 165 calculators render only in the browser. Crawlers that do not execute JavaScript, and AI systems that fetch HTML only, see the page copy but not the calculator. Calculator accuracy has not been audited by a CA as part of this handover; the earlier smoke test confirms they load without errors, not that the tax logic is right.
- The site has no forms, no lead capture and no reviews by design. Conversion is a phone call, a WhatsApp tap or a directions tap.
- Single office, single language (English, en-IN); Tamil and Hindi are spoken languages of the practice but there are no Tamil or Hindi pages. Adding them is a content and ICAI-review decision for the owner.
- Dates of law and due dates on the site are time-sensitive and several are still marked unverified.
- The Income-tax Act, 2025 transition means many section and form numbers are provisional.

### 8.3 Open questions for the owner

1. Is the calculator release and redesign committed and deployed? (1.2)
2. Is Vercel's Hobby plan suitable? Vercel's terms for Hobby describe it as for personal, non-commercial use; a firm's business website may need a paid plan. Please check the current terms and decide.
3. Will the repository be made private, and how will the specialist submit changes (collaborator access or pull requests)?
4. Should the GBP website link change to casaabdulrahim.in, and should the Blogger site remain in the `sameAs` list afterwards?
5. What is the ICAI membership number, and may it be published?
6. Which landmark, route and travel-time details are correct? (the `[CONFIRM]` markers on `/areas/` and `/contact/`)
7. Will the owner accept GA4, and what position will he take on cookies and consent?
8. Are the WhatsApp-share and calendar links in the calculators acceptable?
9. Should the "finclar" identifiers be renamed in the toolkit?
10. Should Tamil or Hindi versions of key pages be considered, given ICAI limits?

---

## 9. Appendix: the 165 calculator URLs by category

Generated on 29 October 2026 from `src/data/tools.json` (key order and category) and `src/data/tool-copy.json` (H1). Every URL is `https://casaabdulrahim.in/tools/<key>/`. Order within each category is the order on the `/tools/` hub. Category totals: 65 + 19 + 23 + 28 + 17 + 11 + 2 = 165.

### A.1 Direct tax (65 calculators, hub anchor /tools/#tax)

| # | URL | H1 |
|---|---|---|
| 1 | /tools/it/ | Income tax calculator |
| 2 | /tools/optimizer/ | Tax saving optimizer |
| 3 | /tools/scencompare/ | Tax scenario comparison tool |
| 4 | /tools/revtax/ | Reverse tax calculator for target take-home |
| 5 | /tools/sec87a/ | Section 87A rebate calculator |
| 6 | /tools/surcharge/ | Surcharge and marginal relief calculator |
| 7 | /tools/capgains/ | Capital gains tax calculator |
| 8 | /tools/sec112a/ | LTCG on listed equity shares calculator |
| 9 | /tools/ltcgharvest/ | Equity LTCG harvesting calculator |
| 10 | /tools/sec111a/ | STCG on listed equity shares calculator |
| 11 | /tools/sec50aa/ | Section 50AA debt fund gains calculator |
| 12 | /tools/cii/ | Cost inflation index calculator |
| 13 | /tools/sec50c/ | Section 50C stamp duty value calculator |
| 14 | /tools/sec43ca/ | Section 43CA stamp duty value calculator |
| 15 | /tools/hra/ | HRA exemption calculator |
| 16 | /tools/hravsgg/ | HRA or Section 80GG rent relief calculator |
| 17 | /tools/advtax/ | Advance tax and interest calculator |
| 18 | /tools/ctc/ | CTC structure and take-home calculator |
| 19 | /tools/gratuity/ | Gratuity, leave encashment, VRS and pension exemption |
| 20 | /tools/p10a/ | Pension commutation exemption calculator |
| 21 | /tools/itrpicker/ | ITR form picker |
| 22 | /tools/homeloan/ | Home loan interest deduction calculator |
| 23 | /tools/hp/ | House property income calculator |
| 24 | /tools/sec80eea/ | First home loan interest deduction, Section 80EEA |
| 25 | /tools/sec80ee/ | First home interest deduction, Section 80EE |
| 26 | /tools/stampduty/ | Stamp duty and registration calculator |
| 27 | /tools/chvia/ | Chapter VI-A deductions calculator |
| 28 | /tools/sec80d/ | Health insurance deduction calculator, Section 80D |
| 29 | /tools/sec80g/ | Donation deduction calculator, Section 80G |
| 30 | /tools/sec80gga/ | Research and rural donation deduction, Section 80GGA |
| 31 | /tools/sec80tta/ | Savings interest deduction, Section 80TTA and 80TTB |
| 32 | /tools/pol80gg/ | Political donation deduction, Section 80GGB and 80GGC |
| 33 | /tools/esop/ | ESOP and RSU tax calculator |
| 34 | /tools/buyback/ | Share buyback tax calculator |
| 35 | /tools/dividend/ | Dividend tax and TDS calculator |
| 36 | /tools/cgreinvest/ | Capital gain reinvestment exemption planner |
| 37 | /tools/sec54ec/ | Section 54EC capital gain bonds calculator |
| 38 | /tools/sec54gb/ | Section 54GB property to startup calculator |
| 39 | /tools/sec54b/ | Section 54B agricultural land exemption |
| 40 | /tools/slumpsale/ | Slump sale capital gains calculator |
| 41 | /tools/sec80iac/ | Section 80IAC startup deduction calculator |
| 42 | /tools/sec10aa/ | Section 10AA SEZ deduction calculator |
| 43 | /tools/sec89/ | Section 89(1) salary arrears relief calculator |
| 44 | /tools/sec80gg/ | Section 80GG rent deduction calculator |
| 45 | /tools/sec80u/ | Disability deduction calculator for 80U and 80DD |
| 46 | /tools/sec80ddb/ | Medical deduction calculator for 80D and 80DDB |
| 47 | /tools/sec80jjaa/ | Section 80JJAA employment deduction calculator |
| 48 | /tools/sec80cch/ | Agniveer corpus fund deduction calculator |
| 49 | /tools/mat/ | MAT and AMT calculator |
| 50 | /tools/vda/ | Crypto and virtual digital asset tax calculator |
| 51 | /tools/fno/ | Futures and options tax calculator |
| 52 | /tools/gift56/ | Gift tax calculator under Section 56(2)(x) |
| 53 | /tools/angel/ | Angel tax calculator, Section 56(2)(viib) |
| 54 | /tools/corp115/ | Company tax regime comparison, Section 115BAA and 115BAB |
| 55 | /tools/coop115/ | Co-operative society tax calculator |
| 56 | /tools/partner/ | Partnership firm interest and remuneration limit |
| 57 | /tools/huf/ | HUF tax planner |
| 58 | /tools/setoff/ | Loss set-off and carry forward planner |
| 59 | /tools/sec79/ | Change of shareholding and loss carry forward |
| 60 | /tools/sec72a/ | Loss carry forward on amalgamation |
| 61 | /tools/sec40a/ | TDS disallowance calculator for Section 40(a) |
| 62 | /tools/sec14a/ | Section 14A exempt income disallowance |
| 63 | /tools/ulip/ | ULIP maturity tax calculator |
| 64 | /tools/sec10d/ | Life insurance maturity tax, Section 10(10D) |
| 65 | /tools/gaming/ | Lottery and online gaming winnings tax |

### A.2 GST (19 calculators, hub anchor /tools/#indirect)

| # | URL | H1 |
|---|---|---|
| 1 | /tools/gst/ | GST calculator |
| 2 | /tools/invoice/ | GST tax invoice generator |
| 3 | /tools/hsn/ | HSN and SAC code lookup |
| 4 | /tools/gst2b/ | GSTR-2B reconciliation tool |
| 5 | /tools/gstrefund/ | GST refund calculator |
| 6 | /tools/gstr9/ | GSTR-9 and 9C applicability checker |
| 7 | /tools/gstrlf/ | GST late fee and interest calculator |
| 8 | /tools/gstint/ | GST interest calculator, Section 50 |
| 9 | /tools/qrmp/ | QRMP scheme eligibility checker |
| 10 | /tools/einvoice/ | GST e-invoice applicability checker |
| 11 | /tools/gstcndn/ | GST credit note and debit note time limit |
| 12 | /tools/gta/ | GST on goods transport agency services |
| 13 | /tools/importsvc/ | GST on import of services calculator |
| 14 | /tools/regst/ | GST on real estate calculator |
| 15 | /tools/customs/ | Customs duty calculator |
| 16 | /tools/gstcomp/ | GST composition scheme eligibility checker |
| 17 | /tools/rcm/ | GST reverse charge decider |
| 18 | /tools/ewb/ | E-way bill requirement checker |
| 19 | /tools/pos/ | GST place of supply checker |

### A.3 TDS and TCS (23 calculators, hub anchor /tools/#tds)

| # | URL | H1 |
|---|---|---|
| 1 | /tools/tds/ | TDS calculator and rate finder |
| 2 | /tools/tcs/ | TCS calculator, Section 206C |
| 3 | /tools/tdslate/ | TDS late filing fee and interest calculator |
| 4 | /tools/sec192/ | Salary TDS calculator, Section 192 |
| 5 | /tools/sec192a/ | EPF withdrawal TDS calculator |
| 6 | /tools/form16/ | Form 16 generator |
| 7 | /tools/panaadhaar/ | PAN and Aadhaar link status guide |
| 8 | /tools/sec194c/ | Contractor TDS calculator, Section 194C |
| 9 | /tools/sec194i/ | Rent TDS for businesses, Section 194I |
| 10 | /tools/sec194j/ | Professional fees TDS, Section 194J |
| 11 | /tools/sec194h/ | Commission TDS calculator, Section 194H |
| 12 | /tools/sec194q/ | Section 194Q and 206C(1H) decider |
| 13 | /tools/sec194o/ | E-commerce operator TDS calculator |
| 14 | /tools/sec194b/ | Winnings TDS calculator, Section 194B and 194BA |
| 15 | /tools/sec194m/ | Personal payments TDS, Section 194M |
| 16 | /tools/sec194la/ | Compulsory acquisition TDS, Section 194LA |
| 17 | /tools/sec194lbb/ | Investment fund distribution TDS, Section 194LBB |
| 18 | /tools/sec194lbc/ | Securitisation trust TDS, Section 194LBC |
| 19 | /tools/sec194t/ | Partner payment TDS, Section 194T |
| 20 | /tools/sec194n/ | Cash withdrawal TDS, Section 194N |
| 21 | /tools/sec194ib/ | Rent TDS for individuals, Section 194IB |
| 22 | /tools/sec194ia/ | Property purchase TDS, Section 194IA |
| 23 | /tools/f15gh/ | Form 15G and 15H eligibility checker |

### A.4 Compliance (28 calculators, hub anchor /tools/#compliance)

| # | URL | H1 |
|---|---|---|
| 1 | /tools/cal/ | Compliance calendar |
| 2 | /tools/audit/ | Tax audit applicability checker, Section 44AB |
| 3 | /tools/presumptive/ | Presumptive taxation calculator, 44AD, 44ADA, 44AE |
| 4 | /tools/p44ada/ | Presumptive tax for professionals, Section 44ADA |
| 5 | /tools/p44ae/ | Presumptive tax for goods carriages, Section 44AE |
| 6 | /tools/ptax/ | Professional tax calculator by state |
| 7 | /tools/bonus/ | Statutory bonus calculator |
| 8 | /tools/esi/ | ESI contribution calculator |
| 9 | /tools/epfdmg/ | EPF and ESI late payment damages calculator |
| 10 | /tools/depreciation/ | Depreciation calculator under the Income-tax Act |
| 11 | /tools/udyam/ | MSME classification and payment check |
| 12 | /tools/sec43bh/ | MSME 45-day payment rule, Section 43B(h) |
| 13 | /tools/sec43b/ | Statutory dues allowed on payment basis |
| 14 | /tools/sec269su/ | Digital payment modes, Section 269SU |
| 15 | /tools/sec94b/ | Thin capitalisation interest limit calculator |
| 16 | /tools/sec234f/ | Late filing fee calculator for Section 234F |
| 17 | /tools/sec234d/ | Interest on excess refund calculator |
| 18 | /tools/sec244a/ | Interest on refund calculator |
| 19 | /tools/penalty/ | Late fee and penalty calculator |
| 20 | /tools/sec115bbe/ | Unexplained income tax, Section 115BBE |
| 21 | /tools/sec270a/ | Under-reporting penalty, Section 270A |
| 22 | /tools/cash269/ | Cash transaction limits, Section 269ST, 269SS and 269T |
| 23 | /tools/cash40a/ | Cash payment disallowance, Section 40A(3) |
| 24 | /tools/ais/ | AIS and Form 26AS reconciliation tool |
| 25 | /tools/itru/ | Updated return calculator, ITR-U |
| 26 | /tools/tp3ceb/ | Form 3CEB applicability checker |
| 27 | /tools/trustreg/ | Trust registration guide, Section 12AB and 80G |
| 28 | /tools/trustapp/ | Trust income application calculator |

### A.5 Money and loans (17 calculators, hub anchor /tools/#finance)

| # | URL | H1 |
|---|---|---|
| 1 | /tools/emi/ | EMI and loan amortisation calculator |
| 2 | /tools/nps/ | NPS corpus and pension calculator |
| 3 | /tools/eps/ | EPS pension calculator |
| 4 | /tools/ppf/ | PPF maturity calculator |
| 5 | /tools/pfint/ | Taxable provident fund interest calculator |
| 6 | /tools/ssy/ | Sukanya Samriddhi Yojana calculator |
| 7 | /tools/scss/ | Senior citizens savings scheme calculator |
| 8 | /tools/retirement/ | Retirement corpus calculator |
| 9 | /tools/childedu/ | Children's education corpus calculator |
| 10 | /tools/hlv/ | Life insurance need calculator |
| 11 | /tools/networth/ | Personal net worth statement |
| 12 | /tools/investments/ | Investment returns calculator |
| 13 | /tools/sipelss/ | SIP and ELSS comparison calculator |
| 14 | /tools/sgb/ | Sovereign gold bond return calculator |
| 15 | /tools/reit/ | REIT and InvIT taxation calculator |
| 16 | /tools/fdtax/ | FD and RD post-tax return calculator |
| 17 | /tools/loandeduct/ | Education and electric vehicle loan interest deduction |

### A.6 NRI and cross-border (11 calculators, hub anchor /tools/#nri)

| # | URL | H1 |
|---|---|---|
| 1 | /tools/nri/ | NRI residential status checker |
| 2 | /tools/nrirepat/ | NRO and NRE repatriation guide |
| 3 | /tools/dtaa/ | DTAA withholding rate finder |
| 4 | /tools/sec195/ | TDS on payments to non-residents, Section 195 |
| 5 | /tools/form10f/ | Form 10F declaration guide |
| 6 | /tools/schedfa/ | Schedule FA foreign asset disclosure guide |
| 7 | /tools/sec115ad/ | Foreign portfolio investor tax calculator |
| 8 | /tools/ftc/ | Foreign tax credit calculator for Form 67 |
| 9 | /tools/lrs/ | LRS and TCS on foreign remittance |
| 10 | /tools/sec89a/ | Foreign retirement benefit tax, Section 89A |
| 11 | /tools/equalisation/ | Equalisation levy calculator |

### A.7 Generators and utilities (2 calculators, hub anchor /tools/#utilities)

| # | URL | H1 |
|---|---|---|
| 1 | /tools/rentreceipt/ | Rent receipt generator |
| 2 | /tools/validator/ | PAN, GSTIN and IFSC format validator |

