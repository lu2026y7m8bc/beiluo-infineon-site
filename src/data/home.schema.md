# home.schema.md — Homepage Data Schema

> **Source file**: `src/data/home.json`
> **Template**: `home` (design §5.1)
> **JSON-LD**: `Organization` + `WebSite` — injected on this page only (design §10).
> **Constraint**: All values **pure English**. Content must naturally embed `"infineon distributor"`, `"Infineon authorized distributor"`, `"Infineon stock"` without keyword stuffing (PRD §3.2, §1.1).

---

## Count Quotas

| Section | Quota |
|---------|-------|
| `whyChooseUs` items | 3–4 feature items |
| `productsTeaser` cards | 4 (one per category: MCU / IGBT / MOSFET / Sensors) |
| `solutionsTeaser` cards | 3 featured solutions |
| `supportTeaser` cards | 3 latest support articles |
| `newsTeaser` cards | 3 latest news articles |
| `hero.trustBadges` | 3 items (ISO / 10+ yrs / Global Logistics) |

---

## Top-Level Fields

| Field | Type | Required | Meaning | Template Placeholder |
|-------|------|----------|---------|---------------------|
| `seo` | Object | Required | Page-level SEO meta (overrides site.json defaults) | `{{seo.title}}`, `{{seo.description}}`, `{{seo.canonical}}` in `<head>` |
| `hero` | Object | Required | Full-width hero banner section | `{{hero.*}}` block in home template |
| `whyChooseUs` | Array\<FeatureItem\> | Required | "Why Choose Us" feature grid (3–4 columns) | `{{whyChooseUs}}` loop |
| `productsTeaser` | Array\<ProductTeaserCard\> | Required | 4 product category cards grid | `{{productsTeaser}}` loop |
| `solutionsTeaser` | Array\<SolutionTeaserCard\> | Required | 3 featured solution cards | `{{solutionsTeaser}}` loop |
| `supportTeaser` | Array\<SupportTeaserCard\> | Required | 3 latest support article cards | `{{supportTeaser}}` loop |
| `newsTeaser` | Array\<NewsTeaserCard\> | Required | 3 latest news article cards | `{{newsTeaser}}` loop |
| `finalCta` | Object | Required | Bottom CTA band (full-width, orange or dark bg) | `{{finalCta.*}}` block |

---

## `seo` Object (page-level override)

| Field | Type | Required | Meaning | Placeholder |
|-------|------|----------|---------|-------------|
| `seo.title` | String | Required | Page `<title>`: `"Infineon Distributor | BeiLuo"` | `{{seo.title}}` |
| `seo.description` | String | Required | Meta description ≤155 chars; must contain `"infineon distributor"` + `"BeiLuo"` | `{{seo.description}}` |
| `seo.canonical` | String | Required | Canonical URL: `"/"` or full URL | `{{seo.canonical}}` |

---

## `hero` Object

| Field | Type | Required | Meaning | Placeholder / JSON-LD |
|-------|------|----------|---------|----------------------|
| `hero.headline` | String | Required | H1 text: e.g., `"Your Trusted Infineon Distributor"` | `{{hero.headline}}` — must be a single H1 per WCAG/PRD §4.1 |
| `hero.subText` | String | Required | Sub-headline / lead paragraph (≤50 words, brand-differentiated) | `{{hero.subText}}` |
| `hero.ctaPrimary` | Object | Required | Orange CTA button (design §4.6 Primary CTA style) | `{{hero.ctaPrimary.label}}`, `{{hero.ctaPrimary.href}}` |
| `hero.ctaPrimary.label` | String | Required | Button label: e.g., `"Get a Quote"` | |
| `hero.ctaPrimary.href` | String | Required | e.g., `"/contact/"` — no empty `#` (iron rule §9 #2) | |
| `hero.ctaSecondary` | Object | Required | Secondary ghost/text CTA | `{{hero.ctaSecondary.label}}`, `{{hero.ctaSecondary.href}}` |
| `hero.ctaSecondary.label` | String | Required | e.g., `"Browse Products"` | |
| `hero.ctaSecondary.href` | String | Required | e.g., `"/products/"` | |
| `hero.bgSvgSrc` | String | Required | Path to abstract circuit-board background SVG: `"/assets/svg/backgrounds/hero-circuit.svg"` | `{{hero.bgSvgSrc}}` as background or `<img>` with decorative alt |
| `hero.bgSvgAlt` | String | Optional | Alt text for hero background SVG. Decorative-only background: use `alt=""` or `role="presentation"` — empty string is allowed and correct for purely decorative images. If the SVG carries meaningful content, provide a descriptive alt. | `{{hero.bgSvgAlt}}` |
| `hero.trustBadges` | Array\<TrustBadge\> | Required | 3 trust indicators below CTA buttons | `{{hero.trustBadges}}` loop |

### `TrustBadge` Shape

| Field | Type | Required | Meaning |
|-------|------|----------|---------|
| `icon` | String | Required | SVG icon path (e.g., `"/assets/svg/badges/iso.svg"`) |
| `label` | String | Required | Short label: e.g., `"ISO Certified"`, `"10+ Years"`, `"Global Logistics"` |

---

## `whyChooseUs` Array\<FeatureItem\>

3–4 items. Each maps to a card in the Feature Grid (design §5.1, 3–4 columns desktop).

| Field | Type | Required | Meaning | Placeholder |
|-------|------|----------|---------|-------------|
| `icon` | String | Required | SVG icon path: `"/assets/svg/icons/<name>.svg"` | `{{item.icon}}` |
| `title` | String | Required | Feature heading (e.g., `"Deep Inventory"`) | `{{item.title}}` as H3 |
| `description` | String | Required | 1–2 sentence description (pure English, brand-differentiated) | `{{item.description}}` |

> Topics (design §5.1): stock depth / FAE technical support / logistics / genuine products.

---

## `productsTeaser` Array\<ProductTeaserCard\>

Exactly 4 cards, one per product category (MCU / IGBT / MOSFET / Sensors). Data may be cross-referenced from `products.json` categories at build time, or duplicated here for self-containment.

| Field | Type | Required | Meaning | Placeholder |
|-------|------|----------|---------|-------------|
| `slug` | String | Required | Category slug: `"mcu"` / `"igbt"` / `"mosfet"` / `"sensors"` | Used to build `href` |
| `name` | String | Required | Display name: `"MCU"` / `"IGBT"` / `"MOSFET"` / `"Sensors"` | `{{card.name}}` as H3 |
| `icon` | String | Required | SVG icon path: `"/assets/svg/icons/<category>.svg"` | `{{card.icon}}` in card |
| `summary` | String | Required | ≤30-word category teaser (brand-differentiated, contains keyword like `"Infineon MCU"`) | `{{card.summary}}` |
| `href` | String | Required | `"/products/<slug>/"` | `{{card.href}}` on "View Models →" link |

---

## `solutionsTeaser` Array\<SolutionTeaserCard\>

3 featured solution cards (subset of `solutions.json`).

| Field | Type | Required | Meaning | Placeholder |
|-------|------|----------|---------|-------------|
| `slug` | String | Required | Solution slug (matches `solutions.json`) | Used to build `href` |
| `title` | String | Required | Solution title | `{{card.title}}` as H3 |
| `industry` | String | Required | Industry tag (e.g., `"Motor Drive"`) | `{{card.industry}}` as badge |
| `summary` | String | Required | ≤40-word excerpt | `{{card.summary}}` |
| `href` | String | Required | `"/solutions/<slug>/"` | `{{card.href}}` |
| `icon` | String | Optional | Illustration SVG path | `{{card.icon}}` |

---

## `supportTeaser` Array\<SupportTeaserCard\>

3 latest support article cards (subset of `support.json`).

| Field | Type | Required | Meaning | Placeholder |
|-------|------|----------|---------|-------------|
| `slug` | String | Required | Article slug | Used to build `href` |
| `category` | String | Required | Category slug (guides / application-notes / troubleshooting / reviews) | not rendered directly (see `categoryLabel`) |
| `categoryLabel` | String | Required | Human-readable category name matching `support.json`'s `categories[].name` (e.g. "Selection Guides") — added so the badge doesn't show the raw slug | `{{card.categoryLabel}}` as badge |
| `title` | String | Required | Article title | `{{card.title}}` as H3 |
| `summary` | String | Required | ≤40-word excerpt | `{{card.summary}}` |
| `date` | String | Required | ISO 8601 date: `"2024-03-15"` | `{{card.date}}` |
| `href` | String | Required | `"/support/<category>/<slug>/"` | `{{card.href}}` |

---

## `newsTeaser` Array\<NewsTeaserCard\>

3 latest news article cards (subset of `news.json`).

| Field | Type | Required | Meaning | Placeholder |
|-------|------|----------|---------|-------------|
| `slug` | String | Required | News article slug | Used to build `href` |
| `type` | String | Required | `"company"` or `"industry"` — data-only classification, retained for potential future filtering/routing logic; not rendered directly (see `categoryTag` for the display badge) | not rendered directly (see `categoryTag`) |
| `title` | String | Required | News headline | `{{card.title}}` as H3 |
| `date` | String | Required | ISO 8601 date | `{{card.date}}` |
| `categoryTag` | String | Required | Display tag: e.g., `"Industry News"` | `{{card.categoryTag}}` |
| `href` | String | Required | `"/news/<slug>/"` | `{{card.href}}` |
| `coverSvgSrc` | String | Optional | Illustration SVG for card thumbnail | `{{card.coverSvgSrc}}` |

---

## `finalCta` Object

Full-width band at page bottom (orange or dark background, design §5.1).

| Field | Type | Required | Meaning | Placeholder |
|-------|------|----------|---------|-------------|
| `headline` | String | Required | Section H2 (e.g., `"Ready to Source Infineon Components?"`) | `{{finalCta.headline}}` |
| `subText` | String | Optional | Supporting text (≤30 words) | `{{finalCta.subText}}` |
| `ctaLabel` | String | Required | Button label: e.g., `"Contact Sales"` | `{{finalCta.ctaLabel}}` |
| `ctaHref` | String | Required | e.g., `"/contact/"` | `{{finalCta.ctaHref}}` |
| `bgStyle` | String | Optional | CSS class hint: `"bg-cta-orange"` or `"bg-dark"` — build.js applies the class | `{{finalCta.bgStyle}}` |

---

## JSON-LD Mapping (home page only — design §10)

| Schema Type | Fields Populated From |
|-------------|----------------------|
| `Organization` | `site.brand.name`, `site.logo`, `site.contact`, `site.jsonLd.*`, `site.seo.baseUrl` |
| `WebSite` | `site.seo.baseUrl`, `site.brand.name` |

> No additional home.json fields are needed for JSON-LD; all structured data is derived from `site.json`.
