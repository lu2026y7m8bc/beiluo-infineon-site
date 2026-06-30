import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { extractHrefs, classifyHref, normalizeInternal, findLinkIssues } from '../src/lib/links.js';

// ── extractHrefs ─────────────────────────────────────────────────────────────

describe('extractHrefs', () => {
  it('extracts href from double-quoted attribute', () => {
    assert.deepEqual(extractHrefs('<a href="/products/">text</a>'), ['/products/']);
  });

  it('extracts href from single-quoted attribute', () => {
    assert.deepEqual(extractHrefs("<a href='/products/'>text</a>"), ['/products/']);
  });

  it('extracts multiple hrefs from multiple <a> tags', () => {
    const html = '<a href="/a/">A</a> <a href="/b/">B</a>';
    assert.deepEqual(extractHrefs(html), ['/a/', '/b/']);
  });

  it('extracts href when <a> has other attributes before href', () => {
    assert.deepEqual(
      extractHrefs('<a class="btn" href="/contact/">Contact</a>'),
      ['/contact/']
    );
  });

  it('extracts href when <a> has other attributes after href', () => {
    assert.deepEqual(
      extractHrefs('<a href="/contact/" target="_blank">Contact</a>'),
      ['/contact/']
    );
  });

  it('ignores <a> tags with no href attribute', () => {
    assert.deepEqual(extractHrefs('<a name="anchor">text</a>'), []);
  });

  it('returns empty array for html with no <a> tags', () => {
    assert.deepEqual(extractHrefs('<p>Hello</p>'), []);
  });

  it('extracts empty string href', () => {
    assert.deepEqual(extractHrefs('<a href="">text</a>'), ['']);
  });

  it('extracts anchor-only href', () => {
    assert.deepEqual(extractHrefs('<a href="#section">text</a>'), ['#section']);
  });
});

// ── classifyHref ─────────────────────────────────────────────────────────────

describe('classifyHref', () => {
  // empty cases
  it('classifies empty string as empty', () => {
    assert.equal(classifyHref(''), 'empty');
  });

  it('classifies "#" as empty', () => {
    assert.equal(classifyHref('#'), 'empty');
  });

  it('classifies whitespace-only string as empty', () => {
    assert.equal(classifyHref('   '), 'empty');
  });

  it('classifies tab-only string as empty', () => {
    assert.equal(classifyHref('\t'), 'empty');
  });

  // anchor cases
  it('classifies "#specs" as anchor', () => {
    assert.equal(classifyHref('#specs'), 'anchor');
  });

  it('classifies "#top" as anchor', () => {
    assert.equal(classifyHref('#top'), 'anchor');
  });

  it('classifies "#section-1" as anchor', () => {
    assert.equal(classifyHref('#section-1'), 'anchor');
  });

  it('classifies " #x " with surrounding whitespace as anchor', () => {
    assert.equal(classifyHref(' #x '), 'anchor');
  });

  // external cases
  it('classifies https:// URL as external', () => {
    assert.equal(classifyHref('https://example.com'), 'external');
  });

  it('classifies http:// URL as external', () => {
    assert.equal(classifyHref('http://example.com'), 'external');
  });

  it('classifies mailto: as external', () => {
    assert.equal(classifyHref('mailto:info@example.com'), 'external');
  });

  it('classifies tel: as external', () => {
    assert.equal(classifyHref('tel:+8612345678'), 'external');
  });

  it('classifies protocol-relative // URL as external', () => {
    assert.equal(classifyHref('//cdn.example.com/file.js'), 'external');
  });

  it('classifies https://wa.me URL as external', () => {
    assert.equal(classifyHref('https://wa.me/1234567890'), 'external');
  });

  // internal cases
  it('classifies /products/igbt/ as internal', () => {
    assert.equal(classifyHref('/products/igbt/'), 'internal');
  });

  it('classifies / as internal', () => {
    assert.equal(classifyHref('/'), 'internal');
  });

  it('classifies /sitemap.xml as internal', () => {
    assert.equal(classifyHref('/sitemap.xml'), 'internal');
  });

  it('classifies " /products/ " with surrounding whitespace as internal', () => {
    assert.equal(classifyHref(' /products/ '), 'internal');
  });
});

// ── normalizeInternal ─────────────────────────────────────────────────────────

describe('normalizeInternal', () => {
  it('strips index.html and returns directory form', () => {
    assert.equal(normalizeInternal('/products/igbt/index.html'), '/products/igbt/');
  });

  it('returns path with trailing slash as-is', () => {
    assert.equal(normalizeInternal('/products/igbt/'), '/products/igbt/');
  });

  it('adds trailing slash to bare path with no extension', () => {
    assert.equal(normalizeInternal('/products/igbt'), '/products/igbt/');
  });

  it('preserves .xml extension without adding trailing slash', () => {
    assert.equal(normalizeInternal('/sitemap.xml'), '/sitemap.xml');
  });

  it('preserves .pdf extension without adding trailing slash', () => {
    assert.equal(normalizeInternal('/files/catalog.pdf'), '/files/catalog.pdf');
  });

  it('preserves .svg extension without adding trailing slash', () => {
    assert.equal(normalizeInternal('/images/logo.svg'), '/images/logo.svg');
  });

  it('strips query string', () => {
    assert.equal(normalizeInternal('/products/igbt/?foo=bar'), '/products/igbt/');
  });

  it('strips fragment/anchor', () => {
    assert.equal(normalizeInternal('/products/igbt/#section'), '/products/igbt/');
  });

  it('strips both query string and fragment', () => {
    assert.equal(normalizeInternal('/products/igbt/?q=1#top'), '/products/igbt/');
  });

  it('normalizes root path', () => {
    assert.equal(normalizeInternal('/'), '/');
  });

  it('normalizes /index.html to /', () => {
    assert.equal(normalizeInternal('/index.html'), '/');
  });
});

// ── findLinkIssues ───────────────────────────────────────────────────────────

describe('findLinkIssues', () => {
  it('returns empty array for fully healthy pages', () => {
    const pages = [
      { path: '/', html: '<a href="/about/">About</a>' },
      { path: '/about/', html: '<a href="/">Home</a>' },
    ];
    assert.deepEqual(findLinkIssues(pages), []);
  });

  it('reports empty for href="#"', () => {
    const pages = [
      { path: '/', html: '<a href="#">Click</a>' },
    ];
    const issues = findLinkIssues(pages);
    assert.equal(issues.length, 1);
    assert.equal(issues[0].reason, 'empty');
    assert.equal(issues[0].href, '#');
    assert.equal(issues[0].page, '/');
  });

  it('reports empty for href=""', () => {
    const pages = [
      { path: '/', html: '<a href="">Click</a>' },
    ];
    const issues = findLinkIssues(pages);
    assert.equal(issues.length, 1);
    assert.equal(issues[0].reason, 'empty');
  });

  it('reports dead for link to non-existent page /nope/', () => {
    const pages = [
      { path: '/', html: '<a href="/nope/">Nope</a>' },
    ];
    const issues = findLinkIssues(pages);
    assert.equal(issues.length, 1);
    assert.equal(issues[0].reason, 'dead');
    assert.equal(issues[0].href, '/nope/');
    assert.equal(issues[0].page, '/');
  });

  it('does not report when link uses /a/index.html and page is /a/', () => {
    // /a/ links to /b/index.html — should resolve to /b/ which exists
    const pages = [
      { path: '/a/', html: '<a href="/b/index.html">B</a>' },
      { path: '/b/', html: '<a href="/a/">A</a>' },
    ];
    assert.deepEqual(findLinkIssues(pages), []);
  });

  it('does not report when link uses /a/ and page path is /a/index.html', () => {
    // page stored as /a/index.html, link uses /a/ — both normalize to /a/
    const pages = [
      { path: '/a/index.html', html: '<a href="/b/">B</a>' },
      { path: '/b/', html: '<a href="/a/">A</a>' },
    ];
    assert.deepEqual(findLinkIssues(pages), []);
  });

  it('skips /assets/ links without reporting dead', () => {
    const pages = [
      { path: '/', html: '<a href="/assets/catalog.pdf">PDF</a>' },
    ];
    assert.deepEqual(findLinkIssues(pages), []);
  });

  it('skips /assets/ svg links without reporting dead', () => {
    const pages = [
      { path: '/', html: '<a href="/assets/logo.svg">Logo</a>' },
    ];
    assert.deepEqual(findLinkIssues(pages), []);
  });

  it('does not report in-page anchor #top', () => {
    const pages = [
      { path: '/', html: '<a href="#top">Top</a>' },
    ];
    assert.deepEqual(findLinkIssues(pages), []);
  });

  it('does not report external links', () => {
    const pages = [
      { path: '/', html: '<a href="https://infineon.com">Infineon</a>' },
    ];
    assert.deepEqual(findLinkIssues(pages), []);
  });

  it('does not report mailto links', () => {
    const pages = [
      { path: '/', html: '<a href="mailto:info@example.com">Email</a>' },
    ];
    assert.deepEqual(findLinkIssues(pages), []);
  });

  it('reports multiple issues across multiple pages', () => {
    const pages = [
      { path: '/', html: '<a href="#">Empty</a><a href="/ghost/">Dead</a>' },
      { path: '/about/', html: '<a href="/">OK</a>' },
    ];
    const issues = findLinkIssues(pages);
    assert.equal(issues.length, 2);
    const reasons = issues.map(i => i.reason).sort();
    assert.deepEqual(reasons, ['dead', 'empty']);
  });

  it('returns empty array for empty pages array', () => {
    assert.deepEqual(findLinkIssues([]), []);
  });

  it('accepts /index.html as root equivalent in pages', () => {
    const pages = [
      { path: '/index.html', html: '<a href="/about/">About</a>' },
      { path: '/about/', html: '<a href="/">Home</a>' },
    ];
    assert.deepEqual(findLinkIssues(pages), []);
  });

  it('reports dead for internal href with surrounding whitespace pointing to non-existent page', () => {
    const pages = [
      { path: '/', html: '<a href=" /nope/ ">Nope</a>' },
    ];
    const issues = findLinkIssues(pages);
    assert.equal(issues.length, 1);
    assert.equal(issues[0].reason, 'dead');
    assert.equal(issues[0].href, ' /nope/ ');
    assert.equal(issues[0].page, '/');
  });
});
