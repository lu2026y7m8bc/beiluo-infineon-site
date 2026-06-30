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
 * Build the full page list from all JSON data objects.
 *
 * @param {{ site, home, products, solutions, support, news, about }} data
 * @returns {Array<{ url: string, template: string, context: object, breadcrumb: Array }>}
 */
export function buildPageList(data) {
  const { site, home, products, solutions, support, news, about } = data;
  const pages = [];

  // ── 1. Home ─────────────────────────────────────────────────────────────────
  {
    const breadcrumb = [];
    pages.push({
      url: '/',
      template: 'home',
      context: { ...site, ...home, breadcrumb },
      breadcrumb,
    });
  }

  // ── 2. About ────────────────────────────────────────────────────────────────
  {
    const breadcrumb = markCurrentLast([bc('Home', '/')]);
    pages.push({
      url: '/about/',
      template: 'about',
      context: { ...site, ...about, breadcrumb },
      breadcrumb,
    });
  }

  // ── 3. Contact ──────────────────────────────────────────────────────────────
  {
    const breadcrumb = markCurrentLast([bc('Home', '/')]);
    pages.push({
      url: '/contact/',
      template: 'contact',
      context: { ...site, breadcrumb },
      breadcrumb,
    });
  }

  // ── 4. Products list ─────────────────────────────────────────────────────────
  {
    const breadcrumb = markCurrentLast([bc('Home', '/')]);
    const seo = { ...site.seo, title: `Infineon Products | ${site.brand.name}`, description: `Browse ${site.brand.name} authorized Infineon products: MCU, IGBT, MOSFET and Sensors. Deep stock, FAE support, global delivery.`, canonical: '/products/' };
    pages.push({
      url: '/products/',
      template: 'products-list',
      context: { ...site, seo, categories: products.categories, breadcrumb },
      breadcrumb,
    });
  }

  // ── 5. Product category pages + 6. Product detail pages ─────────────────────
  for (const category of products.categories) {
    const catUrl = `/products/${category.slug}/`;

    // Category index page
    {
      const breadcrumb = markCurrentLast([bc('Home', '/'), bc('Products', '/products/')]);
      const seo = { ...site.seo, title: category.title, description: category.metaDescription, canonical: catUrl };
      pages.push({
        url: catUrl,
        template: 'product-category',
        context: { ...site, seo, category, breadcrumb },
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
      const seo = { ...site.seo, title: `${model.partNo} ${category.name} | ${site.brand.name}`, description: model.shortDescription, canonical: modelUrl };
      const availabilityUrl = model.stock === 'inStock' ? 'https://schema.org/InStock' : 'https://schema.org/BackOrder';
      const modelWithAvailability = { ...model, availabilityUrl };
      pages.push({
        url: modelUrl,
        template: 'product-detail',
        context: { ...site, seo, category, model: modelWithAvailability, breadcrumb },
        breadcrumb,
      });
    }
  }

  // ── 7. Solutions list ────────────────────────────────────────────────────────
  {
    const breadcrumb = markCurrentLast([bc('Home', '/')]);
    const seo = { ...site.seo, title: `Infineon Application Solutions | ${site.brand.name}`, description: `Explore ${site.brand.name} Infineon-based application solutions: motor drive, EV charger, industrial IoT, MCU embedded control, and solar inverter.`, canonical: '/solutions/' };
    pages.push({
      url: '/solutions/',
      template: 'solutions-list',
      context: { ...site, seo, solutions: solutions.solutions, breadcrumb },
      breadcrumb,
    });
  }

  // ── 8. Solution detail pages ─────────────────────────────────────────────────
  for (const solution of solutions.solutions) {
    const solutionUrl = `/solutions/${solution.slug}/`;
    const breadcrumb = markCurrentLast([bc('Home', '/'), bc('Solutions', '/solutions/')]);
    const seo = { ...site.seo, title: `${solution.title} | ${site.brand.name}`, description: solution.metaDescription, canonical: solutionUrl };
    pages.push({
      url: solutionUrl,
      template: 'solution-detail',
      context: { ...site, seo, solution, breadcrumb },
      breadcrumb,
    });
  }

  // ── 9. Support overview ──────────────────────────────────────────────────────
  {
    const breadcrumb = markCurrentLast([bc('Home', '/')]);
    const seo = { ...site.seo, title: `Technical Support & Guides | ${site.brand.name}`, description: `${site.brand.name} technical support: Infineon component selection guides, application notes, and FAE Q&A for MCU, IGBT, MOSFET and Sensors.`, canonical: '/support/' };
    pages.push({
      url: '/support/',
      template: 'support-list',
      context: { ...site, seo, ...support, breadcrumb },
      breadcrumb,
    });
  }

  // ── 10. Support category index pages ─────────────────────────────────────────
  for (const category of support.categories) {
    const catUrl = `/support/${category.slug}/`;
    const breadcrumb = markCurrentLast([bc('Home', '/'), bc('Support', '/support/')]);
    pages.push({
      url: catUrl,
      template: 'support-list',
      context: { ...site, category, filterCategory: category.slug, breadcrumb },
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
    const breadcrumb = markCurrentLast([bc('Home', '/'), bc('Support', '/support/')]);
    pages.push({
      url: `/support/tags/${tagSlug}/`,
      template: 'support-list',
      context: { ...site, filterTag: tagSlug, tag: tagInfo, breadcrumb },
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
    pages.push({
      url: articleUrl,
      template: 'tech-detail',
      context: { ...site, seo, article, breadcrumb },
      breadcrumb,
    });
  }

  // ── 13. News list ────────────────────────────────────────────────────────────
  {
    const breadcrumb = markCurrentLast([bc('Home', '/')]);
    const seo = { ...site.seo, title: `News | ${site.brand.name} Infineon Distributor`, description: `Latest news from ${site.brand.name}: Infineon distributor updates, stock announcements, industry insights, and wide-bandgap semiconductor market coverage.`, canonical: '/news/' };
    pages.push({
      url: '/news/',
      template: 'news-list',
      context: { ...site, seo, articles: news.articles, breadcrumb },
      breadcrumb,
    });
  }

  // ── 14. News detail pages ────────────────────────────────────────────────────
  for (const article of news.articles) {
    const articleUrl = `/news/${article.slug}/`;
    const breadcrumb = markCurrentLast([bc('Home', '/'), bc('News', '/news/')]);
    const seo = { ...site.seo, title: `${article.title} | ${site.brand.name}`, description: article.summary || article.title, canonical: articleUrl };
    pages.push({
      url: articleUrl,
      template: 'news-detail',
      context: { ...site, seo, article, breadcrumb },
      breadcrumb,
    });
  }

  // ── 15. Author profile pages ─────────────────────────────────────────────────
  for (const author of support.authors) {
    const authorUrl = `/about/authors/${author.slug}/`;
    const breadcrumb = markCurrentLast([
      bc('Home', '/'),
      bc('About Us', '/about/'),
      bc('Authors', '/about/authors/'),
      bc(author.name, authorUrl),
    ]);
    pages.push({
      url: authorUrl,
      template: 'about',
      context: { ...site, author, authorProfile: true, breadcrumb },
      breadcrumb,
    });
  }

  return pages;
}
