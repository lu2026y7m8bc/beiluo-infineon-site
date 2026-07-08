/**
 * src/lib/validate-data.js — data validation (T4.7)
 *
 * Exports:
 *   validateData(data) → true | throws Error listing all failures
 *
 * Rules cover check_list2.md D1 (field completeness) + D5 (count quotas).
 * ALL failures are collected before throwing — no fail-fast.
 */

// ── Utility helpers ───────────────────────────────────────────────────────────

/** True if v is a non-empty string. */
function nonEmptyString(v) {
  return typeof v === 'string' && v.trim().length > 0;
}

/** True if v is an array. */
function isArray(v) {
  return Array.isArray(v);
}

/**
 * Checks [path, value] pairs for characters that would break JSON syntax when
 * raw-interpolated (`{{{x}}}`) into a `<script type="application/ld+json">` block —
 * every raw-JSON-LD site across all 12 templates funnels through this, not just
 * site.json's. Skips non-string/empty values (optional fields are validated for
 * presence elsewhere; this only guards content that IS present).
 */
function checkJsonLdSafe(prefix, fields, errors) {
  for (const [path, val] of fields) {
    if (typeof val === 'string' && val !== '' && /["\\\n\r]/.test(val)) {
      errors.push(`${prefix}: ${path} contains JSON-unsafe characters (" \\ or newline) — breaks JSON-LD output`);
    }
  }
}

// ── Domain validators — each pushes to `errors` ───────────────────────────────

function validateSite(site, errors) {
  if (!site || typeof site !== 'object') {
    errors.push('site: missing or not an object');
    return; // Cannot continue without the object
  }

  // brand
  const brand = site.brand || {};
  if (!nonEmptyString(brand.name)) errors.push('site: brand.name must be a non-empty string');
  if (!nonEmptyString(brand.slogan)) errors.push('site: brand.slogan must be a non-empty string');
  if (!nonEmptyString(brand.oneLiner)) errors.push('site: brand.oneLiner must be a non-empty string');

  // nav
  const nav = site.nav || {};
  if (!isArray(nav.items) || nav.items.length !== 7) {
    errors.push(`site: nav.items must be an array of length 7 (got ${isArray(nav.items) ? nav.items.length : 'none'})`);
  }

  // footer
  const footer = site.footer || {};
  if (!isArray(footer.columns) || footer.columns.length !== 4) {
    errors.push(`site: footer.columns must be an array of length 4 (got ${isArray(footer.columns) ? footer.columns.length : 'none'})`);
  }

  // contact
  const contact = site.contact || {};
  for (const key of ['whatsapp', 'wechat', 'whatsappHref', 'wechatQrSrc']) {
    if (!nonEmptyString(contact[key])) {
      errors.push(`site: contact.${key} must exist and be a non-empty string`);
    }
  }

  // seo
  const seo = site.seo || {};
  for (const key of ['defaultTitle', 'defaultDescription', 'siteName', 'baseUrl']) {
    if (!nonEmptyString(seo[key])) {
      errors.push(`site: seo.${key} must exist and be a non-empty string`);
    }
  }
  // seo.defaultDescription must contain "infineon distributor" (case-insensitive)
  if (nonEmptyString(seo.defaultDescription)) {
    if (!seo.defaultDescription.toLowerCase().includes('infineon distributor')) {
      errors.push('site: seo.defaultDescription must contain "infineon distributor" (case-insensitive)');
    }
  }

  // logo
  const logo = site.logo || {};
  for (const key of ['src', 'alt', 'width', 'height']) {
    if (logo[key] === undefined || logo[key] === null || logo[key] === '') {
      errors.push(`site: logo.${key} must exist`);
    }
  }

  // jsonLd
  const jsonLd = site.jsonLd || {};
  if (!nonEmptyString(jsonLd.organizationUrl)) {
    errors.push('site: jsonLd.organizationUrl must exist and be a non-empty string');
  }
  if (!nonEmptyString(jsonLd.organizationType)) {
    errors.push('site: jsonLd.organizationType must exist and be a non-empty string');
  }

  // JSON-LD safety: fields embedded as raw strings in <script type="application/ld+json">
  // must not contain characters that would break JSON syntax. brand.slogan/logo.src
  // and the optional jsonLd.foundingYear/areaServed are also raw-interpolated in
  // home.html's Organization block — not just the 4 fields checked pre-T9.3.
  checkJsonLdSafe('site', [
    ['brand.name', brand.name],
    ['brand.slogan', brand.slogan],
    ['brand.oneLiner', brand.oneLiner],
    ['logo.src', logo.src],
    ['jsonLd.organizationUrl', jsonLd.organizationUrl],
    ['jsonLd.organizationType', jsonLd.organizationType],
    ['jsonLd.foundingYear', jsonLd.foundingYear],
    ['jsonLd.areaServed', jsonLd.areaServed],
  ], errors);
}

function validateProducts(products, errors) {
  if (!products || typeof products !== 'object') {
    errors.push('products: missing or not an object');
    return;
  }

  const cats = products.categories;
  if (!isArray(cats) || cats.length !== 4) {
    errors.push(`products: categories must be an array of length 4 (got ${isArray(cats) ? cats.length : 'none'})`);
    // Still validate what's there
  }

  const catStringFields = ['slug', 'name', 'title', 'metaDescription', 'description', 'faeNote', 'icon'];

  for (const [ci, cat] of (isArray(cats) ? cats : []).entries()) {
    const catId = cat.slug || `[${ci}]`;

    for (const field of catStringFields) {
      if (!nonEmptyString(cat[field])) {
        errors.push(`products: category "${catId}" missing required field "${field}"`);
      }
    }

    if (cat.columns === undefined || cat.columns === null) {
      errors.push(`products: category "${catId}" missing required field "columns"`);
    }

    // JSON-LD safety: category.slug feeds catUrl/modelUrl (pages.js), which
    // becomes seo.canonical, raw-interpolated as Product.url/offers.url on
    // product-detail.html. (The model-slug half of that URL is safe — it's
    // uniqueSlug()-generated via slugify.js, which strips to [a-z0-9-].)
    checkJsonLdSafe(`products: category "${catId}"`, [['slug', cat.slug]], errors);

    const models = cat.models;
    if (!isArray(models) || models.length !== 2) {
      errors.push(`products: category "${catId}" models must be array of length 2 (got ${isArray(models) ? models.length : 'none'})`);
    }

    const validStockValues = ['inStock', 'rfq'];

    for (const [mi, model] of (isArray(models) ? models : []).entries()) {
      const modelId = model.partNo || `[${mi}]`;
      const modelPrefix = `products: category "${catId}" model "${modelId}"`;

      // Basic model fields
      for (const field of ['partNo', 'series', 'package', 'href']) {
        if (!nonEmptyString(model[field])) {
          errors.push(`${modelPrefix}: missing required field "${field}"`);
        }
      }

      // stock must be "inStock" or "rfq"
      if (!validStockValues.includes(model.stock)) {
        errors.push(`${modelPrefix}: stock must be "inStock" or "rfq" (got "${model.stock}")`);
      }

      // Detail model fields
      for (const field of ['overview', 'shortDescription', 'image', 'datasheetHref', 'brand']) {
        if (!nonEmptyString(model[field])) {
          errors.push(`${modelPrefix}: missing required detail field "${field}"`);
        }
      }

      // specs >= 5
      if (!isArray(model.specs) || model.specs.length < 5) {
        errors.push(`${modelPrefix}: specs must be an array of at least 5 items (got ${isArray(model.specs) ? model.specs.length : 'none'})`);
      }

      // applications array
      if (!isArray(model.applications) || model.applications.length === 0) {
        errors.push(`${modelPrefix}: applications must be a non-empty array`);
      }

      // documents array
      if (!isArray(model.documents) || model.documents.length === 0) {
        errors.push(`${modelPrefix}: documents must be a non-empty array`);
      }

      // faq length 3-5
      if (!isArray(model.faq) || model.faq.length < 3 || model.faq.length > 5) {
        errors.push(`${modelPrefix}: faq must be an array of length 3-5 (got ${isArray(model.faq) ? model.faq.length : 'none'})`);
      }

      // alternativeParts array
      if (!isArray(model.alternativeParts)) {
        errors.push(`${modelPrefix}: alternativeParts must be an array`);
      }

      // companionParts array
      if (!isArray(model.companionParts)) {
        errors.push(`${modelPrefix}: companionParts must be an array`);
      }

      // JSON-LD safety: product-category.html/product-detail.html raw-interpolate
      // these into per-model Product <script type="application/ld+json"> blocks.
      checkJsonLdSafe(modelPrefix, [
        ['partNo', model.partNo],
        ['brand', model.brand],
        ['shortDescription', model.shortDescription],
        ['image', model.image],
        // absoluteHref (= site.jsonLd.organizationUrl + model.href) is raw-interpolated
        // as Product.url/offers.url — href is the user-editable half of that string.
        ['href', model.href],
        ...(isArray(model.applications) ? model.applications.map((app, ai) => [`applications[${ai}]`, app]) : []),
      ], errors);
    }
  }
}

function validateSolutions(solutions, errors) {
  if (!solutions || typeof solutions !== 'object') {
    errors.push('solutions: missing or not an object');
    return;
  }

  const arr = solutions.solutions;
  if (!isArray(arr) || arr.length < 4) {
    errors.push(`solutions: solutions array must have at least 4 items (got ${isArray(arr) ? arr.length : 'none'})`);
  }

  for (const [i, sol] of (isArray(arr) ? arr : []).entries()) {
    const id = sol.slug || `[${i}]`;
    const prefix = `solutions: solution "${id}"`;

    for (const field of ['slug', 'title', 'metaDescription', 'body']) {
      if (!nonEmptyString(sol[field])) {
        errors.push(`${prefix}: missing required field "${field}"`);
      }
    }

    // bomList >= 2
    if (!isArray(sol.bomList) || sol.bomList.length < 2) {
      errors.push(`${prefix}: bomList must have at least 2 items (got ${isArray(sol.bomList) ? sol.bomList.length : 'none'})`);
    }

    // advantages >= 3
    if (!isArray(sol.advantages) || sol.advantages.length < 3) {
      errors.push(`${prefix}: advantages must have at least 3 items (got ${isArray(sol.advantages) ? sol.advantages.length : 'none'})`);
    }

    // JSON-LD safety: solution-detail.html raw-interpolates title into its
    // BreadcrumbList block; slug feeds solutionUrl (pages.js) -> seo.canonical,
    // also raw-interpolated there.
    checkJsonLdSafe(prefix, [['title', sol.title], ['slug', sol.slug]], errors);
  }
}

function validateSupport(support, errors) {
  if (!support || typeof support !== 'object') {
    errors.push('support: missing or not an object');
    return;
  }

  // articles exactly 4
  const articles = support.articles;
  if (!isArray(articles) || articles.length !== 4) {
    errors.push(`support: articles must be an array of length 4 (got ${isArray(articles) ? articles.length : 'none'})`);
  }

  // authors >= 1
  const authors = support.authors;
  if (!isArray(authors) || authors.length < 1) {
    errors.push(`support: authors must be a non-empty array (got ${isArray(authors) ? authors.length : 'none'})`);
  }

  for (const [i, article] of (isArray(articles) ? articles : []).entries()) {
    const id = article.slug || `[${i}]`;
    const prefix = `support: article "${id}"`;

    for (const field of ['slug', 'title', 'body']) {
      if (!nonEmptyString(article[field])) {
        errors.push(`${prefix}: missing required field "${field}"`);
      }
    }

    // contextLinks must be a non-empty array
    if (!isArray(article.contextLinks) || article.contextLinks.length === 0) {
      errors.push(`${prefix}: contextLinks must be a non-empty array (got ${isArray(article.contextLinks) ? article.contextLinks.length : 'none/missing'})`);
    }

    // JSON-LD safety: tech-detail.html raw-interpolates these into its
    // TechArticle block; slug (+ category, already listed) feeds articleUrl
    // (pages.js) -> seo.canonical, also raw-interpolated there.
    checkJsonLdSafe(prefix, [
      ['title', article.title],
      ['metaDescription', article.metaDescription],
      ['date', article.date],
      ['dateModified', article.dateModified],
      ['category', article.category],
      ['slug', article.slug],
    ], errors);
  }

  // JSON-LD safety: tech-detail.html/about.html raw-interpolate author.name/
  // author.profileHref into TechArticle.author and BreadcrumbList blocks.
  for (const [i, author] of (isArray(authors) ? authors : []).entries()) {
    const id = author.slug || `[${i}]`;
    checkJsonLdSafe(`support: author "${id}"`, [
      ['name', author.name],
      ['profileHref', author.profileHref],
    ], errors);
  }

  // JSON-LD safety: support-list.html raw-interpolates category.name into
  // BreadcrumbList blocks on every /support/ variant, and ALSO — on the
  // /support/<category>/ index page specifically — pages.js builds that page's
  // `seo` from category.title/category.metaDescription (pages.js: `title:
  // \`${category.title} | ${site.brand.name}\``, `description: category.
  // metaDescription`), which support-list.html then raw-interpolates as
  // {{{seo.title}}}/{{{seo.description}}} into a CollectionPage block — despite
  // that template's own comment claiming seo.title/description are always
  // build-time-safe strings, which is true for the /support/ and
  // /support/tags/<tag>/ variants but not this one.
  // category.slug feeds catUrl (pages.js) -> seo.canonical, also raw-interpolated
  // into that same CollectionPage block on the /support/<category>/ variant.
  for (const [i, cat] of (isArray(support.categories) ? support.categories : []).entries()) {
    checkJsonLdSafe(`support: category "${cat.slug || `[${i}]`}"`, [
      ['name', cat.name],
      ['title', cat.title],
      ['metaDescription', cat.metaDescription],
      ['slug', cat.slug],
    ], errors);
  }
  for (const [i, tag] of (isArray(support.tags) ? support.tags : []).entries()) {
    checkJsonLdSafe(`support: tag "${tag.slug || `[${i}]`}"`, [['name', tag.name]], errors);
  }
}

function validateNews(news, errors) {
  if (!news || typeof news !== 'object') {
    errors.push('news: missing or not an object');
    return;
  }

  // articles exactly 4
  const articles = news.articles;
  if (!isArray(articles) || articles.length !== 4) {
    errors.push(`news: articles must be an array of length 4 (got ${isArray(articles) ? articles.length : 'none'})`);
  }

  // At least 1 company and 1 industry
  if (isArray(articles)) {
    const hasCompany = articles.some(a => a.type === 'company');
    const hasIndustry = articles.some(a => a.type === 'industry');
    if (!hasCompany) {
      errors.push('news: articles must include at least 1 article with type="company"');
    }
    if (!hasIndustry) {
      errors.push('news: articles must include at least 1 article with type="industry"');
    }
  }

  for (const [i, article] of (isArray(articles) ? articles : []).entries()) {
    const id = article.slug || `[${i}]`;
    const prefix = `news: article "${id}"`;

    for (const field of ['slug', 'title', 'body']) {
      if (!nonEmptyString(article[field])) {
        errors.push(`${prefix}: missing required field "${field}"`);
      }
    }

    // bannerImage: must exist (string or non-null object)
    const bi = article.bannerImage;
    if (bi === undefined || bi === null || bi === '') {
      errors.push(`${prefix}: bannerImage must exist (string or object)`);
    }

    // JSON-LD safety: news-detail.html raw-interpolates these into its
    // NewsArticle block; slug feeds articleUrl (pages.js) -> seo.canonical,
    // also raw-interpolated there (mainEntityOfPage + BreadcrumbList item).
    checkJsonLdSafe(prefix, [
      ['title', article.title],
      ['metaDescription', article.metaDescription],
      ['date', article.date],
      ['dateModified', article.dateModified],
      ['slug', article.slug],
      ['author', article.author],
      ['bannerImage.src', bi && typeof bi === 'object' ? bi.src : undefined],
    ], errors);
  }
}

function validateHome(home, errors) {
  if (!home || typeof home !== 'object') {
    errors.push('home: missing or not an object');
    return;
  }

  // hero with headline
  if (!home.hero || typeof home.hero !== 'object') {
    errors.push('home: hero must exist');
  } else {
    if (!nonEmptyString(home.hero.headline)) {
      errors.push('home: hero.headline must be a non-empty string');
    }
  }

  // trustBar OR hero.trustBadges must exist
  const hasTrustBar = isArray(home.trustBar) && home.trustBar.length > 0;
  const hasTrustBadges = home.hero && isArray(home.hero.trustBadges) && home.hero.trustBadges.length > 0;
  if (!hasTrustBar && !hasTrustBadges) {
    errors.push('home: trustBar or hero.trustBadges must exist and be non-empty');
  }

  // productsTeaser exactly 4
  if (!isArray(home.productsTeaser) || home.productsTeaser.length !== 4) {
    errors.push(`home: productsTeaser must be an array of length 4 (got ${isArray(home.productsTeaser) ? home.productsTeaser.length : 'none'})`);
  }

  // solutionsTeaser >= 3
  if (!isArray(home.solutionsTeaser) || home.solutionsTeaser.length < 3) {
    errors.push(`home: solutionsTeaser must have at least 3 items (got ${isArray(home.solutionsTeaser) ? home.solutionsTeaser.length : 'none'})`);
  }

  // newsTeaser >= 3
  if (!isArray(home.newsTeaser) || home.newsTeaser.length < 3) {
    errors.push(`home: newsTeaser must have at least 3 items (got ${isArray(home.newsTeaser) ? home.newsTeaser.length : 'none'})`);
  }

  // seo.title and seo.description
  const seo = home.seo || {};
  if (!nonEmptyString(seo.title)) {
    errors.push('home: seo.title must be a non-empty string');
  }
  if (!nonEmptyString(seo.description)) {
    errors.push('home: seo.description must be a non-empty string');
  }
}

function validateAbout(about, errors) {
  if (!about || typeof about !== 'object') {
    errors.push('about: missing or not an object');
    return;
  }

  // intro.body >= 100 chars
  const intro = about.intro || {};
  if (!nonEmptyString(intro.body) || intro.body.length < 100) {
    errors.push(`about: intro.body must be a non-empty string of at least 100 characters (got ${typeof intro.body === 'string' ? intro.body.length : 'none'})`);
  }

  // (history OR milestones) array must exist
  const hasHistory = isArray(about.history) && about.history.length > 0;
  const hasMilestones = isArray(about.milestones) && about.milestones.length > 0;
  if (!hasHistory && !hasMilestones) {
    errors.push('about: either history or milestones array must exist and be non-empty');
  }

  // advantages array must exist
  if (!isArray(about.advantages) || about.advantages.length === 0) {
    errors.push(`about: advantages must be a non-empty array (got ${isArray(about.advantages) ? about.advantages.length : 'none/missing'})`);
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Validate the full site data object.
 *
 * Collects ALL failures before throwing — never fail-fast on the first error.
 *
 * @param {{ site, products, solutions, support, news, home, about }} data
 * @returns {true} if valid
 * @throws {Error} with a newline-separated list of all validation failures
 */
export function validateData(data) {
  const errors = [];

  validateSite(data?.site, errors);
  validateProducts(data?.products, errors);
  validateSolutions(data?.solutions, errors);
  validateSupport(data?.support, errors);
  validateNews(data?.news, errors);
  validateHome(data?.home, errors);
  validateAbout(data?.about, errors);

  if (errors.length > 0) {
    throw new Error(
      `Data validation failed with ${errors.length} error(s):\n` +
        errors.map((e, i) => `  ${i + 1}. ${e}`).join('\n'),
    );
  }

  return true;
}
