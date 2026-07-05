# dev-status.md — BeiLuo Infineon Site

> Last updated: 2026-07-05 (T7.4 committed; T7.5 audited and closed with no code changes needed — Phase 7 COMPLETE)

---

## 1. Branch / Worktree

- Branch: `feat/beiluo-infineon-site`
- Base: `main`
- Worktree: single (no linked worktrees active)
- Working tree: **clean** — all work through T7.5 is committed except this doc-only T7.5 closure, pending user confirmation.

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
| T5.3 | product-category.html | 2153780 + 0066bae + 7d6a530 (dynamic-column defect fixed later in T6.1, see below) |
| T5.4 | product-detail.html | 7a99552 + 8cb349f (Tab markup-contract deviation fixed later in T6.2, see below) |
| T5.5 | solutions-list.html + solution-detail.html | e469571 |
| T5.6 | support-list.html + support-card.html partial (overview/category/tag, 19 pages) | d9f6bce |
| T5.7 | tech-detail.html (author bar/sticky sidebar/longform typography/related articles/TechArticle JSON-LD, 4 articles) | 8d0f5c7 |
| T5.8 | news-list.html + news-detail.html + news-card.html partial + news.json body HTML fix (5 pages) | ea5b726 |
| T5.9 | about.html + author profile pages + about.json team[] data fix (3 pages) | ecefabf |
| T5.10 | contact.html (contact card + inquiry form markup hooks) | 4b5f1e0 |
| T6.1 | table-filter.js **+ fixed a real T5.3 defect** (product-category.html tbody was hardcoded, ignoring 6–8 dynamic columns per category) **+ markup-contract.md §1 alignment** | eafdec4 |
| T6.2 | tabs.js **+ fixed a real T5.4 markup-contract deviation** (product-detail.html's 5 tabs had no `data-tab`/`data-tabpanel`, wrong id scheme) | e551dfc |
| T6.3 | toc.js **+ fixed a Major scroll-highlight semantic bug** found in review (see §6) | 53c6c8f |
| T6.4 | form.js **+ fixed a real T2.2 CSS contract deviation** (`style.css` styled `.is-error`, but `markup-contract.md` §4 mandates JS write `.is-invalid` — unused selector renamed to match contract) **+ added missing `.spinner`/`.is-submitted` CSS** (contract assigns these to "CSS 负责" but T2.2 never added them) | 5b66e86 |
| T7.1 | **Audit-only, no code changes.** Confirmed via full-site build + programmatic scan of all 52 `dist/**/index.html` that every page already has a unique, keyword-bearing `<title>`/`<meta description>`/`<link canonical>` and exactly one `<h1>` — satisfied incrementally by `pages.js`'s per-page-type `seo` object construction across T1.6/T5.9/T5.10 (see those tasks' history). Zero duplicate titles, zero duplicate descriptions, zero pages falling back to `site.json`'s `defaultTitle`/`defaultDescription`. | d9e9ba8 |
| T7.2 | **Found and fixed 3 real defects while auditing G8 (7-type JSON-LD).** (1) `products-list.html`/`product-category.html`/`product-detail.html`/`solutions-list.html` had **zero** BreadcrumbList JSON-LD despite design.md §10 requiring it on every non-home template — fixed by wiring `context.breadcrumbJsonLd` in `pages.js` (via `schema.js`'s `breadcrumbList()`+`jsonLdScript()`, finally used for the first time since T1.3), which activates an existing-but-previously-dead `{{#if breadcrumbJsonLd}}` hook already sitting in `breadcrumb.html`. (2) `product-category.html` was missing the `ItemList` design.md §10 explicitly assigns it — added via `context.itemListJsonLd` (same `schema.js` functions). (3) 14 JSON-LD field interpolations across 4 templates used HTML-escaping double-brace `{{x}}` instead of raw triple-brace `{{{x}}}` — a latent data-corruption risk (script-tag content isn't HTML-entity-decoded by JSON-LD consumers) that hadn't yet triggered with the current dataset. Full post-fix scan: 103 JSON-LD blocks across 52 pages, 0 parse failures, BreadcrumbList=51 (every non-home page, exactly once), ItemList=4 (one per category, previously 0), no duplicates. | f32001c |
| T7.3 | **Audit confirmed sitemap.xml/robots.txt generation itself was already correctly wired** (T1.5/T1.7 — `build.js` already calls `buildSitemap()`/`buildRobots()`; `dist/sitemap.xml` had all 52 pages, absolute URLs, well-formed XML; `dist/robots.txt` had the correct 3 lines). **Found and fixed 1 real defect**: `build.js`'s dead-link validation (`findLinkIssues`) never included `sitemap.xml`/`robots.txt` themselves in its valid-path set, so `footer.html`'s links to both (present on every page) were false-flagged as dead site-wide — 104 false positives (52 pages × 2 links), reproduced exactly via `git stash` before/after comparison. Fixed with a 2-line addition in `assembleSite()` pushing placeholder entries for both paths into the link-check input before validation runs. Remaining dead-link count after fix: 25 (all pre-existing, real, T9.1-scope model-slug cross-reference mismatches — unrelated to this fix). | c373abd |
| T7.4 | **FAQ structure confirmed already satisfied, no code needed** — `product-detail.html`'s `<details>`/`<summary>` accordion reads `products.json`'s `model.faq` (8 models × 5 questions each, within the 3–5 PRD threshold); FAQPage JSON-LD deliberately not added since G8's 7-type list doesn't include it. **Found and fixed 1 real "authoritative statement" defect**: `contact.html` had 3 hardcoded occurrences of specific numeric commitments ("Monday–Friday, 9:00–18:00 (GMT+8)" business hours, "within 24 hours" response time) with no backing `site.json` field — unlike every other contact fact on the site, these had been sitting as free-floating hardcoded text since T5.10 (already flagged as a Low finding, left unresolved until this task). Fixed by adding `contact.businessHours`/`contact.responseTime` to `site.json` (+ `site.schema.md` docs) and switching all 3 template occurrences to reference them — output text is byte-for-byte identical (verified via `git stash` before/after diff on rendered `dist/contact/index.html`), only the source of truth changed from 3 independent hardcoded strings to 1 shared field. | f21a8be |
| T7.5 | **Audit-only, no code changes.** Full-site scan of all 172 `<img>` tags across 52 pages: 0 missing `alt`, 26 `alt=""` all correctly paired with `aria-hidden="true"` (decorative icons next to visible text labels — the WCAG-recommended pattern, not a defect), 146 descriptive keyword-bearing `alt` values (spot-checked 30+, zero generic placeholders like "image"/"icon"), 104 inline `<svg>` (all from `contact-float.html`'s WhatsApp/WeChat widget icons, all already `aria-hidden`). G11 already fully satisfied by existing per-template `alt`/`imageAlt` field wiring. **This closes Phase 7.** | (docs only, this commit) |

**Milestone: PHASE 5 COMPLETE (T5.1–T5.10).** All 12 templates (home, products-list, product-category, product-detail, solutions-list, solution-detail, support-list, tech-detail, news-list, news-detail, about, contact) are built, reviewed, and Codex-approved. `node src/build.js` now runs end-to-end for the first time — see §6 for what that surfaced.

**Milestone: PHASE 6 COMPLETE (T6.1–T6.4).** All 4 interactive JS modules (table-filter, tabs, toc, form) are built and Codex-approved.

**Recurring pattern this session (T6.1–T6.4):** each Phase-6 JS task started by checking whether its target template/CSS actually matched `markup-contract.md`. Three out of four times (T6.1→T5.3, T6.2→T5.4, T6.4→T2.2) it didn't, and the earlier work had to be fixed first — in all three cases the underlying defect was more than a naming nitpick (T5.3's tbody was silently dropping most of the dynamic column data; T5.4's Tab markup had no `data-tab`/`data-tabpanel` at all; T2.2's CSS styled a class name `form.js` per contract would never write, so the error-state red border would never have appeared). **Check contract compliance before writing any further interactive JS — don't assume earlier "Codex-approved" work actually matches the contract it's supposed to.**

---

## 3. Current In-Progress

**None — Phase 6 (interactive JS) is complete.** See §8 for the recommended next task.

---

## 4. Pending Tasks Overview

| Phase | Tasks | Status | Description |
|-------|-------|--------|-------------|
| Phase 6 (JS) | T6.1–T6.4 | **complete** | table-filter/tabs/toc/form — all Codex-approved |
| Phase 7 (SEO/GEO) | T7.1–T7.5 | **complete** | Meta wiring + JSON-LD + sitemap/robots + FAQ/GEO + image alt — all done |
| Phase 8 (Final sweep) | T8.1–T8.2 | pending | check_list1 + check_list2 final scan |
| Phase 9 (Integration) | T9.1–T9.5 | pending | Full build + zero-dead-link verification, browser tests, code review, PRD milestone verification, Codex full-product re-check |
| Phase 10 (Deploy) | T10.1–T10.3 | **BLOCKED** | Awaiting GitHub + Cloudflare credentials from user |
| Phase 11 (Wrap-up) | T11.1–T11.4 | pending | CLAUDE.md/dev-status final sync, branch finish, memory update |

Full task list with per-task completion criteria: `docs/current/todo_write.md`.

---

## 5. Last Test / Lint / Build Results

- **`npm test`**: **363/363 passing, 0 failures** (last run: end of T6.4, 2026-07-05)
- **`node src/build.js`**: now completes structurally (every page has a template — Phase 5 is complete) but **exits non-zero** due to `links.js`'s zero-dead-link gate catching real issues — see §6 High-severity items. This is expected/known, not a regression to fix blindly; resolving it is T9.1's explicit job.
- **Lint**: no lint config in this project; ESM + Node.js built-ins only, no linter configured.

---

## 6. Known Issues (Not Yet Fixed)

### High severity — should be triaged before T9/launch

| Source | Issue |
|--------|-------|
| T4.6/T3.x | `about.json`'s `advantages[]` (6 icons), `cases[]` (4 logos), `customsDeclarations[]` (3 images) reference ~13 SVG files under `src/assets/svg/icons/` and `src/assets/svg/illustrations/` that **do not exist on disk** (confirmed via `fs.existsSync`; only `about-hero.svg` exists). `about.html` is the first template to render these as visible `<img>` tags, so the About page's advantage icons, client logos, and — critically — the **PRD §3.7-mandated customs-declaration trust section** currently show broken images. Needs a dedicated SVG-asset-generation task (extends T3.x scope). |
| T4.2/T4.6, surfaced when Phase 5 completed | The first successful end-to-end `node src/build.js` run surfaced **~17 distinct real dead links** (~25 occurrences), separate from the known sitemap.xml/robots.txt false positive below: (1) `home.html`'s Solutions/Support teasers link to `/solutions/motor-drive/`, `/solutions/ev-charging/`, `/solutions/industrial-automation/`, `/support/application-notes/infineon-coolmos-pfc-application/` — none of which exist in `solutions.json`/`support.json`; (2) `product-detail.html`'s `alternativeParts`/`companionParts` in `products.json` cross-reference part-number slugs with no matching real model (e.g. `tc264da`→`tc265da`, `xmc4700-...`→`xmc4800-...`, `ikw40n120h3`→`ikw50n65el5`, several MOSFET/sensor cross-refs). Predates Phase 5 entirely — masked until now because `build.js` always failed early at a missing template before reaching link validation. This is squarely **T9.1**'s job ("全量构建+死链/空链零容忍校验"); flagged here so it doesn't surprise that task. Fix requires either adding the missing product/solution entries or correcting the dangling slug references. |
| T2.4, unblocked now | `navCategories` was never wired into `pages.js`'s page context (derived from `products.categories`, `featuredModels` = first 2 models per category) — nav mega-menu currently renders 0 categories site-wide, gracefully but incompletely. Was deliberately deferred to "after Phase 5 template work" — **Phase 5 is now done**, so this is unblocked and should be picked up soon (candidate for T7.x or an earlier ad-hoc fix, since it affects every page's nav on every already-shipped template). |

### Medium/Low severity — triage at T8.1/T8.2 final sweep

| Severity | Source | Issue |
|----------|--------|-------|
| Low | T0.1 | `README.md` directory tree lists `src/build.js` before it existed — self-resolved now. |
| Low | T4.7 | `milestones-alternative` test couples to real `about.json` layout (`history` key). |
| Low | T4.7 | `logo.src/alt` allow whitespace-only strings (uses `=== ''` not `nonEmptyString`). |
| Low | T4.7 | No edge-case tests for `validateData(null/undefined/{})`. |
| Low | T4.7 | Missing failure-mode tests for `contact.wechat`, `seo.siteName`, `logo.alt/width/height`, `jsonLd.organizationType`. |
| Low | T5.2 | Triple-brace `{{{seo.title/description}}}` in JSON-LD — safe (pages.js builds from validate-data-checked fields only); revisit if a CMS ever feeds these fields. |
| Low | T5.6 | Category-index/tag-page breadcrumb *display* (nav breadcrumb via `pages.js`'s `markCurrentLast`) is shallower than the BreadcrumbList JSON-LD authored in `support-list.html` — same pattern already present for `product-category` pages, likely intentional but worth confirming at T8.1. |
| Low | T4.4 | `support.json` data defect: article `infineon-optimos-mosfet-overview`'s `internalLinks` declares a model link to `/products/mosfet/irfs4321pbf/` that never actually appears in the article body text — `validate-data.js` doesn't cross-check `internalLinks[].href` against body content, so nothing catches it. |
| Low | T5.6/T5.7 | Tag badges (`support-card.html`, `tech-detail.html`) render the raw tag slug (`igbt`) instead of the human-readable `tag.name` (`IGBT`) — the per-article contexts only carry tag slugs, not resolved `Tag` objects. |
| Low | all list pages | `{{> sidebar}}` renders empty on every page that includes it (products-list/solutions-list/support-list/news-list/product-category/solution-detail) because `pages.js` never injects `sidebarSections` anywhere site-wide. |
| Low | T5.6/T5.7/T5.8/T6.1 | New `pages.js` context-enrichment fields added across T5.6–T6.1 (`guidesArticles`.../`authorInfo`/`relatedArticlesResolved`/`companyArticles`/`industryArticles`/`latestNews`/`authorType`/`overlayClass`/`shareTitleEncoded`/`shareUrlEncoded`/`rowCells`) have no committed unit test coverage — `tests/pages.test.js` uses a minimal stub fixture that doesn't exercise these; correctness was verified via disposable scripts during each review only. Candidate for T9.1/T9.4 coverage pass. |
| Low | T6.1 | `table-filter.js`'s range filter treats non-numeric/blank cell values as always-matching — an edge case, not currently reachable (no shipped model has a missing numeric param), worth tightening if empty numeric cells become possible later. |
| Low | T6.2 | `product-detail.html`'s `.tab-container` retains a leftover `data-tabs="product-detail"` attribute and the tablist div carries an extra `class="tab-list"` not mentioned in `markup-contract.md` §2 — both inert (unused by `tabs.js`, which selects by ARIA role), purely cosmetic. |
| Low | T4.6 | `about.schema.md` specifies `advantages` should be 3–5 items; `about.json` has 6 — non-blocking. |
| Low | T2.2/T6.4 | `markup-contract.md` §4 附录速查表 assigns `.form-group` layout to "CSS 负责", but `style.css`'s Form Base section (T2.2) never added a `.form-group` rule — the class is present in `contact.html` markup but unstyled (relies on default block spacing). Purely cosmetic, not fixed in T6.4 scope (out of that task's boundary). |

**Fixed this session** (kept here for traceability, not action items):
- ~~`product-detail.html` Tab markup deviated from `markup-contract.md` §2~~ — fixed T6.2 (e551dfc).
- ~~`product-category.html` tbody was hardcoded, silently dropping dynamic columns~~ — fixed T6.1 (eafdec4).
- ~~`news.json` article bodies were plain markdown text, not HTML~~ — fixed T5.8 (ea5b726).
- ~~`about.json` `team[]` referenced a fabricated author not in `support.json`~~ — fixed T5.9 (ecefabf).
- ~~`/about/authors/` breadcrumb crumb was a dead link~~ — fixed T5.9 (ecefabf).
- ~~`contact.html` success message had a fabricated `mailto:` address~~ — fixed T5.10 (4b5f1e0).
- ~~`toc.js` scroll-highlight only flashed briefly instead of staying active while reading a section~~ — fixed T6.3 (53c6c8f).
- ~~`style.css` styled `.is-error` but `markup-contract.md` §4 mandates JS write `.is-invalid` (unused selector, never referenced anywhere)~~ — fixed T6.4 (5b66e86).
- ~~`product-detail.html`/`solution-detail.html` used double-brace escaped interpolation inside JSON-LD `<script>` blocks~~ — fixed T7.2 (f32001c), plus 2 more templates (`product-category.html`/`solutions-list.html`) with the same defect discovered during the same audit.
- ~~`breadcrumb.html`'s `{{breadcrumbJsonLd}}` hook was never populated by `pages.js` — dead code~~ — fixed T7.2 (f32001c): now populated for the 4 templates that previously had zero BreadcrumbList JSON-LD.
- ~~`links.js`/`build.js` sitewide false positive: `footer.html`'s links to `/sitemap.xml`/`/robots.txt` flagged dead on every page~~ — fixed T7.3 (c373abd).
- ~~`contact.html`'s business-hours/response-time text was a specific, unbacked claim with no corresponding `site.json` field~~ — fixed T7.4 (pending commit): added `contact.businessHours`/`contact.responseTime` fields.

---

## 7. Codex Re-check Conclusions

Codex re-check is **MANDATORY** after every task (user rule, established 2026-06-30). Summary of outcomes, most recent first:

| Task | Codex Result |
|------|-------------|
| T7.5 | **Approved**, after 3 attempts failed on Codex-side websocket connectivity errors unrelated to the task (`codex doctor` confirmed `websocket`/`reachability` failures at the time — a transient network condition, not a quoting or sandbox issue). 4th attempt succeeded cleanly with the file-based script: 172 imgs, 0 missing alt, 0 empty-alt-without-aria-hidden (the key pass/fail signal), 26 correctly-decorative empty alts, 146 descriptive alts, 0 generic placeholders, 0 inline SVGs lacking accessibility treatment. Internal reviewer independently re-ran the entire audit from scratch (not trusting the numbers) and got identical results. |
| T7.4 | Round 1: **REJECT**, but on false grounds — Codex's own `-s read-only` sandbox couldn't spawn Node's per-test-file child processes (`spawn EPERM`), reported as "npm test unconfirmed" and also flagged `CLAUDE.md`/`todo_write.md` appearing in `git diff --name-only` as scope creep. Both objections were addressed with evidence in a same-task clarification follow-up: 3 independent real-environment `npm test` runs (2 by the controller, 1 by the internal reviewer) all showed 363/363 pass; `CLAUDE.md`'s diff was a pre-existing unrelated change and `todo_write.md`'s diff was the single expected `pending`→`in_progress` status line. Round 2: **Approved** after reviewing this evidence — the core audit (FAQ structure, contact-text byte-for-byte integrity via `git stash` diff, no `Missing field` errors, diff scoped to 3 files) had already passed in round 1 and remained the basis for the reversed verdict. |
| T7.3 | **Approved**, first attempt with the file-based verification script (no findings from the T7.2 tooling issue this time). Confirmed: `dist/sitemap.xml` well-formed with 52 absolute-URL `<loc>` entries, `dist/robots.txt` has all 3 required lines, `[dead] /sitemap.xml`/`/robots.txt` false positives dropped from 104 to 0, remaining 25 dead-link lines unchanged (pre-existing, T9.1-scope). Internal reviewer separately verified the same numbers plus reproduced the before/after delta via `git stash` (129 total dead lines before the fix, 25 after — exact match). |
| T7.2 | **Approved.** First 2 attempts were false-REJECTs caused by the Codex tool call itself: constructing an inline `node -e "..."` verification one-liner through bash-heredoc→codex→PowerShell triple quoting corrupted the regex, producing `TOTAL_BLOCKS=0` (0 JSON-LD blocks found on a 52-page site — an implausible result that should have been treated as a tooling failure, not evidence). Fixed by writing the verification script to a file and having Codex execute it by path instead of authoring inline shell. Real result: 103 JSON-LD blocks, 0 parse failures, BreadcrumbList=51/52 (every non-home page), ItemList=4 (new), 0 duplicates. Internal reviewer separately APPROVEd with the same independently-run numbers, plus flagged 2 Low items (no direct unit-test assertions for the new context fields; task-description miscounted "5" vs actual "14" brace-fix sites — cosmetic, not a code defect). |
| T7.1 | **Approved.** Audit-only task — Codex independently ran a full-site scan (52 pages) confirming zero duplicate titles/descriptions, zero missing title/description/canonical, all pages exactly 1 `<h1>`, and zero pages falling back to `site.json`'s default SEO strings. Internal reviewer had separately reached the same conclusion first. No code changes made or needed. |
| T6.4 | Round 1: **REJECT** — a real degradation-path bug: `showSuccess()`'s fallback `<p>` (inserted when `[data-success]` is missing from the DOM, per contract §4.5) had no `data-success` attribute, so the `.is-submitted > *:not([data-success])` CSS rule (added this task) would hide it the instant it was appended — the fallback text would never actually be visible. Fixed by giving the fallback `<p>` a `data-success` attribute so it's excluded from the hide rule. Round 2: **Approved**, confirmed the fix resolves the exact failure mode and searched all `[data-success]` usages for new conflicts (none found). Internal reviewer (before Codex) had separately APPROVEd with no findings — this bug was Codex-only, underscoring why the recheck is mandatory even after an internal APPROVE. |
| T6.3 | **Approved.** Internal reviewer first REJECTed for 1 Major: scroll-highlight observed heading elements themselves with a narrow top-30%-viewport `rootMargin` and removed the highlight the instant a heading exited that band, so the TOC showed no highlight for most of actual reading time. Fixed by tracking a single `activeId` that only advances when a new heading enters the band. Codex traced the exact transition sequence through the contract's own example and confirmed correctness. |
| T6.2 | **Approved**, no issues. Internal reviewer also APPROVE; additionally executed the real `tabs.js` against a constructed fake-DOM harness (18 assertions) rather than just reading the code. |
| T6.1 | **Approved.** Internal reviewer found 1 Major: unguarded `{{value}}` in the table-cell template would crash the *entire site build* if any future model lacked a declared column's param. Fixed at the source in `pages.js` (coalesce missing values to `''`, preserving legitimate `0` — NOT a template `{{#if value}}` guard, which would have hidden real zeros). Codex found 1 new Minor (range filter edge case, non-blocking). |
| T5.10 | **Approved**, no new issues. Internal reviewer found and fixed a fabricated `mailto:sales@beiluo.com` (copied from the contract doc's illustrative example, not real data) — replaced with real WhatsApp/WeChat channels. |
| T5.9 | **Approved**, no new issues. Internal reviewer REJECTed for 1 Major dead link (`/about/authors/` breadcrumb crumb pointed to a non-existent page) — fixed. |
| T5.8 | **Approved**, no new issues. Internal reviewer first REJECTed for 2 Major (unstyled card classes, unencoded share URLs) — both fixed. |
| T5.7 | Round 1: 2 High found (missing `.longform` reuse, Related Articles polluting TOC scan scope) → both fixed → Round 2: **Approved**. |
| T5.6 | **Approved**, no new issues. Internal reviewer first REJECTed for 2 Major (missing tag rendering, CSS-hack duplication instead of server-side pre-filter) — both fixed. |
| T5.5 | **Approved**, no issues found. |
| T5.1–T5.4, T4.7 | All approved after fix rounds (High/Med/Low findings resolved) — see `.superpowers/sdd/progress.md` for full per-task detail if needed. |

**Tooling note for future Codex invocations in this repo:** `codex exec -s read-only ...` hangs indefinitely if the prompt is passed as a quoted CLI argument on this Windows/Git-Bash setup (silently waits on stdin, never receives EOF — confirmed via `codex doctor` that network/auth were healthy, so this is an argv-parsing quirk, not an outage). **Fix:** pipe the prompt via heredoc instead: `cat <<'EOF' | codex exec -s read-only -C "<path>" - ... EOF` (the trailing `-` forces stdin read). This works reliably and should be used for all future Codex re-checks in this repo.

**Second tooling note (T7.1):** when a recheck prompt asks Codex to *construct its own* multi-line inline `node -e "..."`/`rg`/`grep -P` command from an open-ended instruction, it drives that command through Windows PowerShell and its own quote-escaping frequently mismatches PowerShell's parser (single/double-quote nesting inside `-Command`), burning 1-2 minutes of retries or timing out entirely (hit once this task). **Fix:** hand Codex a complete, already-correct one-liner command to run verbatim (as done for T7.1's second attempt) rather than describing what to check and letting it author the command itself — it still authors its own verification for anything not explicitly scripted, just skips the fragile self-authored-shell-escaping step for the core data pull.

**Third tooling note (T7.2):** even a pre-written one-liner isn't safe if it contains regex/quotes — Codex still relays it through bash-heredoc→codex-exec→PowerShell, and one of those layers can silently mangle escape sequences, producing a **plausible-looking but wrong result** (T7.2's first attempt returned `TOTAL_BLOCKS=0`, which Codex initially reported as a genuine REJECT rather than recognizing "zero JSON-LD blocks on a 52-page site" as an implausible number worth double-checking before concluding). **Fix:** for anything beyond a trivial command, write the verification script to a file first (`Write`) and have Codex's prompt just say "run `node <path-to-script>`" with no inline quoting at all — this fully sidesteps the multi-layer-escaping problem. Also: when a recheck result looks like "no data found" rather than "data found and it's wrong," treat that as a signal to re-verify the check itself before trusting a REJECT. **Confirmed working in T7.3**: the file-based script approach got a clean first-attempt APPROVE with zero retries — adopt this as the default method going forward, not just a fallback after a failed inline attempt. One more wrinkle to watch for: if the script itself reads another generated file (e.g. a saved build-log), save that file to a plain Windows path too (not bash's `/tmp`, which doesn't reliably resolve from the PowerShell process Codex shells out to).

**Fourth tooling note (T7.4):** `codex exec -s read-only` cannot run `npm test` (or anything spawning child processes) — every test file fails at spawn time with `spawn EPERM`, unrelated to the actual test suite's health. Codex's first instinct was to report this as "npm test unconfirmed" and lean toward REJECT; it only reversed to APPROVE after being shown 3 independent real-environment `npm test` results (363/363 pass each) as evidence that this was a sandbox limitation, not a regression. **Takeaway:** don't ask Codex to run `npm test` (or any command that spawns processes) directly — either skip that check in the recheck prompt and supply your own fresh-run evidence up front, or expect a spurious REJECT and be ready to follow up with a clarification round citing independent real-environment results rather than re-arguing in the abstract.

**Fifth tooling note (T7.5):** distinct from all the above — a genuine transient network failure. 3 consecutive `codex exec` invocations failed with repeated `websocket`/`tls handshake eof` errors before any model response, confirmed as a real (if temporary) connectivity problem via `codex doctor` (`websocket` and `reachability` checks both failed at the time). This is NOT a quoting/sandbox issue — no amount of prompt rewriting fixes it. **Takeaway:** if `codex exec` fails before producing any assistant output (as opposed to failing mid-task or giving a wrong answer), run `codex doctor` to distinguish "Codex is unreachable right now" from "my prompt/script is broken," and simply retry after a short wait — the 4th attempt in this case succeeded cleanly with the identical prompt.

---

## 8. Next Recommended Task

**T7.5 is done (audit-only, no code changes), pending commit of the doc update.** Phase 7 (SEO/GEO) is now **fully complete** (T7.1–T7.5).

**Next up: Phase 8 — T8.1 (check_list1.md 全模板终扫) then T8.2 (check_list2.md 全JSON终扫).**

Recommended order:
1. Wire `navCategories` into `pages.js` (§6, High, ready now, small fix, widely impactful — still not done, deliberately not bundled into any Phase 7 task since it was out of scope for each).
2. T8.1 then T8.2.
3. Before or during T9.1: resolve the ~17 dead links and ~13 missing SVG assets (§6, both High) — T9.1's own acceptance criterion is zero dead links, so these need to be resolved by then regardless.
