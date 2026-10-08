/* MetricFlow Consulting — site interactions (no dependencies) */
(function () {
  'use strict';

  var header = document.getElementById('site-header');
  var toggle = document.getElementById('nav-toggle');
  var mobileMenu = document.getElementById('mobile-menu');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Header style on scroll ---------- */
  function onScroll() {
    header.classList.toggle('is-scrolled', window.scrollY > 24);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    mobileMenu.hidden = !open;
    header.classList.toggle('menu-active', open);
    document.body.classList.toggle('menu-open', open);
  }

  toggle.addEventListener('click', function () {
    setMenu(toggle.getAttribute('aria-expanded') !== 'true');
  });

  mobileMenu.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !mobileMenu.hidden) {
      setMenu(false);
      toggle.focus();
    }
  });

  // Close the mobile menu if the viewport grows past the mobile breakpoint
  window.matchMedia('(min-width: 1025px)').addEventListener('change', function (mq) {
    if (mq.matches) setMenu(false);
  });

  /* ---------- Smooth in-page navigation ---------- */
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;
    var id = link.getAttribute('href');

    if (id === '#') { e.preventDefault(); return; }

    var target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    history.replaceState(null, '', id === '#home' ? location.pathname + location.search : id);

    // Move focus for keyboard and screen-reader users without a second jump
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  });

  /* ---------- Active nav link while scrolling ---------- */
  var navLinks = document.querySelectorAll('[data-nav]');
  var sections = document.querySelectorAll('[data-section]');

  function setActive(key) {
    navLinks.forEach(function (a) {
      var match = a.getAttribute('data-nav') === key;
      a.classList.toggle('is-active', match);
      if (match) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  }

  function updateActive() {
    var probe = window.innerHeight * 0.35;
    var current = 'home';
    sections.forEach(function (s) {
      if (s.getBoundingClientRect().top <= probe) current = s.getAttribute('data-section');
    });
    // At the very bottom of the page, highlight the last section
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = 'contact';
    setActive(current);
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { updateActive(); ticking = false; });
  }, { passive: true });
  updateActive();

  /* ---------- Reveal on scroll ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        // Small stagger for siblings in the same grid
        var siblings = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
        el.style.transitionDelay = Math.min(siblings, 7) * 60 + 'ms';
        el.classList.add('is-visible');
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // Pause the SVG shipment animation for users who prefer reduced motion
  if (reduceMotion) {
    var svg = document.querySelector('.network-svg');
    if (svg && svg.pauseAnimations) svg.pauseAnimations();
  }

  /* ---------- Toast ---------- */
  var toast = document.getElementById('toast');
  var toastTimer;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('is-visible'); }, 2600);
  }

  /* ---------- Contact form (front-end only, no backend) ---------- */
  var form = document.getElementById('contact-form');
  var success = document.getElementById('form-success');
  var successName = document.getElementById('success-name');
  var resetBtn = document.getElementById('form-reset');

  var rules = {
    name: function (v) { return v.trim() ? '' : 'Please enter your name.'; },
    email: function (v) {
      if (!v.trim()) return 'Please enter your email address.';
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Please enter a valid email address.';
    },
    message: function (v) { return v.trim().length >= 10 ? '' : 'Please share a few details (at least 10 characters).'; }
  };

  function validateField(name) {
    var input = form.elements[name];
    var msg = rules[name](input.value);
    var field = input.closest('.field');
    var err = document.getElementById(name + '-error');
    field.classList.toggle('has-error', !!msg);
    err.textContent = msg;
    if (msg) {
      input.setAttribute('aria-invalid', 'true');
      input.setAttribute('aria-describedby', name + '-error');
    } else {
      input.removeAttribute('aria-invalid');
      input.removeAttribute('aria-describedby');
    }
    return !msg;
  }

  Object.keys(rules).forEach(function (name) {
    var input = form.elements[name];
    input.addEventListener('blur', function () { if (input.value) validateField(name); });
    input.addEventListener('input', function () {
      if (input.closest('.field').classList.contains('has-error')) validateField(name);
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var firstInvalid = null;
    Object.keys(rules).forEach(function (name) {
      if (!validateField(name) && !firstInvalid) firstInvalid = form.elements[name];
    });
    if (firstInvalid) { firstInvalid.focus(); return; }

    var first = form.elements.name.value.trim().split(/\s+/)[0];
    successName.textContent = first ? ', ' + first : '';
    form.hidden = true;
    success.hidden = false;
    success.focus();
  });

  resetBtn.addEventListener('click', function () {
    form.reset();
    success.hidden = true;
    form.hidden = false;
    form.elements.name.focus();
  });
})();
