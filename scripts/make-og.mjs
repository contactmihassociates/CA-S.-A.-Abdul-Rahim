// Builds public/og-image.png (1200x630) in the site's navy/gold style. Plain text only, no logo.
import sharp from 'sharp';
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#1B2A4A"/>
  <rect x="0" y="600" width="1200" height="30" fill="#BE9B5A"/>
  <rect x="90" y="250" width="120" height="6" fill="#BE9B5A"/>
  <text x="90" y="220" font-family="Georgia, 'Times New Roman', serif" font-size="78" font-weight="600" fill="#FAF6EE">CA S. A. Abdul Rahim</text>
  <text x="90" y="330" font-family="'Segoe UI', Arial, sans-serif" font-size="40" fill="#E9DCC0">Chartered Accountant · Adyar, Chennai · Since 1985</text>
  <text x="90" y="520" font-family="'Segoe UI', Arial, sans-serif" font-size="30" fill="#BE9B5A">casaabdulrahim.in</text>
</svg>`;
await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile('public/og-image.png');
console.log('og-image.png written');
