/* ============================================================
   Main Module — shared header/footer rendering, search,
   mobile nav, WhatsApp float, toast notifications.
   Include after data.js, cart.js and icons.js on every page.
   ============================================================ */

const WHATSAPP_NUMBER = "919999999999"; // Replace with real store WhatsApp number
const STORE_NAME = "The Apple Store Pune";

function whatsappLink(message) {
  return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);
}

function renderHeader(active) {
  const el = document.getElementById("site-header");
  if (!el) return;
  el.innerHTML =
    '<header class="site-header" id="siteHeaderEl">' +
      '<div class="header-inner">' +
        '<button class="menu-toggle" id="menuToggleBtn" aria-label="Menu">' + icon("menu", { size: 22 }) + '</button>' +
        '<a href="index.html" class="logo"><span class="logo-mark">' + icon("sparkle", { size: 18 }) + '</span> The Apple Store <span class="store-tag">Pune</span></a>' +
        '<nav class="main-nav">' +
          navLink("index.html", "Store", active === "home") +
          navLink("category.html?cat=iphone", "iPhone", active === "iphone") +
          navLink("category.html?cat=mac", "Mac", active === "mac") +
          navLink("category.html?cat=ipad", "iPad", active === "ipad") +
          navLink("category.html?cat=watch", "Watch", active === "watch") +
          navLink("category.html?cat=airpods", "AirPods", active === "airpods") +
          navLink("category.html?cat=accessories", "Accessories", active === "accessories") +
          navLink("compare.html", "Compare", active === "compare") +
          navLink("about.html", "About", active === "about") +
          navLink("contact.html", "Contact", active === "contact") +
        '</nav>' +
        '<div class="header-actions">' +
          '<div class="search-wrap">' +
            '<span class="search-icon">' + icon("search", { size: 15 }) + '</span>' +
            '<input type="text" class="search-input" id="headerSearch" placeholder="Search iPhone, Mac, iPad..." autocomplete="off">' +
            '<div class="search-suggestions" id="searchSuggestions"></div>' +
          '</div>' +
          '<a href="warranty-check.html" class="icon-btn" aria-label="Warranty Check" title="Check Warranty">' + icon("shieldCheck", { size: 20 }) + '</a>' +
          '<a href="cart.html" class="icon-btn" aria-label="Cart" title="My Bag">' + icon("bag", { size: 20 }) + '<span class="cart-count">0</span></a>' +
        '</div>' +
      '</div>' +
    '</header>' +
    '<div class="mobile-nav" id="mobileNav">' +
      '<div class="mobile-nav-head">' +
        '<span class="logo"><span class="logo-mark">' + icon("sparkle", { size: 18 }) + '</span> ' + STORE_NAME + '</span>' +
        '<button class="btn-icon" id="mobileNavClose" aria-label="Close menu">' + icon("close", { size: 22 }) + '</button>' +
      '</div>' +
      '<div style="margin-bottom:18px;">' +
        '<div class="search-wrap" style="width:100%;">' +
          '<span class="search-icon">' + icon("search", { size: 15 }) + '</span>' +
          '<input type="text" class="search-input" id="mobileSearch" placeholder="Search products..." autocomplete="off" style="padding:12px 14px 12px 34px;">' +
        '</div>' +
      '</div>' +
      '<a href="index.html">Store</a>' +
      '<a href="category.html?cat=iphone">iPhone</a>' +
      '<a href="category.html?cat=mac">Mac</a>' +
      '<a href="category.html?cat=ipad">iPad</a>' +
      '<a href="category.html?cat=watch">Watch</a>' +
      '<a href="category.html?cat=airpods">AirPods</a>' +
      '<a href="category.html?cat=accessories">Accessories</a>' +
      '<a href="compare.html">Compare Models</a>' +
      '<a href="warranty-check.html">Warranty Check</a>' +
      '<a href="cart.html">Bag</a>' +
      '<a href="about.html">About Us</a>' +
      '<a href="contact.html">Contact Us</a>' +
    '</div>';

  wireHeaderInteractions();
  updateCartBadge();
  updateCompareBadgeIfPresent();
}

function navLink(href, label, isActive) {
  return '<a href="' + href + '" class="' + (isActive ? "active" : "") + '">' + label + "</a>";
}

function wireHeaderInteractions() {
  const menuBtn = document.getElementById("menuToggleBtn");
  const mobileNav = document.getElementById("mobileNav");
  const closeBtn = document.getElementById("mobileNavClose");
  if (menuBtn && mobileNav) {
    menuBtn.addEventListener("click", function () { mobileNav.classList.add("open"); });
  }
  if (closeBtn && mobileNav) {
    closeBtn.addEventListener("click", function () { mobileNav.classList.remove("open"); });
  }
  mobileNav && mobileNav.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () { mobileNav.classList.remove("open"); });
  });

  wireSearch("headerSearch", "searchSuggestions");

  const mobileSearch = document.getElementById("mobileSearch");
  if (mobileSearch) {
    mobileSearch.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && mobileSearch.value.trim()) {
        window.location.href = "category.html?q=" + encodeURIComponent(mobileSearch.value.trim());
      }
    });
  }

  const headerEl = document.getElementById("siteHeaderEl");
  if (headerEl) {
    const onScroll = function () {
      headerEl.classList.toggle("scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }
}

function wireSearch(inputId, dropdownId) {
  const input = document.getElementById(inputId);
  const dropdown = document.getElementById(dropdownId);
  if (!input || !dropdown) return;

  function renderResults(query) {
    const results = searchProducts(query).slice(0, 6);
    if (!query.trim()) {
      dropdown.classList.remove("open");
      dropdown.innerHTML = "";
      return;
    }
    if (results.length === 0) {
      dropdown.innerHTML = '<div class="suggestion-empty">No products found for "' + escapeHtml(query) + '"</div>';
      dropdown.classList.add("open");
      return;
    }
    dropdown.innerHTML = results.map(function (p) {
      return '<a class="suggestion-item" href="product.html?id=' + p.id + '">' +
        '<img src="' + p.images[0] + '" alt="' + p.name + '" loading="lazy">' +
        '<div class="suggestion-info">' +
          '<div class="suggestion-name">' + p.name + '</div>' +
          '<div class="suggestion-price">' + formatINR(p.price) + '</div>' +
        '</div>' +
      '</a>';
    }).join("");
    dropdown.classList.add("open");
  }

  input.addEventListener("input", function () { renderResults(input.value); });
  input.addEventListener("focus", function () { if (input.value.trim()) renderResults(input.value); });
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && input.value.trim()) {
      window.location.href = "category.html?q=" + encodeURIComponent(input.value.trim());
    }
  });
  document.addEventListener("click", function (e) {
    if (!input.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.remove("open");
    }
  });
}

function escapeHtml(str) {
  const d = document.createElement("div");
  d.textContent = str;
  return d.innerHTML;
}

function renderFooter() {
  const el = document.getElementById("site-footer");
  if (!el) return;
  const year = new Date().getFullYear();
  el.innerHTML =
    '<footer class="site-footer">' +
      '<div class="container">' +
        '<div class="trust-badges">' +
          trustBadge("lock", "Secure Payments", "100% secure UPI, card & EMI checkout") +
          trustBadge("truck", "Fast Shipping", "Pan-India delivery within 2-5 days") +
          trustBadge("checkCircle", "Genuine Products", "Sourced from authorized distributors") +
          trustBadge("undo", "Easy Returns", "7-day replacement guarantee") +
        '</div>' +
        '<div class="footer-grid">' +
          '<div class="footer-col footer-brand">' +
            '<span class="logo"><span class="logo-mark">' + icon("sparkle", { size: 18 }) + '</span> The Apple Store Pune</span>' +
            '<p>Pune\u2019s trusted destination for iPhone, Mac, iPad, Watch &amp; AirPods \u2014 genuine products with the best prices and No-Cost EMI.</p>' +
            '<div class="payment-icons">' +
              '<span>UPI</span><span>Visa</span><span>Mastercard</span><span>Razorpay</span><span>Cashfree</span><span>No-Cost EMI</span>' +
            '</div>' +
          '</div>' +
          '<div class="footer-col"><h5>Shop</h5><ul>' +
            '<li><a href="category.html?cat=iphone">iPhone</a></li>' +
            '<li><a href="category.html?cat=mac">Mac</a></li>' +
            '<li><a href="category.html?cat=ipad">iPad</a></li>' +
            '<li><a href="category.html?cat=watch">Watch</a></li>' +
            '<li><a href="category.html?cat=airpods">AirPods</a></li>' +
            '<li><a href="category.html?cat=accessories">Accessories</a></li>' +
          '</ul></div>' +
          '<div class="footer-col"><h5>Tools</h5><ul>' +
            '<li><a href="compare.html">Compare Models</a></li>' +
            '<li><a href="warranty-check.html">Warranty Check</a></li>' +
            '<li><a href="cart.html">My Bag</a></li>' +
            '<li><a href="checkout.html">Checkout</a></li>' +
          '</ul></div>' +
          '<div class="footer-col"><h5>Company</h5><ul>' +
            '<li><a href="about.html">About Us</a></li>' +
            '<li><a href="contact.html">Contact Us</a></li>' +
            '<li><a href="terms.html">Terms &amp; Conditions</a></li>' +
            '<li><a href="terms.html#privacy">Privacy Policy</a></li>' +
          '</ul></div>' +
          '<div class="footer-col"><h5>Get in touch</h5><ul>' +
            '<li>Camp, Pune, Maharashtra</li>' +
            '<li><a href="tel:+919999999999">+91 99999 99999</a></li>' +
            '<li><a href="mailto:hello@theapplestorepune.in">hello@theapplestorepune.in</a></li>' +
            '<li><a href="' + whatsappLink("Hi, I have a query about a product on The Apple Store Pune.") + '" target="_blank" rel="noopener">Chat on WhatsApp</a></li>' +
          '</ul></div>' +
        '</div>' +
        '<div class="footer-bottom">' +
          '<div>&copy; ' + year + ' The Apple Store Pune. Not affiliated with Apple Inc. Demo storefront.</div>' +
          '<div class="legal-links">' +
            '<a href="terms.html">Terms</a>' +
            '<a href="terms.html#privacy">Privacy</a>' +
            '<a href="terms.html#shipping">Shipping</a>' +
            '<a href="terms.html#returns">Returns</a>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</footer>';
}

function trustBadge(iconName, title, desc) {
  return '<div class="trust-badge"><div class="icon">' + icon(iconName, { size: 20 }) + '</div><div><h5>' + title + '</h5><p>' + desc + '</p></div></div>';
}

function renderWhatsAppFloat(message) {
  const el = document.getElementById("whatsapp-float");
  if (!el) return;
  el.innerHTML = '<a class="whatsapp-float" href="' + whatsappLink(message || "Hi, I\u2019m interested in your products on The Apple Store Pune.") + '" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">' + icon("whatsapp", { size: 28 }) + '</a>';
}

let toastTimeout;
function showToast(message, opts) {
  opts = opts || {};
  let toast = document.getElementById("globalToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "globalToast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.innerHTML = (opts.icon ? icon(opts.icon, { size: 16 }) : "") + "<span>" + escapeHtml(message) + "</span>";
  toast.classList.add("show");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(function () { toast.classList.remove("show"); }, 2800);
}

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

/* ---------- Reveal on Scroll ---------- */
function initScrollReveal() {
  const els = document.querySelectorAll(".reveal, .reveal-scale, .reveal-stagger > *");
  if (!els.length) return;
  if (!("IntersectionObserver" in window)) {
    els.forEach(function (el) { el.classList.add("in-view"); });
    return;
  }
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  els.forEach(function (el) { observer.observe(el); });
}

document.addEventListener("DOMContentLoaded", initScrollReveal);

/* Re-run reveal observation for content injected dynamically after DOMContentLoaded */
function refreshScrollReveal() {
  initScrollReveal();
}

function updateCompareBadgeIfPresent() {
  if (typeof getCompareList !== "function") return;
  const badge = document.querySelector(".compare-nav-count");
  if (badge) badge.textContent = getCompareList().length;
}
