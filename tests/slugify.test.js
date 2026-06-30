import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { slugify, uniqueSlug } from '../src/lib/slugify.js';

describe('slugify', () => {
  it('lowercases and replaces spaces with hyphens', () => {
    assert.equal(slugify('MCU Microcontroller'), 'mcu-microcontroller');
  });

  it('handles alphanumeric-only input', () => {
    assert.equal(slugify('IKW40N120H3'), 'ikw40n120h3');
  });

  it('strips trademark symbol and collapses to single hyphen', () => {
    assert.equal(slugify('AURIX™ TC3xx'), 'aurix-tc3xx');
  });

  it('trims surrounding whitespace and collapses multiple spaces', () => {
    assert.equal(slugify('  Hello,  World! '), 'hello-world');
  });

  it('strips punctuation at end', () => {
    assert.equal(slugify('How to select Infineon MCU?'), 'how-to-select-infineon-mcu');
  });

  it('returns empty string for pure CJK input', () => {
    assert.equal(slugify('英飞凌'), '');
  });

  it('collapses multiple hyphens within string', () => {
    assert.equal(slugify('a---b'), 'a-b');
  });

  it('strips leading and trailing hyphens', () => {
    assert.equal(slugify('--a--'), 'a');
  });

  it('returns empty string for empty input', () => {
    assert.equal(slugify(''), '');
  });

  it('returns empty string for whitespace-only input', () => {
    assert.equal(slugify('   '), '');
  });

  it('returns empty string for all non-ASCII non-alphanumeric input', () => {
    assert.equal(slugify('™°µ≥'), '');
  });

  it('handles mixed non-ASCII and ASCII', () => {
    assert.equal(slugify('abc™def'), 'abc-def');
  });

  it('handles degree and micro symbols between words', () => {
    assert.equal(slugify('100°C temperature'), '100-c-temperature');
  });

  it('handles numbers and letters correctly', () => {
    assert.equal(slugify('TC3xx Product'), 'tc3xx-product');
  });
});

describe('uniqueSlug', () => {
  it('returns slugified value on first call', () => {
    const used = new Set();
    assert.equal(uniqueSlug('MCU', used), 'mcu');
  });

  it('adds slug to the used set', () => {
    const used = new Set();
    uniqueSlug('MCU', used);
    assert.ok(used.has('mcu'));
  });

  it('appends -2 on second call with same slug', () => {
    const used = new Set();
    uniqueSlug('MCU', used);
    assert.equal(uniqueSlug('MCU', used), 'mcu-2');
  });

  it('appends -3 on third call with same slug', () => {
    const used = new Set();
    uniqueSlug('MCU', used);
    uniqueSlug('MCU', used);
    assert.equal(uniqueSlug('MCU', used), 'mcu-3');
  });

  it('consecutive three calls produce mcu, mcu-2, mcu-3', () => {
    const used = new Set();
    const r1 = uniqueSlug('MCU', used);
    const r2 = uniqueSlug('MCU', used);
    const r3 = uniqueSlug('MCU', used);
    assert.deepEqual([r1, r2, r3], ['mcu', 'mcu-2', 'mcu-3']);
  });

  it('uses fallback "item" for empty/invalid input', () => {
    const used = new Set();
    assert.equal(uniqueSlug('英飞凌', used), 'item');
  });

  it('deduplicates fallback "item" as well', () => {
    const used = new Set();
    uniqueSlug('英飞凌', used);
    assert.equal(uniqueSlug('™°µ', used), 'item-2');
  });

  it('adds numbered slug to used set', () => {
    const used = new Set();
    uniqueSlug('MCU', used);
    const r2 = uniqueSlug('MCU', used);
    assert.ok(used.has('mcu-2'));
    assert.equal(r2, 'mcu-2');
  });

  it('skips already-used numbered suffix and finds next available', () => {
    const used = new Set(['mcu', 'mcu-2']);
    assert.equal(uniqueSlug('MCU', used), 'mcu-3');
  });
});
