# Phase-0 Fix Report — 9 Items (codex 5 + reviewer 4)

Generated after applying all fixes in `fix-phase0-brief.md`.

---

## F1 [High] products.schema.md ColumnDef ≠ markup-contract

**Files changed**: `src/data/products.schema.md`, `check_list2.md`

- ColumnDef `type` field updated from `"text"/"number"/"range"/"multiselect"` → `"text" | "number" | "enum"` to match `data-type` values in markup-contract §1.2.
- ColumnDef `filter` field changed from Boolean → string enum `"select" / "range" / "multi" / "none"` to match `data-filter` values in markup-contract §1.2.
- Example column sets updated with explicit `type=…, filter=…` notation.
- `check_list2.md` products.json D1 `ColumnDef` entry updated to reflect new types.

---

## F2 [High] Count quotas changed from "≥" to exact values

**Files changed**: `src/data/products.schema.md`, `src/data/news.schema.md`, `src/data/support.schema.md`, `check_list2.md`

- `products.schema.md`: "≥2 detail-level models" → "exactly 2 detail-level models per category (8 total)" in Count Quotas table, Category `models` field, Model Object description, and Detail Fields heading.
- `news.schema.md`: `articles` array length "**4** (minimum)" → "**exactly 4**"; top-level structure comment "≥4 entries" → "exactly 4 entries".
- `support.schema.md`: top-level structure comment "≥4 detail articles" → "exactly 4 detail articles".
- `check_list2.md`: updated products.json header, D5 item; support.json header, D5 item; news.json header, D5 item.

---

## F3 [Med] about.schema.md — removed optional `Person` from author-page JSON-LD

**Files changed**: `src/data/about.schema.md`

- Removed the `Person (optional, encouraged for E-E-A-T)` row from the Author Profile Page JSON-LD Mapping table.
- Author profile page now lists only `BreadcrumbList`, consistent with approved 7-type list in design §10.

---

## F4 [Med] TOC source unified — body headings only, not data field

**Files changed**: `src/data/support.schema.md`, `check_list2.md`

- `support.schema.md` Count Quotas: replaced `articles[].toc ≥3 entries` row with a note that all body H2/H3 must carry unique `id` attributes and TOC is not stored in JSON.
- `support.schema.md` Article detail fields: removed `toc` row; expanded `body` field description to state all H2/H3 must have `id` attributes for `toc.js`.
- Removed `TocEntry` Object section from `support.schema.md`.
- `check_list2.md` support.json D1: replaced `toc (Array<TocEntry>)` and `TocEntry` entries with h2/h3 id requirement.
- `check_list2.md` support.json D5: replaced `toc ≥3 entries` with h2/h3 id requirement.
- `check_list2.md` support.json D6: replaced `article.toc → {{article.toc}}` with note that `<nav data-toc>` is left empty by template and TOC is built by `toc.js`.

---

## F5 [Med] Form — JS-only submit + noscript degradation

**Files changed**: `src/markup-contract.md`, `check_list1.md`

- `markup-contract.md` §4.1 DOM structure: removed `action="#" method="post"` from `<form>` tag; form is now `<form data-validate novalidate>`.
- Added `<noscript>` block inside form with WhatsApp link `https://wa.me/8615013702378` and WeChat `+86 18612518271` (no `#` hrefs).
- `markup-contract.md` §4.2 attribute table: added explicit row noting `action` is not used (JS-only submit).
- `markup-contract.md` §4.5 degradation table: rewrote "JS 未加载" entry to describe noscript fallback behavior.
- `markup-contract.md` quick-reference table: updated form entry to note `novalidate` (no `action`) and noscript block.
- `check_list1.md` T12 D4: updated form check to `<form data-validate novalidate>` and added noscript block verification item.

---

## F6 [Important] check_list2.md products.json D6 — added 5 missing placeholder gates

**Files changed**: `check_list2.md`

Added before the JSON-LD gate in products.json D6:
- `model.shortDescription` → core info bar (§5.4)
- `model.overview` → Overview tab (§5.4)
- `model.applications` → Application tab + `Product.category` JSON-LD (§10)
- `model.documents` → Documents tab loop
- `model.href` → part number link in table + `Product.url` JSON-LD (§10)

---

## F7 [Important] check_list2.md solutions.json D6 — added `solution.scenarios` gate

**Files changed**: `check_list2.md`

Added gate: `solution.scenarios → {{solution.scenarios}}` as rich text block in "Application Scenarios" H2 section (design §5.6).

---

## F8 [Minor] check_list2.md support.json D6 — added `article.summary` gate

**Files changed**: `check_list2.md`

Added gate (first item in D6): `article.summary → {{article.summary}}` in card preview on `support-list` and category index pages (design §5.7/§5.8).

---

## F9 [Minor] check_list2.md products.json D7 — tightened datasheetHref path requirement

**Files changed**: `check_list2.md`

Changed: "all have real (or realistic placeholder) paths" → "all have real, submitted paths", consistent with iron rule #2 (no placeholder or stub links).

---

## Consistency Check (post-fix)

| Layer | Status |
|-------|--------|
| `products.schema.md` ColumnDef `type`/`filter` ↔ `markup-contract §1.2` `data-type`/`data-filter` | Aligned |
| `products.schema.md` count quotas ↔ `check_list2.md` D5 | Aligned (exact 2/category, 8 total) |
| `news.schema.md` count quotas ↔ `check_list2.md` D5 | Aligned (exactly 4) |
| `support.schema.md` count quotas ↔ `check_list2.md` D5 | Aligned (exactly 4) |
| `about.schema.md` JSON-LD ↔ design §10 approved 7 types | Aligned (Person removed) |
| `support.schema.md` TOC source ↔ `markup-contract §3` `toc.js` | Aligned (body h2/h3[id] only) |
| `check_list2.md` support.json toc refs ↔ `markup-contract §3` | Aligned (removed data-field refs) |
| `markup-contract §4` form ↔ `check_list1.md` T12 D4 | Aligned (JS-only + noscript) |
| `check_list2.md` products.json D6 placeholders ↔ `products.schema.md` detail fields | Aligned (5 gates added) |
| `check_list2.md` solutions.json D6 ↔ `solutions.schema.md` | Aligned (`solution.scenarios` gate added) |
| `check_list2.md` products.json D7 stub gate ↔ iron rule #2 | Aligned (no placeholder paths) |
