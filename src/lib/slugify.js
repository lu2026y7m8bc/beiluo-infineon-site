/**
 * slugify — convert a title/model string into a URL-safe slug.
 * Rules:
 *  - Lowercase + trim
 *  - Any non [a-z0-9] character (spaces, punctuation, non-ASCII) → treated as
 *    separator and collapsed into a single hyphen
 *  - Leading/trailing hyphens stripped
 *  - Empty / fully-invalid input → returns ""
 *
 * @param {string} input
 * @returns {string}
 */
export function slugify(input) {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')   // non-alphanumeric runs → single hyphen
    .replace(/^-+|-+$/g, '');      // strip leading/trailing hyphens
}

/**
 * uniqueSlug — return a slug that is not already in `usedSet`, then add it.
 * - Calls slugify(input); falls back to "item" when result is empty.
 * - Appends -2, -3, … until a unique value is found.
 *
 * @param {string} input
 * @param {Set<string>} usedSet  — mutated in place
 * @returns {string}
 */
export function uniqueSlug(input, usedSet) {
  const base = slugify(input) || 'item';
  let candidate = base;
  let counter = 2;
  while (usedSet.has(candidate)) {
    candidate = `${base}-${counter}`;
    counter++;
  }
  usedSet.add(candidate);
  return candidate;
}
