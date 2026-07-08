import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildPageList } from '../src/lib/pages.js';

// ── Minimal sample data ───────────────────────────────────────────────────────

const site = {
  brand: { name: 'BeiLuo', slogan: 'Top 8 Electronic Component Distributor in China' },
  seo: {
    baseUrl: 'https://www.beiluo.com',
    defaultTitle: 'Infineon Distributor | BeiLuo',
    defaultDescription: 'Infineon distributor BeiLuo',
  },
  jsonLd: {
    organizationUrl: 'https://www.beiluo.com',
    organizationType: 'Organization',
  },
  nav: { items: [] },
  footer: { columns: [], copyright: '© 2024 BeiLuo.' },
};

const home = { heroTitle: 'Welcome to BeiLuo' };

const products = {
  categories: [
    {
      slug: 'igbt',
      name: 'IGBT',
      title: 'Infineon IGBT Distributor',
      metaDescription: 'IGBT meta',
      description: 'IGBT desc',
      faeNote: 'FAE note',
      icon: '/assets/svg/icons/igbt.svg',
      selectionGuideHref: '/support/guides/how-to-select-infineon-igbt/',
      selectionGuideDownloadHref: '/assets/docs/igbt-guide.pdf',
      columns: [],
      models: [
        {
          partNo: 'IKW40N120H3',
          series: 'H3',
          params: {},
          package: 'TO-247',
          stock: 'inStock',
          href: '/products/igbt/ikw40n120h3/',
        },
        // Same partNo to test slug dedup → should become ikw40n120h3-2
        {
          partNo: 'IKW40N120H3',
          series: 'H3',
          params: {},
          package: 'TO-247',
          stock: 'inStock',
          href: '/products/igbt/ikw40n120h3-2/',
        },
      ],
    },
    {
      slug: 'mcu',
      name: 'MCU',
      title: 'Infineon MCU Distributor',
      metaDescription: 'MCU meta',
      description: 'MCU desc',
      faeNote: 'FAE note',
      icon: '/assets/svg/icons/mcu.svg',
      selectionGuideHref: '/support/guides/how-to-select-infineon-mcu/',
      selectionGuideDownloadHref: '/assets/docs/mcu-guide.pdf',
      columns: [],
      models: [
        {
          partNo: 'TC387QP',
          series: 'AURIX',
          params: {},
          package: 'BGA-292',
          stock: 'inStock',
          href: '/products/mcu/tc387qp/',
        },
        {
          partNo: 'XMC4800',
          series: 'XMC',
          params: {},
          package: 'LQFP-144',
          stock: 'rfq',
          href: '/products/mcu/xmc4800/',
        },
      ],
    },
  ],
};

const solutions = {
  solutions: [
    {
      slug: 'bldc-motor-drive',
      title: 'BLDC Motor Drive Solution',
      metaDescription: 'Motor drive meta',
      summary: 'Motor drive solution',
      industry: 'Motor Drive',
      diagramSrc: '/assets/svg/bd-bldc.svg',
      diagramAlt: 'BLDC block diagram',
      advantages: ['High efficiency'],
      bomList: [],
      scenarios: 'Industrial applications',
      body: 'Full body text...',
      related: [],
    },
    {
      slug: 'ev-onboard-charger',
      title: 'EV Onboard Charger Solution',
      metaDescription: 'EV charger meta',
      summary: 'EV charger solution',
      industry: 'EV Charging',
      diagramSrc: '/assets/svg/bd-ev.svg',
      diagramAlt: 'EV block diagram',
      advantages: ['Fast charge'],
      bomList: [],
      scenarios: 'EV applications',
      body: 'Full body text...',
      related: [],
    },
  ],
};

const support = {
  categories: [
    {
      slug: 'guides',
      name: 'Selection Guides',
      title: 'Infineon Selection Guides',
      metaDescription: 'Guides meta',
    },
    {
      slug: 'reviews',
      name: 'New Product Reviews',
      title: 'New Product Reviews',
      metaDescription: 'Reviews meta',
    },
  ],
  tags: [
    { slug: 'igbt', name: 'IGBT' },
    { slug: 'mosfet', name: 'MOSFET' },
    { slug: 'aurix', name: 'AURIX' },
  ],
  authors: [
    {
      slug: 'li-wei',
      name: 'Li Wei',
      photo: '/assets/svg/illustrations/author-li-wei.svg',
      photoAlt: 'Li Wei — BeiLuo FAE Engineer',
      expertise: 'Power semiconductors, IGBT gate drive design',
      experience: '8+ years in power electronics',
      profileHref: '/about/authors/li-wei/',
    },
    {
      slug: 'wang-fang',
      name: 'Wang Fang',
      photo: '/assets/svg/illustrations/author-wang-fang.svg',
      photoAlt: 'Wang Fang — BeiLuo FAE Engineer',
      expertise: 'MCU systems and embedded design',
      experience: '5+ years in MCU applications',
      profileHref: '/about/authors/wang-fang/',
    },
  ],
  articles: [
    {
      slug: 'how-to-select-igbt',
      title: 'How to Select the Right Infineon IGBT',
      category: 'guides',
      // igbt appears in both articles — should yield only ONE /support/tags/igbt/ page
      tags: ['igbt', 'mosfet'],
      author: 'li-wei',
      date: '2024-03-01',
      summary: 'A guide to selecting Infineon IGBTs.',
      metaDescription: 'How to select Infineon IGBT guide.',
      body: 'Body content...',
      internalLinks: [],
      relatedArticles: [],
    },
    {
      slug: 'aurix-tc387-review',
      title: 'AURIX TC387 New Product Review',
      category: 'reviews',
      // igbt repeated → still only 1 igbt tag page total
      tags: ['igbt', 'aurix'],
      author: 'wang-fang',
      date: '2024-04-01',
      summary: 'Review of the AURIX TC387 MCU.',
      metaDescription: 'AURIX TC387 new product review.',
      body: 'Body content...',
      internalLinks: [],
      relatedArticles: [],
    },
  ],
};

const news = {
  articles: [
    {
      slug: 'beiluo-joins-electronica-2024',
      title: 'BeiLuo Joins Electronica 2024',
      type: 'company',
      date: '2024-11-10',
      author: 'BeiLuo Editorial Team',
      categoryTag: 'Company News',
      summary: 'BeiLuo exhibited at Electronica 2024.',
      metaDescription: 'BeiLuo at Electronica 2024.',
      bannerImage: {
        src: '/assets/svg/illustrations/news-beiluo-joins-electronica-2024.svg',
        alt: 'BeiLuo Electronica 2024 booth banner',
      },
      body: 'Body content...',
      share: {
        url: 'https://www.beiluo.com/news/beiluo-joins-electronica-2024/',
        title: 'BeiLuo Joins Electronica 2024',
      },
    },
    {
      slug: 'infineon-igbt-market-2024',
      title: 'Infineon IGBT Market Outlook 2024',
      type: 'industry',
      date: '2024-10-05',
      author: 'Li Wei',
      categoryTag: 'Industry News',
      summary: 'Industry analysis of Infineon IGBT market.',
      metaDescription: 'Infineon IGBT market outlook 2024.',
      bannerImage: {
        src: '/assets/svg/illustrations/news-infineon-igbt-market-2024.svg',
        alt: 'Infineon IGBT market trend 2024',
      },
      body: 'Body content...',
      share: {
        url: 'https://www.beiluo.com/news/infineon-igbt-market-2024/',
        title: 'Infineon IGBT Market Outlook 2024',
      },
    },
  ],
};

const about = { mission: 'Distribute Infineon chips with FAE support.' };

const data = { site, home, products, solutions, support, news, about };

// ── Helpers ───────────────────────────────────────────────────────────────────

function pagesByTemplate(pages, template) {
  return pages.filter(p => p.template === template);
}

function findPage(pages, url) {
  return pages.find(p => p.url === url);
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('buildPageList', () => {
  const pages = buildPageList(data);

  // ── Return type ─────────────────────────────────────────────────────────────
  it('returns an array', () => {
    assert.ok(Array.isArray(pages));
  });

  it('each page has url, template, context, breadcrumb', () => {
    for (const page of pages) {
      assert.ok(typeof page.url === 'string', `url missing on ${page.template}`);
      assert.ok(typeof page.template === 'string', 'template missing');
      assert.ok(page.context !== null && typeof page.context === 'object', 'context missing');
      assert.ok(Array.isArray(page.breadcrumb), 'breadcrumb missing');
    }
  });

  // ── Home ────────────────────────────────────────────────────────────────────
  it('home page has url "/" and template "home"', () => {
    const p = findPage(pages, '/');
    assert.ok(p, 'home page not found');
    assert.equal(p.template, 'home');
  });

  it('home page breadcrumb is empty array', () => {
    const p = findPage(pages, '/');
    assert.deepEqual(p.breadcrumb, []);
  });

  // ── About / Contact ─────────────────────────────────────────────────────────
  it('about page has url "/about/" and template "about"', () => {
    const p = findPage(pages, '/about/');
    assert.ok(p, '/about/ page not found');
    assert.equal(p.template, 'about');
  });

  it('contact page has url "/contact/" and template "contact"', () => {
    const p = findPage(pages, '/contact/');
    assert.ok(p, '/contact/ page not found');
    assert.equal(p.template, 'contact');
  });

  // ── Products list ───────────────────────────────────────────────────────────
  it('products list page has url "/products/" and template "products-list"', () => {
    const p = findPage(pages, '/products/');
    assert.ok(p, '/products/ page not found');
    assert.equal(p.template, 'products-list');
  });

  // ── Product category pages ──────────────────────────────────────────────────
  it('product category pages count equals number of categories (2)', () => {
    const catPages = pagesByTemplate(pages, 'product-category');
    assert.equal(catPages.length, products.categories.length); // 2
  });

  it('product category URLs match /products/<catSlug>/', () => {
    const catPages = pagesByTemplate(pages, 'product-category');
    const urls = catPages.map(p => p.url).sort();
    assert.deepEqual(urls, ['/products/igbt/', '/products/mcu/']);
  });

  it('each model in a category page context has an absolute absoluteHref (Product JSON-LD requires an absolute url)', () => {
    const p = findPage(pages, '/products/igbt/');
    assert.ok(p, '/products/igbt/ page not found');
    for (const model of p.context.category.models) {
      assert.equal(model.absoluteHref, `${site.jsonLd.organizationUrl}${model.href}`);
      assert.ok(model.absoluteHref.startsWith('https://'), `absoluteHref for ${model.partNo} is not absolute: ${model.absoluteHref}`);
    }
  });

  it('category page itemListJsonLd uses absolute urls (ItemList.itemListElement[].url)', () => {
    const p = findPage(pages, '/products/igbt/');
    assert.ok(p, '/products/igbt/ page not found');
    const json = p.context.itemListJsonLd.replace(/^<script[^>]*>/, '').replace(/<\/script>$/, '');
    const obj = JSON.parse(json);
    assert.equal(obj['@type'], 'ItemList');
    for (const el of obj.itemListElement) {
      assert.ok(el.url.startsWith('https://'), `ItemList entry "${el.name}" url is not absolute: ${el.url}`);
    }
  });

  // ── Product category topApplications (dedup + cap) ─────────────────────────
  it('product-category topApplications dedupes across all models and caps at 6', () => {
    const testData = {
      ...data,
      products: {
        categories: [
          {
            slug: 'igbt',
            name: 'IGBT',
            title: 'Infineon IGBT Distributor',
            metaDescription: 'IGBT meta',
            description: 'IGBT desc',
            faeNote: 'FAE note',
            icon: '/assets/svg/icons/igbt.svg',
            selectionGuideHref: '/support/guides/how-to-select-infineon-igbt/',
            selectionGuideDownloadHref: '/assets/docs/igbt-guide.pdf',
            columns: [],
            models: [
              {
                partNo: 'M1',
                series: 'H3',
                params: {},
                package: 'TO-247',
                stock: 'inStock',
                href: '/products/igbt/m1/',
                applications: ['Motor Drive', 'Solar Inverter', 'EV Charging'],
              },
              {
                partNo: 'M2',
                series: 'H3',
                params: {},
                package: 'TO-247',
                stock: 'inStock',
                href: '/products/igbt/m2/',
                // "Motor Drive" repeats (must dedupe); 4 new applications push the
                // unique count to 7, which must be capped at 6.
                applications: ['Motor Drive', 'Industrial IoT', 'Welding', 'UPS', 'Traction'],
              },
            ],
          },
        ],
      },
    };

    const testPages = buildPageList(testData);
    const p = findPage(testPages, '/products/igbt/');
    assert.ok(p, '/products/igbt/ page not found');

    // 7 unique applications across both models, capped at 6
    assert.equal(p.context.topApplications.length, 6);

    // No duplicates in the result
    const unique = new Set(p.context.topApplications);
    assert.equal(unique.size, p.context.topApplications.length);

    // "Motor Drive" (repeated across both models) appears exactly once
    const motorDriveCount = p.context.topApplications.filter(a => a === 'Motor Drive').length;
    assert.equal(motorDriveCount, 1);

    // First-seen order preserved; the 7th unique application ("Traction") is dropped by the cap
    assert.deepEqual(p.context.topApplications, [
      'Motor Drive', 'Solar Inverter', 'EV Charging', 'Industrial IoT', 'Welding', 'UPS',
    ]);
    assert.ok(!p.context.topApplications.includes('Traction'));
  });

  // ── Product detail pages ────────────────────────────────────────────────────
  it('product detail pages count equals total models across all categories (4)', () => {
    const detailPages = pagesByTemplate(pages, 'product-detail');
    const totalModels = products.categories.reduce((n, c) => n + c.models.length, 0);
    assert.equal(detailPages.length, totalModels); // 4
  });

  it('first model of igbt category gets url /products/igbt/ikw40n120h3/', () => {
    const p = findPage(pages, '/products/igbt/ikw40n120h3/');
    assert.ok(p, 'first igbt model page not found');
    assert.equal(p.template, 'product-detail');
  });

  it('duplicate partNo in same category gets deduped slug -2', () => {
    // igbt category has two models with partNo "IKW40N120H3" → second gets ikw40n120h3-2
    const p = findPage(pages, '/products/igbt/ikw40n120h3-2/');
    assert.ok(p, 'deduped model page /products/igbt/ikw40n120h3-2/ not found');
    assert.equal(p.template, 'product-detail');
  });

  it('dedup scope is per-category (mcu models share no namespace with igbt)', () => {
    // mcu first model TC387QP → tc387qp (not tc387qp-2 even though igbt also used a slug)
    const p = findPage(pages, '/products/mcu/tc387qp/');
    assert.ok(p, '/products/mcu/tc387qp/ not found');
  });

  it('per-category namespace isolation: same partNo in different categories yields separate URLs without -2 suffix', () => {
    // Regression test: verify that dedup is per-category, not global.
    // Create data with three categories:
    // - igbt: has TWO models with same partNo (to test dedup within category)
    // - mosfet: has ONE model with the SAME partNo as igbt (to test isolation across categories)
    const testData = {
      ...data,
      products: {
        categories: [
          {
            slug: 'igbt',
            name: 'IGBT',
            title: 'Infineon IGBT Distributor',
            metaDescription: 'IGBT meta',
            description: 'IGBT desc',
            faeNote: 'FAE note',
            icon: '/assets/svg/icons/igbt.svg',
            selectionGuideHref: '/support/guides/how-to-select-infineon-igbt/',
            selectionGuideDownloadHref: '/assets/docs/igbt-guide.pdf',
            columns: [],
            models: [
              {
                partNo: 'IKW40N120H3',
                series: 'H3',
                params: {},
                package: 'TO-247',
                stock: 'inStock',
                href: '/products/igbt/ikw40n120h3/',
              },
              {
                partNo: 'IKW40N120H3',  // Duplicate within same category
                series: 'H3',
                params: {},
                package: 'TO-247',
                stock: 'inStock',
                href: '/products/igbt/ikw40n120h3-2/',
              },
            ],
          },
          {
            slug: 'mosfet',
            name: 'MOSFET',
            title: 'Infineon MOSFET Distributor',
            metaDescription: 'MOSFET meta',
            description: 'MOSFET desc',
            faeNote: 'FAE note',
            icon: '/assets/svg/icons/mosfet.svg',
            selectionGuideHref: '/support/guides/how-to-select-infineon-mosfet/',
            selectionGuideDownloadHref: '/assets/docs/mosfet-guide.pdf',
            columns: [],
            models: [
              {
                partNo: 'IKW40N120H3',  // Same partNo as igbt!
                series: 'H3',
                params: {},
                package: 'TO-247',
                stock: 'inStock',
                href: '/products/mosfet/ikw40n120h3/',
              },
            ],
          },
        ],
      },
    };

    const testPages = buildPageList(testData);

    // Assert: IGBT category dedup still works (within-category duplicates get -2)
    const igbtPage1 = findPage(testPages, '/products/igbt/ikw40n120h3/');
    assert.ok(igbtPage1, '/products/igbt/ikw40n120h3/ should exist');

    const igbtPage2 = findPage(testPages, '/products/igbt/ikw40n120h3-2/');
    assert.ok(igbtPage2, '/products/igbt/ikw40n120h3-2/ should exist (dedup within category)');

    // Assert: MOSFET category gets same slug WITHOUT -2 (per-category isolation)
    const mosfetPage = findPage(testPages, '/products/mosfet/ikw40n120h3/');
    assert.ok(mosfetPage, '/products/mosfet/ikw40n120h3/ should exist (per-category isolation)');

    // Sanity: mosfet should NOT get -2 suffix
    const mosfetPageWithSuffix = findPage(testPages, '/products/mosfet/ikw40n120h3-2/');
    assert.ok(!mosfetPageWithSuffix, '/products/mosfet/ikw40n120h3-2/ should NOT exist (no conflict in mosfet category)');
  });

  it('product detail breadcrumb has 4 levels (Home / Products / Category / PartNo)', () => {
    const p = findPage(pages, '/products/igbt/ikw40n120h3/');
    assert.equal(p.breadcrumb.length, 4);
    assert.equal(p.breadcrumb[0].url, '/');
    assert.equal(p.breadcrumb[1].url, '/products/');
    assert.equal(p.breadcrumb[2].url, '/products/igbt/');
    assert.equal(p.breadcrumb[3].url, '/products/igbt/ikw40n120h3/');
  });

  // ── Solutions ───────────────────────────────────────────────────────────────
  it('solutions list has url "/solutions/" and template "solutions-list"', () => {
    const p = findPage(pages, '/solutions/');
    assert.ok(p, '/solutions/ not found');
    assert.equal(p.template, 'solutions-list');
  });

  it('solution detail pages count equals solutions array length (2)', () => {
    const detailPages = pagesByTemplate(pages, 'solution-detail');
    assert.equal(detailPages.length, solutions.solutions.length); // 2
  });

  it('solution detail URL matches /solutions/<slug>/', () => {
    const p = findPage(pages, '/solutions/bldc-motor-drive/');
    assert.ok(p, '/solutions/bldc-motor-drive/ not found');
    assert.equal(p.template, 'solution-detail');
  });

  // ── Support overview ────────────────────────────────────────────────────────
  it('support overview has url "/support/" and template "support-list"', () => {
    const p = findPage(pages, '/support/');
    assert.ok(p, '/support/ not found');
    assert.equal(p.template, 'support-list');
  });

  // ── Support overview per-category filtered article arrays ──────────────────
  it('support overview guidesArticles contains only guides-category articles', () => {
    const p = findPage(pages, '/support/');
    assert.ok(p, '/support/ not found');
    const slugs = p.context.guidesArticles.map(a => a.slug);
    assert.deepEqual(slugs, ['how-to-select-igbt']);
    for (const a of p.context.guidesArticles) {
      assert.equal(a.category, 'guides');
    }
    // Must not leak the reviews-category article
    assert.ok(!p.context.guidesArticles.some(a => a.slug === 'aurix-tc387-review'));
    // Full-object comparison — guards against a regression that keeps slug
    // filtering correct but returns truncated/reshaped article objects.
    assert.deepEqual(
      p.context.guidesArticles,
      support.articles.filter(a => a.category === 'guides'),
    );
  });

  it('support overview reviewsArticles contains only reviews-category articles', () => {
    const p = findPage(pages, '/support/');
    const slugs = p.context.reviewsArticles.map(a => a.slug);
    assert.deepEqual(slugs, ['aurix-tc387-review']);
    for (const a of p.context.reviewsArticles) {
      assert.equal(a.category, 'reviews');
    }
    // Must not leak the guides-category article
    assert.ok(!p.context.reviewsArticles.some(a => a.slug === 'how-to-select-igbt'));
    assert.deepEqual(
      p.context.reviewsArticles,
      support.articles.filter(a => a.category === 'reviews'),
    );
  });

  it('support overview applicationNotesArticles and troubleshootingArticles are empty for fixture data with no such-category articles', () => {
    const p = findPage(pages, '/support/');
    assert.deepEqual(p.context.applicationNotesArticles, []);
    assert.deepEqual(p.context.troubleshootingArticles, []);
  });

  // ── Support category pages ──────────────────────────────────────────────────
  it('support category pages count equals support.categories length (2)', () => {
    // All pages under /support/<catSlug>/ that are NOT /support/tags/<tagSlug>/
    const catPages = pages.filter(
      p => p.template === 'support-list' &&
        /^\/support\/[^/]+\/$/.test(p.url) &&
        !p.url.startsWith('/support/tags/') &&
        p.url !== '/support/'
    );
    assert.equal(catPages.length, support.categories.length); // 2
  });

  it('support category URLs match /support/<catSlug>/', () => {
    const catPages = pages.filter(
      p => p.template === 'support-list' &&
        /^\/support\/[^/]+\/$/.test(p.url) &&
        !p.url.startsWith('/support/tags/') &&
        p.url !== '/support/'
    );
    const urls = catPages.map(p => p.url).sort();
    assert.deepEqual(urls, ['/support/guides/', '/support/reviews/']);
  });

  // ── Support tag pages (dedup) ───────────────────────────────────────────────
  it('tag pages are deduplicated across all articles (3 unique tags: igbt, mosfet, aurix)', () => {
    const tagPages = pages.filter(p => p.url.startsWith('/support/tags/'));
    // article 0 tags: igbt, mosfet; article 1 tags: igbt, aurix
    // unique: igbt, mosfet, aurix → 3 pages
    assert.equal(tagPages.length, 3);
  });

  it('shared tag "igbt" appears in both articles but yields only one tag page', () => {
    const igbtPages = pages.filter(p => p.url === '/support/tags/igbt/');
    assert.equal(igbtPages.length, 1);
  });

  it('tag pages have template "support-list" and url /support/tags/<slug>/', () => {
    const tagPages = pages.filter(p => p.url.startsWith('/support/tags/'));
    for (const p of tagPages) {
      assert.equal(p.template, 'support-list');
      assert.match(p.url, /^\/support\/tags\/[a-z0-9-]+\/$/);
    }
  });

  // ── Support article detail pages ────────────────────────────────────────────
  it('tech-detail pages count equals support.articles length (2)', () => {
    const techPages = pagesByTemplate(pages, 'tech-detail');
    assert.equal(techPages.length, support.articles.length); // 2
  });

  it('tech-detail URL is /support/<category>/<slug>/', () => {
    const p = findPage(pages, '/support/guides/how-to-select-igbt/');
    assert.ok(p, '/support/guides/how-to-select-igbt/ not found');
    assert.equal(p.template, 'tech-detail');
  });

  it('tech-detail context.author resolves the full author object, not just the slug string', () => {
    const p = findPage(pages, '/support/guides/how-to-select-igbt/');
    assert.ok(p, '/support/guides/how-to-select-igbt/ not found');
    assert.equal(typeof p.context.author, 'object');
    assert.notEqual(p.context.author, null);
    assert.equal(p.context.author.slug, 'li-wei');
    assert.equal(p.context.author.name, 'Li Wei');
    assert.equal(p.context.author.expertise, 'Power semiconductors, IGBT gate drive design');
    // Full resolved object matches the fixture author record exactly.
    assert.deepEqual(p.context.author, support.authors.find(a => a.slug === 'li-wei'));
  });

  it('tech-detail context.author resolves a different author for a different article (wang-fang, not li-wei)', () => {
    const p = findPage(pages, '/support/reviews/aurix-tc387-review/');
    assert.ok(p, '/support/reviews/aurix-tc387-review/ not found');
    assert.equal(p.context.author.slug, 'wang-fang');
    assert.equal(p.context.author.name, 'Wang Fang');
    assert.deepEqual(p.context.author, support.authors.find(a => a.slug === 'wang-fang'));
  });

  // ── News ─────────────────────────────────────────────────────────────────────
  it('news list has url "/news/" and template "news-list"', () => {
    const p = findPage(pages, '/news/');
    assert.ok(p, '/news/ not found');
    assert.equal(p.template, 'news-list');
  });

  it('news detail pages count equals news.articles length (2)', () => {
    const newsPages = pagesByTemplate(pages, 'news-detail');
    assert.equal(newsPages.length, news.articles.length); // 2
  });

  it('news detail URL is /news/<slug>/', () => {
    const p = findPage(pages, '/news/beiluo-joins-electronica-2024/');
    assert.ok(p, 'news detail page not found');
    assert.equal(p.template, 'news-detail');
  });

  // ── Author pages ────────────────────────────────────────────────────────────
  it('author pages count equals support.authors length (2)', () => {
    const authorPages = pages.filter(p => p.url.startsWith('/about/authors/'));
    assert.equal(authorPages.length, support.authors.length); // 2
  });

  it('author page URL is /about/authors/<slug>/', () => {
    const p = findPage(pages, '/about/authors/li-wei/');
    assert.ok(p, '/about/authors/li-wei/ not found');
  });

  it('author page template is "about"', () => {
    const p = findPage(pages, '/about/authors/li-wei/');
    assert.equal(p.template, 'about');
  });

  it('author page context.authorProfile is true', () => {
    const p = findPage(pages, '/about/authors/li-wei/');
    assert.equal(p.context.authorProfile, true);
  });

  it('second author page also has authorProfile true', () => {
    const p = findPage(pages, '/about/authors/wang-fang/');
    assert.ok(p, '/about/authors/wang-fang/ not found');
    assert.equal(p.context.authorProfile, true);
  });

  it('author profile page context.author is the fully resolved author object matching support.authors', () => {
    const p = findPage(pages, '/about/authors/li-wei/');
    assert.ok(p, '/about/authors/li-wei/ not found');
    assert.deepEqual(p.context.author, support.authors.find(a => a.slug === 'li-wei'));
    assert.equal(p.context.author.name, 'Li Wei');
    assert.equal(p.context.author.expertise, 'Power semiconductors, IGBT gate drive design');
  });

  it('author profile page context.authoredArticles contains only articles written by this author', () => {
    const p = findPage(pages, '/about/authors/li-wei/');
    const slugs = p.context.authoredArticles.map(a => a.slug);
    assert.deepEqual(slugs, ['how-to-select-igbt']);
    for (const a of p.context.authoredArticles) {
      assert.equal(a.author, 'li-wei');
    }
    // Must not include wang-fang's article
    assert.ok(!p.context.authoredArticles.some(a => a.slug === 'aurix-tc387-review'));
    assert.deepEqual(
      p.context.authoredArticles,
      support.articles.filter(a => a.author === 'li-wei'),
    );
  });

  it('second author profile page (wang-fang) authoredArticles excludes li-wei\'s article', () => {
    const p = findPage(pages, '/about/authors/wang-fang/');
    const slugs = p.context.authoredArticles.map(a => a.slug);
    assert.deepEqual(slugs, ['aurix-tc387-review']);
    for (const a of p.context.authoredArticles) {
      assert.equal(a.author, 'wang-fang');
    }
    assert.ok(!p.context.authoredArticles.some(a => a.slug === 'how-to-select-igbt'));
    assert.deepEqual(
      p.context.authoredArticles,
      support.articles.filter(a => a.author === 'wang-fang'),
    );
  });

  it('author page breadcrumb has 4 levels (Home / About Us / Authors / Name)', () => {
    const p = findPage(pages, '/about/authors/li-wei/');
    assert.equal(p.breadcrumb.length, 4);
    assert.equal(p.breadcrumb[0].url, '/');
    assert.equal(p.breadcrumb[1].url, '/about/');
    // "Authors" is a virtual grouping level with no dedicated index page —
    // its crumb links to /about/ (nearest real ancestor) rather than a 404.
    assert.equal(p.breadcrumb[2].url, '/about/');
    assert.equal(p.breadcrumb[2].name, 'Authors');
    assert.equal(p.breadcrumb[3].url, '/about/authors/li-wei/');
    assert.equal(p.breadcrumb[3].name, 'Li Wei');
  });

  // ── Site merged into context ─────────────────────────────────────────────────
  it('every page context includes site.brand.name', () => {
    for (const page of pages) {
      assert.equal(
        page.context.brand?.name,
        'BeiLuo',
        `site.brand.name missing on ${page.url}`
      );
    }
  });

  it('every page context includes site.seo.baseUrl', () => {
    for (const page of pages) {
      assert.equal(
        page.context.seo?.baseUrl,
        'https://www.beiluo.com',
        `site.seo.baseUrl missing on ${page.url}`
      );
    }
  });

  // ── context.breadcrumb matches page.breadcrumb ───────────────────────────────
  it('context.breadcrumb is the same object as page.breadcrumb', () => {
    for (const page of pages) {
      assert.strictEqual(
        page.context.breadcrumb,
        page.breadcrumb,
        `context.breadcrumb !== page.breadcrumb on ${page.url}`
      );
    }
  });

  // ── URLs are directory-form (trailing slash) except root ────────────────────
  it('all page URLs end with "/" (directory form)', () => {
    for (const page of pages) {
      assert.ok(
        page.url.endsWith('/'),
        `URL ${page.url} does not end with /`
      );
    }
  });

  // ── Total page count sanity check ───────────────────────────────────────────
  it('total page count matches expected formula', () => {
    // 1 home + 1 about + 1 contact
    // + 1 products-list + 2 cat + 4 detail
    // + 1 solutions-list + 2 solution-detail
    // + 1 support-list + 2 support-cat + 3 tag + 2 tech-detail
    // + 1 news-list + 2 news-detail
    // + 2 author
    const expected = 1 + 1 + 1 + 1 + 2 + 4 + 1 + 2 + 1 + 2 + 3 + 2 + 1 + 2 + 2;
    assert.equal(pages.length, expected); // 26
  });

  // ── Breadcrumb last-item current flag (T2.6) ──────────────────────────────────
  it('home page breadcrumb stays [] with no current item', () => {
    const p = findPage(pages, '/');
    assert.deepEqual(p.breadcrumb, []);
  });

  it('product detail breadcrumb last item has current===true', () => {
    const p = findPage(pages, '/products/igbt/ikw40n120h3/');
    const last = p.breadcrumb[p.breadcrumb.length - 1];
    assert.equal(last.current, true);
  });

  it('product detail breadcrumb non-last items do not have current===true', () => {
    const p = findPage(pages, '/products/igbt/ikw40n120h3/');
    const nonLast = p.breadcrumb.slice(0, -1);
    for (const item of nonLast) {
      assert.notEqual(item.current, true,
        `non-last breadcrumb item "${item.name}" should not have current===true`);
    }
  });

  it('author page breadcrumb last item has current===true', () => {
    const p = findPage(pages, '/about/authors/li-wei/');
    const last = p.breadcrumb[p.breadcrumb.length - 1];
    assert.equal(last.current, true);
  });

  it('author page breadcrumb non-last items do not have current===true', () => {
    const p = findPage(pages, '/about/authors/li-wei/');
    const nonLast = p.breadcrumb.slice(0, -1);
    for (const item of nonLast) {
      assert.notEqual(item.current, true,
        `non-last item "${item.name}" should not have current===true`);
    }
  });

  it('two-item breadcrumb (/about/) marks the last item as current', () => {
    const p = findPage(pages, '/about/');
    assert.equal(p.breadcrumb.length, 2);
    assert.equal(p.breadcrumb[0].current, undefined);
    assert.equal(p.breadcrumb[1].current, true);
  });

  it('tech-detail breadcrumb last item has current===true', () => {
    const p = findPage(pages, '/support/guides/how-to-select-igbt/');
    const last = p.breadcrumb[p.breadcrumb.length - 1];
    assert.equal(last.current, true);
  });

  it('news detail breadcrumb last item has current===true', () => {
    const p = findPage(pages, '/news/beiluo-joins-electronica-2024/');
    const last = p.breadcrumb[p.breadcrumb.length - 1];
    assert.equal(last.current, true);
  });
});
