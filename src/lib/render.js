/**
 * Minimal template engine — ESM, zero deps.
 * Syntax: {{path}}, {{{path}}}, {{#if}}, {{#each}}, {{> partial}}
 */

// ─── escapeHtml ───────────────────────────────────────────────────────────────

export function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ─── Path resolution ──────────────────────────────────────────────────────────

function resolvePath(data, path) {
  const parts = path.trim().split('.');
  let val = data;
  for (const part of parts) {
    if (val == null || typeof val !== 'object') return undefined;
    val = val[part];
  }
  return val;
}

// ─── Truthiness (empty array is falsy) ───────────────────────────────────────

function isTruthy(val) {
  if (val == null) return false;
  if (Array.isArray(val)) return val.length > 0;
  return Boolean(val);
}

// ─── Tokenizer ────────────────────────────────────────────────────────────────

function tokenize(template) {
  const tokens = [];
  let i = 0;

  while (i < template.length) {
    // Triple-brace raw (must check before double-brace)
    if (template.startsWith('{{{', i)) {
      const end = template.indexOf('}}}', i + 3);
      if (end === -1) throw new Error('Unclosed {{{');
      tokens.push({ type: 'raw', path: template.slice(i + 3, end).trim() });
      i = end + 3;
      continue;
    }

    // Double-brace
    if (template.startsWith('{{', i)) {
      const end = template.indexOf('}}', i + 2);
      if (end === -1) throw new Error('Unclosed {{');
      const content = template.slice(i + 2, end).trim();

      if (content.startsWith('#if ')) {
        tokens.push({ type: 'if', path: content.slice(4).trim() });
      } else if (content === 'else') {
        tokens.push({ type: 'else' });
      } else if (content === '/if') {
        tokens.push({ type: '/if' });
      } else if (content.startsWith('#each ')) {
        tokens.push({ type: 'each', path: content.slice(6).trim() });
      } else if (content === '/each') {
        tokens.push({ type: '/each' });
      } else if (content.startsWith('> ')) {
        tokens.push({ type: 'partial', name: content.slice(2).trim() });
      } else {
        tokens.push({ type: 'var', path: content });
      }

      i = end + 2;
      continue;
    }

    // Plain text
    let next = template.indexOf('{{', i);
    if (next === -1) next = template.length;
    tokens.push({ type: 'text', value: template.slice(i, next) });
    i = next;
  }

  return tokens;
}

// ─── Block collectors ─────────────────────────────────────────────────────────

/**
 * Collect tokens for {{#if}} body (and optional {{else}} body).
 * Correctly handles nested {{#if}} / {{/if}} pairs.
 * Returns [ifTokens, elseTokens|null, newPos].
 */
function collectIfBlock(tokens, pos) {
  const ifTokens = [];
  let elseTokens = null;
  let inElse = false;
  let depth = 1;

  while (pos < tokens.length) {
    const tok = tokens[pos];

    if (tok.type === 'if') {
      depth++;
      (inElse ? elseTokens : ifTokens).push(tok);
    } else if (tok.type === '/if') {
      depth--;
      if (depth === 0) return [ifTokens, elseTokens, pos + 1];
      (inElse ? elseTokens : ifTokens).push(tok);
    } else if (tok.type === 'else' && depth === 1) {
      elseTokens = [];
      inElse = true;
    } else {
      (inElse ? elseTokens : ifTokens).push(tok);
    }

    pos++;
  }

  throw new Error('Unclosed #if');
}

/**
 * Collect tokens for {{#each}} body.
 * Correctly handles nested {{#each}} / {{/each}} pairs.
 * Returns [bodyTokens, newPos].
 */
function collectEachBlock(tokens, pos) {
  const body = [];
  let depth = 1;

  while (pos < tokens.length) {
    const tok = tokens[pos];

    if (tok.type === 'each') {
      depth++;
      body.push(tok);
    } else if (tok.type === '/each') {
      depth--;
      if (depth === 0) return [body, pos + 1];
      body.push(tok);
    } else {
      body.push(tok);
    }

    pos++;
  }

  throw new Error('Unclosed #each');
}

// ─── Token processor ──────────────────────────────────────────────────────────

function processTokens(tokens, data, partials) {
  let result = '';
  let pos = 0;

  while (pos < tokens.length) {
    const tok = tokens[pos];

    switch (tok.type) {
      case 'text':
        result += tok.value;
        pos++;
        break;

      case 'var': {
        const val = resolvePath(data, tok.path);
        if (val == null) throw new Error(`Missing field: ${tok.path}`);
        result += escapeHtml(String(val));
        pos++;
        break;
      }

      case 'raw': {
        const val = resolvePath(data, tok.path);
        if (val == null) throw new Error(`Missing field: ${tok.path}`);
        result += String(val);
        pos++;
        break;
      }

      case 'if': {
        const [ifTokens, elseTokens, newPos] = collectIfBlock(tokens, pos + 1);
        const val = resolvePath(data, tok.path);
        if (isTruthy(val)) {
          result += processTokens(ifTokens, data, partials);
        } else if (elseTokens !== null) {
          result += processTokens(elseTokens, data, partials);
        }
        pos = newPos;
        break;
      }

      case 'each': {
        const [bodyTokens, newPos] = collectEachBlock(tokens, pos + 1);
        const arr = resolvePath(data, tok.path);
        if (arr != null && Array.isArray(arr)) {
          for (let idx = 0; idx < arr.length; idx++) {
            const item = arr[idx];
            // Build per-item context: spread object fields, always add @index and this
            const ctx =
              typeof item === 'object' && item !== null
                ? { ...item, '@index': idx, this: item }
                : { this: item, '@index': idx };
            result += processTokens(bodyTokens, ctx, partials);
          }
        }
        pos = newPos;
        break;
      }

      case 'partial': {
        if (!(tok.name in partials)) {
          throw new Error(`Missing partial: ${tok.name}`);
        }
        result += render(partials[tok.name], data, partials);
        pos++;
        break;
      }

      default:
        pos++;
    }
  }

  return result;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Render a template string with the given data and optional partials map.
 * @param {string} template
 * @param {object} data
 * @param {Record<string,string>} partials
 * @returns {string}
 */
export function render(template, data, partials = {}) {
  const tokens = tokenize(template);
  return processTokens(tokens, data, partials);
}
