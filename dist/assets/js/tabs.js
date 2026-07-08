/**
 * tabs.js — Tab switching + roving-tabindex keyboard nav (T6.2)
 * Contract: src/markup-contract.md §2. Reads [role=tab]/[role=tabpanel] pairs
 * inside each .tab-container, matched via data-tab / data-tabpanel. Vanilla
 * JS, no dependencies, defensive (no-op when elements absent/mismatched).
 * Loaded via <script type="module" src="/assets/js/tabs.js">.
 */

(function () {
  'use strict';

  function activate(entries, target) {
    entries.forEach(function (entry) {
      var isActive = entry === target;
      entry.tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
      if (isActive) {
        entry.tab.removeAttribute('tabindex');
        entry.panel.removeAttribute('hidden');
      } else {
        entry.tab.setAttribute('tabindex', '-1');
        entry.panel.setAttribute('hidden', '');
      }
    });
  }

  function initContainer(container) {
    var tablist = container.querySelector('[role="tablist"]');
    if (!tablist) return;

    var tabs = Array.prototype.slice.call(tablist.querySelectorAll('[role="tab"]'));
    var panels = Array.prototype.slice.call(container.querySelectorAll('[role="tabpanel"]'));
    if (tabs.length === 0 || panels.length === 0) return;

    // Match each tab to its panel via data-tab / data-tabpanel; skip mismatches.
    var entries = [];
    tabs.forEach(function (tab) {
      var key = tab.getAttribute('data-tab');
      var panel = panels.filter(function (p) { return p.getAttribute('data-tabpanel') === key; })[0];
      if (!panel) {
        console.warn('tabs.js: no matching [data-tabpanel] for [data-tab="' + key + '"], skipping tab.');
        return;
      }
      entries.push({ tab: tab, panel: panel });
    });
    if (entries.length === 0) return;

    // Click activates the corresponding panel.
    entries.forEach(function (entry) {
      entry.tab.addEventListener('click', function () {
        activate(entries, entry);
      });
    });

    // Keyboard nav (roving tabindex) — skip when only one tab (contract §2.4).
    // Enter/Space activation is handled natively by <button> click behavior,
    // so no explicit keydown handling is needed for those keys.
    if (entries.length > 1) {
      tablist.addEventListener('keydown', function (e) {
        var currentIndex = entries.findIndex(function (entry) { return entry.tab === document.activeElement; });
        if (currentIndex === -1) return;

        var nextIndex = null;
        if (e.key === 'ArrowRight') {
          nextIndex = (currentIndex + 1) % entries.length;
        } else if (e.key === 'ArrowLeft') {
          nextIndex = (currentIndex - 1 + entries.length) % entries.length;
        } else if (e.key === 'Home') {
          nextIndex = 0;
        } else if (e.key === 'End') {
          nextIndex = entries.length - 1;
        } else {
          return;
        }

        e.preventDefault();
        var nextEntry = entries[nextIndex];
        nextEntry.tab.focus();
        activate(entries, nextEntry);
      });
    }
  }

  Array.prototype.slice.call(document.querySelectorAll('.tab-container')).forEach(initContainer);
})();
