/* Gloriosa Gardens - slideshow.js: accessible gallery slideshow (autoplay, controls, dots, keyboard, swipe) */
(function (window, document) {
  'use strict';
  function init() {
    var root = document.getElementById('slideshow');
    if (!root) return;
    var slides = [].slice.call(root.querySelectorAll('.slide')), dots = [], i = 0, timer = null,
        delay = +root.getAttribute('data-delay') || 5000,
        reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        playing = !reduce, startX = null,
        dotsWrap = root.querySelector('.ss-dots'), playBtn = root.querySelector('.ss-play'),
        count = root.querySelector('.ss-count'), live = root.querySelector('.ss-status');

    slides.forEach(function (s, n) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'ss-dot'; b.setAttribute('aria-label', 'Go to slide ' + (n + 1));
      b.addEventListener('click', function () { go(n); });
      dotsWrap.appendChild(b); dots.push(b);
    });

    function go(n) {
      i = (n + slides.length) % slides.length;
      slides.forEach(function (s, k) {
        s.classList.toggle('is-active', k === i); s.setAttribute('aria-hidden', k === i ? 'false' : 'true');
        dots[k].classList.toggle('is-active', k === i);
        if (k === i) dots[k].setAttribute('aria-current', 'true'); else dots[k].removeAttribute('aria-current');
      });
      count.textContent = (i + 1) + ' / ' + slides.length;
      if (!playing) live.textContent = 'Slide ' + (i + 1) + ' of ' + slides.length + ': ' + slides[i].querySelector('figcaption').textContent;
      if (timer) restart();
    }
    function start() { if (!timer) timer = window.setInterval(function () { go(i + 1); }, delay); }
    function stop() { window.clearInterval(timer); timer = null; }
    function restart() { stop(); if (playing) start(); }
    function setPlaying(on) {
      playing = on; playBtn.textContent = on ? 'Pause' : 'Play';
      playBtn.setAttribute('aria-label', on ? 'Pause slideshow' : 'Play slideshow');
      if (on) start(); else stop();
    }

    root.querySelector('.ss-prev').addEventListener('click', function () { go(i - 1); });
    root.querySelector('.ss-next').addEventListener('click', function () { go(i + 1); });
    playBtn.addEventListener('click', function () { setPlaying(!playing); });
    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') go(i - 1);
      if (e.key === 'ArrowRight') go(i + 1);
    });
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', function () { if (playing) start(); });
    root.addEventListener('focusin', stop);
    root.addEventListener('focusout', function () { if (playing) start(); });
    root.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
    root.addEventListener('touchend', function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX; startX = null;
      if (Math.abs(dx) > 40) go(dx < 0 ? i + 1 : i - 1);
    });
    document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else if (playing) start(); });

    go(0); setPlaying(playing);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})(window, document);
