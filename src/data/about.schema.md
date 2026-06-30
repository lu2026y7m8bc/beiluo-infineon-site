# about.schema.md — About Us Data Schema

> **Source file**: `src/data/about.json`
> **Templates used**:
>   - `about` (§5.13) — About Us page with modular sections
>   - Author profile page (§5.15) — `/about/authors/<slug>/` — **reuses `about` template** (data-driven lightweight variant, no new template)
> **JSON-LD**: `BreadcrumbList` only on this page (no dedicated `AboutPage` Schema type in scope).
> **Constraint**: All values **pure English**. Content must naturally embed `"Infineon authorized distributor"`, `"Infineon stock"`, `"BeiLuo"` (PRD §3.7). Brand-differentiated content — genuine company story, not generic distributor boilerplate. Trust signals must be prominent (PRD §1 Trust-first principle, design §5.13).

---

## Count Quotas (PRD §3.7, design §5.13)

| Section | Quota |
|---------|-------|
| `history` timeline entries | ≥4 milestones (year + event) |
| `advantages` items | 3–5 feature items |
| `cases` (client logo/case) | ≥4 client logos or case snippets |
| `customsDeclarations` | ≥2 customs declaration images (trust proof) |
| `team` FAE entries | ≥1 (links to author profile pages in `/about/authors/`) |

---

## Top-Level Fields

| Field | Type | Required | Meaning | Template Placeholder |
|-------|------|----------|---------|---------------------|
| `seo` | Object | Required | Page-level SEO meta | `{{seo.title}}`, `{{seo.description}}`, `{{seo.canonical}}` |
| `intro` | Object | Required | Hero section + company intro paragraph | `{{intro.*}}` block |
| `history` | Array\<HistoryEntry\> | Required | Company development timeline | `{{history}}` loop in timeline section |
| `advantages` | Array\<AdvantageItem\> | Required | Key advantages Feature Grid (design §5.13) | `{{advantages}}` loop in Feature Grid section |
| `cases` | Array\<ClientCase\> | Required | Client case / logo wall section | `{{cases}}` loop in logo wall |
| `customsDeclarations` | Array\<CustomsDoc\> | Required | Customs declaration display area (trust proof — design §1, §5.13) | `{{customsDeclarations}}` loop in trust section |
| `team` | Array\<TeamMember\> | Required | Team / FAE entry section with links to author profile pages | `{{team}}` loop in team section |
| `cta` | Object | Optional | Page-bottom CTA section | `{{cta.*}}` in closing CTA band |

---

## `seo` Object

| Field | Type | Required | Meaning | Placeholder |
|-------|------|----------|---------|-------------|
| `seo.title` | String | Required | `<title>`: e.g., `"About BeiLuo — Infineon Authorized Distributor"` | `{{seo.title}}` |
| `seo.description` | String | Required | Meta description ≤155 chars; must contain `"Infineon authorized distributor"` + `"BeiLuo"` | `{{seo.description}}` |
| `seo.canonical` | String | Required | `"/about/"` | `{{seo.canonical}}` |

---

## `intro` Object

Hero section + company introduction.

| Field | Type | Required | Meaning | Placeholder |
|-------|------|----------|---------|-------------|
| `intro.headline` | String | Required | Page H1: e.g., `"About BeiLuo — Your Trusted Infineon Authorized Distributor"` | `{{intro.headline}}` as H1 |
| `intro.body` | String | Required | Company intro prose (≥100 words, pure English, brand-differentiated; naturally embeds `"Infineon authorized distributor"`, `"Infineon stock"`, BeiLuo's unique story) | `{{intro.body}}` as hero paragraph |
| `intro.heroSvgSrc` | String | Optional | Hero illustration SVG path: `"/assets/svg/illustrations/about-hero.svg"` | `{{intro.heroSvgSrc}}` |
| `intro.heroSvgAlt` | String | Optional | Alt text for hero SVG | `{{intro.heroSvgAlt}}` |

---

## `history` Array\<HistoryEntry\>

Timeline section (design §5.13). ≥4 milestone entries sorted chronologically.

| Field | Type | Required | Meaning | Placeholder |
|-------|------|----------|---------|-------------|
| `year` | String | Required | Year label: e.g., `"2014"` | `{{entry.year}}` as timeline node label |
| `event` | String | Required | Milestone title: e.g., `"Founded in Shenzhen"` | `{{entry.event}}` as timeline heading |
| `description` | String | Required | 1–2 sentence expansion (≤50 words, brand-differentiated) | `{{entry.description}}` as timeline body text |

---

## `advantages` Array\<AdvantageItem\>

Feature Grid section (3–5 columns desktop, design §5.13). Highlights BeiLuo's core differentiators.

| Field | Type | Required | Meaning | Placeholder |
|-------|------|----------|---------|-------------|
| `icon` | String | Required | SVG icon path: `"/assets/svg/icons/<name>.svg"` | `{{item.icon}}` in feature card |
| `title` | String | Required | Advantage title: e.g., `"Deep Infineon Inventory"`, `"Expert FAE Support"`, `"Fast Global Logistics"` | `{{item.title}}` as H3 in feature card |
| `description` | String | Required | 2–3 sentence description (pure English, specific — avoid generic claims) | `{{item.description}}` as card body |

> Topics (PRD §3.7): stock depth, technical support, logistics, genuine products (Infineon authorized distributor status).

---

## `cases` Array\<ClientCase\>

Client logo wall or case snippets (design §5.13, PRD §3.7). Demonstrates trust through client diversity.

| Field | Type | Required | Meaning | Placeholder |
|-------|------|----------|---------|-------------|
| `logoSvg` | String | Required | Client/industry logo SVG path: `"/assets/svg/illustrations/client-<slug>.svg"` (use generic industry icon if specific client logo not available) | `{{case.logoSvg}}` |
| `logoAlt` | String | Required | Alt text: e.g., `"Manufacturing client — BeiLuo Infineon distributor partner"` | `{{case.logoAlt}}` |
| `companyName` | String | Optional | Company or industry category name: e.g., `"EV Manufacturer"`, `"Industrial Automation OEM"` | `{{case.companyName}}` below logo |
| `description` | String | Optional | 1-sentence case note (≤20 words) | `{{case.description}}` |

---

## `customsDeclarations` Array\<CustomsDoc\>

Customs declaration documents display (PRD §3.7: "报关单展示区（信任）"). Core trust signal proving genuine Infineon sourcing.

| Field | Type | Required | Meaning | Placeholder |
|-------|------|----------|---------|-------------|
| `title` | String | Required | Display title for this declaration: e.g., `"Infineon IGBT Import Declaration — 2024 Q1"` | `{{doc.title}}` as caption |
| `imageSrc` | String | Required | Path to declaration image (SVG placeholder or actual scan): `"/assets/svg/illustrations/customs-<slug>.svg"` | `{{doc.imageSrc}}` as `<img src>` |
| `alt` | String | Required | Alt text describing the customs document for accessibility + SEO: e.g., `"BeiLuo customs declaration for Infineon IGBT import"` | `{{doc.alt}}` |
| `date` | String | Optional | Declaration date or period: e.g., `"2024-Q1"` | `{{doc.date}}` as subtitle |
| `productCategory` | String | Optional | What product category this declaration covers: e.g., `"Infineon IGBT"` | `{{doc.productCategory}}` |

---

## `team` Array\<TeamMember\>

Team / FAE section (design §5.13, §5.15). Each entry links to the author profile page at `/about/authors/<slug>/`. The `slug` must match an entry in `support.json authors[]`.

| Field | Type | Required | Meaning | Placeholder |
|-------|------|----------|---------|-------------|
| `slug` | String | Required | Author slug matching `support.json authors[].slug` | Used to build `profileHref` |
| `name` | String | Required | FAE full name (pure English transliteration) | `{{member.name}}` in team card |
| `photo` | String | Required | Photo SVG path: `"/assets/svg/illustrations/author-<slug>.svg"` | `{{member.photo}}` as `<img src>` |
| `photoAlt` | String | Required | Alt text: e.g., `"Li Wei — BeiLuo FAE Engineer"` | `{{member.photoAlt}}` |
| `role` | String | Required | Job role: e.g., `"Field Application Engineer (FAE)"` | `{{member.role}}` in card subtitle |
| `expertise` | String | Required | Technical specialization (≤20 words) | `{{member.expertise}}` in card |
| `profileHref` | String | Required | Author profile URL: `"/about/authors/<slug>/"` | `{{member.profileHref}}` on "View Profile" link |

---

## `cta` Object (page-bottom CTA)

| Field | Type | Required | Meaning | Placeholder |
|-------|------|----------|---------|-------------|
| `cta.headline` | String | Optional | CTA section heading: e.g., `"Partner with BeiLuo — Your Trusted Infineon Authorized Distributor"` | `{{cta.headline}}` |
| `cta.label` | String | Optional | CTA button label: e.g., `"Get a Quote"` | `{{cta.label}}` |
| `cta.href` | String | Optional | CTA link target: `"/contact/"` | `{{cta.href}}` |

---

## Author Profile Page Schema (§5.15 — reuses `about` template)

The author profile page at `/about/authors/<slug>/` is generated from `support.json authors[]` (not from `about.json`). The `about` template is invoked with a lightweight variant data object containing only the author-relevant fields.

> **Data source for author pages**: `support.json authors[]` (see `support.schema.md`).
> **Template**: `about` — build.js detects the `authorProfile: true` flag in the page context and renders only the author variant layout.
> **Breadcrumb**: `Home → About Us → <author.name>`.
> **Content**: FAE photo / name / expertise / experience + list of articles authored (derived from `support.json articles[]` filtered by `author === slug`).

No additional fields in `about.json` are needed for author pages — all data comes from `support.json`.

---

## JSON-LD Mapping

### `about` template

| Schema Type | Data Source |
|-------------|------------|
| `BreadcrumbList` | `Home → About Us` |

### Author Profile Page `/about/authors/<slug>/`

| Schema Type | Data Source |
|-------------|------------|
| `BreadcrumbList` | `Home → About Us → <author.name>` |
| `Person` (optional, encouraged for E-E-A-T) | `author.name`, `author.profileHref`, `author.expertise` |

---

## Brand Differentiation Notes

- `intro.body` must reflect BeiLuo's genuine story — founding year, location, growth, Infineon partnership, stock capacity, FAE team size.
- `history` entries should be specific and verifiable-sounding (avoid vague entries like "Expanded our business").
- `advantages` titles must avoid generic phrases; be specific: quantities, certifications, response times.
- `customsDeclarations` are a **key trust signal** (PRD §3.7, design §1 "Trust-first") — titles and alts must clearly state "Infineon" + product type.
- `team` FAE entries create the E-E-A-T chain: About page → author profile → support articles (PRD §3.9).
