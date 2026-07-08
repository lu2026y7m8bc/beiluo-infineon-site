/**
 * schema.js - JSON-LD constructors actually used by pages.js (breadcrumbList,
 * itemList) + the jsonLdScript serialization helper.
 *
 * Organization/WebSite/Product/TechArticle/NewsArticle JSON-LD are NOT built
 * here — every template hand-authors its own JSON-LD block for those types
 * (pages.js only imports breadcrumbList/itemList/jsonLdScript from this
 * module; grep confirms it). Constructors for those 5 types previously lived
 * in this file but were dead code: never imported outside this file's own
 * test suite, and had drifted out of sync with the hand-authored templates'
 * actual behavior (e.g. this file's old `product()` mapped rfq stock to
 * `PreOrder`, while pages.js/product-detail/product-category all correctly
 * use `BackOrder` — a real inconsistency that contributed to a shipped bug
 * found in T9.3's overall code review). Removed rather than wired in, since
 * every JSON-LD type they'd cover is already correctly rendered by the
 * templates and validated for JSON-safety by validate-data.js's
 * checkJsonLdSafe(). If a future change wires templates through this module
 * instead of hand-authoring, route it through jsonLdScript() for escaping.
 *
 * ESM, zero dependencies.
 * @module schema
 */

const SCHEMA = 'https://schema.org';

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