import { SITE_URL, NAP, AREAS, SERVICES, GUIDES, REVIEWED_TEXT } from '../data/site';
import { TOOLS, CATEGORIES } from '../data/tools';

export function GET() {
  const body = `# ${NAP.name}

> ${NAP.name} is a ${NAP.designation} in practice in Adyar, Chennai, India, since ${NAP.sinceYear} (opening date 12 April 1985). Office: ${NAP.addressLine}. Phone: ${NAP.phone} (${NAP.phoneTel}); other phones ${NAP.phone2} and ${NAP.phone3}; WhatsApp ${NAP.whatsapp}; email ${NAP.email}. Hours: ${NAP.hoursText} Languages: ${NAP.languages.join(', ')}.

The practice covers income tax returns, income tax notices and appeals, TDS (including TDS on property purchases and NRI property sales), capital gains, NRI taxation, GST registration, returns and notices, tax audit, statutory audit of companies, accounting and bookkeeping, company/LLP/partnership registration, trust and NGO registration, and Udyam (MSME) registration.

As required by the Institute of Chartered Accountants of India (ICAI), the website does not solicit work or advertise; content is general information only, not professional advice. Content last reviewed ${REVIEWED_TEXT}. From 1 April 2026 the Income-tax Act, 2025 replaced the Income-tax Act, 1961.

Areas near the office: ${AREAS.join(', ')}.

## Services
${SERVICES.map((s) => `- [${s.label}](${SITE_URL}${s.href}): ${s.blurb}`).join('\n')}

## Guides
${GUIDES.map((g) => `- [${g.title}](${SITE_URL}${g.href})`).join('\n')}

## Calculators
- [Income tax calculator, old vs new regime](${SITE_URL}/tools/income-tax-calculator/): full statement of income and tax with every head of income, capital gains at special rates, deductions, 87A rebate, surcharge with marginal relief and cess.
- [All calculators](${SITE_URL}/tools/): ${TOOLS.length} tax, GST, TDS and finance calculators. Results are estimates for the figures entered.
${CATEGORIES.map((c) => `\n### ${c.label}\n` + c.tools.map((k) => TOOLS.find((t) => t.key === k)!).map((t) => `- [${t.copy.h1}](${SITE_URL}/tools/${t.key}/): ${t.copy.description}`).join('\n')).join('\n')}

## About and contact
- [About](${SITE_URL}/about/)
- [Areas and directions](${SITE_URL}/areas/)
- [Contact](${SITE_URL}/contact/)
- [Google Maps listing](${NAP.mapsUrl})
- [LinkedIn profile](${NAP.linkedin})
- [Notes blog](${NAP.blog})
- [Privacy](${SITE_URL}/privacy/)

## Facts for citation
- Name: ${NAP.name}, ${NAP.designation}
- Address: ${NAP.addressLine}
- Phones: ${NAP.phone} (primary), ${NAP.phone2}, ${NAP.phone3}; WhatsApp ${NAP.whatsapp}
- Email: ${NAP.email}
- Hours: ${NAP.hoursText}
- In practice since: 12 April 1985
- Languages: ${NAP.languages.join(", ")}
- Google Maps: ${NAP.mapsUrl}
- [Disclaimer](${SITE_URL}/disclaimer/)
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
