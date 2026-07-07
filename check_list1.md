# check_list1.md — Template Acceptance Rubric
# BeiLuo Infineon Distributor Site — Phase 5 Template Delivery Gate

**Purpose**: Acceptance rubric for all 12 templates + author page variant (reuses `about`). Every `- [ ]` must be
checked before a template is considered delivered. Items are verifiable against the listed source.

**Source references**:
- `docs/current/design.md` §2 (tokens), §4 (components), §5 (template wireframes),
  §7 (responsive matrix), §8 (accessibility), §10 (JSON-LD mapping)
- `docs/current/prd.md` §3 (per-template acceptance), §5 (minimum coverage standard),
  iron rules #1–#9
- `src/markup-contract.md` §1 (spec-table), §2 (tab), §3 (sticky-toc), §4 (form)

**Dimensions applied to every template**:
| ID | Dimension |
|----|-----------|
| D1 | nav / footer / breadcrumb consistency |
| D2 | Design tokens (color / font / radius / shadow) |
| D3 | Three-tier responsive (desktop ≥1200 / tablet 768–1199 / mobile <768) |
| D4 | Key CSS classes active per markup-contract |
| D5 | SVG illustrations (presence + keyword alt) |
| D6 | SEO Meta (unique Title / Description / single H1) |
| D7 | JSON-LD schema (type per design §10) |
| D8 | CTA completeness (per-template rules) |
| D9 | Zero empty links / zero 404 |

---

## T01 · home (`/index.html`)

> design §5.1; prd §3.2

### D1 — nav / footer / breadcrumb

- [ ] `<nav>` contains logo, tagline "Top 8 Electronic Component Distributor in China", all primary nav links (Home / Products / Solutions / Support / News / About / Contact), and orange "Get a Quote" button. (design §4.1)
- [ ] **No breadcrumb on homepage** — breadcrumb component is absent. (design §5 preamble)
- [ ] `<footer>` renders 4 columns: brand+tagline+intro / Products links / Support+Solutions+News links / Contact with WhatsApp+WeChat; collapses to 1 column on mobile. (design §4.2)
- [ ] Right-side fixed contact float present (`position:fixed;right:16px;top:40%;z-index:30`) with WhatsApp and WeChat icons; on mobile collapses to bottom-right button. (design §4.5)
- [ ] Nav sticks after 40 px scroll: `position:sticky`, `rgba(255,255,255,.88)` + `backdrop-filter:blur(8px)` + `--sh-nav`. (design §4.1)

### D2 — design tokens

- [ ] Primary blue `#0072CE` (`--c-primary`) on nav links, H heading accents, primary button strokes. (design §2.1)
- [ ] Background alt `#F8F9FA` (`--c-bg-alt`) used in "Why Choose Us" and Products section blocks. (design §2.1)
- [ ] CTA button "Get a Quote" fill `#F5821F` (`--c-cta`) with **dark text `#1A2433` (`--c-text`)** — no white text on orange. (design §2.1 contrast note, §4.6)
- [ ] Card border-radius `--r-card: 12px`; button/input border-radius `--r-base: 8px`. (design §2.3)
- [ ] Card shadow `--sh-card: 0 4px 6px rgba(0,0,0,.07)` on product category cards. (design §2.3)
- [ ] Heading font `Inter` / body font `Roboto`; both Google Fonts with `font-display:swap`. (design §2.2, prd §4.4)

### D3 — three-tier responsive

- [ ] Desktop ≥1200px: container `max-width:1319px` centered; Products section 4-column grid; Feature Grid 3 columns. (design §3, §7)
- [ ] Tablet 768–1199px: Products section → 2 columns; Feature Grid → 2 columns; Nav remains horizontal. (design §7)
- [ ] Mobile <768px: all grids → 1 column; hamburger icon → right drawer (`z-index:50`); no horizontal overflow. (design §4.1, §7)

### D4 — key CSS classes

- [ ] Right-side float uses correct z-index (30) and `position:fixed`. (design §4.5)
- [ ] No `.spec-table`, `.tab-container`, `.sticky-sidebar`, or `.article-content` are present on this template (not needed). (design §5.1)

### D5 — SVG illustrations

- [ ] Hero section: abstract circuit/PCB background SVG; decorative (empty `alt=""` or `role="presentation"`). (design §9)
- [ ] "Why Choose Us" feature icons: inline SVG or `<img src="*.svg">`, 24×24 viewBox, `currentColor` stroke. (design §9)
- [ ] Products section: 4 category icon SVGs (MCU / IGBT / MOSFET / Sensors); each `alt` includes the category keyword (e.g., `alt="Infineon MCU distributor"`). (design §9, prd §4.5)
- [ ] Trust badge SVGs (ISO / quality certification) in Hero trust strip. (design §5.1, §9)

### D6 — SEO Meta

- [ ] `<title>` contains both "infineon distributor" and "BeiLuo" (e.g., `Infineon distributor | BeiLuo`). (prd §3.2)
- [ ] `<meta name="description">` present, contains "infineon distributor" and "BeiLuo", 50–160 chars. (prd §4.1)
- [ ] Single `<h1>` on page (e.g., "Your Trusted Infineon Distributor"); no second H1. (design §8)
- [ ] All text is pure English — no Chinese characters in visible or meta content. (prd iron rule #1)

### D7 — JSON-LD

- [ ] `<script type="application/ld+json">` with `@type: "Organization"` present; includes `name`, `url`, `logo`, `contactPoint`. (design §10, §5.1)
- [ ] `<script type="application/ld+json">` with `@type: "WebSite"` present; includes `url`. (design §10)
- [ ] Both JSON-LD blocks are valid JSON (no trailing commas, no syntax errors). (prd §4.2)

### D8 — CTA

- [ ] Hero section: orange primary CTA "Get a Quote" + secondary ghost/text "Browse Products". (design §5.1)
- [ ] Final CTA section at page bottom: full-width orange/dark block with prominent "Contact Sales" or equivalent button. (design §5.1)
- [ ] All CTA buttons use `--c-cta` orange fill with `--c-text` dark label. (design §4.6)

### D9 — zero empty links / zero 404

- [ ] No `<a href="#">` or `<a href="">` with placeholder destinations. (prd iron rule #2)
- [ ] All 6 primary nav links (Products / Solutions / Support / News / About / Contact) and footer links resolve to existing pages. (prd §3.1)
- [ ] "Get a Quote" button in nav and Hero both link to `/contact/` or a valid quote anchor. (prd iron rule #2)

---

## T02 · products-list (`/products/index.html`)

> design §5.2; prd §3.3.1

### D1 — nav / footer / breadcrumb

- [ ] Same `<nav>` and `<footer>` as T01 (globally consistent). (design §4.1, §4.2)
- [ ] Breadcrumb present: `Home / Products`; "Products" has `aria-current="page"` and is not a link. (design §4.3)
- [ ] Sidebar with product category navigation (all 4 categories) present. (design §4.4, §5.2)
- [ ] Right-side fixed contact float present. (design §4.5)

### D2 — design tokens

- [ ] Category cards: `--r-card 12px`, `--sh-card`, border `--c-border`. (design §4.7)
- [ ] Card hover: `transform:translateY(-4px)` + `--sh-hover`; transition ≤300ms `ease-out`. (design §4.7, §6)
- [ ] Primary blue `#0072CE` on H1 accent and card link text ("View Models →"). (design §2.1)
- [ ] Heading font Inter (H1, card titles) / body font Roboto (descriptions) with `font-display:swap`. (design §2.2)

### D3 — three-tier responsive

- [ ] Desktop ≥1200px: 4-column category card grid. (design §3)
- [ ] Tablet 768–1199px: 2-column card grid. (design §3)
- [ ] Mobile <768px: 1-column card grid; sidebar collapses below main content or into accordion. (design §3, §4.4)

### D4 — key CSS classes

- [ ] Sidebar uses design §4.4 category navigation tree pattern; no `.sticky-sidebar` required here. (design §4.4)
- [ ] No `.spec-table`, `.tab-container`, `.article-content` present (not needed). (design §5.2)

### D5 — SVG illustrations

- [ ] 4 category icon SVGs (MCU / IGBT / MOSFET / Sensors) in unified line-icon style; each `alt` contains the category keyword. (design §9, prd §4.5)
- [ ] All illustration files are `.svg` format. (prd §4.3)

### D6 — SEO Meta

- [ ] `<title>` unique, contains "Infineon" + products keyword + "BeiLuo". (prd iron rule #3)
- [ ] `<meta name="description">` unique, 50–160 chars, describes the 4 product categories. (prd §4.1)
- [ ] Single `<h1>` on page. (design §8)

### D7 — JSON-LD

- [ ] `@type: "BreadcrumbList"` matching visible breadcrumb (`Home → Products`). (design §10)
- [ ] JSON-LD is valid JSON. (prd §4.2)

### D8 — CTA

- [ ] Each of the 4 category cards has a "View Models →" or equivalent ghost/text link pointing to `/products/<category>/`. (design §5.2)

### D9 — zero empty links / zero 404

- [ ] All 4 category card links resolve to existing product-category pages. (prd iron rule #2)
- [ ] Breadcrumb "Home" link resolves to `/`. (prd iron rule #2)
- [ ] No placeholder `#` hrefs. (prd iron rule #2)

---

## T03 · product-category (`/products/<category>/index.html`) — 4 instances

> design §5.3; prd §3.3.2

### D1 — nav / footer / breadcrumb

- [ ] Globally consistent `<nav>` and `<footer>`. (design §4.1, §4.2)
- [ ] Breadcrumb: `Home / Products / <Category Name>` with `aria-current="page"` on category. (design §4.3)
- [ ] Sidebar: product category navigation tree, current category highlighted. (design §4.4, §5.3)
- [ ] Right-side fixed contact float present. (design §4.5)

### D2 — design tokens

- [ ] Spec table header row: `--c-bg-alt` background, bold text. (design §4.9)
- [ ] Even table rows: `--c-bg-alt` zebra stripe. (design §4.9)
- [ ] Table row hover: `--c-primary-tint #E6F1FB`. (design §4.9)
- [ ] Part No. column links: `--c-primary #0072CE` blue. (design §4.9)
- [ ] Stock badges pill `--r-pill`: "In Stock" green `--c-success #1F9D55` / `--c-success-tint` bg; "RFQ" orange `--c-warn #E8820C` / `--c-warn-tint` bg. (design §4.8)
- [ ] "Download Selection Guide" uses secondary button style (blue border, blue text, transparent fill). (design §4.6)

### D3 — three-tier responsive

- [ ] Desktop ≥1200px: full spec table columns visible; sidebar 300px beside content. (design §7)
- [ ] Tablet 768–1199px: table wraps in `overflow-x:auto` horizontal scroll. (design §7)
- [ ] Mobile <768px: table scrolls horizontally; Part No. column frozen `position:sticky;left:0` (`.col-sticky`). (design §7, markup-contract §1.2)
- [ ] Sidebar collapses below main content on mobile. (design §4.4)

### D4 — key CSS classes

- [ ] Outer scroll wrapper `<div class="spec-table-wrap">` present. (markup-contract §1.1)
- [ ] `<div data-filter-bar></div>` inside `.spec-table-wrap` before `<table>` (JS filter mount point). (markup-contract §1.1, §1.2)
- [ ] `<table class="spec-table">` present. (markup-contract §1.1)
- [ ] All `<th>` have `scope="col"`, `data-col`, `data-type` (`text`/`number`/`enum`); `data-filter` (`select`/`range`/`multi`) is **optional** — omit on non-filterable columns (no attribute rendered, no filter control generated). (markup-contract §1.2)
- [ ] Part No. `<th>` and `<td>` elements each have `class="col-sticky"`. (markup-contract §1.2)
- [ ] Every `<td>` has `data-col` matching its column `<th>`. (markup-contract §1.2)
- [ ] Stock `<td>` contains `<span class="stock-badge stock-badge--inStock">` or `class="stock-badge stock-badge--rfq"`. (markup-contract §1.1 -- corrected during T8.1 close-out to match the actual implemented convention across product-category.html and product-detail.html; no functional dependency on the class name exists in table-filter.js, this was a doc/implementation naming drift, not a defect)

### D5 — SVG illustrations

- [ ] Category-level illustration SVG in header/intro area; `alt` contains category keyword (e.g., `alt="Infineon IGBT distributor"`). (design §9, prd §4.5)
- [ ] Feature highlight cards contain icon SVGs with descriptive `alt`. (design §5.3)

### D6 — SEO Meta

- [ ] `<title>` unique per category, contains category keyword + "distributor" + "BeiLuo" (e.g., `Infineon IGBT Distributor | BeiLuo`). (prd §3.3.2, iron rule #3)
- [ ] `<meta name="description">` unique per category, 50–160 chars, contains category keyword. (prd §4.1)
- [ ] Single `<h1>` (e.g., "Infineon IGBT Distributor"). (design §8)
- [ ] 200–300-word original category description below H1, naturally contains category keywords. (prd §3.3.2)

### D7 — JSON-LD

- [ ] `@type: "BreadcrumbList"` with correct item list (`Home → Products → <Category>`). (design §10)
- [ ] `@type: "ItemList"` listing all product model entries on the page. (design §10, §5.3)
- [ ] Each model in ItemList associated with `@type: "Product"` (at minimum `name`, `sku`, `brand`). (design §10, prd §3.3.2)
- [ ] All JSON-LD blocks are valid JSON. (prd §4.2)

### D8 — CTA

- [ ] "Download Category Selection Guide" secondary-style button below category description; links to `category.selectionGuideDownloadHref` (PDF path, products.schema.md). (design §5.3, prd §3.3.2)
- [ ] "Selection Guide →" ghost/text link to a corresponding support/tech-detail article; links to `category.selectionGuideHref` (URL, products.schema.md). (design §5.3)
- [ ] FAE commentary / application-insight quote block present on page. (prd §3.3.2)

### D9 — zero empty links / zero 404

- [ ] Every model number in spec table links to its product-detail page (no 404). (prd iron rule #2, §3.3.2)
- [ ] "Download Category Selection Guide" link does not 404. (prd iron rule #2)
- [ ] Breadcrumb and sidebar category links all resolve. (prd iron rule #2)
- [ ] No placeholder `#` hrefs in spec table or CTAs. (prd iron rule #2)

---

## T04 · product-detail (`/products/<category>/<model>/index.html`) — 8 instances

> design §5.4; prd §3.3.3

### D1 — nav / footer / breadcrumb

- [ ] Breadcrumb: `Home / Products / <Category> / <Part No.>` with `aria-current="page"` on part. (design §4.3)
- [ ] **NO sidebar** on product-detail (design §5.4, prd §3.1 C6). (design §5.4)
- [ ] Globally consistent `<nav>`, `<footer>`, and right-side contact float. (design §4.1, §4.2, §4.5)

### D2 — design tokens

- [ ] Stock badge in hero info column: pill `--r-pill`; "In Stock" green / "RFQ" orange per design §4.8. (design §4.8, §2.1)
- [ ] Primary CTA "Get a Quote": `#F5821F` fill, `#1A2433` dark text — no white text on orange. (design §2.1, §4.6)
- [ ] Secondary CTA "Download Datasheet": `--c-primary` blue border, blue text, transparent fill. (design §4.6)
- [ ] Tab active underline: `--c-primary #0072CE`. (design §4.10)
- [ ] Spec table in Specifications tab: `--c-bg-alt` zebra stripe, `--c-primary-tint` row hover. (design §4.9)

### D3 — three-tier responsive

- [ ] Desktop ≥1200px: hero first-screen `1fr 1fr` dual column (left: product image, right: info + CTAs). (design §5.4, §7)
- [ ] Tablet 768–1199px: hero remains 2-column (`1fr 1fr`); Specifications tab spec table scrolls horizontally. (design §7)
- [ ] Mobile <768px: hero collapses to single column (image above, info+CTAs below). (design §7)
- [ ] Specifications tab table: `overflow-x:auto` horizontal scroll on tablet/mobile. (design §7)
- [ ] `.tab-container` tab bar scrolls horizontally on mobile. (design §4.10)

### D4 — key CSS classes

- [ ] `.tab-container` wrapping all 4 tab panels (Overview / Specifications / Application / Documents). (markup-contract §2.1)
- [ ] `[role="tablist"]` with `aria-label`; each `[role="tab"]` has `data-tab`, `aria-selected`, `aria-controls`, `id="tab-<id>"`; non-default tabs have `tabindex="-1"`. (markup-contract §2.2)
- [ ] Each `[role="tabpanel"]` has `data-tabpanel="<id>"`, `id="tabpanel-<id>"`, `aria-labelledby="tab-<id>"`; non-default panels have `hidden`. (markup-contract §2.2)
- [ ] Specifications panel contains `.spec-table` inside `.spec-table-wrap`. (markup-contract §1, §2)
- [ ] No `.sticky-sidebar` or `.article-content` present (not needed). (design §5.4)

### D5 — SVG illustrations

- [ ] Left column product image: SVG with descriptive `alt` including part number and category. (design §9, prd §4.5)
- [ ] Alternative/companion parts carousel — each card has a product SVG icon with `alt`. (design §5.4)

### D6 — SEO Meta

- [ ] `<title>` unique per model (e.g., `IKW40N120H3 Infineon IGBT Distributor | BeiLuo`). (prd iron rule #3)
- [ ] `<meta name="description">` unique, contains part number + keyword. (prd §4.1)
- [ ] Single `<h1>` = part number (e.g., `IKW40N120H3`). (design §8)

### D7 — JSON-LD

- [ ] `@type: "BreadcrumbList"` matching visible breadcrumb. (design §10)
- [ ] `@type: "Product"` with `name` (part number), `sku`, `brand` (`{"@type":"Brand","name":"Infineon"}`), `description`, `offers` (`{"@type":"Offer","availability":"...","url":"..."}` — RFQ inquiry-based model: `price` and `priceCurrency` are **omitted**, only `availability` and `url` are present). (design §10, §5.4)
- [ ] JSON-LD blocks are valid JSON. (prd §4.2)

### D8 — CTA

- [ ] Dual CTA in hero column: orange "Get a Quote" (primary) + blue-border "Download Datasheet" (secondary). (design §5.4, prd §3.3.3)
- [ ] Multi-CTA section at bottom: at least 4 actions — Download Datasheet / Apply for Sample / Get a Quote / Ask FAE. (design §5.4, prd §3.3.3)
- [ ] FAQ section with 3–5 Q&As in accordion (hand-accordion or details/summary). (design §5.4, prd §3.3.3)

### D9 — zero empty links / zero 404

- [ ] All alternative/companion part cards link to existing product-detail pages. (prd iron rule #2)
- [ ] "Download Datasheet" link does not 404. (prd iron rule #2)
- [ ] Breadcrumb all levels valid. (prd iron rule #2)
- [ ] FAQ accordion items contain no broken cross-references. (prd iron rule #2)

---

## T05 · solutions-list (`/solutions/index.html`)

> design §5.5; prd §3.4.1

### D1 — nav / footer / breadcrumb

- [ ] Breadcrumb: `Home / Solutions`. (design §4.3)
- [ ] Sidebar: industry navigation (links to each solution-detail). (design §4.4, §5.5)
- [ ] Globally consistent `<nav>`, `<footer>`, right-side contact float. (design §4.1, §4.2, §4.5)

### D2 — design tokens

- [ ] Solution cards: `--r-card 12px`, `--sh-card`, hover `translateY(-4px)` + `--sh-hover`. (design §4.7)
- [ ] "Read →" ghost link in `--c-primary` blue. (design §4.6)
- [ ] H1 font Inter 700; card summary font Roboto. (design §2.2)

### D3 — three-tier responsive

- [ ] Desktop ≥1200px: 3-column solution card grid. (design §3)
- [ ] Tablet 768–1199px: 2-column grid. (design §3)
- [ ] Mobile <768px: 1-column; sidebar collapses below content. (design §3, §4.4)

### D4 — key CSS classes

- [ ] Sidebar uses standard sidebar pattern (no `.sticky-sidebar` required). (design §4.4)
- [ ] No `.spec-table`, `.tab-container`, `.article-content` present (not needed). (design §5.5)

### D5 — SVG illustrations

- [ ] Each solution card has an SVG industry icon/illustration; `alt` contains the solution/industry keyword. (design §9, prd §4.5)

### D6 — SEO Meta

- [ ] `<title>` unique, contains "Infineon" + solutions keyword + "BeiLuo". (prd iron rule #3)
- [ ] `<meta name="description">` unique, 50–160 chars. (prd §4.1)
- [ ] Single `<h1>` describing the solutions listing. (design §8)

### D7 — JSON-LD

- [ ] `@type: "BreadcrumbList"` matching visible breadcrumb. (design §10)
- [ ] JSON-LD valid JSON. (prd §4.2)

### D8 — CTA

- [ ] Each solution card has "Read →" or "View Solution →" text/ghost link. (design §5.5)

### D9 — zero empty links / zero 404

- [ ] All solution card links resolve to existing solution-detail pages. (prd iron rule #2)
- [ ] Sidebar industry links resolve. (prd iron rule #2)
- [ ] Breadcrumb links valid. (prd iron rule #2)

---

## T06 · solution-detail (`/solutions/<slug>/index.html`) — 5 instances

> design §5.6; prd §3.4.2

### D1 — nav / footer / breadcrumb

- [ ] Breadcrumb: `Home / Solutions / <Solution Title>`. (design §4.3)
- [ ] Sidebar present: related solutions list + related products list + "Get BOM Quote" entry. (design §5.6, §4.4)
- [ ] Globally consistent `<nav>`, `<footer>`, right-side contact float. (design §4.1, §4.2, §4.5)

### D2 — design tokens

- [ ] Article body: `--c-text #1A2433`, line-height 1.8, max-width 800px, paragraph spacing 24px. (design §2.2)
- [ ] BOM list part links: `--c-primary #0072CE` blue. (design §2.1)
- [ ] Distributor CTA at page end: `#F5821F` fill, `#1A2433` dark text. (design §4.6)

### D3 — three-tier responsive

- [ ] Desktop ≥1200px: `1fr 300px` two-column layout (content + sidebar). (design §3, §7)
- [ ] Tablet 768–1199px: content + sidebar (sidebar may narrow). (design §7)
- [ ] Mobile <768px: sidebar moves below main content. (design §7, §4.4)

### D4 — key CSS classes

- [ ] Main body wrapped in `<article class="article-content">` (establishes max-width 800px, line-height 1.8). (markup-contract §3.2, design §2.2)
- [ ] Sidebar uses `<aside>` element; if sticky TOC not present, no `.sticky-sidebar` required. (design §4.4)
- [ ] No `.spec-table` or `.tab-container` present (not needed). (design §5.6)

### D5 — SVG illustrations

- [ ] Block Diagram SVG present with **detailed descriptive `alt`** explaining the system/circuit architecture. (design §5.6, §9)
- [ ] At least 1 SVG illustration on page total. (prd §4.5)

### D6 — SEO Meta

- [ ] `<title>` unique per solution (e.g., `BLDC Motor Solution with Infineon Components | BeiLuo`). (prd iron rule #3)
- [ ] `<meta name="description">` unique, 50–160 chars, contains solution keyword. (prd §4.1)
- [ ] Single `<h1>` = solution title. (design §8)
- [ ] Body text ≥800 words. (prd §3.4.2)

### D7 — JSON-LD

- [ ] `@type: "BreadcrumbList"` matching visible breadcrumb. (design §10, §5.6)
- [ ] JSON-LD valid JSON. (prd §4.2)

### D8 — CTA

- [ ] "Get BOM Quote" CTA link/button in sidebar. (design §5.6)
- [ ] Distributor CTA block at end of main content. (design §5.6, prd §3.4.2)

### D9 — zero empty links / zero 404

- [ ] All BOM list part number links resolve to existing product-detail pages. (prd §3.4.2, iron rule #2)
- [ ] Sidebar related solution/product links resolve. (prd iron rule #2)
- [ ] Breadcrumb links valid. (prd iron rule #2)

---

## T07 · support-list (`/support/index.html`; also `/support/<category>/`; also `/support/tags/<tag>/`)

> design §5.7–5.9; prd §3.5.1–3.5.3
> Category-index pages and tag-aggregate pages reuse this template; no new template is created.

### D1 — nav / footer / breadcrumb

- [ ] Overview page breadcrumb: `Home / Support`. (design §4.3)
- [ ] Category index breadcrumb: `Home / Support / <Category>`. (design §4.3, prd §3.5.2)
- [ ] Tag page breadcrumb: `Home / Support / Tags / <Tag>`. (design §4.3, prd §3.5.3)
- [ ] All support pages are non-home; breadcrumb is never absent on any variant. (design §5 preamble)
- [ ] Globally consistent `<nav>`, `<footer>`, right-side contact float. (design §4.1, §4.2, §4.5)

### D2 — design tokens

- [ ] Article preview cards: `--r-card 12px`, `--sh-card`, hover effect. (design §4.7)
- [ ] Tab active underline: `--c-primary #0072CE`. (design §4.10)
- [ ] Tag badges: pill `--r-pill`, `--c-primary-tint` background, primary blue text. (design §4.8, §4.12)
- [ ] H1 and card titles: Inter font. (design §2.2)

### D3 — three-tier responsive

- [ ] Desktop ≥1200px: article card grid 3 columns; sidebar visible. (design §3)
- [ ] Tablet 768–1199px: article card grid 2 columns; sidebar narrowed but visible; tab bar may scroll. (design §3, §7)
- [ ] Mobile <768px: cards collapse to 1 column; `.tab-container` tab bar scrolls horizontally. (design §4.10, §3)
- [ ] Sidebar collapses below main content on mobile. (design §4.4)

### D4 — key CSS classes

- [ ] Overview page (`/support/`): `.tab-container` with 4 tabs (Selection Guides / Application Notes / Troubleshooting / New Product Reviews). (markup-contract §2.1, design §5.7)
- [ ] Tab ARIA attributes on overview page: `role="tablist"`, `[role="tab"][data-tab]`, `[role="tabpanel"][data-tabpanel]`, `aria-selected`, `hidden` on non-active panels. (markup-contract §2.2)
- [ ] Category index and tag pages: no `.tab-container` (full article list, no tab). (design §5.8, §5.9)
- [ ] No `.spec-table`, `.sticky-sidebar`, `.article-content` present (not needed). (design §5.7)

### D5 — SVG illustrations

- [ ] Each article preview card has a cover SVG with keyword `alt`. (design §9, prd §4.5)
- [ ] All illustration files are `.svg` format. (prd §4.3)

### D6 — SEO Meta

- [ ] Overview page title unique, contains "Infineon Support" + "BeiLuo". (prd §3.5.1)
- [ ] Category index page title unique per category (e.g., `Infineon IGBT Selection Guides | BeiLuo`). (prd §3.5.2, iron rule #3)
- [ ] Tag page title unique per tag (e.g., `Articles tagged "IGBT" | BeiLuo`). (prd §3.5.3)
- [ ] Each URL variant has a single `<h1>` matching the page scope. (design §8)

### D7 — JSON-LD

- [ ] Each URL variant has `@type: "BreadcrumbList"` matching its visible breadcrumb. (design §10)
- [ ] JSON-LD valid JSON for all variants. (prd §4.2)

### D8 — CTA

- [ ] Overview page: each tab section has "View all in {category} →" link to `/support/<category>/`. (design §5.7, prd §3.5.1)
- [ ] Category index and tag pages: each article card is a fully linked entry to a tech-detail page. (prd §3.5.2, §3.5.3)

### D9 — zero empty links / zero 404

- [ ] All article card links resolve to existing tech-detail pages. (prd iron rule #2)
- [ ] "View all in {category}" links resolve to existing category index pages. (prd iron rule #2)
- [ ] Tag badge links resolve to existing tag-aggregate pages. (prd iron rule #2)
- [ ] Breadcrumb links valid for all 3 URL variants. (prd iron rule #2)

---

## T08 · tech-detail (`/support/<category>/<slug>/index.html`) — 4 instances

> design §5.10; prd §3.5.4

### D1 — nav / footer / breadcrumb

- [ ] Breadcrumb: `Home / Support / <Category> / <Article Title>`. (design §4.3)
- [ ] Sticky sidebar present (TOC + Related PDF Download + Ask an Engineer form entry). (design §5.10, §4.4)
- [ ] Globally consistent `<nav>`, `<footer>`, right-side contact float. (design §4.1, §4.2, §4.5)

### D2 — design tokens

- [ ] Article body: max-width 800px, line-height 1.8, paragraph spacing 24px, body text `#1A2433`. (design §2.2, §5.10)
- [ ] `<h2>` / `<h3>` inside article: left decorative border rule in `--c-primary`. (design §5.10)
- [ ] `<pre><code>` blocks: `--c-bg-alt #F8F9FA` gray background. (design §5.10)
- [ ] `<blockquote>`: left border accent. (design §5.10)
- [ ] Mobile body text ≥16px. (design §2.2, §7)

### D3 — three-tier responsive

- [ ] Desktop ≥1200px: `1fr 300px` (article left, sticky sidebar right). (design §3, §7)
- [ ] Tablet 768–1199px: two-column maintained (sidebar may narrow). (design §7)
- [ ] Mobile <768px: sidebar moves below main article. (design §7, §4.4)

### D4 — key CSS classes

- [ ] `<article class="article-content">` wrapping main body text. (markup-contract §3.2)
- [ ] All `<h2>` and `<h3>` inside `.article-content` have unique `id` attributes (slug anchors for TOC). (markup-contract §3.2)
- [ ] `<aside class="sticky-sidebar">` for right sidebar (`position:sticky;top:100px;z-index:10`). (markup-contract §3.2, design §4.4)
- [ ] `<nav data-toc aria-label="Table of contents">` inside `.sticky-sidebar` (TOC JS mount point). (markup-contract §3.2)
- [ ] No `.spec-table` or `.tab-container` present (not needed). (design §5.10)

### D5 — SVG illustrations

- [ ] FAE author avatar SVG in author bar at top of article; `alt` = FAE real name. (design §5.10, §9)
- [ ] At least 1 article illustration SVG with keyword `alt`. (prd §4.5)
- [ ] All SVGs are `.svg` format. (prd §4.3)

### D6 — SEO Meta

- [ ] `<title>` unique per article, contains tech topic + "Infineon" + "BeiLuo". (prd iron rule #3)
- [ ] `<meta name="description">` unique, 50–160 chars. (prd §4.1)
- [ ] Single `<h1>` = article title. (design §8)
- [ ] Body text ≥800 words. (prd §3.5.4)

### D7 — JSON-LD

- [ ] `@type: "BreadcrumbList"` matching visible breadcrumb. (design §10)
- [ ] `@type: "TechArticle"` with `headline`, `author` (FAE name), `datePublished`, `publisher` (Organization ref). (design §10, §5.10)
- [ ] JSON-LD blocks are valid JSON. (prd §4.2)

### D8 — CTA

- [ ] "Ask an Engineer" form entry/link in sidebar. (design §5.10)
- [ ] Related PDF Download link in sidebar. (design §5.10)
- [ ] Distributor CTA block at end of article. (design §5.10, prd §3.5.4)

### D9 — zero empty links / zero 404

- [ ] ≥1 product model internal link in body text (points to product-category table or product-detail page). (prd §3.5.4)
- [ ] ≥1 concept internal link in body text (points to related support article). (prd §3.5.4)
- [ ] "Related articles" 3–5 links at page end all resolve. (prd §3.5.4)
- [ ] Author name links to `/about/authors/<slug>/`. (prd §3.5.4, §3.9)
- [ ] Tag badge links resolve to `/support/tags/<tag>/`. (prd §3.5.3)
- [ ] Breadcrumb all levels valid. (prd iron rule #2)

---

## T09 · news-list (`/news/index.html`)

> design §5.11; prd §3.6.1

### D1 — nav / footer / breadcrumb

- [ ] Breadcrumb: `Home / News`. (design §4.3)
- [ ] Sidebar: news navigation (Company News / Industry News sections). (design §5.11, §4.4)
- [ ] Globally consistent `<nav>`, `<footer>`, right-side contact float. (design §4.1, §4.2, §4.5)

### D2 — design tokens

- [ ] News cards: `--r-card 12px`, `--sh-card`, hover `translateY(-4px)` + `--sh-hover`. (design §4.7)
- [ ] "Industry News" category badge: pill `--r-pill`, `--c-primary-tint` background, blue text. (design §4.8)
- [ ] Company / Industry section dividers use `--c-border` rule or heading styling. (design §5.11, §2.1)

### D3 — three-tier responsive

- [ ] Desktop ≥1200px: news card grid 3 columns per section. (design §3)
- [ ] Tablet 768–1199px: 2 columns. (design §3)
- [ ] Mobile <768px: 1 column; sidebar collapses below main content. (design §3, §4.4)

### D4 — key CSS classes

- [ ] Two distinct, separately labelled sections: "Company News" and "Industry News" (not mixed). (design §5.11, prd §3.6.1)
- [ ] No `.spec-table`, `.tab-container`, `.sticky-sidebar`, `.article-content` present (not needed). (design §5.11)

### D5 — SVG illustrations

- [ ] Each news card has a cover SVG illustration with descriptive `alt`. (design §9, prd §4.5)

### D6 — SEO Meta

- [ ] `<title>` unique, contains "Infineon News" + "BeiLuo". (prd iron rule #3)
- [ ] `<meta name="description">` unique, 50–160 chars. (prd §4.1)
- [ ] Single `<h1>` for the news listing page. (design §8)

### D7 — JSON-LD

- [ ] `@type: "BreadcrumbList"` matching visible breadcrumb. (design §10)
- [ ] JSON-LD valid JSON. (prd §4.2)

### D8 — CTA

- [ ] Each news card is a fully linked entry to a news-detail page. (prd §3.6.1)

### D9 — zero empty links / zero 404

- [ ] All news article card links resolve to existing news-detail pages. (prd iron rule #2)
- [ ] Sidebar news category links resolve. (prd iron rule #2)
- [ ] Breadcrumb links valid. (prd iron rule #2)

---

## T10 · news-detail (`/news/<slug>/index.html`) — 4 instances

> design §5.12; prd §3.6.2; PRD C7 (single-column layout, no sidebar)

### D1 — nav / footer / breadcrumb

- [ ] Breadcrumb: `Home / News / <Article Title>`. (design §4.3)
- [ ] **NO sidebar** on news-detail (PRD C7: single-column centered; **"Latest News"** 3-card block at bottom — 3 most recent articles of any type, excluding current — serves as news navigation). (design §5.12, prd §1.2 C7)
- [ ] Globally consistent `<nav>`, `<footer>`, right-side contact float. (design §4.1, §4.2, §4.5)

### D2 — design tokens

- [ ] Full-width header banner: dark overlay `--c-ink-banner #0B1B2B`; H1 text is white with text-shadow for legibility. (design §2.1, §5.12)
- [ ] Category badge in banner: pill `--r-pill`, news-category style (design §4.8). (design §4.8)
- [ ] Body text column: max-width 800px centered, line-height 1.8, paragraph spacing 24px. (design §2.2)

### D3 — three-tier responsive

- [ ] Desktop ≥1200px: single-column centered body (max-width 800px). (design §7)
- [ ] Tablet 768–1199px: single column. (design §7)
- [ ] Mobile <768px: single column, full-width banner. (design §7)

### D4 — key CSS classes

- [ ] `.article-content` on body text container (line-height 1.8, max-width 800px). (markup-contract §3.2, design §5.12)
- [ ] No `.spec-table`, `.tab-container`, `.sticky-sidebar` present (not needed). (design §5.12)

### D5 — SVG illustrations

- [ ] Header banner background image/color; if bitmap used, `<picture>` with WebP + fallback. (design §5.12, prd §4.3)
- [ ] At least 1 inline illustration SVG in article body with keyword `alt`. (design §9, prd §4.5)

### D6 — SEO Meta

- [ ] `<title>` unique per article, contains news topic + "Infineon" or "BeiLuo". (prd iron rule #3)
- [ ] `<meta name="description">` unique, 50–160 chars. (prd §4.1)
- [ ] Single `<h1>` = news headline (inside banner area). (design §8)
- [ ] Body text ≥800 words. (prd §3.6.2)

### D7 — JSON-LD

- [ ] `@type: "BreadcrumbList"` matching visible breadcrumb. (design §10)
- [ ] `@type: "NewsArticle"` with `headline`, `datePublished`, `author`, `publisher`. (design §10, §5.12)
- [ ] JSON-LD blocks are valid JSON. (prd §4.2)

### D8 — CTA

- [ ] Social sharing bar below article body. (design §5.12, prd §3.6.2)
- [ ] "Latest News" 3-card section at page bottom — 3 most recent articles of any type, excluding the current article (serves as news navigation per C7). (design §5.12, prd §3.6.2)
- [ ] Distributor CTA block at end of page. (design §5.12, prd §3.6.2)

### D9 — zero empty links / zero 404

- [ ] "Latest News" 3 cards all link to existing news-detail pages. (prd iron rule #2)
- [ ] Social sharing links use valid `href` targets (not empty `#`). (prd iron rule #2)
- [ ] Breadcrumb links valid. (prd iron rule #2)

---

## T11 · about (`/about/index.html`)

> design §5.13; prd §3.7

### D1 — nav / footer / breadcrumb

- [ ] Breadcrumb: `Home / About`. (design §4.3)
- [ ] No sidebar (modular grid layout; content spans full width in sections). (design §5.13)
- [ ] Globally consistent `<nav>`, `<footer>`, right-side contact float. (design §4.1, §4.2, §4.5)

### D2 — design tokens

- [ ] Timeline component accent color `--c-primary #0072CE`. (design §5.13, §2.1)
- [ ] Advantages Feature Grid cards: `--r-card 12px`, `--sh-card`. (design §4.7)
- [ ] Customer logo wall section background `--c-bg-alt #F8F9FA`. (design §2.1)
- [ ] Bottom CTA button: `#F5821F` fill, `#1A2433` dark text. (design §4.6)

### D3 — three-tier responsive

- [ ] Desktop ≥1200px: Advantages Feature Grid 3 columns; logo wall multi-column. (design §3)
- [ ] Tablet 768–1199px: 2 columns. (design §3)
- [ ] Mobile <768px: all modules stack to 1 column. (design §3)

### D4 — key CSS classes

- [ ] Layout uses CSS Grid (no framework dependency). (prd §4.3)
- [ ] No `.spec-table`, `.tab-container`, `.sticky-sidebar`, `.article-content` present (not needed). (design §5.13)

### D5 — SVG illustrations

- [ ] Company history / milestone illustration SVG(s) in timeline section. (design §9, prd §4.5)
- [ ] Trust badge SVGs (ISO / customs document images as SVG or raster). (design §5.13, §9)
- [ ] FAE / team entry SVG (avatar placeholder or team illustration). (design §5.13, §9)

### D6 — SEO Meta

- [ ] `<title>` unique, contains "About BeiLuo" + "Infineon Authorized Distributor". (prd §3.7, iron rule #3)
- [ ] `<meta name="description">` unique, 50–160 chars. (prd §4.1)
- [ ] Single `<h1>` on page. (design §8)

### D7 — JSON-LD

- [ ] `@type: "BreadcrumbList"` matching visible breadcrumb. (design §10)
- [ ] JSON-LD valid JSON. (prd §4.2)

### D8 — CTA

- [ ] CTA section at bottom with "Contact Us" or "Get a Quote" button. (design §5.13)
- [ ] FAE / team entry section with link to author page(s). (design §5.13)
- [ ] Customs document display / trust evidence section present. (prd §3.7)

### D9 — zero empty links / zero 404

- [ ] FAE / team links resolve to `/about/authors/<slug>/` pages. (prd iron rule #2)
- [ ] CTA button link resolves. (prd iron rule #2)
- [ ] Breadcrumb links valid. (prd iron rule #2)

---

## T12 · contact (`/contact/index.html`)

> design §5.14; prd §3.8

### D1 — nav / footer / breadcrumb

- [ ] Breadcrumb: `Home / Contact`. (design §4.3)
- [ ] No sidebar (independent `contact` template, modern grid layout). (design §5.14)
- [ ] Globally consistent `<nav>`, `<footer>`, right-side contact float. (design §4.1, §4.2, §4.5)

### D2 — design tokens

- [ ] Contact card (left column): WhatsApp/WeChat icons use `--c-primary #0072CE`; card `--r-card 12px`, `--sh-card`. (design §5.14, §2.1)
- [ ] Form fields: border `--c-border #E2E8F0`, focus ring 2px blue, input `--r-base 8px`. (design §4.11, §8)
- [ ] Submit button: `#F5821F` fill, `#1A2433` dark text — no white text on orange. (design §4.6)

### D3 — three-tier responsive

- [ ] Desktop ≥1200px: two-column grid (contact card left, inquiry form right). (design §5.14)
- [ ] Tablet 768–1199px: two-column maintained (contact card + form) or graceful narrow. (design §5.14, §7)
- [ ] Mobile <768px: single column (contact card above, form below). (design §5.14)

### D4 — key CSS classes

- [ ] `<form data-validate novalidate>` present (no `action` attribute — JS-only submit). (markup-contract §4.1)
- [ ] `<noscript>` block inside form with WhatsApp `https://wa.me/8615013702378` and WeChat `+86 18612518271` real contact links — no `#` hrefs in noscript. (markup-contract §4.5)
- [ ] 4 field groups (Name / Email / Part No. / Message) in `.form-group` with `<label for>` + matching `id`. (markup-contract §4.1)
- [ ] Each field: `required`, `data-rule` (`text`/`email`/`partno`), `aria-required="true"`, `aria-describedby="error-<field>"`. (markup-contract §4.2)
- [ ] Each field: `<span data-error-for="<name>" id="error-<name-lowercase>" role="alert">`. (markup-contract §4.2)
- [ ] Submit button `<button type="submit" data-submit class="btn btn--primary">`. (markup-contract §4.1)
- [ ] Success message `<div data-success hidden role="status" aria-live="polite">`. (markup-contract §4.1)
- [ ] No `.spec-table`, `.tab-container`, `.sticky-sidebar`, `.article-content` present (not needed). (design §5.14)

### D5 — SVG illustrations

- [ ] WeChat QR code SVG present; `alt="WeChat QR code"`. (design §5.14, §9)
- [ ] WhatsApp icon SVG with `aria-label` or `alt`. (design §5.14, §9)

### D6 — SEO Meta

- [ ] `<title>` unique, contains "Contact BeiLuo" + "Infineon Distributor Inquiry". (prd iron rule #3)
- [ ] `<meta name="description">` unique, 50–160 chars. (prd §4.1)
- [ ] Single `<h1>` on page. (design §8)

### D7 — JSON-LD

- [ ] `@type: "BreadcrumbList"` matching visible breadcrumb. (design §10)
- [ ] JSON-LD valid JSON. (prd §4.2)

### D8 — CTA

- [ ] Form submit button is the primary CTA ("Get a Quote" / "Submit Inquiry"). (design §5.14, §4.6)
- [ ] WhatsApp and WeChat contact details sourced from `site.json.contact` (not hardcoded). (prd §3.8)

### D9 — zero empty links / zero 404

- [ ] WhatsApp link uses `https://wa.me/<number>` format (not empty `href`). (prd iron rule #2)
- [ ] WeChat contact detail displayed correctly; no broken links. (prd iron rule #2)
- [ ] Breadcrumb links valid. (prd iron rule #2)

---

## T13 · author-page (`/about/authors/<slug>/index.html`)

> design §5.15; prd §3.9
> Reuses `about` template as a data-driven lightweight variant; no separate 13th template file.

### D1 — nav / footer / breadcrumb

- [ ] Breadcrumb: `Home / About / Authors / <FAE Name>` with `aria-current="page"` on FAE name (4 levels). (design §5.15, §4.3)
- [ ] No sidebar (about-template reuse; modular layout). (design §5.15)
- [ ] Globally consistent `<nav>`, `<footer>`, right-side contact float. (design §4.1, §4.2, §4.5)
- [ ] Page is linked from at least one `tech-detail` author bar (`tech-detail` → `author-page`; E-E-A-T). (design §5.15, prd §3.9)

### D2 — design tokens

- [ ] FAE profile card: `--r-card 12px`, `--sh-card`. (design §4.7, §5.15)
- [ ] FAE name/role heading: Inter font weight 700; bio text: Roboto. (design §2.2)
- [ ] Authored article list uses standard card component tokens. (design §4.7)

### D3 — three-tier responsive

- [ ] Desktop ≥1200px: FAE profile — avatar left, bio right (2-column). (design §5.15)
- [ ] Mobile <768px: avatar above, bio below (single column). (design §5.15)
- [ ] Authored article list responsive grid (adapts same as other listing templates). (design §3)

### D4 — key CSS classes

- [ ] Authored article list uses same card CSS as other listing templates. (design §4.7)
- [ ] No `.spec-table`, `.tab-container`, `.sticky-sidebar`, `.article-content` present (not needed). (design §5.15)

### D5 — SVG illustrations

- [ ] FAE avatar SVG present; `alt` = FAE real name (E-E-A-T signal). (design §5.15, §9)
- [ ] Avatar is a named FAE SVG — not a generic placeholder icon. (prd §3.9)

### D6 — SEO Meta

- [ ] `<title>` unique per FAE (e.g., `<FAE Name> — Infineon FAE at BeiLuo`). (prd iron rule #3)
- [ ] `<meta name="description">` unique, contains FAE name + specialization + BeiLuo, 50–160 chars. (prd §4.1)
- [ ] Single `<h1>` = FAE real name. (design §8)

### D7 — JSON-LD

- [ ] `@type: "BreadcrumbList"` matching visible breadcrumb (`Home → About → Authors → <FAE Name>`). (design §10)
- [ ] JSON-LD valid JSON. (prd §4.2)

### D8 — CTA

- [ ] Authored articles listed with card links to respective tech-detail pages. (design §5.15, prd §3.9)

### D9 — zero empty links / zero 404

- [ ] All authored article card links resolve to existing tech-detail pages. (prd iron rule #2)
- [ ] Breadcrumb all 4 levels valid. (prd iron rule #2)
- [ ] Page is reachable from at least one `tech-detail` author bar link (no orphan page). (prd §3.9, iron rule #2)
