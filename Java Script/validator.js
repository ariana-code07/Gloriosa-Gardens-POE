/* Gloriosa Gardens - validator.js: reusable form validator (rules, inline errors, error summary) */
(function ($, window) {
  'use strict';
  function trim(s) { return String(s == null ? '' : s).trim(); }

  /* One rule per field type. Each returns '' when valid, otherwise the error message. */
  var RULES = {
    name: function (v) {
      if (!v) return 'Please enter your full name.';
      if (v.length < 2 || v.length > 60) return 'Name must be 2\u201360 characters.';
      return /^[A-Za-z\u00C0-\u024F'\u2019\- ]+$/.test(v) ? '' : 'Use letters, spaces, hyphens or apostrophes only.';
    },
    email: function (v) {
      if (!v) return 'Please enter your email address.';
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? '' : 'Enter a valid email, e.g. name@example.com.';
    },
    phone: function (v, req) {
      if (!v) return req ? 'Please enter your phone number.' : '';
      return /^(\+27|0)[1-9]\d{8}$/.test(v.replace(/[\s\-()]/g, '')) ? '' : 'Enter a valid South African number, e.g. 084 723 9418 or +27 84 723 9418.';
    },
    select: function (v) { return v ? '' : 'Please choose an option.'; },
    date: function (v) {
      if (!v) return 'Please choose a preferred date.';
      var d = new Date(v + 'T00:00:00'), t = new Date(), max;
      if (isNaN(d)) return 'Enter a valid date.';
      t.setHours(0, 0, 0, 0); max = new Date(t); max.setFullYear(max.getFullYear() + 1);
      if (d < t) return 'The date cannot be in the past.';
      return d > max ? 'Please choose a date within the next 12 months.' : '';
    },
    message: function (v) {
      if (!v) return 'Please tell us a little about your request.';
      if (v.length < 10) return 'Please write at least 10 characters (' + v.length + '/10).';
      return v.length > 500 ? 'Please keep your message under 500 characters.' : '';
    }
  };

  /* Tidy a valid SA phone number: 0847239418 -> 084 723 9418 ; +27847239418 -> +27 84 723 9418 */
  function formatPhone(v) {
    var d = v.replace(/[\s\-()]/g, '');
    if (/^0[1-9]\d{8}$/.test(d)) return d.replace(/^(\d{3})(\d{3})(\d{4})$/, '$1 $2 $3');
    if (/^\+27[1-9]\d{8}$/.test(d)) return d.replace(/^(\+27)(\d{2})(\d{3})(\d{4})$/, '$1 $2 $3 $4');
    return v;
  }

  function validateField($f) {
    var msg = RULES[$f.data('rule')](trim($f.val()), $f.prop('required'));
    $('#' + $f.attr('id') + '-error').text(msg);
    $f.attr('aria-invalid', msg ? 'true' : 'false').toggleClass('has-error', !!msg);
    return msg;
  }
  function labelOf($f) { return trim($('label[for="' + $f.attr('id') + '"]').text()).replace(/\s*\*$/, ''); }
  function values($form) { var o = {}; $form.find('[name]').each(function () { o[this.name] = trim($(this).val()); }); return o; }
  function optText($form, id) { return $form.find('#' + id + ' option:selected').text(); }

  function showSummary($summary, errors) {
    $summary.empty();
    if (!errors.length) { $summary.attr('hidden', ''); return; }
    var $ul = $('<ul></ul>');
    errors.forEach(function (e) {
      $ul.append($('<li></li>').append($('<a></a>').attr('href', '#' + e.id).text(e.label + ': ' + e.msg)
        .on('click', function (ev) { ev.preventDefault(); $('#' + e.id).trigger('focus'); })));
    });
    $summary.append($('<strong></strong>').text('Please fix ' + errors.length + (errors.length === 1 ? ' problem' : ' problems') + ' before sending:'), $ul).removeAttr('hidden');
  }

  /* Attach the validator to a form. onValid(values) runs only when every field passes. */
  function bindForm($form, onValid) {
    var $fields = $form.find('[data-rule]');
    var $summary = $('<div class="form-summary" role="alert" tabindex="-1" hidden></div>').prependTo($form);
    $fields.on('blur change', function () {
      var $f = $(this), msg = validateField($f);
      if (!msg && $f.data('rule') === 'phone' && $f.val()) $f.val(formatPhone(trim($f.val())));
    }).on('input', function () { if ($(this).hasClass('has-error')) validateField($(this)); });
    $form.find('textarea[maxlength]').on('input', function () { $('#' + this.id + '-count').text(this.value.length + ' / ' + this.maxLength); });
    $form.on('submit', function (e) {
      e.preventDefault();
      var errors = [];
      $fields.each(function () {
        var $f = $(this), msg = validateField($f);
        if (msg) errors.push({ id: $f.attr('id'), label: labelOf($f), msg: msg });
      });
      showSummary($summary, errors);
      if (errors.length) { $('#' + errors[0].id).trigger('focus'); return; }
      $fields.filter('[data-rule="phone"]').each(function () { if (this.value) this.value = formatPhone(trim(this.value)); });
      onValid(values($form));
    });
  }

  window.GGValidator = { RULES: RULES, validateField: validateField, bindForm: bindForm, values: values, optText: optText, formatPhone: formatPhone };
})(jQuery, window);
