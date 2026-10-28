/* Gloriosa Gardens - datetime.js: live date/time updater, open/closed status, auto year */
(function (window, document) {
  'use strict';
  var TZ = 'Africa/Johannesburg';
  var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var HOURS = { 1: [7, 17], 2: [7, 17], 3: [7, 17], 4: [7, 17], 5: [7, 17], 6: [8, 13] }; /* Sunday closed */
  var fmt = new Intl.DateTimeFormat('en-ZA', { timeZone: TZ, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' });
  function pad(n) { return ('0' + n).slice(-2); }

  /* Break a Date into South African date/time parts */
  function parts(date) {
    var o = {};
    fmt.formatToParts(date).forEach(function (p) { o[p.type] = p.value; });
    return { dow: DAYS.indexOf(o.weekday), h: +o.hour, m: +o.minute, s: +o.second,
      dateText: o.weekday + ', ' + o.day + ' ' + o.month + ' ' + o.year, clock: o.hour + ':' + o.minute + ':' + o.second,
      iso: o.year + '-' + pad(['January','February','March','April','May','June','July','August','September','October','November','December'].indexOf(o.month) + 1) + '-' + pad(+o.day) };
  }

  /* Open / closed message based on the published opening hours */
  function status(date) {
    var p = parts(date), h = HOURS[p.dow], mins = p.h * 60 + p.m, i, d, hh;
    if (h && mins >= h[0] * 60 && mins < h[1] * 60) return { open: true, text: 'Open now \u00b7 closes at ' + pad(h[1]) + ':00' };
    for (i = 0; i < 8; i++) {
      d = (p.dow + i) % 7; hh = HOURS[d];
      if (!hh || (i === 0 && mins >= hh[0] * 60)) continue;
      return { open: false, text: 'Closed \u00b7 opens ' + (i === 0 ? 'today' : i === 1 ? 'tomorrow' : DAYS[d]) + ' at ' + pad(hh[0]) + ':00' };
    }
  }

  function tick() {
    var now = new Date(), p = parts(now), st = status(now);
    var date = document.getElementById('gg-date'), clock = document.getElementById('gg-clock'),
        stat = document.getElementById('gg-status'), time = document.getElementById('gg-datetime');
    if (date) date.textContent = p.dateText;
    if (clock) clock.textContent = p.clock + ' SAST';
    if (time) time.setAttribute('datetime', p.iso + 'T' + p.clock + '+02:00');
    if (stat) { stat.textContent = st.text; stat.className = 'status ' + (st.open ? 'is-open' : 'is-closed'); }
    [].forEach.call(document.querySelectorAll('[data-year]'), function (el) { el.textContent = p.iso.slice(0, 4); });
    [].forEach.call(document.querySelectorAll('.hours-table tr[data-days]'), function (tr) {
      tr.classList.toggle('today', tr.getAttribute('data-days').split(',').indexOf(String(p.dow)) > -1);
    });
  }

  function init() { tick(); window.setInterval(tick, 1000); }
  window.GGDateTime = { parts: parts, status: status, tick: tick };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})(window, document);
