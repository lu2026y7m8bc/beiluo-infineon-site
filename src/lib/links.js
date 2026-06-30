/**
 * src/lib/links.js
 * Internal link validator — ESM, zero dependencies.
 * T1.4: extractHrefs, classifyHref, normalizeInternal, findLinkIssues
 */

// Extensions that are treated as files (no trailing slash added)
const FILE_EXTENSIONS = /\.([a-zA-Z0-9]+)$/;
const ASSET_PATH_PREFIX = '/assets/';

/**
 * extractHrefs(html) → string[]
 * Extracts the value of every href attribute found inside <a> tags.
 * Handles both single- and double-quoted values and ignores <a> tags
 * that have no href attribute.
 */
export function extractHrefs(html) {
  const results = [];
  // Match <a ...> opening tags (non-greedy, no closing tag needed)
  const tagRe = /<a\s[^>]*>/gi;
  let tagMatch;
  while ((tagMatch = tagRe.exec(html)) !== null) {
    const tag = tagMatch[0];
    // Extract href="..." or href='...'
    const hrefDouble = /\shref="([^"]*)"/i.exec(tag);
    const hrefSingle = /\shref='([^']*)'/i.exec(tag);
    if (hrefDouble) {
      results.push(hrefDouble[1]);
    } else if (hrefSingle) {
      results.push(hrefSingle[1]);
    }
    // No href attribute → skip
  }
  return results;
}

/**
 * classifyHref(href) → 'empty' | 'anchor' | 'external' | 'internal'
 * Classifies a single href string.
 */
export function classifyHref(href) {
  if (href.trim() === '' || href.trim() === '#') {
    return 'empty';
  }
  if (href.startsWith('#')) {
    return 'anchor';
  }
  if (
    href.startsWith('http://') ||
    href.startsWith('https://') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:') ||
    href.startsWith('//')
  ) {
    return 'external';
  }
  if (href.startsWith('/')) {
    return 'internal';
  }
  // Fallback: treat unknown schemes as external to avoid false positives
  return 'external';
}

/**
 * normalizeInternal(href) → string
 * Converts an internal path to its canonical form for comparison.
 *  - Strips query string (?...) and fragment (#...)
 *  - Strips trailing index.html → directory form
 *  - Ensures trailing slash unless the path ends with a file extension
 *    (e.g. .pdf, .xml, .svg, .png, etc.)
 */
export function normalizeInternal(href) {
  // Strip query string and fragment
  let path = href.split('?')[0].split('#')[0];

  // Strip trailing index.html
  if (path.endsWith('/index.html')) {
    path = path.slice(0, -'index.html'.length);
  } else if (path === '/index.html') {
    path = '/';
  }

  // If the path ends with a file extension, leave as-is
  if (FILE_EXTENSIONS.test(path)) {
    return path;
  }

  // Ensure trailing slash for directory-like paths
  if (!path.endsWith('/')) {
    path = path + '/';
  }

  return path;
}

/**
 * findLinkIssues(pages) → issues[]
 * pages: Array of { path: string, html: string }
 * Returns an array of { page, href, reason } objects where reason is
 * 'empty' or 'dead'. An empty array means all links are healthy.
 */
export function findLinkIssues(pages) {
  // Build the valid path set by normalizing each page's path
  const validPaths = new Set();
  for (const { path } of pages) {
    validPaths.add(normalizeInternal(path));
  }

  const issues = [];

  for (const { path: page, html } of pages) {
    const hrefs = extractHrefs(html);
    for (const href of hrefs) {
      const type = classifyHref(href);

      if (type === 'empty') {
        issues.push({ page, href, reason: 'empty' });
        continue;
      }

      if (type === 'internal') {
        // Skip /assets/... paths — treated as external static assets
        if (href.startsWith(ASSET_PATH_PREFIX)) {
          continue;
        }
        const normalized = normalizeInternal(href);
        if (!validPaths.has(normalized)) {
          issues.push({ page, href, reason: 'dead' });
        }
        continue;
      }

      // 'anchor' and 'external' → skip
    }
  }

  return issues;
}
