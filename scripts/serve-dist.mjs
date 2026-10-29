// Serve dist/ with the response headers from vercel.json (CSP and others), so checks run under production rules.
// Usage: node scripts/serve-dist.mjs [port]   (default 4322)
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const port = Number(process.argv[2] || 4322);
const root = path.resolve('dist');
const conf = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8' };
const toRegex = (src) => new RegExp('^' + src.replace(/\(\.\*\)/g, '.*') + '$');

http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  let file = path.join(root, url);
  if (!file.startsWith(root)) { res.writeHead(403); return res.end(); }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  const found = fs.existsSync(file);
  if (!found) file = path.join(root, '404.html');
  for (const rule of conf.headers) if (toRegex(rule.source).test(url)) for (const h of rule.headers) res.setHeader(h.key, h.value);
  res.writeHead(found ? 200 : 404, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
}).listen(port, () => console.log(`dist on http://localhost:${port} with vercel.json headers`));
