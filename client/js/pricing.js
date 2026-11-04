/* ============================================================
   Pricing & Product Catalogue Interactive Controller
   Iswift Gadgets Storefront — Apple Business Partner
   ============================================================ */

(function () {
  'use strict';

  let currentCategory = 'all';
  let searchQuery = '';
  let currentSort = 'featured';
  let currentView = 'cards'; // 'cards' or 'table'
  let activeProduct = null;
  let activeConfig = {
    storage: '',
    color: '',
    connectivity: '',
    glass: ''
  };

  // Cached DOM elements
  let gridEl = null;
  let tableBodyEl = null;
  let tableContainerEl = null;
  let searchInput = null;
  let clearSearchBtn = null;
  let sortSelect = null;
  let resultsCountEl = null;
  let configModalOverlay = null;
  let enquiryModalOverlay = null;

  function getCatalogue() {
    if (typeof window !== 'undefined' && Array.isArray(window.PRICING_CATALOGUE) && window.PRICING_CATALOGUE.length) {
      return window.PRICING_CATALOGUE;
    }
    if (typeof PRICING_CATALOGUE !== 'undefined' && Array.isArray(PRICING_CATALOGUE) && PRICING_CATALOGUE.length) {
      return PRICING_CATALOGUE;
    }
    return [];
  }

  function initPricingPage() {
    gridEl = document.getElementById('pricingGrid');
    tableBodyEl = document.getElementById('masterTableBody');
    tableContainerEl = document.getElementById('pricingTableContainer');
    searchInput = document.getElementById('pricingSearch');
    clearSearchBtn = document.getElementById('clearSearchBtn');
    sortSelect = document.getElementById('pricingSort');
    resultsCountEl = document.getElementById('resultsCount');
    configModalOverlay = document.getElementById('configModalOverlay');
    enquiryModalOverlay = document.getElementById('enquiryModalOverlay');

    const catalogue = getCatalogue();
    if (!catalogue.length) {
      console.warn('PRICING_CATALOGUE dataset not yet loaded, waiting for script...');
      setTimeout(initPricingPage, 80);
      return;
    }

    // Check URL parameters (e.g. ?cat=mac or ?q=iphone or ?view=table)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('cat')) currentCategory = urlParams.get('cat').toLowerCase();
    if (urlParams.get('q')) {
      searchQuery = urlParams.get('q');
      if (searchInput) {
        searchInput.value = searchQuery;
        if (searchInput.parentElement) searchInput.parentElement.classList.add('has-val');
      }
    }
    if (urlParams.get('view') === 'table') currentView = 'table';

    wireEvents();
    updateCategoryPillState();
    updateViewSwitcherState();
    render();

    // Auto-open modal if model or slug specified in URL
    if (urlParams.get('model')) {
      const match = findVariantByModel(urlParams.get('model'));
      if (match) openConfigModal(match.product, match.variant);
    } else if (urlParams.get('product')) {
      const p = catalogue.find(item => item.id === urlParams.get('product') || item.slug === urlParams.get('product'));
      if (p) openConfigModal(p);
    }
  }

  function wireEvents() {
    // Delegated Category tabs click
    document.addEventListener('click', function (e) {
      const catBtn = e.target.closest('.pricing-cat-pill, .pricing-category-tabs button');
      if (catBtn && catBtn.hasAttribute('data-cat')) {
        e.preventDefault();
        currentCategory = (catBtn.getAttribute('data-cat') || 'all').toLowerCase();
        updateCategoryPillState();
        render();
        return;
      }

      // Delegated View buttons click
      const viewBtn = e.target.closest('.pricing-view-btn');
      if (viewBtn && viewBtn.hasAttribute('data-view')) {
        e.preventDefault();
        currentView = viewBtn.getAttribute('data-view') || 'cards';
        updateViewSwitcherState();
        render();
        return;
      }

      // Delegated Configure buttons on cards
      const configBtn = e.target.closest('[data-action="configure"]');
      if (configBtn) {
        e.preventDefault();
        const id = configBtn.getAttribute('data-id');
        const prod = getCatalogue().find(p => p.id === id);
        if (prod) openConfigModal(prod);
        return;
      }

      // Delegated clicking anywhere on a card (except links) opens configurator
      const card = e.target.closest('.pricing-card');
      if (card && !e.target.closest('a') && !e.target.closest('button')) {
        const id = card.getAttribute('data-id');
        const prod = getCatalogue().find(p => p.id === id);
        if (prod) openConfigModal(prod);
        return;
      }

      // Delegated Table configure buttons
      const tblConfigBtn = e.target.closest('[data-action="table-configure"]');
      if (tblConfigBtn) {
        e.preventDefault();
        const prodId = tblConfigBtn.getAttribute('data-prod-id');
        const model = tblConfigBtn.getAttribute('data-model');
        const prod = getCatalogue().find(p => p.id === prodId);
        const variant = (prod && prod.variants) ? prod.variants.find(v => v.modelNumber === model) : null;
        if (prod) openConfigModal(prod, variant);
        return;
      }
    });

    // Search input
    if (searchInput) {
      searchInput.addEventListener('input', function () {
        searchQuery = this.value.trim();
        if (this.parentElement) {
          this.parentElement.classList.toggle('has-val', searchQuery.length > 0);
        }
        render();
      });
    }

    // Clear search button
    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', function () {
        if (searchInput) {
          searchInput.value = '';
          if (searchInput.parentElement) searchInput.parentElement.classList.remove('has-val');
          searchQuery = '';
          searchInput.focus();
          render();
        }
      });
    }

    // Sort select
    if (sortSelect) {
      sortSelect.addEventListener('change', function () {
        currentSort = this.value;
        render();
      });
    }

    // Modal close handlers
    const modalCloseBtn = document.getElementById('configModalClose');
    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', closeConfigModal);
    }
    if (configModalOverlay) {
      configModalOverlay.addEventListener('click', function (e) {
        if (e.target === configModalOverlay) closeConfigModal();
      });
    }

    const enquiryCloseBtn = document.getElementById('enquiryModalClose');
    if (enquiryCloseBtn) {
      enquiryCloseBtn.addEventListener('click', closeEnquiryModal);
    }
    if (enquiryModalOverlay) {
      enquiryModalOverlay.addEventListener('click', function (e) {
        if (e.target === enquiryModalOverlay) closeEnquiryModal();
      });
    }

    // Enquiry form submission
    const enquiryForm = document.getElementById('pricingEnquiryForm');
    if (enquiryForm) {
      enquiryForm.addEventListener('submit', handleEnquirySubmit);
    }

    // ESC key closes modals
    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        closeConfigModal();
        closeEnquiryModal();
      }
    });
  }

  function updateCategoryPillState() {
    const pills = document.querySelectorAll('.pricing-cat-pill, .pricing-category-tabs button');
    pills.forEach(pill => {
      const cat = (pill.getAttribute('data-cat') || '').toLowerCase();
      pill.classList.toggle('active', cat === currentCategory);
    });
  }

  function updateViewSwitcherState() {
    const viewBtns = document.querySelectorAll('.pricing-view-btn');
    viewBtns.forEach(btn => {
      const v = btn.getAttribute('data-view');
      btn.classList.toggle('active', v === currentView);
    });
    if (gridEl) gridEl.style.display = currentView === 'cards' ? 'grid' : 'none';
    if (tableContainerEl) tableContainerEl.classList.toggle('active', currentView === 'table');
  }

  function filterProducts() {
    const q = searchQuery.toLowerCase();
    const catalogue = getCatalogue();

    return catalogue.filter(prod => {
      // Category check
      if (currentCategory !== 'all') {
        if (currentCategory === 'business' || currentCategory === 'accessories') {
          if (prod.category !== 'business' && prod.category !== 'accessories') return false;
        } else if (prod.category !== currentCategory) {
          return false;
        }
      }

      // Search query check
      if (q) {
        const inName = (prod.name || '').toLowerCase().includes(q);
        const inChip = (prod.chip || '').toLowerCase().includes(q);
        const inTag = (prod.tagline || '').toLowerCase().includes(q);
        const inVariants = (prod.variants || []).some(v =>
          (v.modelNumber || '').toLowerCase().includes(q) ||
          (v.specs || '').toLowerCase().includes(q) ||
          (v.storage || '').toLowerCase().includes(q) ||
          (v.color || '').toLowerCase().includes(q)
        );
        return inName || inChip || inTag || inVariants;
      }

      return true;
    });
  }

  function sortProducts(list) {
    const sorted = list.slice();
    if (currentSort === 'price-asc') {
      sorted.sort((a, b) => (a.startingPrice || 0) - (b.startingPrice || 0));
    } else if (currentSort === 'price-desc') {
      sorted.sort((a, b) => (b.startingPrice || 0) - (a.startingPrice || 0));
    } else if (currentSort === 'name-asc') {
      sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }
    return sorted;
  }

  function render() {
    const filtered = filterProducts();
    const sorted = sortProducts(filtered);

    // Update count badge
    if (resultsCountEl) {
      let variantCount = 0;
      sorted.forEach(p => { variantCount += (p.variants || []).length; });
      resultsCountEl.textContent = `Showing ${sorted.length} product families (${variantCount} verified model configurations)`;
    }

    if (currentView === 'cards') {
      renderCards(sorted);
    } else {
      renderTable(sorted);
    }
  }

  function renderCards(products) {
    if (!gridEl) return;
    if (products.length === 0) {
      gridEl.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: #86868b;">
          <h3 style="color:#ffffff; font-size:22px; margin-bottom:8px;">No matching products found</h3>
          <p>Try searching with another keyword like "M5", "Air", "256GB", or model number "MDH74HN/A".</p>
          <button type="button" class="pricing-cat-pill active" style="margin-top:16px; cursor:pointer;" id="resetFilterBtn">Reset Filters</button>
        </div>
      `;
      const resetBtn = document.getElementById('resetFilterBtn');
      if (resetBtn) {
        resetBtn.addEventListener('click', function () {
          currentCategory = 'all';
          searchQuery = '';
          if (searchInput) {
            searchInput.value = '';
            if (searchInput.parentElement) searchInput.parentElement.classList.remove('has-val');
          }
          updateCategoryPillState();
          render();
        });
      }
      return;
    }

    gridEl.innerHTML = products.map(prod => {
      const startingStr = prod.startingPrice
        ? `₹${Number(prod.startingPrice).toLocaleString('en-IN')}`
        : 'Quote on Request';

      const configSummary = getProductConfigSummary(prod);

      return `
        <article class="pricing-card" data-id="${escapeHtml(prod.id)}" style="cursor:pointer;">
          <div class="pricing-card-head">
            <span class="pricing-card-category">${escapeHtml(prod.category)}</span>
            <span class="pricing-card-chip">${escapeHtml(prod.chip || 'Apple')}</span>
          </div>

          <div class="pricing-card-img-wrap">
            <img src="${escapeHtml(prod.image)}" alt="${escapeHtml(prod.name)}" loading="lazy">
          </div>

          <div class="pricing-card-body">
            <h2 class="pricing-card-title">${escapeHtml(prod.name)}</h2>
            <div class="pricing-card-display">${escapeHtml(prod.display || '')}</div>
            <p class="pricing-card-tagline">${escapeHtml(prod.tagline || '')}</p>
            <div class="pricing-card-specs-pill">${escapeHtml(configSummary)}</div>

            <div class="pricing-card-footer">
              <div class="pricing-card-price-label">Starting from</div>
              <div class="pricing-card-price">${startingStr}</div>
              <div class="pricing-card-range">${escapeHtml(prod.priceRange || '')}</div>

              <div class="pricing-card-actions">
                <button type="button" class="pricing-btn-configure" data-action="configure" data-id="${escapeHtml(prod.id)}">
                  <span>Configure &amp; View Variants</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M9 18l6-6-6-6"/></svg>
                </button>
                <a href="${escapeHtml(prod.detailUrl || '#')}" class="pricing-btn-explore" onclick="event.stopPropagation();">
                  <span>Explore Model Overview &rarr;</span>
                </a>
              </div>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  function getProductConfigSummary(prod) {
    if (!prod.variants || prod.variants.length === 0) return 'Standard Configuration';
    const storages = [...new Set(prod.variants.map(v => v.storage).filter(Boolean))];
    const colors = [...new Set(prod.variants.map(v => v.color).filter(Boolean))];
    const parts = [];
    if (storages.length) parts.push(storages.join(' · '));
    if (colors.length) parts.push(`${colors.length} Colours`);
    parts.push(`${prod.variants.length} Models`);
    return parts.join(' | ');
  }

  function renderTable(products) {
    if (!tableBodyEl) return;
    const rows = [];

    products.forEach(prod => {
      (prod.variants || []).forEach(v => {
        // Apply search query to table rows
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const inRow = (v.modelNumber || '').toLowerCase().includes(q) ||
                        (v.specs || '').toLowerCase().includes(q) ||
                        (prod.name || '').toLowerCase().includes(q) ||
                        (v.color || '').toLowerCase().includes(q) ||
                        (v.storage || '').toLowerCase().includes(q);
          if (!inRow) return;
        }

        const priceStr = v.price ? `₹${Number(v.price).toLocaleString('en-IN')}` : 'Enquire';
        const isCorrected = v.corrected;

        rows.push(`
          <tr>
            <td class="table-model-num">${escapeHtml(v.modelNumber)}</td>
            <td><strong>${escapeHtml(prod.name)}</strong></td>
            <td class="table-specs-cell">
              ${escapeHtml(v.specs)}
              ${isCorrected ? '<br><span style="color:#ff9f0a; font-size:11px;">(Supplier Verified Tier)</span>' : ''}
            </td>
            <td>${escapeHtml(v.storage || '—')}</td>
            <td>${escapeHtml(v.color || '—')}</td>
            <td><span style="color:#30d158; font-size:11.5px;">● ${escapeHtml(v.availability || 'In Stock')}</span></td>
            <td class="table-price-cell">${priceStr}</td>
            <td>
              <button type="button" class="table-action-btn" data-action="table-configure" data-prod-id="${escapeHtml(prod.id)}" data-model="${escapeHtml(v.modelNumber)}">
                Configure &rarr;
              </button>
            </td>
          </tr>
        `);
      });
    });

    if (rows.length === 0) {
      tableBodyEl.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:40px; color:#86868b;">No matching configurations found in table.</td></tr>`;
      return;
    }

    tableBodyEl.innerHTML = rows.join('');
  }

  // ============================================================
  // Configuration Modal Controller
  // ============================================================
  function openConfigModal(product, initialVariant) {
    activeProduct = product;
    if (!product || !product.variants || product.variants.length === 0) {
      window.location.href = product.detailUrl || 'contact.html';
      return;
    }

    const first = initialVariant || product.variants[0];
    activeConfig = {
      storage: first.storage || '',
      color: first.color || '',
      connectivity: first.connectivity || '',
      glass: first.glass || ''
    };

    updateModalDOM(first);
    if (configModalOverlay) configModalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeConfigModal() {
    if (configModalOverlay) configModalOverlay.classList.remove('open');
    document.body.style.overflow = '';
    activeProduct = null;
  }

  function selectOption(type, value) {
    if (!activeProduct || !activeProduct.variants) return;
    const variants = activeProduct.variants;

    // Target configuration with the changed attribute
    const targetConfig = Object.assign({}, activeConfig, { [type]: value });

    // 1. Exact match across all attributes
    let match = variants.find(v => {
      const mStorage = !targetConfig.storage || v.storage === targetConfig.storage;
      const mColor = !targetConfig.color || v.color === targetConfig.color;
      const mConn = !targetConfig.connectivity || v.connectivity === targetConfig.connectivity;
      const mGlass = !targetConfig.glass || v.glass === targetConfig.glass;
      return mStorage && mColor && mConn && mGlass;
    });

    // 2. Storage + Color match
    if (!match) {
      match = variants.find(v => {
        const mStorage = !targetConfig.storage || v.storage === targetConfig.storage;
        const mColor = !targetConfig.color || v.color === targetConfig.color;
        return mStorage && mColor;
      });
    }

    // 3. Match the specific option chosen
    if (!match) {
      match = variants.find(v => v[type] === value);
    }

    if (!match) match = variants[0];

    // Synchronize activeConfig to matched variant
    activeConfig = {
      storage: match.storage || '',
      color: match.color || '',
      connectivity: match.connectivity || '',
      glass: match.glass || ''
    };

    updateModalDOM(match);
  }

  function updateModalDOM(matchedVariant) {
    if (!activeProduct) return;
    const matched = matchedVariant || (activeProduct.variants ? activeProduct.variants[0] : null);
    if (!matched) return;

    // Left Preview
    const imgEl = document.getElementById('modalImg');
    const badgeEl = document.getElementById('modalBadge');
    const titleEl = document.getElementById('modalTitle');
    const displayEl = document.getElementById('modalDisplay');

    if (imgEl) {
      imgEl.src = activeProduct.image;
      imgEl.alt = activeProduct.name;
    }
    if (badgeEl) badgeEl.textContent = activeProduct.chip || activeProduct.category;
    if (titleEl) titleEl.textContent = activeProduct.name;
    if (displayEl) displayEl.textContent = activeProduct.display || activeProduct.tagline;

    // Right Controls
    const controlsContainer = document.getElementById('modalDynamicControls');
    if (controlsContainer) {
      controlsContainer.innerHTML = buildModalControlsHTML();
      wireModalControlInteractions();
    }

    // Live Variant Details Card
    const modelCodeEl = document.getElementById('modalModelCode');
    const specsDescEl = document.getElementById('modalSpecsDesc');
    const priceValEl = document.getElementById('modalPriceVal');
    const verifiedStatusEl = document.getElementById('modalVerifiedStatus');

    if (modelCodeEl) modelCodeEl.textContent = matched.modelNumber;
    if (specsDescEl) specsDescEl.textContent = matched.specs;
    if (priceValEl) {
      priceValEl.textContent = matched.price
        ? `₹${Number(matched.price).toLocaleString('en-IN')}`
        : 'Enterprise Quote';
    }
    if (verifiedStatusEl) {
      if (matched.corrected) {
        verifiedStatusEl.innerHTML = `✓ Verified Distributor Price <span style="color:#ff9f0a; font-weight:400;">(Benchmark tier validated)</span>`;
      } else {
        verifiedStatusEl.innerHTML = `✓ Verified Official Distributor Price`;
      }
    }

    // Action buttons
    const enquireBtn = document.getElementById('modalEnquireBtn');
    if (enquireBtn) {
      enquireBtn.onclick = function () {
        openEnquiryModal(activeProduct, matched);
      };
    }

    const detailBtn = document.getElementById('modalDetailBtn');
    if (detailBtn) {
      detailBtn.href = activeProduct.detailUrl || 'product.html';
    }

    const copyBtn = document.getElementById('modalCopyBtn');
    if (copyBtn) {
      copyBtn.onclick = function () {
        const text = `${activeProduct.name} - Model: ${matched.modelNumber} | ${matched.specs} | ${matched.price ? '₹' + Number(matched.price).toLocaleString('en-IN') : 'Quote on Request'}`;
        if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(() => {
            showNotification('Model & specification copied to clipboard!');
          }).catch(() => {
            showNotification('Copied: ' + matched.modelNumber);
          });
        } else {
          showNotification('Model: ' + matched.modelNumber);
        }
      };
    }

    const cartBtn = document.getElementById('modalAddToCartBtn');
    if (cartBtn) {
      cartBtn.onclick = function () {
        if (typeof window.addToCart === 'function' && matched.price) {
          window.addToCart(activeProduct.id, {
            name: `${activeProduct.name} (${matched.storage} ${matched.color})`,
            price: matched.price,
            image: activeProduct.image,
            model: matched.modelNumber
          });
          showNotification(`Added ${matched.modelNumber} to cart!`);
          closeConfigModal();
        } else {
          openEnquiryModal(activeProduct, matched);
        }
      };
    }
  }

  function buildModalControlsHTML() {
    const variants = activeProduct.variants || [];
    let html = '';

    // 1. Storage Selector
    const storages = [...new Set(variants.map(v => v.storage).filter(Boolean))];
    if (storages.length > 0) {
      html += `
        <div class="config-group" style="margin-bottom:16px;">
          <div class="config-group-title">Select Capacity / Storage</div>
          <div class="config-pills" id="modalStoragePills">
            ${storages.map(s => `
              <button type="button" class="config-pill ${s === activeConfig.storage ? 'active' : ''}" data-type="storage" data-val="${escapeHtml(s)}">
                ${escapeHtml(s)}
              </button>
            `).join('')}
          </div>
        </div>
      `;
    }

    // 2. Colour Selector
    const colors = [...new Set(variants.map(v => v.color).filter(Boolean))];
    if (colors.length > 0) {
      html += `
        <div class="config-group" style="margin-bottom:16px;">
          <div class="config-group-title">Colour — <span style="color:#ffffff; font-weight:600;" id="activeColorLabel">${escapeHtml(activeConfig.color || colors[0])}</span></div>
          <div class="config-swatches" id="modalColorSwatches">
            ${colors.map(c => `
              <button type="button" class="config-swatch ${c === activeConfig.color ? 'active' : ''}" data-type="color" data-val="${escapeHtml(c)}" title="${escapeHtml(c)}" style="background:${getColorHex(c)};">
              </button>
            `).join('')}
          </div>
        </div>
      `;
    }

    // 3. Connectivity / Glass
    const conns = [...new Set(variants.map(v => v.connectivity).filter(Boolean))];
    if (conns.length > 1) {
      html += `
        <div class="config-group" style="margin-bottom:16px;">
          <div class="config-group-title">Connectivity</div>
          <div class="config-pills" id="modalConnPills">
            ${conns.map(cn => `
              <button type="button" class="config-pill ${cn === activeConfig.connectivity ? 'active' : ''}" data-type="connectivity" data-val="${escapeHtml(cn)}">
                ${escapeHtml(cn)}
              </button>
            `).join('')}
          </div>
        </div>
      `;
    }

    const glasses = [...new Set(variants.map(v => v.glass).filter(Boolean))];
    if (glasses.length > 1) {
      html += `
        <div class="config-group" style="margin-bottom:16px;">
          <div class="config-group-title">Glass Finish</div>
          <div class="config-pills" id="modalGlassPills">
            ${glasses.map(g => `
              <button type="button" class="config-pill ${g === activeConfig.glass ? 'active' : ''}" data-type="glass" data-val="${escapeHtml(g)}">
                ${escapeHtml(g)}
              </button>
            `).join('')}
          </div>
        </div>
      `;
    }

    return html;
  }

  function wireModalControlInteractions() {
    const pills = document.querySelectorAll('#modalDynamicControls .config-pill, #modalDynamicControls .config-swatch');
    pills.forEach(btn => {
      btn.addEventListener('click', function () {
        const type = this.getAttribute('data-type');
        const val = this.getAttribute('data-val');
        if (type && val) {
          selectOption(type, val);
        }
      });
    });
  }

  // ============================================================
  // Enquiry Modal Controller
  // ============================================================
  function openEnquiryModal(product, variant) {
    if (!enquiryModalOverlay) return;
    const v = variant || (product.variants ? product.variants[0] : null);
    const box = document.getElementById('enquiryPrefilledDetails');
    if (box && v) {
      const priceStr = v.price ? `₹${Number(v.price).toLocaleString('en-IN')}` : 'Request Quote';
      box.innerHTML = `
        <strong>${escapeHtml(product.name)}</strong><br>
        <span style="color:#2997ff;">Model: ${escapeHtml(v.modelNumber)}</span> &middot; ${priceStr}<br>
        <span style="font-size:11.5px; color:#86868b;">${escapeHtml(v.specs)}</span>
      `;
    }

    // Set hidden inputs
    const modelInput = document.getElementById('enquiryModelInput');
    const descInput = document.getElementById('enquiryDescInput');
    if (modelInput && v) modelInput.value = v.modelNumber;
    if (descInput && v) descInput.value = `${product.name} | ${v.specs}`;

    enquiryModalOverlay.classList.add('open');
  }

  function closeEnquiryModal() {
    if (enquiryModalOverlay) enquiryModalOverlay.classList.remove('open');
  }

  function handleEnquirySubmit(e) {
    e.preventDefault();
    const form = e.target;
    const name = form.querySelector('[name="name"]').value.trim();
    const phone = form.querySelector('[name="phone"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();
    const company = form.querySelector('[name="company"]') ? form.querySelector('[name="company"]').value.trim() : '';
    const model = document.getElementById('enquiryModelInput').value;
    const desc = document.getElementById('enquiryDescInput').value;

    const message = `Hello Iswift Business Partner,\n\nI would like to enquire about:\nProduct: ${desc}\nModel No: ${model}\nName: ${name}\nPhone: ${phone}\nEmail: ${email}${company ? '\nCompany: ' + company : ''}`;

    // Open WhatsApp directly
    const waUrl = `https://wa.me/917975627008?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');

    showNotification('Enquiry generated! Connecting to WhatsApp support...');
    closeEnquiryModal();
    form.reset();
  }

  function findVariantByModel(modelNum) {
    const catalogue = getCatalogue();
    const q = (modelNum || '').trim().toUpperCase();
    for (const prod of catalogue) {
      for (const v of prod.variants || []) {
        if ((v.modelNumber || '').toUpperCase() === q) {
          return { product: prod, variant: v };
        }
      }
    }
    return null;
  }

  function getColorHex(colorName) {
    const map = {
      'Space Black': '#232528',
      'Space Grey': '#53565a',
      'Silver': '#e3e4e6',
      'Midnight': '#1c2430',
      'Starlight': '#f0ece1',
      'Sky Blue': '#b9d2e8',
      'Mist Blue': '#9ebcd1',
      'Lavender': '#d3c6e2',
      'Sage': '#bcc5b7',
      'Citrus': '#e8cf65',
      'Indigo': '#3a4b68',
      'Blush': '#deb0a8',
      'Soft Pink': '#f3d6db',
      'Pink': '#e89baa',
      'Purple': '#b499c8',
      'Purple Fog': '#9d99af',
      'Blue': '#4a7db8',
      'Cloud White': '#f5f5f7',
      'Light Gold': '#f3e6ca',
      'Burgundy': '#5a2233',
      'Glacier': '#d7e4ea',
      'Black': '#1d1d1f',
      'White': '#ffffff',
      'Natural Titanium': '#9e978e',
      'Light Blush': '#eecfcb',
      'Stone Grey': '#7f7f84',
      'Anchor Blue': '#2b4d70'
    };
    return map[colorName] || '#555555';
  }

  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function showNotification(msg) {
    if (typeof window.showToast === 'function') {
      window.showToast(msg);
      return;
    }
    const toast = document.createElement('div');
    toast.style.position = 'fixed';
    toast.style.bottom = '24px';
    toast.style.right = '24px';
    toast.style.background = 'rgba(20, 20, 24, 0.94)';
    toast.style.color = '#ffffff';
    toast.style.border = '1px solid rgba(255, 255, 255, 0.16)';
    toast.style.padding = '12px 20px';
    toast.style.borderRadius = '999px';
    toast.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
    toast.style.zIndex = '99999';
    toast.style.fontSize = '13.5px';
    toast.style.fontWeight = '500';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.transition = 'opacity 0.3s ease';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

  // Expose global methods
  window.openConfigModal = openConfigModal;
  window.closeConfigModal = closeConfigModal;
  window.openEnquiryModal = openEnquiryModal;
  window.closeEnquiryModal = closeEnquiryModal;
  window.initPricingPage = initPricingPage;

  // Initialize immediately or on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPricingPage);
  } else {
    initPricingPage();
  }
  window.addEventListener('load', function () {
    const g = document.getElementById('pricingGrid');
    if (g && (!g.children || g.children.length === 0)) {
      initPricingPage();
    }
  });

})();
