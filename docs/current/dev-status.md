# dev-status.md — BeiLuo Infineon Site

> Last updated: 2026-07-03 (session close after T6.3 complete — T6.4 next)

---

## 1. Branch / Worktree

- Branch: `feat/beiluo-infineon-site`
- Base: `main`
- Worktree: single (no linked worktrees active)

### Unstaged changes at session close

| File | Change |
|------|--------|
| `src/templates/tech-detail.html` | T6.3: added `<script type="module" src="/assets/js/toc.js">` only — markup was already `markup-contract.md` §3-compliant from T5.7, untouched otherwise |
| `src/assets/js/toc.js` | T6.3: new — builds nested `<ol>/<li>/<a>` TOC tree (H2 top-level, H3 nests under nearest preceding H2) in `[data-toc]`, `IntersectionObserver`-based scroll-spy highlighting. **Fixed a real Major bug found by reviewer during this session**: original scroll-highlight toggled `toc-active` on/off per individual `isIntersecting` change, which — because heading elements are much shorter than their section content — meant the highlight only flashed briefly while crossing a narrow top-of-viewport band, then vanished for most of actual reading time. Fixed to track a single `activeId` that only *advances* when a new heading enters the trigger band, correctly keeping the previous heading highlighted throughout the section's reading time |
| `docs/current/todo_write.md` | T6.3 → completed, T6.4 → in_progress |

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
| T5.7 | tech-detail.html (author bar/sticky sidebar/longform typography/related articles/TechArticle JSON-LD, 4 articles) | 8d0f5c7 |
| T5.8 | news-list.html + news-detail.html + news-card.html partial + news.json body HTML fix (5 pages) | ea5b726 |
| T5.9 | about.html + author profile pages + about.json team[] data fix (3 pages) | ecefabf |
| T5.10 | contact.html (contact card + inquiry form markup hooks) | 4b5f1e0 |
| T6.1 | table-filter.js **+ fixed a real T5.3 defect** (product-category.html tbody was hardcoded, ignoring 6-8 dynamic columns per category) **+ markup-contract.md §1 alignment** | eafdec4 |
| T6.2 | tabs.js **+ fixed a real T5.4 markup-contract deviation** (product-detail.html's 5 tabs had no `data-tab`/`data-tabpanel`, wrong id scheme) | e551dfc |
| T6.3 | toc.js (T5.7's `tech-detail.html` markup was already contract-compliant, no template fix needed this time) **+ fixed a Major scroll-highlight semantic bug** found in review | not yet committed |

**PHASE 5 COMPLETE (T5.1–T5.10). All 12 templates built.**

**Total tests passing: 363** (as of T6.3 complete)

---

## 3. Current In-Progress

**T6.4 — `src/assets/js/form.js`**

- Design ref: `design.md` §4.11 / `markup-contract.md` §4 (`<form data-validate novalidate>` with `data-rule`/`data-error-for`/`data-submit`/`data-success` hooks) — consumed by `contact.html` (T5.10, which already produced fully contract-compliant markup — verify directly rather than assuming, per the now-established T6.x pattern, but T5.10's own review specifically checked this DOM byte-for-byte against the contract)
- Behavior: client-side-only validation (required fields, email format, part-number field), inline error messages near each field (`[data-error-for]`), disable submit + show spinner during "submission" (static site — no real backend, so "submission" just simulates a delay then shows the success state), reveal `[data-success]` on completion
- No unit tests expected (browser-verified per plan.md, same as T6.1–T6.3)
- Completion criteria: required/email validation works, inline errors appear near fields, submit button disables during submission

---

## 4. Pending Tasks Overview

| Phase | Tasks | Description |
|-------|-------|-------------|
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

Mostly Low severity (triage at T8.1/T8.2 final sweep); one **High** item below needs attention before final launch checks.

| Severity | Source | Issue |
|----------|--------|-------|
| **High** | T4.6/T3.x | `about.json`'s `advantages[]` (6 icons), `cases[]` (4 logos), `customsDeclarations[]` (3 images) reference ~13 SVG files under `src/assets/svg/icons/` and `src/assets/svg/illustrations/` that **do not exist on disk** (confirmed via `fs.existsSync` during T5.9 review — only `about-hero.svg` exists). `about.html` (T5.9) is the first task to actually render these as visible `<img>` tags, so once deployed the About page's advantage icons, client logos, and — critically — the **PRD §3.7-mandated customs-declaration trust section** will show broken images. Needs a dedicated SVG-asset-generation task (extends T3.x scope) before T9/launch. |
| **High** | T4.2/T4.6, surfaced T5.10 | `node src/build.js` now runs end-to-end for the first time (Phase 5 complete → every page has a template) and its `links.js` dead-link check reports **~17 distinct real dead links** (not the known sitemap.xml/robots.txt false positive), appearing ~25 times total: (1) `home.html`'s Solutions/Support teaser sections link to `/solutions/motor-drive/`, `/solutions/ev-charging/`, `/solutions/industrial-automation/`, `/support/application-notes/infineon-coolmos-pfc-application/` — none of which exist in `solutions.json`/`support.json` (T4.6 data referencing wrong/stale slugs); (2) `product-detail.html`'s `alternativeParts`/`companionParts` cross-references in `products.json` (T4.2) point to part-number slugs that don't correspond to any real model in the same or another category (e.g. `tc264da` → `tc265da`, `xmc4700-...` → `xmc4800-...`, `ikw40n120h3` → `ikw50n65el5`, several MOSFET/sensor cross-refs). This predates Phase 5 entirely — masked until now because `node src/build.js` always failed early at a missing template before reaching link validation. This is squarely **T9.1**'s job ("全量构建+死链/空链零容忍校验") but is significant enough to flag now rather than let it surprise T9.1. Fix requires either adding the missing product/solution entries or correcting the dangling slug references in `products.json`/`home.json`. |
| Low | T0.1 | `README.md` directory tree lists `src/build.js` before it existed — self-resolved now |
| Low | T4.7 | `milestones-alternative` test couples to real `about.json` layout (`history` key) |
| Low | T4.7 | `logo.src/alt` allow whitespace-only strings (uses `=== ''` not `nonEmptyString`) |
| Low | T4.7 | No edge-case tests for `validateData(null/undefined/{})` |
| Low | T4.7 | Missing failure-mode tests for `contact.wechat`, `seo.siteName`, `logo.alt/width/height`, `jsonLd.organizationType` |
| Low | T5.2 | Triple-brace `{{{seo.title/description}}}` in JSON-LD — safe (pages.js builds from validate-data-checked fields only); revisit if CMS feeds data |
| ~~Was Medium~~ Fixed | T5.4 → T6.2 | `product-detail.html` Tab markup deviated from `markup-contract.md` §2 (no `data-tab`/`data-tabpanel`, wrong id scheme). Fixed during T6.2: all 5 tabs (overview/specs/applications/documents/faq) realigned to the contract exactly; panel content untouched, only attributes changed. `tabs.js` now correctly drives both `product-detail.html` and `support-list.html`. |
| Low | T6.1 | `table-filter.js`'s range filter (`data-filter="range"`) treats non-numeric/blank cell values as always-matching (`rowMatches`'s range branch returns `true` when `parseNumber` fails) — an edge case for future data where a numeric column's value is legitimately missing (now rendered as `''` per the T6.1 robustness fix), such rows stay visible under min/max filtering instead of being excluded. Not a regression, not currently reachable (no shipped model has a missing numeric param), but worth tightening if empty numeric cells become possible. |
| Low | T6.1 | No committed test coverage for `pages.js`'s new `rowCells` computation or for `product-category.html`'s dynamic-column rendering — verified via disposable scripts during review only, same pattern as prior `pages.js` enrichment fields (T5.6–T5.10). |
| Low | T6.2 | `product-detail.html`'s `.tab-container` retains a leftover `data-tabs="product-detail"` attribute and the tablist div carries an extra `class="tab-list"` not mentioned in `markup-contract.md` §2 — both inert (unused by `tabs.js`, which selects by ARIA role, not class/data attribute), pre-existing from before this session's fix, purely cosmetic. |
| Low | T5.4/T5.5 | `product-detail.html` and `solution-detail.html` use double-brace (HTML-escaped) interpolation inside `<script type="application/ld+json">` for some fields — since `<script>` content is raw text (not HTML-entity-decoded by JSON-LD consumers), any field containing `&`/`<`/`>`/quotes would corrupt the JSON. `products-list.html` and `support-list.html` already use the correct triple-brace form. Worth a follow-up cleanup pass. |
| Low | all templates | `breadcrumb.html`'s `{{breadcrumbJsonLd}}` hook is never populated by `pages.js` anywhere — dead code. `solution-detail.html` and `support-list.html` both work around it by hand-authoring `BreadcrumbList` JSON-LD inline in each template instead. Consider either wiring the hook in pages.js or removing it from breadcrumb.html. |
| Low | links.js | Sitewide false-positive: `footer.html` links to `/sitemap.xml` and `/robots.txt` on every page, but `findLinkIssues`'s valid-path set comes only from `buildPageList()` and never includes the separately-generated `sitemap.xml`/`robots.txt` files, so these 2 links are flagged "dead" site-wide. Pre-dates T5.6, affects all templates. Fix in `links.js` or `build.js` (add sitemap.xml/robots.txt to the valid-URL set). |
| Low | T5.6 | Category-index/tag-page breadcrumb *display* (nav breadcrumb, via `pages.js`'s `markCurrentLast`) is shallower than the BreadcrumbList JSON-LD authored in `support-list.html` (e.g. category-index nav breadcrumb is `[Home, Support]`, JSON-LD is `[Home, Support, {category}]`) — same pattern already present for `product-category` pages, likely intentional but worth confirming at T8.1 final sweep. |
| Low | T5.6 | `npm test`'s existing suite doesn't exercise the real `support-list.html`/`support-card.html` render path (`build.test.js` stubs templates) — correctness was verified via a throwaway script during review, not a committed test. Consider adding template-render coverage at T9.1/T9.4 if time allows. |
| Low | T4.4 | `support.json` data defect: article `infineon-optimos-mosfet-overview`'s `internalLinks` declares a model link to `/products/mosfet/irfs4321pbf/` that never actually appears in `article.body` text — PRD's "≥1 model internal link per article" isn't truly satisfied for this one article. `validate-data.js` doesn't cross-check `internalLinks[].href` against body content, so nothing catches it. Fix by adding the missing in-body link to `support.json`, or extending `validate-data.js`. |
| Low | T5.6/T5.7 | Tag badges (`support-card.html`, `tech-detail.html`) render the raw tag slug (`igbt`) instead of the human-readable `tag.name` (`IGBT`) — the per-article contexts only carry `article.tags` (slugs), not resolved `Tag` objects. A consolidated fix would inject a `tags`-name lookup map into every support-related context in `pages.js`. Low priority (slugs are still readable and functional). |
| Low | all list pages | `{{> sidebar}}` (`partials/sidebar.html`) renders empty on every page that includes it (products-list/solutions-list/support-list/news-list/product-category/solution-detail) because `pages.js` never injects `sidebarSections` anywhere site-wide. Confirmed during T5.8 review — not new, but not previously logged as a standalone item. Fix: decide sidebar content per page type (category nav tree / related links) and wire in `pages.js`. |
| Low | T5.8 | `news-list` context still passes the unfiltered `articles: news.articles` field alongside the new `companyArticles`/`industryArticles` — dead/unused field, harmless but could be dropped for cleanliness. |
| Low | T5.6/T5.7/T5.8 | New `pages.js` context-enrichment fields (`guidesArticles`.../`authorInfo`/`relatedArticlesResolved`/`companyArticles`/`industryArticles`/`latestNews`/`authorType`/`overlayClass`/`shareTitleEncoded`/`shareUrlEncoded`) have no committed unit test coverage — `tests/pages.test.js` uses a minimal stub fixture that doesn't exercise these. Correctness verified via throwaway scripts during each review, not persisted as tests. Consider adding coverage at T9.1/T9.4. |
| ~~Was High~~ Fixed | T4.5 → T5.8 | `news.json`'s 4 article `body` fields were plain markdown-style text (`## Heading {#id}`), not HTML like every other content file — would have rendered as an unformatted text blob with literal `##` markers via `{{{article.body}}}`. Fixed during T5.8 session: converted to HTML matching support.json's convention, content/word-count unchanged, one `contextLinks` entry naturally embedded per article. |
| Low | T5.10 | `contact.html`'s business-hours text ("Monday–Friday, 9:00–18:00 (GMT+8)") is a specific, falsifiable claim with no backing field in `site.json`. Not a broken link/dead-end like the (fixed) fabricated email, just unverified descriptive copy — lower risk, doesn't contradict any other stated fact. Consider adding a real `contact.businessHours` field if the actual hours are known, or softening the copy. |

**Pending NEW TODO (from T2.4) — READY NOW:** `navCategories` injection — pages.js should inject `navCategories` (derived from `products.categories`, featuredModels = first 2 models) into every page context so nav mega-menu renders site-wide. Currently mega renders 0 categories gracefully. Was deferred to "during/after Phase 5 template work" — **Phase 5 is now complete (T5.10 done)**, so this is unblocked and should be picked up soon (candidate for T7.x or an earlier ad-hoc fix, since it affects every page's nav on every already-shipped template).

---

## 7. Codex Re-check Results

| Task | Codex Result |
|------|-------------|
| T6.3 | **Approved** — internal reviewer REJECTed for 1 Major: scroll-highlight (`toc-active`) implementation observed heading elements themselves (single-line, much shorter than their section content) with a narrow top-30%-viewport `rootMargin`, and removed the highlight the instant any heading exited that band — meaning the TOC showed no highlight for most of actual reading time, only flashing briefly while scrolling past a heading. Controller fixed directly: track a single `activeId` that only *advances* when a new heading enters the band, correctly keeping the previous section highlighted until the next one is reached. Codex traced the exact highlight transition sequence through the contract's own H2/H3 example and confirmed it now matches "most recently passed heading stays active" semantics |
| T6.2 | **Approved** — no issues found. Internal reviewer also APPROVE (no findings); reviewer additionally executed the real `tabs.js` against a constructed fake-DOM harness (18 assertions: click/keyboard switching, boundary wrap-around, mismatch handling, single-tab degradation) rather than just reading the code |
| T6.1 | **Approved** — internal reviewer APPROVE_WITH_MINOR_FINDINGS found 1 Major (unguarded `{{value}}` in the plain-value table-cell branch would throw render.js's "Missing field" error and crash the *entire site build* if any future model lacks a declared column's param — not just style); controller fixed at the source in `pages.js` (coalesce missing values to `''`, not left `undefined`) rather than templating around it with `{{#if value}}` (which would have incorrectly hidden legitimate `0` values, since render.js's `isTruthy(0) === false`); verified both properties (no-throw on missing + correct `"0"` display) with a live render reproduction. Codex found 1 new Minor (table-filter.js's range filter treats non-numeric/blank cells as always-matching — edge case, not a regression) |
| T5.10 | **Approved** — no new issues (internal reviewer APPROVE_WITH_MINOR_FINDINGS; controller fixed the one real finding directly — a fabricated `mailto:sales@beiluo.com` copied verbatim from markup-contract.md's illustrative example text, not backed by any site.json field — replaced with the real, data-backed WhatsApp/WeChat channels) |
| T5.9 | **Approved** — no new issues (internal reviewer REJECTed for 1 Major: `/about/authors/` breadcrumb crumb — both nav `<a>` and JSON-LD — pointed to a page `buildPageList()` never generates, a real dead link; fixed by repointing to `/about/`, test assertion updated to match) |
| T5.8 | **Approved** — no new issues (internal reviewer first REJECTed for 2 Major: `news-card.html` not reusing existing `card--teaser`/`badge` CSS classes, share-bar URLs not percent-encoded; both fixed and re-verified before Codex ran) |
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

**T6.4 — `src/assets/js/form.js`**

- Markup contract: `src/markup-contract.md` §4 — consumed by `contact.html` (T5.10)
- Contract compliance: T5.10's own review already checked `contact.html`'s form DOM byte-for-byte against §4 (`data-validate`/`data-rule`/`data-error-for`/`data-submit`/`data-success`, no `action` attribute) and found it exactly compliant — unlike T5.3/T5.4/(T5.7 turned out fine too), there's no known deviation to fix first here, but confirm directly rather than skipping the check entirely (T6.1–T6.3 all found this check worth doing)
- Behavior: client-side-only validation per field `data-rule` (text/email/partno), inline errors near each field via `[data-error-for]`, disable + spinner on `[data-submit]` during "submission" (static site, no backend — simulate a brief delay), reveal `[data-success]` and hide the form (or leave it, decide based on UX judgment) on completion
- Not TDD (plan.md marks T6.x as browser-verified) — completion is manual/browser verification, not `npm test`
- Completion criteria: required/email validation works, inline error messages appear near fields, submit button disables during submission

**This is the last Phase 6 task (T6.1–T6.4) — Phase 7 (SEO/GEO wiring) follows.**

**New-todo candidates surfaced during T5.6–T6.3 (not implemented, recorded in §6 Known Issues above — triage at T8.1/T8.2 or earlier if blocking):**
- **[Ready now]** Wire `navCategories` into every page context (was blocked on "after Phase 5 template work" — now unblocked, see §6)
- **[High]** Generate ~13 missing SVG assets referenced by `about.json`'s `advantages`/`cases`/`customsDeclarations` (extends T3.x scope) — About page currently shows broken images including the PRD-mandated customs-declaration trust section
- **[High]** ~17 pre-existing dead links across products.json/home.json, surfaced by the first successful full `node src/build.js` run at Phase 5 close (see §6) — deferred to T9.1 per user decision
- Fix double-brace JSON-LD escaping bug in product-detail.html/solution-detail.html
- Wire or remove breadcrumb.html's unused `{{breadcrumbJsonLd}}` hook
- Fix links.js false-positive on `/sitemap.xml`/`/robots.txt` footer links
- `support.json` `infineon-optimos-mosfet-overview` internalLinks/body mismatch (see §6)
- Tag badges show raw slug not display name across support-list/tech-detail (see §6)
- Wire `sidebarSections` into `pages.js` for all list/category/detail pages that include `{{> sidebar}}` (currently renders empty everywhere, see §6)
- `about.schema.md` specifies `advantages` should be 3–5 items; `about.json` has 6 (T4.6 data, non-blocking)
- `contact.html`'s business-hours claim is unbacked descriptive copy (see §6, Low)

**Tooling note:** Codex CLI (`codex exec -s read-only ...`) hung indefinitely (confirmed via `codex doctor` that network/auth were healthy) when the prompt was passed as a quoted CLI argument on this Windows/Git-Bash setup — it silently fell back to "Reading additional input from stdin..." and never received EOF. Fix: pipe the prompt via heredoc into `codex exec -s read-only -C "<path>" -` (the trailing `-` forces stdin read). Works reliably; use this form for all future Codex re-checks in this repo.
