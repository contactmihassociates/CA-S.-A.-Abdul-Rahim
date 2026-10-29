import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

export const DIST = 'dist';
export function htmlFiles(dir = DIST) {
  const out = [];
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) out.push(...htmlFiles(p));
    else if (f.endsWith('.html')) out.push(p);
  }
  return out.sort();
}
export const urlOf = (file) => '/' + relative(DIST, file).replace(/\\/g, '/').replace(/index\.html$/, '').replace(/\.html$/, '');
export const read = (f) => readFileSync(f, 'utf8');
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ');
export function visibleText(html) {
  return decode(html.replace(/<head[\s\S]*?<\/head>/i, ' ').replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
}
export function mainText(html) {
  const m = html.match(/<main[\s\S]*?<\/main>/i);
  return m ? visibleText(m[0]) : '';
}
export const meta = (html, name) => decode((html.match(new RegExp(`<meta name="${name}" content="([^"]*)"`)) || [])[1] || '');
export const title = (html) => decode((html.match(/<title>([^<]*)<\/title>/) || [])[1] || '');
export const jsonld = (html) => [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
