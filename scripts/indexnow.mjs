// Submit URLs to IndexNow (Bing, Yandex, Seznam, Naver; Bing shares with ChatGPT/Copilot search).
// Usage: node scripts/indexnow.mjs            -> every URL in the live sitemap
//        node scripts/indexnow.mjs /path/ ...   -> only these paths
// The key file public/<key>.txt must be live on the site first.
import { readdirSync } from 'node:fs';
const HOST = 'casaabdulrahim.in';
const key = readdirSync('public').find((f) => /^[a-f0-9]{32}\.txt$/.test(f)).replace('.txt', '');
const args = process.argv.slice(2);
let urls;
if (args.length) urls = args.map((p) => `https://${HOST}${p.startsWith('/') ? p : '/' + p}`);
else urls = [...(await (await fetch(`https://${HOST}/sitemap.xml`)).text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const res = await fetch('https://www.bing.com/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key, keyLocation: `https://${HOST}/${key}.txt`, urlList: urls }),
});
console.log(`IndexNow: ${urls.length} URL(s) submitted, HTTP ${res.status} ${res.statusText}`);
process.exit(res.status === 200 || res.status === 202 ? 0 : 1);
