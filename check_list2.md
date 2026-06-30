# check_list2.md — JSON Content Acceptance Rubric

**Purpose**: Phase 4 content acceptance gate for the 7 JSON data files. Every `- [ ]` item must be ticked before a file is considered write-complete.  
**Scope**: Content validation only — no real JSON is written by this document.  
**Sources**: `src/data/*.schema.md`, `docs/current/prd.md` §1.3/§5, `docs/current/design.md` §5.

---

## Dimension Key

| Code | Dimension | What is verified |
|------|-----------|-----------------|
| D1 | Field Completeness | All required fields from `*.schema.md` are present; no required key is absent |
| D2 | Pure English | Zero Chinese characters or non-ASCII residue in any string value |
| D3 | Brand Differentiation | Content is original and BeiLuo-specific; not generic distributor boilerplate (anti-demotion) |
| D4 | Keyword Embedding | Target keywords (`infineon distributor`, category long-tails) appear naturally, not stuffed |
| D5 | Count Quotas | Numeric quotas from `*.schema.md` "Count Quotas" table and PRD §1.3 are met |
| D6 | Placeholder Alignment | Every field maps to the corresponding `{{placeholder}}` in design §5 templates; no orphan fields |
| D7 | No Residual Stubs | No `TBD`, `TODO`, `lorem ipsum`, `"#"` links, or empty required strings remain |

---

## 1. site.json

> Schema ref: `src/data/site.schema.md`  
> Count quotas: `nav.items` = 7 · `footer.columns` = 4 · contact channels = 2  
> Templates: all 12 templates share `nav`, `footer`, `contact` via partial injection

### D1 — Field Completeness
- [ ] `brand` object present with `brand.name`, `brand.slogan`, `brand.oneLiner`
- [ ] `nav.items` array present; each NavItem has `label` and `href`; Products entry has `megaMenu: true` and `children` array listing the 4 category sub-links
- [ ] `footer.columns` array present; each FooterColumn has `heading` and `links[]` (each link has `label` and `href`); `footer.copyright`, `footer.sitemapHref`, `footer.robotsHref` all present
- [ ] `contact` object has all four required fields: `contact.whatsapp`, `contact.wechat`, `contact.whatsappHref`, `contact.wechatQrSrc`
- [ ] `seo` object has `seo.defaultTitle`, `seo.defaultDescription`, `seo.siteName`, `seo.baseUrl`
- [ ] `logo` object has `logo.src`, `logo.alt`, `logo.width`, `logo.height`
- [ ] `jsonLd` object has `jsonLd.organizationUrl`, `jsonLd.organizationType`

### D2 — Pure English
- [ ] All string values in `brand.*`, `nav.*`, `footer.*` are pure English — no Chinese characters
- [ ] `seo.defaultTitle` and `seo.defaultDescription` contain only English text
- [ ] `logo.alt` is English only; `contact.*` strings are Latin-script or digits/country-code only

### D3 — Brand Differentiation
- [ ] `brand.slogan` is not generic ("one-stop distributor" or equivalent); reflects BeiLuo's "Top 8 Electronic Component Distributor in China" positioning (site.schema.md §brand)
- [ ] `brand.oneLiner` (≤30 words, footer col 1) is original to BeiLuo — not copied from a generic distributor site
- [ ] Footer column 1 intro copy is BeiLuo-specific and does not reuse boilerplate found on other distributor sites

### D4 — Keyword Embedding
- [ ] `seo.defaultDescription` (≤155 chars) naturally contains both `"infineon distributor"` and `"BeiLuo"` per PRD §3.2 acceptance criteria
- [ ] `brand.slogan` reinforces BeiLuo authority without keyword stuffing
- [ ] `logo.alt` includes `"BeiLuo"` and the positioning phrase (e.g., `"Top 8 Electronic Component Distributor in China"`)

### D5 — Count Quotas
- [ ] `nav.items` length = exactly 7 (Home / Products / Solutions / Support / News / About Us / Contact) — site.schema.md Count Quotas
- [ ] `footer.columns` length = exactly 4 (Brand+tagline · Products links · Support/Solutions/News links · Contact) — site.schema.md Count Quotas
- [ ] Contact channels = 2: WhatsApp `+86 15013702378` and WeChat `+86 18612518271` (values match PRD §3.8)

### D6 — Placeholder Alignment
- [ ] `brand.name` → `{{brand.name}}` in nav/footer + `Organization.name` in JSON-LD (site.schema.md §brand / design §10)
- [ ] `brand.slogan` → `{{brand.slogan}}` in nav (desktop only, hidden mobile) + `Organization.description`
- [ ] `brand.oneLiner` → `{{brand.oneLiner}}` in footer column 1
- [ ] `nav.items` → `{{nav.items}}` loop in nav partial shared by all 12 templates
- [ ] `footer.columns` → `{{footer.columns}}` loop; `footer.copyright` → `{{footer.copyright}}`; `footer.sitemapHref` → `{{footer.sitemapHref}}`; `footer.robotsHref` → `{{footer.robotsHref}}`
- [ ] `contact.whatsapp` → `{{contact.whatsapp}}`; `contact.whatsappHref` → `{{contact.whatsappHref}}`; `contact.wechat` → `{{contact.wechat}}`; `contact.wechatQrSrc` → `{{contact.wechatQrSrc}}` in floating widget popup
- [ ] `seo.defaultTitle` → `{{seo.title}}` (per-page data overrides); `seo.defaultDescription` → `{{seo.description}}`; `seo.siteName` → OG tags; `seo.baseUrl` → canonical URL / sitemap build
- [ ] `logo.src` → `{{logo.src}}` in nav + `Organization.logo.url`; `logo.alt` → `{{logo.alt}}`; `logo.width` → `{{logo.width}}`; `logo.height` → `{{logo.height}}`
- [ ] `jsonLd.organizationUrl` → `Organization.url`; `jsonLd.organizationType` → `@type`

### D7 — No Residual Stubs
- [ ] No required field contains `"TBD"`, `"TODO"`, `"lorem ipsum"`, `"<placeholder>"`, or empty string `""`
- [ ] `brand.slogan` is the exact phrase `"Top 8 Electronic Component Distributor in China"` (PRD §1)
- [ ] `contact.whatsapp` = `"+86 15013702378"` and `contact.wechat` = `"+86 18612518271"` — real numbers, not template values (PRD §3.8)

---

## 2. home.json

> Schema ref: `src/data/home.schema.md`  
> Count quotas: 6 home modules · `hero.trustBadges` = 3 · `productsTeaser` = 4 · `solutionsTeaser` = 3 · `supportTeaser` = 3 · `newsTeaser` = 3 · `whyChooseUs` = 3–4  
> Template: `home` (design §5.1); JSON-LD: Organization + WebSite on home page only (design §10)

### D1 — Field Completeness
- [ ] `seo` object has `seo.title`, `seo.description`, `seo.canonical`
- [ ] `hero` object has: `hero.headline`, `hero.subText`, `hero.ctaPrimary` (with `label` + `href`), `hero.ctaSecondary` (with `label` + `href`), `hero.bgSvgSrc`, `hero.bgSvgAlt`, `hero.trustBadges` (array)
- [ ] Each `hero.trustBadges` item has `icon` and `label`
- [ ] `whyChooseUs` array present; each FeatureItem has `icon`, `title`, `description`
- [ ] `productsTeaser` array present; each ProductTeaserCard has `slug`, `name`, `icon`, `summary`, `href`
- [ ] `solutionsTeaser` array present; each SolutionTeaserCard has `slug`, `title`, `industry`, `summary`, `href`
- [ ] `supportTeaser` array present; each SupportTeaserCard has `slug`, `category`, `title`, `summary`, `date`, `href`
- [ ] `newsTeaser` array present; each NewsTeaserCard has `slug`, `type`, `title`, `date`, `categoryTag`, `href`
- [ ] `finalCta` object has `headline`, `ctaLabel`, `ctaHref`

### D2 — Pure English
- [ ] All `hero.*` strings are pure English — no Chinese characters
- [ ] All teaser card `title`, `summary`, `name`, `categoryTag`, `industry` fields are pure English
- [ ] `whyChooseUs[].description` fields and `finalCta.headline` are pure English

### D3 — Brand Differentiation
- [ ] `hero.headline` is original and identifies BeiLuo specifically — not a generic `"Your Trusted Distributor"` with no brand identity
- [ ] `hero.subText` (≤50 words) is brand-differentiated; mentions BeiLuo's specific positioning (stock depth, FAE, logistics) rather than generic distributor language
- [ ] Each `whyChooseUs[].description` describes a genuine BeiLuo differentiator (stock depth / FAE support / logistics / genuine Infineon products) with original phrasing — not copy-pasted across cards
- [ ] Each `productsTeaser[].summary` (≤30 words) is original per category — not identical copy with only the category name swapped

### D4 — Keyword Embedding
- [ ] `seo.description` (≤155 chars) naturally contains `"infineon distributor"` + `"BeiLuo"` — per PRD §3.2 and home.schema.md constraint
- [ ] `hero.headline` naturally embeds `"Infineon Distributor"` or an equivalent authoritative phrase without keyword stuffing
- [ ] Each `productsTeaser[].summary` contains a category-specific keyword (`"Infineon MCU"`, `"Infineon IGBT"`, `"Infineon MOSFET"`, `"Infineon Sensors"`) per home.schema.md §productsTeaser
- [ ] `hero.subText` naturally includes `"Infineon authorized distributor"` or `"Infineon stock"` per PRD §1.1
- [ ] Each `solutionsTeaser[].summary` (≤40 words) embeds industry keyword + `"Infineon"` + distributor context

### D5 — Count Quotas
- [ ] `hero.trustBadges` length = exactly 3 items (ISO Certified · 10+ Years · Global Logistics) — home.schema.md Count Quotas
- [ ] `whyChooseUs` length = 3 or 4 items — home.schema.md Count Quotas
- [ ] `productsTeaser` length = exactly 4 (MCU / IGBT / MOSFET / Sensors — all 4 categories) — home.schema.md Count Quotas
- [ ] `solutionsTeaser` length = exactly 3 featured solutions — home.schema.md Count Quotas
- [ ] `supportTeaser` length = exactly 3 latest support articles — home.schema.md Count Quotas
- [ ] `newsTeaser` length = exactly 3 latest news articles — home.schema.md Count Quotas
- [ ] Total distinct top-level content modules = 6: hero · whyChooseUs · productsTeaser · solutionsTeaser · supportTeaser+newsTeaser · finalCta — PRD §3.2 acceptance criterion

### D6 — Placeholder Alignment
- [ ] `seo.title` → `{{seo.title}}`; `seo.description` → `{{seo.description}}`; `seo.canonical` → `{{seo.canonical}}`
- [ ] `hero.headline` → `{{hero.headline}}` as single H1 (one H1 per page — WCAG/PRD §4.1)
- [ ] `hero.subText` → `{{hero.subText}}`; `hero.ctaPrimary.label` → `{{hero.ctaPrimary.label}}`; `hero.ctaPrimary.href` → `{{hero.ctaPrimary.href}}` on orange Primary CTA (design §4.6)
- [ ] `hero.ctaSecondary.label` → `{{hero.ctaSecondary.label}}`; `hero.ctaSecondary.href` → `{{hero.ctaSecondary.href}}`
- [ ] `hero.bgSvgSrc` → `{{hero.bgSvgSrc}}` as background/`<img>`; `hero.bgSvgAlt` → `{{hero.bgSvgAlt}}`
- [ ] `hero.trustBadges` → `{{hero.trustBadges}}` loop rendering `{{item.icon}}` + `{{item.label}}` per TrustBadge shape
- [ ] `whyChooseUs` → `{{whyChooseUs}}` loop; `{{item.icon}}`, `{{item.title}}` as H3, `{{item.description}}` (design §5.1 Feature Grid, 3–4 columns desktop)
- [ ] `productsTeaser` → `{{productsTeaser}}` loop; `{{card.name}}` as H3, `{{card.icon}}`, `{{card.summary}}`, `{{card.href}}` on "View Models →" link
- [ ] `solutionsTeaser` → `{{solutionsTeaser}}` loop; `{{card.title}}` as H3, `{{card.industry}}` as badge (design §4.8), `{{card.summary}}`, `{{card.href}}`
- [ ] `supportTeaser` → `{{supportTeaser}}` loop; `{{card.title}}`, `{{card.category}}` as badge, `{{card.summary}}`, `{{card.date}}`, `{{card.href}}`
- [ ] `newsTeaser` → `{{newsTeaser}}` loop; `{{card.title}}`, `{{card.type}}` as badge, `{{card.date}}`, `{{card.categoryTag}}`, `{{card.href}}`
- [ ] `finalCta.headline` → `{{finalCta.headline}}`; `finalCta.ctaLabel` → `{{finalCta.ctaLabel}}`; `finalCta.ctaHref` → `{{finalCta.ctaHref}}` (orange/dark CTA band, design §5.1)
- [ ] Organization + WebSite JSON-LD are derived at build time from `site.json` only — no additional home.json fields needed (home.schema.md §JSON-LD Mapping)

### D7 — No Residual Stubs
- [ ] No required field contains `"TBD"`, `"TODO"`, `"lorem ipsum"`, `"placeholder"`, or empty string
- [ ] `hero.ctaPrimary.href` is a real path (`"/contact/"`) — not `"#"` (iron rule §9 #2)
- [ ] All `href` fields in `productsTeaser`, `solutionsTeaser`, `supportTeaser`, `newsTeaser` resolve to real paths — no empty `#` links
- [ ] `hero.bgSvgSrc` is a real SVG path (e.g., `"/assets/svg/backgrounds/hero-circuit.svg"`) — not a placeholder string
- [ ] ISO 8601 `date` values in `supportTeaser` and `newsTeaser` are valid real dates — not `"YYYY-MM-DD"` template strings

---

## 3. products.json

> Schema ref: `src/data/products.schema.md`  
> Count quotas: `categories` = 4 · detail models per category = 2 (8 total) · `specs` per model ≥ 5 · `faq` per model = 3–5  
> Templates: `products-list` (§5.2) · `product-category` (§5.3) · `product-detail` (§5.4); JSON-LD: ItemList+Product on category page, Product on detail page (design §10)

### D1 — Field Completeness
- [ ] Top-level key `categories` is an array; no other spurious top-level keys
- [ ] Each `Category` has: `slug`, `name`, `title`, `metaDescription`, `description` (200–300 words), `faeNote` (≥50 words, FAE voice), `icon`, `selectionGuideHref`, `selectionGuideDownloadHref`, `columns` (Array\<ColumnDef\>), `models` (Array\<Model\>)
- [ ] Each `ColumnDef` has `key`, `label`, `type` (`"text"`/`"number"`/`"enum"`); `filter` is **optional** (`"select"`/`"range"`/`"multi"`) — omit entirely if the column is not filterable (value `"none"` is invalid); `unit` present where applicable; first column has `sticky: true`
- [ ] Each Model (all — table-row level) has: `partNo`, `series`, `params` (Object whose keys match `columns[].key` for that category), `package`, `stock` (`"inStock"` or `"rfq"`), `href`
- [ ] Each detail-level model (≥2 per category) additionally has: `overview` (≥100 words), `shortDescription` (≤30 words), `image`, `imageAlt`, `datasheetHref`, `specs` (Array\<SpecRow\>), `applications` (Array\<String\>), `documents` (Array\<Document\>), `faq` (Array\<FaqItem\>), `alternativeParts` (Array\<PartRef\>), `companionParts` (Array\<PartRef\>), `brand`
- [ ] Each `SpecRow` has `param`, `value`; `unit` present where applicable
- [ ] Each `Document` has `title`, `href`, `type` (`"datasheet"`/`"application-note"`/`"selection-guide"`)
- [ ] Each `FaqItem` has `question`, `answer` (≥30 words)
- [ ] Each `PartRef` (alternativeParts/companionParts) has `partNo`, `slug`, `categorySlug`

### D2 — Pure English
- [ ] All `category.title`, `category.metaDescription`, `category.description` are pure English
- [ ] `category.faeNote` is pure English (first-person FAE voice, no Chinese characters)
- [ ] All `model.overview`, `model.shortDescription`, `model.imageAlt` are pure English
- [ ] All `model.faq[].question` and `model.faq[].answer` are pure English

### D3 — Brand Differentiation
- [ ] Each `category.description` (200–300 words) is original and not copied from Infineon's official site; mentions specific series (AURIX™ TC3xx, XMC™ 4000, PSoC™ 6, OptiMOS™ etc.) with BeiLuo's distributor angle (stock depth, FAE support, fast delivery) — products.schema.md Brand Differentiation Notes
- [ ] Each `category.faeNote` (≥50 words) reads as genuine FAE commentary with BeiLuo's distributor perspective — not generic marketing copy or verbatim datasheet text
- [ ] Each `model.overview` (≥100 words) is original engineering description contextualizing the part for engineers — not copied from the Infineon datasheet
- [ ] Each `model.faq[].answer` (≥30 words) reflects BeiLuo's expertise as a distributor (stock availability, application guidance, alternative part suggestions) — brand-specific, not generic

### D4 — Keyword Embedding
- [ ] `category.title` for each of the 4 categories contains the category distributor keyword (e.g., `"Infineon IGBT Distributor"`, `"Infineon MCU Distributor"`) per products.schema.md §category `title` field note
- [ ] `category.metaDescription` (≤155 chars) naturally contains the category keyword (e.g., `"Infineon IGBT distributor"`) per products.schema.md §category `metaDescription` field
- [ ] `category.description` naturally embeds target keywords (e.g., series names, `"Infineon MCU distributor"`) without keyword stuffing
- [ ] `model.faq[].question` uses question-type keyword phrasing (GEO-optimized Q&A format) per products.schema.md §FaqItem

### D5 — Count Quotas
- [ ] `categories` array length = exactly 4 — products.schema.md Count Quotas / PRD §1.3
- [ ] Category slugs are exactly: `"mcu"`, `"igbt"`, `"mosfet"`, `"sensors"` — PRD §1.3 / C4
- [ ] Each category has exactly 2 detail-level models (with overview, specs, faq, etc.) — 8 detail models total — products.schema.md Count Quotas / PRD §1.3 (§3.3.3: 8 total, 4×2)
- [ ] Each detail model has ≥5 `specs` rows — products.schema.md Count Quotas
- [ ] Each detail model has 3–5 `faq` items — products.schema.md Count Quotas
- [ ] `columns` per category are category-appropriate and differ between categories (e.g., IGBT columns ≠ MCU columns) per products.schema.md §ColumnDef example column sets

### D6 — Placeholder Alignment
- [ ] `category.title` → `{{category.title}}` as H1 in `product-category` template and as `<title>` tag (design §5.3)
- [ ] `category.metaDescription` → `{{category.metaDescription}}` in `<meta name="description">`
- [ ] `category.description` → `{{category.description}}` as `<p>` blocks below H1 (design §5.3)
- [ ] `category.faeNote` → `{{category.faeNote}}` in `<blockquote>` / pull-quote block (design §5.3)
- [ ] `category.icon` → `{{category.icon}}` in category card and sidebar (design §5.2)
- [ ] `category.selectionGuideHref` → `{{category.selectionGuideHref}}` on "Selection Guide →" ghost/text CTA (design §5.3 / §4.6)
- [ ] `category.selectionGuideDownloadHref` → `{{category.selectionGuideDownloadHref}}` on "Download Category Selection Guide" secondary CTA button (design §5.3 / §4.6)
- [ ] `category.columns` → `{{category.columns}}` drives `render.js` table header + filter controls (design §4.9 / §5.3)
- [ ] `model.partNo` → `{{model.partNo}}` as H1 in detail page; `Product.sku` in JSON-LD (design §5.4 / §10)
- [ ] `model.stock` → `{{model.stock}}` renders "In Stock" green badge or "RFQ" orange badge (design §4.8)
- [ ] `model.image` → `{{model.image}}` as `<img src>` in detail left column; `Product.image` in JSON-LD (design §5.4)
- [ ] `model.imageAlt` → `{{model.imageAlt}}`
- [ ] `model.datasheetHref` → `{{model.datasheetHref}}` on blue-outline "Download Datasheet" Secondary CTA (design §5.4 / §4.6)
- [ ] `model.specs` → `{{model.specs}}` loop in `.spec-table` Specifications tab (design §4.9 / §5.4)
- [ ] `model.faq` → `{{model.faq}}` loop as accordion (design §5.4); `faq.question` as accordion header, `faq.answer` as body
- [ ] `model.alternativeParts` / `model.companionParts` → `{{model.alternativeParts}}` / `{{model.companionParts}}` in card carousel (design §5.4)
- [ ] `model.shortDescription` → `{{model.shortDescription}}` in core info bar at top of detail page (design §5.4)
- [ ] `model.overview` → `{{model.overview}}` as first paragraph in Overview tab (design §5.4)
- [ ] `model.applications` → `{{model.applications}}` as list in Application tab (design §5.4); also `Product.category` in JSON-LD (design §10)
- [ ] `model.documents` → `{{model.documents}}` loop in Documents tab (design §5.4)
- [ ] `model.href` → `{{model.href}}` on part number link in spec table; `Product.url` in JSON-LD (design §10 / products.schema.md §JSON-LD Mapping)
- [ ] JSON-LD: `ItemList` + per-model `Product` on `product-category` page; `Product` on `product-detail` page (design §10 / PRD §3.3.2–3.3.3)

### D7 — No Residual Stubs
- [ ] No `model.datasheetHref` is `"#"` or empty string — all have real, submitted paths (iron rule §9 #2)
- [ ] All `PartRef.slug` and `PartRef.categorySlug` values resolve to real entries in the `categories` / `models` arrays — no dangling cross-references
- [ ] No `model.overview`, `category.description`, or `category.faeNote` contains `"lorem ipsum"`, `"TBD"`, or unfilled section headers
- [ ] All `model.href` paths follow the pattern `"/products/<categorySlug>/<partNo-slug>/"` with real slugs — not template strings

---

## 4. solutions.json

> Schema ref: `src/data/solutions.schema.md`  
> Count quotas: `solutions` = 5 (milestone ≥4) · `body` ≥800 words · `bomList` ≥3 · `advantages` 3–5 · `related` 3–5  
> Templates: `solutions-list` (§5.5) · `solution-detail` (§5.6); JSON-LD: BreadcrumbList on detail pages (design §10)

### D1 — Field Completeness
- [ ] Top-level key `solutions` is an array; no other spurious top-level keys
- [ ] Each `Solution` has: `slug`, `title`, `metaDescription`, `summary` (≤60 words), `industry`, `blockDiagram` (with `src` + `alt`), `advantages` (Array\<String\>), `bomList` (Array\<BomEntry\>), `scenarios` (≥150 words), `body` (≥800 words), `related` (Array\<RelatedItem\>)
- [ ] `blockDiagram.src` and `blockDiagram.alt` (≥40 words) are both present for every solution
- [ ] Each `BomEntry` has: `partNo`, `description`, `link`
- [ ] Each `RelatedItem` has: `type` (`"solution"`/`"product"`/`"support"`), `title`, `href`

### D2 — Pure English
- [ ] All `solution.title`, `solution.metaDescription`, `solution.summary` are pure English
- [ ] `solution.body` (≥800 words each) is pure English — no Chinese characters
- [ ] `solution.blockDiagram.alt` is pure English descriptive text (≥40 words per solutions.schema.md)
- [ ] All `solution.advantages[]` strings are pure English
- [ ] All `bomEntry.description` strings are pure English

### D3 — Brand Differentiation
- [ ] Each `solution.body` (≥800 words) is original industry/engineering analysis — not copied from Infineon official application notes; cites specific Infineon series with BeiLuo's distributor commentary per solutions.schema.md Brand Differentiation Notes
- [ ] Each `solution.scenarios` (≥150 words) describes real-world use cases with BeiLuo-specific insight — not generic vendor content
- [ ] Each `solution.advantages[]` item is specific to the solution's Infineon components — not vague generic quality claims

### D4 — Keyword Embedding
- [ ] `solution.title` for each of the 5 solutions contains the industry-specific keyword + `"Infineon"` + distributor context (e.g., `"BLDC Motor Drive Solution with Infineon IGBT"`) per solutions.schema.md §Solution `title` field
- [ ] `solution.metaDescription` (≤155 chars) contains industry keyword + `"Infineon"` + BeiLuo context per solutions.schema.md §Solution `metaDescription` field
- [ ] `solution.summary` (≤60 words) contains the core GEO keyword for that solution per solutions.schema.md §Solution `summary` field
- [ ] `solution.body` naturally embeds industry-specific keywords and Infineon series names (e.g., IGBT series for motor-drive solutions) without stuffing

### D5 — Count Quotas
- [ ] `solutions` array length = exactly 5 — PRD §1.3 / C2 (milestone acceptance ≥4)
- [ ] Industries covered across 5 solutions: Motor Drive · EV Charging · Solar PV · Industrial Automation · Home Appliance (per solutions.schema.md Suggested Solution Slugs)
- [ ] Each solution `body` ≥ 800 words — solutions.schema.md Count Quotas
- [ ] Each solution `bomList` ≥ 3 BOM entries — solutions.schema.md Count Quotas
- [ ] Each solution `advantages` = 3–5 items — solutions.schema.md Count Quotas
- [ ] Each solution `related` = 3–5 items — solutions.schema.md Count Quotas

### D6 — Placeholder Alignment
- [ ] `solution.title` → `{{solution.title}}` as H1; also as `<title>` tag (design §5.5 / §5.6)
- [ ] `solution.metaDescription` → `{{solution.metaDescription}}` in `<meta name="description">`
- [ ] `solution.summary` → `{{solution.summary}}` in solution card on `solutions-list` and `solutionsTeaser` on home (design §5.5)
- [ ] `solution.industry` → `{{solution.industry}}` as badge on list card and detail header (design §4.8)
- [ ] `solution.blockDiagram.src` → `{{solution.blockDiagram.src}}` as `<img src>` in first H2 section (design §5.6)
- [ ] `solution.blockDiagram.alt` → `{{solution.blockDiagram.alt}}`
- [ ] `solution.advantages` → `{{solution.advantages}}` loop as `<li>` items in H2 "Core Advantages" section (design §5.6)
- [ ] `solution.bomList` → `{{solution.bomList}}` loop in BOM table; `bom.link` on part-number anchor; `bom.description` in role column (design §5.6)
- [ ] `solution.body` → `{{solution.body}}` rendered as article content with H2/H3 structure (design §5.6)
- [ ] `solution.related` → `{{solution.related}}` loop in sidebar (3–5 items, design §5.6); `item.type` determines icon/link pattern
- [ ] `solution.scenarios` → `{{solution.scenarios}}` as rich text block in "Application Scenarios" H2 section (design §5.6)
- [ ] `solution.ctaLabel` (if provided) → `{{solution.ctaLabel}}` on closing CTA button; defaults to `"Get a Quote"` (design §5.6)
- [ ] JSON-LD: `BreadcrumbList` on `solution-detail` pages (`Home → Solutions → <solution.title>`); no dedicated Solution Schema type per solutions.schema.md §JSON-LD note (design §10)

### D7 — No Residual Stubs
- [ ] No `bomEntry.link` is `"#"` or empty — all link to real product detail paths (e.g., `"/products/igbt/ikw40n120h3/"`) per iron rule §9 #2
- [ ] No `relatedItem.href` is empty or `"#"` — all resolve to real internal pages
- [ ] No `solution.body` contains `"lorem ipsum"`, `"TBD"`, or unfilled H2/H3 section placeholders
- [ ] `solution.blockDiagram.src` paths follow the pattern `"/assets/svg/illustrations/bd-<slug>.svg"` — not placeholder strings

---

## 5. support.json

> Schema ref: `src/data/support.schema.md`  
> Count quotas: `categories` = 4 · `articles` = 4 (one per category) · `authors` ≥ 1 · `body` ≥800 words · H2/H3 `id` attrs required (toc.js auto-generates TOC) · `internalLinks` ≥1 model + ≥1 concept · `relatedArticles` 3–5  
> Templates: `support-list` (§5.7/§5.8/§5.9) · `tech-detail` (§5.10); JSON-LD: TechArticle on detail pages (design §10)

### D1 — Field Completeness
- [ ] Top-level structure has exactly four keys: `categories` (Array), `tags` (Array), `authors` (Array), `articles` (Array)
- [ ] Each `SupportCategory` has: `slug`, `name`, `title`, `metaDescription`
- [ ] Each `Tag` has: `slug`, `name`; tags array is exhaustive — every slug referenced in any `article.tags[]` has a corresponding entry here
- [ ] Each `Author` has: `slug`, `name`, `photo`, `photoAlt`, `expertise` (≤30 words), `experience`, `profileHref`
- [ ] Each `Article` (preview fields) has: `slug`, `title`, `category` (matching a `SupportCategory.slug`), `tags` (Array\<String\>), `author` (matching an `Author.slug`), `date`, `summary` (≤60 words), `metaDescription`
- [ ] Each `Article` (detail fields) has: `body` (≥800 words), `internalLinks` (Array\<InternalLink\>), `relatedArticles` (Array\<String\>)
- [ ] Every H2/H3 heading inside `article.body` carries a unique `id` attribute (slug anchor) — `toc.js` auto-generates the Sticky TOC from these; no `toc` field is stored in the JSON
- [ ] Each `InternalLink` has: `href`; the `internalLinks` array for each article contains ≥1 entry with `model` field and ≥1 entry with `concept` field

### D2 — Pure English
- [ ] All `SupportCategory.title`, `SupportCategory.metaDescription` are pure English
- [ ] All `Author.name`, `Author.expertise`, `Author.experience` are pure English (name in English transliteration)
- [ ] All `Article.title`, `Article.summary`, `Article.metaDescription` are pure English
- [ ] All `Article.body` (≥800 words each) is pure English — no Chinese characters
- [ ] All `Tag.name`, `TocEntry.heading` values are pure English

### D3 — Brand Differentiation
- [ ] All 4 article `body` texts are original — not copied from Infineon datasheets or application notes; include BeiLuo-specific insights (stock availability, procurement tips, alternative part suggestions) per support.schema.md Brand Differentiation & E-E-A-T Notes
- [ ] `Author.name` is a realistic FAE name (not a placeholder like "Author Name") for E-E-A-T credibility per PRD §3.9
- [ ] `Author.expertise` describes a genuine technical specialization relevant to Infineon products (not generic "electronics engineer")

### D4 — Keyword Embedding
- [ ] Each `Article.title` uses informational or question-type keyword phrasing relevant to that category (e.g., `"How to Select the Right Infineon IGBT: A Distributor's Guide"`) per support.schema.md §Article `title` field note
- [ ] Each `Article.metaDescription` (≤155 chars) contains the category-relevant keyword + `"Infineon"` + BeiLuo context
- [ ] Each `Article.body` naturally embeds `"Infineon"` references and relevant product long-tail keywords (e.g., `"Infineon IGBT distributor"`) per PRD §1.1
- [ ] Each `SupportCategory.title` contains a category-specific keyword (e.g., `"Infineon Selection Guides — Technical Resources"`) per support.schema.md §SupportCategory `title` field

### D5 — Count Quotas
- [ ] `categories` array length = exactly 4 with slugs: `"guides"`, `"application-notes"`, `"troubleshooting"`, `"reviews"` — support.schema.md Count Quotas / PRD §1.3
- [ ] `articles` array length = exactly 4; each article is assigned to a different category (one article covers each category) — PRD §1.3 / §3.5.4
- [ ] `authors` array length ≥ 1 (at least one complete FAE author profile) — support.schema.md Count Quotas
- [ ] `tags` array is exhaustive: every slug in any `article.tags[]` has a matching `Tag` entry — support.schema.md §Tag
- [ ] Each article `body` ≥ 800 words — support.schema.md Count Quotas
- [ ] Every H2/H3 in each `article.body` has a unique `id` attribute (≥3 anchors expected per article) — toc.js auto-generates TOC from these at runtime (markup-contract §3)
- [ ] Each article `internalLinks` provides ≥1 model link (entry with `model` key) + ≥1 concept link (entry with `concept` key) — PRD §3.5.4 iron rule
- [ ] Each article `relatedArticles` = 3–5 slugs — support.schema.md Count Quotas

### D6 — Placeholder Alignment
- [ ] `article.summary` → `{{article.summary}}` in card preview on `support-list` and category index pages (design §5.7/§5.8)
- [ ] `article.title` → `{{article.title}}` as H1 in `tech-detail`; as card heading in `support-list` (design §5.10 / §5.7)
- [ ] `article.category` → `{{article.category}}` as tab filter and category badge on list/detail (design §4.8)
- [ ] `article.tags` → `{{article.tags}}` rendered as clickable badge pills linking to `/support/tags/<slug>/` (design §5.10 / §4.12)
- [ ] `article.author` → resolves to Author object at build time; `author.name` → `{{author.name}}` in author bar; `author.photo` → `{{author.photo}}`; `author.profileHref` → link from author bar (design §5.10)
- [ ] `article.date` → `{{article.date}}`; also `TechArticle.datePublished` in JSON-LD (design §10)
- [ ] `article.body` → `{{article.body}}` rendered in `.article-content` with H2/H3 left-border rule, `<pre><code>` gray background, `<blockquote>` left border, line-height 1.8, paragraph spacing 24px (design §5.10)
- [ ] TOC is auto-generated by `toc.js` from `.article-content h2[id], h3[id]` — no `{{article.toc}}` placeholder; `<nav data-toc>` mount point in `.sticky-sidebar` is left empty by template (markup-contract §3.1 / §3.3)
- [ ] `article.internalLinks[].href` → used by `validate-data.js` to verify model and concept links resolve
- [ ] `article.relatedArticles` → `{{article.relatedArticles}}` loop at article foot (3–5 related article cards, design §5.10)
- [ ] `article.metaDescription` → `{{article.metaDescription}}` in `<meta name="description">`; also `TechArticle.description`
- [ ] `SupportCategory.title` → `{{category.title}}` as H1 on category index page (design §5.8)
- [ ] `Author.profileHref` → `{{author.profileHref}}` linked from article author bar; also `TechArticle.author.url` (design §10)
- [ ] JSON-LD: `TechArticle` on `tech-detail` pages using `article.title`, `article.date`, `article.metaDescription`, `author.name`, `author.profileHref`, `site.brand.name`, `site.logo.src` (design §10 / PRD §3.5.4)

### D7 — No Residual Stubs
- [ ] No `internalLinks[].href` is `"#"` or empty — all resolve to real internal paths (iron rule §9 #2)
- [ ] All `relatedArticles[]` slugs reference real articles in the `articles[]` array — no dangling references
- [ ] All `article.tags[]` slugs reference real entries in the `tags[]` array — no orphan tag slugs
- [ ] `Author.profileHref` follows the pattern `"/about/authors/<slug>/"` — not a placeholder string
- [ ] No `article.body`, `article.summary`, or `author.bio` contains `"lorem ipsum"`, `"TBD"`, or empty strings for required fields

---

## 6. news.json

> Schema ref: `src/data/news.schema.md`  
> Count quotas: `articles` = exactly 4 · ≥1 `"company"` + ≥1 `"industry"` · `body` ≥800 words per article  
> Templates: `news-list` (§5.11) · `news-detail` (§5.12, single-column, no sidebar per PRD C7); JSON-LD: NewsArticle + BreadcrumbList on detail pages (design §10)

### D1 — Field Completeness
- [ ] Top-level key `articles` is an array; no other spurious top-level keys
- [ ] Each `NewsArticle` has preview fields: `slug`, `title`, `type` (`"company"` or `"industry"`), `date`, `author` (String — byline, e.g. `"BeiLuo Editorial Team"`), `categoryTag`, `summary` (≤60 words), `metaDescription`
- [ ] Each `NewsArticle` has banner fields: `bannerImage.src`, `bannerImage.alt`
- [ ] Each `NewsArticle` has detail fields: `body` (≥800 words), `share.url`, `share.title`

### D2 — Pure English
- [ ] All `article.title`, `article.categoryTag`, `article.summary`, `article.metaDescription` are pure English
- [ ] All `article.body` (≥800 words each) is pure English — no Chinese characters
- [ ] `article.bannerImage.alt` is pure English descriptive text
- [ ] `article.share.title` is pure English

### D3 — Brand Differentiation
- [ ] `"company"` type article `body` texts reflect BeiLuo-specific milestones (certifications, exhibitions, partnerships) in first-person corporate voice — not recycled generic press release text per news.schema.md Brand Differentiation Notes
- [ ] `"industry"` type article `body` texts cite authority sources and include BeiLuo distributor perspective/commentary; original transformation, not verbatim press release copy
- [ ] `article.share.title` is catchy and keyword-bearing — not just a plain copy of the `title` field

### D4 — Keyword Embedding
- [ ] Each `article.title` (≤80 chars) is unique and naturally embeds `"Infineon"` or `"infineon distributor"` context per news.schema.md §NewsArticle `title` field
- [ ] Each `article.metaDescription` (≤155 chars) is unique per article and naturally contains `"Infineon"` + BeiLuo context
- [ ] Each `article.body` naturally embeds `"infineon distributor"` / `"Infineon"` and BeiLuo distributor context per news.schema.md constraint
- [ ] `article.bannerImage.alt` contains the article's headline keyword context — not a generic `"news banner"` string (news.schema.md Brand Differentiation Notes)

### D5 — Count Quotas
- [ ] `articles` array length = exactly 4 — PRD §1.3 / §3.6.2 / news.schema.md Count Quotas
- [ ] Mix of types = **exactly 1 `"company"` + exactly 3 `"industry"`** — required for `news-list` Company / Industry section split (design §5.11); with 4 total articles, the "Latest News" 3-card block at `news-detail` bottom always yields exactly 3 cards (any type, excluding current article) — news.schema.md Count Quotas / PRD §3.6.2
- [ ] Each article `body` ≥ 800 words — news.schema.md Count Quotas
- [ ] Total articles = exactly 4 (1 company + 3 industry); "Latest News" block picks the 3 most recent articles of any type excluding the current article, always yielding exactly 3 cards — news.schema.md §news-detail Template Rendering Logic

### D6 — Placeholder Alignment
- [ ] `article.title` → `{{article.title}}` as H1 in `news-detail`; as card heading in `news-list` (design §5.11 / §5.12)
- [ ] `article.type` → controls "Company News" vs "Industry News" section split in `news-list` (design §5.11 / PRD §3.6.1)
- [ ] `article.date` → `{{article.date}}`; also `NewsArticle.datePublished` in JSON-LD (design §10)
- [ ] `article.author` → `{{article.author}}` rendered as byline below headline in `news-detail` banner (design §5.12); also `NewsArticle.author.name` in JSON-LD (design §10)
- [ ] `article.categoryTag` → `{{article.categoryTag}}` as badge on detail banner and list card (design §5.12 / §4.8)
- [ ] `article.summary` → `{{article.summary}}` in news list card (design §5.11)
- [ ] `article.metaDescription` → `{{article.metaDescription}}` in `<meta name="description">`
- [ ] `article.bannerImage.src` → `{{article.bannerImage.src}}` as full-width header banner background (design §5.12)
- [ ] `article.bannerImage.alt` → `{{article.bannerImage.alt}}`
- [ ] `article.body` → `{{article.body}}` rendered in single-column centered `.article-content` (max-width 800px, no left sidebar per PRD C7 / design §5.12)
- [ ] `article.share.url` → `{{article.share.url}}` as share link target; `article.share.title` → `{{article.share.title}}` encoded in share links (design §5.12 share bar)
- [ ] JSON-LD: `NewsArticle` on `news-detail` pages using `article.title` (→ `headline`), `article.author` (→ `author.name`), `article.date` (→ `datePublished`), `article.metaDescription` (→ `description`), `article.bannerImage.src` (→ `image`), `site.brand.name` + `site.logo.src` (→ `publisher`); `BreadcrumbList` (`Home → News → <article.title>`) (design §10 / PRD §3.6.2)

### D7 — No Residual Stubs
- [ ] No `article.bannerImage.src` is empty or `"#"` — all have real SVG illustration paths (e.g., `"/assets/svg/illustrations/news-<slug>.svg"`)
- [ ] `article.share.url` is a full absolute canonical URL (e.g., `"https://www.beiluo.com/news/<slug>/"`) — not a relative path or placeholder
- [ ] No `article.body` contains `"lorem ipsum"`, `"TBD"`, or unfilled section headers
- [ ] All `article.slug` values are URL-safe (lowercase, hyphens only, no spaces) and unique within the array

---

## 7. about.json

> Schema ref: `src/data/about.schema.md`  
> Count quotas: `history` ≥4 · `advantages` 3–5 · `cases` ≥4 · `customsDeclarations` ≥2 · `team` ≥1  
> Template: `about` (§5.13); JSON-LD: BreadcrumbList only (design §10)

### D1 — Field Completeness
- [ ] Top-level keys present: `seo`, `intro`, `history`, `advantages`, `cases`, `customsDeclarations`, `team`
- [ ] `seo` has: `seo.title`, `seo.description` (≤155 chars), `seo.canonical`
- [ ] `intro` has: `intro.headline`, `intro.body` (≥100 words)
- [ ] Each `HistoryEntry` has: `year`, `event`, `description` (≤50 words)
- [ ] Each `AdvantageItem` has: `icon`, `title`, `description`
- [ ] Each `ClientCase` has: `logoSvg`, `logoAlt`
- [ ] Each `CustomsDoc` has: `title`, `imageSrc`, `alt`
- [ ] Each `TeamMember` has: `slug`, `name`, `photo`, `photoAlt`, `role`, `expertise` (≤20 words), `profileHref`

### D2 — Pure English
- [ ] `seo.title`, `seo.description`, `seo.canonical` are pure English (canonical is a URL path string)
- [ ] `intro.headline` and `intro.body` (≥100 words) are pure English
- [ ] All `HistoryEntry.event` and `HistoryEntry.description` are pure English
- [ ] All `AdvantageItem.title` and `AdvantageItem.description` are pure English
- [ ] All `ClientCase.logoAlt`, `CustomsDoc.alt`, `CustomsDoc.title` are pure English
- [ ] All `TeamMember.name`, `TeamMember.role`, `TeamMember.expertise` are pure English

### D3 — Brand Differentiation
- [ ] `intro.body` (≥100 words) reflects BeiLuo's genuine company story — founding year, location, growth trajectory, Infineon partnership, stock capacity, FAE team size — not generic distributor boilerplate per about.schema.md Brand Differentiation Notes
- [ ] `HistoryEntry` items are specific and verifiable-sounding (year + concrete event such as a certification obtained or a milestone reached) — not vague entries like "Expanded our business"
- [ ] `AdvantageItem.title` values are specific to BeiLuo's real capabilities — include quantities, certifications, or response times — avoiding generic phrases like "high quality" per about.schema.md
- [ ] `CustomsDoc.title` and `CustomsDoc.alt` explicitly state "Infineon" + product category (e.g., "Infineon IGBT Import Declaration") — not generic "import document" strings per about.schema.md Brand Differentiation Notes

### D4 — Keyword Embedding
- [ ] `seo.description` (≤155 chars) naturally contains `"Infineon authorized distributor"` + `"BeiLuo"` per about.schema.md §seo `seo.description` field and PRD §3.7
- [ ] `intro.body` naturally embeds `"Infineon authorized distributor"`, `"Infineon stock"`, and `"BeiLuo"` per about.schema.md constraint and PRD §3.7
- [ ] `intro.headline` contains `"Infineon Authorized Distributor"` or equivalent authoritative phrase per about.schema.md §intro `intro.headline` example
- [ ] `AdvantageItem.title` values include Infineon-specific wording where relevant (e.g., `"Deep Infineon Inventory"`, `"Genuine Infineon Parts"`) per about.schema.md §advantages field examples

### D5 — Count Quotas
- [ ] `history` array length ≥ 4 milestone entries, sorted chronologically — about.schema.md Count Quotas / PRD §3.7
- [ ] `advantages` array length = 3–5 items — about.schema.md Count Quotas
- [ ] `cases` array length ≥ 4 client logos or case snippets — about.schema.md Count Quotas / PRD §3.7
- [ ] `customsDeclarations` array length ≥ 2 customs declaration documents — about.schema.md Count Quotas / PRD §3.7 ("报关单展示区（信任）")
- [ ] `team` array length ≥ 1 FAE entry; every `team[].slug` matches an entry in `support.json authors[].slug` — about.schema.md §team cross-reference constraint

### D6 — Placeholder Alignment
- [ ] `seo.title` → `{{seo.title}}`; `seo.description` → `{{seo.description}}`; `seo.canonical` → `{{seo.canonical}}`
- [ ] `intro.headline` → `{{intro.headline}}` as page H1 (design §5.13)
- [ ] `intro.body` → `{{intro.body}}` as hero paragraph (design §5.13)
- [ ] `intro.heroSvgSrc` (if provided) → `{{intro.heroSvgSrc}}`; `intro.heroSvgAlt` → `{{intro.heroSvgAlt}}`
- [ ] `history` → `{{history}}` loop in timeline section; `{{entry.year}}` as timeline node label; `{{entry.event}}` as timeline heading; `{{entry.description}}` as body text (design §5.13)
- [ ] `advantages` → `{{advantages}}` loop in Feature Grid (3–5 columns desktop); `{{item.icon}}`; `{{item.title}}` as H3; `{{item.description}}` (design §5.13)
- [ ] `cases` → `{{cases}}` loop in client logo wall; `{{case.logoSvg}}` as `<img src>`; `{{case.logoAlt}}`; `{{case.companyName}}` below logo if present (design §5.13)
- [ ] `customsDeclarations` → `{{customsDeclarations}}` loop in trust section; `{{doc.title}}` as caption; `{{doc.imageSrc}}` as `<img src>`; `{{doc.alt}}` (design §5.13 / PRD §3.7 "报关单展示区（信任）")
- [ ] `team` → `{{team}}` loop in team/FAE section; `{{member.name}}`; `{{member.photo}}` as `<img src>`; `{{member.photoAlt}}`; `{{member.role}}`; `{{member.expertise}}`; `{{member.profileHref}}` on "View Profile" link (design §5.13 / §5.15 E-E-A-T chain)
- [ ] `cta.headline` (if provided) → `{{cta.headline}}`; `cta.label` → `{{cta.label}}`; `cta.href` → `{{cta.href}}` on page-bottom CTA band
- [ ] JSON-LD: `BreadcrumbList` only on about page (`Home → About Us`) per about.schema.md §JSON-LD (design §10)

### D7 — No Residual Stubs
- [ ] No `CustomsDoc.imageSrc` is empty or generic — each follows the pattern `"/assets/svg/illustrations/customs-<slug>.svg"`
- [ ] Every `team[].profileHref` follows the pattern `"/about/authors/<slug>/"` and each slug matches a real `Author` entry in `support.json`
- [ ] No `intro.body`, `HistoryEntry.description`, or `AdvantageItem.description` contains `"lorem ipsum"`, `"TBD"`, or `"placeholder"` text
- [ ] `seo.canonical` = exactly `"/about/"` — not a template placeholder string (about.schema.md §seo `seo.canonical` field)

---

*Generated by T0.6 — documentation only. Tick all 49 items per file (7 files × 7 dimensions) before Phase 4 JSON authoring is considered complete.*
