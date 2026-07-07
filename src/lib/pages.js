/**
 * pages.js — data → page-list mapping (T1.6)
 *
 * export function buildPageList(data)
 *   data: { site, home, products, solutions, support, news, about }
 *   returns Page[]
 *
 * Page = { url, template, context, breadcrumb }
 *   url        — directory form with trailing slash, e.g. '/products/igbt/'  (home = '/')
 *   template   — one of: home / about / contact / products-list / product-category /
 *                product-detail / solutions-list / solution-detail / support-list /
 *                tech-detail / news-list / news-detail
 *   context    — { ...site, ...page-specific fields, breadcrumb }
 *   breadcrumb — [{name, url}]  (home is [])
 */

import { slugify, uniqueSlug } from './slugify.js';
import { breadcrumbList, itemList, jsonLdScript } from './schema.js';

/**
 * Helper — create a single breadcrumb item.
 * @param {string} name
 * @param {string} url
 * @returns {{ name: string, url: string }}
 */
function bc(name, url) {
  return { name, url };
}

/**
 * Mark the last item of a breadcrumb array with current:true (in-place).
 * No-op for empty arrays (home page).
 * @param {Array<{name:string, url:string}>} arr
 * @returns {Array}
 */
function markCurrentLast(arr) {
  if (arr.length > 0) {
    arr[arr.length - 1].current = true;
  }
  return arr;
}

/**
 * Build a ready-to-embed BreadcrumbList <script> tag from a breadcrumb array,
 * absolutizing each crumb's site-relative url against site.jsonLd.organizationUrl
 * — matches the convention already used by every hand-authored BreadcrumbList
 * block in the other templates (e.g. contact.html, solution-detail.html).
 * @param {Array<{name:string,url:string}>} breadcrumb
 * @param {object} site
 * @returns {string}
 */
function breadcrumbJsonLdFor(breadcrumb, site) {
  return jsonLdScript(breadcrumbList(breadcrumb.map(c => ({
    name: c.name,
    url: site.jsonLd.organizationUrl + c.url,
  }))));
}

/**
 * Build a single-group `sidebarSections` array for the shared sidebar.html
 * partial (design.md §4.4's "category navigation tree", highlighting the
 * current page). One group only — none of this site's sidebars need more
 * than one heading.
 * @param {string} title
 * @param {Array<{name:string, url:string}>} items
 * @param {string} [currentUrl] - marks the matching item active:true
 * @returns {Array<{title:string, items:Array}>}
 */
function sidebarNav(title, items, currentUrl) {
  return [{ title, items: items.map(i => ({ ...i, active: i.url === currentUrl })) }];
}

/**
 * Build the full page list from all JSON data objects.
 *
 * @param {{ site, home, products, solutions, support, news, about }} data
 * @returns {Array<{ url: string, template: string, context: object, breadcrumb: Array }>}
 */
export function buildPageList(data) {
  const { home, products, solutions, support, news, about } = data;

  // Mega Menu data: 2 featured models per product category, attached to the
  // "Products" nav item so nav.html can render it via {{#each navCategories}}
  // from within {{#each nav.items}} — render.js's {{#each}} has no
  // parent-scope access, so navCategories must live on that item itself,
  // not as a sibling top-level field.
  const navCategories = products.categories.map(category => ({
    slug: category.slug,
    name: category.name,
    featuredModels: category.models.slice(0, 2).map(m => ({ partNo: m.partNo, href: m.href })),
  }));
  const site = {
    ...data.site,
    nav: {
      ...data.site.nav,
      items: data.site.nav.items.map(item => (item.megaMenu ? { ...item, navCategories } : item)),
    },
  };

  const pages = [];

  // ── 1. Home ─────────────────────────────────────────────────────────────────
  {
    const breadcrumb = [];
    // seo must be merged explicitly (site.seo, then home.seo) — {...site, ...home}
    // alone lets home.json's flat seo:{title,description,canonical} completely
    // replace site.seo, silently dropping siteName/defaultTitle/defaultDescription.
    const seo = { ...site.seo, ...home.seo };
    pages.push({
      url: '/',
      template: 'home',
      context: { ...site, ...home, seo, breadcrumb },
      breadcrumb,
    });
  }

  // ── 2. About ────────────────────────────────────────────────────────────────
  {
    const breadcrumb = markCurrentLast([bc('Home', '/'), bc('About Us', '/about/')]);
    // seo must be merged explicitly — see the identical fix/comment on the Home
    // page above (about.json's flat seo:{title,description,canonical} would
    // otherwise silently replace site.seo, dropping siteName/defaultTitle/etc).
    const seo = { ...site.seo, ...about.seo };
    pages.push({
      url: '/about/',
      template: 'about',
      context: { ...site, ...about, seo, breadcrumb },
      breadcrumb,
    });
  }

  // ── 3. Contact ──────────────────────────────────────────────────────────────
  {
    const breadcrumb = markCurrentLast([bc('Home', '/'), bc('Contact', '/contact/')]);
    // Per-page seo object (contact page had no `seo` before, which meant it
    // fell back to site.seo.defaultTitle — same duplicate-title gap fixed for
    // author pages in T5.9's pages.js change).
    const seo = { ...site.seo, title: `Contact ${site.brand.name} — Infineon Authorized Distributor`, description: `Contact ${site.brand.name} for Infineon component quotes, technical support, and stock inquiries. WhatsApp and WeChat available for instant response.`, canonical: '/contact/' };
    pages.push({
      url: '/contact/',
      template: 'contact',
      context: { ...site, seo, breadcrumb },
      breadcrumb,
    });
  }

  // ── 4. Products list ─────────────────────────────────────────────────────────
  {
    const breadcrumb = markCurrentLast([bc('Home', '/'), bc('Products', '/products/')]);
    const seo = { ...site.seo, title: `Infineon Products | ${site.brand.name}`, description: `Browse ${site.brand.name} authorized Infineon products: MCU, IGBT, MOSFET and Sensors. Deep stock, FAE support, global delivery.`, canonical: '/products/' };
    const breadcrumbJsonLd = breadcrumbJsonLdFor(breadcrumb, site);
    const sidebarSections = sidebarNav('Product Categories', products.categories.map(c => ({ name: c.name, url: `/products/${c.slug}/` })));
    pages.push({
      url: '/products/',
      template: 'products-list',
      context: { ...site, seo, categories: products.categories, breadcrumb, breadcrumbJsonLd, sidebarSections },
      breadcrumb,
    });
  }

  // ── 5. Product category pages + 6. Product detail pages ─────────────────────
  for (const category of products.categories) {
    const catUrl = `/products/${category.slug}/`;

    // Category index page
    {
      const breadcrumb = markCurrentLast([bc('Home', '/'), bc('Products', '/products/'), bc(category.name, catUrl)]);
      const seo = { ...site.seo, title: `${category.title} | ${site.brand.name}`, description: category.metaDescription, canonical: catUrl };
      const breadcrumbJsonLd = breadcrumbJsonLdFor(breadcrumb, site);
      const itemListJsonLd = jsonLdScript(itemList(category.models.map(m => ({ name: m.partNo, url: site.jsonLd.organizationUrl + m.href }))));
      // Pre-compute each model's table row cells in category.columns order (markup-contract.md
      // §1: dynamic spec-table columns). render.js's {{#each}} has no parent-scope access, so
      // the th↔td key alignment and params-vs-top-level field lookup must happen here rather
      // than via a nested {{#each category.columns}} inside the row template.
      const categoryWithRowCells = {
        ...category,
        models: category.models.map(model => ({
          ...model,
          // Absolute product URL for Product JSON-LD (schema requires an absolute
          // url) — computed here since {{#each category.models}} has no
          // parent-scope access to the top-level jsonLd.organizationUrl.
          absoluteHref: `${site.jsonLd.organizationUrl}${model.href}`,
          rowCells: category.columns.map(col => {
            const raw = model[col.key] !== undefined ? model[col.key] : (model.params ? model.params[col.key] : undefined);
            return {
              key: col.key,
              // Coalesce missing values to '' (not left undefined/null) so the bare
              // {{value}} template output never throws render.js's "Missing field"
              // error — and so a legitimate numeric 0 isn't mistaken for "missing"
              // by an {{#if}} guard (render.js's isTruthy treats 0 as falsy).
              value: raw !== undefined && raw !== null ? raw : '',
              sticky: !!col.sticky,
              isPartNo: col.key === 'partNo',
              isStock: col.key === 'stock',
              href: model.href,
            };
          }),
        })),
      };
      const sidebarSections = sidebarNav('Product Categories', products.categories.map(c => ({ name: c.name, url: `/products/${c.slug}/`, icon: c.icon })), catUrl);
      // design §5.3 feature-card row (Key Parameters | Typical Models | Applications |
      // Advantages) needs a deduplicated, capped applications list — computed here
      // since {{#each}} has no parent-scope access to dedupe across category.models.
      const seenApplications = new Set();
      const topApplications = [];
      for (const model of category.models) {
        for (const app of model.applications || []) {
          if (!seenApplications.has(app)) {
            seenApplications.add(app);
            topApplications.push(app);
          }
        }
      }
      pages.push({
        url: catUrl,
        template: 'product-category',
        context: { ...site, seo, category: categoryWithRowCells, topApplications: topApplications.slice(0, 6), breadcrumb, breadcrumbJsonLd, itemListJsonLd, sidebarSections },
        breadcrumb,
      });
    }

    // Product detail pages — uniqueSlug scoped per category
    const usedModelSlugs = new Set();
    for (const model of category.models) {
      const modelSlug = uniqueSlug(model.partNo, usedModelSlugs);
      const modelUrl = `/products/${category.slug}/${modelSlug}/`;
      const breadcrumb = markCurrentLast([
        bc('Home', '/'),
        bc('Products', '/products/'),
        bc(category.name, catUrl),
        bc(model.partNo, modelUrl),
      ]);
      const seo = { ...site.seo, title: `${model.partNo} ${category.name} | ${site.brand.name}`, description: `${model.partNo} — ${model.shortDescription}`, canonical: modelUrl };
      const availabilityUrl = model.stock === 'inStock' ? 'https://schema.org/InStock' : 'https://schema.org/BackOrder';
      const modelWithAvailability = { ...model, availabilityUrl };
      const breadcrumbJsonLd = breadcrumbJsonLdFor(breadcrumb, site);
      pages.push({
        url: modelUrl,
        template: 'product-detail',
        context: { ...site, seo, category, model: modelWithAvailability, breadcrumb, breadcrumbJsonLd },
        breadcrumb,
      });
    }
  }

  // ── 7. Solutions list ────────────────────────────────────────────────────────
  {
    const breadcrumb = markCurrentLast([bc('Home', '/'), bc('Solutions', '/solutions/')]);
    const seo = { ...site.seo, title: `Infineon Application Solutions | ${site.brand.name}`, description: `Explore ${site.brand.name} Infineon-based application solutions: motor drive, EV charger, industrial IoT, MCU embedded control, and solar inverter.`, canonical: '/solutions/' };
    const breadcrumbJsonLd = breadcrumbJsonLdFor(breadcrumb, site);
    const sidebarSections = sidebarNav('Solutions by Industry', solutions.solutions.map(s => ({ name: s.industry, url: `/solutions/${s.slug}/` })));
    pages.push({
      url: '/solutions/',
      template: 'solutions-list',
      context: { ...site, seo, solutions: solutions.solutions, breadcrumb, breadcrumbJsonLd, sidebarSections },
      breadcrumb,
    });
  }

  // ── 8. Solution detail pages ─────────────────────────────────────────────────
  for (const solution of solutions.solutions) {
    const solutionUrl = `/solutions/${solution.slug}/`;
    const breadcrumb = markCurrentLast([bc('Home', '/'), bc('Solutions', '/solutions/'), bc(solution.title, solutionUrl)]);
    const seo = { ...site.seo, title: `${solution.title} | ${site.brand.name}`, description: solution.metaDescription, canonical: solutionUrl };
    // design §5.6 requires separate "related solutions" and "related products"
    // sidebar sections (not one merged list) — solution.related[].type
    // distinguishes them.
    const related = solution.related || [];
    const relatedSolutions = related.filter(r => r.type === 'solution').map(r => ({ name: r.title, url: r.href }));
    const relatedProducts = related.filter(r => r.type === 'product').map(r => ({ name: r.title, url: r.href }));
    const sidebarSections = [
      ...sidebarNav('Related Solutions', relatedSolutions),
      ...sidebarNav('Related Products', relatedProducts),
    ];
    pages.push({
      url: solutionUrl,
      template: 'solution-detail',
      context: { ...site, seo, solution, breadcrumb, sidebarSections },
      breadcrumb,
    });
  }

  // ── 9. Support overview ──────────────────────────────────────────────────────
  {
    const breadcrumb = markCurrentLast([bc('Home', '/'), bc('Support', '/support/')]);
    const seo = { ...site.seo, title: `Infineon Support & Technical Guides | ${site.brand.name}`, description: `${site.brand.name} technical support: Infineon component selection guides, application notes, and FAE Q&A for MCU, IGBT, MOSFET and Sensors.`, canonical: '/support/' };
    // Pre-filtered per-category article arrays for the overview page's 4 tab
    // panels (support.json's categories are locked to these 4 slugs — see
    // support-list.html's hand-authored tabs for the same assumption).
    const guidesArticles = support.articles.filter(a => a.category === 'guides');
    const applicationNotesArticles = support.articles.filter(a => a.category === 'application-notes');
    const troubleshootingArticles = support.articles.filter(a => a.category === 'troubleshooting');
    const reviewsArticles = support.articles.filter(a => a.category === 'reviews');
    const sidebarSections = sidebarNav('Support Categories', support.categories.map(c => ({ name: c.name, url: `/support/${c.slug}/` })));
    pages.push({
      url: '/support/',
      template: 'support-list',
      context: { ...site, ...support, seo, guidesArticles, applicationNotesArticles, troubleshootingArticles, reviewsArticles, breadcrumb, sidebarSections },
      breadcrumb,
    });
  }

  // ── 10. Support category index pages ─────────────────────────────────────────
  for (const category of support.categories) {
    const catUrl = `/support/${category.slug}/`;
    const breadcrumb = markCurrentLast([bc('Home', '/'), bc('Support', '/support/'), bc(category.name, catUrl)]);
    const seo = { ...site.seo, title: `${category.title} | ${site.brand.name}`, description: category.metaDescription, canonical: catUrl };
    const catArticles = support.articles.filter(a => a.category === category.slug);
    const sidebarSections = sidebarNav('Support Categories', support.categories.map(c => ({ name: c.name, url: `/support/${c.slug}/` })), catUrl);
    pages.push({
      url: catUrl,
      template: 'support-list',
      context: { ...site, seo, category, filterCategory: category.slug, articles: catArticles, breadcrumb, sidebarSections },
      breadcrumb,
    });
  }

  // ── 11. Support tag pages (deduplicated) ─────────────────────────────────────
  // Collect all tag slugs from articles, slugify, deduplicate
  const seenTagSlugs = new Set();
  for (const article of support.articles) {
    for (const rawTag of article.tags) {
      seenTagSlugs.add(slugify(rawTag));
    }
  }

  for (const tagSlug of seenTagSlugs) {
    const tagInfo = support.tags
      ? support.tags.find(t => t.slug === tagSlug) ?? null
      : null;
    const tagName = tagInfo ? tagInfo.name : tagSlug;
    const tagUrl = `/support/tags/${tagSlug}/`;
    const breadcrumb = markCurrentLast([bc('Home', '/'), bc('Support', '/support/'), bc('Tags', '/support/'), bc(tagName, tagUrl)]);
    const seo = { ...site.seo, title: `${tagName} | Technical Support | ${site.brand.name}`, description: `${site.brand.name} technical resources tagged with ${tagName}: guides, application notes, and FAE support.`, canonical: tagUrl };
    const tagArticles = support.articles.filter(a => Array.isArray(a.tags) && a.tags.some(t => slugify(t) === tagSlug));
    const sidebarSections = sidebarNav('Support Categories', support.categories.map(c => ({ name: c.name, url: `/support/${c.slug}/` })));
    pages.push({
      url: tagUrl,
      template: 'support-list',
      context: { ...site, seo, filterTag: tagSlug, tag: tagInfo, articles: tagArticles, breadcrumb, sidebarSections },
      breadcrumb,
    });
  }

  // ── 12. Support article detail pages (tech-detail) ───────────────────────────
  for (const article of support.articles) {
    const catInfo = support.categories
      ? support.categories.find(c => c.slug === article.category) ?? null
      : null;
    const catName = catInfo ? catInfo.name : article.category;
    const articleUrl = `/support/${article.category}/${article.slug}/`;
    const breadcrumb = markCurrentLast([
      bc('Home', '/'),
      bc('Support', '/support/'),
      bc(catName, `/support/${article.category}/`),
      bc(article.title, articleUrl),
    ]);
    const seo = { ...site.seo, title: `${article.title} | ${site.brand.name}`, description: article.metaDescription || article.title, canonical: articleUrl };
    // Resolve author slug → full author object (support.schema.md: "{{article.author}} → resolves full author object at build time")
    const authorInfo = support.authors
      ? support.authors.find(a => a.slug === article.author) ?? null
      : null;
    // Resolve relatedArticles slugs → full article preview objects (support.schema.md: "resolved to card previews at build time")
    const relatedArticlesResolved = (article.relatedArticles || [])
      .map(slug => support.articles.find(a => a.slug === slug))
      .filter(Boolean);
    pages.push({
      url: articleUrl,
      template: 'tech-detail',
      context: { ...site, seo, article, author: authorInfo, relatedArticles: relatedArticlesResolved, category: catInfo, breadcrumb },
      breadcrumb,
    });
  }

  // ── 13. News list ────────────────────────────────────────────────────────────
  {
    const breadcrumb = markCurrentLast([bc('Home', '/'), bc('News', '/news/')]);
    const seo = { ...site.seo, title: `Infineon News | ${site.brand.name} Infineon Distributor`, description: `Latest news from ${site.brand.name}: Infineon distributor updates, stock announcements, industry insights, and wide-bandgap semiconductor market coverage.`, canonical: '/news/' };
    // Pre-filtered per-section article arrays for the news-list page's two panels
    // (news.schema.md "news-list Template Rendering Logic": Company News / Industry
    // News, each sorted by date descending, never mixed). Sorted explicitly rather
    // than relying on news.json's existing order — same defensive pattern used for
    // T5.6's guidesArticles/applicationNotesArticles/etc.
    const sortedByDateDesc = [...news.articles].sort((a, b) => new Date(b.date) - new Date(a.date));
    const companyArticles = sortedByDateDesc.filter(a => a.type === 'company');
    const industryArticles = sortedByDateDesc.filter(a => a.type === 'industry');
    // design §5.11 requires a sidebar Company/Industry news navigation
    // (in-page anchors to the two sections rendered in news-list.html,
    // since News has no separate category/URL taxonomy of its own), plus
    // cross-links to the other 3 content areas.
    const sidebarSections = [
      ...sidebarNav('News Categories', [
        { name: 'Company News', url: '/news/#company-news' },
        { name: 'Industry News', url: '/news/#industry-news' },
      ]),
      ...sidebarNav('Explore More', [
        { name: 'Products', url: '/products/' },
        { name: 'Solutions', url: '/solutions/' },
        { name: 'Support', url: '/support/' },
      ]),
    ];
    pages.push({
      url: '/news/',
      template: 'news-list',
      context: { ...site, seo, articles: news.articles, companyArticles, industryArticles, breadcrumb, sidebarSections },
      breadcrumb,
    });
  }

  // ── 14. News detail pages ────────────────────────────────────────────────────
  for (const article of news.articles) {
    const articleUrl = `/news/${article.slug}/`;
    const breadcrumb = markCurrentLast([bc('Home', '/'), bc('News', '/news/'), bc(article.title, articleUrl)]);
    const seo = { ...site.seo, title: `${article.title} | ${site.brand.name}`, description: article.metaDescription || article.title, canonical: articleUrl };
    // "Latest News" 3-card block: 3 most recent articles of any type, excluding the
    // current article, sorted by date descending (news.schema.md "news-detail Template
    // Rendering Logic" item 4 / design §5.12). render.js has no sort/compare
    // capability, so this must be computed here rather than in the template.
    const latestNews = [...news.articles]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .filter(a => a.slug !== article.slug)
      .slice(0, 3);
    // Author JSON-LD @type: Organization when the byline is an editorial team, else
    // Person — mirrors schema.js's newsArticle() logic. render.js has no string
    // .includes()/equality operator, so this must be pre-computed here.
    const authorType = article.author.toLowerCase().includes('team') ? 'Organization' : 'Person';
    // Banner overlay CSS class: light variant only when explicitly requested via
    // bannerImage.overlayStyle === "light", dark by default (news.schema.md lines
    // 55/57). render.js has no string-equality operator, so this must be
    // pre-computed here rather than branched on in the template.
    const overlayClass = article.bannerImage && article.bannerImage.overlayStyle === 'light'
      ? 'banner-overlay-light'
      : 'banner-overlay-dark';
    // Percent-encoded share.title/share.url for the share-bar's LinkedIn/WhatsApp
    // query-string links. render.js only HTML-escapes — it has no encodeURIComponent —
    // so a bare title/url would break query strings for any future article title
    // containing "&"/"#"/"%". Encoded here, output via triple-brace in the template
    // since encodeURIComponent's output is already URL-safe ASCII (no HTML-escaping
    // needed, and double-escaping would corrupt the encoding).
    const shareTitleEncoded = encodeURIComponent(article.share.title);
    const shareUrlEncoded = encodeURIComponent(article.share.url);
    pages.push({
      url: articleUrl,
      template: 'news-detail',
      context: { ...site, seo, article, latestNews, authorType, overlayClass, shareTitleEncoded, shareUrlEncoded, breadcrumb },
      breadcrumb,
    });
  }

  // ── 15. Author profile pages ─────────────────────────────────────────────────
  for (const author of support.authors) {
    const authorUrl = `/about/authors/${author.slug}/`;
    const breadcrumb = markCurrentLast([
      bc('Home', '/'),
      bc('About Us', '/about/'),
      bc('Authors', '/about/'),
      bc(author.name, authorUrl),
    ]);
    // Per-author seo object (author pages had no `seo` before, which meant every
    // author page fell back to site.seo.defaultTitle — a duplicate-title SEO
    // problem across all author pages). description prefers author.bio (truncated
    // to stay under the ~155-char meta description guideline used elsewhere in
    // pages.js), falling back to an expertise-based sentence since bio is not
    // guaranteed present on every author record.
    const seo = { ...site.seo, title: `${author.name} — Infineon FAE Profile | ${site.brand.name}`, description: author.bio ? author.bio.slice(0, 155) : `${author.name}, ${author.expertise} at ${site.brand.name}, an Infineon authorized distributor.`, canonical: authorUrl };
    // Articles authored by this FAE (about.schema.md §Author Profile Page Schema:
    // "list of articles authored ... filtered by author === slug"), same
    // filter-at-build-time pattern as guidesArticles/catArticles/tagArticles above.
    const authoredArticles = support.articles.filter(a => a.author === author.slug);
    pages.push({
      url: authorUrl,
      template: 'about',
      context: { ...site, seo, author, authorProfile: true, authoredArticles, breadcrumb },
      breadcrumb,
    });
  }

  return pages;
}
