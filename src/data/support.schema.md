# support.schema.md — Technical Support Data Schema

> **Source file**: `src/data/support.json`
> **Templates used**:
>   - `support-list` (§5.7) — support overview with 4-tab category preview
>   - `support-list` (reused, §5.8) — 4 category index pages (`/support/<category>/`)
>   - `support-list` (reused, §5.9) — tag aggregation pages (`/support/tags/<tag>/`)
>   - `tech-detail` (§5.10) — individual support article detail with Sticky TOC + sidebar
>   - Author page (§5.15) — FAE author profile page (reuses `about` template, data-driven)
> **JSON-LD**:
>   - `TechArticle` → `tech-detail` pages (design §10, PRD §3.5.4)
>   - `BreadcrumbList` → all non-home pages
> **Constraint**: All values **pure English**. Body text ≥800 words per article. Articles must embed model internal links (≥1 model link + ≥1 concept link per article). **E-E-A-T**: author must be real FAE with name/expertise (PRD §3.9).

---

## Count Quotas (PRD §1.3, §3.5)

| Item | Quota |
|------|-------|
| `categories` array length | **4** (guides / application-notes / troubleshooting / reviews) |
| `articles` detail pages | **4** (each covering a different category) |
| `authors` | ≥1 FAE author (each article must have an author) |
| `tags` | Auto-derived from articles — each unique tag gets a `/support/tags/<slug>/` page |
| `articles[].internalLinks` | ≥1 model link + ≥1 concept link per article (PRD §3.5.4) |
| `articles[].relatedArticles` | 3–5 related article slugs per article |
| `body` H2/H3 `id` attributes | Every H2/H3 in `body` must carry a unique `id` — `toc.js` auto-generates the TOC at runtime; TOC is **not stored in the JSON** (markup-contract §3) |
| `articles[].faq` (optional) | 0 or more — encouraged for GEO |
| `body` word count | ≥800 words per article |

---

## Top-Level Structure

```
support.json
├── categories: Array<SupportCategory>   // exactly 4
├── tags: Array<Tag>                      // one entry per unique tag across all articles
├── authors: Array<Author>               // ≥1 FAE author
└── articles: Array<Article>             // exactly 4 detail articles (one per category)
```

---

## `SupportCategory` Object

Used to build the 4 category index pages (`/support/<category>/`) and tab labels on `support-list`.

| Field | Type | Required | Meaning | Template Placeholder |
|-------|------|----------|---------|---------------------|
| `slug` | String | Required | URL segment: `"guides"` / `"application-notes"` / `"troubleshooting"` / `"reviews"` | URL: `/support/<slug>/`; tab `id`; breadcrumb |
| `name` | String | Required | Tab/heading label: e.g., `"Selection Guides"`, `"Application Notes"`, `"Troubleshooting"`, `"New Product Reviews"` | `{{category.name}}` as tab label and H1 on category index page |
| `title` | String | Required | SEO H1 for category index page (keyword-rich, unique): e.g., `"Infineon Selection Guides — Technical Resources"` | `{{category.title}}` as H1 |
| `metaDescription` | String | Required | Meta description ≤155 chars for category index page | `{{category.metaDescription}}` |
| `description` | String | Optional | Short paragraph (≤80 words) introducing the category on its index page | `{{category.description}}` |

---

## `Tag` Object

One entry per unique technology/product tag. Auto-generated tag pages live at `/support/tags/<slug>/`.

| Field | Type | Required | Meaning | Template Placeholder |
|-------|------|----------|---------|---------------------|
| `slug` | String | Required | URL-safe tag slug: e.g., `"igbt"`, `"aurix"`, `"bldc-motor"`, `"can-bus"`, `"mosfet"` | URL: `/support/tags/<slug>/` |
| `name` | String | Required | Display label: e.g., `"IGBT"`, `"AURIX"`, `"BLDC Motor"`, `"CAN Bus"` | `{{tag.name}}` as tag badge label |

> Tag aggregation pages reuse the `support-list` template. H1 renders as: `Articles tagged "<tag.name>"`.
> Tags array must be exhaustive — every tag referenced in any article's `tags[]` must have a corresponding entry here.

---

## `Author` Object

FAE author profile — drives both the `tech-detail` author bar and the `/about/authors/<slug>/` profile page (design §5.15, PRD §3.9). Supports E-E-A-T.

| Field | Type | Required | Meaning | Template Placeholder / JSON-LD |
|-------|------|----------|---------|-------------------------------|
| `slug` | String | Required | URL segment: e.g., `"li-wei"` | URL: `/about/authors/<slug>/`; `TechArticle.author.url` |
| `name` | String | Required | FAE's real full name (pure English transliteration): e.g., `"Li Wei"` | `{{author.name}}` in article author bar and author profile page; `TechArticle.author.name` |
| `photo` | String | Required | FAE photo SVG path: `"/assets/svg/illustrations/author-<slug>.svg"` | `{{author.photo}}` as `<img src>` in author bar |
| `photoAlt` | String | Required | Alt text: e.g., `"Li Wei — BeiLuo FAE Engineer"` | `{{author.photoAlt}}` |
| `expertise` | String | Required | Technical expertise summary (≤30 words): e.g., `"Power semiconductors, IGBT gate drive design, EV inverter systems"` | `{{author.expertise}}` in author bar and profile page |
| `experience` | String | Required | Years / seniority statement: e.g., `"8+ years in power electronics and field application engineering"` | `{{author.experience}}` on profile page |
| `bio` | String | Optional | Short bio paragraph (≥50 words) for the author profile page | `{{author.bio}}` |
| `profileHref` | String | Required | Full URL path: `"/about/authors/<slug>/"` | `{{author.profileHref}}` as link from article author bar; `TechArticle.author.url` |

---

## `Article` Object

Detail-level support articles (4 total, one per category). Powers both the `tech-detail` template and the card previews on list/category/tag pages.

### Preview Fields (used in cards on list, category, tag pages)

| Field | Type | Required | Meaning | Template Placeholder |
|-------|------|----------|---------|---------------------|
| `slug` | String | Required | URL segment: e.g., `"how-to-select-infineon-igbt"` | URL: `/support/<category>/<slug>/` |
| `title` | String | Required | Article H1 / card title (keyword-rich, unique): e.g., `"How to Select the Right Infineon IGBT: A Distributor's Guide"` | `{{article.title}}` as H1 in detail page and card heading |
| `category` | String | Required | Category slug (must match one of `categories[].slug`) | `{{article.category}}` as tab filter and category badge |
| `tags` | Array\<String\> | Required | Array of tag slugs (must each exist in `tags[].slug`): e.g., `["igbt", "selection-guide"]` | `{{article.tags}}` rendered as clickable badge pills (design §5.10) |
| `author` | String | Required | Author slug (must match `authors[].slug`) | `{{article.author}}` → resolves full author object at build time |
| `date` | String | Required | ISO 8601 publication date: e.g., `"2024-03-15"` | `{{article.date}}`; `TechArticle.datePublished` |
| `dateModified` | String | Optional | ISO 8601 last modified date | `TechArticle.dateModified` |
| `summary` | String | Required | ≤60-word excerpt for card preview and meta description seed | `{{article.summary}}` in card; base for `metaDescription` if not overridden |
| `metaDescription` | String | Required | Meta description ≤155 chars | `{{article.metaDescription}}` |
| `coverSvgSrc` | String | Optional | Illustration SVG for card thumbnail | `{{article.coverSvgSrc}}` |

### Full Detail Fields (used in `tech-detail` template)

| Field | Type | Required | Meaning | Template Placeholder / JSON-LD |
|-------|------|----------|---------|-------------------------------|
| `body` | String | Required | Full article body HTML/Markdown — **≥800 words**; H2/H3 structured with left border rule (design §5.10); **all H2/H3 must carry unique `id` attributes** (slug anchors) — `toc.js` reads these at runtime to auto-generate the Sticky TOC (markup-contract §3); `<pre><code>` for code blocks; `<blockquote>` for key callouts; line-height 1.8, paragraph spacing 24px | `{{article.body}}` rendered in `.article-content` div (design §5.10, PRD §3.5.4) |
| `internalLinks` | Array\<InternalLink\> | Required | ≥1 model link + ≥1 concept link embedded in body (PRD §3.5.4, iron rule) | `{{article.internalLinks}}` — used by `validate-data.js` to verify links exist |
| `relatedArticles` | Array\<String\> | Required | 3–5 article slugs for "Related Articles" section at article foot (design §5.10) | `{{article.relatedArticles}}` loop → resolved to card previews at build time |
| `pdf` | Array\<PdfItem\> | Optional | Related PDF downloads listed in sidebar (design §5.10 "Related PDF Download") | `{{article.pdf}}` loop in sidebar |

---

## `InternalLink` Object

Used by `validate-data.js` to verify that inline links in `body` actually resolve (iron rule §9 #2).

| Field | Type | Required | Meaning |
|-------|------|----------|---------|
| `model` | String | Optional | Part number linked in body (e.g., `"IKW40N120H3"`) — at least 1 per article required |
| `concept` | String | Optional | Concept/article slug linked in body (e.g., `"how-to-select-infineon-mosfet"`) — at least 1 per article required |
| `href` | String | Required | Full internal URL of the link (for link validation) |

---

## `PdfItem` Object

| Field | Type | Required | Meaning | Placeholder |
|-------|------|----------|---------|-------------|
| `title` | String | Required | PDF title: e.g., `"IGBT Selection Guide PDF"` | `{{pdf.title}}` |
| `href` | String | Required | Download URL | `{{pdf.href}}` |

---

## JSON-LD Mapping

### `tech-detail` template (design §10, PRD §3.5.4)

| Schema Type | Field Mapping |
|-------------|--------------|
| `TechArticle.@type` | `"TechArticle"` |
| `TechArticle.headline` | `article.title` |
| `TechArticle.description` | `article.metaDescription` |
| `TechArticle.datePublished` | `article.date` |
| `TechArticle.dateModified` | `article.dateModified` (fallback to `date`) |
| `TechArticle.author.@type` | `"Person"` |
| `TechArticle.author.name` | `author.name` (resolved from `article.author` slug) |
| `TechArticle.author.url` | `author.profileHref` (absolute URL) |
| `TechArticle.publisher.name` | `site.brand.name` (`"BeiLuo"`) |
| `TechArticle.publisher.logo.url` | `site.logo.src` |
| `BreadcrumbList` | `Home → Support → <category.name> → <article.title>` |

### Author Profile Page `/about/authors/<slug>/` (§5.15, reuses `about` template)

No dedicated JSON-LD type. `BreadcrumbList` only: `Home → About Us → Authors → <author.name>`.

---

## Category Slug Reference (PRD §3.5.2)

| `slug` | `name` | URL |
|--------|--------|-----|
| `guides` | `"Selection Guides"` | `/support/guides/` |
| `application-notes` | `"Application Notes"` | `/support/application-notes/` |
| `troubleshooting` | `"Troubleshooting"` | `/support/troubleshooting/` |
| `reviews` | `"New Product Reviews"` | `/support/reviews/` |

---

## Brand Differentiation & E-E-A-T Notes

- All 4 articles must be original — not copied from Infineon datasheets or application notes.
- `author.name` must be a real (or realistic) FAE name for E-E-A-T credibility.
- Articles should include BeiLuo-specific insights (stock availability, procurement tips, alternative part suggestions).
- `internalLinks[].model` links must point to an existing model in `products.json` (enforced by `validate-data.js`).
- Tags like `"IGBT"`, `"AURIX"`, `"BLDC Motor"`, `"CAN Bus"` must be used consistently across articles and tag index pages.
