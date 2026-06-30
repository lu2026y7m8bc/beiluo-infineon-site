/**
 * nav.js — Top-nav behaviour (T2.4)
 * Sticky-on-scroll, Products mega menu (hover/focus/ESC), mobile drawer (toggle/ESC/link-close)
 * Vanilla JS, defensive (no-op when elements absent), keyboard-accessible.
 * Loaded via <script src="/assets/js/nav.js" defer>.
 */

(function () {
  'use strict';

  /* ── Element refs ─────────────────────────────────────────────────────── */
  var nav          = document.querySelector('[data-nav]');
  var megaTrigger  = document.querySelector('[data-megamenu-trigger]');
  var mega         = document.querySelector('[data-megamenu]');
  var drawerToggle = document.querySelector('[data-drawer-toggle]');
  var drawer       = document.querySelector('[data-drawer]');

  /* ── 1. Sticky-on-scroll ──────────────────────────────────────────────── */
  if (nav) {
    function handleScroll() {
      if (window.scrollY > 40) {
        nav.classList.add('is-scrolled');
      } else {
        nav.classList.remove('is-scrolled');
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // run once on load to set initial state
  }

  /* ── 2. Products Mega Menu ────────────────────────────────────────────── */
  function openMega() {
    if (!mega || !megaTrigger) return;
    mega.classList.add('is-open');
    mega.removeAttribute('aria-hidden');
    megaTrigger.setAttribute('aria-expanded', 'true');
  }

  function closeMega() {
    if (!mega || !megaTrigger) return;
    mega.classList.remove('is-open');
    mega.setAttribute('aria-hidden', 'true');
    megaTrigger.setAttribute('aria-expanded', 'false');
  }

  if (megaTrigger && mega) {
    /* [Fix 1] Hover: [data-megamenu] panel is now a child of .has-megamenu (see nav.html),
       so the <li> is one contiguous hover zone covering both the trigger and the panel.
       mouseenter/mouseleave on that single element handles open/close correctly. */
    var megaItem = megaTrigger.closest('.has-megamenu');

    if (megaItem) {
      megaItem.addEventListener('mouseenter', openMega);
      megaItem.addEventListener('mouseleave', closeMega);
    }

    /* Focus: open when trigger receives focus */
    megaTrigger.addEventListener('focus', openMega);

    /* focusout on panel: close when focus leaves the panel (safety net for keyboard nav
       that entered the panel and then tabs out the bottom) */
    mega.addEventListener('focusout', function (e) {
      var newFocus = e.relatedTarget;
      if (!mega.contains(newFocus) && megaTrigger !== newFocus) {
        closeMega();
      }
    });

    /* [Fix 2 & 3] Document-level focusin: close mega whenever focus moves to any element
       that is neither the trigger nor inside the panel.
       Covers:
         - Tab from trigger to another nav item/CTA (focus never enters panel) — Fix 2
         - Shift+Tab backward past the trigger (focus never entered panel) — Fix 3 */
    document.addEventListener('focusin', function (e) {
      if (
        mega.classList.contains('is-open') &&
        e.target !== megaTrigger &&
        !mega.contains(e.target)
      ) {
        closeMega();
      }
    });

    /* ESC key closes mega menu and returns focus to trigger */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        if (mega.classList.contains('is-open')) {
          closeMega();
          megaTrigger.focus();
        }
      }
    });

    /* Click outside mega + trigger closes it */
    document.addEventListener('click', function (e) {
      if (
        mega.classList.contains('is-open') &&
        !mega.contains(e.target) &&
        !megaTrigger.contains(e.target)
      ) {
        closeMega();
      }
    });
  }

  /* ── 3. Mobile Drawer ─────────────────────────────────────────────────── */
  function openDrawer() {
    if (!drawer || !drawerToggle) return;
    drawer.classList.add('is-open');
    drawer.removeAttribute('aria-hidden');
    drawerToggle.setAttribute('aria-expanded', 'true');
    /* [Fix 4] Keep aria-label in sync with drawer state */
    drawerToggle.setAttribute('aria-label', 'Close navigation menu');
    document.body.classList.add('nav-drawer-open');
  }

  function closeDrawer() {
    if (!drawer || !drawerToggle) return;
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    drawerToggle.setAttribute('aria-expanded', 'false');
    /* [Fix 4] Keep aria-label in sync with drawer state */
    drawerToggle.setAttribute('aria-label', 'Open navigation menu');
    document.body.classList.remove('nav-drawer-open');
  }

  if (drawerToggle) {
    drawerToggle.addEventListener('click', function () {
      if (drawer && drawer.classList.contains('is-open')) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });
  }

  if (drawer) {
    /* Close on any link click inside the drawer */
    drawer.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        closeDrawer();
      }
    });
  }

  /* ESC closes drawer and restores focus to toggle */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (drawer && drawer.classList.contains('is-open')) {
        closeDrawer();
        if (drawerToggle) drawerToggle.focus();
      }
    }
  });

  /* Click outside drawer (backdrop) closes it */
  document.addEventListener('click', function (e) {
    if (
      drawer &&
      drawer.classList.contains('is-open') &&
      !drawer.contains(e.target) &&
      drawerToggle &&
      !drawerToggle.contains(e.target)
    ) {
      closeDrawer();
    }
  });

})();
