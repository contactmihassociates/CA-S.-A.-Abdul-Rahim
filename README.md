# casaabdulrahim.in

Static website for CA S. A. Abdul Rahim, Chartered Accountant, Adyar, Chennai. Built with Astro (static output), plain CSS, self-hosted fonts and one small script. Hosted on Vercel.

## Commands

| Command | What it does |
|---|---|
| `npm install` | Install dependencies |
| `npm run dev` | Local development server at http://localhost:4321 |
| `npm run build` | Build the site into `dist/` |
| `npm run check:all` | Run all checks on `dist/` (run after build) |
| `node scripts/screenshots.mjs` | Screenshots at 390 px and 1366 px (needs `npx astro preview` running and Chrome installed) |
| `node scripts/make-og.mjs` | Rebuild the 1200×630 share image |

## Where things live

- `src/data/site.ts`: name, address, phones, hours, areas, services, guides, official source links, review date. Change NAP only here.
- `src/data/schema.ts`: JSON-LD (AccountingService, Person, BreadcrumbList, Service, FAQPage, Article).
- `src/layouts/Base.astro`: head tags, header, footer, mobile Call/WhatsApp bar.
- `src/layouts/Service.astro`: shared layout for service pages and guides (FAQ, contact block, related links, sources, last reviewed).
- `src/pages/`: one file per page. `[VERIFY]` and `[CONFIRM]` markers use `src/components/V.astro`.
- `vercel.json`: security headers (CSP, HSTS, X-Frame-Options and others), cache rules, www redirect.
- `public/robots.txt`, `src/pages/sitemap.xml.ts`, `src/pages/llms.txt.ts`.

## Checks (`scripts/`)

- `check-banned.mjs`: ICAI banned words (best, leading, top, expert, No. 1, guaranteed, cheapest, free consultation, why choose us, testimonial, review, discount, price and more).
- `check-nap.mjs`: exact name, address and phone on every page and in schema; the numbers 094447 97222 and 095510 78603 never appear.
- `check-links.mjs`: every internal link and asset resolves.
- `check-jsonld.mjs`: JSON-LD parses, required properties present, no rating/review markup, FAQ schema matches visible FAQs.
- `check-pages.mjs`: title ≤ 60, description ≤ 155, one H1, canonical, "Last reviewed", official source link, word counts, FAQ answer length, open `[VERIFY]`/`[CONFIRM]` markers.

## Updating content

1. Edit the page in `src/pages/`.
2. When the content is checked again, update `REVIEWED_ISO` and `REVIEWED_TEXT` in `src/data/site.ts`.
3. `npm run build && npm run check:all`
4. Commit and push; Vercel rebuilds automatically.

## Deployment (Vercel)

- `vercel.json` sets the build (`npm run build`, output `dist`), trailing slashes, security headers (CSP, HSTS, X-Frame-Options and others), cache rules and the `www` to apex redirect.
- Node.js version: Vercel default (24.x).
- Custom domains: `casaabdulrahim.in` (primary) and `www.casaabdulrahim.in`. At GoDaddy, add the A and CNAME records Vercel shows under Project Settings, Domains.
- Every push to `main` deploys automatically.
