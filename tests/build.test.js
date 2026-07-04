import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { assembleSite, checkPathSafe } from '../src/build.js';

// ── Minimal in-memory fixtures ────────────────────────────────────────────────
// Produces exactly 7 pages: home / about / contact /
//   products-list / solutions-list / support-list / news-list

const minSite = {
  brand: { name: 'BeiLuo', slogan: 'Test Slogan' },
  seo: {
    baseUrl: 'https://example.com',
    defaultTitle: 'BeiLuo Test',
    defaultDescription: 'Test site',
  },
  jsonLd: {
    organizationUrl: 'https://example.com',
    organizationType: 'Organization',
  },
  nav: { items: [] },
  footer: { columns: [], copyright: '© Test' },
};

const minHome = { heroTitle: 'Welcome to BeiLuo' };
const minAbout = { mission: 'Test mission' };

const minData = {
  site: minSite,
  home: minHome,
  about: minAbout,
  products: { categories: [] },
  solutions: { solutions: [] },
  support: { categories: [], tags: [], authors: [], articles: [] },
  news: { articles: [] },
};

// Minimal templates — one per template name used by buildPageList with minData
// nav partial is referenced via {{> nav}} in every template
const minTemplates = {
  home: '<html><body><p>{{heroTitle}}</p>{{> nav}}</body></html>',
  about: '<html><body>{{> nav}}</body></html>',
  contact: '<html><body>{{> nav}}</body></html>',
  'products-list': '<html><body>{{> nav}}</body></html>',
  'solutions-list': '<html><body>{{> nav}}</body></html>',
  'support-list': '<html><body>{{> nav}}</body></html>',
  'news-list': '<html><body>{{> nav}}</body></html>',
};

// Partials — nav links to / which is always a valid page
const minPartials = {
  nav: '<nav><a href="/">Home</a></nav>',
  footer: '<footer>Footer</footer>',
};

const BASE_URL = 'https://example.com';

// ── assembleSite tests ────────────────────────────────────────────────────────

describe('assembleSite', () => {
  // ── Dist path mapping ───────────────────────────────────────────────────────

  it('maps "/" to "index.html"', () => {
    const { files } = assembleSite({
      data: minData,
      templates: minTemplates,
      partials: minPartials,
      baseUrl: BASE_URL,
    });
    const paths = new Set(files.map(f => f.path));
    assert.ok(paths.has('index.html'), '/ should map to index.html');
  });

  it('maps directory URLs to dir/index.html', () => {
    const { files } = assembleSite({
      data: minData,
      templates: minTemplates,
      partials: minPartials,
      baseUrl: BASE_URL,
    });
    const paths = new Set(files.map(f => f.path));
    assert.ok(paths.has('about/index.html'), '/about/ should map to about/index.html');
    assert.ok(paths.has('products/index.html'), '/products/ should map to products/index.html');
    assert.ok(paths.has('contact/index.html'), '/contact/ should map to contact/index.html');
  });

  // ── sitemap.xml + robots.txt ─────────────────────────────────────────────────

  it('includes sitemap.xml in output files', () => {
    const { files } = assembleSite({
      data: minData,
      templates: minTemplates,
      partials: minPartials,
      baseUrl: BASE_URL,
    });
    const paths = new Set(files.map(f => f.path));
    assert.ok(paths.has('sitemap.xml'), 'sitemap.xml should be present');
  });

  it('includes robots.txt in output files', () => {
    const { files } = assembleSite({
      data: minData,
      templates: minTemplates,
      partials: minPartials,
      baseUrl: BASE_URL,
    });
    const paths = new Set(files.map(f => f.path));
    assert.ok(paths.has('robots.txt'), 'robots.txt should be present');
  });

  // ── Rendered data ────────────────────────────────────────────────────────────

  it('rendered index.html includes injected heroTitle', () => {
    const { files } = assembleSite({
      data: minData,
      templates: minTemplates,
      partials: minPartials,
      baseUrl: BASE_URL,
    });
    const indexFile = files.find(f => f.path === 'index.html');
    assert.ok(indexFile, 'index.html must exist');
    assert.ok(
      indexFile.content.includes('Welcome to BeiLuo'),
      'index.html should contain heroTitle value',
    );
  });

  // ── Dead-link detection ──────────────────────────────────────────────────────

  it('dead link /nope/ in a template is reported as an issue with reason "dead"', () => {
    const deadTemplates = {
      ...minTemplates,
      home: '<html><body><a href="/nope/">Dead link</a>{{> nav}}</body></html>',
    };
    const { issues } = assembleSite({
      data: minData,
      templates: deadTemplates,
      partials: minPartials,
      baseUrl: BASE_URL,
    });
    const deadIssue = issues.find(i => i.href === '/nope/' && i.reason === 'dead');
    assert.ok(deadIssue, 'dead link /nope/ should be reported');
  });

  // ── Empty-link detection ─────────────────────────────────────────────────────

  it('empty link href="#" is reported as an issue with reason "empty"', () => {
    const emptyTemplates = {
      ...minTemplates,
      home: '<html><body><a href="#">Empty link</a>{{> nav}}</body></html>',
    };
    const { issues } = assembleSite({
      data: minData,
      templates: emptyTemplates,
      partials: minPartials,
      baseUrl: BASE_URL,
    });
    const emptyIssue = issues.find(i => i.href === '#' && i.reason === 'empty');
    assert.ok(emptyIssue, 'empty link # should be reported');
  });

  // ── Healthy site ─────────────────────────────────────────────────────────────

  it('healthy site with only valid internal links reports no issues', () => {
    const { issues } = assembleSite({
      data: minData,
      templates: minTemplates,
      partials: minPartials,
      baseUrl: BASE_URL,
    });
    assert.deepEqual(issues, [], 'healthy site should have an empty issues array');
  });

  // ── Missing template field → render throws → bubbles ────────────────────────

  it('template with missing field causes assembleSite to throw', () => {
    const badTemplates = {
      ...minTemplates,
      home: '<html><body>{{missingField}}</body></html>',
    };
    assert.throws(
      () =>
        assembleSite({
          data: minData,
          templates: badTemplates,
          partials: minPartials,
          baseUrl: BASE_URL,
        }),
      /Missing field/,
      'assembleSite should throw when a template references a missing data field',
    );
  });

  // ── Fix 2: link checker uses original page URLs ──────────────────────────────

  it('dead-link issue.page equals the page URL not the dist file path', () => {
    const deadTemplates = {
      ...minTemplates,
      home: '<html><body><a href="/nope/">Dead link</a>{{> nav}}</body></html>',
    };
    const { issues } = assembleSite({
      data: minData,
      templates: deadTemplates,
      partials: minPartials,
      baseUrl: BASE_URL,
    });
    const deadIssue = issues.find(i => i.href === '/nope/' && i.reason === 'dead');
    assert.ok(deadIssue, 'dead link /nope/ should be reported');
    assert.equal(
      deadIssue.page,
      '/',
      'issue.page should be the page URL "/" not a dist file path like "/index.html"',
    );
  });
});

// ── checkPathSafe (Fix 1: path-traversal guard) ───────────────────────────────

describe('checkPathSafe', () => {
  it('rejects relPath containing ".." at the start', () => {
    assert.throws(
      () => checkPathSafe('dist', '../escape.html'),
      /traversal/i,
      'should throw for "../escape.html"',
    );
  });

  it('rejects relPath containing ".." in a nested position', () => {
    assert.throws(
      () => checkPathSafe('dist', 'sub/../../escape.html'),
      /traversal/i,
      'should throw for "sub/../../escape.html"',
    );
  });

  it('accepts a normal safe relPath at root level', () => {
    assert.doesNotThrow(
      () => checkPathSafe('dist', 'index.html'),
      'index.html should be safe',
    );
  });

  it('accepts a normal safe nested relPath', () => {
    assert.doesNotThrow(
      () => checkPathSafe('dist', 'about/index.html'),
      'about/index.html should be safe',
    );
  });
});
