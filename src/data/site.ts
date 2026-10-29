// Single source of truth for name, address and phone (NAP).
// These strings must match the Google Business Profile exactly.

export const SITE_URL = 'https://casaabdulrahim.in';

export const REVIEWED_ISO = '2026-10-29';
export const REVIEWED_TEXT = '29 October 2026';

export const NAP = {
  name: 'CA S. A. Abdul Rahim',
  person: 'S. A. Abdul Rahim',
  designation: 'Chartered Accountant',
  street: '14/2, 15th Cross Street, Shastri Nagar',
  locality: 'Adyar',
  city: 'Chennai',
  region: 'Tamil Nadu',
  regionCode: 'TN',
  postcode: '600020',
  country: 'IN',
  // Exact display string used on every page
  addressLine: '14/2, 15th Cross Street, Shastri Nagar, Adyar, Chennai, Tamil Nadu 600020',
  phone: '07397 283 223',
  phoneTel: '+917397283223',
  phone2: '099402 78603',
  phone2Tel: '+919940278603',
  whatsapp: '+91 99402 78603',
  email: 'enquiry@casaabdulrahim.in',
  whatsappLink: 'https://wa.me/919940278603?text=' + encodeURIComponent('Hello, I would like information about'),
  lat: 13.0003461,
  lng: 80.2571196,
  mapsUrl: 'https://www.google.com/maps/place/?cid=16323173430388216385',
  directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=13.0003461%2C80.2571196',
  mapEmbed: 'https://www.google.com/maps?q=13.0003461,80.2571196&z=16&output=embed',
  blog: 'https://casaabdulrahim-notes.blogspot.com/',
  foundingDate: '1985-04-12',
  sinceYear: 1985,
  languages: ['Tamil', 'English', 'Hindi'],
  hoursText: 'Monday to Saturday, 8:00 am to 8:00 pm. Sunday closed.',
};

export const AREAS = [
  'Adyar', 'Indira Nagar', 'Gandhi Nagar', 'Kasturba Nagar', 'Shastri Nagar', 'Kotturpuram',
  'Besant Nagar', 'Thiruvanmiyur', 'Kottivakkam', 'Mylapore', 'Mandaveli', 'R.A. Puram',
  'Teynampet', 'Taramani', 'Alwarpet', 'Velachery', 'Guindy', 'Saidapet', 'T. Nagar', 'Nungambakkam',
];

export interface ServiceLink { href: string; label: string; group: string; blurb: string }

export const SERVICES: ServiceLink[] = [
  { group: 'Income tax', href: '/income-tax-return-filing-chennai/', label: 'Income tax return (ITR) filing', blurb: 'Salaried, pensioners, senior citizens, business, professionals, rental income and refunds.' },
  { group: 'Income tax', href: '/income-tax-notice-reply-chennai/', label: 'Income tax notice reply and appeals', blurb: 'Replies to notices and demands, appeals before CIT(A), updated returns.' },
  { group: 'Income tax', href: '/capital-gains-tax-property-sale/', label: 'Capital gains on property sale', blurb: 'Tax on sale of a house, flat or land, exemptions and reporting.' },
  { group: 'Income tax', href: '/nri-taxation-itr-chennai/', label: 'NRI income tax and ITR', blurb: 'Residential status, Indian income of NRIs and return filing.' },
  { group: 'TDS', href: '/tds-on-property-purchase-26qb/', label: 'TDS on property purchase (Form 141, earlier 26QB)', blurb: 'TDS when you buy a property of Rs 50 lakh or more, including from an NRI.' },
  { group: 'TDS', href: '/nri-property-sale-tds-lower-tds-certificate/', label: 'NRI property sale and lower TDS certificate', blurb: 'TDS on sale by an NRI, lower or nil TDS certificate, repatriation basics.' },
  { group: 'TDS', href: '/tds-return-filing/', label: 'TDS return filing', blurb: 'Quarterly TDS statements, TDS certificates and TRACES defaults.' },
  { group: 'GST', href: '/gst-registration-chennai/', label: 'GST registration', blurb: 'Who needs it, documents and the steps on the GST portal.' },
  { group: 'GST', href: '/gst-return-filing/', label: 'GST return filing', blurb: 'GSTR-1, GSTR-3B, annual returns and input tax credit reconciliation.' },
  { group: 'GST', href: '/gst-notice-reply/', label: 'GST notice reply', blurb: 'Replies to GST notices, scrutiny, assessments and audits.' },
  { group: 'Audit and accounts', href: '/tax-audit/', label: 'Tax audit', blurb: 'Who needs a tax audit and what to prepare.' },
  { group: 'Audit and accounts', href: '/statutory-audit/', label: 'Statutory audit of companies', blurb: 'Audit of private limited companies under the Companies Act, 2013.' },
  { group: 'Audit and accounts', href: '/accounting-bookkeeping/', label: 'Accounting and bookkeeping', blurb: 'Monthly accounts in Tally, bank reconciliation and year-end closing.' },
  { group: 'Registrations', href: '/company-llp-registration-chennai/', label: 'Company, LLP and partnership registration', blurb: 'Private limited company, LLP and partnership firm registration, ROC compliance.' },
  { group: 'Registrations', href: '/trust-ngo-12a-80g-registration/', label: 'Trust and NGO registration, 12A and 80G', blurb: 'Trust and society registration, income-tax registration, ITR-7 and audit.' },
  { group: 'Registrations', href: '/udyam-msme-registration/', label: 'Udyam (MSME) registration', blurb: 'Udyam registration for micro, small and medium enterprises.' },
];

export const GUIDES = [
  { href: '/guides/documents-for-itr-filing-salaried-pensioners/', title: 'Documents needed for ITR filing (salaried and pensioners)', published: '2026-10-29' },
  { href: '/guides/tds-on-property-purchase-50-lakh-step-by-step/', title: 'TDS when you buy a property worth Rs 50 lakh or more: step by step', published: '2026-10-29' },
  { href: '/guides/nri-selling-property-chennai-tds-lower-certificate/', title: 'NRI selling property in Chennai: TDS and lower TDS certificate', published: '2026-10-29' },
  { href: '/guides/gst-registration-documents-process/', title: 'GST registration documents and process', published: '2026-10-29' },
  { href: '/guides/income-tax-notice-first-steps/', title: 'Received an income tax notice: first steps', published: '2026-10-29' },
  { href: '/guides/tax-audit-who-needs-it-what-to-prepare/', title: 'Tax audit: who needs it and what to prepare', published: '2026-10-29' },
];

// Official sources used across pages
export const SRC = {
  itPortal: { href: 'https://www.incometax.gov.in/', label: 'Income Tax Department e-filing portal (incometax.gov.in)' },
  itIndia: { href: 'https://www.incometaxindia.gov.in/', label: 'Income Tax Department (incometaxindia.gov.in)' },
  form141: { href: 'https://www.incometax.gov.in/iec/foportal/help/all-topics/e-filing-services/form-141-faqs', label: 'FAQs on Form 141, incometax.gov.in' },
  itForms2026: { href: 'https://www.incometaxindia.gov.in/faqs-and-guidance-notes-on-forms-as-per-income-tax-rules-2026', label: 'FAQs and guidance notes on forms under the Income-tax Rules, 2026' },
  itForms: { href: 'https://www.incometax.gov.in/iec/foportal/help/all-topics/e-filing-services/income-tax-forms', label: 'Income-tax forms, incometax.gov.in' },
  traces: { href: 'https://www.tdscpc.gov.in/', label: 'TRACES (TDS Reconciliation Analysis and Correction Enabling System)' },
  gst: { href: 'https://www.gst.gov.in/', label: 'GST portal (gst.gov.in)' },
  gstReg: { href: 'https://reg.gst.gov.in/registration/', label: 'GST registration, gst.gov.in' },
  cbic: { href: 'https://cbic-gst.gov.in/', label: 'CBIC GST (cbic-gst.gov.in)' },
  mca: { href: 'https://www.mca.gov.in/', label: 'Ministry of Corporate Affairs (mca.gov.in)' },
  udyam: { href: 'https://udyamregistration.gov.in/', label: 'Udyam Registration portal (udyamregistration.gov.in)' },
  tnreginet: { href: 'https://tnreginet.gov.in/', label: 'Registration Department, Tamil Nadu (tnreginet.gov.in)' },
  rbi: { href: 'https://www.rbi.org.in/', label: 'Reserve Bank of India (rbi.org.in)' },
  icai: { href: 'https://www.icai.org/', label: 'Institute of Chartered Accountants of India (icai.org)' },
};
