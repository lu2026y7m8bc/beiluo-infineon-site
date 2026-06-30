/**
 * schema.js — 7 JSON-LD constructors + jsonLdScript helper
 * ESM, zero dependencies.
 * @module schema
 */

const SCHEMA = 'https://schema.org';

/**
 * Build an Organization JSON-LD object.
 * @param {{ brand: { name: string }, url: string, logoUrl: string }} site
 * @returns {object}
 */
export function organization(site) {
  return {
    '@context': SCHEMA,
    '@type': 'Organization',
    name: site.brand.name,
    url: site.url,
    logo: site.logoUrl,
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
      },
    ],
  };
}

/**
 * Build a WebSite JSON-LD object.
 * @param {{ brand: { name: string }, url: string }} site
 * @returns {object}
 */
export function webSite(site) {
  return {
    '@context': SCHEMA,
    '@type': 'WebSite',
    name: site.brand.name,
    url: site.url,
  };
}

/**
 * Build a BreadcrumbList JSON-LD object.
 * @param {Array<{ name: string, url: string }>} crumbs
 * @returns {object}
 */
export function breadcrumbList(crumbs) {
  return {
    '@context': SCHEMA,
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

/**
 * Build an ItemList JSON-LD object (used for model lists on category pages).
 * @param {Array<{ name: string, url: string }>} items
 * @returns {object}
 */
export function itemList(items) {
  return {
    '@context': SCHEMA,
    '@type': 'ItemList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      url: item.url,
    })),
  };
}

/**
 * Build a Product JSON-LD object.
 * @param {{ partNo: string, stock: string }} model
 * @param {{ brandName?: string, url: string, category?: string, orgUrl?: string }} opts
 * @returns {object}
 */
export function product(model, opts) {
  const brandName = (opts && opts.brandName) ? opts.brandName : 'Infineon';
  const url = opts && opts.url;
  const category = opts && opts.category;

  // Map stock status to schema.org availability URL
  const availability =
    model.stock === 'inStock'
      ? `${SCHEMA}/InStock`
      : `${SCHEMA}/PreOrder`;

  return {
    '@context': SCHEMA,
    '@type': 'Product',
    name: model.partNo,
    sku: model.partNo,
    brand: {
      '@type': 'Brand',
      name: brandName,
    },
    ...(category !== undefined && { category }),
    ...(url !== undefined && { url }),
    offers: {
      '@type': 'Offer',
      availability,
      ...(url !== undefined && { url }),
    },
  };
}

/**
 * Build a TechArticle JSON-LD object.
 * @param {{ title: string, date: string }} article
 * @param {{ authorName: string, publisher: object, image?: string }} opts
 * @returns {object}
 */
export function techArticle(article, opts) {
  const obj = {
    '@context': SCHEMA,
    '@type': 'TechArticle',
    headline: article.title,
    datePublished: article.date,
    author: {
      '@type': 'Person',
      name: opts.authorName,
    },
    publisher: opts.publisher,
  };

  if (opts.image !== undefined) {
    obj.image = opts.image;
  }

  return obj;
}

/**
 * Build a NewsArticle JSON-LD object.
 * @param {{ title: string, date: string, author: string, bannerImage: string | object }} article
 * @param {{ publisher: object }} opts
 * @returns {object}
 */
export function newsArticle(article, opts) {
  // Determine author @type: Organization when byline is editorial team, else Person
  const authorType =
    typeof article.author === 'string' && article.author.toLowerCase().includes('team')
      ? 'Organization'
      : 'Person';

  return {
    '@context': SCHEMA,
    '@type': 'NewsArticle',
    headline: article.title,
    datePublished: article.date,
    author: {
      '@type': authorType,
      name: article.author,
    },
    publisher: opts.publisher,
    image: article.bannerImage,
  };
}

/**
 * Serialize a JSON-LD object into an HTML script tag string.
 * @param {object} obj - A JSON-LD object (must be JSON.stringify-safe).
 * @returns {string} '<script type="application/ld+json">…</script>'
 */
export function jsonLdScript(obj) {
  return '<script type="application/ld+json">' + JSON.stringify(obj) + '</script>';
}
