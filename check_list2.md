# check_list2.md — JSON Content Acceptance Rubric

**Purpose**: Phase 4 content acceptance gate for the 7 JSON data files. Every `- [ ]` item must be ticked before a file is considered write-complete.  
**Scope**: Content validation only — no real JSON is written by this document.  
**Sources**: `src/data/*.schema.md`, `docs/current/prd.md` §1.3/§5, `docs/current/design.md` §5.

---

## Dimension Key

| Code | Dimension | What is verified |
|------|-----------|-----------------|
| D1 | Field Completeness | All required fields from `*.schema.md` are present; no required key is absent |
| D2 | Pure English | Prohibits Chinese characters, mojibake (garbled encoding), and residual placeholder text; intentional technical symbols / units (™, °C, µ, ≥, Ω, × etc.) are allowed |
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
- [x] `brand` object present with `brand.name`, `brand.slogan`, `brand.oneLiner`
- [x] `nav.items` array present; each NavItem has `label` and `href`; Products entry has `megaMenu: true` and `children` array listing the 4 category sub-links
- [x] `footer.columns` array present; each FooterColumn has `heading` and `links[]` (each link has `label` and `href`); `footer.copyright`, `footer.sitemapHref`, `footer.robotsHref` all present
- [x] `contact` object has all four required fields: `contact.whatsapp`, `contact.wechat`, `contact.whatsappHref`, `contact.wechatQrSrc`
- [x] `seo` object has `seo.defaultTitle`, `seo.defaultDescription`, `seo.siteName`, `seo.baseUrl`
- [x] `logo` object has `logo.src`, `logo.alt`, `logo.width`, `logo.height`
- [x] `jsonLd` object has `jsonLd.organizationUrl`, `jsonLd.organizationType`

### D2 — Pure English
- [x] All string values in `brand.*`, `nav.*`, `footer.*` are pure English — no Chinese characters
- [x] `seo.defaultTitle` and `seo.defaultDescription` contain only English text
- [x] `logo.alt` is English only; `contact.*` strings are Latin-script or digits/country-code only

### D3 — Brand Differentiation
- [x] `brand.slogan` is not generic ("one-stop distributor" or equivalent); reflects BeiLuo's "Top 8 Electronic Component Distributor in China" positioning (site.schema.md §brand)
- [x] `brand.oneLiner` (≤30 words, footer col 1) is original to BeiLuo — not copied from a generic distributor site
- [x] Footer column 1 intro copy is BeiLuo-specific and does not reuse boilerplate found on other distributor sites

### D4 — Keyword Embedding
- [x] `seo.defaultDescription` (≤155 chars) naturally contains both `"infineon distributor"` and `"BeiLuo"` per PRD §3.2 acceptance criteria
- [x] `brand.slogan` reinforces BeiLuo authority without keyword stuffing
- [x] `logo.alt` includes `"BeiLuo"` and the positioning phrase (e.g., `"Top 8 Electronic Component Distributor in China"`)

### D5 — Count Quotas
- [x] `nav.items` length = exactly 7 (Home / Products / Solutions / Support / News / About Us / Contact) — site.schema.md Count Quotas
- [x] `footer.columns` length = exactly 4 (Brand+tagline · Products links · Support/Solutions/News links · Contact) — site.schema.md Count Quotas
- [x] Contact channels = 2: WhatsApp `+86 15013702378` and WeChat `+86 18612518271` (values match PRD §3.8)

### D6 — Placeholder Alignment
- [x] `brand.name` → `{{brand.name}}` in nav/footer + `Organization.name` in JSON-LD (site.schema.md §brand / design §10)
- [x] `brand.slogan` → `{{brand.slogan}}` in nav (desktop only, hidden mobile) + `Organization.description`
- [x] `brand.oneLiner` → `{{brand.oneLiner}}` in footer column 1
- [x] `nav.items` → `{{nav.items}}` loop in nav partial shared by all 12 templates
- [x] `footer.columns` → `{{footer.columns}}` loop; `footer.copyright` → `{{footer.copyright}}`; `footer.sitemapHref` → `{{footer.sitemapHref}}`; `footer.robotsHref` → `{{footer.robotsHref}}`
- [x] `contact.whatsapp` → `{{contact.whatsapp}}`; `contact.whatsappHref` → `{{contact.whatsappHref}}`; `contact.wechat` → `{{contact.wechat}}`; `contact.wechatQrSrc` → `{{contact.wechatQrSrc}}` in floating widget popup
- [x] `seo.defaultTitle` → `{{seo.title}}` (per-page data overrides); `seo.defaultDescription` → `{{seo.description}}`; `seo.siteName` → OG tags; `seo.baseUrl` → canonical URL / sitemap build
- [x] `logo.src` → `{{logo.src}}` in nav + `Organization.logo.url`; `logo.alt` → `{{logo.alt}}`; `logo.width` → `{{logo.width}}`; `logo.height` → `{{logo.height}}`
- [x] `jsonLd.organizationUrl` → `Organization.url`; `jsonLd.organizationType` → `@type`

### D7 — No Residual Stubs
- [x] No required field contains `"TBD"`, `"TODO"`, `"lorem ipsum"`, `"<placeholder>"`, or empty string `""`
- [x] `brand.slogan` is the exact phrase `"Top 8 Electronic Component Distributor in China"` (PRD §1)
- [x] `contact.whatsapp` = `"+86 15013702378"` and `contact.wechat` = `"+86 18612518271"` — real numbers, not template values (PRD §3.8)

---

## 2. home.json

> Schema ref: `src/data/home.schema.md`  
> Count quotas: 6 home modules · `hero.trustBadges` = 3 · `productsTeaser` = 4 · `solutionsTeaser` = 3 · `supportTeaser` = 3 · `newsTeaser` = 3 · `whyChooseUs` = 3–4  
> Template: `home` (design §5.1); JSON-LD: Organization + WebSite on home page only (design §10)

### D1 — Field Completeness
- [x] `seo` object has `seo.title`, `seo.description`, `seo.canonical`
- [x] `hero` object has: `hero.headline`, `hero.subText`, `hero.ctaPrimary` (with `label` + `href`), `hero.ctaSecondary` (with `label` + `href`), `hero.bgSvgSrc`, `hero.bgSvgAlt`, `hero.trustBadges` (array)
- [x] Each `hero.trustBadges` item has `icon` and `label`
- [x] `whyChooseUs` array present; each FeatureItem has `icon`, `title`, `description`
- [x] `productsTeaser` array present; each ProductTeaserCard has `slug`, `name`, `icon`, `summary`, `href`
- [x] `solutionsTeaser` array present; each SolutionTeaserCard has `slug`, `title`, `industry`, `summary`, `href`
- [x] `supportTeaser` array present; each SupportTeaserCard has `slug`, `category`, `title`, `summary`, `date`, `href`
- [x] `newsTeaser` array present; each NewsTeaserCard has `slug`, `type`, `title`, `date`, `categoryTag`, `href`
- [x] `finalCta` object has `headline`, `ctaLabel`, `ctaHref`

### D2 — Pure English
- [x] All `hero.*` strings are pure English — no Chinese characters
- [x] All teaser card `title`, `summary`, `name`, `categoryTag`, `industry` fields are pure English
- [x] `whyChooseUs[].description` fields and `finalCta.headline` are pure English

### D3 — Brand Differentiation
- [x] `hero.headline` is original and identifies BeiLuo specifically — not a generic `"Your Trusted Distributor"` with no brand identity
- [x] `hero.subText` (≤50 words) is brand-differentiated; mentions BeiLuo's specific positioning (stock depth, FAE, logistics) rather than generic distributor language
- [x] Each `whyChooseUs[].description` describes a genuine BeiLuo differentiator (stock depth / FAE support / logistics / genuine Infineon products) with original phrasing — not copy-pasted across cards
- [x] Each `productsTeaser[].summary` (≤30 words) is original per category — not identical copy with only the category name swapped

### D4 — Keyword Embedding
- [x] `seo.description` (≤155 chars) naturally contains `"infineon distributor"` + `"BeiLuo"` — per PRD §3.2 and home.schema.md constraint
- [x] `hero.headline` naturally embeds `"Infineon Distributor"` or an equivalent authoritative phrase without keyword stuffing
- [x] Each `productsTeaser[].summary` contains a category-specific keyword (`"Infineon MCU"`, `"Infineon IGBT"`, `"Infineon MOSFET"`, `"Infineon Sensors"`) per home.schema.md §productsTeaser
- [x] `hero.subText` naturally includes `"Infineon authorized distributor"` or `"Infineon stock"` per PRD §1.1
- [x] Each `solutionsTeaser[].summary` (≤40 words) embeds industry keyword + `"Infineon"` + distributor context

### D5 — Count Quotas
- [x] `hero.trustBadges` length = exactly 3 items (ISO Certified · 10+ Years · Global Logistics) — home.schema.md Count Quotas
- [x] `whyChooseUs` length = 3 or 4 items — home.schema.md Count Quotas
- [x] `productsTeaser` length = exactly 4 (MCU / IGBT / MOSFET / Sensors — all 4 categories) — home.schema.md Count Quotas
- [x] `solutionsTeaser` length = exactly 3 featured solutions — home.schema.md Count Quotas
- [x] `supportTeaser` length = exactly 3 latest support articles — home.schema.md Count Quotas
- [x] `newsTeaser` length = exactly 3 latest news articles — home.schema.md Count Quotas
- [x] Total distinct top-level content modules = 6: hero · whyChooseUs · productsTeaser · solutionsTeaser · supportTeaser+newsTeaser · finalCta — PRD §3.2 acceptance criterion

### D6 — Placeholder Alignment
- [x] `seo.title` → `{{seo.title}}`; `seo.description` → `{{seo.description}}`; `seo.canonical` → `{{seo.canonical}}`
- [x] `hero.headline` → `{{hero.headline}}` as single H1 (one H1 per page — WCAG/PRD §4.1)
- [x] `hero.subText` → `{{hero.subText}}`; `hero.ctaPrimary.label` → `{{hero.ctaPrimary.label}}`; `hero.ctaPrimary.href` → `{{hero.ctaPrimary.href}}` on orange Primary CTA (design §4.6)
- [x] `hero.ctaSecondary.label` → `{{hero.ctaSecondary.label}}`; `hero.ctaSecondary.href` → `{{hero.ctaSecondary.href}}`
- [x] `hero.bgSvgSrc` → `{{hero.bgSvgSrc}}` as background/`<img>`; `hero.bgSvgAlt` → `{{hero.bgSvgAlt}}`
- [x] `hero.trustBadges` → `{{hero.trustBadges}}` loop rendering `{{item.icon}}` + `{{item.label}}` per TrustBadge shape
- [x] `whyChooseUs` → `{{whyChooseUs}}` loop; `{{item.icon}}`, `{{item.title}}` as H3, `{{item.description}}` (design §5.1 Feature Grid, 3–4 columns desktop)
- [x] `productsTeaser` → `{{productsTeaser}}` loop; `{{card.name}}` as H3, `{{card.icon}}`, `{{card.summary}}`, `{{card.href}}` on "View Models →" link
- [x] `solutionsTeaser` → `{{solutionsTeaser}}` loop; `{{card.title}}` as H3, `{{card.industry}}` as badge (design §4.8), `{{card.summary}}`, `{{card.href}}`
- [x] `supportTeaser` → `{{supportTeaser}}` loop; `{{card.title}}`, `{{card.category}}` as badge, `{{card.summary}}`, `{{card.date}}`, `{{card.href}}`
- [ ] `newsTeaser` → `{{newsTeaser}}` loop; `{{card.title}}`, `{{card.type}}` as badge, `{{card.date}}`, `{{card.categoryTag}}`, `{{card.href}}` — **T8.2收尾核实**: `home.html:177` renders `{{categoryTag}}` as the badge, not `{{type}}` — `type` is not rendered directly, matching the note added to `home.schema.md` in the T8.2 batch-4 commit (`f92df8e`): "data-only classification retained for potential future filtering/routing, not rendered directly (see `categoryTag`)". This line's literal wording is now stale relative to that schema note; left unchecked rather than silently reworded
- [x] `finalCta.headline` → `{{finalCta.headline}}`; `finalCta.ctaLabel` → `{{finalCta.ctaLabel}}`; `finalCta.ctaHref` → `{{finalCta.ctaHref}}` (orange/dark CTA band, design §5.1)
- [x] Organization + WebSite JSON-LD are derived at build time from `site.json` only — no additional home.json fields needed (home.schema.md §JSON-LD Mapping)

### D7 — No Residual Stubs
- [x] No required field contains `"TBD"`, `"TODO"`, `"lorem ipsum"`, `"placeholder"`, or empty string — **exception: `hero.bgSvgAlt` may be `""` when the background SVG is purely decorative** (home.schema.md §hero `hero.bgSvgAlt` — declared Optional/decorative; empty string is correct per WCAG for decorative images)
- [x] `hero.ctaPrimary.href` is a real path (`"/contact/"`) — not `"#"` (iron rule §9 #2)
- [x] All `href` fields in `productsTeaser`, `solutionsTeaser`, `supportTeaser`, `newsTeaser` resolve to real paths — no empty `#` links
- [x] `hero.bgSvgSrc` is a real SVG path (e.g., `"/assets/svg/backgrounds/hero-circuit.svg"`) — not a placeholder string
- [x] ISO 8601 `date` values in `supportTeaser` and `newsTeaser` are valid real dates — not `"YYYY-MM-DD"` template strings

---

## 3. products.json

> Schema ref: `src/data/products.schema.md`  
> Count quotas: `categories` = 4 · detail models per category = 2 (8 total) · `specs` per model ≥ 5 · `faq` per model = 3–5  
> Templates: `products-list` (§5.2) · `product-category` (§5.3) · `product-detail` (§5.4); JSON-LD: ItemList+Product on category page, Product on detail page (design §10)

### D1 — Field Completeness
- [x] Top-level key `categories` is an array; no other spurious top-level keys
- [x] Each `Category` has: `slug`, `name`, `title`, `metaDescription`, `description` (200–300 words), `faeNote` (≥50 words, FAE voice), `icon`, `selectionGuideHref`, `selectionGuideDownloadHref`, `columns` (Array\<ColumnDef\>), `models` (Array\<Model\>)
- [x] Each `ColumnDef` has `key`, `label`, `type` (`"text"`/`"number"`/`"enum"`); `filter` is **optional** (`"select"`/`"range"`/`"multi"`) — omit entirely if the column is not filterable (value `"none"` is invalid); `unit` present where applicable; first column has `sticky: true`
- [x] Each Model (all — table-row level) has: `partNo`, `series`, `params` (Object whose keys match `columns[].key` for that category), `package`, `stock` (`"inStock"` or `"rfq"`), `href`
- [x] Each detail-level model (≥2 per category) additionally has: `overview` (≥100 words), `shortDescription` (≤30 words), `image`, `imageAlt`, `datasheetHref`, `specs` (Array\<SpecRow\>), `applications` (Array\<String\>), `documents` (Array\<Document\>), `faq` (Array\<FaqItem\>), `alternativeParts` (Array\<PartRef\>), `companionParts` (Array\<PartRef\>), `brand`
- [x] Each `SpecRow` has `param`, `value`; `unit` present where applicable
- [x] Each `Document` has `title`, `href`, `type` (`"datasheet"`/`"application-note"`/`"selection-guide"`)
- [x] Each `FaqItem` has `question`, `answer` (≥30 words)
- [x] Each `PartRef` (alternativeParts/companionParts) has `partNo`, `slug`, `categorySlug`

### D2 — Pure English
- [x] All `category.title`, `category.metaDescription`, `category.description` are pure English
- [x] `category.faeNote` is pure English (first-person FAE voice, no Chinese characters)
- [x] All `model.overview`, `model.shortDescription`, `model.imageAlt` are pure English
- [x] All `model.faq[].question` and `model.faq[].answer` are pure English

### D3 — Brand Differentiation
- [x] Each `category.description` (200–300 words) is original and not copied from Infineon's official site; mentions specific series (AURIX™ TC3xx, XMC™ 4000, PSoC™ 6, OptiMOS™ etc.) with BeiLuo's distributor angle (stock depth, FAE support, fast delivery) — products.schema.md Brand Differentiation Notes
- [x] Each `category.faeNote` (≥50 words) reads as genuine FAE commentary with BeiLuo's distributor perspective — not generic marketing copy or verbatim datasheet text
- [x] Each `model.overview` (≥100 words) is original engineering description contextualizing the part for engineers — not copied from the Infineon datasheet
- [ ] Each `model.faq[].answer` (≥30 words) reflects BeiLuo's expertise as a distributor (stock availability, application guidance, alternative part suggestions) — brand-specific, not generic — **T8.2收尾核实**: audited 40 FAQ answers across 8 models for explicit distributor-context language (stock/samples/lead-time/RFQ/tape-and-reel/etc.); counts range 16–22/40 depending on keyword strictness, and coverage is uneven per model — most models have 2+ branded answers but `IKD06N60RF` has only 1/5 (an earlier draft of this note incorrectly claimed "every model has ≥2 branded answers"; corrected after Codex's read-only recheck caught the discrepancy against the raw data). Read as a literal "all 40 answers must be brand-specific" requirement this line does not pass, and unlike the other accepted exceptions in this close-out, per-model coverage is not uniformly adequate either — `IKD06N60RF`'s FAQ set in particular reads as generic technical Q&A with minimal BeiLuo framing. Left unchecked; flagged for product/content owner as a genuine content gap worth a real fix (not just a documentation/interpretation issue like the other 6 exceptions here), likely starting with `IKD06N60RF`

### D4 — Keyword Embedding
- [x] `category.title` for each of the 4 categories contains the category distributor keyword (e.g., `"Infineon IGBT Distributor"`, `"Infineon MCU Distributor"`) per products.schema.md §category `title` field note
- [x] `category.metaDescription` (≤155 chars) naturally contains the category keyword (e.g., `"Infineon IGBT distributor"`) per products.schema.md §category `metaDescription` field
- [x] `category.description` naturally embeds target keywords (e.g., series names, `"Infineon MCU distributor"`) without keyword stuffing
- [x] `model.faq[].question` uses question-type keyword phrasing (GEO-optimized Q&A format) per products.schema.md §FaqItem

### D5 — Count Quotas
- [x] `categories` array length = exactly 4 — products.schema.md Count Quotas / PRD §1.3
- [x] Category slugs are exactly: `"mcu"`, `"igbt"`, `"mosfet"`, `"sensors"` — PRD §1.3 / C4
- [x] Each category has exactly 2 detail-level models (with overview, specs, faq, etc.) — 8 detail models total — products.schema.md Count Quotas / PRD §1.3 (§3.3.3: 8 total, 4×2)
- [x] Each detail model has ≥5 `specs` rows — products.schema.md Count Quotas
- [x] Each detail model has 3–5 `faq` items — products.schema.md Count Quotas
- [x] `columns` per category are category-appropriate and differ between categories (e.g., IGBT columns ≠ MCU columns) per products.schema.md §ColumnDef example column sets

### D6 — Placeholder Alignment
- [x] `category.title` → `{{category.title}}` as H1 in `product-category` template and as `<title>` tag (design §5.3)
- [x] `category.metaDescription` → `{{category.metaDescription}}` in `<meta name="description">`
- [x] `category.description` → `{{category.description}}` as `<p>` blocks below H1 (design §5.3)
- [x] `category.faeNote` → `{{category.faeNote}}` in `<blockquote>` / pull-quote block (design §5.3)
- [x] `category.icon` → `{{category.icon}}` in category card and sidebar (design §5.2)
- [x] `category.selectionGuideHref` → `{{category.selectionGuideHref}}` on "Selection Guide →" ghost/text CTA (design §5.3 / §4.6)
- [x] `category.selectionGuideDownloadHref` → `{{category.selectionGuideDownloadHref}}` on "Download Category Selection Guide" secondary CTA button (design §5.3 / §4.6)
- [x] `category.columns` → `{{category.columns}}` drives `render.js` table header + filter controls (design §4.9 / §5.3)
- [x] `model.partNo` → `{{model.partNo}}` as H1 in detail page; `Product.sku` in JSON-LD (design §5.4 / §10)
- [x] `model.stock` → `{{model.stock}}` renders "In Stock" green badge or "RFQ" orange badge (design §4.8)
- [x] `model.image` → `{{model.image}}` as `<img src>` in detail left column; `Product.image` in JSON-LD (design §5.4)
- [x] `model.imageAlt` → `{{model.imageAlt}}`
- [x] `model.datasheetHref` → `{{model.datasheetHref}}` on blue-outline "Download Datasheet" Secondary CTA (design §5.4 / §4.6)
- [x] `model.specs` → `{{model.specs}}` loop in `.spec-table` Specifications tab (design §4.9 / §5.4)
- [x] `model.faq` → `{{model.faq}}` loop as accordion (design §5.4); `faq.question` as accordion header, `faq.answer` as body
- [x] `model.alternativeParts` / `model.companionParts` → `{{model.alternativeParts}}` / `{{model.companionParts}}` in card carousel (design §5.4)
- [x] `model.shortDescription` → `{{model.shortDescription}}` in core info bar at top of detail page (design §5.4)
- [x] `model.overview` → `{{model.overview}}` as first paragraph in Overview tab (design §5.4)
- [x] `model.applications` → `{{model.applications}}` as list in Application tab (design §5.4); also `Product.category` in JSON-LD (design §10)
- [x] `model.documents` → `{{model.documents}}` loop in Documents tab (design §5.4)
- [x] `model.href` → `{{model.href}}` on part number link in spec table; `Product.url` in JSON-LD (design §10 / products.schema.md §JSON-LD Mapping)
- [x] JSON-LD: `ItemList` + per-model `Product` on `product-category` page; `Product` on `product-detail` page (design §10 / PRD §3.3.2–3.3.3)

### D7 — No Residual Stubs
- [x] No `model.datasheetHref` is `"#"` or empty string — all have real, submitted paths (iron rule §9 #2)
- [x] All `PartRef.slug` and `PartRef.categorySlug` values resolve to real entries in the `categories` / `models` arrays — no dangling cross-references
- [x] No `model.overview`, `category.description`, or `category.faeNote` contains `"lorem ipsum"`, `"TBD"`, or unfilled section headers
- [x] All `model.href` paths follow the pattern `"/products/<categorySlug>/<partNo-slug>/"` with real slugs — not template strings

---

## 4. solutions.json

> Schema ref: `src/data/solutions.schema.md`  
> Count quotas: `solutions` = 6 (5 original + "Home Appliance" added in T8.2 Tier 3, milestone ≥4) · `body` ≥800 words · `bomList` ≥3 · `advantages` 3–5 · `related` 3–5  
> **T8.2收尾核实**: this section originally documented 5 solutions and a `blockDiagram.src`/`.alt` field pair. The codebase now has 6 solutions (see D5) and the field was renamed to `diagramSrc`/`diagramAlt` (dead `blockDiagram` removed in the Tier 1 batch). Field names below are updated to match; historical field name is noted where it appears.  
> Templates: `solutions-list` (§5.5) · `solution-detail` (§5.6); JSON-LD: BreadcrumbList on detail pages (design §10)

### D1 — Field Completeness
- [x] Top-level key `solutions` is an array; no other spurious top-level keys
- [x] Each `Solution` has: `slug`, `title`, `metaDescription`, `summary` (≤60 words), `industry`, `diagramSrc` + `diagramAlt` (renamed from earlier `blockDiagram.src`/`.alt` draft), `advantages` (Array\<String\>), `bomList` (Array\<BomEntry\>), `scenarios` (≥150 words), `body` (≥800 words), `related` (Array\<RelatedItem\>)
- [x] `diagramSrc` and `diagramAlt` (≥40 words) are both present for every solution
- [x] Each `BomEntry` has: `partNo`, `description`, `link`
- [x] Each `RelatedItem` has: `type` (`"solution"`/`"product"`/`"support"`), `title`, `href`

### D2 — Pure English
- [x] All `solution.title`, `solution.metaDescription`, `solution.summary` are pure English
- [x] `solution.body` (≥800 words each) is pure English — no Chinese characters
- [x] `solution.diagramAlt` is pure English descriptive text (≥40 words per solutions.schema.md)
- [x] All `solution.advantages[]` strings are pure English
- [x] All `bomEntry.description` strings are pure English

### D3 — Brand Differentiation
- [x] Each `solution.body` (≥800 words) is original industry/engineering analysis — not copied from Infineon official application notes; cites specific Infineon series with BeiLuo's distributor commentary per solutions.schema.md Brand Differentiation Notes
- [x] Each `solution.scenarios` (≥150 words) describes real-world use cases with BeiLuo-specific insight — not generic vendor content
- [x] Each `solution.advantages[]` item is specific to the solution's Infineon components — not vague generic quality claims

### D4 — Keyword Embedding
- [x] `solution.title` for each of the 5 solutions contains the industry-specific keyword + `"Infineon"` + distributor context (e.g., `"BLDC Motor Drive Solution with Infineon IGBT"`) per solutions.schema.md §Solution `title` field
- [x] `solution.metaDescription` (≤155 chars) contains industry keyword + `"Infineon"` + BeiLuo context per solutions.schema.md §Solution `metaDescription` field
- [x] `solution.summary` (≤60 words) contains the core GEO keyword for that solution per solutions.schema.md §Solution `summary` field
- [x] `solution.body` naturally embeds industry-specific keywords and Infineon series names (e.g., IGBT series for motor-drive solutions) without stuffing

### D5 — Count Quotas
- [x] `solutions` array length = exactly 6 (5 original + Home Appliance added T8.2 Tier 3) — PRD §1.3 / C2 (milestone acceptance ≥4) — **T8.2收尾核实**: this line originally said "exactly 5"; corrected to reflect the 6th solution added since check_list2.md was written
- [x] Industries covered across 6 solutions: Motor Drive · EV Charging · Solar PV · Industrial Automation · Embedded Control · Home Appliance — **T8.2收尾核实**: original text named 5 industries without "Embedded Control" (which was already present in the original 5-solution set as `mcu-embedded-control`) and listed "Home Appliance" as if original; corrected to the actual 6-solution industry list
- [x] Each solution `body` ≥ 800 words — solutions.schema.md Count Quotas
- [x] Each solution `bomList` ≥ 3 BOM entries — solutions.schema.md Count Quotas
- [x] Each solution `advantages` = 3–5 items — solutions.schema.md Count Quotas
- [x] Each solution `related` = 3–5 items — solutions.schema.md Count Quotas

### D6 — Placeholder Alignment
- [x] `solution.title` → `{{solution.title}}` as H1; also as `<title>` tag (design §5.5 / §5.6)
- [x] `solution.metaDescription` → `{{solution.metaDescription}}` in `<meta name="description">`
- [x] `solution.summary` → `{{solution.summary}}` in solution card on `solutions-list` and `solutionsTeaser` on home (design §5.5)
- [x] `solution.industry` → `{{solution.industry}}` as badge on list card and detail header (design §4.8)
- [x] `solution.diagramSrc` → `{{solution.diagramSrc}}` as `<img src>` in first H2 section (design §5.6) — field renamed from `blockDiagram.src`
- [x] `solution.diagramAlt` → `{{solution.diagramAlt}}` — field renamed from `blockDiagram.alt`
- [x] `solution.advantages` → `{{solution.advantages}}` loop as `<li>` items in H2 "Core Advantages" section (design §5.6)
- [ ] `solution.bomList` → `{{solution.bomList}}` loop in BOM table; `bom.link` on part-number anchor; `bom.description` in role column (design §5.6) — **T8.2收尾核实**: `solution-detail.html`'s anchor actually binds to `bom.href`, not `bom.link` as this line specifies. Every current `bomEntry` keeps both fields identical, so rendered output is correct today, but the template does not consume `link` — latent drift risk if the two fields ever diverge. Left unchecked as a real (if currently harmless) implementation/documentation mismatch; recommend either updating the template to read `bom.link` or removing the unused `link` field from `solutions.schema.md`/data in a future pass
- [x] `solution.body` → `{{solution.body}}` rendered as article content with H2/H3 structure (design §5.6)
- [x] `solution.related` → `{{solution.related}}` loop in sidebar (3–5 items, design §5.6); `item.type` determines icon/link pattern
- [x] `solution.scenarios` → `{{solution.scenarios}}` as rich text block in "Application Scenarios" H2 section (design §5.6)
- [x] `solution.ctaLabel` (if provided) → `{{solution.ctaLabel}}` on closing CTA button; defaults to `"Get a Quote"` (design §5.6)
- [x] JSON-LD: `BreadcrumbList` on `solution-detail` pages (`Home → Solutions → <solution.title>`); no dedicated Solution Schema type per solutions.schema.md §JSON-LD note (design §10)

### D7 — No Residual Stubs
- [x] No `bomEntry.link` is `"#"` or empty — all link to real product detail paths (e.g., `"/products/igbt/ikw40n120h3/"`) per iron rule §9 #2
- [x] No `relatedItem.href` is empty or `"#"` — all resolve to real internal pages
- [x] No `solution.body` contains `"lorem ipsum"`, `"TBD"`, or unfilled H2/H3 section placeholders
- [ ] `solution.diagramSrc` paths follow the pattern `"/assets/svg/illustrations/bd-<slug>.svg"` — not placeholder strings — **T8.2收尾核实**: all 6 solutions currently share one generic `/assets/svg/illustrations/solution-diagram.svg` rather than per-slug diagrams. Already tracked as a known, deliberately-deferred gap (`solutions.schema.md` §diagramSrc note, `dev-status.md` §6 "illustration-differentiation"), not a new finding — left unchecked pending the separately-flagged scope decision on the 13-file illustration-differentiation task

---

## 5. support.json

> Schema ref: `src/data/support.schema.md`  
> Count quotas: `categories` = 4 · `articles` = 4 (one per category) · `authors` ≥ 1 · `body` ≥800 words · H2/H3 `id` attrs required (toc.js auto-generates TOC) · `internalLinks` ≥1 model + ≥1 concept · `relatedArticles` 3–5  
> Templates: `support-list` (§5.7/§5.8/§5.9) · `tech-detail` (§5.10); JSON-LD: TechArticle on detail pages (design §10)

### D1 — Field Completeness
- [x] Top-level structure has exactly four keys: `categories` (Array), `tags` (Array), `authors` (Array), `articles` (Array)
- [x] Each `SupportCategory` has: `slug`, `name`, `title`, `metaDescription`
- [x] Each `Tag` has: `slug`, `name`; tags array is exhaustive — every slug referenced in any `article.tags[]` has a corresponding entry here
- [x] Each `Author` has: `slug`, `name`, `photo`, `photoAlt`, `expertise` (≤30 words), `experience`, `profileHref`
- [x] Each `Article` (preview fields) has: `slug`, `title`, `category` (matching a `SupportCategory.slug`), `tags` (Array\<String\>), `author` (matching an `Author.slug`), `date`, `summary` (≤60 words), `metaDescription`
- [x] Each `Article` (detail fields) has: `body` (≥800 words), `internalLinks` (Array\<InternalLink\>), `relatedArticles` (Array\<String\>)
- [x] Every H2/H3 heading inside `article.body` carries a unique `id` attribute (slug anchor) — `toc.js` auto-generates the Sticky TOC from these; no `toc` field is stored in the JSON
- [x] Each `InternalLink` has: `href`; the `internalLinks` array for each article contains ≥1 entry with `model` field and ≥1 entry with `concept` field

### D2 — Pure English
- [x] All `SupportCategory.title`, `SupportCategory.metaDescription` are pure English
- [x] All `Author.name`, `Author.expertise`, `Author.experience` are pure English (name in English transliteration)
- [x] All `Article.title`, `Article.summary`, `Article.metaDescription` are pure English
- [x] All `Article.body` (≥800 words each) is pure English — no Chinese characters
- [x] All `Tag.name`, `TocEntry.heading` values are pure English

### D3 — Brand Differentiation
- [x] All 4 article `body` texts are original — not copied from Infineon datasheets or application notes; include BeiLuo-specific insights (stock availability, procurement tips, alternative part suggestions) per support.schema.md Brand Differentiation & E-E-A-T Notes
- [x] `Author.name` is a realistic FAE name (not a placeholder like "Author Name") for E-E-A-T credibility per PRD §3.9
- [x] `Author.expertise` describes a genuine technical specialization relevant to Infineon products (not generic "electronics engineer")

### D4 — Keyword Embedding
- [x] Each `Article.title` uses informational or question-type keyword phrasing relevant to that category (e.g., `"How to Select the Right Infineon IGBT: A Distributor's Guide"`) per support.schema.md §Article `title` field note
- [x] Each `Article.metaDescription` (≤155 chars) contains the category-relevant keyword + `"Infineon"` + BeiLuo context
- [x] Each `Article.body` naturally embeds `"Infineon"` references and relevant product long-tail keywords (e.g., `"Infineon IGBT distributor"`) per PRD §1.1
- [x] Each `SupportCategory.title` contains a category-specific keyword (e.g., `"Infineon Selection Guides — Technical Resources"`) per support.schema.md §SupportCategory `title` field

### D5 — Count Quotas
- [x] `categories` array length = exactly 4 with slugs: `"guides"`, `"application-notes"`, `"troubleshooting"`, `"reviews"` — support.schema.md Count Quotas / PRD §1.3
- [x] `articles` array length = exactly 4; each article is assigned to a different category (one article covers each category) — PRD §1.3 / §3.5.4
- [x] `authors` array length ≥ 1 (at least one complete FAE author profile) — support.schema.md Count Quotas
- [x] `tags` array is exhaustive: every slug in any `article.tags[]` has a matching `Tag` entry — support.schema.md §Tag
- [x] Each article `body` ≥ 800 words — support.schema.md Count Quotas
- [x] Every H2/H3 in each `article.body` has a unique `id` attribute (≥3 anchors expected per article) — toc.js auto-generates TOC from these at runtime (markup-contract §3)
- [x] Each article `internalLinks` provides ≥1 model link (entry with `model` key) + ≥1 concept link (entry with `concept` key) — PRD §3.5.4 iron rule
- [x] Each article `relatedArticles` = 3–5 slugs — support.schema.md Count Quotas

### D6 — Placeholder Alignment
- [x] `article.summary` → `{{article.summary}}` in card preview on `support-list` and category index pages (design §5.7/§5.8)
- [x] `article.title` → `{{article.title}}` as H1 in `tech-detail`; as card heading in `support-list` (design §5.10 / §5.7)
- [x] `article.category` → `{{article.category}}` as tab filter and category badge on list/detail (design §4.8)
- [ ] `article.tags` → `{{article.tags}}` rendered as clickable badge pills linking to `/support/tags/<slug>/` (design §5.10 / §4.12) — **T8.2收尾核实**: links resolve correctly, but the visible badge text renders the raw tag slug (e.g. `igbt`) rather than `Tag.name` (e.g. "IGBT") — `pages.js` resolves `author`/`category` to full objects per article but never does the equivalent `.find()` for `tags`. Already documented as a known issue in `dev-status.md` §6 prior to this session; left unchecked, not a new finding
- [x] `article.author` → resolves to Author object at build time; `author.name` → `{{author.name}}` in author bar; `author.photo` → `{{author.photo}}`; `author.profileHref` → link from author bar (design §5.10)
- [x] `article.date` → `{{article.date}}`; also `TechArticle.datePublished` in JSON-LD (design §10)
- [x] `article.body` → `{{article.body}}` rendered in `.article-content` with H2/H3 left-border rule, `<pre><code>` gray background, `<blockquote>` left border, line-height 1.8, paragraph spacing 24px (design §5.10)
- [x] TOC is auto-generated by `toc.js` from `.article-content h2[id], h3[id]` — no `{{article.toc}}` placeholder; `<nav data-toc>` mount point in `.sticky-sidebar` is left empty by template (markup-contract §3.1 / §3.3)
- [ ] `article.internalLinks[].href` → used by `validate-data.js` to verify model and concept links resolve — **T8.2收尾核实**: `validateSupport()` in `validate-data.js` does not actually cross-check `internalLinks` against anything (no existence/model-resolution check). Confirmed live consequence: `infineon-optimos-mosfet-overview`'s declared `IRFS4321PBF` model link never appears in that article's body prose, and the build does not catch it. Already documented as a known issue in `dev-status.md` §6 prior to this session; left unchecked, not a new finding
- [x] `article.relatedArticles` → `{{article.relatedArticles}}` loop at article foot (3–5 related article cards, design §5.10)
- [x] `article.metaDescription` → `{{article.metaDescription}}` in `<meta name="description">`; also `TechArticle.description`
- [x] `SupportCategory.title` → `{{category.title}}` as H1 on category index page (design §5.8)
- [x] `Author.profileHref` → `{{author.profileHref}}` linked from article author bar; also `TechArticle.author.url` (design §10)
- [x] JSON-LD: `TechArticle` on `tech-detail` pages using `article.title`, `article.date`, `article.metaDescription`, `author.name`, `author.profileHref`, `site.brand.name`, `site.logo.src` (design §10 / PRD §3.5.4)

### D7 — No Residual Stubs
- [x] No `internalLinks[].href` is `"#"` or empty — all resolve to real internal paths (iron rule §9 #2)
- [x] All `relatedArticles[]` slugs reference real articles in the `articles[]` array — no dangling references
- [x] All `article.tags[]` slugs reference real entries in the `tags[]` array — no orphan tag slugs
- [x] `Author.profileHref` follows the pattern `"/about/authors/<slug>/"` — not a placeholder string
- [x] No `article.body`, `article.summary`, or `author.bio` contains `"lorem ipsum"`, `"TBD"`, or empty strings for required fields

---

## 6. news.json

> Schema ref: `src/data/news.schema.md`  
> Count quotas: `articles` = exactly 4 · ≥1 `"company"` + ≥1 `"industry"` · `body` ≥800 words per article  
> Templates: `news-list` (§5.11) · `news-detail` (§5.12, single-column, no sidebar per PRD C7); JSON-LD: NewsArticle + BreadcrumbList on detail pages (design §10)

### D1 — Field Completeness
- [x] Top-level key `articles` is an array; no other spurious top-level keys
- [x] Each `NewsArticle` has preview fields: `slug`, `title`, `type` (`"company"` or `"industry"`), `date`, `author` (String — byline, e.g. `"BeiLuo Editorial Team"`), `categoryTag`, `summary` (≤60 words), `metaDescription`
- [x] Each `NewsArticle` has banner fields: `bannerImage.src`, `bannerImage.alt`
- [x] Each `NewsArticle` has detail fields: `body` (≥800 words), `share.url`, `share.title`

### D2 — Pure English
- [x] All `article.title`, `article.categoryTag`, `article.summary`, `article.metaDescription` are pure English
- [x] All `article.body` (≥800 words each) is pure English — no Chinese characters
- [x] `article.bannerImage.alt` is pure English descriptive text
- [x] `article.share.title` is pure English

### D3 — Brand Differentiation
- [x] `"company"` type article `body` texts reflect BeiLuo-specific milestones (certifications, exhibitions, partnerships) in first-person corporate voice — not recycled generic press release text per news.schema.md Brand Differentiation Notes
- [x] `"industry"` type article `body` texts cite authority sources and include BeiLuo distributor perspective/commentary; original transformation, not verbatim press release copy
- [x] `article.share.title` is catchy and keyword-bearing — not just a plain copy of the `title` field

### D4 — Keyword Embedding
- [x] Each `article.title` (≤80 chars) is unique and naturally embeds `"Infineon"` or `"infineon distributor"` context per news.schema.md §NewsArticle `title` field
- [x] Each `article.metaDescription` (≤155 chars) is unique per article and naturally contains `"Infineon"` + BeiLuo context
- [x] Each `article.body` naturally embeds `"infineon distributor"` / `"Infineon"` and BeiLuo distributor context per news.schema.md constraint
- [x] `article.bannerImage.alt` contains the article's headline keyword context — not a generic `"news banner"` string (news.schema.md Brand Differentiation Notes)

### D5 — Count Quotas
- [x] `articles` array length = exactly 4 — PRD §1.3 / §3.6.2 / news.schema.md Count Quotas
- [x] Mix of types: **≥1 `"company"` + ≥1 `"industry"`** (total 4 articles) — both types required so `news-list` Company / Industry sections each have content (design §5.11); "Latest News" 3-card block at `news-detail` bottom always yields exactly 3 cards (any type, excluding current article) — news.schema.md Count Quotas / PRD §3.6.2
- [x] Each article `body` ≥ 800 words — news.schema.md Count Quotas
- [x] Total articles = exactly 4 (≥1 company + ≥1 industry, any valid split); "Latest News" block picks the 3 most recent articles of any type excluding the current article, always yielding exactly 3 cards — news.schema.md §news-detail Template Rendering Logic

### D6 — Placeholder Alignment
- [x] `article.title` → `{{article.title}}` as H1 in `news-detail`; as card heading in `news-list` (design §5.11 / §5.12)
- [x] `article.type` → controls "Company News" vs "Industry News" section split in `news-list` (design §5.11 / PRD §3.6.1)
- [x] `article.date` → `{{article.date}}`; also `NewsArticle.datePublished` in JSON-LD (design §10)
- [x] `article.author` → `{{article.author}}` rendered as byline below headline in `news-detail` banner (design §5.12); also `NewsArticle.author.name` in JSON-LD (design §10)
- [x] `article.categoryTag` → `{{article.categoryTag}}` as badge on detail banner and list card (design §5.12 / §4.8)
- [x] `article.summary` → `{{article.summary}}` in news list card (design §5.11)
- [x] `article.metaDescription` → `{{article.metaDescription}}` in `<meta name="description">`
- [x] `article.bannerImage.src` → `{{article.bannerImage.src}}` as full-width header banner background (design §5.12)
- [x] `article.bannerImage.alt` → `{{article.bannerImage.alt}}`
- [x] `article.body` → `{{article.body}}` rendered in single-column centered `.article-content` (max-width 800px, no left sidebar per PRD C7 / design §5.12)
- [x] `article.share.url` → `{{article.share.url}}` as share link target; `article.share.title` → `{{article.share.title}}` encoded in share links (design §5.12 share bar)
- [x] JSON-LD: `NewsArticle` on `news-detail` pages using `article.title` (→ `headline`), `article.author` (→ `author.name`), `article.date` (→ `datePublished`), `article.metaDescription` (→ `description`), `article.bannerImage.src` (→ `image`), `site.brand.name` + `site.logo.src` (→ `publisher`); `BreadcrumbList` (`Home → News → <article.title>`) (design §10 / PRD §3.6.2)

### D7 — No Residual Stubs
- [ ] No `article.bannerImage.src` is empty or `"#"` — all have real SVG illustration paths (e.g., `"/assets/svg/illustrations/news-<slug>.svg"`) — **T8.2收尾核实**: paths are non-empty and real (not `"#"`), but all 4 articles share the identical generic `/assets/svg/illustrations/news-hero.svg` rather than per-slug illustrations as this line's example pattern implies. Same class of issue as the solutions.json shared-diagram exception (line 278) — already tracked in `dev-status.md` §6 "illustration-differentiation" (4 news + 4 support articles share one banner). Left unchecked pending that scope decision, not a new finding
- [x] `article.share.url` is a full absolute canonical URL (e.g., `"https://www.beiluo.com/news/<slug>/"`) — not a relative path or placeholder
- [x] No `article.body` contains `"lorem ipsum"`, `"TBD"`, or unfilled section headers
- [x] All `article.slug` values are URL-safe (lowercase, hyphens only, no spaces) and unique within the array

---

## 7. about.json

> Schema ref: `src/data/about.schema.md`  
> Count quotas: `history` ≥4 · `advantages` 3–5 · `cases` ≥4 · `customsDeclarations` ≥2 · `team` ≥1  
> Template: `about` (§5.13); JSON-LD: BreadcrumbList only (design §10)

### D1 — Field Completeness
- [x] Top-level keys present: `seo`, `intro`, `history`, `advantages`, `cases`, `customsDeclarations`, `team`
- [x] `seo` has: `seo.title`, `seo.description` (≤155 chars), `seo.canonical`
- [x] `intro` has: `intro.headline`, `intro.body` (≥100 words)
- [x] Each `HistoryEntry` has: `year`, `event`, `description` (≤50 words)
- [x] Each `AdvantageItem` has: `icon`, `title`, `description`
- [x] Each `ClientCase` has: `logoSvg`, `logoAlt`
- [x] Each `CustomsDoc` has: `title`, `imageSrc`, `alt`
- [x] Each `TeamMember` has: `slug`, `name`, `photo`, `photoAlt`, `role`, `expertise` (≤20 words), `profileHref`

### D2 — Pure English
- [x] `seo.title`, `seo.description`, `seo.canonical` are pure English (canonical is a URL path string)
- [x] `intro.headline` and `intro.body` (≥100 words) are pure English
- [x] All `HistoryEntry.event` and `HistoryEntry.description` are pure English
- [x] All `AdvantageItem.title` and `AdvantageItem.description` are pure English
- [x] All `ClientCase.logoAlt`, `CustomsDoc.alt`, `CustomsDoc.title` are pure English
- [x] All `TeamMember.name`, `TeamMember.role`, `TeamMember.expertise` are pure English

### D3 — Brand Differentiation
- [x] `intro.body` (≥100 words) reflects BeiLuo's genuine company story — founding year, location, growth trajectory, Infineon partnership, stock capacity, FAE team size — not generic distributor boilerplate per about.schema.md Brand Differentiation Notes
- [x] `HistoryEntry` items are specific and verifiable-sounding (year + concrete event such as a certification obtained or a milestone reached) — not vague entries like "Expanded our business"
- [x] `AdvantageItem.title` values are specific to BeiLuo's real capabilities — include quantities, certifications, or response times — avoiding generic phrases like "high quality" per about.schema.md
- [x] `CustomsDoc.title` and `CustomsDoc.alt` explicitly state "Infineon" + product category (e.g., "Infineon IGBT Import Declaration") — not generic "import document" strings per about.schema.md Brand Differentiation Notes

### D4 — Keyword Embedding
- [x] `seo.description` (≤155 chars) naturally contains `"Infineon authorized distributor"` + `"BeiLuo"` per about.schema.md §seo `seo.description` field and PRD §3.7
- [x] `intro.body` naturally embeds `"Infineon authorized distributor"`, `"Infineon stock"`, and `"BeiLuo"` per about.schema.md constraint and PRD §3.7
- [x] `intro.headline` contains `"Infineon Authorized Distributor"` or equivalent authoritative phrase per about.schema.md §intro `intro.headline` example
- [x] `AdvantageItem.title` values include Infineon-specific wording where relevant (e.g., `"Deep Infineon Inventory"`, `"Genuine Infineon Parts"`) per about.schema.md §advantages field examples

### D5 — Count Quotas
- [x] `history` array length ≥ 4 milestone entries, sorted chronologically — about.schema.md Count Quotas / PRD §3.7
- [x] `advantages` array length = 3–5 items — about.schema.md Count Quotas
- [x] `cases` array length ≥ 4 client logos or case snippets — about.schema.md Count Quotas / PRD §3.7
- [x] `customsDeclarations` array length ≥ 2 customs declaration documents — about.schema.md Count Quotas / PRD §3.7 ("报关单展示区（信任）")
- [x] `team` array length ≥ 1 FAE entry; every `team[].slug` matches an entry in `support.json authors[].slug` — about.schema.md §team cross-reference constraint

### D6 — Placeholder Alignment
- [x] `seo.title` → `{{seo.title}}`; `seo.description` → `{{seo.description}}`; `seo.canonical` → `{{seo.canonical}}`
- [x] `intro.headline` → `{{intro.headline}}` as page H1 (design §5.13)
- [x] `intro.body` → `{{intro.body}}` as hero paragraph (design §5.13)
- [x] `intro.heroSvgSrc` (if provided) → `{{intro.heroSvgSrc}}`; `intro.heroSvgAlt` → `{{intro.heroSvgAlt}}`
- [x] `history` → `{{history}}` loop in timeline section; `{{entry.year}}` as timeline node label; `{{entry.event}}` as timeline heading; `{{entry.description}}` as body text (design §5.13)
- [x] `advantages` → `{{advantages}}` loop in Feature Grid (3–5 columns desktop); `{{item.icon}}`; `{{item.title}}` as H3; `{{item.description}}` (design §5.13)
- [x] `cases` → `{{cases}}` loop in client logo wall; `{{case.logoSvg}}` as `<img src>`; `{{case.logoAlt}}`; `{{case.companyName}}` below logo if present (design §5.13)
- [x] `customsDeclarations` → `{{customsDeclarations}}` loop in trust section; `{{doc.title}}` as caption; `{{doc.imageSrc}}` as `<img src>`; `{{doc.alt}}` (design §5.13 / PRD §3.7 "报关单展示区（信任）")
- [x] `team` → `{{team}}` loop in team/FAE section; `{{member.name}}`; `{{member.photo}}` as `<img src>`; `{{member.photoAlt}}`; `{{member.role}}`; `{{member.expertise}}`; `{{member.profileHref}}` on "View Profile" link (design §5.13 / §5.15 E-E-A-T chain)
- [x] `cta.headline` (if provided) → `{{cta.headline}}`; `cta.label` → `{{cta.label}}`; `cta.href` → `{{cta.href}}` on page-bottom CTA band
- [x] JSON-LD: `BreadcrumbList` only on about page (`Home → About Us`) per about.schema.md §JSON-LD (design §10)

### D7 — No Residual Stubs
- [x] No `CustomsDoc.imageSrc` is empty or generic — each follows the pattern `"/assets/svg/illustrations/customs-<slug>.svg"`
- [x] Every `team[].profileHref` follows the pattern `"/about/authors/<slug>/"` and each slug matches a real `Author` entry in `support.json`
- [x] No `intro.body`, `HistoryEntry.description`, or `AdvantageItem.description` contains `"lorem ipsum"`, `"TBD"`, or `"placeholder"` text
- [x] `seo.canonical` = exactly `"/about/"` — not a template placeholder string (about.schema.md §seo `seo.canonical` field)

---

*Generated by T0.6 — documentation only. Tick all 49 items per file (7 files × 7 dimensions) before Phase 4 JSON authoring is considered complete.*

---

## T8.2 Close-Out Sweep (2026-07-08)

A 7-parallel-agent audit against the actual `src/data/*.json` files (one agent per file, all D1–D7 dimensions each, cross-referenced against templates/pages.js/dist output) found and fixed 14 real defects across 6 review-and-Codex-rechecked batches: news.json share.title/keyword gaps (587a409), solutions.json word-count shortfall (fff8784), 3 product-category template-layer gaps — H1/description-paragraphs/sidebar-icon (a3003d1), home.json dead-field cleanup (f92df8e), site.json orphan-field cleanup + seo.baseUrl build.js wiring + regression test (d3e6ece), and 3 brand-copy rewrites with a Codex-caught factual year error corrected mid-batch (29666c2).

**287/294 items verified passing.** 7 items intentionally left unchecked with inline "T8.2收尾核实" notes (same convention as check_list1.md's T8.1 close-out):

- **1 genuine content gap, not just a documentation/interpretation issue**: products.json FAQ brand-voice coverage is uneven per model (`IKD06N60RF` has only 1/5 branded answers) — worth a real content fix in a future pass, not just a checklist-wording dispute.
- **6 already-known, pre-existing gaps or stale-wording items, not newly introduced by this sweep**: solutions.json BOM anchor field-name drift, solutions.json shared diagram SVG, support.json tag-badge display text, support.json internalLinks validation gap, home.json `newsTeaser.type` display wording (stale relative to the `home.schema.md` note added in batch 4), and news.json shared banner illustration (same "illustration-differentiation" backlog item as the solutions.json shared diagram).

See each item's inline note for detail and the recommended next step. This tick-off went through two correction rounds before being considered complete: an independent review pass caught 2 items the first pass had incorrectly marked done (`newsTeaser.type`, news banner), and Codex's read-only recheck caught an inaccurate claim in the products.json FAQ note itself ("every model has ≥2 branded answers" — false, corrected after directly re-counting against the raw data).

`npm test`: 367/367 passing (was 365; +2 from the buildSite() baseUrl regression test). `node src/build.js`: exit 0.
