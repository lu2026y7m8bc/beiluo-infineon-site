import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  organization,
  webSite,
  breadcrumbList,
  itemList,
  product,
  techArticle,
  newsArticle,
  jsonLdScript,
} from '../src/lib/schema.js';

// ─── Fixtures ────────────────────────────────────────────────────────────────

const site = {
  brand: { name: 'BeiLuo' },
  url: 'https://www.beiluo.com',
  logoUrl: 'https://www.beiluo.com/assets/svg/logo.svg',
};

const crumbs2 = [
  { name: 'Home', url: 'https://www.beiluo.com/' },
  { name: 'Products', url: 'https://www.beiluo.com/products/' },
];

const crumbs3 = [
  { name: 'Home', url: 'https://www.beiluo.com/' },
  { name: 'Products', url: 'https://www.beiluo.com/products/' },
  { name: 'IGBT', url: 'https://www.beiluo.com/products/igbt/' },
];

const items2 = [
  { name: 'IKW40N120H3', url: 'https://www.beiluo.com/products/igbt/ikw40n120h3/' },
  { name: 'IHW30N120R3', url: 'https://www.beiluo.com/products/igbt/ihw30n120r3/' },
];

const modelInStock = {
  partNo: 'IKW40N120H3',
  stock: 'inStock',
};

const modelRfq = {
  partNo: 'IHW30N120R3',
  stock: 'rfq',
};

const productOpts = {
  brandName: 'Infineon',
  url: 'https://www.beiluo.com/products/igbt/ikw40n120h3/',
  category: 'IGBT',
  orgUrl: 'https://www.beiluo.com',
};

const articleSupport = {
  title: 'How to Select the Right Infineon IGBT',
  date: '2024-03-15',
  metaDescription: 'A guide to selecting Infineon IGBT.',
};

const techOpts = {
  authorName: 'Li Wei',
  publisher: {
    '@type': 'Organization',
    name: 'BeiLuo',
    logo: { url: 'https://www.beiluo.com/assets/svg/logo.svg' },
  },
  image: 'https://www.beiluo.com/assets/svg/illustrations/igbt-guide.svg',
};

const articleNews = {
  title: 'BeiLuo Joins Electronica 2024',
  date: '2024-11-10',
  author: 'BeiLuo Editorial Team',
  bannerImage: 'https://www.beiluo.com/assets/svg/illustrations/news-electronica.svg',
  metaDescription: 'BeiLuo exhibits at Electronica 2024.',
};

const newsOpts = {
  publisher: {
    '@type': 'Organization',
    name: 'BeiLuo',
    logo: { url: 'https://www.beiluo.com/assets/svg/logo.svg' },
  },
};

// ─── organization ─────────────────────────────────────────────────────────────

describe('organization(site)', () => {
  const obj = organization(site);

  it('has @context = "https://schema.org"', () => {
    assert.equal(obj['@context'], 'https://schema.org');
  });

  it('has @type = "Organization"', () => {
    assert.equal(obj['@type'], 'Organization');
  });

  it('has name from site.brand.name', () => {
    assert.equal(obj.name, site.brand.name);
  });

  it('has url from site.url', () => {
    assert.equal(obj.url, site.url);
  });

  it('has logo from site.logoUrl', () => {
    assert.equal(obj.logo, site.logoUrl);
  });

  it('is JSON.stringify safe', () => {
    assert.doesNotThrow(() => JSON.stringify(obj));
  });
});

// ─── webSite ─────────────────────────────────────────────────────────────────

describe('webSite(site)', () => {
  const obj = webSite(site);

  it('has @context = "https://schema.org"', () => {
    assert.equal(obj['@context'], 'https://schema.org');
  });

  it('has @type = "WebSite"', () => {
    assert.equal(obj['@type'], 'WebSite');
  });

  it('has name from site.brand.name', () => {
    assert.equal(obj.name, site.brand.name);
  });

  it('has url from site.url', () => {
    assert.equal(obj.url, site.url);
  });

  it('is JSON.stringify safe', () => {
    assert.doesNotThrow(() => JSON.stringify(obj));
  });
});

// ─── breadcrumbList ───────────────────────────────────────────────────────────

describe('breadcrumbList(crumbs)', () => {
  const obj2 = breadcrumbList(crumbs2);
  const obj3 = breadcrumbList(crumbs3);
  const objEmpty = breadcrumbList([]);

  it('has @context = "https://schema.org"', () => {
    assert.equal(obj2['@context'], 'https://schema.org');
  });

  it('has @type = "BreadcrumbList"', () => {
    assert.equal(obj2['@type'], 'BreadcrumbList');
  });

  it('has itemListElement array', () => {
    assert.ok(Array.isArray(obj2.itemListElement));
  });

  it('itemListElement length matches crumbs length', () => {
    assert.equal(obj2.itemListElement.length, 2);
    assert.equal(obj3.itemListElement.length, 3);
  });

  it('first item has position 1', () => {
    assert.equal(obj2.itemListElement[0].position, 1);
  });

  it('positions increment 1..n', () => {
    const positions = obj3.itemListElement.map(e => e.position);
    assert.deepEqual(positions, [1, 2, 3]);
  });

  it('each item has @type = "ListItem"', () => {
    for (const el of obj2.itemListElement) {
      assert.equal(el['@type'], 'ListItem');
    }
  });

  it('each item has name from crumb.name', () => {
    assert.equal(obj2.itemListElement[0].name, 'Home');
    assert.equal(obj2.itemListElement[1].name, 'Products');
  });

  it('each item has item (url) from crumb.url', () => {
    assert.equal(obj2.itemListElement[0].item, 'https://www.beiluo.com/');
    assert.equal(obj2.itemListElement[1].item, 'https://www.beiluo.com/products/');
  });

  it('empty crumbs → itemListElement is empty array (no throw)', () => {
    assert.doesNotThrow(() => breadcrumbList([]));
    assert.deepEqual(objEmpty.itemListElement, []);
  });

  it('is JSON.stringify safe', () => {
    assert.doesNotThrow(() => JSON.stringify(obj3));
  });
});

// ─── itemList ─────────────────────────────────────────────────────────────────

describe('itemList(items)', () => {
  const obj = itemList(items2);

  it('has @context = "https://schema.org"', () => {
    assert.equal(obj['@context'], 'https://schema.org');
  });

  it('has @type = "ItemList"', () => {
    assert.equal(obj['@type'], 'ItemList');
  });

  it('has itemListElement array', () => {
    assert.ok(Array.isArray(obj.itemListElement));
  });

  it('itemListElement length matches items length', () => {
    assert.equal(obj.itemListElement.length, 2);
  });

  it('each element has @type = "ListItem"', () => {
    for (const el of obj.itemListElement) {
      assert.equal(el['@type'], 'ListItem');
    }
  });

  it('positions start at 1 and increment', () => {
    assert.equal(obj.itemListElement[0].position, 1);
    assert.equal(obj.itemListElement[1].position, 2);
  });

  it('each element has name from item.name', () => {
    assert.equal(obj.itemListElement[0].name, 'IKW40N120H3');
  });

  it('each element has url from item.url', () => {
    assert.equal(obj.itemListElement[0].url, 'https://www.beiluo.com/products/igbt/ikw40n120h3/');
  });

  it('is JSON.stringify safe', () => {
    assert.doesNotThrow(() => JSON.stringify(obj));
  });
});

// ─── product ──────────────────────────────────────────────────────────────────

describe('product(model, opts)', () => {
  const objIn = product(modelInStock, productOpts);
  const objRfq = product(modelRfq, productOpts);

  it('has @context = "https://schema.org"', () => {
    assert.equal(objIn['@context'], 'https://schema.org');
  });

  it('has @type = "Product"', () => {
    assert.equal(objIn['@type'], 'Product');
  });

  it('name = model.partNo', () => {
    assert.equal(objIn.name, 'IKW40N120H3');
  });

  it('sku = model.partNo', () => {
    assert.equal(objIn.sku, 'IKW40N120H3');
  });

  it('brand.@type = "Brand"', () => {
    assert.equal(objIn.brand['@type'], 'Brand');
  });

  it('brand.name = "Infineon" (from opts.brandName)', () => {
    assert.equal(objIn.brand.name, 'Infineon');
  });

  it('brand.name defaults to "Infineon" when opts.brandName omitted', () => {
    const o = product(modelInStock, { url: 'https://x.com/', category: 'IGBT' });
    assert.equal(o.brand.name, 'Infineon');
  });

  it('url = opts.url', () => {
    assert.equal(objIn.url, productOpts.url);
  });

  it('category = opts.category', () => {
    assert.equal(objIn.category, 'IGBT');
  });

  it('offers.@type = "Offer"', () => {
    assert.equal(objIn.offers['@type'], 'Offer');
  });

  it('offers.availability = InStock when stock = "inStock"', () => {
    assert.equal(objIn.offers.availability, 'https://schema.org/InStock');
  });

  it('offers.availability = PreOrder when stock = "rfq"', () => {
    assert.equal(objRfq.offers.availability, 'https://schema.org/PreOrder');
  });

  it('offers has no price field', () => {
    assert.ok(!('price' in objIn.offers));
  });

  it('offers has no priceCurrency field', () => {
    assert.ok(!('priceCurrency' in objIn.offers));
  });

  it('offers.url = opts.url', () => {
    assert.equal(objIn.offers.url, productOpts.url);
  });

  it('is JSON.stringify safe', () => {
    assert.doesNotThrow(() => JSON.stringify(objIn));
    assert.doesNotThrow(() => JSON.stringify(objRfq));
  });
});

// ─── techArticle ─────────────────────────────────────────────────────────────

describe('techArticle(article, opts)', () => {
  const obj = techArticle(articleSupport, techOpts);

  it('has @context = "https://schema.org"', () => {
    assert.equal(obj['@context'], 'https://schema.org');
  });

  it('has @type = "TechArticle"', () => {
    assert.equal(obj['@type'], 'TechArticle');
  });

  it('headline = article.title', () => {
    assert.equal(obj.headline, articleSupport.title);
  });

  it('datePublished = article.date', () => {
    assert.equal(obj.datePublished, articleSupport.date);
  });

  it('author.@type = "Person"', () => {
    assert.equal(obj.author['@type'], 'Person');
  });

  it('author.name = opts.authorName', () => {
    assert.equal(obj.author.name, 'Li Wei');
  });

  it('publisher present', () => {
    assert.ok(obj.publisher);
    assert.equal(obj.publisher.name, 'BeiLuo');
  });

  it('image = opts.image when provided', () => {
    assert.equal(obj.image, techOpts.image);
  });

  it('image absent when opts.image not provided', () => {
    const o = techArticle(articleSupport, { authorName: 'Li Wei', publisher: techOpts.publisher });
    assert.ok(!('image' in o));
  });

  it('is JSON.stringify safe', () => {
    assert.doesNotThrow(() => JSON.stringify(obj));
  });
});

// ─── newsArticle ─────────────────────────────────────────────────────────────

describe('newsArticle(article, opts)', () => {
  const obj = newsArticle(articleNews, newsOpts);

  it('has @context = "https://schema.org"', () => {
    assert.equal(obj['@context'], 'https://schema.org');
  });

  it('has @type = "NewsArticle"', () => {
    assert.equal(obj['@type'], 'NewsArticle');
  });

  it('headline = article.title', () => {
    assert.equal(obj.headline, articleNews.title);
  });

  it('datePublished = article.date', () => {
    assert.equal(obj.datePublished, articleNews.date);
  });

  it('author.name = article.author', () => {
    assert.equal(obj.author.name, 'BeiLuo Editorial Team');
  });

  it('author has @type', () => {
    assert.ok(obj.author['@type'] === 'Person' || obj.author['@type'] === 'Organization');
  });

  it('publisher present', () => {
    assert.ok(obj.publisher);
    assert.equal(obj.publisher.name, 'BeiLuo');
  });

  it('image = article.bannerImage', () => {
    assert.equal(obj.image, articleNews.bannerImage);
  });

  it('is JSON.stringify safe', () => {
    assert.doesNotThrow(() => JSON.stringify(obj));
  });
});

// ─── jsonLdScript ─────────────────────────────────────────────────────────────

describe('jsonLdScript(obj)', () => {
  const sampleObj = { '@context': 'https://schema.org', '@type': 'WebSite', name: 'BeiLuo', url: 'https://www.beiluo.com' };
  const script = jsonLdScript(sampleObj);

  it('returns a string', () => {
    assert.equal(typeof script, 'string');
  });

  it('starts with correct script tag', () => {
    assert.ok(script.startsWith('<script type="application/ld+json">'));
  });

  it('ends with </script>', () => {
    assert.ok(script.endsWith('</script>'));
  });

  it('inner JSON round-trips via JSON.parse', () => {
    const inner = script.slice('<script type="application/ld+json">'.length, -'</script>'.length);
    assert.doesNotThrow(() => JSON.parse(inner));
    const parsed = JSON.parse(inner);
    assert.equal(parsed['@type'], 'WebSite');
    assert.equal(parsed.name, 'BeiLuo');
  });

  it('works with organization() output', () => {
    const s = jsonLdScript(organization(site));
    const inner = s.slice('<script type="application/ld+json">'.length, -'</script>'.length);
    const parsed = JSON.parse(inner);
    assert.equal(parsed['@type'], 'Organization');
  });

  it('works with breadcrumbList() output', () => {
    const s = jsonLdScript(breadcrumbList(crumbs3));
    const inner = s.slice('<script type="application/ld+json">'.length, -'</script>'.length);
    assert.doesNotThrow(() => JSON.parse(inner));
  });

  it('works with product() output', () => {
    const s = jsonLdScript(product(modelInStock, productOpts));
    const inner = s.slice('<script type="application/ld+json">'.length, -'</script>'.length);
    assert.doesNotThrow(() => JSON.parse(inner));
  });
});
