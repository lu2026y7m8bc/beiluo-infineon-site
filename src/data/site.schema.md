# site.schema.md — Global Site Data Schema

> **Source file**: `src/data/site.json`
> **Template usage**: All 12 templates share `nav`, `footer`, `contact` via partial injection.
> **JSON-LD**: `Organization` + `WebSite` injected on the home page (§5.1, §10).
> **Constraint**: All string values must be **pure English**. Brand tagline must remain distinctive — do not copy generic distributor boilerplate.

---

## Count Quotas

| Item | Quota |
|------|-------|
| `nav.items` top-level links | 7 (Home / Products / Solutions / Support / News / About Us / Contact) |
| `footer.columns` | 4 columns |
| Contact channels | 2 (WhatsApp + WeChat) |

---

## Top-Level Fields

| Field | Type | Required | Meaning | Template Placeholder / JSON-LD |
|-------|------|----------|---------|-------------------------------|
| `brand` | Object | Required | Brand identity block | `{{brand.name}}`, `{{brand.slogan}}` in nav/footer; `Organization.name` in JSON-LD |
| `nav` | Object | Required | Top navigation configuration | `{{nav}}` partial in all templates |
| `footer` | Object | Required | Footer configuration | `{{footer}}` partial in all templates |
| `contact` | Object | Required | Contact details (WhatsApp + WeChat) | `{{contact.whatsapp}}`, `{{contact.wechat}}` in footer/contact page/floating widget |
| `seo` | Object | Required | Default SEO meta values | `{{seo.defaultTitle}}`, `{{seo.defaultDescription}}` — per-page overrides take precedence |
| `logo` | Object | Required | Logo SVG reference and alt text | `{{logo.src}}`, `{{logo.alt}}` in nav; `Organization.logo` in JSON-LD |
| `jsonLd` | Object | Required | Site-level structured data seeds | Rendered as `<script type="application/ld+json">` on home page only |

---

## `brand` Object

| Field | Type | Required | Meaning | Placeholder / JSON-LD |
|-------|------|----------|---------|----------------------|
| `brand.name` | String | Required | Brand name: `"BeiLuo"` | `{{brand.name}}`; `Organization.name` |
| `brand.slogan` | String | Required | Tagline shown beside logo: `"Top 8 Electronic Component Distributor in China"` | `{{brand.slogan}}` in nav (desktop only, hidden mobile); `Organization.description` |
| `brand.oneLiner` | String | Required | One-sentence brand intro for footer column 1 (≤30 words, pure English, brand-differentiated) | `{{brand.oneLiner}}` in footer |

---

## `nav` Object

| Field | Type | Required | Meaning | Placeholder |
|-------|------|----------|---------|-------------|
| `nav.items` | Array\<NavItem\> | Required | Ordered top-level navigation links | `{{nav.items}}` loop in nav partial |

### `NavItem` Shape

| Field | Type | Required | Meaning | Notes |
|-------|------|----------|---------|-------|
| `label` | String | Required | Visible link text (e.g., `"Products"`) | Pure English |
| `href` | String | Required | Absolute path (e.g., `"/products/"`) | No empty `#` links (iron rule §9 #2) |
| `megaMenu` | Boolean | Optional | `true` → renders Mega Menu dropdown (Products only) | design §4.1 |
| `children` | Array\<NavItem\> | Optional | Sub-links rendered in Mega Menu or mobile drawer | Used for Products → 4 category entries |

> Mega Menu note (design §4.1): Products mega menu lists 4 categories + "Featured models" (first 2 models from `products.json` per category). The data is derived at build time — **no separate field needed in site.json**.

---

## `footer` Object

| Field | Type | Required | Meaning | Placeholder |
|-------|------|----------|---------|-------------|
| `footer.columns` | Array\<FooterColumn\> | Required | 4 content columns | `{{footer.columns}}` loop |
| `footer.copyright` | String | Required | Copyright line (e.g., `"© 2024 BeiLuo. All rights reserved."`) | `{{footer.copyright}}` |
| `footer.sitemapHref` | String | Required | Href to `sitemap.xml` | `{{footer.sitemapHref}}` |
| `footer.robotsHref` | String | Required | Href to `robots.txt` | `{{footer.robotsHref}}` |

### `FooterColumn` Shape

| Field | Type | Required | Meaning |
|-------|------|----------|---------|
| `heading` | String | Required | Column heading text |
| `links` | Array\<{label, href}\> | Required | List of footer links |

> Column layout (design §4.2): ① Brand + tagline + oneLiner ② Products category links ③ Support / Solutions / News links ④ Contact (WhatsApp / WeChat + "Get a Quote").

---

## `contact` Object

| Field | Type | Required | Meaning | Placeholder / JSON-LD |
|-------|------|----------|---------|----------------------|
| `contact.whatsapp` | String | Required | WhatsApp number with country code: `"+86 15013702378"` | `{{contact.whatsapp}}`; used in footer col 4, floating widget, contact page |
| `contact.wechat` | String | Required | WeChat number: `"+86 18612518271"` | `{{contact.wechat}}`; same placements |
| `contact.whatsappHref` | String | Required | `"https://wa.me/8615013702378"` — clickable link | `{{contact.whatsappHref}}` |
| `contact.wechatQrSrc` | String | Required | Path to WeChat QR code SVG: `"/assets/svg/icons/wechat-qr.svg"` | `{{contact.wechatQrSrc}}` in floating widget popup |
| `contact.email` | String | Optional | Inquiry email address if applicable | `{{contact.email}}` in contact page / footer |

---

## `seo` Object

| Field | Type | Required | Meaning | Placeholder |
|-------|------|----------|---------|-------------|
| `seo.defaultTitle` | String | Required | Fallback `<title>` pattern (e.g., `"Infineon Distributor | BeiLuo"`) | `{{seo.title}}` — per-page data overrides |
| `seo.defaultDescription` | String | Required | Fallback meta description (≤155 chars, contains `"infineon distributor"` + `"BeiLuo"`) | `{{seo.description}}` |
| `seo.siteName` | String | Required | `"BeiLuo"` — used in OG tags | `{{seo.siteName}}` |
| `seo.baseUrl` | String | Required | Production origin (e.g., `"https://www.beiluo.com"`) | Used by build.js to construct canonical URLs and `sitemap.xml` |
| `seo.ogImage` | String | Optional | Default Open Graph image path | `{{seo.ogImage}}` in OG meta |

---

## `logo` Object

| Field | Type | Required | Meaning | Placeholder / JSON-LD |
|-------|------|----------|---------|----------------------|
| `logo.src` | String | Required | Path to logo SVG: `"/assets/svg/logo/logo.svg"` | `{{logo.src}}`; `Organization.logo.url` |
| `logo.alt` | String | Required | Alt text: `"BeiLuo — Top 8 Electronic Component Distributor in China"` | `{{logo.alt}}` |
| `logo.width` | Number | Required | Pixel width of logo area (design: desktop nav height 72px, mobile 60px) | `{{logo.width}}` |
| `logo.height` | Number | Required | Pixel height | `{{logo.height}}` |

---

## `jsonLd` Object (home page only injection)

| Field | Type | Required | Meaning | JSON-LD type |
|-------|------|----------|---------|-------------|
| `jsonLd.organizationUrl` | String | Required | Canonical URL of site | `Organization.url` |
| `jsonLd.organizationType` | String | Required | `"Organization"` | `@type` |
| `jsonLd.sameAs` | Array\<String\> | Optional | Social/directory profile URLs | `Organization.sameAs` |
| `jsonLd.foundingYear` | String | Optional | Year company founded | `Organization.foundingDate` |
| `jsonLd.areaServed` | String | Optional | Geographic scope (e.g., `"Worldwide"`) | `Organization.areaServed` |

> `WebSite` JSON-LD (also on home page) is fully derived from `seo.baseUrl` + `brand.name` at build time — no extra data fields needed.

---

## Brand Differentiation Notes

- `brand.slogan` and `brand.oneLiner` must be unique to BeiLuo — do not reuse generic phrases like "your one-stop distributor."
- All contact numbers come from PRD §3.8 (WhatsApp +86 15013702378, WeChat +86 18612518271).
- `seo.defaultDescription` must naturally embed `"infineon distributor"` and `"BeiLuo"` per PRD §3.2 acceptance criteria.
