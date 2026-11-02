// Writes dist/llms-full.txt: the full text of every content page (services, guides, about, areas), for AI engines.
// Runs after astro build. Calculator pages are left out; /llms.txt lists them.
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { DIST, htmlFiles, urlOf, read, title } from './lib.mjs';

const SITE = 'https://casaabdulrahim.in';
const SKIP = /^\/(tools\/.+|404|privacy\/)/;

const decode = (s) => s.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ');

function toText(html) {
  const m = html.match(/<main[\s\S]*?<\/main>/i);
  if (!m) return '';
  return decode(
    m[0]
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<h([1-4])[^>]*>/gi, (_, n) => '\n\n' + '#'.repeat(Number(n) + 1) + ' ')
      .replace(/<li[^>]*>/gi, '\n- ')
      .replace(/<(td|th)[^>]*>/gi, ' | ')
      .replace(/<\/(p|h[1-6]|tr|table|ul|ol|div|section|details|summary|dt|dd)>/gi, '\n')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]+>/g, ' ')
  )
    .split('\n')
    .map((l) => l.replace(/[ \t]+/g, ' ').trim())
    .filter((l, i, a) => l || (a[i - 1] && a[i - 1].trim()))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

const pages = htmlFiles()
  .map((f) => ({ url: urlOf(f), html: read(f) }))
  .filter((p) => !SKIP.test(p.url))
  .sort((a, b) => (a.url === '/' ? -1 : b.url === '/' ? 1 : a.url.localeCompare(b.url)));

const parts = pages.map((p) => `# ${title(p.html)}\nURL: ${SITE}${p.url}\n\n${toText(p.html)}`);
const head = `# CA S. A. Abdul Rahim: full text of casaabdulrahim.in

> Full text of the service pages, guides and office pages of CA S. A. Abdul Rahim, Chartered Accountant, Adyar, Chennai. General information only, not professional advice. Summary and links: ${SITE}/llms.txt

`;
writeFileSync(join(DIST, 'llms-full.txt'), head + parts.join('\n\n---\n\n') + '\n');
console.log(`llms-full.txt: ${pages.length} pages`);
