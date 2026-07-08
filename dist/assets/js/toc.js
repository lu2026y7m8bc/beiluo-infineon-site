/**
 * toc.js — Sticky TOC tree generation + scroll-spy highlighting (T6.3)
 * Contract: src/markup-contract.md §3. Reads h2/h3 headings (with id) from
 * .article-content, builds a nested <ol>/<li>/<a> tree inside [data-toc],
 * and highlights the active section link via IntersectionObserver on
 * scroll. Vanilla JS, no dependencies, defensive (no-op when elements
 * absent). Loaded via <script type="module" src="/assets/js/toc.js">.
 */

(function () {
  'use strict';

  // Group a flat, DOM-order heading list into a nested tree: H2 = top
  // level, each H3 attaches as a child of the nearest preceding H2. An H3
  // with no preceding H2 (shouldn't happen per contract, but handled
  // defensively) is treated as top-level.
  function buildTree(headings) {
    var tree = [];
    var currentH2 = null;
    headings.forEach(function (h) {
      var node = { id: h.id, text: h.text, children: [] };
      if (h.tag === 'H2') {
        tree.push(node);
        currentH2 = node;
      } else if (currentH2) {
        currentH2.children.push(node);
      } else {
        tree.push(node);
      }
    });
    return tree;
  }

  function renderList(nodes) {
    var ol = document.createElement('ol');
    nodes.forEach(function (node) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = '#' + node.id;
      a.textContent = node.text;
      li.appendChild(a);
      if (node.children.length > 0) {
        li.appendChild(renderList(node.children));
      }
      ol.appendChild(li);
    });
    return ol;
  }

  function initToc(article, nav) {
    var headingEls = Array.prototype.slice.call(article.querySelectorAll('h2, h3'));

    var headings = [];
    headingEls.forEach(function (el) {
      var id = el.getAttribute('id');
      if (!id) {
        console.warn('toc.js: heading "' + el.textContent.trim() + '" has no id, skipping.');
        return;
      }
      headings.push({ tag: el.tagName, id: id, text: el.textContent.trim(), el: el });
    });

    if (headings.length === 0) {
      nav.hidden = true;
      return;
    }

    nav.appendChild(renderList(buildTree(headings)));

    // Map heading id -> its TOC <a> for scroll-spy lookups.
    var linkById = {};
    Array.prototype.slice.call(nav.querySelectorAll('a')).forEach(function (a) {
      linkById[a.getAttribute('href').slice(1)] = a;
    });

    // Graceful degradation: very old browsers without IntersectionObserver
    // keep the TOC clickable but skip scroll-spy highlighting entirely.
    if (typeof IntersectionObserver === 'undefined') return;

    // Track the most recently crossed heading rather than toggling per-entry:
    // headings are single-line elements, so the "top 30% band" they pass
    // through is far shorter than the section content below them. Removing
    // the highlight the instant a heading exits the band (scrolling down,
    // still reading that section) would leave the TOC unhighlighted for
    // most of the actual reading time. Instead, only *advance* activeId
    // when a heading newly enters the band; once set, it stays active
    // until the next heading enters, which correctly represents "the most
    // recent heading the user has scrolled past."
    var activeId = headings[0].id;
    setActive(activeId);

    function setActive(id) {
      if (activeId && activeId !== id && linkById[activeId]) {
        linkById[activeId].classList.remove('toc-active');
      }
      activeId = id;
      if (linkById[activeId]) linkById[activeId].classList.add('toc-active');
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.getAttribute('id'));
      });
    }, { rootMargin: '0px 0px -70% 0px', threshold: 0 });

    headings.forEach(function (h) { observer.observe(h.el); });
  }

  var article = document.querySelector('.article-content');
  var nav = document.querySelector('[data-toc]');
  if (article && nav) initToc(article, nav);
})();
