// Browser smoke test: every calculator page must mount with no console/page/network errors.
// Needs a static server already running (BASE, default http://localhost:4321). CONCURRENCY defaults to 6.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { chromium } from 'playwright-core';

const BASE = (process.env.BASE || 'http://localhost:4321').replace(/\/$/, '');
const CONCURRENCY = Number(process.env.CONCURRENCY) || 6;
const ORIGIN = new URL(BASE).origin;
const keys = JSON.parse(readFileSync('src/data/tools.json', 'utf8')).tools.map((t) => t.key);

// Runs in the page: true once the calculator is rendered and shows no "could not" message.
const mounted = () => {
  const el = document.querySelector('.tk .active-calculator');
  if (!el || !el.querySelector('.panel, .panel-head, input, select')) return false;
  return !/could not/i.test(el.textContent || '');
};

async function checkTool(browser, key) {
  const errors = [];
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  const sameOrigin = (u) => u.startsWith(ORIGIN);
  const ignorable = (u) => /favicon/i.test(u);
  page.on('console', (m) => {
    // Resource-load console errors are reported by the response/requestfailed handlers instead.
    if (m.type() === 'error' && sameOrigin(m.location().url || ORIGIN) && !/Failed to load resource/.test(m.text()))
      errors.push(`console: ${m.text()}`);
  });
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('response', (r) => {
    if (r.status() >= 400 && sameOrigin(r.url()) && !ignorable(r.url())) errors.push(`HTTP ${r.status()}: ${r.url()}`);
  });
  page.on('requestfailed', (r) => {
    if (sameOrigin(r.url()) && !ignorable(r.url())) errors.push(`request failed: ${r.url()} (${r.failure()?.errorText})`);
  });
  try {
    await page.goto(`${BASE}/tools/${key}/`, { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForFunction(mounted, null, { timeout: 20000 });
    // Light interaction: type into the first number/text input, then make sure nothing throws.
    const input = page.locator('.active-calculator input[type=number], .active-calculator input[type=text]').first();
    if (await input.count()) {
      const before = errors.length;
      await input.fill('100000', { timeout: 5000 }).catch(() => {}); // hidden/readonly inputs are not a failure
      await page.waitForTimeout(300);
      if (errors.length > before) errors.push('new errors after interaction');
    }
  } catch (e) {
    errors.push(`not mounted: ${String(e.message).split('\n')[0]}`);
  }
  await ctx.close();
  return { ok: errors.length === 0, errors };
}

const browser = await chromium.launch({ channel: 'chrome' });
const report = {};
let next = 0;
async function worker() {
  while (next < keys.length) {
    const key = keys[next++];
    report[key] = await checkTool(browser, key);
    const r = report[key];
    console.log(r.ok ? `ok   ${key}` : `FAIL ${key}: ${[...new Set(r.errors)].join(' | ')}`);
  }
}
await Promise.all(Array.from({ length: Math.min(CONCURRENCY, keys.length) }, worker));
await browser.close();

mkdirSync('reports', { recursive: true });
writeFileSync('reports/check-tools.json', JSON.stringify(report, null, 2));
const failing = keys.filter((k) => !report[k].ok).length;
console.log(failing ? `\n${failing} failing of ${keys.length}` : `PASS: ${keys.length}/${keys.length} calculators mounted with no errors`);
process.exit(failing ? 1 : 0);
