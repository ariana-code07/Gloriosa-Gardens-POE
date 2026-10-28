/* Gloriosa Gardens - main.js (Part 3): interactivity, dynamic content and form validation */
(function ($) {
  'use strict';
  var RECIPIENT = 'gloriosa123.rl@gmail.com';
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;
  function trim(s) { return String(s == null ? '' : s).trim(); }

  /* ---------- 1. Scroll-reveal animation ---------- */
  function initReveal() {
    var $els = $('.feature-card,.service-card,.value-card,.team-card,.process-step,.stat-card,.gallery-item,.contact-card,.cta-banner,.seo-intro,.form-card').addClass('reveal');
    if (reduceMotion || !hasIO) { $els.addClass('is-visible'); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { $(e.target).addClass('is-visible'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    $els.each(function () { io.observe(this); });
  }

  /* ---------- 2. Animated number counters (jQuery animate) ---------- */
  function initCounters() {
    if (reduceMotion || !hasIO) return;
    $('.stat-card .num').each(function () {
      var $n = $(this), m = $n.text().match(/^(\d+)(.*)$/);
      if (!m) return;
      var target = +m[1], suffix = m[2], done = false;
      $n.text('0' + suffix);
      new IntersectionObserver(function (en, obs) {
        if (en[0].isIntersecting && !done) {
          done = true; obs.disconnect();
          $({ v: 0 }).animate({ v: target }, { duration: 1200,
            step: function (v) { $n.text(Math.round(v) + suffix); },
            complete: function () { $n.text(target + suffix); } });
        }
      }).observe(this);
    });
  }

  /* ---------- 3. Accordion (FAQ) ---------- */
  function initAccordion() {
    $('.accordion-trigger').on('click', function () {
      var $b = $(this), open = $b.attr('aria-expanded') === 'true', $p = $('#' + $b.attr('aria-controls'));
      $b.attr('aria-expanded', String(!open));
      if (open) { $p.slideUp(200, function () { $p.attr('hidden', ''); }); }
      else { $p.removeAttr('hidden').hide().slideDown(200); }
    });
  }

  /* ---------- 4. Gallery lightbox ---------- */
  function initLightbox() {
    var $imgs = $('.gallery-item:not(.video-item) img');
    if (!$imgs.length) return;
    var idx = 0, lastFocus;
    var $lb = $('<div class="lightbox" role="dialog" aria-modal="true" aria-label="Image viewer" hidden>' +
      '<button class="lb-close" aria-label="Close image viewer">&times;</button>' +
      '<button class="lb-prev" aria-label="Previous image">&#10094;</button>' +
      '<figure><img alt=""><figcaption></figcaption></figure>' +
      '<button class="lb-next" aria-label="Next image">&#10095;</button></div>').appendTo('body');
    function show(i) {
      idx = (i + $imgs.length) % $imgs.length;
      var im = $imgs.get(idx);
      $lb.find('img').attr({ src: im.src, alt: im.alt });
      $lb.find('figcaption').text($(im).closest('figure').find('figcaption').text() + ' (' + (idx + 1) + ' of ' + $imgs.length + ')');
    }
    function open(i) { lastFocus = document.activeElement; show(i); $lb.removeAttr('hidden').hide().fadeIn(180); $('body').addClass('no-scroll'); $lb.find('.lb-close').trigger('focus'); }
    function close() { $lb.fadeOut(150, function () { $lb.attr('hidden', ''); }); $('body').removeClass('no-scroll'); if (lastFocus) lastFocus.focus(); }
    $imgs.each(function (i) {
      $(this).attr({ tabindex: 0, role: 'button' })
        .on('click', function () { open(i); })
        .on('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); } });
    });
    $lb.on('click', '.lb-close', close).on('click', '.lb-prev', function () { show(idx - 1); })
      .on('click', '.lb-next', function () { show(idx + 1); })
      .on('click', function (e) { if (e.target === this) close(); });
    $(document).on('keydown', function (e) {
      if ($lb.is(':hidden')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });
  }

  /* ---------- 5. Dynamic services: render + search / filter / sort ---------- */
  function S(name, cat, key, desc) { return { name: name, cat: cat, key: key, desc: desc }; }
  var SERVICES = [
    S('Lawn mowing & grass cutting', 'Regular Maintenance', 'maintenance', 'Scheduled mowing to keep lawns even, healthy and tidy.'),
    S('Edge trimming', 'Regular Maintenance', 'maintenance', 'Crisp edges along walkways, beds and walls.'),
    S('Weed control', 'Regular Maintenance', 'maintenance', 'Removing weeds from beds, paving and paths before they spread.'),
    S('Sweeping & blowing hard surfaces', 'Regular Maintenance', 'maintenance', 'Clearing paths, patios and driveways after every visit.'),
    S('Pruning & shaping', 'Plant Care', 'plant-care', 'Shaping shrubs and bushes to keep them healthy and attractive.'),
    S('Hedge cutting', 'Plant Care', 'plant-care', 'Neat hedges and fence-line trimming at the right time of year.'),
    S('Deadheading & leaf removal', 'Plant Care', 'plant-care', 'Removing spent flowers and dead leaves to encourage new growth.'),
    S('Seasonal planting', 'Plant Care', 'plant-care', 'Seedlings and flowers chosen to suit the season and your garden.'),
    S('Garden refuse removal', 'Clean-Up & Extras', 'clean-up', 'Bagging and removing garden waste so the job is left spotless.'),
    S('Leaf clearing', 'Clean-Up & Extras', 'clean-up', 'Autumn and seasonal leaf clearing for lawns, beds and gutters.'),
    S('Irrigation checks', 'Clean-Up & Extras', 'clean-up', 'Basic checks on sprinklers and watering systems.'),
    S('Lawn dressing & fertilising', 'Clean-Up & Extras', 'clean-up', 'Feeding and levelling lawns for a thicker, greener finish.'),
    S('Full garden redesign', 'Garden Design', 'design', 'A complete makeover tailored to your space, style and budget.'),
    S('Garden blueprints & planning', 'Garden Design', 'design', 'Scaled design plans from our garden and outdoor designer.')
  ];
  function initServices() {
    var $list = $('#service-list');
    if (!$list.length) return;
    function render() {
      var q = trim($('#service-search').val()).toLowerCase(), cat = $('#service-category').val(), sort = $('#service-sort').val();
      var res = SERVICES.filter(function (s) {
        return (cat === 'all' || s.cat === cat) && (!q || (s.name + ' ' + s.desc + ' ' + s.cat).toLowerCase().indexOf(q) > -1);
      }).sort(function (a, b) {
        if (sort === 'za') return b.name.localeCompare(a.name);
        if (sort === 'cat') return a.cat.localeCompare(b.cat) || a.name.localeCompare(b.name);
        return a.name.localeCompare(b.name);
      });
      $list.empty();
      res.forEach(function (s) {
        $list.append($('<article class="service-card reveal is-visible"></article>').append(
          $('<span class="tag"></span>').text(s.cat), $('<h3></h3>').text(s.name), $('<p></p>').text(s.desc),
          $('<a class="card-link"></a>').attr('href', 'enquiry.html?service=' + s.key).text('Enquire about this service \u2192')));
      });
      $('#service-count').text(res.length ? 'Showing ' + res.length + ' of ' + SERVICES.length + ' services' : 'No services match your search. Try a different word or reset the filters.');
    }
    $('#service-search').on('input', render);
    $('#service-category,#service-sort').on('change', render);
    render();
  }

  /* ---------- 6. Form helpers (validation lives in validator.js) ---------- */
  var V = window.GGValidator, bindForm = V.bindForm, optText = V.optText;
  function mailto(subject, body) { return 'mailto:' + RECIPIENT + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body); }
  function esc(s) { return $('<div>').text(s).html(); }
  function showResult($r) { $r.removeAttr('hidden'); $r[0].scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest' }); $r.trigger('focus'); }

  /* ---------- 7. Enquiry form: AJAX pricing lookup + availability ---------- */
  var FALLBACK_PRICING = { rangePercent: 15, frequency: { once: 1, monthly: 0.95, fortnightly: 0.9, weekly: 0.85 }, services: {
    maintenance: { label: 'Regular Maintenance', type: 'per visit', sizes: { small: 350, medium: 550, large: 850 } },
    'plant-care': { label: 'Plant Care', type: 'per visit', sizes: { small: 300, medium: 450, large: 700 } },
    'clean-up': { label: 'Clean-Up & Extras', type: 'per visit', sizes: { small: 400, medium: 650, large: 1000 } },
    design: { label: 'Garden Design', type: 'once-off project', sizes: { small: 2500, medium: 5000, large: 9500 } } } };
  function estimate(p, v) {
    var s = p.services[v.service], mult = v.service === 'design' ? 1 : (p.frequency[v.frequency] || 1), mid = s.sizes[v.size] * mult, pct = p.rangePercent / 100;
    function r(n) { return Math.round(n / 10) * 10; }
    return { low: r(mid * (1 - pct)), high: r(mid * (1 + pct)), type: s.type, label: s.label };
  }
  function fmt(n) { return 'R' + n.toLocaleString('en-ZA'); }
  function availability(dateStr) {
    var d = new Date(dateStr + 'T00:00:00'), t = new Date(), dow = d.getDay(), nice, n;
    t.setHours(0, 0, 0, 0);
    nice = d.toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    if (dow === 0) { n = new Date(d); n.setDate(n.getDate() + 1);
      return nice + ' is a Sunday, when we are closed. Our nearest available day is ' + n.toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long' }) + ' (07:00\u201317:00).'; }
    if (dow === 6) return 'We can offer a Saturday morning slot on ' + nice + ' (08:00\u201313:00), subject to confirmation.';
    if (Math.round((d - t) / 86400000) < 2) return 'Short notice: ' + nice + ' is within two days, so we will phone to confirm whether the team can fit you in (07:00\u201317:00).';
    return 'Good news \u2013 ' + nice + ' looks available (07:00\u201317:00). We will confirm the exact time once your free site visit is booked.';
  }
  function initEnquiry() {
    var $f = $('#enquiry-form');
    if (!$f.length) return;
    var t = new Date(), pad = function (n) { return ('0' + n).slice(-2); };
    $('#date').attr('min', t.getFullYear() + '-' + pad(t.getMonth() + 1) + '-' + pad(t.getDate()));
    var pre = new URLSearchParams(window.location.search).get('service');
    if (pre && $('#service option[value="' + pre + '"]').length) $('#service').val(pre);
    bindForm($f, function (v) {
      var $r = $('#enquiry-result').html('<p class="loading">Calculating your estimate\u2026</p>');
      showResult($r);
      $.getJSON('data/pricing.json').then(function (d) { return d; }, function () { return FALLBACK_PRICING; }).then(function (p) {
        var e = estimate(p, v), avail = availability(v.date), freq = v.service === 'design' ? 'Once-off project' : optText($f, 'frequency');
        var body = ['Name: ' + v.name, 'Phone: ' + v.phone, 'Email: ' + v.email, 'Service: ' + optText($f, 'service'), 'Garden size: ' + optText($f, 'size'),
          'Frequency: ' + freq, 'Preferred start date: ' + v.date, 'Estimate shown: ' + fmt(e.low) + ' - ' + fmt(e.high) + ' (' + e.type + ')', '', 'Message:', v.message].join('\n');
        $r.html('<h3>Thank you, ' + esc(v.name.split(' ')[0]) + '!</h3>' +
          '<p class="result-price"><span>Estimated cost</span><strong>' + fmt(e.low) + ' &ndash; ' + fmt(e.high) + '</strong><em>' + esc(e.type) + ' &middot; ' + esc(e.label) + '</em></p>' +
          '<p><strong>Availability:</strong> ' + esc(avail) + '</p>' +
          '<p class="result-note">This is an indicative estimate only. Your final written quote is confirmed after a free site visit.</p>' +
          '<div class="result-actions"><a class="btn-link" href="' + mailto('Garden enquiry from ' + v.name, body) + '">Email this enquiry to us</a> <a class="btn-link alt" href="services.html">Browse services</a></div>');
        showResult($r);
      });
    });
  }

  /* ---------- 8. Contact form: compile an email ---------- */
  function initContact() {
    var $f = $('#contact-form');
    if (!$f.length) return;
    bindForm($f, function (v) {
      var type = optText($f, 'msgtype'), subject = '[' + type + '] Message from ' + v.name;
      var body = ['Name: ' + v.name, 'Email: ' + v.email, 'Phone: ' + (v.phone || 'Not provided'), 'Message type: ' + type, '', 'Message:', v.message].join('\n');
      var $r = $('#contact-result').empty().append(
        $('<h3></h3>').text('Your email is ready to send'),
        $('<p></p>').text('Check the details below, then press the button to open your email app with everything filled in. It is addressed to ' + RECIPIENT + '.'),
        $('<pre class="email-preview"></pre>').text('To: ' + RECIPIENT + '\nSubject: ' + subject + '\n\n' + body),
        $('<a class="btn-link"></a>').attr('href', mailto(subject, body)).text('Open in my email app'));
      showResult($r);
    });
  }

  /* ---------- 9. Interactive map (Leaflet + OpenStreetMap) ---------- */
  function initMap() {
    if (!document.getElementById('map') || typeof L === 'undefined') return;
    var pos = [-26.1807685, 27.9292751];
    var map = L.map('map', { scrollWheelZoom: false }).setView(pos, 15);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }).addTo(map);
    L.marker(pos).addTo(map).bindPopup('<strong>Gloriosa Gardens</strong><br>90 Rebecca St, Florida,<br>Roodepoort, 1710').openPopup();
  }

  $(function () {
    initReveal(); initCounters(); initAccordion(); initLightbox();
    initServices(); initEnquiry(); initContact(); initMap();
  });
})(jQuery);
