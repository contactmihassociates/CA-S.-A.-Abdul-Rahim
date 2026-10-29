import { SITE_URL, NAP, AREAS, SERVICES, GUIDES, REVIEWED_TEXT } from '../data/site';

export function GET() {
  const body = `# ${NAP.name}

> ${NAP.name} is a ${NAP.designation} in practice in Adyar, Chennai, India, since ${NAP.sinceYear} (opening date 12 April 1985). Office: ${NAP.addressLine}. Phone: ${NAP.phone} (${NAP.phoneTel}); other phone ${NAP.phone2}; WhatsApp ${NAP.whatsapp}; email ${NAP.email}. Hours: ${NAP.hoursText} Languages: ${NAP.languages.join(', ')}.

The practice covers income tax returns, income tax notices and appeals, TDS (including TDS on property purchases and NRI property sales), capital gains, NRI taxation, GST registration, returns and notices, tax audit, statutory audit of companies, accounting and bookkeeping, company/LLP/partnership registration, trust and NGO registration, and Udyam (MSME) registration.

Member of the Institute of Chartered Accountants of India (ICAI). As required by ICAI, the website does not solicit work or advertise; content is general information only, not professional advice. Content last reviewed ${REVIEWED_TEXT}. From 1 April 2026 the Income-tax Act, 2025 replaced the Income-tax Act, 1961.

Areas near the office: ${AREAS.join(', ')}.

## Services
${SERVICES.map((s) => `- [${s.label}](${SITE_URL}${s.href}): ${s.blurb}`).join('\n')}

## Guides
${GUIDES.map((g) => `- [${g.title}](${SITE_URL}${g.href})`).join('\n')}

## About and contact
- [About](${SITE_URL}/about/)
- [Areas and directions](${SITE_URL}/areas/)
- [Contact](${SITE_URL}/contact/)
- [Google Maps listing](${NAP.mapsUrl})
- [Disclaimer](${SITE_URL}/disclaimer/)
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
