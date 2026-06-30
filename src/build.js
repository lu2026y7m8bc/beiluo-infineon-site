/**
 * src/build.js — build orchestration (T1.7)
 *
 * Pure core (no disk I/O):
 *   assembleSite({ data, templates, partials, baseUrl, validate })
 *   → { files: [{path, content}], issues: [...] }
 *
 * Disk I/O wrapper:
 *   buildSite({ dataDir, templateDir, partialDir, outDir, baseUrl })
 *   → Promise<{ written, issues }>
 *
 * CLI entry point guarded by import.meta — exits 1 on issues or errors.
 */

import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises';
import { join, extname, basename, dirname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

import { buildPageList } from './lib/pages.js';
import { render } from './lib/render.js';
import { buildSitemap } from './lib/sitemap.js';
import { buildRobots } from './lib/robots.js';
import { findLinkIssues } from './lib/links.js';

// ── URL → dist path mapping ───────────────────────────────────────────────────

/**
 * Convert a page URL to a dist-relative file path (no leading slash).
 *   '/'                → 'index.html'
 *   '/products/igbt/'  → 'products/igbt/index.html'
 *   '/sitemap.xml'     → 'sitemap.xml'
 *
 * @param {string} url
 * @returns {string}
 */
function urlToDistPath(url) {
  if (url === '/') return 'index.html';
  // Path with a file extension → strip leading slash only
  if (/\.[a-zA-Z0-9]+$/.test(url)) {
    return url.replace(/^\//, '');
  }
  // Directory URL → strip leading + trailing slash, append /index.html
  return url.replace(/^\//, '').replace(/\/$/, '') + '/index.html';
}

// ── Path-traversal guard ──────────────────────────────────────────────────────

/**
 * Verify that a relative output path does not escape outDir.
 * Rejects any relPath containing '..' segments (first-line defence) and any
 * path whose resolved absolute form falls outside resolve(outDir).
 *
 * @param {string} outDir  - output directory (may be relative or absolute)
 * @param {string} relPath - relative path to be written under outDir
 * @throws {Error} if the path would escape outDir
 */
export function checkPathSafe(outDir, relPath) {
  // Reject '..' segments explicitly (works for both / and \ separators)
  const segments = String(relPath).split(/[/\\]/);
  if (segments.some(seg => seg === '..')) {
    throw new Error(
      `Path traversal detected: relPath "${relPath}" contains ".." segments`,
    );
  }
  // Resolve-based check (defense-in-depth against encoded or exotic forms)
  const outRoot = resolve(outDir);
  const abs = resolve(outDir, relPath);
  if (abs !== outRoot && !abs.startsWith(outRoot + sep)) {
    throw new Error(
      `Path traversal detected: resolved path "${abs}" escapes outDir "${outRoot}"`,
    );
  }
}

// ── Pure core ─────────────────────────────────────────────────────────────────

/**
 * Assemble the entire site in memory — zero disk I/O.
 *
 * @param {{
 *   data: { site, home, products, solutions, support, news, about },
 *   templates: Record<string, string>,
 *   partials?: Record<string, string>,
 *   baseUrl: string,
 *   validate?: (data: object) => void
 * }} options
 * @returns {{ files: Array<{path: string, content: string}>, issues: Array }}
 */
export function assembleSite({
  data,
  templates,
  partials = {},
  baseUrl,
  validate,
} = {}) {
  // T4.7 接入 — data validation hook (wired in T4.7)
  // validate?.(data);

  const pages = buildPageList(data);
  const files = [];

  // Collect rendered HTML pages keyed by their original URL (for link checker)
  const htmlPagesForLinkCheck = [];

  for (const page of pages) {
    const templateStr = templates[page.template];
    if (!templateStr) {
      throw new Error(
        `Missing template for page "${page.url}": no template named "${page.template}"`,
      );
    }
    // render() throws on missing context fields — let the error bubble up
    const content = render(templateStr, page.context, partials);
    files.push({ path: urlToDistPath(page.url), content });
    // Use the original page URL so issue.page reports e.g. "/" not "/index.html"
    htmlPagesForLinkCheck.push({ path: page.url, html: content });
  }

  // Append sitemap.xml (all page URLs)
  const urls = pages.map(p => p.url);
  files.push({ path: 'sitemap.xml', content: buildSitemap(urls, baseUrl) });

  // Append robots.txt
  files.push({ path: 'robots.txt', content: buildRobots(baseUrl) });

  // Dead / empty link validation — use original page URLs, not dist file paths
  const issues = findLinkIssues(htmlPagesForLinkCheck);

  return { files, issues };
}

// ── Disk helpers ──────────────────────────────────────────────────────────────

/**
 * Read every *.json file in `dirPath`.
 * Returns an object keyed by filename (without extension).
 * Returns {} when the directory does not exist or contains no JSON files.
 *
 * @param {string} dirPath
 * @returns {Promise<Record<string, unknown>>}
 */
async function readJsonDir(dirPath) {
  let entries;
  try {
    entries = await readdir(dirPath);
  } catch {
    return {};
  }
  const jsonFiles = entries.filter(f => extname(f) === '.json');
  const result = {};
  for (const f of jsonFiles) {
    const key = basename(f, '.json');
    const raw = await readFile(join(dirPath, f), 'utf8');
    result[key] = JSON.parse(raw);
  }
  return result;
}

/**
 * Read every *.html file in `dirPath`.
 * Returns an object keyed by filename (without extension).
 * Returns {} when the directory does not exist.
 *
 * @param {string} dirPath
 * @returns {Promise<Record<string, string>>}
 */
async function readHtmlDir(dirPath) {
  let entries;
  try {
    entries = await readdir(dirPath);
  } catch {
    return {};
  }
  const htmlFiles = entries.filter(f => extname(f) === '.html');
  const result = {};
  for (const f of htmlFiles) {
    const key = basename(f, '.html');
    result[key] = await readFile(join(dirPath, f), 'utf8');
  }
  return result;
}

// ── Disk I/O wrapper ──────────────────────────────────────────────────────────

/**
 * Full build: reads data + templates from disk, assembles in memory,
 * writes output files to `outDir`.
 *
 * When `dataDir` contains no *.json files (current state before Phase 4/5):
 * logs a notice and returns gracefully — does NOT crash.
 *
 * @param {{
 *   dataDir?: string,
 *   templateDir?: string,
 *   partialDir?: string,
 *   outDir?: string,
 *   baseUrl?: string,
 * }} options
 * @returns {Promise<{ written: number, issues: Array }>}
 */
export async function buildSite({
  dataDir = 'src/data',
  templateDir = 'src/templates',
  partialDir = 'src/templates/partials',
  outDir = 'dist',
  baseUrl = 'https://www.beiluo.com',
} = {}) {
  // Read JSON data files
  const data = await readJsonDir(dataDir);

  if (Object.keys(data).length === 0) {
    console.log(
      `[build] No data/templates yet — no *.json found in "${dataDir}". Skipping build.`,
    );
    return { written: 0, issues: [] };
  }

  // Read HTML templates and partials
  const templates = await readHtmlDir(templateDir);
  const partials = await readHtmlDir(partialDir);

  // Assemble in memory (pure)
  const { files, issues } = assembleSite({ data, templates, partials, baseUrl });

  // Write output files
  let written = 0;
  for (const { path: relPath, content } of files) {
    // Guard against path-traversal before touching the filesystem
    checkPathSafe(outDir, relPath);
    const outPath = join(outDir, relPath);
    await mkdir(dirname(outPath), { recursive: true });
    await writeFile(outPath, content, 'utf8');
    written++;
  }

  return { written, issues };
}

// ── CLI entry point ───────────────────────────────────────────────────────────

const __filename = fileURLToPath(import.meta.url);

if (resolve(process.argv[1] ?? '') === resolve(__filename)) {
  buildSite()
    .then(({ written, issues }) => {
      if (issues && issues.length > 0) {
        console.error('[build] Link issues found:');
        for (const issue of issues) {
          console.error(`  [${issue.reason}] ${issue.href} on ${issue.page}`);
        }
        process.exit(1);
      }
      console.log(`[build] Done: ${written} file(s) written.`);
    })
    .catch(err => {
      console.error('[build] Error:', err.message);
      process.exit(1);
    });
}
