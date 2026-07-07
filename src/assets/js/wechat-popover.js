/**
 * wechat-popover.js — Contact-float WeChat QR popover (T8.2 Tier 3)
 * Toggle/ESC/outside-click/close-button, keyboard-accessible.
 * Vanilla JS, defensive (no-op when elements absent).
 * Loaded via <script type="module" src="/assets/js/wechat-popover.js">.
 */

(function () {
  'use strict';

  var toggle    = document.querySelector('[data-wechat-toggle]');
  var popover   = document.querySelector('[data-wechat-popover]');
  var closeBtn  = document.querySelector('[data-wechat-popover-close]');

  if (!toggle || !popover) return;

  function openPopover() {
    popover.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
  }

  function closePopover() {
    popover.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
  }

  function isOpen() {
    return !popover.hidden;
  }

  toggle.addEventListener('click', function () {
    if (isOpen()) {
      closePopover();
    } else {
      openPopover();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', function () {
      closePopover();
      toggle.focus();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen()) {
      closePopover();
      toggle.focus();
    }
  });

  document.addEventListener('click', function (e) {
    if (
      isOpen() &&
      !popover.contains(e.target) &&
      !toggle.contains(e.target)
    ) {
      closePopover();
    }
  });

})();
