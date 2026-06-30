# products.schema.md — Products Data Schema

> **Source file**: `src/data/products.json`
> **Templates used**:
>   - `products-list` (§5.2) — product center landing, 4 category cards
>   - `product-category` (§5.3) — per-category page with dynamic spec table
>   - `product-detail` (§5.4) — individual model detail page
> **JSON-LD**:
>   - `ItemList` + `Product` (per model) → `product-category` page (design §10, PRD §3.3.2)
>   - `Product` → `product-detail` page (design §10, PRD §3.3.3)
> **Constraint**: All values **pure English**. Descriptions must be **brand-differentiated** (original, not copied from datasheets verbatim). Field names are camelCase for `render.js` / `validate-data.js` alignment.

---

## Count Quotas (PRD §1.3)

| Item | Quota |
|------|-------|
| `categories` array length | **4** (MCU / IGBT / MOSFET / Sensors) |
| `models` per category | **≥2** detail-level models (共 8 total across all categories) |
| `columns` per category | Dynamic — varies per category (e.g., IGBT ≠ MCU columns) |
| `faq` per model | **3–5** questions |
| `specs` per model | ≥5 spec rows |

---

## Top-Level Structure

```
products.json
└── categories: Array<Category>   // exactly 4 entries
```

---

## `Category` Object

| Field | Type | Required | Meaning | Template Placeholder / JSON-LD |
|-------|------|----------|---------|-------------------------------|
| `slug` | String | Required | URL segment: `"mcu"` / `"igbt"` / `"mosfet"` / `"sensors"` | URL: `/products/<slug>/`; breadcrumb label |
| `name` | String | Required | Short display name: `"MCU"` / `"IGBT"` / `"MOSFET"` / `"Sensors"` | `{{category.name}}` in nav Mega Menu and sidebar |
| `title` | String | Required | H1 for category page (keyword-rich, unique): e.g., `"Infineon IGBT Distributor — Full Series, Deep Stock"` | `{{category.title}}` as H1 in `product-category` template; `<title>` tag |
| `metaDescription` | String | Required | Meta description ≤155 chars, contains category keyword (e.g., `"Infineon IGBT distributor"`) | `{{category.metaDescription}}` in `<meta name="description">` |
| `description` | String | Required | **200–300 word** original category description (mentions series like AURIX™/XMC™/PSoC™, advantages, applications + target keywords) | `{{category.description}}` rendered as `<p>` blocks below H1 |
| `faeNote` | String | Required | FAE application note / distributor commentary paragraph (≥50 words, written in first-person FAE voice, brand-differentiated) | `{{category.faeNote}}` in `<blockquote>` / pull-quote block (design §5.3) |
| `icon` | String | Required | SVG icon path: `"/assets/svg/icons/<slug>.svg"` (design §9, same-family line icons) | `{{category.icon}}` in category card and sidebar |
| `selectionGuideHref` | String | Required | Link to corresponding support article (Selection Guide): e.g., `"/support/guides/how-to-select-infineon-igbt/"` | `{{category.selectionGuideHref}}` on "Download Category Selection Guide" / "Selection Guide →" CTA (design §5.3) |
| `columns` | Array\<ColumnDef\> | Required | **Dynamic column definitions** for the spec table — varies per category | `{{category.columns}}` drives `render.js` table header + filter controls (design §4.9, §5.3) |
| `models` | Array\<Model\> | Required | All models in this category (≥2 detail-level models) | `{{category.models}}` loop for table rows and detail pages |

---

## `ColumnDef` Object (dynamic column definitions)

One entry per column in the spec table (design §4.9). Column set is defined per category (IGBT columns differ from MCU columns).

| Field | Type | Required | Meaning | Notes |
|-------|------|----------|---------|-------|
| `key` | String | Required | camelCase key matching a field in `model.params` or a top-level model field (e.g., `"vce"`, `"ic"`, `"package"`) | Used by `render.js` to read value from model object |
| `label` | String | Required | Column header display text: e.g., `"VCE (V)"`, `"IC (A)"`, `"Package"` | `{{col.label}}` as `<th>` content |
| `type` | String | Required | Filter control type: `"text"` / `"number"` / `"range"` / `"multiselect"` | `{{col.type}}` tells `render.js` which filter widget to render (design §4.9) |
| `filter` | Boolean | Required | `true` → render filter control for this column; `false` → display only | `{{col.filter}}` |
| `unit` | String | Optional | Unit suffix displayed in filter/cell: e.g., `"V"`, `"A"`, `"MHz"` | `{{col.unit}}` |
| `sticky` | Boolean | Optional | `true` → freeze column on mobile horizontal scroll (first column: part number) | Applied as CSS class `.col-sticky` |

> **Example column sets by category**:
> - IGBT: partNo (sticky, text), series, vce (V, range), ic (A, range), package (multiselect), stock
> - MCU: partNo (sticky, text), series, coreArch (text), flashKb (range), ramKb (range), maxMhz (range), package (multiselect), stock
> - MOSFET: partNo (sticky), series, vds (V, range), rdsOn (mΩ, range), id (A, range), package (multiselect), stock
> - Sensors: partNo (sticky), series, sensorType (multiselect), interface (multiselect), supplyV (range), package (multiselect), stock

---

## `Model` Object

Shared base fields for all categories (table row level). Detail fields are populated for the ≥2 "detail models" per category.

### Base Fields (required for all models — table row level)

| Field | Type | Required | Meaning | Template Placeholder / JSON-LD |
|-------|------|----------|---------|-------------------------------|
| `partNo` | String | Required | Part number: e.g., `"IKW40N120H3"` — shown as blue link in table | `{{model.partNo}}` as H1 in detail page; `Product.sku` in JSON-LD |
| `series` | String | Required | Product series name: e.g., `"H3"` | `{{model.series}}` in table cell |
| `params` | Object | Required | Dynamic parameters object — keys must match `columns[].key` values for this category | `{{model.params.<key>}}` accessed dynamically by `render.js` |
| `package` | String | Required | Package type: e.g., `"TO-247"`, `"LQFP-64"` | `{{model.package}}` in table and detail |
| `stock` | String | Required | Stock status: `"inStock"` or `"rfq"` | `{{model.stock}}` → renders green "In Stock" or orange "RFQ" badge (design §4.8) |
| `stockQty` | Number | Optional | Indicative quantity on hand (omit if not disclosed) | `{{model.stockQty}}` if present |
| `href` | String | Required | Detail page path: `"/products/<categorySlug>/<partNo-slug>/"` | `{{model.href}}` on part number link in table; `Product.url` in JSON-LD |

### Detail Fields (required for the ≥2 "detail-level" models per category)

These fields power the `product-detail` template (design §5.4).

| Field | Type | Required | Meaning | Template Placeholder / JSON-LD |
|-------|------|----------|---------|-------------------------------|
| `overview` | String | Required | Product overview text ≥100 words (first paragraph in Overview tab — brand-differentiated, not verbatim from datasheet) | `{{model.overview}}` in Overview tab (design §5.4) |
| `shortDescription` | String | Required | ≤30-word description shown in right info bar at top of detail page alongside stock badge | `{{model.shortDescription}}` in core info bar |
| `image` | String | Required | Product image SVG path: `"/assets/svg/illustrations/<partNo>.svg"` | `{{model.image}}` as `<img src>` in left column of detail page; `Product.image` in JSON-LD |
| `imageAlt` | String | Required | Descriptive alt text containing part number + type (e.g., `"Infineon IKW40N120H3 IGBT TO-247 package"`) | `{{model.imageAlt}}` |
| `datasheetHref` | String | Required | Link to datasheet PDF (external or `/assets/`): used on "Download Datasheet" secondary CTA | `{{model.datasheetHref}}` on blue-outline CTA button (design §5.4) |
| `specs` | Array\<SpecRow\> | Required | Full specification table rows (≥5 rows) for Specifications tab | `{{model.specs}}` loop in `.spec-table` (design §4.9, §5.4) |
| `applications` | Array\<String\> | Required | Application areas list: e.g., `["Solar Inverter", "EV Charger"]` | `{{model.applications}}` in Application tab (design §5.4); `Product.category` in JSON-LD |
| `documents` | Array\<Document\> | Required | Downloadable documents list in Documents tab | `{{model.documents}}` loop in Documents tab |
| `faq` | Array\<FaqItem\> | Required | 3–5 FAQ items (accordion pattern — GEO-optimized Q&A) | `{{model.faq}}` loop as accordion (design §5.4, PRD §3.3.3) |
| `alternativeParts` | Array\<PartRef\> | Required | Alternative/substitute part numbers (internal links to product pages) | `{{model.alternativeParts}}` in carousel/card section (design §5.4, PRD §3.3.3) |
| `companionParts` | Array\<PartRef\> | Required | Companion/complementary parts (gate drivers, capacitors, etc.) | `{{model.companionParts}}` in carousel/card section |
| `brand` | String | Required | Always `"Infineon Technologies"` — for JSON-LD | `Product.brand.name` in JSON-LD |
| `mpn` | String | Optional | Manufacturer part number (if different from partNo) | `Product.mpn` in JSON-LD |
| `gtin` | String | Optional | GTIN if available | `Product.gtin` in JSON-LD |

---

## `SpecRow` Object

| Field | Type | Required | Meaning | Placeholder |
|-------|------|----------|---------|-------------|
| `param` | String | Required | Parameter name: e.g., `"Collector-Emitter Voltage VCE"` | `{{row.param}}` as `<th scope="row">` |
| `value` | String | Required | Parameter value: e.g., `"1200"` | `{{row.value}}` |
| `unit` | String | Optional | Unit: e.g., `"V"`, `"A"`, `"nC"` | `{{row.unit}}` rendered after value |

---

## `Document` Object

| Field | Type | Required | Meaning | Placeholder |
|-------|------|----------|---------|-------------|
| `title` | String | Required | Document title: e.g., `"IKW40N120H3 Datasheet"` | `{{doc.title}}` |
| `href` | String | Required | Download URL (no empty links — iron rule §9 #2) | `{{doc.href}}` |
| `type` | String | Required | `"datasheet"` / `"application-note"` / `"selection-guide"` | `{{doc.type}}` — used to render correct icon |
| `fileSize` | String | Optional | e.g., `"1.2 MB"` | `{{doc.fileSize}}` |

---

## `FaqItem` Object

| Field | Type | Required | Meaning | Placeholder |
|-------|------|----------|---------|-------------|
| `question` | String | Required | FAQ question (question-type keyword phrasing for GEO) | `{{faq.question}}` as accordion header |
| `answer` | String | Required | FAQ answer (≥30 words, factual, brand-differentiated) | `{{faq.answer}}` as accordion body |

---

## `PartRef` Object (for alternativeParts / companionParts)

| Field | Type | Required | Meaning | Placeholder |
|-------|------|----------|---------|-------------|
| `partNo` | String | Required | Referenced part number | `{{ref.partNo}}` as card title |
| `slug` | String | Required | URL slug for the part: used to build `"/products/<categorySlug>/<slug>/"` | `{{ref.slug}}` for href |
| `categorySlug` | String | Required | Category of the referenced part (for URL construction) | Used by `render.js` to build link |
| `summary` | String | Optional | One-line description | `{{ref.summary}}` in card body |

---

## JSON-LD Mapping

### `product-category` template (design §10, PRD §3.3.2)

| Schema Type | Data Source |
|-------------|------------|
| `ItemList` | `category.models[]` — each item is a `ListItem` with `item.@type = "Product"` |
| `Product` (per item) | `model.partNo` → `sku`, `model.brand` → `brand.name`, `model.href` → `url`, `model.image` → `image`, `model.shortDescription` → `description` |

### `product-detail` template (design §10, PRD §3.3.3)

| Schema Type | Field Mapping |
|-------------|--------------|
| `Product.name` | `model.partNo` |
| `Product.sku` | `model.partNo` |
| `Product.mpn` | `model.mpn` (fallback to `partNo`) |
| `Product.brand.name` | `model.brand` (`"Infineon Technologies"`) |
| `Product.description` | `model.shortDescription` |
| `Product.image` | `model.image` |
| `Product.url` | `model.href` (absolute, via `site.seo.baseUrl`) |
| `Product.category` | `model.applications[0]` |
| `BreadcrumbList` | Auto-built from `Home → Products → <category.name> → <model.partNo>` |

---

## Brand Differentiation Notes

- `category.description` (200–300 words) must be **original** — not copied from Infineon's official site. Mention specific series (e.g., AURIX™ TC3xx, XMC™ 4000, PSoC™ 6, OptiMOS™) with BeiLuo's distributor angle (stock depth, FAE support, fast delivery).
- `category.faeNote` must read as a genuine FAE commentary, not marketing copy.
- `model.overview` must be original product description contextualizing the part for engineers.
- All model FAQ answers should reflect BeiLuo's expertise as a distributor (stock, application guidance, alternative suggestions).
