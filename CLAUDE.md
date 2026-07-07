# CLAUDE.md — BeiLuo Infineon Distributor Site

## Project Overview

Pure-English SEO/GEO static site for BeiLuo (Infineon authorized distributor).
Stack: HTML + native CSS + Node.js (ESM). Zero runtime dependencies.

## Documentation Entry Points

| File | Purpose |
|------|---------|
| `docs/current/prd.md` | Product requirements (source of truth for scope/goals) |
| `docs/current/design.md` | UI/UX design spec (tokens, layout, components) |
| `docs/current/plan.md` | Implementation plan (task list with exact specs) |
| `docs/current/todo_write.md` | Executable task ledger (status: completed/in_progress/pending) |
| `docs/current/dev-status.md` | Current dev state (branch, tests, blockers, next task) |
| `.superpowers/sdd/progress.md` | SDD progress ledger (commits, review results, minor findings) |

## Active Branch

`feat/beiluo-infineon-site` — do NOT commit to `main`.

## Current Files in `docs/current/`

`prd.md`, `design.md`, `plan.md`, `todo_write.md`, `dev-status.md` (see table above). Audit checklists `check_list1.md`/`check_list2.md` live at repo root, not under `docs/current/`.

## Template Engine Rules (src/lib/render.js)

- `{{x}}` = HTML-escaped, `{{{x}}}` = raw (JSON-LD only, validated safe)
- `{{#if x}}…{{/if}}`, `{{#each arr}}…{{/each}}`, `{{> partial}}`
- pages.js context = `{ ...site, ...pageData, breadcrumb }` — ALL fields at ROOT
- **NEVER use `{{site.x}}`** — always `{{brand.name}}`, `{{contact.whatsapp}}`, etc.
- `{{#each}}` has NO parent-scope access — `{{../x}}` unsupported
- `{{this}}` for primitive string arrays (e.g. applications, advantages)
- Optional fields MUST be guarded: `{{#if x}}{{x}}{{/if}}`

## Data Field Aliases (actual JSON keys)

- `home.json`: `productsTeaser`, `whyChooseUs`, `solutionsTeaser`, `newsTeaser`, `finalCta`, `trustBar`, `hero.bgSvgSrc`
- `about.json`: `history` (array of {year,event}), `customsDeclarations`, `advantages`
- `support.json`: `articles`, `authors`, `categories`; each article has `contextLinks`, `relatedArticles`

## pages.js Context Contracts

- Every page gets a page-specific `seo` object: `{...site.seo, title, description, canonical}`
- head-meta.html falls back: `{{#if seo.title}}{{seo.title}}{{else}}{{seo.defaultTitle}}{{/if}}`
- product-detail: `model.availabilityUrl` injected by pages.js (inStock→schema/InStock, rfq→schema/BackOrder)
- support category pages: `articles` = filtered by `category.slug`
- support tag pages: `articles` = filtered by tag slug, `seo` injected

## AI Work Boundaries

- Execute tasks from `todo_write.md` in order; one task at a time
- Workflow: implementer subagent → task reviewer (spec + quality) → **codex re-check (MANDATORY)** → mark complete
- Never implement ahead of the current `in_progress` task
- Never re-design — follow plan.md verbatim
- Minor findings → record in progress.md; do NOT block task completion
- T10.x (deployment) is BLOCKED pending user credentials

## Test Command

```
npm test   # node --test; see docs/current/dev-status.md for current pass count
```

## Build Command

```
node src/build.js
```
