import { NAP, AREAS, SITE_URL, SERVICES } from './site';

export const ORG_ID = `${SITE_URL}/#accountingservice`;
export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export const website = {
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: `${SITE_URL}/`,
  name: NAP.name,
  inLanguage: 'en-IN',
  publisher: { '@id': ORG_ID },
};

export const accountingService = {
  '@type': 'AccountingService',
  '@id': ORG_ID,
  name: NAP.name,
  url: `${SITE_URL}/`,
  telephone: NAP.phoneTel,
  email: NAP.email,
  contactPoint: [
    { '@type': 'ContactPoint', contactType: 'office', telephone: NAP.phoneTel, email: NAP.email, availableLanguage: NAP.languages },
    { '@type': 'ContactPoint', contactType: 'office', telephone: NAP.phone2Tel },
    { '@type': 'ContactPoint', contactType: 'office', telephone: NAP.phone3Tel },
  ],
  image: `${SITE_URL}/og-image.png`,
  address: {
    '@type': 'PostalAddress',
    streetAddress: NAP.street,
    addressLocality: `${NAP.locality}, ${NAP.city}`,
    addressRegion: NAP.region,
    postalCode: NAP.postcode,
    addressCountry: NAP.country,
  },
  geo: { '@type': 'GeoCoordinates', latitude: NAP.lat, longitude: NAP.lng },
  hasMap: NAP.mapsUrl,
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '08:00',
      closes: '20:00',
    },
  ],
  areaServed: AREAS.map((a) => ({ '@type': 'Place', name: `${a}, Chennai` })),
  knowsLanguage: NAP.languages,
  foundingDate: NAP.foundingDate,
  founder: { '@id': PERSON_ID },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Areas of practice',
    itemListElement: SERVICES.map((sv) => ({ '@type': 'Service', name: sv.label, url: `${SITE_URL}${sv.href}` })),
  },
  sameAs: [NAP.mapsUrl, NAP.gbpUrl, NAP.linkedin, NAP.blog],
};

export const person = {
  '@type': 'Person',
  '@id': PERSON_ID,
  name: NAP.person,
  jobTitle: NAP.designation,
  worksFor: { '@id': ORG_ID },
  knowsLanguage: NAP.languages,
  url: `${SITE_URL}/about/`,
  sameAs: [NAP.linkedin],
  hasOccupation: { '@type': 'Occupation', name: 'Chartered Accountant' },
  memberOf: { '@type': 'Organization', name: 'The Institute of Chartered Accountants of India', url: 'https://www.icai.org/' },
  knowsAbout: ['Income tax return filing', 'TDS on property purchase', 'NRI taxation', 'Capital gains on property', 'Goods and Services Tax (GST)', 'Tax audit', 'Statutory audit', 'Company and LLP registration'],
};

export function breadcrumb(items: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path}`,
    })),
  };
}

export function faqPage(faqs: { q: string; a: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function service(name: string, path: string, description: string) {
  return {
    '@type': 'Service',
    name,
    serviceType: name,
    url: `${SITE_URL}${path}`,
    description,
    provider: { '@id': ORG_ID },
    areaServed: { '@type': 'City', name: 'Chennai', containedInPlace: { '@type': 'State', name: 'Tamil Nadu' } },
  };
}

export function article(title: string, path: string, description: string, published: string, modified: string) {
  return {
    '@type': 'Article',
    headline: title,
    description,
    url: `${SITE_URL}${path}`,
    mainEntityOfPage: `${SITE_URL}${path}`,
    image: `${SITE_URL}/og-image.png`,
    datePublished: published,
    dateModified: modified,
    inLanguage: 'en-IN',
    author: { '@type': 'Person', '@id': PERSON_ID, name: NAP.person, url: `${SITE_URL}/about/` },
    publisher: { '@id': ORG_ID, name: NAP.name },
    isPartOf: { '@id': WEBSITE_ID },
  };
}
