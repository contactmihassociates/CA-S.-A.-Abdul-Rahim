// ICAI: no superlatives, solicitation, testimonials or prices. Searches visible text, title, meta and JSON-LD.
import { htmlFiles, read, urlOf, visibleText, title, meta, jsonld } from './lib.mjs';
const BANNED = ['best', 'leading', 'top', 'expert', 'experts', 'No\\. ?1', 'number one', 'guaranteed', 'guarantee', 'cheapest', 'free consultation', 'why choose us', 'testimonial', 'testimonials', 'review', 'reviews', 'rating', 'discount', 'price', 'prices', 'pricing', 'hire us', 'book now', 'limited offer', 'trusted by'];
const re = new RegExp(`\\b(${BANNED.join('|')})\\b`, 'gi');
let hits = 0;
const files = htmlFiles();
for (const f of files) {
  const h = read(f);
  const text = [title(h), meta(h, 'description'), visibleText(h), ...jsonld(h)].join(' ');
  const found = [...text.matchAll(re)].map((m) => text.slice(Math.max(0, m.index - 40), m.index + 40));
  if (found.length) { hits += found.length; console.log(`FAIL ${urlOf(f)}`); found.forEach((s) => console.log('   ...' + s + '...')); }
}
console.log(hits ? `\n${hits} banned-word hit(s)` : `PASS: 0 banned words in ${files.length} pages (words: ${BANNED.join(', ').replace(/\\/g, '')})`);
process.exit(hits ? 1 : 0);
