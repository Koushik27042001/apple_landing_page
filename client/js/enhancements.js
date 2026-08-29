/* ============================================================
   Apple Store Pune — Premium Enhancement Engine
   Stats counter · Cursor glow · Scroll progress ·
   3D tilt · Marquee pause · Section entrance
   ============================================================ */
(function () {
  'use strict';

  /* ========================================================
     1. SCROLL PROGRESS BAR
     ======================================================== */
  var progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.prepend(progressBar);

  window.addEventListener('scroll', function () {
    var scrolled = window.scrollY;
    var total = document.documentElement.scrollHeight - window.innerHeight;
    var pct = total > 0 ? (scrolled / total) * 100 : 0;
    progressBar.style.width = pct + '%';
  }, { passive: true });

  /* ========================================================
     2. FLOATING AMBIENT ORBS
     ======================================================== */
  var orbsContainer = document.createElement('div');
  orbsContainer.className = 'bg-orbs';
  orbsContainer.innerHTML =
    '<div class="bg-orb bg-orb-1"></div>' +
    '<div class="bg-orb bg-orb-2"></div>' +
    '<div class="bg-orb bg-orb-3"></div>' +
    '<div class="bg-orb bg-orb-4"></div>' +
    '<div class="bg-orb bg-orb-5"></div>';
  document.body.appendChild(orbsContainer);

  /* ========================================================
     3. CURSOR GLOW
     ======================================================== */
  if (!window.matchMedia('(pointer: coarse)').matches) {
    var cursor = document.createElement('div');
    cursor.className = 'cursor-glow';
    document.body.appendChild(cursor);

    var cx = 0, cy = 0;
    document.addEventListener('mousemove', function (e) {
      cx = e.clientX;
      cy = e.clientY;
      cursor.style.opacity = '1';
      cursor.style.left = cx + 'px';
      cursor.style.top = cy + 'px';
    }, { passive: true });

    // Expand on interactive hover
    document.addEventListener('mouseover', function (e) {
      if (e.target.closest('a, button, .product-card, .collection-card, .why-card, .feature-item')) {
        cursor.style.width = '48px';
        cursor.style.height = '48px';
        cursor.style.opacity = '0.6';
      } else {
        cursor.style.width = '24px';
        cursor.style.height = '24px';
        cursor.style.opacity = '1';
      }
    }, { passive: true });

    document.addEventListener('mouseleave', function () {
      cursor.style.opacity = '0';
    });
  }

  /* ========================================================
     4. ANIMATED STATS COUNTER
     ======================================================== */
  function animateCounter(el, from, to, suffix, duration) {
    var start = null;
    var isFloat = to !== Math.floor(to);

    function step(timestamp) {
      if (!start) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = from + (to - from) * eased;
      el.textContent = (isFloat ? current.toFixed(1) : Math.round(current)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var statsObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var numEl = entry.target.querySelector('.stat-number[data-target]');
      if (!numEl) return;
      var target = parseFloat(numEl.dataset.target);
      var suffix = numEl.dataset.suffix || '';
      animateCounter(numEl, 0, target, suffix, 2200);
      statsObserver.unobserve(entry.target);
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('.stat-item').forEach(function (item) {
    statsObserver.observe(item);
  });

  /* ========================================================
     5. HERO GRID OVERLAY
     ======================================================== */
  var heroCarousel = document.querySelector('.hero-carousel');
  if (heroCarousel) {
    var gridOverlay = document.createElement('div');
    gridOverlay.className = 'hero-grid-overlay';
    heroCarousel.appendChild(gridOverlay);
  }

  /* ========================================================
     6. HERO FLOATING STAT CARDS (first slide only)
     ======================================================== */
  if (heroCarousel) {
    var statCardsHTML =
      '<div class="hero-stat-cards" id="heroStatCards">' +
        '<div class="hero-stat-card" style="--d:5s;--delay:0s">' +
          '<div class="hsc-icon">❤️</div>' +
          '<div class="hsc-info">' +
            '<span class="hsc-num">4.9★</span>' +
            '<span class="hsc-lbl">Customer Rating</span>' +
          '</div>' +
        '</div>' +
        '<div class="hero-stat-card" style="--d:4.5s;--delay:-1.5s">' +
          '<div class="hsc-icon">📦</div>' +
          '<div class="hsc-info">' +
            '<span class="hsc-num">24hr</span>' +
            '<span class="hsc-lbl">Fast Delivery</span>' +
          '</div>' +
        '</div>' +
      '</div>';
    heroCarousel.insertAdjacentHTML('beforeend', statCardsHTML);
  }

  /* ========================================================
     7. MARQUEE STRIP — Duplicate items for seamless loop
     ======================================================== */
  var marqueeInner = document.querySelector('.marquee-inner');
  if (marqueeInner) {
    var items = marqueeInner.innerHTML;
    marqueeInner.innerHTML += items; // Duplicate for seamless loop

    // Pause on hover
    marqueeInner.parentElement.addEventListener('mouseenter', function () {
      marqueeInner.style.animationPlayState = 'paused';
    });
    marqueeInner.parentElement.addEventListener('mouseleave', function () {
      marqueeInner.style.animationPlayState = 'running';
    });
  }

  /* ========================================================
     8. COLLECTION CARD 3D DEPTH TILT
     ======================================================== */
  document.querySelectorAll('.collection-card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      var rx = y * -8;
      var ry = x * 10;
      card.style.transform = 'perspective(1000px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translateY(-8px)';
    });
    card.addEventListener('mouseleave', function () {
      card.style.transform = '';
    });
  });

  /* ========================================================
     9. FEATURE ITEM STAGGER
     ======================================================== */
  var featureItems = document.querySelectorAll('.feature-item');
  featureItems.forEach(function (item, i) {
    item.style.transitionDelay = (i * 0.08) + 's';
  });

  /* ========================================================
     10. WHY CARD FLOAT ANIMATION
     ======================================================== */
  var whyCards = document.querySelectorAll('.why-card');
  var whyObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        whyObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  whyCards.forEach(function (card, i) {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease ' + (i * 0.12) + 's, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ' + (i * 0.12) + 's';
    whyObserver.observe(card);
  });

  /* ========================================================
     11. PRODUCT IMAGE PARALLAX WITHIN CARD
     ======================================================== */
  document.addEventListener('mousemove', function (e) {
    var cards = document.querySelectorAll('.collection-card:hover img');
    cards.forEach(function (img) {
      var card = img.closest('.collection-card');
      var rect = card.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      img.style.transform = 'scale(1.07) translateX(' + (x * 12) + 'px) translateY(' + ((-6) + y * -8) + 'px)';
    });
  }, { passive: true });

  /* ========================================================
     12. SECTION ENTRANCE — Extra stagger for new sections
     ======================================================== */
  var sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('section-entered');
        sectionObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.stats-infographic, .product-showcase-3d, .section--spotlight').forEach(function (s) {
    sectionObserver.observe(s);
  });

  /* ========================================================
     13. ORBIT ITEM COUNTER-ROTATE (keep icons upright)
     ======================================================== */
  // CSS handles counter-rotation via negative rotate
  // No JS needed — pure CSS handles it

  /* ========================================================
     14. HERO SLIDE — Update stat card visibility
     ======================================================== */
  var heroSlides = document.querySelector('.hero-slides');
  var statCards = document.getElementById('heroStatCards');

  if (heroSlides && statCards) {
    var mo = new MutationObserver(function () {
      var t = heroSlides.style.transform;
      var match = t && t.match(/translateX\(-(\d+)%\)/);
      var idx = match ? Math.round(parseInt(match[1], 10) / 100) : 0;
      statCards.style.opacity = idx === 0 ? '1' : '0';
      statCards.style.transition = 'opacity 0.5s ease';
    });
    mo.observe(heroSlides, { attributes: true, attributeFilter: ['style'] });
  }

  /* ========================================================
     15. PRODUCT CARD RAINBOW BORDER GLOW
     ======================================================== */
  document.querySelectorAll('.product-card').forEach(function (card) {
    card.addEventListener('mouseenter', function () {
      var colors = [
        'rgba(0,102,204,0.15)',
        'rgba(88,86,214,0.15)',
        'rgba(255,45,85,0.1)',
        'rgba(52,199,89,0.1)',
        'rgba(255,159,10,0.1)'
      ];
      var color = colors[Math.floor(Math.random() * colors.length)];
      card.style.setProperty('--glow-color', color);
    });
  });

  /* ========================================================
     16. DECORATIVE SECTION SEPARATORS
     ======================================================== */
  function injectSeparator(afterEl) {
    var sep = document.createElement('div');
    sep.className = 'section-separator';
    afterEl.insertAdjacentElement('afterend', sep);
  }

  // Add separators between major sections
  var heroSection = document.querySelector('.hero-carousel');
  if (heroSection) injectSeparator(heroSection);

})();
