/**
 * form.js — Contact form client-side validation + fake-submit flow (T6.4)
 * Contract: src/markup-contract.md §4. Reads [data-validate] forms, validates
 * [required]/[data-rule="text|email|partno"] fields on blur and on submit,
 * writes an is-invalid class + [data-error-for] error text, and on an
 * all-valid submit disables [data-submit] with a spinner before revealing
 * [data-success]. Vanilla JS, no dependencies, defensive (no-op when
 * elements/fields are absent). Loaded via
 * <script type="module" src="/assets/js/form.js">.
 */

(function () {
  'use strict';

  // Simplified RFC 5322 email pattern (§4.3: "含 @ 和有效域名部分").
  var EMAIL_RE = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  var PARTNO_RE = /^[A-Za-z0-9-]{2,50}$/;

  var MESSAGES = {
    text: 'This field is required.',
    email: 'Please enter a valid email address.',
    partno: 'Please enter a valid part number (letters, numbers, and hyphens only).'
  };

  // Evaluate a single field against its data-rule (or, absent a rule, its
  // required attribute) and return { valid, message }. Contract §4.3/§4.5
  // boundary handling for "not required + has data-rule" (e.g. the message
  // textarea, which has data-rule="text" but no required): an empty value
  // is allowed (the field is optional) and passes; a non-empty value must
  // still satisfy the rule's own format check.
  function evaluate(field) {
    var rule = field.getAttribute('data-rule');
    var required = field.hasAttribute('required');
    var trimmed = field.value.trim();

    if (!rule) {
      // No data-rule: required fields get a non-empty check only (§4.5);
      // non-required, non-rule fields are never passed to evaluate() at all
      // (see isValidatable), so this branch only ever serves required-only
      // fields.
      var okRequired = trimmed.length > 0;
      return { valid: okRequired, message: okRequired ? '' : MESSAGES.text };
    }

    if (!required && trimmed.length === 0) {
      // Optional field left blank: passes without format checking.
      return { valid: true, message: '' };
    }

    if (rule === 'email') {
      var validEmail = trimmed.length > 0 && EMAIL_RE.test(trimmed);
      return { valid: validEmail, message: validEmail ? '' : MESSAGES.email };
    }

    if (rule === 'partno') {
      var validPartNo = trimmed.length > 0 && PARTNO_RE.test(trimmed);
      return { valid: validPartNo, message: validPartNo ? '' : MESSAGES.partno };
    }

    // rule === 'text' (or any unrecognized rule value falls back to the
    // plain non-empty check, per §4.3's text rule definition).
    var validText = trimmed.length > 0;
    return { valid: validText, message: validText ? '' : MESSAGES.text };
  }

  // A field is only wired up for validation when the contract says JS
  // should read it: required fields, or fields carrying a data-rule.
  // Fields with neither are skipped entirely (§4.5: "不校验").
  function isValidatable(field) {
    return field.hasAttribute('required') || !!field.getAttribute('data-rule');
  }

  function applyResult(form, field, result) {
    if (result.valid) {
      field.classList.remove('is-invalid');
    } else {
      field.classList.add('is-invalid');
    }

    var name = field.getAttribute('name');
    if (!name) return;

    var errorEl = form.querySelector('[data-error-for="' + name + '"]');
    if (!errorEl) {
      // §4.5: missing error container — skip error UI, validation logic
      // (is-invalid class above) still ran.
      console.warn('form.js: no [data-error-for="' + name + '"] container found, skipping error UI.');
      return;
    }
    errorEl.textContent = result.valid ? '' : result.message;
  }

  function validateField(form, field) {
    var result = evaluate(field);
    applyResult(form, field, result);
    return result.valid;
  }

  function showSuccess(form, successEl) {
    if (successEl) {
      successEl.removeAttribute('hidden');
      return;
    }
    // §4.5 degradation: [data-success] missing from the DOM — insert a
    // status message near the form instead of failing silently (no
    // navigation).
    console.warn('form.js: no [data-success] container found, inserting fallback status message.');
    var fallback = document.createElement('p');
    // Carries data-success so the .is-submitted > *:not([data-success]) CSS
    // rule (which hides the rest of the form on submit) doesn't also hide
    // this fallback the instant it's appended.
    fallback.setAttribute('data-success', '');
    fallback.setAttribute('role', 'status');
    fallback.setAttribute('aria-live', 'polite');
    fallback.textContent = 'Thank you! We will contact you within 24 hours.';
    form.appendChild(fallback);
  }

  function initForm(form) {
    var fields = Array.prototype.slice.call(form.querySelectorAll('input, textarea')).filter(isValidatable);
    if (fields.length === 0) return;

    var submitBtn = form.querySelector('[data-submit]');
    var successEl = form.querySelector('[data-success]');

    // Field blur validates that single field (§4.4).
    fields.forEach(function (field) {
      field.addEventListener('blur', function () {
        validateField(form, field);
      });
    });

    // Submit validates every field; always preventDefault since the form
    // is novalidate/JS-only with no action attribute (§4.2).
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var allValid = true;
      var firstInvalid = null;
      fields.forEach(function (field) {
        var valid = validateField(form, field);
        if (!valid) {
          allValid = false;
          if (!firstInvalid) firstInvalid = field;
        }
      });

      if (!allValid) {
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      if (submitBtn) {
        submitBtn.setAttribute('disabled', '');
        var spinner = document.createElement('span');
        spinner.className = 'spinner';
        spinner.setAttribute('aria-hidden', 'true');
        submitBtn.appendChild(spinner);
      }

      // No real backend (static site) — simulate a short submit delay,
      // then reveal the success state (§4.4).
      setTimeout(function () {
        form.classList.add('is-submitted');
        showSuccess(form, successEl);
      }, 1000);
    });
  }

  Array.prototype.slice.call(document.querySelectorAll('[data-validate]')).forEach(initForm);
})();
