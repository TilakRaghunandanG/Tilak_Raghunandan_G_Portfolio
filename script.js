(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------
     Theme toggle (dark / light) — persisted where possible
  --------------------------------------------------------- */
  var THEME_KEY = 'tr_portfolio_theme';

  function safeGetTheme() {
    try {
      return window.localStorage.getItem(THEME_KEY);
    } catch (e) {
      return null;
    }
  }
  function safeSetTheme(value) {
    try {
      window.localStorage.setItem(THEME_KEY, value);
    } catch (e) {
      /* storage unavailable — theme still applies for this session */
    }
  }

  function applyTheme(theme) {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }

  var storedTheme = safeGetTheme();
  var prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  var initialTheme = storedTheme || (prefersLight ? 'light' : 'dark');
  applyTheme(initialTheme);

  var themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var isLight = document.documentElement.getAttribute('data-theme') === 'light';
      var next = isLight ? 'dark' : 'light';
      applyTheme(next);
      safeSetTheme(next);
    });
  }

  /* ---------------------------------------------------------
     Mobile nav toggle
  --------------------------------------------------------- */
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var open = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------------------------------------------------------
     Scroll-reveal via IntersectionObserver
  --------------------------------------------------------- */
  var revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry, i) {
          if (entry.isIntersecting) {
            var el = entry.target;
            var delay = el.dataset.delay || 0;
            setTimeout(function () {
              el.classList.add('in');
            }, Number(delay));
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    // No IO support or reduced motion: show everything immediately
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* Stagger hero elements a touch on initial load */
  var heroReveals = document.querySelectorAll('.hero .reveal');
  heroReveals.forEach(function (el, i) {
    el.dataset.delay = i * 90;
  });

  /* ---------------------------------------------------------
     Count-up stats
  --------------------------------------------------------- */
  var statNums = document.querySelectorAll('.stat-num');

  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    if (reduceMotion) {
      el.textContent = target + suffix;
      return;
    }
    var duration = 1200;
    var start = null;

    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.round(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target + suffix;
      }
    }
    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window) {
    var statIo = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            statIo.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    statNums.forEach(function (el) { statIo.observe(el); });
  } else {
    statNums.forEach(animateCount);
  }

  /* ---------------------------------------------------------
     Pipeline connector line draw-in
  --------------------------------------------------------- */
  var pipelineLine = document.querySelector('.pipeline-line line');
  if (pipelineLine) {
    var length = 100;
    pipelineLine.style.strokeDasharray = length;
    pipelineLine.style.strokeDashoffset = reduceMotion ? 0 : length;

    if (!reduceMotion && 'IntersectionObserver' in window) {
      var pipeSection = document.getElementById('experience');
      var pipeIo = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              pipelineLine.style.transition = 'stroke-dashoffset 1.6s cubic-bezier(.22,1,.36,1)';
              pipelineLine.style.strokeDashoffset = '0';
              pipeIo.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.2 }
      );
      if (pipeSection) pipeIo.observe(pipeSection);
    }
  }

  /* ---------------------------------------------------------
     Active nav link on scroll
  --------------------------------------------------------- */
  var sections = document.querySelectorAll('main > section[id], #hero');
  var navAnchors = document.querySelectorAll('.nav-links a');

  function setActiveNav() {
    var scrollPos = window.scrollY + 140;
    var currentId = null;
    sections.forEach(function (sec) {
      if (sec.offsetTop <= scrollPos) {
        currentId = sec.id;
      }
    });
    navAnchors.forEach(function (a) {
      var href = a.getAttribute('href').replace('#', '');
      a.classList.toggle('active', href === currentId);
    });
  }
  window.addEventListener('scroll', setActiveNav, { passive: true });
  setActiveNav();

  /* ---------------------------------------------------------
     Nav background intensifies on scroll
  --------------------------------------------------------- */
  var navEl = document.getElementById('nav');
  function setNavScrolled() {
    if (window.scrollY > 40) {
      navEl.style.borderBottomColor = 'rgba(94,234,212,.18)';
    } else {
      navEl.style.borderBottomColor = '';
    }
  }
  window.addEventListener('scroll', setNavScrolled, { passive: true });

  /* ---------------------------------------------------------
     Decorative crosshair follows cursor (desktop, fine pointer only)
  --------------------------------------------------------- */
  var crosshair = document.getElementById('crosshair');
  if (crosshair && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.addEventListener('mousemove', function (e) {
      crosshair.classList.add('active');
      crosshair.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px)';
    });
    document.addEventListener('mouseleave', function () {
      crosshair.classList.remove('active');
    });
  }

  /* ---------------------------------------------------------
     Smooth-scroll offset correction for fixed nav
     (native scroll-behavior handles most of this; anchors already work)
  --------------------------------------------------------- */
})();
