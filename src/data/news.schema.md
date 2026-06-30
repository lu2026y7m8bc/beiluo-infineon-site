# news.schema.md — News Data Schema

> **Source file**: `src/data/news.json`
> **Templates used**:
>   - `news-list` (§5.11) — news landing page with Company / Industry News split sections
>   - `news-detail` (§5.12) — individual news article (single-column magazine layout, **no sidebar**, per PRD C7)
> **JSON-LD**: `NewsArticle` → `news-detail` pages; `BreadcrumbList` → `news-detail` pages (design §10, PRD §3.6.2).
> **Constraint**: All values **pure English**. Body text ≥800 words per article. Articles must naturally embed `"infineon distributor"` / `"Infineon"` and BeiLuo context. Design C7: news detail is **single-column centered, no left sidebar** — "Latest Industry News" 3-card block at bottom replaces sidebar navigation.

---

## Count Quotas (PRD §1.3, §3.6)

| Item | Quota |
|------|-------|
| `articles` array length | **4** (minimum) |
| Mix of types | At least 1 `"company"` + at least 1 `"industry"` (PRD §3.6.2) |
| `body` word count | **≥800 words** per article |
| `latestNews` card count (rendered at page bottom) | 3 cards (from this same articles array, excluding current) |

---

## Top-Level Structure

```
news.json
└── articles: Array<NewsArticle>   // ≥4 entries
```

---

## `NewsArticle` Object

### Preview Fields (used in cards on `news-list` and "Latest Industry News" bottom block)

| Field | Type | Required | Meaning | Template Placeholder |
|-------|------|----------|---------|---------------------|
| `slug` | String | Required | URL segment: e.g., `"beiluo-joins-electronica-2024"` | URL: `/news/<slug>/`; breadcrumb |
| `title` | String | Required | Article headline (H1 on detail page, card heading on list) — unique, keyword-bearing, ≤80 chars | `{{article.title}}` as H1 in `news-detail`; as card heading in `news-list` |
| `type` | String | Required | `"company"` or `"industry"` — determines which section the article appears in on `news-list` (PRD §3.6.1: two sections, not mixed) | `{{article.type}}` — used to assign to "Company News" or "Industry News" section |
| `date` | String | Required | ISO 8601 publication date: e.g., `"2024-11-10"` | `{{article.date}}`; `NewsArticle.datePublished` |
| `dateModified` | String | Optional | ISO 8601 last modified date | `NewsArticle.dateModified` |
| `categoryTag` | String | Required | Display badge label: e.g., `"Company News"` or `"Industry News"` | `{{article.categoryTag}}` rendered as badge on detail banner and list card (design §5.12, §4.8) |
| `summary` | String | Required | ≤60-word excerpt for card preview and meta description base | `{{article.summary}}` in news list card |
| `metaDescription` | String | Required | Meta description ≤155 chars, unique per article | `{{article.metaDescription}}` in `<meta name="description">` |

### Banner Fields (used in full-width header banner of `news-detail`)

| Field | Type | Required | Meaning | Template Placeholder |
|-------|------|----------|---------|---------------------|
| `bannerImage` | Object | Required | Full-width banner background (SVG or CSS color block) for article header | `{{article.bannerImage.*}}` in news-detail banner section (design §5.12) |
| `bannerImage.src` | String | Required | Path to banner SVG or illustration: `"/assets/svg/illustrations/news-<slug>.svg"` | `{{article.bannerImage.src}}` as background image |
| `bannerImage.alt` | String | Required | Descriptive alt text for the banner image (contains article context keyword) | `{{article.bannerImage.alt}}` |
| `bannerImage.overlayStyle` | String | Optional | CSS hint for overlay: `"dark"` (default) or `"light"` — determines text color on banner | `{{article.bannerImage.overlayStyle}}`; applied as class `.banner-overlay-dark` or `.banner-overlay-light` |

> Banner rendering (design §5.12): Full-width header block. H1 + date + category badge layered over `bannerImage.src` with dark color overlay `#0B1B2B` at opacity. Text uses white + shadow for readability. If `bannerImage.src` is blank/decorative SVG, banner renders as solid deep-blue block.

### Full Detail Fields (used in `news-detail` template)

| Field | Type | Required | Meaning | Template Placeholder / JSON-LD |
|-------|------|----------|---------|-------------------------------|
| `body` | String | Required | Full article body HTML/Markdown — **≥800 words**. Single-column centered (`max-width:800px`, `line-height:1.8`, paragraph spacing 24px per design §2.2). Must embed `"Infineon"` + BeiLuo distributor context naturally. Brand-differentiated original content. | `{{article.body}}` rendered in `.article-content` single-column area |
| `share` | Object | Required | Social sharing configuration for the share bar below article body (design §5.12) | `{{article.share.*}}` in share bar |
| `share.url` | String | Required | Full canonical URL of the article (absolute): e.g., `"https://www.beiluo.com/news/beiluo-joins-electronica-2024/"` | `{{article.share.url}}` as share link target |
| `share.title` | String | Required | Pre-filled share text: usually same as `title` | `{{article.share.title}}` encoded in share links |

### Optional SEO / GEO Fields

| Field | Type | Required | Meaning | Placeholder / JSON-LD |
|-------|------|----------|---------|----------------------|
| `canonical` | String | Optional | Canonical URL path (relative): e.g., `"/news/<slug>/"` | `{{article.canonical}}` in `<link rel="canonical">` |
| `ogImage` | String | Optional | Open Graph image path for social sharing | `<meta property="og:image">` |
| `keywords` | Array\<String\> | Optional | Target long-tail keywords for this article (used by `validate-data.js` to check keyword presence in body) | Not rendered; used for validation only |

---

## `news-list` Template Rendering Logic

The `news-list` template renders two distinct sections (design §5.11, PRD §3.6.1):

1. **Company News** section: `articles.filter(a => a.type === "company")`
2. **Industry News** section: `articles.filter(a => a.type === "industry")`

Articles are sorted by `date` descending within each section. The two sections are never mixed (PRD §3.6.1).

---

## `news-detail` Template Rendering Logic

1. Full-width banner: `bannerImage.src` + overlay + `title` + `date` + `categoryTag` badge.
2. Single-column centered body: `body` content (no sidebar — PRD C7).
3. Share bar: uses `share.url` + `share.title` to build WhatsApp / copy-link / LinkedIn share links.
4. "Latest Industry News" 3-card block: `articles.filter(a => a.slug !== currentSlug).slice(0, 3)` — serves as news navigation replacement for sidebar (PRD C7, design §5.12).
5. Final CTA band: derived from `site.json` global CTA config.

---

## JSON-LD Mapping

### `news-detail` template (design §10, PRD §3.6.2)

| Schema Type | Field Mapping |
|-------------|--------------|
| `NewsArticle.@type` | `"NewsArticle"` |
| `NewsArticle.headline` | `article.title` |
| `NewsArticle.description` | `article.metaDescription` |
| `NewsArticle.datePublished` | `article.date` |
| `NewsArticle.dateModified` | `article.dateModified` (fallback to `date`) |
| `NewsArticle.image` | `article.bannerImage.src` (absolute URL via `site.seo.baseUrl`) |
| `NewsArticle.publisher.@type` | `"Organization"` |
| `NewsArticle.publisher.name` | `site.brand.name` (`"BeiLuo"`) |
| `NewsArticle.publisher.logo.url` | `site.logo.src` (absolute) |
| `NewsArticle.mainEntityOfPage` | Canonical URL of the article |
| `BreadcrumbList` | `Home → News → <article.title>` |

---

## Brand Differentiation Notes

- `"company"` type articles: BeiLuo company milestones, certifications, exhibition participation, new partnerships — written in first-person corporate voice.
- `"industry"` type articles: Semiconductor industry trends, Infineon product launches, market analysis — must cite authority sources + include BeiLuo distributor perspective/commentary.
- All `body` content must be **original** — not copied from press releases without transformation + original commentary.
- `share.title` should be catchy and keyword-bearing for viral sharing.
- `bannerImage.alt` must be descriptive for SEO (contains headline keyword, not generic "news banner").
