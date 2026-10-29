// Parses every JSON-LD block, checks required properties, @id references and that FAQ schema matches visible FAQs.
import { htmlFiles, read, urlOf, visibleText, jsonld } from './lib.mjs';
let errors = 0;
const err = (p, m) => { errors++; console.log(`ERROR ${p}: ${m}`); };
const REQ = {
  AccountingService: ['name', 'url', 'telephone', 'address', 'geo', 'openingHoursSpecification', 'areaServed', 'knowsLanguage', 'foundingDate', 'sameAs', 'hasMap'],
  Person: ['name', 'jobTitle', 'worksFor'],
  BreadcrumbList: ['itemListElement'],
  Service: ['name', 'provider', 'areaServed'],
  FAQPage: ['mainEntity'],
  Article: ['headline', 'author', 'datePublished', 'dateModified', 'image', 'publisher'],
};
const files = htmlFiles();
for (const f of files) {
  const p = urlOf(f); const h = read(f); const blocks = jsonld(h);
  if (!blocks.length) { err(p, 'no JSON-LD'); continue; }
  for (const b of blocks) {
    let d; try { d = JSON.parse(b); } catch (e) { err(p, 'invalid JSON: ' + e.message); continue; }
    if (d['@context'] !== 'https://schema.org') err(p, 'bad @context');
    const graph = d['@graph'] || [d];
    const ids = new Set(graph.map((n) => n['@id']).filter(Boolean));
    const types = graph.map((n) => n['@type']);
    for (const t of ['AccountingService', 'Person', 'BreadcrumbList']) if (!types.includes(t)) err(p, `missing ${t}`);
    for (const n of graph) for (const k of REQ[n['@type']] || []) if (n[k] === undefined) err(p, `${n['@type']} missing ${k}`);
    if (/"(aggregateRating|review)"/.test(b)) err(p, 'forbidden rating/review markup');
    for (const m of b.matchAll(/\{"@id":"([^"]+)"\}/g)) if (!ids.has(m[1])) err(p, `dangling @id ${m[1]}`);
    const faq = graph.find((n) => n['@type'] === 'FAQPage');
    if (faq) {
      const vis = visibleText(h);
      for (const q of faq.mainEntity) {
        if (!vis.includes(q.name)) err(p, `FAQ question not visible: ${q.name}`);
        if (!vis.includes(q.acceptedAnswer.text)) err(p, `FAQ answer not visible: ${q.name}`);
      }
    }
    const bc = graph.find((n) => n['@type'] === 'BreadcrumbList');
    bc.itemListElement.forEach((it, i) => { if (it.position !== i + 1 || !it.item.startsWith('https://casaabdulrahim.in/')) err(p, 'bad breadcrumb item'); });
    console.log(`ok   ${p}: ${types.join(', ')}`);
  }
}
console.log(errors ? `\n${errors} error(s)` : `\nPASS: JSON-LD parsed and checked on all ${files.length} pages, 0 errors`);
process.exit(errors ? 1 : 0);
