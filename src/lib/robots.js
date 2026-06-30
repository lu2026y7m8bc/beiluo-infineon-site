/**
 * robots.js — buildRobots (ESM, zero deps)
 * Generates robots.txt content with a Sitemap directive.
 */

/**
 * Normalize baseUrl: remove trailing slash.
 * @param {string} baseUrl
 * @returns {string}
 */
function normalizeBase(baseUrl) {
  return baseUrl.replace(/\/+$/, '');
}

/**
 * Build a robots.txt string.
 * @param {string} baseUrl
 * @returns {string}
 */
export function buildRobots(baseUrl) {
  const base = normalizeBase(baseUrl);
  return [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${base}/sitemap.xml`,
  ].join('\n');
}
