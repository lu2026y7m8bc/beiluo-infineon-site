import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildRobots } from '../src/lib/robots.js';

// ─── buildRobots ──────────────────────────────────────────────────────────────
describe('buildRobots – required lines', () => {
  it('contains User-agent: *', () => {
    const txt = buildRobots('https://example.com');
    assert.ok(txt.includes('User-agent: *'), 'must contain "User-agent: *"');
  });

  it('contains Allow: /', () => {
    const txt = buildRobots('https://example.com');
    assert.ok(txt.includes('Allow: /'), 'must contain "Allow: /"');
  });

  it('contains Sitemap: with correct baseUrl and /sitemap.xml', () => {
    const txt = buildRobots('https://example.com');
    assert.ok(txt.includes('Sitemap: https://example.com/sitemap.xml'),
      'must contain Sitemap line with full URL');
  });
});

describe('buildRobots – baseUrl trailing slash normalization', () => {
  it('no double-slash when baseUrl has trailing slash', () => {
    const txt = buildRobots('https://example.com/');
    assert.ok(!txt.includes('//sitemap.xml'), 'must not produce double-slash before sitemap.xml');
    assert.ok(txt.includes('Sitemap: https://example.com/sitemap.xml'),
      'sitemap line must be correct with trailing-slash baseUrl');
  });

  it('baseUrl with and without trailing slash produce same output', () => {
    const txt1 = buildRobots('https://example.com');
    const txt2 = buildRobots('https://example.com/');
    assert.equal(txt1, txt2, 'trailing slash on baseUrl should be normalized away');
  });

  it('works with a sub-path baseUrl', () => {
    const txt = buildRobots('https://example.com/subdir');
    assert.ok(txt.includes('Sitemap: https://example.com/subdir/sitemap.xml'));
  });

  it('works with a sub-path baseUrl with trailing slash', () => {
    const txt = buildRobots('https://example.com/subdir/');
    assert.ok(!txt.includes('//sitemap.xml'), 'no double-slash');
    assert.ok(txt.includes('Sitemap: https://example.com/subdir/sitemap.xml'));
  });
});

describe('buildRobots – structure', () => {
  it('User-agent line comes before Allow line', () => {
    const txt = buildRobots('https://example.com');
    const uaPos = txt.indexOf('User-agent: *');
    const allowPos = txt.indexOf('Allow: /');
    assert.ok(uaPos < allowPos, 'User-agent must appear before Allow');
  });

  it('Sitemap line appears in output', () => {
    const txt = buildRobots('https://example.com');
    const sitemapPos = txt.indexOf('Sitemap:');
    assert.ok(sitemapPos >= 0, 'Sitemap line must exist');
  });
});
