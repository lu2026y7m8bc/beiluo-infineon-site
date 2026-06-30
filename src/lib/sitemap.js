/**
 * sitemap.js — buildSitemap + xmlEscape (ESM, zero deps)
 * Generates sitemap.xml content from a list of URLs.
 */

/**
 * Escape special XML characters in a string.
 * Order: & must be first to avoid double-escaping.
 * @param {string} str
 * @returns {string}
 */
export function xmlEscape(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Normalize baseUrl: remove trailing slash.
 * @param {string} baseUrl
 * @returns {string}
 */
function normalizeBase(baseUrl) {
  return baseUrl.replace(/\/+$/, '');
}

/**
 * Absolutize a loc value:
 * - If it starts with '/', prepend normalizedBaseUrl (no double-slash).
 * - If already absolute (http:// or https://), leave as-is.
 * @param {string} loc
 * @param {string} normalizedBase  baseUrl without trailing slash
 * @returns {string}
 */
function absolutize(loc, normalizedBase) {
  if (/^https?:\/\//i.test(loc)) {
    return loc;
  }
  // relative path starting with /
  return normalizedBase + loc;
}

/**
 * Build a sitemap.xml string.
 * @param {(string | {loc: string, lastmod?: string, changefreq?: string, priority?: string})[]} urls
 * @param {string} baseUrl
 * @returns {string}
 */
export function buildSitemap(urls, baseUrl) {
  const base = normalizeBase(baseUrl);

  const urlEntries = urls.map((entry) => {
    let loc, lastmod, changefreq, priority;

    if (typeof entry === 'string') {
      loc = entry;
    } else {
      loc = entry.loc;
      lastmod = entry.lastmod;
      changefreq = entry.changefreq;
      priority = entry.priority;
    }

    const absLoc = xmlEscape(absolutize(loc, base));

    let urlTag = `<url><loc>${absLoc}</loc>`;
    if (lastmod != null) urlTag += `<lastmod>${xmlEscape(lastmod)}</lastmod>`;
    if (changefreq != null) urlTag += `<changefreq>${xmlEscape(changefreq)}</changefreq>`;
    if (priority != null) urlTag += `<priority>${xmlEscape(String(priority))}</priority>`;
    urlTag += `</url>`;

    return urlTag;
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urlEntries,
    '</urlset>',
  ].join('\n');
}
