/**
 * schema.js - 7 JSON-LD constructors + jsonLdScript helper
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
  if (site == null || site.brand == null || site.brand.name == null)
    throw new Error('organization: missing brand.name');
  if (site.url == null)
    throw new Error('organization: missing url');
  if (site.logoUrl == null)
    throw new Error('organization: missing logoUrl');
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
  if (site == null || site.brand == null || site.brand.name == null)
    throw new Error('webSite: missing name');
  if (site.url == null)
    throw new Error('webSite: missing url');
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
  for (const crumb of crumbs) {
    if (crumb.name == null) throw new Error('breadcrumbList: missing crumb.name');
    if (crumb.url == null) throw new Error('breadcrumbList: missing crumb.url');
  }
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
  for (const item of items) {
    if (item.name == null) throw new Error('itemList: missing item.name');
    if (item.url == null) throw new Error('itemList: missing item.url');
  }
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
 * Canonical stock values (per products.schema.md): "inStock" | "rfq".
 * Any other value throws.
 * @param {{ partNo: string, stock: string }} model
 * @param {{ brandName?: string, url: string, category: string, orgUrl?: string }} opts
 * @returns {object}
 */
export function product(model, opts) {
  if (model == null || model.partNo == null)
    throw new Error('product: missing partNo');
  if (opts == null || opts.url == null)
    throw new Error('product: missing url');
  if (opts.category == null)
    throw new Error('product: missing category');

  const brandName = opts.brandName ? opts.brandName : 'Infineon';
  const url = opts.url;
  const category = opts.category;

  // Map stock status to schema.org availability URL.
  // Canonical values from products.schema.md: "inStock" | "rfq".
  let availability;
  if (model.stock === 'inStock') {
    availability = SCHEMA + '/InStock';
  } else if (model.stock === 'rfq') {
    availability = SCHEMA + '/PreOrder';
  } else {
    throw new Error('product: unknown stock value: "' + model.stock + '"');
  }

  return {
    '@context': SCHEMA,
    '@type': 'Product',
    name: model.partNo,
    sku: model.partNo,
    brand: {
      '@type': 'Brand',
      name: brandName,
    },
    category,
    url,
    offers: {
      '@type': 'Offer',
      availability,
      url,
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
  if (article == null || article.title == null)
    throw new Error('techArticle: missing title');
  if (article.date == null)
    throw new Error('techArticle: missing date');
  if (opts == null || opts.authorName == null)
    throw new Error('techArticle: missing authorName');
  if (opts.publisher == null)
    throw new Error('techArticle: missing publisher');

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
 * @param {{ title: string, date: string, author: string, bannerImage: { src: string, alt: string } }} article
 * @param {{ publisher: object }} opts
 * @returns {object}
 */
export function newsArticle(article, opts) {
  if (article == null || article.title == null)
    throw new Error('newsArticle: missing title');
  if (article.date == null)
    throw new Error('newsArticle: missing date');
  if (article.author == null)
    throw new Error('newsArticle: missing author');
  if (opts == null || opts.publisher == null)
    throw new Error('newsArticle: missing publisher');
  if (article.bannerImage == null || article.bannerImage.src == null)
    throw new Error('newsArticle: missing bannerImage.src');

  // Determine author @type: Organization when byline is editorial team, else Person
  const authorType =
    typeof article.author === 'string' && article.author.toLowerCase().includes('team')
      ? 'Organization'
      : 'Person';

  const obj = {
    '@context': SCHEMA,
    '@type': 'NewsArticle',
    headline: article.title,
    datePublished: article.date,
    author: {
      '@type': authorType,
      name: article.author,
    },
    publisher: opts.publisher,
    image: article.bannerImage.src,
  };

  return obj;
}

/**
 * Serialize a JSON-LD object into an HTML script tag string.
 * Escapes </script> injection and U+2028/U+2029 line terminators so the
 * JSON is safe to embed inside an HTML script block. Values are still
 * restored to their original form after JSON.parse.
 * @param {object} obj - A JSON-LD object (must be JSON.stringify-safe).
 * @returns {string} '<script type="application/ld+json">...</script>'
 */
export function jsonLdScript(obj) {
  const json = JSON.stringify(obj)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
  return '<script type="application/ld+json">' + json + '</script>';
}