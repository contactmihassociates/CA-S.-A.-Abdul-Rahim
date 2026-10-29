// Builds public/og-image.png (1200x630) in the site's navy/gold style, with the CA India logo on its white background.
import sharp from 'sharp';
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0c1a36"/><stop offset="1" stop-color="#13254a"/></linearGradient></defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <rect x="0" y="606" width="1200" height="24" fill="#b8924f"/>
  <rect x="80" y="262" width="110" height="5" fill="#b8924f"/>
  <text x="80" y="150" font-family="'Segoe UI', Arial, sans-serif" font-size="24" letter-spacing="5" fill="#d9bd86">CHARTERED ACCOUNTANT · SINCE 1985</text>
  <text x="80" y="232" font-family="Georgia, 'Times New Roman', serif" font-size="64" font-weight="600" fill="#ffffff">CA S. A. Abdul Rahim</text>
  <text x="80" y="330" font-family="'Segoe UI', Arial, sans-serif" font-size="36" fill="#cdd4e2">Income tax · TDS · GST · Audit · Registrations</text>
  <text x="80" y="384" font-family="'Segoe UI', Arial, sans-serif" font-size="36" fill="#cdd4e2">Shastri Nagar, Adyar, Chennai</text>
  <text x="80" y="530" font-family="'Segoe UI', Arial, sans-serif" font-size="30" fill="#d9bd86">casaabdulrahim.in</text>
  <rect x="880" y="165" width="260" height="260" rx="26" fill="#ffffff"/>
</svg>`;
const logo = await sharp('public/ca-logo.png').resize(224, 224, { fit: 'contain', background: '#ffffff' }).flatten({ background: '#ffffff' }).png().toBuffer();
await sharp(Buffer.from(svg)).composite([{ input: logo, left: 898, top: 183 }]).png({ compressionLevel: 9 }).toFile('public/og-image.png');
console.log('og-image.png written');
