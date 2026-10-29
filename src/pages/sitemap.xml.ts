import { SITE_URL, SERVICES, GUIDES, REVIEWED_ISO } from '../data/site';
import { TOOLS } from '../data/tools';

const paths = [
  '/', '/about/',
  ...SERVICES.map((s) => s.href),
  '/areas/', '/guides/',
  ...GUIDES.map((g) => g.href),
  '/tools/', '/tools/income-tax-calculator/', ...TOOLS.map((t) => `/tools/${t.key}/`),
  '/contact/', '/disclaimer/', '/privacy/',
];

export function GET() {
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((p) => `  <url><loc>${SITE_URL}${p}</loc><lastmod>${REVIEWED_ISO}</lastmod></url>`).join('\n')}
</urlset>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
