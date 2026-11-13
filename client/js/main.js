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
  "Service Lane, L-176, 2nd Floor 5th Main,",
  "near Outer Ring Rd, Sector 6, HSR Layout,",
  "Bengaluru, Karnataka 560102"
];
let STORE_MAP_LINK = "https://www.google.com/maps/search/?api=1&query=L-176,+5th+Main+Rd,+Sector+6,+HSR+Layout,+Bengaluru,+Karnataka+560102";
let STORE_MAP_EMBED =
  "https://maps.google.com/maps?q=L-176,+5th+Main+Rd,+Sector+6,+HSR+Layout,+Bengaluru,+Karnataka+560102&t=&z=16&ie=UTF8&iwloc=B&output=embed";

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
  const isProductActive = ["iphone", "ipad", "mac", "watch", "airpods", "apple", "macbook-air", "macbook-neo", "iphone-18-pro", "ipad-mini", "mac-mini"].includes(active);
  const isDarkPage = true; // Signature Apple luxury dark glass navbar across all pages

  el.innerHTML =
    '<header class="site-header' + (isDarkPage ? ' site-header--dark' : '') + '" id="siteHeaderEl">' +
      '<div class="header-inner">' +
        '<button class="menu-toggle" id="menuToggleBtn" aria-label="Menu">' + icon("menu", { size: 22 }) + '</button>' +
        '<a href="index.html" class="logo" aria-label="Iswift Business Partner home">' +
          '<img src="images/logo_for-website.svg" alt="Iswift" class="site-logo-img">' +
          '<img src="images/apple.svg" alt="Apple" class="apple-logo-svg" width="14" height="14">' +
          '<span class="store-tag"><span class="store-tag-line">Business</span><span class="store-tag-line">Partner</span></span>' +
          '<span class="sr-only">Iswift Business Partner</span>' +
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
                '<div class="cascade-item has-submenu" data-sub="products" tabindex="0" role="menuitem" aria-haspopup="true">' +
                  '<span class="cascade-item-text">Products</span>' +
                  '<span class="red-arrow">&rsaquo;</span>' +
                '</div>' +
                '<a href="pricing.html" class="cascade-item" role="menuitem">' +
                  '<span class="cascade-item-text">Pricing &amp; Catalogue</span>' +
                '</a>' +
                '<a href="about.html#business" class="cascade-item" role="menuitem">' +
                  '<span class="cascade-item-text">Apple&#39;s Business Initiatives</span>' +
                '</a>' +
                '<a href="about.html#solutions" class="cascade-item" role="menuitem">' +
                  '<span class="cascade-item-text">Superior Solutions</span>' +
                '</a>' +
                '<a href="support.html#insights" class="cascade-item" role="menuitem">' +
                  '<span class="cascade-item-text">Business Insights</span>' +
                '</a>' +
              '</div>' +

              '<!-- LEVEL 3: SECOND PANEL (PRODUCT CATEGORIES) -->' +
              '<div class="cascade-panel cascade-panel-2" id="cascadePanel2" role="group" aria-label="Product Categories">' +
                '<div class="cascade-cat-item has-submenu" data-cat="iphone" tabindex="0" role="menuitem" aria-haspopup="true">' +
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
                '<div class="cascade-prod-group" data-cat-group="iphone">' +
                  '<div class="cascade-group-title">iPhone Lineup</div>' +
                  '<a href="iphone-duo.html" class="cascade-prod-item"><span class="cascade-prod-name">iPhone duo</span><span class="badge-new-red">New</span></a>' +
                  '<a href="iphone-18-pro.html" class="cascade-prod-item"><span class="cascade-prod-name">iPhone 18 Pro</span><span class="badge-new-red">New</span></a>' +
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
                  '<a href="ipad-mini.html" class="cascade-prod-item"><span class="cascade-prod-name">iPad mini</span><span class="badge-new-red">New</span></a>' +
                  '<div class="cascade-divider"></div>' +
                  '<a href="category.html?cat=ipad" class="cascade-explore-link">Explore all iPad &rarr;</a>' +
                '</div>' +

                '<!-- Mac -->' +
                '<div class="cascade-prod-group" data-cat-group="mac">' +
                  '<div class="cascade-group-title">Mac Lineup</div>' +
                  '<a href="product.html?id=macbook-pro-16-m5" class="cascade-prod-item"><span class="cascade-prod-name">MacBook Pro PROLED XDR Display</span><span class="badge-new-red">New</span></a>' +
                  '<a href="product.html?id=macbook-pro-14-m5" class="cascade-prod-item"><span class="cascade-prod-name">MacBook Pro</span></a>' +
                  '<a href="macbook-air.html" class="cascade-prod-item"><span class="cascade-prod-name">MacBook Air</span></a>' +
                  '<a href="product.html?id=imac-24-m4" class="cascade-prod-item"><span class="cascade-prod-name">iMac</span></a>' +
                  '<a href="macbook-neo.html" class="cascade-prod-item"><span class="cascade-prod-name">MacBook Neo</span></a>' +
                  '<a href="mac-mini.html" class="cascade-prod-item"><span class="cascade-prod-name">Mac Mini</span><span class="badge-new-red">New</span></a>' +
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
          '<div class="business-dropdown-menu' + (active === "business" ? ' active' : '') + '" id="bizNavDropdown">' +
            '<a href="about.html#business" class="biz-dropdown-toggle' + (active === "business" ? ' active' : '') + '">' +
              '<span>Business</span>' +
              '<svg class="chevron-icon" width="8" height="5" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
            '</a>' +
            '<div class="biz-dropdown-panel" role="menu">' +
              '<a href="pricing.html" class="biz-dropdown-item"><span class="bdi-title">Pricing &amp; Catalogue</span><span class="bdi-desc">Full 2026 specs, model numbers &amp; prices</span></a>' +
              '<a href="about.html#business" class="biz-dropdown-item"><span class="bdi-title">Business Initiatives</span><span class="bdi-desc">Apple in Enterprise &amp; Education</span></a>' +
              '<a href="about.html#solutions" class="biz-dropdown-item"><span class="bdi-title">Superior Solutions</span><span class="bdi-desc">Custom IT deployments &amp; leasing</span></a>' +
              '<a href="support.html#insights" class="biz-dropdown-item"><span class="bdi-title">Insights</span><span class="bdi-desc">Case studies &amp; technology guides</span></a>' +
              '<a href="contact.html?type=business" class="biz-dropdown-item"><span class="bdi-title">Enterprise Consultation &rarr;</span><span class="bdi-desc">Speak to an Apple business specialist</span></a>' +
            '</div>' +
          '</div>' +
          navLink("contact.html", "Contact Us", active === "contact") +
          navLink("support.html", "Support", active === "support") +
        '</nav>' +
        '<div class="header-actions">' +
          '<div class="search-wrap">' +
            '<span class="search-icon">' + icon("search", { size: 15 }) + '</span>' +
            '<input type="text" class="search-input" id="headerSearch" placeholder="Search iPhone, Mac, iPad..." autocomplete="off">' +
            '<div class="search-suggestions" id="searchSuggestions"></div>' +
          '</div>' +
          '<a href="cart.html" class="icon-btn header-bag-btn" aria-label="Shopping Bag">' +
            icon("bag", { size: 18 }) +
            '<span class="cart-count">0</span>' +
          '</a>' +
        '</div>' +
      '</div>' +
    '</header>' +
    '<div class="mobile-nav" id="mobileNav">' +
      '<div class="mobile-nav-head">' +
        '<a href="index.html" class="logo" aria-label="Iswift Business Partner home">' +
          '<img src="images/logo_for-website.svg" alt="Iswift" class="site-logo-img">' +
          '<img src="images/apple.svg" alt="Apple" class="apple-logo-svg" width="14" height="14">' +
          '<span class="store-tag"><span class="store-tag-line">Business</span><span class="store-tag-line">Partner</span></span>' +
          '<span class="sr-only">Iswift Business Partner</span>' +
        '</a>' +
        '<button class="btn-icon" id="mobileNavClose" aria-label="Close menu">' + icon("close", { size: 22 }) + '</button>' +
      '</div>' +
      '<form class="mobile-search-box" id="mobileSearchForm" action="category.html" method="get" style="margin-bottom:18px;">' +
        '<div class="search-wrap" style="width:100%;">' +
          '<span class="search-icon">' + icon("search", { size: 15 }) + '</span>' +
          '<input type="search" name="q" class="search-input" id="mobileSearch" placeholder="Search iPhone, Mac, iPad, Watch..." autocomplete="off" style="padding:12px 14px 12px 34px;">' +
        '</div>' +
      '</form>' +
      '<nav class="mobile-nav-links">' +
        '<a href="index.html" class="mobile-nav-link' + (active === "home" || active === "store" ? ' active' : '') + '">Home</a>' +
        '<div class="mobile-accordion-group" data-group="products">' +
          '<button type="button" class="mobile-accordion-toggle" aria-expanded="false"><span>Products</span><span class="toggle-icon">&rsaquo;</span></button>' +
          '<div class="mobile-accordion-content">' +
            '<!-- iPhone Submenu -->' +
            '<div class="mobile-subcat-group" data-subcat="iphone">' +
              '<button type="button" class="mobile-subcat-toggle" aria-expanded="false"><span>iPhone</span><span class="subcat-arrow">&rsaquo;</span></button>' +
              '<div class="mobile-subcat-content">' +
                '<a href="iphone-duo.html" class="mobile-leaf-link"><span class="mll-name">iPhone duo</span><span class="badge-new-red">New</span></a>' +
                '<a href="iphone-18-pro.html" class="mobile-leaf-link"><span class="mll-name">iPhone 18 Pro</span><span class="badge-new-red">New</span></a>' +
                '<a href="product.html?id=iphone-17-pro-max" class="mobile-leaf-link"><span class="mll-name">iPhone 17 Pro Max</span></a>' +
                '<a href="product.html?id=iphone-17-pro" class="mobile-leaf-link"><span class="mll-name">iPhone 17 Pro</span></a>' +
                '<a href="product.html?id=iphone-17" class="mobile-leaf-link"><span class="mll-name">iPhone 17</span></a>' +
                '<a href="product.html?id=iphone-16-pro-max" class="mobile-leaf-link"><span class="mll-name">iPhone 16 Pro Max</span></a>' +
                '<a href="product.html?id=iphone-16-pro" class="mobile-leaf-link"><span class="mll-name">iPhone 16 Pro</span></a>' +
                '<a href="product.html?id=iphone-16" class="mobile-leaf-link"><span class="mll-name">iPhone 16</span></a>' +
                '<a href="product.html?id=iphone-15" class="mobile-leaf-link"><span class="mll-name">iPhone 15</span></a>' +
                '<a href="category.html?cat=iphone" class="mobile-leaf-link mobile-leaf-explore"><span>Explore All iPhone &rarr;</span></a>' +
              '</div>' +
            '</div>' +

            '<!-- iPad Submenu -->' +
            '<div class="mobile-subcat-group" data-subcat="ipad">' +
              '<button type="button" class="mobile-subcat-toggle" aria-expanded="false"><span>iPad</span><span class="subcat-arrow">&rsaquo;</span></button>' +
              '<div class="mobile-subcat-content">' +
                '<a href="product.html?id=ipad-pro-13-m4" class="mobile-leaf-link"><span class="mll-name">iPad Pro M4</span></a>' +
                '<a href="product.html?id=ipad-air-11-m2" class="mobile-leaf-link"><span class="mll-name">iPad Air M2</span></a>' +
                '<a href="product.html?id=ipad-10th-gen" class="mobile-leaf-link"><span class="mll-name">iPad (10th gen)</span></a>' +
                '<a href="ipad-mini.html" class="mobile-leaf-link"><span class="mll-name">iPad mini (A17 Pro)</span><span class="badge-new-red" style="margin-left:6px;font-size:10px;padding:2px 6px;">New</span></a>' +
                '<a href="category.html?cat=accessories" class="mobile-leaf-link"><span class="mll-name">Apple Pencil &amp; Keyboards</span></a>' +
                '<a href="category.html?cat=ipad" class="mobile-leaf-link mobile-leaf-explore"><span>Explore All iPad &rarr;</span></a>' +
              '</div>' +
            '</div>' +

            '<!-- Mac Submenu -->' +
            '<div class="mobile-subcat-group" data-subcat="mac">' +
              '<button type="button" class="mobile-subcat-toggle" aria-expanded="false"><span>Mac</span><span class="subcat-arrow">&rsaquo;</span></button>' +
              '<div class="mobile-subcat-content">' +
                '<a href="macbook-air.html" class="mobile-leaf-link"><span class="mll-name">MacBook Air</span></a>' +
                '<a href="product.html?id=mbp-14-m4-pro" class="mobile-leaf-link"><span class="mll-name">MacBook Pro 14&quot; &amp; 16&quot;</span></a>' +
                '<a href="product.html?id=imac-24-m4" class="mobile-leaf-link"><span class="mll-name">iMac 24&quot;</span></a>' +
                '<a href="mac-mini.html" class="mobile-leaf-link"><span class="mll-name">Mac mini</span></a>' +
                '<a href="product.html?id=mac-studio-m2-max" class="mobile-leaf-link"><span class="mll-name">Mac Studio</span></a>' +
                '<a href="product.html?id=studio-display" class="mobile-leaf-link"><span class="mll-name">Displays</span></a>' +
                '<a href="category.html?cat=mac" class="mobile-leaf-link mobile-leaf-explore"><span>Explore All Mac &rarr;</span></a>' +
              '</div>' +
            '</div>' +

            '<!-- Apple Watch Submenu -->' +
            '<div class="mobile-subcat-group" data-subcat="watch">' +
              '<button type="button" class="mobile-subcat-toggle" aria-expanded="false"><span>Apple Watch</span><span class="subcat-arrow">&rsaquo;</span></button>' +
              '<div class="mobile-subcat-content">' +
                '<a href="product.html?id=watch-series-10" class="mobile-leaf-link"><span class="mll-name">Apple Watch Series 10</span></a>' +
                '<a href="product.html?id=watch-ultra-2" class="mobile-leaf-link"><span class="mll-name">Apple Watch Ultra 2</span></a>' +
                '<a href="product.html?id=watch-se-2nd-gen" class="mobile-leaf-link"><span class="mll-name">Apple Watch SE</span></a>' +
                '<a href="category.html?cat=accessories" class="mobile-leaf-link"><span class="mll-name">Watch Bands</span></a>' +
                '<a href="category.html?cat=watch" class="mobile-leaf-link mobile-leaf-explore"><span>Explore All Watch &rarr;</span></a>' +
              '</div>' +
            '</div>' +

            '<!-- AirPods Submenu -->' +
            '<div class="mobile-subcat-group" data-subcat="airpods">' +
              '<button type="button" class="mobile-subcat-toggle" aria-expanded="false"><span>AirPods</span><span class="subcat-arrow">&rsaquo;</span></button>' +
              '<div class="mobile-subcat-content">' +
                '<a href="product.html?id=airpods-4" class="mobile-leaf-link"><span class="mll-name">AirPods 4</span></a>' +
                '<a href="product.html?id=airpods-pro-2" class="mobile-leaf-link"><span class="mll-name">AirPods Pro 2</span></a>' +
                '<a href="product.html?id=airpods-max" class="mobile-leaf-link"><span class="mll-name">AirPods Max</span></a>' +
                '<a href="category.html?cat=airpods" class="mobile-leaf-link mobile-leaf-explore"><span>Explore All AirPods &rarr;</span></a>' +
              '</div>' +
            '</div>' +

            '<!-- TV & Home Submenu -->' +
            '<div class="mobile-subcat-group" data-subcat="tvhome">' +
              '<button type="button" class="mobile-subcat-toggle" aria-expanded="false"><span>TV &amp; Home</span><span class="subcat-arrow">&rsaquo;</span></button>' +
              '<div class="mobile-subcat-content">' +
                '<a href="product.html?id=apple-tv-4k" class="mobile-leaf-link"><span class="mll-name">Apple TV 4K</span></a>' +
                '<a href="product.html?id=homepod-midnight" class="mobile-leaf-link"><span class="mll-name">HomePod</span></a>' +
                '<a href="product.html?id=homepod-mini-space-grey" class="mobile-leaf-link"><span class="mll-name">HomePod mini</span></a>' +
                '<a href="category.html?cat=tvhome" class="mobile-leaf-link mobile-leaf-explore"><span>Explore All TV &amp; Home &rarr;</span></a>' +
              '</div>' +
            '</div>' +

            '<a href="pricing.html" class="mobile-sub-link" style="color:#2997ff;font-weight:600;margin-top:6px;"><span>All Products &amp; Pricing &rarr;</span></a>' +
          '</div>' +
        '</div>' +
        '<div class="mobile-accordion-group" data-group="business">' +
          '<button type="button" class="mobile-accordion-toggle" aria-expanded="false"><span>Business</span><span class="toggle-icon">&rsaquo;</span></button>' +
          '<div class="mobile-accordion-content">' +
            '<a href="pricing.html" class="mobile-sub-link"><span>Pricing &amp; Catalogue</span></a>' +
            '<a href="about.html#business" class="mobile-sub-link"><span>Business Initiatives</span></a>' +
            '<a href="about.html#solutions" class="mobile-sub-link"><span>Superior Solutions</span></a>' +
            '<a href="support.html#insights" class="mobile-sub-link"><span>Insights</span></a>' +
            '<a href="contact.html?type=business" class="mobile-sub-link" style="color:#2997ff;font-weight:600;"><span>Enterprise Consultation &rarr;</span></a>' +
          '</div>' +
        '</div>' +
        '<a href="contact.html" class="mobile-nav-link' + (active === "contact" ? ' active' : '') + '">Contact Us</a>' +
        '<a href="support.html" class="mobile-nav-link' + (active === "support" ? ' active' : '') + '">Support</a>' +
        '<div class="mobile-nav-divider"></div>' +
        '<a href="cart.html" class="mobile-nav-link" style="display:flex;align-items:center;justify-content:space-between;color:#2997ff;"><span>My Bag</span><span class="cart-count" style="display:none;background:#2997ff;color:#fff;border-radius:12px;padding:2px 8px;font-size:12px;font-weight:600;">0</span></a>' +
        '<a href="terms.html" style="font-size:13px;color:#86868b;padding:8px 4px;border:none;">Terms &amp; Policies</a>' +
      '</nav>' +
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

  function openMobileMenu() {
    if (mobileNav) {
      mobileNav.classList.add("open");
      document.body.classList.add("mobile-nav-open");
      document.documentElement.classList.add("mobile-nav-open");
      document.body.style.overflow = "hidden";

      // Completely hide sticky mobile add-to-bag/cart bar and floating widgets
      const stickyAtc = document.getElementById("stickyAtc");
      if (stickyAtc) stickyAtc.style.setProperty("display", "none", "important");
      const waFloat = document.getElementById("whatsapp-float");
      if (waFloat) waFloat.style.setProperty("display", "none", "important");

      // Hide all purchase CTAs / add to bag buttons so nothing peeks through open nav
      const atcSelectors = "#addToBagBtn, .atc-btn, #airAddToBagBtn, #neoAddToBagBtn, #miniAddToBagBtn, .add-to-cart-btn, .btn-bag, .sticky-atc, .pdp-actions, .buy-summary";
      document.querySelectorAll(atcSelectors).forEach(function (el) {
        el.style.setProperty("visibility", "hidden", "important");
      });
    }
  }

  function closeMobileMenu() {
    if (mobileNav) {
      mobileNav.classList.remove("open");
      document.body.classList.remove("mobile-nav-open");
      document.documentElement.classList.remove("mobile-nav-open");
      document.body.style.overflow = "";

      // Restore sticky mobile add-to-cart bar if on mobile
      const stickyAtc = document.getElementById("stickyAtc");
      if (stickyAtc) {
        stickyAtc.style.removeProperty("display");
        if (window.innerWidth <= 768) {
          stickyAtc.style.display = "flex";
        }
      }
      const waFloat = document.getElementById("whatsapp-float");
      if (waFloat) waFloat.style.removeProperty("display");

      // Restore purchase CTAs / buttons
      const atcSelectors = "#addToBagBtn, .atc-btn, #airAddToBagBtn, #neoAddToBagBtn, #miniAddToBagBtn, .add-to-cart-btn, .btn-bag, .sticky-atc, .pdp-actions, .buy-summary";
      document.querySelectorAll(atcSelectors).forEach(function (el) {
        el.style.removeProperty("visibility");
      });
    }
  }

  // Close mobile menu on Escape key press
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && mobileNav && mobileNav.classList.contains("open")) {
      closeMobileMenu();
    }
  });

  // Close mobile menu if window resized to desktop
  window.addEventListener("resize", function () {
    if (window.innerWidth > 900 && mobileNav && mobileNav.classList.contains("open")) {
      closeMobileMenu();
    }
  });

  if (menuBtn) {
    menuBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      openMobileMenu();
    });
  }
  if (closeBtn) {
    closeBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      closeMobileMenu();
    });
  }

  if (mobileNav) {
    // Accordion toggle handlers (Products, Business)
    mobileNav.querySelectorAll(".mobile-accordion-toggle").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        const grp = btn.closest(".mobile-accordion-group");
        if (grp) {
          const isOpen = grp.classList.toggle("open");
          btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
        }
      });
    });

    // Nested Category toggle handlers (iPhone, iPad, Mac, Watch, AirPods, TV & Home)
    mobileNav.querySelectorAll(".mobile-subcat-toggle").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        const grp = btn.closest(".mobile-subcat-group");
        if (grp) {
          const isOpen = grp.classList.toggle("open");
          btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
        }
      });
    });

    // Mobile nav links redirection & handling
    mobileNav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function (e) {
        const href = a.getAttribute("href");
        if (!href || href === "#") {
          e.preventDefault();
          return;
        }

        // If it's an in-page hash anchor on the current page
        const currentPath = window.location.pathname.split("/").pop() || "index.html";
        const isHashAnchor = href.startsWith("#") || (href.startsWith(currentPath + "#"));
        if (isHashAnchor) {
          closeMobileMenu();
          const targetId = href.split("#")[1];
          const target = targetId ? document.getElementById(targetId) : null;
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: "smooth" });
          }
          return;
        }

        // For all page redirects: explicitly navigate to ensure mobile browsers never drop the click
        e.preventDefault();
        window.location.href = href;
      });
    });
  }

  // Desktop Business dropdown interactions (hover + click toggle for touch devices)
  const bizDropdown = document.getElementById("bizNavDropdown");
  if (bizDropdown) {
    const bizToggle = bizDropdown.querySelector(".biz-dropdown-toggle");
    if (bizToggle) {
      bizToggle.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        bizDropdown.classList.toggle("open");
      });
    }
    document.addEventListener("click", function (e) {
      if (!bizDropdown.contains(e.target)) {
        bizDropdown.classList.remove("open");
      }
    });
  }

  // Cascading desktop mega-menu interactions
  wireCascadingMegaMenu();

  wireSearch("headerSearch", "searchSuggestions");

  // Mobile search input and form submission
  const mobileSearchForm = document.getElementById("mobileSearchForm");
  const mobileSearch = document.getElementById("mobileSearch");
  if (mobileSearchForm && mobileSearch) {
    mobileSearchForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const val = mobileSearch.value.trim();
      if (val) {
        window.location.href = "category.html?q=" + encodeURIComponent(val);
      }
    });
  }
  if (mobileSearch) {
    mobileSearch.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && mobileSearch.value.trim()) {
        e.preventDefault();
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
  let activeCategory = null;
  let lastOpenedAt = 0;

  const p1Items = panel1.querySelectorAll(".cascade-item");
  const catItems = panel2.querySelectorAll(".cascade-cat-item");
  const prodGroups = panel3.querySelectorAll(".cascade-prod-group");

  function openAppleMenu() {
    clearTimeout(closeTimer);
    lastOpenedAt = Date.now();
    menuWrapper.classList.add("open");
    if (toggleBtn) toggleBtn.setAttribute("aria-expanded", "true");
    // Initially ONLY Panel 1 is visible. Sub-panels open one-by-one on hover!
    closeSubmenus();
  }

  function closeSubmenus() {
    panel2.classList.remove("open");
    panel3.classList.remove("open");
    p1Items.forEach(function (i) { i.classList.remove("active"); });
    catItems.forEach(function (ci) { ci.classList.remove("active"); });
    prodGroups.forEach(function (g) { g.classList.remove("active"); });
    activeCategory = null;
    if (megaContainer) megaContainer.style.transform = "";
  }

  function closeAll() {
    menuWrapper.classList.remove("open");
    if (toggleBtn) toggleBtn.setAttribute("aria-expanded", "false");
    closeSubmenus();
  }

  function scheduleClose() {
    clearTimeout(closeTimer);
    closeTimer = setTimeout(closeAll, 220);
  }

  function cancelClose() {
    clearTimeout(closeTimer);
  }

  if (toggleBtn) {
    toggleBtn.addEventListener("mouseenter", openAppleMenu);
    toggleBtn.addEventListener("mouseleave", scheduleClose);
    toggleBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      const isQuickClickAfterHover = Date.now() - lastOpenedAt < 600;
      if (isQuickClickAfterHover) {
        openAppleMenu();
        return;
      }
      const willOpen = !menuWrapper.classList.contains("open");
      if (willOpen) {
        openAppleMenu();
      } else {
        closeAll();
      }
    });
  }

  if (megaContainer) {
    megaContainer.addEventListener("mouseenter", cancelClose);
    megaContainer.addEventListener("mouseleave", scheduleClose);
  }

  panel1.addEventListener("mouseenter", cancelClose);
  panel2.addEventListener("mouseenter", function () {
    cancelClose();
    panel2.classList.add("open");
    const prodItem = panel1.querySelector('[data-sub="products"]');
    if (prodItem) prodItem.classList.add("active");
  });
  panel3.addEventListener("mouseenter", function () {
    cancelClose();
    panel2.classList.add("open");
    panel3.classList.add("open");
    const prodItem = panel1.querySelector('[data-sub="products"]');
    if (prodItem) prodItem.classList.add("active");
  });

  // Level 2 (Panel 1) hover items
  p1Items.forEach(function (item) {
    item.addEventListener("mouseenter", function () {
      cancelClose();
      p1Items.forEach(function (i) { i.classList.remove("active"); });
      item.classList.add("active");

      if (item.dataset.sub === "products") {
        // Open Level 3 (Panel 2: Categories)
        panel2.classList.add("open");
        // Panel 3 stays closed until user hovers over a category in Panel 2
        panel3.classList.remove("open");
        catItems.forEach(function (ci) { ci.classList.remove("active"); });
        prodGroups.forEach(function (g) { g.classList.remove("active"); });
      } else {
        // Non-product item in Panel 1: close Level 3 & Level 4
        panel2.classList.remove("open");
        panel3.classList.remove("open");
        catItems.forEach(function (ci) { ci.classList.remove("active"); });
        prodGroups.forEach(function (g) { g.classList.remove("active"); });
      }
    });

    item.addEventListener("focus", function () {
      cancelClose();
      p1Items.forEach(function (i) { i.classList.remove("active"); });
      item.classList.add("active");
      if (item.dataset.sub === "products") {
        panel2.classList.add("open");
      } else {
        panel2.classList.remove("open");
        panel3.classList.remove("open");
      }
    });
  });

  // Level 3 (Panel 2) category hover items
  catItems.forEach(function (item) {
    item.addEventListener("mouseenter", function () {
      cancelClose();
      panel2.classList.add("open");
      const prodItem = panel1.querySelector('[data-sub="products"]');
      if (prodItem) prodItem.classList.add("active");

      const catKey = item.dataset.cat;
      if (catKey) {
        activateCategory(catKey, item);
      }
    });

    item.addEventListener("focus", function () {
      cancelClose();
      panel2.classList.add("open");
      const catKey = item.dataset.cat;
      if (catKey) activateCategory(catKey, item);
    });
  });

  function activateCategory(catKey, catElement) {
    activeCategory = catKey;

    catItems.forEach(function (ci) {
      if (ci.dataset.cat === catKey) {
        ci.classList.add("active");
      } else {
        ci.classList.remove("active");
      }
    });

    // Open Level 4 (Panel 3: Product Listings)
    panel3.classList.add("open");
    prodGroups.forEach(function (g) {
      if (g.dataset.catGroup === catKey) {
        g.classList.add("active");
      } else {
        g.classList.remove("active");
      }
    });

    if (catElement) {
      alignPanel3ToCategory(catElement);
    }
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
      closeAll();
      if (toggleBtn) toggleBtn.focus();
    }
  });

  // Outside click closes
  document.addEventListener("click", function (e) {
    if (!menuWrapper.contains(e.target)) {
      closeAll();
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
  const isDarkPage = true; // Signature Apple luxury dark glass navbar across all pages
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
            '<a href="index.html" class="logo footer-logo" aria-label="Iswift Business Partner home">' +
              '<img src="images/logo_for-website.svg" alt="Iswift" class="site-logo-img footer-logo-img">' +
              '<img src="images/apple.svg" alt="Apple" class="apple-logo-svg" width="14" height="14">' +
              '<span class="store-tag"><span class="store-tag-line">Business</span><span class="store-tag-line">Partner</span></span>' +
              '<span class="sr-only">Iswift Business Partner</span>' +
            '</a>' +
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
              '<a href="' + STORE_MAP_LINK + '" target="_blank" rel="noopener" class="footer-address-link" title="Pinpoint Head Office on Google Maps">' +
                STORE_ADDRESS_LINES.join("<br>") +
                '<span class="footer-pin-hint">Pinpoint on Map &rarr;</span>' +
              '</a>' +
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
              '<a href=\"' + STORE_MAP_LINK + '\" target=\"_blank\" rel=\"noopener\" class=\"footer-address-link\" title=\"Pinpoint Head Office on Google Maps\">' +
                '<p>Service Lane, L-176, 2nd Floor 5th Main, near Outer Ring Rd, Sector 6, HSR Layout, Bengaluru</p>' +
              '</a>' +
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
