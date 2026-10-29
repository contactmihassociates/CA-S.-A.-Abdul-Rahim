// Internal links between service pages, guides and calculators (paths only; titles come from GUIDES in site.ts).
const g = (slug: string) => `/guides/${slug}/`;

export const SERVICE_GUIDES: Record<string, string[]> = {
  '/income-tax-return-filing-chennai/': [g('documents-for-itr-filing-salaried-pensioners'), g('advance-tax-due-dates-interest'), g('rental-income-tax-let-out-property'), g('income-tax-notice-first-steps')],
  '/income-tax-notice-reply-chennai/': [g('income-tax-notice-first-steps'), g('advance-tax-due-dates-interest')],
  '/capital-gains-tax-property-sale/': [g('capital-gains-exemption-new-house-cgas'), g('nri-selling-property-chennai-tds-lower-certificate'), g('tds-on-property-purchase-50-lakh-step-by-step')],
  '/nri-taxation-itr-chennai/': [g('nri-selling-property-chennai-tds-lower-certificate'), g('buying-property-from-nri-tds-tan-rates')],
  '/tds-on-property-purchase-26qb/': [g('tds-on-property-purchase-50-lakh-step-by-step'), g('late-tds-on-property-interest-late-fee'), g('correct-mistake-tds-on-property-form-141-26qb'), g('joint-buyers-sellers-tds-on-property'), g('tds-property-seller-no-pan-inoperative-pan'), g('buying-property-from-nri-tds-tan-rates')],
  '/nri-property-sale-tds-lower-tds-certificate/': [g('nri-selling-property-chennai-tds-lower-certificate'), g('buying-property-from-nri-tds-tan-rates'), g('capital-gains-exemption-new-house-cgas')],
  '/tds-return-filing/': [g('late-tds-on-property-interest-late-fee'), g('tds-property-seller-no-pan-inoperative-pan')],
  '/gst-registration-chennai/': [g('gst-registration-documents-process')],
  '/gst-return-filing/': [g('gstr-9-annual-return-who-files-due-date')],
  '/gst-notice-reply/': [g('gstr-9-annual-return-who-files-due-date')],
  '/tax-audit/': [g('tax-audit-who-needs-it-what-to-prepare'), g('advance-tax-due-dates-interest')],
  '/statutory-audit/': [g('tax-audit-who-needs-it-what-to-prepare')],
  '/accounting-bookkeeping/': [g('gstr-9-annual-return-who-files-due-date'), g('tax-audit-who-needs-it-what-to-prepare')],
};

export const TOOL_GUIDES: Record<string, string[]> = {
  sec194ia: [g('tds-on-property-purchase-50-lakh-step-by-step'), g('joint-buyers-sellers-tds-on-property'), g('tds-property-seller-no-pan-inoperative-pan')],
  stampduty: [g('tds-on-property-purchase-50-lakh-step-by-step')],
  tdslate: [g('late-tds-on-property-interest-late-fee')],
  sec195: [g('buying-property-from-nri-tds-tan-rates'), g('nri-selling-property-chennai-tds-lower-certificate')],
  nrirepat: [g('nri-selling-property-chennai-tds-lower-certificate')],
  capgains: [g('capital-gains-exemption-new-house-cgas'), g('nri-selling-property-chennai-tds-lower-certificate')],
  sec54ec: [g('capital-gains-exemption-new-house-cgas')],
  cgreinvest: [g('capital-gains-exemption-new-house-cgas')],
  hp: [g('rental-income-tax-let-out-property')],
  rentreceipt: [g('rental-income-tax-let-out-property')],
  advtax: [g('advance-tax-due-dates-interest')],
  it: [g('documents-for-itr-filing-salaried-pensioners'), g('advance-tax-due-dates-interest')],
  hra: [g('documents-for-itr-filing-salaried-pensioners')],
  gstr9: [g('gstr-9-annual-return-who-files-due-date')],
  regst: [g('gst-registration-documents-process')],
  gst: [g('gst-registration-documents-process')],
  audit: [g('tax-audit-who-needs-it-what-to-prepare')],
  penalty: [g('income-tax-notice-first-steps')],
};
