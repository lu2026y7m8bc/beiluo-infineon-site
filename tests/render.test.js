import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { render, escapeHtml } from '../src/lib/render.js';

// ─── escapeHtml ─────────────────────────────────────────────────────────────
describe('escapeHtml', () => {
  it('escapes & first, then < > " \'', () => {
    assert.equal(escapeHtml('A & B <x> "y" \'z\''), 'A &amp; B &lt;x&gt; &quot;y&quot; &#39;z&#39;');
  });

  it('handles & before < so &lt; is not double-escaped', () => {
    // & must be replaced before < so "& <" → "&amp; &lt;"
    assert.equal(escapeHtml('& <'), '&amp; &lt;');
  });

  it('passes through plain text unchanged', () => {
    assert.equal(escapeHtml('hello world'), 'hello world');
  });

  it('converts a number to escaped string', () => {
    assert.equal(escapeHtml(42), '42');
  });
});

// ─── Simple interpolation ────────────────────────────────────────────────────
describe('render – interpolation', () => {
  it('escapes HTML in double-brace interpolation', () => {
    assert.equal(render('<h1>{{t}}</h1>', { t: 'A & B <x>' }), '<h1>A &amp; B &lt;x&gt;</h1>');
  });

  it('inserts number as string', () => {
    assert.equal(render('{{n}}', { n: 42 }), '42');
  });

  it('inserts boolean as string', () => {
    assert.equal(render('{{b}}', { b: true }), 'true');
  });

  it('triple-brace does NOT escape HTML', () => {
    assert.equal(render('{{{h}}}', { h: '<b>x</b>' }), '<b>x</b>');
  });

  it('triple-brace also passes numbers through', () => {
    assert.equal(render('{{{n}}}', { n: 99 }), '99');
  });

  it('nested path a.b resolves correctly', () => {
    assert.equal(render('{{a.b}}', { a: { b: 'hello' } }), 'hello');
  });

  it('deeply nested path a.b.c resolves correctly', () => {
    assert.equal(render('{{a.b.c}}', { a: { b: { c: 'deep' } } }), 'deep');
  });
});

// ─── Missing-field errors ────────────────────────────────────────────────────
describe('render – missing-field throws', () => {
  it('throws Missing field: x for undefined key (double-brace)', () => {
    assert.throws(() => render('{{x}}', {}), /Missing field: x/);
  });

  it('throws Missing field: x for null value (double-brace)', () => {
    assert.throws(() => render('{{x}}', { x: null }), /Missing field: x/);
  });

  it('throws Missing field: x for undefined key (triple-brace)', () => {
    assert.throws(() => render('{{{x}}}', {}), /Missing field: x/);
  });

  it('throws Missing field: x for null value (triple-brace)', () => {
    assert.throws(() => render('{{{x}}}', { x: null }), /Missing field: x/);
  });

  it('throws with nested path in message: a.b', () => {
    assert.throws(() => render('{{a.b}}', { a: {} }), /Missing field: a\.b/);
  });
});

// ─── Conditionals ────────────────────────────────────────────────────────────
describe('render – #if', () => {
  it('renders truthy branch when value is truthy string', () => {
    assert.equal(render('{{#if x}}YES{{/if}}', { x: 'hi' }), 'YES');
  });

  it('renders nothing when falsy (false)', () => {
    assert.equal(render('{{#if x}}YES{{/if}}', { x: false }), '');
  });

  it('renders nothing when falsy (0)', () => {
    assert.equal(render('{{#if x}}YES{{/if}}', { x: 0 }), '');
  });

  it('renders nothing when falsy (empty string)', () => {
    assert.equal(render('{{#if x}}YES{{/if}}', { x: '' }), '');
  });

  it('renders nothing when falsy (null)', () => {
    assert.equal(render('{{#if x}}YES{{/if}}', { x: null }), '');
  });

  it('renders nothing when falsy (undefined / missing)', () => {
    assert.equal(render('{{#if x}}YES{{/if}}', {}), '');
  });

  it('renders else branch when falsy', () => {
    assert.equal(render('{{#if x}}YES{{else}}NO{{/if}}', { x: false }), 'NO');
  });

  it('renders if branch when truthy, skipping else', () => {
    assert.equal(render('{{#if x}}YES{{else}}NO{{/if}}', { x: 1 }), 'YES');
  });

  it('treats empty array [] as falsy', () => {
    assert.equal(render('{{#if items}}YES{{else}}NO{{/if}}', { items: [] }), 'NO');
  });

  it('treats non-empty array as truthy', () => {
    assert.equal(render('{{#if items}}YES{{/if}}', { items: [1] }), 'YES');
  });
});

// ─── Each loop ───────────────────────────────────────────────────────────────
describe('render – #each', () => {
  it('iterates object array with {{field}} and {{@index}}', () => {
    const tpl = '{{#each items}}{{@index}}:{{name}} {{/each}}';
    const data = { items: [{ name: 'A' }, { name: 'B' }] };
    assert.equal(render(tpl, data), '0:A 1:B ');
  });

  it('iterates primitive array with {{this}}', () => {
    const tpl = '{{#each list}}{{this}},{{/each}}';
    const data = { list: ['x', 'y', 'z'] };
    assert.equal(render(tpl, data), 'x,y,z,');
  });

  it('produces 0 iterations for undefined path (lenient)', () => {
    assert.equal(render('{{#each items}}X{{/each}}', {}), '');
  });

  it('produces 0 iterations for null path (lenient)', () => {
    assert.equal(render('{{#each items}}X{{/each}}', { items: null }), '');
  });

  it('produces 0 iterations for empty array', () => {
    assert.equal(render('{{#each items}}X{{/each}}', { items: [] }), '');
  });

  it('throws Missing field when object item is missing a referenced field', () => {
    const tpl = '{{#each items}}{{missing}}{{/each}}';
    assert.throws(() => render(tpl, { items: [{ name: 'A' }] }), /Missing field: missing/);
  });
});

// ─── Partials ────────────────────────────────────────────────────────────────
describe('render – partials', () => {
  it('renders a partial with current context', () => {
    const tpl = '{{> greet}}';
    const data = { name: 'World' };
    const partials = { greet: 'Hello {{name}}' };
    assert.equal(render(tpl, data, partials), 'Hello World');
  });

  it('throws Missing partial when partial is not registered', () => {
    assert.throws(() => render('{{> missing}}', {}), /Missing partial: missing/);
  });

  it('partial can use nested data fields', () => {
    const tpl = '{{> card}}';
    const data = { product: { title: 'Widget' } };
    const partials = { card: '<div>{{product.title}}</div>' };
    assert.equal(render(tpl, data, partials), '<div>Widget</div>');
  });

  it('partial receives same partials map for recursive nesting', () => {
    const tpl = '{{> outer}}';
    const data = { a: 'A', b: 'B' };
    const partials = {
      outer: '({{> inner}})',
      inner: '{{a}}-{{b}}'
    };
    assert.equal(render(tpl, data, partials), '(A-B)');
  });
});

// ─── Nesting ─────────────────────────────────────────────────────────────────
describe('render – nesting', () => {
  it('each containing if with {{field}}', () => {
    const tpl = '{{#each items}}{{#if active}}{{name}}{{/if}}{{/each}}';
    const data = {
      items: [
        { name: 'alpha', active: true },
        { name: 'beta', active: false },
        { name: 'gamma', active: true }
      ]
    };
    assert.equal(render(tpl, data), 'alphagamma');
  });

  it('each containing nested each', () => {
    const tpl = '{{#each rows}}[{{#each cols}}{{this}}{{/each}}]{{/each}}';
    const data = { rows: [{ cols: ['a', 'b'] }, { cols: ['c'] }] };
    assert.equal(render(tpl, data), '[ab][c]');
  });

  it('partial inside each uses per-item context', () => {
    const tpl = '{{#each items}}{{> item}}{{/each}}';
    const data = { items: [{ label: 'X' }, { label: 'Y' }] };
    const partials = { item: '[{{label}}]' };
    assert.equal(render(tpl, data, partials), '[X][Y]');
  });
});
