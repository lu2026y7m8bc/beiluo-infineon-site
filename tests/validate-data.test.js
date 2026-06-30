/**
 * tests/validate-data.test.js — TDD tests for validateData (T4.7)
 *
 * Strategy:
 *  1. Load real JSON data from src/data/ and assert validateData returns true.
 *  2. For each validation domain, mutate a clone and assert validateData throws
 *     with a message that identifies the failure.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { validateData } from '../src/lib/validate-data.js';

// ── Helpers ───────────────────────────────────────────────────────────────────

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, '../src/data');

function loadJson(name) {
  return JSON.parse(readFileSync(join(dataDir, `${name}.json`), 'utf8'));
}

/** Deep-clone an object (no functions / circular refs in data). */
function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/** Build a full data object from real JSON files. */
function realData() {
  return {
    site: loadJson('site'),
    products: loadJson('products'),
    solutions: loadJson('solutions'),
    support: loadJson('support'),
    news: loadJson('news'),
    home: loadJson('home'),
    about: loadJson('about'),
  };
}

/** Assert that validateData throws, and optionally that the message contains needle. */
function assertThrows(data, needle) {
  let thrown = false;
  try {
    validateData(data);
  } catch (err) {
    thrown = true;
    if (needle) {
      assert.ok(
        err.message.toLowerCase().includes(needle.toLowerCase()),
        `Expected error message to contain "${needle}" but got:\n${err.message}`,
      );
    }
  }
  assert.ok(thrown, `Expected validateData to throw but it returned true`);
}

// ── Happy-path: real data must pass ───────────────────────────────────────────

describe('validateData — happy path with real data', () => {
  it('returns true for the full real dataset', () => {
    const data = realData();
    assert.strictEqual(validateData(data), true);
  });
});

// ── site validations ──────────────────────────────────────────────────────────

describe('validateData — site', () => {
  it('throws when brand.name is missing', () => {
    const data = realData();
    const d = clone(data);
    delete d.site.brand.name;
    assertThrows(d, 'brand.name');
  });

  it('throws when brand.slogan is empty', () => {
    const data = realData();
    const d = clone(data);
    d.site.brand.slogan = '';
    assertThrows(d, 'brand.slogan');
  });

  it('throws when brand.oneLiner is missing', () => {
    const data = realData();
    const d = clone(data);
    delete d.site.brand.oneLiner;
    assertThrows(d, 'brand.oneLiner');
  });

  it('throws when nav.items has wrong length', () => {
    const data = realData();
    const d = clone(data);
    d.site.nav.items = d.site.nav.items.slice(0, 5);
    assertThrows(d, 'nav.items');
  });

  it('throws when footer.columns has wrong length', () => {
    const data = realData();
    const d = clone(data);
    d.site.footer.columns = d.site.footer.columns.slice(0, 2);
    assertThrows(d, 'footer.columns');
  });

  it('throws when contact.whatsapp is missing', () => {
    const data = realData();
    const d = clone(data);
    delete d.site.contact.whatsapp;
    assertThrows(d, 'contact.whatsapp');
  });

  it('throws when contact.wechatQrSrc is missing', () => {
    const data = realData();
    const d = clone(data);
    delete d.site.contact.wechatQrSrc;
    assertThrows(d, 'contact.wechatQrSrc');
  });

  it('throws when seo.defaultTitle is missing', () => {
    const data = realData();
    const d = clone(data);
    delete d.site.seo.defaultTitle;
    assertThrows(d, 'seo.defaultTitle');
  });

  it('throws when seo.defaultDescription does not contain "infineon distributor"', () => {
    const data = realData();
    const d = clone(data);
    d.site.seo.defaultDescription = 'Some description without the keyword';
    assertThrows(d, 'infineon distributor');
  });

  it('throws when logo.src is missing', () => {
    const data = realData();
    const d = clone(data);
    delete d.site.logo.src;
    assertThrows(d, 'logo.src');
  });

  it('throws when jsonLd.organizationUrl is missing', () => {
    const data = realData();
    const d = clone(data);
    delete d.site.jsonLd.organizationUrl;
    assertThrows(d, 'jsonLd.organizationUrl');
  });

  it('throws when site is missing entirely', () => {
    const data = realData();
    const d = clone(data);
    delete d.site;
    assertThrows(d, 'site');
  });
});

// ── products validations ──────────────────────────────────────────────────────

describe('validateData — products', () => {
  it('throws when categories has wrong count', () => {
    const data = realData();
    const d = clone(data);
    d.products.categories = d.products.categories.slice(0, 2);
    assertThrows(d, 'categories');
  });

  it('throws when a category is missing slug', () => {
    const data = realData();
    const d = clone(data);
    delete d.products.categories[0].slug;
    assertThrows(d, 'slug');
  });

  it('throws when a category is missing faeNote', () => {
    const data = realData();
    const d = clone(data);
    delete d.products.categories[1].faeNote;
    assertThrows(d, 'faeNote');
  });

  it('throws when category.models has wrong count', () => {
    const data = realData();
    const d = clone(data);
    d.products.categories[0].models = [d.products.categories[0].models[0]];
    assertThrows(d, 'models');
  });

  it('throws when a model has invalid stock value', () => {
    const data = realData();
    const d = clone(data);
    d.products.categories[0].models[0].stock = 'available';
    assertThrows(d, 'stock');
  });

  it('throws when a model is missing partNo', () => {
    const data = realData();
    const d = clone(data);
    delete d.products.categories[0].models[0].partNo;
    assertThrows(d, 'partNo');
  });

  it('throws when a model specs has fewer than 5 items', () => {
    const data = realData();
    const d = clone(data);
    d.products.categories[0].models[0].specs = d.products.categories[0].models[0].specs.slice(0, 3);
    assertThrows(d, 'specs');
  });

  it('throws when a model faq is empty', () => {
    const data = realData();
    const d = clone(data);
    d.products.categories[0].models[0].faq = [];
    assertThrows(d, 'faq');
  });

  it('throws when a model faq has more than 5 items', () => {
    const data = realData();
    const d = clone(data);
    const faq = d.products.categories[0].models[0].faq;
    d.products.categories[0].models[0].faq = [...faq, ...faq]; // 10 items
    assertThrows(d, 'faq');
  });

  it('throws when a model is missing brand', () => {
    const data = realData();
    const d = clone(data);
    delete d.products.categories[2].models[1].brand;
    assertThrows(d, 'brand');
  });
});

// ── solutions validations ─────────────────────────────────────────────────────

describe('validateData — solutions', () => {
  it('throws when solutions array is too short', () => {
    const data = realData();
    const d = clone(data);
    d.solutions.solutions = d.solutions.solutions.slice(0, 2);
    assertThrows(d, 'solutions');
  });

  it('throws when a solution is missing slug', () => {
    const data = realData();
    const d = clone(data);
    delete d.solutions.solutions[0].slug;
    assertThrows(d, 'slug');
  });

  it('throws when a solution is missing body', () => {
    const data = realData();
    const d = clone(data);
    delete d.solutions.solutions[1].body;
    assertThrows(d, 'body');
  });

  it('throws when a solution bomList has fewer than 2 items', () => {
    const data = realData();
    const d = clone(data);
    d.solutions.solutions[0].bomList = [d.solutions.solutions[0].bomList[0]];
    assertThrows(d, 'bomList');
  });

  it('throws when a solution advantages has fewer than 3 items', () => {
    const data = realData();
    const d = clone(data);
    d.solutions.solutions[0].advantages = ['one', 'two'];
    assertThrows(d, 'advantages');
  });
});

// ── support validations ───────────────────────────────────────────────────────

describe('validateData — support', () => {
  it('throws when support.articles has wrong count', () => {
    const data = realData();
    const d = clone(data);
    d.support.articles = d.support.articles.slice(0, 2);
    assertThrows(d, 'articles');
  });

  it('throws when support.authors is empty', () => {
    const data = realData();
    const d = clone(data);
    d.support.authors = [];
    assertThrows(d, 'authors');
  });

  it('throws when a support article is missing body', () => {
    const data = realData();
    const d = clone(data);
    delete d.support.articles[0].body;
    assertThrows(d, 'body');
  });

  it('throws when a support article contextLinks is empty', () => {
    const data = realData();
    const d = clone(data);
    d.support.articles[0].contextLinks = [];
    assertThrows(d, 'contextLinks');
  });

  it('throws when a support article contextLinks is missing', () => {
    const data = realData();
    const d = clone(data);
    delete d.support.articles[2].contextLinks;
    assertThrows(d, 'contextLinks');
  });
});

// ── news validations ──────────────────────────────────────────────────────────

describe('validateData — news', () => {
  it('throws when news.articles has wrong count', () => {
    const data = realData();
    const d = clone(data);
    d.news.articles = d.news.articles.slice(0, 2);
    assertThrows(d, 'articles');
  });

  it('throws when no article has type="company"', () => {
    const data = realData();
    const d = clone(data);
    d.news.articles = d.news.articles.map(a => ({ ...a, type: 'industry' }));
    assertThrows(d, 'company');
  });

  it('throws when no article has type="industry"', () => {
    const data = realData();
    const d = clone(data);
    d.news.articles = d.news.articles.map(a => ({ ...a, type: 'company' }));
    assertThrows(d, 'industry');
  });

  it('throws when a news article is missing bannerImage', () => {
    const data = realData();
    const d = clone(data);
    delete d.news.articles[0].bannerImage;
    assertThrows(d, 'bannerImage');
  });

  it('throws when a news article is missing title', () => {
    const data = realData();
    const d = clone(data);
    delete d.news.articles[1].title;
    assertThrows(d, 'title');
  });
});

// ── home validations ──────────────────────────────────────────────────────────

describe('validateData — home', () => {
  it('throws when home.hero is missing', () => {
    const data = realData();
    const d = clone(data);
    delete d.home.hero;
    assertThrows(d, 'hero');
  });

  it('throws when home.hero.headline is missing', () => {
    const data = realData();
    const d = clone(data);
    delete d.home.hero.headline;
    assertThrows(d, 'hero.headline');
  });

  it('throws when neither trustBar nor hero.trustBadges exist', () => {
    const data = realData();
    const d = clone(data);
    delete d.home.trustBar;
    delete d.home.hero.trustBadges;
    assertThrows(d, 'trustBar');
  });

  it('throws when productsTeaser has wrong count', () => {
    const data = realData();
    const d = clone(data);
    d.home.productsTeaser = d.home.productsTeaser.slice(0, 2);
    assertThrows(d, 'productsTeaser');
  });

  it('throws when solutionsTeaser has fewer than 3 items', () => {
    const data = realData();
    const d = clone(data);
    d.home.solutionsTeaser = d.home.solutionsTeaser.slice(0, 1);
    assertThrows(d, 'solutionsTeaser');
  });

  it('throws when newsTeaser has fewer than 3 items', () => {
    const data = realData();
    const d = clone(data);
    d.home.newsTeaser = d.home.newsTeaser.slice(0, 1);
    assertThrows(d, 'newsTeaser');
  });

  it('throws when seo.title is missing', () => {
    const data = realData();
    const d = clone(data);
    delete d.home.seo.title;
    assertThrows(d, 'seo.title');
  });

  it('throws when seo.description is missing', () => {
    const data = realData();
    const d = clone(data);
    delete d.home.seo.description;
    assertThrows(d, 'seo.description');
  });
});

// ── about validations ─────────────────────────────────────────────────────────

describe('validateData — about', () => {
  it('throws when about.intro.body is missing', () => {
    const data = realData();
    const d = clone(data);
    delete d.about.intro.body;
    assertThrows(d, 'intro.body');
  });

  it('throws when intro.body is too short (< 100 chars)', () => {
    const data = realData();
    const d = clone(data);
    d.about.intro.body = 'Too short.';
    assertThrows(d, 'intro.body');
  });

  it('throws when neither history nor milestones array exists', () => {
    const data = realData();
    const d = clone(data);
    delete d.about.history;
    delete d.about.milestones;
    assertThrows(d, 'history');
  });

  it('throws when advantages array is missing', () => {
    const data = realData();
    const d = clone(data);
    delete d.about.advantages;
    assertThrows(d, 'advantages');
  });

  it('accepts milestones as alternative to history', () => {
    const data = realData();
    const d = clone(data);
    d.about.milestones = d.about.history;
    delete d.about.history;
    // Should not throw
    assert.strictEqual(validateData(d), true);
  });
});

// ── error accumulation ────────────────────────────────────────────────────────

describe('validateData — error accumulation', () => {
  it('accumulates multiple errors in a single throw', () => {
    const data = realData();
    const d = clone(data);
    // Introduce multiple failures at once
    delete d.site.brand.name;
    d.site.nav.items = [];
    d.products.categories = d.products.categories.slice(0, 1);
    let msg = '';
    try {
      validateData(d);
    } catch (err) {
      msg = err.message;
    }
    // Message should mention more than one issue (header + at least 3 error lines)
    const lines = msg.split('\n').filter(Boolean);
    assert.ok(lines.length >= 4, `Expected at least 4 lines (header + 3 errors), got: ${msg}`);
    // Each introduced failure must appear in the message
    assert.ok(msg.includes('brand.name'), `Expected error to mention "brand.name" but got:\n${msg}`);
    assert.ok(msg.includes('nav.items'), `Expected error to mention "nav.items" but got:\n${msg}`);
    assert.ok(msg.includes('categories'), `Expected error to mention "categories" but got:\n${msg}`);
  });
});
