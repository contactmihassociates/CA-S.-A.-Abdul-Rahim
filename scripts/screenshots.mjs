// Full-page screenshots at 390 px and 1366 px, after accepting the disclaimer once (plus one shot of the disclaimer itself).
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';
const BASE = process.env.BASE || 'http://localhost:4321';
const pages = [['home', '/'], ['service-tds-property', '/tds-on-property-purchase-26qb/'], ['contact', '/contact/']];
mkdirSync('reports/screenshots', { recursive: true });
const browser = await chromium.launch({ channel: 'chrome' });
for (const [w, h, label] of [[390, 844, 'mobile-390'], [1366, 900, 'desktop-1366']]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, isMobile: w < 768 });
  const page = await ctx.newPage();
  await page.goto(BASE + '/');
  await page.screenshot({ path: `reports/screenshots/disclaimer-${label}.png` });
  await page.click('#disclaimer-agree');
  for (const [name, path] of pages) {
    await page.goto(BASE + path, { waitUntil: 'networkidle' });
    await page.screenshot({ path: `reports/screenshots/${name}-${label}.png`, fullPage: true });
  }
  await ctx.close();
}
await browser.close();
console.log('screenshots written to reports/screenshots');
