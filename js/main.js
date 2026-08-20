/* ============================================================
   Main Module — shared header/footer rendering, search,
   mobile nav, WhatsApp float, toast notifications.
   Include after data.js, cart.js and icons.js on every page.
   ============================================================ */

const WHATSAPP_NUMBER = "917975627008";
const STORE_NAME = "Iswift Gadgets Private Limited";
const STORE_PHONE_LANDLINE = "08041492709";
const STORE_PHONE_MOBILE = "919972612530";
const STORE_PHONE_ALT = "917980128631";
const STORE_EMAIL = "info@axion.co.in";
const STORE_ADDRESS_LINES = [
  "#L-176, Ground Floor, 5th Main,",
  "HSR Layout, Sector 6,",
  "Bengaluru, 560102"
];
const STORE_MAP_LINK = "https://share.google/xm1mcXn94xCpgRc7I";
const STORE_MAP_EMBED =
  "https://www.google.com/maps?q=Axion+Computers+(Head+Office),+L-176,+5th+Main,+HSR+Layout,+Sector+6,+Bengaluru,+560102&hl=en&z=16&output=embed";

function whatsappLink(message) {
  return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);
}

function formatPhoneDisplay(digits) {
  const d = String(digits || "").replace(/\D/g, "");
  if (d.length === 12 && d.startsWith("91")) {
    return "+91 " + d.slice(2, 7) + " " + d.slice(7);
  }
  if (d.length === 11 && d.startsWith("080")) {
    return "080-" + d.slice(3, 7) + " " + d.slice(7);
  }
  if (d.length === 10) {
    return "+91 " + d.slice(0, 5) + " " + d.slice(5);
  }
  return digits;
}

function telHref(digits) {
  let d = String(digits || "").replace(/\D/g, "");
  if (d.startsWith("0")) d = "91" + d.slice(1);
  if (!d.startsWith("91") && d.length === 10) d = "91" + d;
  return "tel:+" + d;
}

function renderHeader(active) {
  const el = document.getElementById("site-header");
  if (!el) return;
  el.innerHTML =
    '<header class="site-header" id="siteHeaderEl">' +
      '<div class="header-inner">' +
        '<button class="menu-toggle" id="menuToggleBtn" aria-label="Menu">' + icon("menu", { size: 22 }) + '</button>' +
        '<a href="index.html" class="logo"><span class="logo-mark">' + icon("sparkle", { size: 18 }) + '</span> Iswift Gadgets <span class="store-tag">Private Limited</span></a>' +
        '<nav class="main-nav">' +
          navLink("index.html", "Store", active === "home") +
          navLink("category.html?cat=mac", "Mac", active === "mac") +
          navLink("category.html?cat=ipad", "iPad", active === "ipad") +
          navLink("category.html?cat=iphone", "iPhone", active === "iphone") +
          navLink("category.html?cat=watch", "Watch", active === "watch") +
          navLink("category.html?cat=vision", "Vision", active === "vision") +
          navLink("category.html?cat=airpods", "AirPods", active === "airpods") +
          navLink("category.html?cat=tvhome", "TV &amp; Home", active === "tvhome") +
          navLink("entertainment.html", "Entertainment", active === "entertainment") +
          navLink("category.html?cat=accessories", "Accessories", active === "accessories") +
          navLink("support.html", "Support", active === "support") +
        '</nav>' +
        '<div class="header-actions">' +
          '<div class="search-wrap">' +
            '<span class="search-icon">' + icon("search", { size: 15 }) + '</span>' +
            '<input type="text" class="search-input" id="headerSearch" placeholder="Search iPhone, Mac, iPad..." autocomplete="off">' +
            '<div class="search-suggestions" id="searchSuggestions"></div>' +
          '</div>' +
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
      '<a href="category.html?cat=mac">Mac</a>' +
      '<a href="category.html?cat=ipad">iPad</a>' +
      '<a href="category.html?cat=iphone">iPhone</a>' +
      '<a href="category.html?cat=watch">Watch</a>' +
      '<a href="category.html?cat=vision">Vision</a>' +
      '<a href="category.html?cat=airpods">AirPods</a>' +
      '<a href="category.html?cat=tvhome">TV &amp; Home</a>' +
      '<a href="entertainment.html">Entertainment</a>' +
      '<a href="category.html?cat=accessories">Accessories</a>' +
      '<a href="support.html">Support</a>' +
      '<div class="mobile-nav-divider"></div>' +
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
            '<span class="logo"><span class="logo-mark">' + icon("sparkle", { size: 18 }) + '</span> Iswift Gadgets Private Limited</span>' +
            '<p>Trusted destination for iPhone, Mac, iPad, Watch &amp; AirPods \u2014 genuine products with the best prices and No-Cost EMI. Head office in HSR Layout, Bengaluru.</p>' +
            '<div class="payment-icons">' +
              '<span>UPI</span><span>Visa</span><span>Mastercard</span><span>Razorpay</span><span>Cashfree</span><span>No-Cost EMI</span>' +
            '</div>' +
          '</div>' +
          '<div class="footer-col"><h5>Shop</h5><ul>' +
            '<li><a href="category.html?cat=mac">Mac</a></li>' +
            '<li><a href="category.html?cat=ipad">iPad</a></li>' +
            '<li><a href="category.html?cat=iphone">iPhone</a></li>' +
            '<li><a href="category.html?cat=watch">Watch</a></li>' +
            '<li><a href="category.html?cat=vision">Vision</a></li>' +
            '<li><a href="category.html?cat=airpods">AirPods</a></li>' +
            '<li><a href="category.html?cat=tvhome">TV &amp; Home</a></li>' +
            '<li><a href="category.html?cat=accessories">Accessories</a></li>' +
          '</ul></div>' +
          '<div class="footer-col"><h5>Tools</h5><ul>' +
            '<li><a href="entertainment.html">Entertainment</a></li>' +
            '<li><a href="support.html">Support</a></li>' +
            '<li><a href="support.html#warranty">Warranty Check</a></li>' +
            '<li><a href="cart.html">My Bag</a></li>' +
            '<li><a href="checkout.html">Checkout</a></li>' +
          '</ul></div>' +
          '<div class="footer-col"><h5>Company</h5><ul>' +
            '<li><a href="about.html">About Us</a></li>' +
            '<li><a href="contact.html">Contact Us</a></li>' +
            '<li><a href="terms.html">Terms &amp; Conditions</a></li>' +
            '<li><a href="terms.html#privacy">Privacy Policy</a></li>' +
          '</ul></div>' +
          '<div class="footer-col footer-contact"><h5>Get in touch</h5><ul>' +
            '<li class="footer-address">' +
              '<span class="footer-label">Head Office</span>' +
              STORE_ADDRESS_LINES.join("<br>") +
            '</li>' +
            '<li class="footer-phones">' +
              '<span class="footer-label">Phone</span>' +
              '<a href="' + telHref(STORE_PHONE_LANDLINE) + '">' + formatPhoneDisplay(STORE_PHONE_LANDLINE) + '</a>' +
              '<a href="' + telHref(STORE_PHONE_MOBILE) + '">' + formatPhoneDisplay(STORE_PHONE_MOBILE) + '</a>' +
              '<a href="' + telHref(WHATSAPP_NUMBER) + '">' + formatPhoneDisplay(WHATSAPP_NUMBER) + '</a>' +
              '<a href="' + telHref(STORE_PHONE_ALT) + '">' + formatPhoneDisplay(STORE_PHONE_ALT) + '</a>' +
            '</li>' +
            '<li>' +
              '<span class="footer-label">Email</span>' +
              '<a href="mailto:' + STORE_EMAIL + '">' + STORE_EMAIL + '</a>' +
            '</li>' +
            '<li><a href="' + whatsappLink("Hi, I have a query about a product on Iswift Gadgets Private Limited.") + '" target="_blank" rel="noopener">Chat on WhatsApp</a></li>' +
          '</ul></div>' +
        '</div>' +
        '<div class="footer-map-block">' +
          '<div class="footer-map-head">' +
            '<div>' +
              '<h5>Visit our head office</h5>' +
              '<p>HSR Layout, Sector 6, Bengaluru</p>' +
            '</div>' +
            '<a class="btn btn-outline" href="' + STORE_MAP_LINK + '" target="_blank" rel="noopener">Open in Google Maps</a>' +
          '</div>' +
          '<iframe class="footer-map-frame" loading="lazy" referrerpolicy="no-referrer-when-downgrade" ' +
            'src="' + STORE_MAP_EMBED + '" ' +
            'title="Iswift Gadgets / Axion Head Office map \u2014 HSR Layout, Bengaluru" ' +
            'allowfullscreen></iframe>' +
        '</div>' +
        '<div class="footer-bottom">' +
          '<div>&copy; ' + year + ' Iswift Gadgets Private Limited. Not affiliated with Apple Inc. Demo storefront.</div>' +
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
  el.innerHTML = '<a class="whatsapp-float" href="' + whatsappLink(message || "Hi, I\u2019m interested in your products on Iswift Gadgets Private Limited.") + '" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">' + icon("whatsapp", { size: 28 }) + '</a>';
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

/* ---------- Icon hydration for static markup ----------
   Lets plain HTML declare <span data-icon="lock" data-icon-size="18"></span>
   and have it filled with the real inline SVG once icons.js/main.js load,
   without needing every page to hand-build strings via icon(). */
function hydrateIcons(root) {
  const scope = root || document;
  scope.querySelectorAll("[data-icon]").forEach(function (el) {
    const name = el.getAttribute("data-icon");
    const size = Number(el.getAttribute("data-icon-size")) || 20;
    el.innerHTML = icon(name, { size: size });
  });
}

document.addEventListener("DOMContentLoaded", function () { hydrateIcons(document); });
