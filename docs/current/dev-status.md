# dev-status.md — BeiLuo Infineon Site

> Last updated: 2026-07-05 (T6.4 implemented, reviewed, Codex-approved after 1 fix round; awaiting user confirmation to commit)

---

## 1. Branch / Worktree

- Branch: `feat/beiluo-infineon-site`
- Base: `main`
- Worktree: single (no linked worktrees active)
- Working tree: **dirty** — T6.4 work (`src/assets/js/form.js` new, `src/templates/contact.html` + `src/assets/css/style.css` modified, plus this doc/`todo_write.md`) is complete and Codex-approved but **not yet committed**, pending user confirmation.

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
| T6.4 | form.js **+ fixed a real T2.2 CSS contract deviation** (`style.css` styled `.is-error`, but `markup-contract.md` §4 mandates JS write `.is-invalid` — unused selector renamed to match contract) **+ added missing `.spinner`/`.is-submitted` CSS** (contract assigns these to "CSS 负责" but T2.2 never added them) | pending commit |

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
| Phase 7 (SEO/GEO) | T7.1–T7.5 | pending | Meta wiring, JSON-LD audit, sitemap, FAQ, image alt |
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
| Low | T5.4/T5.5 | `product-detail.html` and `solution-detail.html` use double-brace (HTML-escaped) interpolation inside `<script type="application/ld+json">` for some fields — since `<script>` content is raw text (not HTML-entity-decoded by JSON-LD consumers), a field containing `&`/`<`/`>`/quotes would corrupt the JSON. `products-list.html`/`support-list.html`/`tech-detail.html`/`news-list.html`/`news-detail.html`/`about.html`/`contact.html` already use the correct triple-brace form. Worth a follow-up cleanup pass on the two stragglers. |
| Low | all templates | `breadcrumb.html`'s `{{breadcrumbJsonLd}}` hook is never populated by `pages.js` anywhere — dead code. Every detail-type template works around it by hand-authoring `BreadcrumbList` JSON-LD inline instead. Consider either wiring the hook in pages.js or removing it from breadcrumb.html. |
| Low | links.js | Sitewide false positive: `footer.html` links to `/sitemap.xml` and `/robots.txt` on every page, but `findLinkIssues`'s valid-path set comes only from `buildPageList()` and never includes the separately-generated `sitemap.xml`/`robots.txt` files, so these 2 links are flagged "dead" on every single page. Fix in `links.js` or `build.js` (add sitemap.xml/robots.txt to the valid-URL set). |
| Low | T5.6 | Category-index/tag-page breadcrumb *display* (nav breadcrumb via `pages.js`'s `markCurrentLast`) is shallower than the BreadcrumbList JSON-LD authored in `support-list.html` — same pattern already present for `product-category` pages, likely intentional but worth confirming at T8.1. |
| Low | T4.4 | `support.json` data defect: article `infineon-optimos-mosfet-overview`'s `internalLinks` declares a model link to `/products/mosfet/irfs4321pbf/` that never actually appears in the article body text — `validate-data.js` doesn't cross-check `internalLinks[].href` against body content, so nothing catches it. |
| Low | T5.6/T5.7 | Tag badges (`support-card.html`, `tech-detail.html`) render the raw tag slug (`igbt`) instead of the human-readable `tag.name` (`IGBT`) — the per-article contexts only carry tag slugs, not resolved `Tag` objects. |
| Low | all list pages | `{{> sidebar}}` renders empty on every page that includes it (products-list/solutions-list/support-list/news-list/product-category/solution-detail) because `pages.js` never injects `sidebarSections` anywhere site-wide. |
| Low | T5.6/T5.7/T5.8/T6.1 | New `pages.js` context-enrichment fields added across T5.6–T6.1 (`guidesArticles`.../`authorInfo`/`relatedArticlesResolved`/`companyArticles`/`industryArticles`/`latestNews`/`authorType`/`overlayClass`/`shareTitleEncoded`/`shareUrlEncoded`/`rowCells`) have no committed unit test coverage — `tests/pages.test.js` uses a minimal stub fixture that doesn't exercise these; correctness was verified via disposable scripts during each review only. Candidate for T9.1/T9.4 coverage pass. |
| Low | T6.1 | `table-filter.js`'s range filter treats non-numeric/blank cell values as always-matching — an edge case, not currently reachable (no shipped model has a missing numeric param), worth tightening if empty numeric cells become possible later. |
| Low | T6.2 | `product-detail.html`'s `.tab-container` retains a leftover `data-tabs="product-detail"` attribute and the tablist div carries an extra `class="tab-list"` not mentioned in `markup-contract.md` §2 — both inert (unused by `tabs.js`, which selects by ARIA role), purely cosmetic. |
| Low | T5.10 | `contact.html`'s business-hours text ("Monday–Friday, 9:00–18:00 (GMT+8)") is a specific, unbacked claim with no corresponding `site.json` field. Not a broken link, just unverified descriptive copy. |
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
- ~~`style.css` styled `.is-error` but `markup-contract.md` §4 mandates JS write `.is-invalid` (unused selector, never referenced anywhere)~~ — fixed T6.4 (pending commit).

---

## 7. Codex Re-check Conclusions

Codex re-check is **MANDATORY** after every task (user rule, established 2026-06-30). Summary of outcomes, most recent first:

| Task | Codex Result |
|------|-------------|
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

---

## 8. Next Recommended Task

**T6.4 is done, pending commit.** Phase 6 (interactive JS) is now complete.

Recommended next steps in rough priority order:
1. Wire `navCategories` into `pages.js` (§6, High, ready now, small fix, widely impactful).
2. Phase 7 (T7.1–T7.5): Meta/JSON-LD/sitemap/FAQ/alt-text wiring.
3. Before or during T9.1: resolve the ~17 dead links and ~13 missing SVG assets (§6, both High) — T9.1's own acceptance criterion is zero dead links, so these need to be resolved by then regardless.
