import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  breadcrumbList,
  itemList,
  jsonLdScript,
} from '../src/lib/schema.js';

// ─── Fixtures ────────────────────────────────────────────────────────────────

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

  // Fix B: required-field validation
  it('throws when a crumb is missing name', () => {
    assert.throws(
      () => breadcrumbList([{ url: 'https://x.com/' }]),
      /breadcrumbList: missing crumb\.name/
    );
  });

  it('throws when a crumb is missing url', () => {
    assert.throws(
      () => breadcrumbList([{ name: 'Home' }]),
      /breadcrumbList: missing crumb\.url/
    );
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

  // Fix B: required-field validation
  it('throws when an item is missing name', () => {
    assert.throws(
      () => itemList([{ url: 'https://x.com/' }]),
      /itemList: missing item\.name/
    );
  });

  it('throws when an item is missing url', () => {
    assert.throws(
      () => itemList([{ name: 'IKW40N120H3' }]),
      /itemList: missing item\.url/
    );
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

  it('works with breadcrumbList() output', () => {
    const s = jsonLdScript(breadcrumbList(crumbs3));
    const inner = s.slice('<script type="application/ld+json">'.length, -'</script>'.length);
    assert.doesNotThrow(() => JSON.parse(inner));
  });

  it('works with itemList() output', () => {
    const s = jsonLdScript(itemList(items2));
    const inner = s.slice('<script type="application/ld+json">'.length, -'</script>'.length);
    assert.doesNotThrow(() => JSON.parse(inner));
  });

  // Fix A: </script> injection prevention
  it('inner JSON does not contain literal </script> when input has </script>', () => {
    const s = jsonLdScript({ x: '</script><b>hi</b>' });
    const inner = s.slice('<script type="application/ld+json">'.length, -'</script>'.length);
    assert.ok(!inner.includes('</script>'), 'inner JSON must not contain literal </script>');
  });

  it('JSON.parse round-trip restores original value after script-escaping', () => {
    const s = jsonLdScript({ x: '</script><b>hi</b>' });
    const inner = s.slice('<script type="application/ld+json">'.length, -'</script>'.length);
    const parsed = JSON.parse(inner);
    assert.equal(parsed.x, '</script><b>hi</b>');
  });
});