// Exact name, address and phone must appear on every page and in the schema; banned numbers must not appear anywhere.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { htmlFiles, read, urlOf, visibleText, jsonld } from './lib.mjs';
const NAME = 'CA S. A. Abdul Rahim';
const ADDR = '14/2, 15th Cross Street, Shastri Nagar, Adyar, Chennai, Tamil Nadu 600020';
const PHONE = '07397 283 223';
const NEVER = [/94447\s?97222/]; // 095510 78603 is a confirmed office number (owner, 30 Oct 2026)
let bad = 0;
const files = htmlFiles();
for (const f of files) {
  const h = read(f); const t = visibleText(h); const ld = jsonld(h).join('');
  const miss = [];
  if (!t.includes(NAME)) miss.push('name');
  if (!t.includes(ADDR)) miss.push('address');
  if (!t.includes(PHONE)) miss.push('phone');
  if (!ld.includes('"name":"CA S. A. Abdul Rahim"') || !ld.includes('"telephone":"+917397283223"') || !ld.includes('"streetAddress":"14/2, 15th Cross Street, Shastri Nagar"') || !ld.includes('"postalCode":"600020"')) miss.push('schema NAP');
  if (miss.length) { bad++; console.log(`FAIL ${urlOf(f)}: missing ${miss.join(', ')}`); }
  else console.log(`ok   ${urlOf(f)}`);
}
function all(d) { return readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? all(p) : [p]; }); }
for (const f of all('dist').filter((p) => /\.(html|txt|xml|js|json)$/.test(p))) {
  const s = readFileSync(f, 'utf8');
  for (const r of NEVER) if (r.test(s)) { bad++; console.log(`FAIL forbidden number ${r} in ${f}`); }
}
console.log(bad ? `\n${bad} problem(s)` : `\nPASS: name, address and phone identical on all ${files.length} pages and in schema; 094447 97222 absent from every built file`);
process.exit(bad ? 1 : 0);
