// On-page SEO and ICAI checks: title/description length, one H1, canonical, last reviewed, official source, word counts, FAQ length, open placeholders.
import { htmlFiles, read, urlOf, title, meta, mainText, visibleText } from './lib.mjs';
const OFFICIAL = /href="https:\/\/(www\.)?(incometax\.gov\.in|incometaxindia\.gov\.in|gst\.gov\.in|reg\.gst\.gov\.in|cbic-gst\.gov\.in|mca\.gov\.in|tnreginet\.gov\.in|udyamregistration\.gov\.in|tdscpc\.gov\.in|rbi\.org\.in|icai\.org|meity\.gov\.in)/;
let fail = 0;
const placeholders = [];
const titles = new Set();
console.log('page'.padEnd(56), 'title', 'desc', 'words', 'faqs');
for (const f of htmlFiles()) {
  const p = urlOf(f);
  if (p === '/404') continue;
  const h = read(f); const t = title(h); const d = meta(h, 'description'); const vis = visibleText(h);
  const words = mainText(h).split(' ').length;
  const probs = [];
  if (t.length > 60) probs.push(`title ${t.length}>60`);
  if (titles.has(t)) probs.push('duplicate title');
  titles.add(t);
  if (d.length > 155 || d.length < 70) probs.push(`description ${d.length}`);
  if ((h.match(/<h1[\s>]/g) || []).length !== 1) probs.push('h1 count');
  if (!h.includes(`<link rel="canonical" href="https://casaabdulrahim.in${p}"`)) probs.push('canonical');
  if (!/Last reviewed/.test(vis)) probs.push('no Last reviewed');
  if (!/Content reviewed on/.test(vis)) probs.push('no footer disclaimer');
  if (!OFFICIAL.test(h)) probs.push('no official source link');
  const isGuide = p.startsWith('/guides/') && p !== '/guides/';
  const isService = h.includes('"@type":"Service"');
  if (isService && words < 600) probs.push(`only ${words} words`);
  if (isGuide && (words < 900 || words > 1700)) probs.push(`guide ${words} words`);
  const faqs = [...h.matchAll(/<h3>([^<]*\?)<\/h3><p>([^<]*)<\/p>/g)];
  for (const m of faqs) { const n = m[2].trim().split(/\s+/).length; if (n < 40 || n > 60) probs.push(`FAQ ${n} words: ${m[1].slice(0, 40)}`); }
  const ph = (vis.match(/\[(VERIFY|CONFIRM)\]/g) || []).length;
  if (ph) placeholders.push(`${p} (${ph})`);
  console.log(p.padEnd(56), String(t.length).padEnd(5), String(d.length).padEnd(4), String(words).padEnd(5), String(faqs.length).padEnd(4), probs.length ? 'FAIL ' + probs.join('; ') : 'ok');
  if (probs.length) fail++;
}
console.log(`\nPages with open [VERIFY]/[CONFIRM] markers: ${placeholders.length}\n  ${placeholders.join('\n  ')}`);
console.log(fail ? `\n${fail} page(s) failing` : '\nPASS: all pages meet title, description, H1, canonical, reviewed-date, source and length rules');
process.exit(fail ? 1 : 0);
