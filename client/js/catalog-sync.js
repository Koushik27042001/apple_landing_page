/* Loads the live catalog and active advertisement banners from the backend
   when available so admin panel product and advertisement edits appear dynamically
   across the storefront. Falls back silently to the bundled client/js/data.js catalog. */
(function () {
  const base = (typeof APPLE_STORE_API_BASE !== "undefined" && APPLE_STORE_API_BASE)
    ? APPLE_STORE_API_BASE
    : "http://localhost:4000/api";

  // 1. Fetch products & categories
  if (typeof PRODUCTS !== "undefined" && typeof CATEGORIES !== "undefined") {
    fetch(base + "/products", { method: "GET" })
      .then(function (res) { return res.ok ? res.json() : null; })
      .then(function (data) {
        if (!data || !Array.isArray(data.products) || !data.products.length) return;
        PRODUCTS.length = 0;
        data.products.forEach(function (p) { PRODUCTS.push(p); });
        if (Array.isArray(data.categories) && data.categories.length) {
          CATEGORIES.length = 0;
          data.categories.forEach(function (c) { CATEGORIES.push(c); });
        }
        document.dispatchEvent(new CustomEvent("catalog:updated", { detail: data }));
      })
      .catch(function () { /* keep bundled catalog */ });
  }

  // 2. Fetch advertisement banners dynamically
  fetch(base + "/banners", { method: "GET" })
    .then(function (res) { return res.ok ? res.json() : null; })
    .then(function (data) {
      if (!data || !Array.isArray(data.banners)) return;
      window.BANNERS = data.banners;
      document.dispatchEvent(new CustomEvent("banners:updated", { detail: data.banners }));
      renderStorefrontBanners(data.banners);
    })
    .catch(function () { /* keep static banners */ });

  // 3. Fetch public store settings dynamically
  fetch(base + "/settings/public", { method: "GET" })
    .then(function (res) { return res.ok ? res.json() : null; })
    .then(function (settings) {
      if (!settings) return;
      window.STORE_SETTINGS = settings;
      document.dispatchEvent(new CustomEvent("settings:updated", { detail: settings }));
      if (settings.announcement && !document.getElementById("admin-top-promo-strip")) {
        renderAnnouncementStrip(settings.announcement);
      }
    })
    .catch(function () { /* keep defaults */ });

  function renderAnnouncementStrip(text) {
    if (!text || !text.trim()) return;
    let strip = document.getElementById("admin-top-promo-strip");
    if (!strip) {
      strip = document.createElement("div");
      strip.id = "admin-top-promo-strip";
      strip.className = "top-promo-strip";
      const header = document.getElementById("site-header");
      if (header) header.parentNode.insertBefore(strip, header);
      else document.body.insertBefore(strip, document.body.firstChild);
    }
    strip.innerHTML =
      '<div class="top-promo-content"><strong>Announcement</strong>: ' +
      escapeHtml(text) +
      '</div>';
  }

  function renderStorefrontBanners(banners) {
    if (!Array.isArray(banners) || !banners.length) return;

    // A. Top Announcement Strip Banner
    const topStripBanner = banners.find(function (b) { return b.placement === "top_strip" && b.active; });
    let strip = document.getElementById("admin-top-promo-strip");
    if (topStripBanner) {
      if (!strip) {
        strip = document.createElement("div");
        strip.id = "admin-top-promo-strip";
        strip.className = "top-promo-strip";
        const header = document.getElementById("site-header");
        if (header) header.parentNode.insertBefore(strip, header);
        else document.body.insertBefore(strip, document.body.firstChild);
      }
      strip.innerHTML =
        '<div class="top-promo-content">' +
          (topStripBanner.badge ? '<span class="promo-badge">' + escapeHtml(topStripBanner.badge) + '</span> ' : '') +
          '<strong>' + escapeHtml(topStripBanner.title) + '</strong>: ' +
          escapeHtml(topStripBanner.subtitle) + ' ' +
          '<a href="' + escapeAttr(topStripBanner.link || '#') + '" class="promo-link">' + escapeHtml(topStripBanner.btnText || 'Shop Now') + ' →</a>' +
        '</div>';
    } else if (strip) {
      strip.remove();
    }

    // B. Category Hero Banner Placement (if on category page)
    const urlParams = new URLSearchParams(window.location.search);
    const currentCat = urlParams.get("cat") || "all";
    const catBanner = banners.find(function (b) {
      return b.placement === "category_hero" && b.active && (b.category === "all" || b.category === currentCat);
    });

    const catPromoSlot = document.getElementById("admin-cat-banner-slot");
    if (catPromoSlot && catBanner) {
      catPromoSlot.innerHTML =
        '<div class="admin-custom-hero" style="margin-bottom:30px;border-radius:18px;background:linear-gradient(135deg,#fbfbfd 0%,#f2f2f7 100%);padding:36px 24px;text-align:center;">' +
          (catBanner.badge ? '<span class="badge-pill">' + escapeHtml(catBanner.badge) + '</span>' : '') +
          '<h2 style="font-size:32px;font-weight:700;margin-bottom:8px;color:#1d1d1f;">' + escapeHtml(catBanner.title) + '</h2>' +
          '<p style="font-size:17px;color:#86868b;max-width:600px;margin:0 auto 20px;">' + escapeHtml(catBanner.subtitle) + '</p>' +
          '<a href="' + escapeAttr(catBanner.link || '#') + '" class="btn btn-pill-dark" style="display:inline-block;padding:10px 24px;border-radius:20px;background:#0071e3;color:#fff;text-decoration:none;font-weight:600;">' + escapeHtml(catBanner.btnText || 'Explore') + '</a>' +
        '</div>';
    }
  }

  function escapeHtml(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function escapeAttr(str) { return escapeHtml(str); }
})();
