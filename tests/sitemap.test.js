import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildSitemap, xmlEscape } from '../src/lib/sitemap.js';

// ─── xmlEscape ───────────────────────────────────────────────────────────────
describe('xmlEscape', () => {
  it('escapes & first (prevents double-escaping)', () => {
    assert.equal(xmlEscape('a & b'), 'a &amp; b');
  });

  it('escapes < to &lt;', () => {
    assert.equal(xmlEscape('<tag>'), '&lt;tag&gt;');
  });

  it('escapes > to &gt;', () => {
    assert.equal(xmlEscape('>'), '&gt;');
  });

  it('escapes " to &quot;', () => {
    assert.equal(xmlEscape('"hello"'), '&quot;hello&quot;');
  });

  it("escapes ' to &apos;", () => {
    assert.equal(xmlEscape("it's"), 'it&apos;s');
  });

  it('escapes all five characters in a single string', () => {
    assert.equal(xmlEscape(`& < > " '`), '&amp; &lt; &gt; &quot; &apos;');
  });

  it('leaves plain text unchanged', () => {
    assert.equal(xmlEscape('hello world'), 'hello world');
  });
});

// ─── buildSitemap ─────────────────────────────────────────────────────────────
describe('buildSitemap – xml declaration + urlset namespace', () => {
  it('starts with xml declaration', () => {
    const xml = buildSitemap([], 'https://example.com');
    assert.ok(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>'),
      'should start with XML declaration');
  });

  it('contains urlset with sitemaps namespace', () => {
    const xml = buildSitemap([], 'https://example.com');
    assert.ok(xml.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'),
      'should contain urlset with namespace');
  });

  it('ends with </urlset>', () => {
    const xml = buildSitemap([], 'https://example.com');
    assert.ok(xml.trimEnd().endsWith('</urlset>'), 'should end with </urlset>');
  });
});

describe('buildSitemap – empty urls array', () => {
  it('returns valid empty urlset for empty array', () => {
    const xml = buildSitemap([], 'https://example.com');
    assert.ok(xml.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'));
    assert.ok(xml.includes('</urlset>'));
    assert.ok(!xml.includes('<url>'), 'should not contain any <url> entries');
  });
});

describe('buildSitemap – string url', () => {
  it('generates <url><loc>...</loc></url> for a string entry', () => {
    const xml = buildSitemap(['https://example.com/page'], 'https://example.com');
    assert.ok(xml.includes('<url><loc>https://example.com/page</loc></url>'),
      'string url should produce minimal url entry');
  });

  it('does not add optional fields for string entry', () => {
    const xml = buildSitemap(['https://example.com/page'], 'https://example.com');
    assert.ok(!xml.includes('<lastmod>'), 'no lastmod for string entry');
    assert.ok(!xml.includes('<changefreq>'), 'no changefreq for string entry');
    assert.ok(!xml.includes('<priority>'), 'no priority for string entry');
  });
});

describe('buildSitemap – object url with optional fields', () => {
  it('generates loc, lastmod, priority from object entry', () => {
    const urls = [{ loc: 'https://example.com/products', lastmod: '2024-01-01', priority: '0.8' }];
    const xml = buildSitemap(urls, 'https://example.com');
    assert.ok(xml.includes('<loc>https://example.com/products</loc>'), 'loc present');
    assert.ok(xml.includes('<lastmod>2024-01-01</lastmod>'), 'lastmod present');
    assert.ok(xml.includes('<priority>0.8</priority>'), 'priority present');
  });

  it('generates changefreq from object entry', () => {
    const urls = [{ loc: 'https://example.com/news', changefreq: 'daily' }];
    const xml = buildSitemap(urls, 'https://example.com');
    assert.ok(xml.includes('<changefreq>daily</changefreq>'), 'changefreq present');
  });

  it('omits optional fields if not provided in object', () => {
    const urls = [{ loc: 'https://example.com/about' }];
    const xml = buildSitemap(urls, 'https://example.com');
    assert.ok(!xml.includes('<lastmod>'), 'no lastmod if not set');
    assert.ok(!xml.includes('<changefreq>'), 'no changefreq if not set');
    assert.ok(!xml.includes('<priority>'), 'no priority if not set');
  });

  it('handles string and object urls in same call', () => {
    const urls = [
      'https://example.com/',
      { loc: 'https://example.com/contact', lastmod: '2025-06-01', priority: '0.5' }
    ];
    const xml = buildSitemap(urls, 'https://example.com');
    assert.ok(xml.includes('<loc>https://example.com/</loc>'));
    assert.ok(xml.includes('<loc>https://example.com/contact</loc>'));
    assert.ok(xml.includes('<lastmod>2025-06-01</lastmod>'));
    assert.ok(xml.includes('<priority>0.5</priority>'));
  });
});

describe('buildSitemap – relative → absolute (no double-slash)', () => {
  it('prepends baseUrl to relative path starting with /', () => {
    const xml = buildSitemap(['/products'], 'https://example.com');
    assert.ok(xml.includes('<loc>https://example.com/products</loc>'),
      'relative path should be absolutized');
  });

  it('no double-slash when baseUrl has trailing slash', () => {
    const xml = buildSitemap(['/products'], 'https://example.com/');
    assert.ok(!xml.includes('//products'), 'must not produce double-slash');
    assert.ok(xml.includes('<loc>https://example.com/products</loc>'));
  });

  it('keeps absolute https:// url unchanged', () => {
    const xml = buildSitemap(['https://cdn.example.com/page'], 'https://example.com');
    assert.ok(xml.includes('<loc>https://cdn.example.com/page</loc>'),
      'absolute url should remain unchanged');
  });

  it('baseUrl with and without trailing slash produce same result', () => {
    const xml1 = buildSitemap(['/about'], 'https://example.com');
    const xml2 = buildSitemap(['/about'], 'https://example.com/');
    assert.equal(xml1, xml2, 'trailing slash on baseUrl should be normalized');
  });
});

describe('buildSitemap – xmlEscape in loc', () => {
  it('escapes & in loc to &amp;', () => {
    const xml = buildSitemap(['https://example.com/page?a=1&b=2'], 'https://example.com');
    assert.ok(xml.includes('<loc>https://example.com/page?a=1&amp;b=2</loc>'),
      '& in loc should be escaped to &amp;');
  });

  it('escapes < in loc', () => {
    const xml = buildSitemap(['https://example.com/a<b'], 'https://example.com');
    assert.ok(xml.includes('&lt;'), '< should be escaped');
  });
});
