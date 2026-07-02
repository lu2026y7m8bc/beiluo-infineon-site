# dev-status.md — BeiLuo Infineon Site

> Last updated: 2026-07-02 (session close after T5.7 complete, T5.8 next)

---

## 1. Branch / Worktree

- Branch: `feat/beiluo-infineon-site`
- Base: `main`
- Worktree: single (no linked worktrees active)

### Unstaged changes at session close

| File | Change |
|------|--------|
| `src/lib/pages.js` | T5.7: tech-detail context now also resolves `article.author` slug → full `author` object, `article.relatedArticles` slugs → full `relatedArticles` article objects, plus injects `category` — all additive sibling context fields, `article` itself untouched |
| `src/templates/tech-detail.html` | T5.7: new — immersive reading layout + sticky sidebar (TOC hook/PDF/Ask-an-Engineer CTA) |
| `docs/current/todo_write.md` | T5.7 → completed, T5.8 → in_progress |

These changes should be committed (pending user confirmation — commit not yet made).

---

## 2. Completed Tasks

| Task | Description | Commit(s) |
|------|-------------|-----------|
| T0.1 | Project scaffold | 5466df4 |
| T0.2 | Test runner (npm test) | — (covered by T0.1) |
| T0.3 | JSON schema drafts | 5c0d2a8 + fix a479f7f |
| T0.4 | Markup contract | 76c643b + fix f11bce0 |
| T0.5 | check_list1.md | 5688aae + fix e07b3f9 |
| T0.6 | check_list2.md | a3ddd7d |
| T1.1 | slugify.js | 700d694 |
| T1.2 | render.js | 78caafd + d579ca2 |
| T1.3 | schema.js (7 JSON-LD types) | 48de8ba + fbc5ee3 + 14f3623 |
| T1.4 | links.js | a9cce0c + 671447c |
| T1.5 | sitemap.js + robots.js | 8820d59 |
| T1.6 | pages.js | 31d1410 + 0cf9460 |
| T1.7 | build.js | eb1bc20 + b90ccc0 |
| T2.1 | tokens.css | ccec85b + 667929d |
| T2.2 | style.css baseline | 00c5f79 |
| T2.3 | head-meta.html partial | f7d235c |
| T2.4 | nav.html + nav.js | 1f96354 + f4a57fc + 52c5964 |
| T2.5 | footer.html | 3d2f178 + 346f0fc |
| T2.6 | breadcrumb.html | b666ab9 + dbdb1ff |
| T2.7 | sidebar / contact-float / cta-block / card partials | b773dba + 099e66d |
| T3.1 | logo.svg + logo-mark.svg | dad45b3 |
| T3.2 | 4 category SVG icons | 6192875 |
| T3.3–T3.5 | Background SVGs + illustrations + product covers | 09e0722 + b5a7000 + 64f7b7b |
| T4.1 | site.json | e17cdc8 + 9db4d78 |
| T4.2 | products.json (4 categories, 8 models) | 2ddc96d + c4673bb |
| T4.3 | solutions.json (5 solutions) | 4a51ce3 |
| T4.4 | support.json (4 articles, 2 authors) | b1b91d7 + cb72698 |
| T4.5 | news.json (4 articles) | e8bfe33 |
| T4.6 | home.json + about.json | 26425ca + cb72698 |
| T4.7 | validate-data.js + 52 tests | 8653e3d + e733c21 |
| T5.1 | home.html (7 sections + JSON-LD) | 353ea00 + a507123 + 6a380a2 |
| T5.2 | products-list.html | 98b4bd6 + 99cd02b |
| T5.3 | product-category.html | 2153780 + 0066bae + 7d6a530 |
| T5.4 | product-detail.html | 7a99552 + 8cb349f |
| T5.5 | solutions-list.html + solution-detail.html | e469571 |
| T5.6 | support-list.html + support-card.html partial (overview/category/tag, 19 pages) | d9f6bce |
| T5.7 | tech-detail.html (author bar/sticky sidebar/longform typography/related articles/TechArticle JSON-LD, 4 articles) | not yet committed |

**Total tests passing: 363** (as of T5.7 complete)

---

## 3. Current In-Progress

**T5.8 — `templates/news-list.html` + `templates/news-detail.html`**

- `news-list.html`: Company News / Industry News two sections (must not intermix), sidebar for news nav
- `news-detail.html`: single-column magazine style (full-width banner header, no sidebar per prd.md §3.1), share bar, bottom "Latest News" 3-card block, NewsArticle JSON-LD
- Data: `src/data/news.json` (4 articles, 2 company + 2 industry — validated by T4.7's `validateData`)
- `pages.js` already generates both page types (see "── 13. News list" / "── 14. News detail pages" blocks); check whether context needs enrichment similar to T5.7's author/relatedArticles resolution before assuming raw `article` fields suffice
- Completion criteria: sections don't intermix, single column on detail, 4 articles generated, valid JSON-LD

---

## 4. Pending Tasks Overview

| Phase | Tasks | Description |
|-------|-------|-------------|
| Phase 5 (Templates) | T5.7–T5.10 | tech-detail, news-list, news-detail, about, contact |
| Phase 6 (JS) | T6.1–T6.4 | table-filter, tabs, toc, form validation |
| Phase 7 (SEO/GEO) | T7.1–T7.5 | Meta wiring, JSON-LD audit, sitemap, FAQ, image alt |
| Phase 8 (Final sweep) | T8.1–T8.2 | check_list1 + check_list2 final scan |
| Phase 9 (Integration) | T9.1–T9.5 | Full build, browser tests, code review, PRD verification |
| Phase 10 (Deploy) | T10.1–T10.3 | **BLOCKED** — awaiting GitHub + Cloudflare credentials |
| Phase 11 (Wrap-up) | T11.1–T11.4 | CLAUDE.md, dev-status, branch finish, memory update |

---

## 5. Last Test / Lint / Build Results

- **npm test**: 363 tests pass, 0 failures (last run: T5.5 session)
- **node src/build.js**: not run this session (T5.6 template not yet written)
- **Lint**: no lint config; ESM + Node.js built-ins only

---

## 6. Known Issues (Not Yet Fixed)

All are Low severity; triage at T8.1/T8.2 final sweep.

| Severity | Source | Issue |
|----------|--------|-------|
| Low | T0.1 | `README.md` directory tree lists `src/build.js` before it existed — self-resolved now |
| Low | T4.7 | `milestones-alternative` test couples to real `about.json` layout (`history` key) |
| Low | T4.7 | `logo.src/alt` allow whitespace-only strings (uses `=== ''` not `nonEmptyString`) |
| Low | T4.7 | No edge-case tests for `validateData(null/undefined/{})` |
| Low | T4.7 | Missing failure-mode tests for `contact.wechat`, `seo.siteName`, `logo.alt/width/height`, `jsonLd.organizationType` |
| Low | T5.2 | Triple-brace `{{{seo.title/description}}}` in JSON-LD — safe (pages.js builds from validate-data-checked fields only); revisit if CMS feeds data |
| Low | T5.4 | `product-detail.html` Tab markup (`.product-tabs`/`.tab-btn`/`.tab-panel`, no `data-tab`/`data-tabpanel`) deviates from `markup-contract.md` §2's Tab contract. T5.6's `support-list.html` follows the contract exactly, so this is now the sole outlier. T6.2 (tabs.js) must handle both shapes, or T5.4 should be reconciled to match the contract before T6.2. |
| Low | T5.4/T5.5 | `product-detail.html` and `solution-detail.html` use double-brace (HTML-escaped) interpolation inside `<script type="application/ld+json">` for some fields — since `<script>` content is raw text (not HTML-entity-decoded by JSON-LD consumers), any field containing `&`/`<`/`>`/quotes would corrupt the JSON. `products-list.html` and `support-list.html` already use the correct triple-brace form. Worth a follow-up cleanup pass. |
| Low | all templates | `breadcrumb.html`'s `{{breadcrumbJsonLd}}` hook is never populated by `pages.js` anywhere — dead code. `solution-detail.html` and `support-list.html` both work around it by hand-authoring `BreadcrumbList` JSON-LD inline in each template instead. Consider either wiring the hook in pages.js or removing it from breadcrumb.html. |
| Low | links.js | Sitewide false-positive: `footer.html` links to `/sitemap.xml` and `/robots.txt` on every page, but `findLinkIssues`'s valid-path set comes only from `buildPageList()` and never includes the separately-generated `sitemap.xml`/`robots.txt` files, so these 2 links are flagged "dead" site-wide. Pre-dates T5.6, affects all templates. Fix in `links.js` or `build.js` (add sitemap.xml/robots.txt to the valid-URL set). |
| Low | T5.6 | Category-index/tag-page breadcrumb *display* (nav breadcrumb, via `pages.js`'s `markCurrentLast`) is shallower than the BreadcrumbList JSON-LD authored in `support-list.html` (e.g. category-index nav breadcrumb is `[Home, Support]`, JSON-LD is `[Home, Support, {category}]`) — same pattern already present for `product-category` pages, likely intentional but worth confirming at T8.1 final sweep. |
| Low | T5.6 | `npm test`'s existing suite doesn't exercise the real `support-list.html`/`support-card.html` render path (`build.test.js` stubs templates) — correctness was verified via a throwaway script during review, not a committed test. Consider adding template-render coverage at T9.1/T9.4 if time allows. |
| Low | T4.4 | `support.json` data defect: article `infineon-optimos-mosfet-overview`'s `internalLinks` declares a model link to `/products/mosfet/irfs4321pbf/` that never actually appears in `article.body` text — PRD's "≥1 model internal link per article" isn't truly satisfied for this one article. `validate-data.js` doesn't cross-check `internalLinks[].href` against body content, so nothing catches it. Fix by adding the missing in-body link to `support.json`, or extending `validate-data.js`. |
| Low | T5.6/T5.7 | Tag badges (`support-card.html`, `tech-detail.html`) render the raw tag slug (`igbt`) instead of the human-readable `tag.name` (`IGBT`) — the per-article contexts only carry `article.tags` (slugs), not resolved `Tag` objects. A consolidated fix would inject a `tags`-name lookup map into every support-related context in `pages.js`. Low priority (slugs are still readable and functional). |

**Pending NEW TODO (from T2.4):** `navCategories` injection — pages.js should inject `navCategories` (derived from `products.categories`, featuredModels = first 2 models) into every page context so nav mega-menu renders site-wide. Currently mega renders 0 categories gracefully. Wire during/after Phase 5 template work.

---

## 7. Codex Re-check Results

| Task | Codex Result |
|------|-------------|
| T5.7 | Round 1: 2 **High** found (article body not using existing `.longform` CSS class; "Related Articles" section nested inside `.article-content` polluting Sticky TOC scan scope) → both fixed → Round 2: **Approved** |
| T5.6 | **Approved** — no new issues (internal reviewer first REJECTed for 2 Major: missing tag rendering on cards, overview-page CSS-hide duplication instead of server-side pre-filter; both fixed and re-verified before Codex ran) |
| T5.5 | **Approved** — no issues found |
| T5.4 | 1 High (rfq→InStock mapping) + 2 Med fixed |
| T5.3 | 2 Med (bare ItemList, triple-brace) + 2 Low fixed |
| T5.2 | 2 Med (triple-brace JSON-LD) adjudicated as architecture-safe |
| T5.1 | 1 Med (JSON-LD safety→validate-data rule) + 1 Med + 1 Minor fixed |
| T4.7 | 1 High (empty-data early-exit order) + 2 Med + 4 Low fixed |

Codex re-check is **MANDATORY** after every task (user rule, established 2026-06-30).

---

## 8. Next Recommended Task

**T5.8 — `templates/news-list.html` + `templates/news-detail.html`**

- Design ref: design.md §5.11 (news-list: Breadcrumb → H1 → two sections **Company News** / **Industry News**, never intermixed, sidebar for news nav) and §5.12 (news-detail: single-column magazine style, full-width header banner with text shadow, H1+date+category tag, ≥800-word single-column body, social share bar, bottom "Latest News" 3-card block excluding current article, NewsArticle JSON-LD, **no sidebar** per prd.md §3.1)
- Data: `src/data/news.json` — 4 articles (2 `type:"company"` + 2 `type:"industry"`, enforced by T4.7 `validateData`)
- pages.js already builds both page lists ("── 13. News list" / "── 14. News detail pages" blocks) with `context: { ...site, seo, article, breadcrumb }` for detail and `context: { ...site, seo, articles: news.articles, breadcrumb }` for list — **check whether the list template needs company/industry pre-split similar to T5.6's per-category arrays**, and whether detail's "Latest News 3-card" (excluding current) needs a pages.js-resolved field similar to T5.7's `relatedArticles` resolution, before assuming template-only filtering is possible (render.js still has no equality operator)
- JSON-LD: use `src/lib/schema.js`'s `newsArticle()` constructor as field reference (same as T5.7 referenced `techArticle()`); hand-author inline with triple-brace per project convention
- Completion criteria: sections don't intermix, single column on detail, 4 articles generated, valid JSON-LD

**New-todo candidates surfaced during T5.6/T5.7 (not implemented, recorded in §6 Known Issues above — triage at T8.1/T8.2 or earlier if blocking):**
- Reconcile T5.4 Tab markup with markup-contract.md §2 (or accept 2 shapes and make T6.2 tabs.js handle both)
- Fix double-brace JSON-LD escaping bug in product-detail.html/solution-detail.html
- Wire or remove breadcrumb.html's unused `{{breadcrumbJsonLd}}` hook
- Fix links.js false-positive on `/sitemap.xml`/`/robots.txt` footer links
- `support.json` `infineon-optimos-mosfet-overview` internalLinks/body mismatch (see §6)
- Tag badges show raw slug not display name across support-list/tech-detail (see §6)

**Tooling note:** Codex CLI (`codex exec -s read-only ...`) hung indefinitely (confirmed via `codex doctor` that network/auth were healthy) when the prompt was passed as a quoted CLI argument on this Windows/Git-Bash setup — it silently fell back to "Reading additional input from stdin..." and never received EOF. Fix: pipe the prompt via heredoc into `codex exec -s read-only -C "<path>" -` (the trailing `-` forces stdin read). Works reliably; use this form for all future Codex re-checks in this repo.
