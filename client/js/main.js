function appleLogoHtml(size) {
  const sz = size || 18;
  if (typeof icon === "function") {
    const ic = icon("apple", { size: sz, class: "apple-icon-svg" });
    if (ic) return ic;
  }
  return '<svg class="icon-svg icon-apple apple-icon-svg" width="' + sz + '" height="' + sz + '" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.84c.64-.78 1.08-1.87.96-2.96-.93.04-2.05.62-2.71 1.4-.58.67-1.09 1.77-.95 2.83 1.04.08 2.06-.51 2.7-1.27z"/></svg>';
}

/* ============================================================
   Main Module — shared header/footer rendering, search,
   mobile nav, WhatsApp float, toast notifications.
   Include after data.js, cart.js and icons.js on every page.
   ============================================================ */

let WHATSAPP_NUMBER = "917975627008";
let STORE_NAME = "Iswift Gadgets Private Limited";
let STORE_PHONE_LANDLINE = "08041492709";
let STORE_PHONE_MOBILE = "919972612530";
let STORE_PHONE_ALT = "917980128631";
let STORE_EMAIL = "info@axion.co.in";
let STORE_ADDRESS_LINES = [
  "#L-176, Ground Floor, 5th Main,",
  "HSR Layout, Sector 6,",
  "Bengaluru, 560102"
];
let STORE_MAP_LINK = "https://share.google/xm1mcXn94xCpgRc7I";
let STORE_MAP_EMBED =
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
  if (active) window.__ACTIVE_NAV__ = active;
  const el = document.getElementById("site-header");
  if (!el) return;
  const isProductActive = ["iphone", "ipad", "mac", "watch", "airpods", "apple"].includes(active);
  const isDarkPage = document.body.classList.contains("dark-theme") || document.body.classList.contains("page-dark");

  el.innerHTML =
    '<header class="site-header' + (isDarkPage ? ' site-header--dark' : '') + '" id="siteHeaderEl">' +
      '<div class="header-inner">' +
        '<button class="menu-toggle" id="menuToggleBtn" aria-label="Menu">' + icon("menu", { size: 22 }) + '</button>' +
        '<a href="index.html" class="logo" aria-label="Iswift Business Partner home">' +
          '<span class="logo-name">Iswift</span>' +
          '<span class="apple-logo" aria-hidden="true">' + appleLogoHtml(18) + '</span>' +
          '<span class="store-tag"><span class="store-tag-line">Business</span><span class="store-tag-line">Partner</span></span>' +
        '</a>' +
        '<nav class="main-nav">' +
          navLink("index.html", "Home", active === "home" || active === "store") +
          '<div class="products-menu apple-cascade-menu' + (isProductActive ? ' active' : '') + '" id="appleCascadeMenu">' +
            '<button class="products-menu-toggle apple-cascade-toggle" id="productsMenuToggle" type="button" aria-expanded="false" aria-controls="productsSubmenu">' +
              '<span>Apple</span>' +
              '<svg class="chevron-icon" width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
            '</button>' +
            '<div class="cascade-mega-container" id="productsSubmenu" role="menu" aria-label="Apple navigation">' +
              '<!-- LEVEL 2: FIRST PANEL (APPLE DROPDOWN) -->' +
              '<div class="cascade-panel cascade-panel-1" id="cascadePanel1" role="group" aria-label="Apple Main Menu">' +
                '<div class="cascade-item has-submenu active" data-sub="products" tabindex="0" role="menuitem" aria-haspopup="true">' +
                  '<span class="cascade-item-text">Products</span>' +
                  '<span class="red-arrow">&rsaquo;</span>' +
                '</div>' +
                '<a href="about.html#business" class="cascade-item" role="menuitem">' +
                  '<span class="cascade-item-text">Apple&#39;s Business Initiatives</span>' +
                '</a>' +
                '<a href="about.html#solutions" class="cascade-item" role="menuitem">' +
                  '<span class="cascade-item-text">Superior Solutions</span>' +
                '</a>' +
              '</div>' +

              '<!-- LEVEL 3: SECOND PANEL (PRODUCT CATEGORIES) -->' +
              '<div class="cascade-panel cascade-panel-2" id="cascadePanel2" role="group" aria-label="Product Categories">' +
                '<div class="cascade-cat-item has-submenu active" data-cat="iphone" tabindex="0" role="menuitem" aria-haspopup="true">' +
                  '<span class="cascade-item-text">iPhone</span>' +
                  '<span class="red-arrow">&rsaquo;</span>' +
                '</div>' +
                '<div class="cascade-cat-item has-submenu" data-cat="ipad" tabindex="0" role="menuitem" aria-haspopup="true">' +
                  '<span class="cascade-item-text">iPad</span>' +
                  '<span class="red-arrow">&rsaquo;</span>' +
                '</div>' +
                '<div class="cascade-cat-item has-submenu" data-cat="mac" tabindex="0" role="menuitem" aria-haspopup="true">' +
                  '<span class="cascade-item-text">Mac</span>' +
                  '<span class="red-arrow">&rsaquo;</span>' +
                '</div>' +
                '<div class="cascade-cat-item has-submenu" data-cat="watch" tabindex="0" role="menuitem" aria-haspopup="true">' +
                  '<span class="cascade-item-text">Apple Watch</span>' +
                  '<span class="red-arrow">&rsaquo;</span>' +
                '</div>' +
                '<div class="cascade-cat-item has-submenu" data-cat="airpods" tabindex="0" role="menuitem" aria-haspopup="true">' +
                  '<span class="cascade-item-text">AirPods</span>' +
                  '<span class="red-arrow">&rsaquo;</span>' +
                '</div>' +
              '</div>' +

              '<!-- LEVEL 4: THIRD PANEL (PRODUCT LISTINGS DYNAMICALLY TOP-ALIGNED) -->' +
              '<div class="cascade-panel cascade-panel-3" id="cascadePanel3" role="group" aria-label="Product Listings">' +
                '<!-- iPhone -->' +
                '<div class="cascade-prod-group active" data-cat-group="iphone">' +
                  '<div class="cascade-group-title">iPhone Lineup</div>' +
                  '<a href="product.html?id=iphone-duo" class="cascade-prod-item"><span class="cascade-prod-name">iPhone duo</span><span class="badge-new-red">New</span></a>' +
                  '<a href="product.html?id=iphone-18-pro" class="cascade-prod-item"><span class="cascade-prod-name">iPhone 18 Pro</span><span class="badge-new-red">New</span></a>' +
                  '<a href="product.html?id=iphone-17e" class="cascade-prod-item"><span class="cascade-prod-name">iPhone 17e</span></a>' +
                  '<a href="product.html?id=iphone-17" class="cascade-prod-item"><span class="cascade-prod-name">iPhone 17</span></a>' +
                  '<a href="product.html?id=iphone-air" class="cascade-prod-item"><span class="cascade-prod-name">iPhone Air</span></a>' +
                  '<div class="cascade-divider"></div>' +
                  '<a href="category.html?cat=iphone" class="cascade-explore-link">Explore all iPhone &rarr;</a>' +
                '</div>' +

                '<!-- iPad -->' +
                '<div class="cascade-prod-group" data-cat-group="ipad">' +
                  '<div class="cascade-group-title">iPad Lineup</div>' +
                  '<a href="product.html?id=ipad-pro-13-m5" class="cascade-prod-item"><span class="cascade-prod-name">iPad Pro M5</span></a>' +
                  '<a href="product.html?id=ipad-air-11-m4" class="cascade-prod-item"><span class="cascade-prod-name">iPad Air M4</span></a>' +
                  '<a href="product.html?id=ipad-11-gen" class="cascade-prod-item"><span class="cascade-prod-name">iPad Mini</span><span class="badge-new-red">New</span></a>' +
                  '<div class="cascade-divider"></div>' +
                  '<a href="category.html?cat=ipad" class="cascade-explore-link">Explore all iPad &rarr;</a>' +
                '</div>' +

                '<!-- Mac -->' +
                '<div class="cascade-prod-group" data-cat-group="mac">' +
                  '<div class="cascade-group-title">Mac Lineup</div>' +
                  '<a href="product.html?id=macbook-pro-16-m5" class="cascade-prod-item"><span class="cascade-prod-name">MacBook Pro PROLED XDR Display</span><span class="badge-new-red">New</span></a>' +
                  '<a href="product.html?id=macbook-pro-14-m5" class="cascade-prod-item"><span class="cascade-prod-name">MacBook Pro</span></a>' +
                  '<a href="product.html?id=macbook-air-13-m5" class="cascade-prod-item"><span class="cascade-prod-name">MacBook Air</span></a>' +
                  '<a href="product.html?id=imac-24-m4" class="cascade-prod-item"><span class="cascade-prod-name">iMac</span></a>' +
                  '<a href="macbook-neo.html" class="cascade-prod-item"><span class="cascade-prod-name">MacBook Neo</span></a>' +
                  '<a href="product.html?id=mac-mini-m4" class="cascade-prod-item"><span class="cascade-prod-name">Mac Mini</span><span class="badge-new-red">New</span></a>' +
                  '<a href="category.html?cat=mac" class="cascade-prod-item"><span class="cascade-prod-name">Mac Studio</span></a>' +
                  '<div class="cascade-divider"></div>' +
                  '<a href="category.html?cat=mac" class="cascade-explore-link">Explore all Mac &rarr;</a>' +
                '</div>' +

                '<!-- Apple Watch -->' +
                '<div class="cascade-prod-group" data-cat-group="watch">' +
                  '<div class="cascade-group-title">Apple Watch Lineup</div>' +
                  '<a href="product.html?id=watch-series-11" class="cascade-prod-item"><span class="cascade-prod-name">Apple Watch Series</span></a>' +
                  '<a href="product.html?id=watch-se-3" class="cascade-prod-item"><span class="cascade-prod-name">Apple Watch SE</span></a>' +
                  '<a href="product.html?id=watch-ultra-3" class="cascade-prod-item"><span class="cascade-prod-name">Apple Watch Ultra</span></a>' +
                  '<div class="cascade-divider"></div>' +
                  '<a href="category.html?cat=watch" class="cascade-explore-link">Explore all Watch &rarr;</a>' +
                '</div>' +

                '<!-- AirPods -->' +
                '<div class="cascade-prod-group" data-cat-group="airpods">' +
                  '<div class="cascade-group-title">AirPods Lineup</div>' +
                  '<a href="product.html?id=airpods-pro-3" class="cascade-prod-item"><span class="cascade-prod-name">AirPods Pro</span></a>' +
                  '<a href="category.html?cat=airpods" class="cascade-prod-item"><span class="cascade-prod-name">AirPods 4</span></a>' +
                  '<a href="product.html?id=airpods-max" class="cascade-prod-item"><span class="cascade-prod-name">AirPods Max</span></a>' +
                  '<div class="cascade-divider"></div>' +
                  '<a href="category.html?cat=airpods" class="cascade-explore-link">Explore all AirPods &rarr;</a>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +
          navLink("macbook-neo.html", "MacBook Neo", active === "macbook-neo") +
          navLink("about.html#business", "Business", active === "business") +
          navLink("entertainment.html", "Events", active === "events" || active === "entertainment") +
          navLink("support.html#insights", "Insights", active === "insights") +
          navLink("contact.html", "Contact Us", active === "contact") +
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
        '<span class="logo">' +
          '<span class="logo-name">Iswift</span>' +
          '<span class="apple-logo" aria-hidden="true">' + appleLogoHtml(18) + '</span>' +
          '<span class="store-tag"><span class="store-tag-line">Business</span><span class="store-tag-line">Partner</span></span>' +
        '</span>' +
        '<button class="btn-icon" id="mobileNavClose" aria-label="Close menu">' + icon("close", { size: 22 }) + '</button>' +
      '</div>' +
      '<div style="margin-bottom:18px;">' +
        '<div class="search-wrap" style="width:100%;">' +
          '<span class="search-icon">' + icon("search", { size: 15 }) + '</span>' +
          '<input type="text" class="search-input" id="mobileSearch" placeholder="Search products..." autocomplete="off" style="padding:12px 14px 12px 34px;">' +
        '</div>' +
      '</div>' +
      '<a href="index.html">Home</a>' +
      '<div class="mobile-accordion-group" data-group="apple">' +
        '<button type="button" class="mobile-accordion-toggle"><span>Apple</span><span class="toggle-icon">&rsaquo;</span></button>' +
        '<div class="mobile-accordion-content">' +
          '<div class="mobile-accordion-group" data-group="products">' +
            '<button type="button" class="mobile-accordion-toggle" style="font-size:14.5px; padding:8px 0;"><span>Products</span><span class="toggle-icon">&rsaquo;</span></button>' +
            '<div class="mobile-accordion-content" style="padding-left:10px;">' +
              '<div class="mobile-accordion-group" data-group="iphone">' +
                '<button type="button" class="mobile-accordion-toggle" style="font-size:13.5px; padding:6px 0;"><span>iPhone</span><span class="toggle-icon">&rsaquo;</span></button>' +
                '<div class="mobile-accordion-content">' +
                  '<a href="product.html?id=iphone-duo" class="mobile-sub-link"><span>iPhone duo</span> <span class="badge-new-red">New</span></a>' +
                  '<a href="product.html?id=iphone-18-pro" class="mobile-sub-link"><span>iPhone 18 Pro</span> <span class="badge-new-red">New</span></a>' +
                  '<a href="product.html?id=iphone-17e" class="mobile-sub-link">iPhone 17e</a>' +
                  '<a href="product.html?id=iphone-17" class="mobile-sub-link">iPhone 17</a>' +
                  '<a href="product.html?id=iphone-air" class="mobile-sub-link">iPhone Air</a>' +
                  '<a href="category.html?cat=iphone" class="mobile-sub-link" style="color:#2997ff; font-weight:600;">All iPhones &rarr;</a>' +
                '</div>' +
              '</div>' +
              '<div class="mobile-accordion-group" data-group="ipad">' +
                '<button type="button" class="mobile-accordion-toggle" style="font-size:13.5px; padding:6px 0;"><span>iPad</span><span class="toggle-icon">&rsaquo;</span></button>' +
                '<div class="mobile-accordion-content">' +
                  '<a href="product.html?id=ipad-pro-13-m5" class="mobile-sub-link">iPad Pro M5</a>' +
                  '<a href="product.html?id=ipad-air-11-m4" class="mobile-sub-link">iPad Air M4</a>' +
                  '<a href="product.html?id=ipad-11-gen" class="mobile-sub-link"><span>iPad Mini</span> <span class="badge-new-red">New</span></a>' +
                  '<a href="category.html?cat=ipad" class="mobile-sub-link" style="color:#2997ff; font-weight:600;">All iPads &rarr;</a>' +
                '</div>' +
              '</div>' +
              '<div class="mobile-accordion-group" data-group="mac">' +
                '<button type="button" class="mobile-accordion-toggle" style="font-size:13.5px; padding:6px 0;"><span>Mac</span><span class="toggle-icon">&rsaquo;</span></button>' +
                '<div class="mobile-accordion-content">' +
                  '<a href="product.html?id=macbook-pro-16-m5" class="mobile-sub-link"><span>MacBook Pro PROLED XDR Display</span> <span class="badge-new-red">New</span></a>' +
                  '<a href="product.html?id=macbook-pro-14-m5" class="mobile-sub-link">MacBook Pro</a>' +
                  '<a href="product.html?id=macbook-air-13-m5" class="mobile-sub-link">MacBook Air</a>' +
                  '<a href="product.html?id=imac-24-m4" class="mobile-sub-link">iMac</a>' +
                  '<a href="macbook-neo.html" class="mobile-sub-link">MacBook Neo</a>' +
                  '<a href="product.html?id=mac-mini-m4" class="mobile-sub-link"><span>Mac Mini</span> <span class="badge-new-red">New</span></a>' +
                  '<a href="category.html?cat=mac" class="mobile-sub-link">Mac Studio</a>' +
                  '<a href="category.html?cat=mac" class="mobile-sub-link" style="color:#2997ff; font-weight:600;">All Macs &rarr;</a>' +
                '</div>' +
              '</div>' +
              '<div class="mobile-accordion-group" data-group="watch">' +
                '<button type="button" class="mobile-accordion-toggle" style="font-size:13.5px; padding:6px 0;"><span>Apple Watch</span><span class="toggle-icon">&rsaquo;</span></button>' +
                '<div class="mobile-accordion-content">' +
                  '<a href="product.html?id=watch-series-11" class="mobile-sub-link">Apple Watch Series</a>' +
                  '<a href="product.html?id=watch-se-3" class="mobile-sub-link">Apple Watch SE</a>' +
                  '<a href="product.html?id=watch-ultra-3" class="mobile-sub-link">Apple Watch Ultra</a>' +
                  '<a href="category.html?cat=watch" class="mobile-sub-link" style="color:#2997ff; font-weight:600;">All Apple Watches &rarr;</a>' +
                '</div>' +
              '</div>' +
              '<div class="mobile-accordion-group" data-group="airpods">' +
                '<button type="button" class="mobile-accordion-toggle" style="font-size:13.5px; padding:6px 0;"><span>AirPods</span><span class="toggle-icon">&rsaquo;</span></button>' +
                '<div class="mobile-accordion-content">' +
                  '<a href="product.html?id=airpods-pro-3" class="mobile-sub-link">AirPods Pro</a>' +
                  '<a href="category.html?cat=airpods" class="mobile-sub-link">AirPods 4</a>' +
                  '<a href="product.html?id=airpods-max" class="mobile-sub-link">AirPods Max</a>' +
                  '<a href="category.html?cat=airpods" class="mobile-sub-link" style="color:#2997ff; font-weight:600;">All AirPods &rarr;</a>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<a href="about.html#business" class="mobile-sub-link">Apple&#39;s Business Initiatives</a>' +
          '<a href="about.html#solutions" class="mobile-sub-link">Superior Solutions</a>' +
        '</div>' +
      '</div>' +
      '<a href="macbook-neo.html" style="font-weight:700;color:var(--accent,#0071e3);">MacBook Neo 🔥</a>' +
      '<a href="about.html#business">Business</a>' +
      '<a href="entertainment.html">Events</a>' +
      '<a href="support.html#insights">Insights</a>' +
      '<a href="contact.html">Contact Us</a>' +
      '<a href="support.html">Support</a>' +
      '<div class="mobile-nav-divider"></div>' +
      '<a href="cart.html">Bag</a>' +
      '<a href="terms.html">Terms &amp; Policies</a>' +
    '</div>';

  wireHeaderInteractions();
  updateCartBadge();
  updateCompareBadgeIfPresent();
}

function navLink(href, label, isActive) {
  return '<a href="' + href + '" class="' + (isActive ? "active" : "") + '">' + label + '</a>';
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
  if (mobileNav) {
    mobileNav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { mobileNav.classList.remove("open"); });
    });

    mobileNav.querySelectorAll(".mobile-accordion-toggle").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        const grp = btn.closest(".mobile-accordion-group");
        if (grp) grp.classList.toggle("open");
      });
    });
  }

  // Cascading desktop mega-menu interactions
  wireCascadingMegaMenu();

  wireSearch("headerSearch", "searchSuggestions");

  const mobileSearch = document.getElementById("mobileSearch");
  if (mobileSearch) {
    mobileSearch.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && mobileSearch.value.trim()) {
        window.location.href = "category.html?q=" + encodeURIComponent(mobileSearch.value.trim());
      }
    });
  }

  const header = document.getElementById("siteHeaderEl");
  if (header) {
    const onScroll = function () {
      header.classList.toggle("scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }
}

function wireCascadingMegaMenu() {
  const menuWrapper = document.getElementById("appleCascadeMenu");
  const toggleBtn = document.getElementById("productsMenuToggle");
  const megaContainer = document.getElementById("productsSubmenu");
  const panel1 = document.getElementById("cascadePanel1");
  const panel2 = document.getElementById("cascadePanel2");
  const panel3 = document.getElementById("cascadePanel3");
  if (!menuWrapper || !panel1 || !panel2 || !panel3) return;

  let closeTimer = null;
  let activeCategory = "iphone";

  function openMenu() {
    clearTimeout(closeTimer);
    menuWrapper.classList.add("open");
    if (toggleBtn) toggleBtn.setAttribute("aria-expanded", "true");
    activateCategory(activeCategory);
  }

  function scheduleClose() {
    clearTimeout(closeTimer);
    closeTimer = setTimeout(function () {
      menuWrapper.classList.remove("open");
      if (toggleBtn) toggleBtn.setAttribute("aria-expanded", "false");
    }, 200);
  }

  function cancelClose() {
    clearTimeout(closeTimer);
  }

  if (toggleBtn) {
    toggleBtn.addEventListener("mouseenter", openMenu);
    toggleBtn.addEventListener("mouseleave", scheduleClose);
    toggleBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      const isOpen = menuWrapper.classList.toggle("open");
      toggleBtn.setAttribute("aria-expanded", String(isOpen));
      if (isOpen) activateCategory(activeCategory);
    });
  }

  if (megaContainer) {
    megaContainer.addEventListener("mouseenter", cancelClose);
    megaContainer.addEventListener("mouseleave", scheduleClose);
  }

  // Panel 1 hover items
  const p1Items = panel1.querySelectorAll(".cascade-item");
  p1Items.forEach(function (item) {
    item.addEventListener("mouseenter", function () {
      cancelClose();
      p1Items.forEach(function (i) { i.classList.remove("active"); });
      item.classList.add("active");

      if (item.dataset.sub === "products") {
        panel2.style.display = "block";
        panel2.style.opacity = "1";
        panel3.style.display = "block";
        panel3.style.opacity = "1";
        activateCategory(activeCategory);
      } else {
        panel2.style.display = "none";
        panel3.style.display = "none";
      }
    });
  });

  // Panel 2 category hover items
  const catItems = panel2.querySelectorAll(".cascade-cat-item");
  catItems.forEach(function (item) {
    item.addEventListener("mouseenter", function () {
      cancelClose();
      const catKey = item.dataset.cat;
      if (catKey) {
        activateCategory(catKey);
      }
    });
  });

  function activateCategory(catKey) {
    activeCategory = catKey;

    catItems.forEach(function (ci) {
      if (ci.dataset.cat === catKey) {
        ci.classList.add("active");
        alignPanel3ToCategory(ci);
      } else {
        ci.classList.remove("active");
      }
    });

    const groups = panel3.querySelectorAll(".cascade-prod-group");
    groups.forEach(function (g) {
      if (g.dataset.catGroup === catKey) {
        g.classList.add("active");
      } else {
        g.classList.remove("active");
      }
    });
  }

  function alignPanel3ToCategory(catElement) {
    if (!catElement || !panel2 || !panel3) return;

    const catOffsetTop = catElement.offsetTop;
    let targetTop = catOffsetTop;

    const p2Rect = panel2.getBoundingClientRect();
    const p3Height = panel3.offsetHeight || 300;
    const viewportHeight = window.innerHeight;

    const absoluteScreenTop = p2Rect.top + targetTop;
    if (absoluteScreenTop + p3Height > viewportHeight - 16) {
      const maxScreenTop = viewportHeight - p3Height - 16;
      targetTop = Math.max(0, maxScreenTop - p2Rect.top);
    }

    panel3.style.top = targetTop + "px";

    if (megaContainer) {
      const p3Right = p2Rect.right + 8 + (panel3.offsetWidth || 330);
      if (p3Right > window.innerWidth - 16) {
        const shiftX = Math.min(p3Right - window.innerWidth + 20, 240);
        megaContainer.style.transform = "translateX(-" + shiftX + "px)";
      } else {
        megaContainer.style.transform = "";
      }
    }
  }

  // Keyboard accessibility
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && menuWrapper.classList.contains("open")) {
      menuWrapper.classList.remove("open");
      if (toggleBtn) {
        toggleBtn.setAttribute("aria-expanded", "false");
        toggleBtn.focus();
      }
    }
  });

  // Outside click closes
  document.addEventListener("click", function (e) {
    if (!menuWrapper.contains(e.target)) {
      menuWrapper.classList.remove("open");
      if (toggleBtn) toggleBtn.setAttribute("aria-expanded", "false");
    }
  });
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
  const isDarkPage = document.body.classList.contains("dark-theme") || document.body.classList.contains("page-dark");
  el.innerHTML =
    '<footer class="site-footer' + (isDarkPage ? ' site-footer--dark' : '') + '">' +
      '<div class="container">' +
        '<div class="trust-badges">' +
          trustBadge("lock", "Secure Payments", "100% secure UPI, card & EMI checkout") +
          trustBadge("truck", "Fast Shipping", "Pan-India delivery within 2-5 days") +
          trustBadge("checkCircle", "Genuine Products", "Sourced from authorized distributors") +
          trustBadge("undo", "Easy Returns", "7-day replacement guarantee") +
        '</div>' +
        '<div class="footer-grid">' +
          '<div class="footer-col footer-brand">' +
            '<span class="logo"><span class="logo-name">Iswift</span><span class="apple-logo" aria-hidden="true">' + appleLogoHtml(18) + '</span><span class="store-tag">Gadgets Private Limited</span></span>' +
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

/* ---------- Dynamic Admin Settings Listener ---------- */
function applyStoreSettings(settings) {
  if (!settings) return;
  if (settings.storeName) STORE_NAME = settings.storeName;
  if (settings.email) STORE_EMAIL = settings.email;
  if (Array.isArray(settings.phones) && settings.phones.length) {
    if (settings.phones[0]) STORE_PHONE_LANDLINE = settings.phones[0];
    if (settings.phones[1]) STORE_PHONE_MOBILE = settings.phones[1];
    if (settings.phones[2]) STORE_PHONE_ALT = settings.phones[2];
  }
  if (settings.whatsapp) WHATSAPP_NUMBER = settings.whatsapp;
  if (settings.address) {
    STORE_ADDRESS_LINES = String(settings.address).split("\n").map(function (s) { return s.trim(); }).filter(Boolean);
  }
  if (settings.mapLink) STORE_MAP_LINK = settings.mapLink;

  const active = window.__ACTIVE_NAV__ || "home";
  if (document.getElementById("site-header")) renderHeader(active);
  if (document.getElementById("site-footer")) renderFooter();
  if (document.getElementById("whatsapp-float")) renderWhatsAppFloat();

  document.dispatchEvent(new CustomEvent("store_settings:applied", { detail: settings }));
}

document.addEventListener("settings:updated", function (e) {
  applyStoreSettings(e.detail);
});

if (typeof window.STORE_SETTINGS !== "undefined" && window.STORE_SETTINGS) {
  applyStoreSettings(window.STORE_SETTINGS);
}

/* ---------- Global Upload Image Fallback Handler ---------- */
function handleImageError(img) {
  if (!img) return;
  if (!img.dataset.retried && img.src && img.src.includes("images/uploads/")) {
    img.dataset.retried = "1";
    const relativePath = img.src.replace(/^.*(?=images\/uploads\/)/, "");
    img.src = "https://apple-landing-page-eut1.onrender.com/" + relativePath;
    return;
  }
  img.onerror = null;
  img.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'><rect width='100%' height='100%' fill='%23f5f5f7'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%2386868b' font-family='sans-serif' font-size='14'>Product Image</text></svg>";
}
