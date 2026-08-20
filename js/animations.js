/* ============================================================
   Apple Store Pune — Premium Animation Engine v2
   ============================================================ */
(function () {
  'use strict';

  function qs(sel, ctx) { return (ctx || document).querySelector(sel); }
  function qsa(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  /* 1. HERO SLIDE — content slide-in on transition */
  (function heroAnimations() {
    var heroSlides = qs('.hero-slides');
    if (!heroSlides) return;
    var slides = qsa('.hero-slide');

    function activateSlide(el) {
      slides.forEach(function (s) { s.classList.remove('hero-slide--active'); });
      el.classList.add('hero-slide--active');
      var inner = qs('.inner', el);
      if (inner) {
        inner.classList.remove('hero-content-in');
        void inner.offsetWidth;
        inner.classList.add('hero-content-in');
      }
    }

    var currentSlide = 0;
    if (slides.length) activateSlide(slides[0]);
    var lastT = '';

    var mo = new MutationObserver(function () {
      var t = heroSlides.style.transform;
      if (t !== lastT) {
        lastT = t;
        var match = t.match(/translateX\(-(\d+)%\)/);
        if (match) {
          var idx = Math.round(parseInt(match[1], 10) / 100);
          if (idx !== currentSlide && slides[idx]) {
            currentSlide = idx;
            activateSlide(slides[idx]);
          }
        }
      }
    });
    mo.observe(heroSlides, { attributes: true, attributeFilter: ['style'] });
  })();

  /* 2. PRODUCT IMAGE — Float on collection card hover */
  (function productFloat() {
    qsa('.collection-card').forEach(function (card) {
      var img = qs('img', card);
      if (!img) return;
      card.addEventListener('mouseenter', function () { img.classList.add('img-floating'); });
      card.addEventListener('mouseleave', function () {
        img.classList.remove('img-floating');
        img.classList.add('img-float-out');
        setTimeout(function () { img.classList.remove('img-float-out'); }, 600);
      });
    });
  })();

  /* 3. MAGNETIC BUTTONS */
  (function magneticButtons() {
    qsa('.btn-primary, .btn-dark, .hero-arrow').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var rect = btn.getBoundingClientRect();
        var dx = clamp((e.clientX - (rect.left + rect.width / 2)) * 0.35, -14, 14);
        var dy = clamp((e.clientY - (rect.top + rect.height / 2)) * 0.35, -14, 14);
        btn.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(1.04)';
      });
      btn.addEventListener('mouseleave', function () { btn.style.transform = ''; });
    });
  })();

  /* 4. SCROLL REVEAL — stagger */
  (function scrollReveal() {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    function attach() {
      qsa('.reveal, .reveal-scale, .reveal-left, .reveal-right, .reveal-zoom').forEach(function (el) { io.observe(el); });
    }
    attach();
    setTimeout(attach, 800);
  })();

  /* 5. PRODUCT CARDS — 3-D tilt */
  (function cardTilt() {
    document.addEventListener('mousemove', function (e) {
      var card = e.target.closest('.product-card');
      if (!card) {
        qsa('.product-card.tilting').forEach(function (c) {
          c.style.transform = '';
          c.classList.remove('tilting');
        });
        return;
      }
      var rect = card.getBoundingClientRect();
      var rx = clamp(((e.clientY - rect.top) / rect.height - 0.5) * 12, -8, 8);
      var ry = clamp(((e.clientX - rect.left) / rect.width - 0.5) * -12, -8, 8);
      card.style.transform = 'perspective(600px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translateY(-5px)';
      card.classList.add('tilting');
    });
  })();

  /* 6. PARTICLE BURST — Add to Bag */
  function particle(x, y, color) {
    var p = document.createElement('span');
    p.className = 'cart-particle';
    p.style.cssText = 'left:' + x + 'px;top:' + y + 'px;background:' + color +
      ';--tx:' + (Math.random() * 140 - 70) + 'px' +
      ';--ty:' + (Math.random() * -120 - 20) + 'px' +
      ';--r:' + (Math.random() * 720) + 'deg';
    document.body.appendChild(p);
    p.addEventListener('animationend', function () { p.remove(); });
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('button');
    if (!btn || !btn.textContent.trim().includes('Add')) return;
    var rect = btn.getBoundingClientRect();
    var cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
    var cols = ['#0066cc','#5856d6','#ff2d55','#34c759','#ff9f0a'];
    for (var i = 0; i < 14; i++) {
      (function (i) {
        setTimeout(function () {
          particle(cx, cy, cols[Math.floor(Math.random() * cols.length)]);
        }, i * 18);
      })(i);
    }
  });

  /* 7. HERO PARALLAX — scroll */
  (function heroParallax() {
    var bgs = qsa('.hero-slide-bg');
    if (!bgs.length) return;
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          var sy = window.scrollY;
          if (sy < window.innerHeight * 1.5) {
            bgs.forEach(function (bg) {
              bg.style.transform = 'translateY(' + (sy * 0.25) + 'px) scale(1.06)';
            });
          }
          ticking = false;
        });
        ticking = true;
      }
    });
  })();

  /* 8. SECTION HEAD — scroll reveal */
  (function sectionHeadReveal() {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('head-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    qsa('.section-head').forEach(function (h) { io.observe(h); });
  })();

  /* 9. CURSOR SPOTLIGHT on hero */
  (function cursorSpotlight() {
    var hero = qs('.hero-carousel');
    if (!hero) return;
    var spot = document.createElement('div');
    spot.className = 'hero-spotlight';
    hero.appendChild(spot);
    hero.addEventListener('mousemove', function (e) {
      var rect = hero.getBoundingClientRect();
      spot.style.left = (e.clientX - rect.left) + 'px';
      spot.style.top = (e.clientY - rect.top) + 'px';
      spot.style.opacity = '1';
    });
    hero.addEventListener('mouseleave', function () { spot.style.opacity = '0'; });
  })();

  /* 10. WHATSAPP FLOAT — pulse ring */
  (function waPulse() {
    var wa = qs('.whatsapp-float');
    if (!wa) return;
    var ring = document.createElement('span');
    ring.className = 'wa-pulse-ring';
    wa.appendChild(ring);
  })();

  /* 11. HERO PRODUCT — breathing zoom */
  (function heroBreathe() {
    qsa('.hero-slide-bg').forEach(function (bg) {
      bg.classList.add('hero-bg-breathe');
    });
  })();

  /* 12. SPIN animation on mobile product image click */
  (function productSpin() {
    qsa('.collection-card img, .product-card .pc-image img').forEach(function (img) {
      img.addEventListener('click', function () {
        img.classList.add('img-spin-once');
        img.addEventListener('animationend', function () {
          img.classList.remove('img-spin-once');
        }, { once: true });
      });
    });
  })();

})();

/* ── Grid stagger reveal ── */
(function gridStagger() {
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('grid-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  function attachGrids() {
    var grids = document.querySelectorAll('.collections-grid, .product-grid');
    grids.forEach(function (g) { io.observe(g); });
  }

  attachGrids();
  setTimeout(attachGrids, 900); // After dynamic product grids render
})();
