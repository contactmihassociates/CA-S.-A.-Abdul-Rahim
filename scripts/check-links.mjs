// Every internal link and asset must resolve to a built file, with trailing-slash page URLs.
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { htmlFiles, read, urlOf } from './lib.mjs';
let broken = 0, checked = 0;
for (const f of htmlFiles()) {
  const h = read(f);
  for (const m of h.matchAll(/(?:href|src)="([^"]+)"/g)) {
    let u = m[1];
    if (/^(https?:|tel:|mailto:|data:)/.test(u)) continue;
    u = u.split('#')[0].split('?')[0];
    if (!u) continue;
    checked++;
    const p = join('dist', u);
    const ok = u.endsWith('/') ? existsSync(join(p, 'index.html')) : existsSync(p);
    if (!ok) { broken++; console.log(`BROKEN ${urlOf(f)} -> ${m[1]}`); }
    else if (!u.endsWith('/') && !/\.[a-z0-9]+$/i.test(u)) { broken++; console.log(`NO TRAILING SLASH ${urlOf(f)} -> ${m[1]}`); }
  }
}
console.log(broken ? `\n${broken} broken link(s)` : `PASS: ${checked} internal links/assets checked, 0 broken`);
process.exit(broken ? 1 : 0);
