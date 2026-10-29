# Work log

One line per task: date, task, what changed (old → new), where, how to undo.

| Date | Task | What changed | Where | Undo |
|---|---|---|---|---|
| 2026-10-29 | Search Console set-up | Domain property casaabdulrahim.in added under hsnnml@gmail.com; verified by DNS TXT `google-site-verification=tO49_…coqg`; sitemap submitted (Success, 195 pages) | GSC; GoDaddy DNS | Remove property in GSC; delete the TXT record at GoDaddy (verification is lost) |
| 2026-10-29 | One-page income tax calculator | New page /tools/income-tax-calculator/ (engine public/js/itcalc-core.js, 68 tests in scripts/test-itcalc.mjs) | site | `git revert a0a2fd4` |
| 2026-10-30 | Handover 6.1 task 1 (pending SEO update zip) | Merged by hand, not unzipped over the repo (the zip predates the logo, LinkedIn and calculator changes): home FAQ (5) + FAQPage, 5 new guides, guides list 6 → 11, FAQs on 11 calculators (src/data/tool-faqs.ts), fix in the TDS-on-property guide | site | revert the commit "Homepage FAQ, 5 guides, FAQs on 11 calculators" |
| 2026-10-30 | Rule fixes (master handover 2.1) | Removed `logo` from AccountingService schema; contact/home map embed: GBP listing card (showed star rating) → plain pin at 13.0003461, 80.2571196 | src/data/schema.ts, src/data/site.ts | re-add `logo`; set mapEmbed back to `maps?cid=16323173430388216385&output=embed` |
| 2026-10-30 | Calculator links | Full income tax calculator linked from /income-tax-return-filing-chennai/ sidebar (already linked from home, /tools/, /tools/it/) | src/layouts/Service.astro | remove the `<li>` |
