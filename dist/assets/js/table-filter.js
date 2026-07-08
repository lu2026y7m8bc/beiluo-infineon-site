/**
 * table-filter.js — Dynamic spec-table column filtering (T6.1)
 * Contract: src/markup-contract.md §1. Reads column definitions from
 * thead th[data-col], generates per-column filter controls in
 * [data-filter-bar], and shows/hides tbody rows on AND-combined filter
 * state. Vanilla JS, no dependencies, defensive (no-op when elements absent).
 * Loaded via <script type="module" src="/assets/js/table-filter.js">.
 */

(function () {
  'use strict';

  function parseNumber(str) {
    var n = parseFloat(str);
    return Number.isNaN(n) ? null : n;
  }

  function cellValue(row, key) {
    var td = row.querySelector('td[data-col="' + key + '"]');
    return td ? td.textContent.trim() : '';
  }

  function createEmptyRow(colSpan, taggedNoData) {
    var tr = document.createElement('tr');
    tr.className = 'spec-table__empty-row';
    if (taggedNoData) tr.setAttribute('data-empty-state', '');
    var td = document.createElement('td');
    td.colSpan = colSpan;
    td.textContent = 'No results found.';
    tr.appendChild(td);
    return tr;
  }

  function initTable(wrap) {
    var table = wrap.querySelector('.spec-table');
    var filterBar = wrap.querySelector('[data-filter-bar]');
    if (!table || !filterBar) return;

    var headerCells = Array.prototype.slice.call(table.querySelectorAll('thead th[data-col]'));
    if (headerCells.length === 0) return;

    var totalCols = table.querySelectorAll('thead tr th').length;

    var columns = headerCells.map(function (th) {
      return {
        key: th.getAttribute('data-col'),
        filterKind: th.getAttribute('data-filter'),
        label: th.textContent.trim(),
      };
    });

    var tbody = table.querySelector('tbody');
    if (!tbody) return;

    var rows = Array.prototype.slice.call(tbody.querySelectorAll('tr')).filter(function (tr) {
      return !tr.classList.contains('spec-table__empty-row');
    });

    // No model data at all — leave thead intact, tag a static empty-state row.
    if (rows.length === 0) {
      tbody.appendChild(createEmptyRow(totalCols, true));
      return;
    }

    function uniqueValues(key) {
      var seen = [];
      rows.forEach(function (row) {
        var v = cellValue(row, key);
        if (v !== '' && seen.indexOf(v) === -1) seen.push(v);
      });
      return seen;
    }

    // Filter state, keyed by column key: { kind: 'select'|'range'|'multi', ... }
    var state = {};

    function applyFilters() {
      var anyVisible = false;
      rows.forEach(function (row) {
        if (rowMatches(row)) {
          row.removeAttribute('hidden');
          anyVisible = true;
        } else {
          row.setAttribute('hidden', '');
        }
      });

      var existingEmptyRow = tbody.querySelector('.spec-table__empty-row');
      if (!anyVisible) {
        if (!existingEmptyRow) {
          tbody.appendChild(createEmptyRow(totalCols, false));
        }
      } else if (existingEmptyRow) {
        existingEmptyRow.remove();
      }
    }

    function rowMatches(row) {
      return Object.keys(state).every(function (key) {
        var filter = state[key];
        var raw = cellValue(row, key);

        if (filter.kind === 'select') {
          return raw === filter.value;
        }

        if (filter.kind === 'range') {
          var num = parseNumber(raw);
          if (num === null) return true; // non-numeric cell: fall back to text, don't exclude
          if (filter.min !== null && num < filter.min) return false;
          if (filter.max !== null && num > filter.max) return false;
          return true;
        }

        if (filter.kind === 'multi') {
          return filter.values.indexOf(raw) !== -1;
        }

        return true;
      });
    }

    columns.forEach(function (col) {
      if (!col.filterKind) return; // no data-filter = not filterable, skip

      var ariaLabel = 'Filter by ' + col.label;
      var group = document.createElement('div');
      group.className = 'filter-control';
      group.dataset.filterGroup = col.key;

      if (col.filterKind === 'select') {
        var select = document.createElement('select');
        select.setAttribute('aria-label', ariaLabel);

        var allOpt = document.createElement('option');
        allOpt.value = '';
        allOpt.textContent = 'All';
        select.appendChild(allOpt);

        uniqueValues(col.key).forEach(function (value) {
          var opt = document.createElement('option');
          opt.value = value;
          opt.textContent = value;
          select.appendChild(opt);
        });

        select.addEventListener('change', function () {
          if (select.value) {
            state[col.key] = { kind: 'select', value: select.value };
          } else {
            delete state[col.key];
          }
          applyFilters();
        });

        group.appendChild(select);
      } else if (col.filterKind === 'range') {
        var minInput = document.createElement('input');
        minInput.type = 'number';
        minInput.placeholder = 'Min';
        minInput.setAttribute('aria-label', ariaLabel + ' minimum');

        var maxInput = document.createElement('input');
        maxInput.type = 'number';
        maxInput.placeholder = 'Max';
        maxInput.setAttribute('aria-label', ariaLabel + ' maximum');

        var updateRange = function () {
          var min = minInput.value === '' ? null : parseNumber(minInput.value);
          var max = maxInput.value === '' ? null : parseNumber(maxInput.value);
          if (min === null && max === null) {
            delete state[col.key];
          } else {
            state[col.key] = { kind: 'range', min: min, max: max };
          }
          applyFilters();
        };
        minInput.addEventListener('input', updateRange);
        maxInput.addEventListener('input', updateRange);

        group.appendChild(minInput);
        group.appendChild(maxInput);
      } else if (col.filterKind === 'multi') {
        uniqueValues(col.key).forEach(function (value) {
          var checkboxLabel = document.createElement('label');
          checkboxLabel.className = 'filter-control__checkbox';

          var checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.value = value;
          checkbox.setAttribute('aria-label', ariaLabel);

          checkbox.addEventListener('change', function () {
            var checked = Array.prototype.slice
              .call(group.querySelectorAll('input[type="checkbox"]:checked'))
              .map(function (cb) { return cb.value; });
            if (checked.length > 0) {
              state[col.key] = { kind: 'multi', values: checked };
            } else {
              delete state[col.key];
            }
            applyFilters();
          });

          checkboxLabel.appendChild(checkbox);
          checkboxLabel.appendChild(document.createTextNode(value));
          group.appendChild(checkboxLabel);
        });
      } else {
        return; // unknown data-filter value, skip generating a control
      }

      filterBar.appendChild(group);
    });
  }

  Array.prototype.slice.call(document.querySelectorAll('.spec-table-wrap')).forEach(initTable);
})();
