# Task T0.3 Report — JSON Data Schema Drafts

**Status**: DONE
**Commit**: `5c0d2a8`
**Branch**: `feat/beiluo-infineon-site`
**Date**: 2026-06-30

---

## Summary

Created 7 `src/data/*.schema.md` files defining the complete JSON data schema for all data files. Each schema document lists every field with name, type, required/optional, meaning, template placeholder mapping, and JSON-LD mapping.

---

## Files Created

| File | Covers | Key Quotas Noted |
|------|--------|-----------------|
| `src/data/site.schema.md` | brand, nav, footer, contact, seo, logo, jsonLd | 7 nav items, 4 footer columns, 2 contact channels |
| `src/data/home.schema.md` | hero, whyChooseUs, productsTeaser, solutionsTeaser, supportTeaser, newsTeaser, finalCta | 4 product cards, 3 solution/support/news teasers, 3 trust badges |
| `src/data/products.schema.md` | categories[]{slug,name,title,description,faeNote,icon,selectionGuideHref,columns[],models[]{all detail fields}} | 4 categories, ≥2 models each (8 total), 3–5 FAQ per model |
| `src/data/solutions.schema.md` | solutions[]{slug,title,summary,industry,blockDiagram,advantages[],bomList[],scenarios,body,related[]} | 5 solutions (milestone ≥4), body ≥800w, ≥3 BOM entries with internal links |
| `src/data/support.schema.md` | categories[], tags[], authors[], articles[]{all detail + toc, internalLinks, relatedArticles, pdf} | 4 categories, 4 detail articles, ≥1 author, auto-generated tag pages |
| `src/data/news.schema.md` | articles[]{slug,title,type,date,bannerImage,categoryTag,body,share} | 4 articles (≥1 company + ≥1 industry), body ≥800w, "Latest Industry News" 3-card rendering logic |
| `src/data/about.schema.md` | intro, history[], advantages[], cases[], customsDeclarations[], team[], cta | ≥4 timeline entries, ≥2 customs docs, ≥4 client cases |

---

## Acceptance Criteria Check

- [x] 7 `src/data/*.schema.md` files all created
- [x] Each file lists fields: name, type, required/optional, meaning, template placeholder, JSON-LD mapping
- [x] Count quotas annotated: products 4 categories / 8 detail models; solutions 5; news 4; support 4 detail + 4 category + authors + tag pages
- [x] Brand differentiation requirements noted in each file
- [x] Pure English constraint noted in each file header
- [x] All field names camelCase (for render.js / validate-data.js alignment)
- [x] JSON-LD mapping tables in each schema file (Organization+WebSite/home, BreadcrumbList/all non-home, ItemList+Product/product-category, Product/product-detail, TechArticle/tech-detail, NewsArticle/news-detail)
- [x] Git commit: `5c0d2a8` — "docs(T0.3): JSON data schema drafts (7 files)"

---

## Concerns

None. All 7 files are within scope and the commit is clean. Line-ending warnings (LF→CRLF) are Windows git config behavior and do not affect file content.
