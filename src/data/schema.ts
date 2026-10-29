import { NAP, AREAS, SITE_URL } from './site';

export const ORG_ID = `${SITE_URL}/#accountingservice`;
export const PERSON_ID = `${SITE_URL}/#person`;

export const accountingService = {
  '@type': 'AccountingService',
  '@id': ORG_ID,
  name: NAP.name,
  url: `${SITE_URL}/`,
  telephone: NAP.phoneTel,
  email: NAP.email,
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
    areaServed: { '@type': 'City', name: 'Chennai' },
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
    author: { '@id': PERSON_ID },
    publisher: { '@id': ORG_ID },
  };
}
