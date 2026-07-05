# solutions.schema.md — Solutions Data Schema

> **Source file**: `src/data/solutions.json`
> **Templates used**:
>   - `solutions-list` (§5.5) — solutions landing page with solution cards
>   - `solution-detail` (§5.6) — individual solution detail page with sidebar
> **JSON-LD**: `BreadcrumbList` on detail pages (no dedicated Solution Schema type per design §10 note; BreadcrumbList is sufficient per spec).
> **Constraint**: All values **pure English**. Body text ≥800 words per solution. Content must be **brand-differentiated** — original industry insight, not copied from chip vendor application notes.

---

## Count Quotas (PRD §1.3, §3.4)

| Item | Quota |
|------|-------|
| `solutions` array length | **5** (milestone acceptance: ≥4) |
| `body` word count per solution | **≥800 words** |
| `bomList` items per solution | ≥3 BOM entries with internal links to product pages |
| `advantages` items | 3–5 bullet points |
| `related` items in sidebar | 3–5 (mix of related solutions and products) |

---

## Top-Level Structure

```
solutions.json
└── solutions: Array<Solution>   // 5 entries
```

---

## `Solution` Object

| Field | Type | Required | Meaning | Template Placeholder / JSON-LD |
|-------|------|----------|---------|-------------------------------|
| `slug` | String | Required | URL segment: e.g., `"bldc-motor-drive"` | URL: `/solutions/<slug>/`; breadcrumb; `BreadcrumbList.item.id` |
| `title` | String | Required | Solution page H1: e.g., `"BLDC Motor Drive Solution with Infineon IGBT"` (keyword-rich, unique per solution) | `{{solution.title}}` as H1; `<title>` tag |
| `metaDescription` | String | Required | Meta description ≤155 chars, contains industry keyword + `"Infineon"` + BeiLuo context | `{{solution.metaDescription}}` in `<meta name="description">` |
| `summary` | String | Required | ≤60-word card summary shown on list page and home teaser (contains core keyword for GEO) | `{{solution.summary}}` in solution card on `solutions-list` and `solutionsTeaser` on home |
| `industry` | String | Required | Industry tag label: e.g., `"Motor Drive"`, `"EV Charging"`, `"Solar PV"`, `"Industrial Automation"`, `"Home Appliance"` | `{{solution.industry}}` as badge on list card and detail header |
| `diagramSrc` | String | Required | System block diagram SVG path (ideally per-slug, e.g. `"/assets/svg/illustrations/bd-<slug>.svg"` — all 5 solutions currently share the same generic `solution-diagram.svg` pending distinct diagram assets, tracked in dev-status.md §6.E) | `{{solution.diagramSrc}}` as `<img src>` in first H2 section (design §5.6) |
| `diagramAlt` | String | Required | Detailed alt text describing all blocks and connections (for accessibility + SEO + GEO) — ≥40 words | `{{solution.diagramAlt}}` |
| `advantages` | Array\<String\> | Required | 3–5 bullet-point advantage statements (H2 "Core Advantages" section, design §5.6) | `{{solution.advantages}}` loop as `<li>` items |
| `bomList` | Array\<BomEntry\> | Required | Recommended Bill of Materials — ≥3 Infineon parts with internal links (PRD §3.4.2) | `{{solution.bomList}}` loop in BOM table (design §5.6) |
| `scenarios` | String | Required | "Application Scenarios" section prose (≥150 words, H2 section) describing real-world use cases | `{{solution.scenarios}}` as rich text block |
| `body` | String | Required | Full solution article body HTML/Markdown (**≥800 words** total including scenarios and analysis; H2/H3 structured; brand-differentiated, cites specific Infineon series) | `{{solution.body}}` rendered as article content |
| `related` | Array\<RelatedItem\> | Required | 3–5 related items for sidebar (related solutions and/or key products) | `{{solution.related}}` loop in sidebar (design §5.6) |
| `ctaLabel` | String | Optional | Closing CTA button label: e.g., `"Get BOM Quote"` (default `"Get a Quote"` if omitted) | `{{solution.ctaLabel}}` on closing CTA (design §5.6) |
| `ctaHref` | String | Optional | CTA target: e.g., `"/contact/"` | `{{solution.ctaHref}}` |
| `coverSvgSrc` | String | Optional | Illustration SVG for list card thumbnail | `{{solution.coverSvgSrc}}` |
| `coverSvgAlt` | String | Optional | Alt text for cover illustration | `{{solution.coverSvgAlt}}` |

---

## `BomEntry` Object

Each BOM entry is an Infineon component that links to its product detail page (internal link — GEO + internal link juice, PRD §3.4.2).

| Field | Type | Required | Meaning | Placeholder |
|-------|------|----------|---------|-------------|
| `partNo` | String | Required | Infineon part number: e.g., `"IKW40N120H3"` | `{{bom.partNo}}` as table cell |
| `description` | String | Required | Component role description: e.g., `"600V IGBT — main switching device"` | `{{bom.description}}` |
| `link` | String | Required | Internal link to product detail page: `"/products/igbt/ikw40n120h3/"` (no empty links — iron rule §9 #2) | `{{bom.link}}` on part number anchor |
| `qty` | String | Optional | Quantity per unit: e.g., `"1"`, `"2"`, `"6"` | `{{bom.qty}}` in Qty column |

---

## `RelatedItem` Object (sidebar)

| Field | Type | Required | Meaning | Placeholder |
|-------|------|----------|---------|-------------|
| `type` | String | Required | `"solution"` / `"product"` / `"support"` — determines icon and link pattern | `{{item.type}}` |
| `title` | String | Required | Display title of the related page | `{{item.title}}` |
| `href` | String | Required | Internal URL — no empty links | `{{item.href}}` |

---

## JSON-LD Mapping

### `solutions-list` template

| Schema Type | Data Source |
|-------------|------------|
| `BreadcrumbList` | Auto-built: `Home → Solutions` (`Home` = `"/"`, `Solutions` = `"/solutions/"`) |

### `solution-detail` template (design §10)

| Schema Type | Data Source |
|-------------|------------|
| `BreadcrumbList` | Auto-built by `render.js` from `Home → Solutions → <solution.title>` |
| Breadcrumb items | `item[0]` = `"/"` ("Home"), `item[1]` = `"/solutions/"` ("Solutions"), `item[2]` = `"/solutions/<slug>/"` (`solution.title`) |

> Note (design §5.6, §10): Solution detail does not add a dedicated `HowTo`, `Article`, or other type beyond BreadcrumbList — this avoids introducing unsupported Schema types per the spec note "不引入超范围 Schema."

---

## Content Quotas and Keyword Requirements (PRD §3.4, §1.1)

| Requirement | Spec |
|-------------|------|
| Total solutions | 5 (milestone ≥4) |
| `body` minimum | ≥800 words per solution |
| BOM internal links | All `bomList[].link` must resolve to existing product detail pages |
| Industry keyword | Each `title` and `summary` must embed industry-specific keyword + "Infineon" + distributor context |
| `body` structure | Must contain H2 sections: Block Diagram intro / Core Advantages / Recommended BOM / Application Scenarios + narrative |
| Brand differentiation | Original engineering analysis, not copied from Infineon official application notes |

---

## Suggested Solution Slugs (PRD §3.4, aligned with 5 target industries)

| # | Slug | Industry |
|---|------|----------|
| 1 | `bldc-motor-drive` | Motor Drive |
| 2 | `ev-onboard-charger` | EV Charging |
| 3 | `solar-string-inverter` | Solar PV |
| 4 | `industrial-plc-control` | Industrial Automation |
| 5 | `home-appliance-inverter` | Home Appliance |

> These are suggested slugs based on PRD §3.4 + typical Infineon application domains. Actual slugs may differ during T4.x data population.
