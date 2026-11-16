/* Local product photography, shared by the hero, detail section, and image viewer. */
const ProductGallery = (() => {
  const escape = value => String(value || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

  function images(product, hero) {
    const first = { src: hero, alt: product.name + (product.colors.length ? ' in the selected finish' : ''), caption: 'Selected configuration' };
    const additional = Array.isArray(product.gallery) ? product.gallery : product.images.map((src, i) => ({ src, alt: product.name + ' view ' + (i + 1), caption: 'Product view ' + (i + 1) }));
    const seen = new Set();
    return [first].concat(additional).filter(image => {
      if (!image.src || seen.has(image.src)) return false;
      seen.add(image.src); return true;
    });
  }

  function hero(product, source) {
    const views = images(product, source);
    return '<div class="pdp-gallery-hero product-gallery" id="productGallery" tabindex="0" role="region" aria-label="Product image gallery">' +
      '<div class="pdp-gallery-main pdp-top-aligned" id="pdpGalleryMain"><div class="pdp-3d-stage" id="pdp3dStage">' +
      '<img id="mainImage" src="' + escape(source) + '" alt="' + escape(views[0].alt) + '" decoding="async" fetchpriority="high"></div>' +
      '<button type="button" class="gallery-zoom" aria-label="Enlarge product image">&#x2922;</button></div>' +
      (views.length > 1 ? '<div class="gallery-controls"><button type="button" class="gallery-prev" aria-label="Previous product image">&#8592;</button>' +
        '<p class="gallery-caption" aria-live="polite"><span class="gallery-counter">1 / ' + views.length + '</span><span class="gallery-label">' + escape(views[0].caption) + '</span></p>' +
        '<button type="button" class="gallery-next" aria-label="Next product image">&#8594;</button></div>' +
        '<div class="pdp-thumbs" aria-label="Choose a product image">' + views.map((view, i) =>
          '<button type="button" class="pdp-thumb' + (i === 0 ? ' active' : '') + '" data-gallery-index="' + i + '" aria-label="Show ' + escape(view.caption) + '" aria-pressed="' + (i === 0) + '">' +
          '<img src="' + escape(view.src) + '" alt="" loading="lazy" decoding="async"></button>').join('') + '</div>' : '') + '</div>';
  }

  function section(product) {
    if (!Array.isArray(product.gallery) || !product.gallery.length) return '';
    return '<section class="product-photo-section" aria-labelledby="productPhotoTitle"><div class="product-photo-heading"><div><p class="photo-eyebrow">DESIGN &amp; DETAILS</p>' +
      '<h2 id="productPhotoTitle">A closer look.</h2><p>Explore ' + escape(product.name) + ' from every angle.</p></div><span class="photo-count">' + product.gallery.length + ' views</span></div>' +
      '<div class="product-photo-grid">' + product.gallery.map((view, i) => '<figure class="product-photo"><button type="button" data-detail-image="' + i + '" aria-label="Enlarge ' + escape(view.caption) + '">' +
        '<img src="' + escape(view.src) + '" alt="' + escape(view.alt) + '" loading="lazy" decoding="async" width="2400" height="1538"><span class="photo-expand" aria-hidden="true">&#x2922;</span></button>' +
        '<figcaption><span class="photo-number">' + String(i + 1).padStart(2, '0') + '</span>' + escape(view.caption) + '</figcaption></figure>').join('') + '</div>' +
      '<p class="photo-accessories-note">Displays and accessories in workspace photos are sold separately.</p></section>';
  }

  function viewer() {
    return '<dialog class="product-image-viewer" id="productImageViewer" aria-labelledby="imageViewerCaption"><div class="viewer-toolbar"><p id="imageViewerCaption"></p>' +
      '<button type="button" class="viewer-close" aria-label="Close enlarged image" autofocus>&#10005;</button></div><div class="viewer-stage">' +
      '<button type="button" class="viewer-prev" aria-label="Previous enlarged image">&#8592;</button><img alt="" class="viewer-image">' +
      '<button type="button" class="viewer-next" aria-label="Next enlarged image">&#8594;</button></div><p class="viewer-count" aria-live="polite"></p></dialog>';
  }

  function mount(product, source) {
    const root = document.getElementById('productGallery');
    const dialog = document.getElementById('productImageViewer');
    if (!root || !dialog) return;
    const views = images(product, source);
    const main = root.querySelector('#mainImage');
    let index = 0;
    let viewerIndex = 0;
    let previousOverflow = '';
    const wrap = value => (value + views.length) % views.length;
    const setView = value => {
      index = wrap(value);
      main.src = views[index].src; main.alt = views[index].alt;
      const counter = root.querySelector('.gallery-counter');
      const label = root.querySelector('.gallery-label');
      if (counter) counter.textContent = (index + 1) + ' / ' + views.length;
      if (label) label.textContent = views[index].caption;
      root.querySelectorAll('[data-gallery-index]').forEach(button => {
        const active = Number(button.dataset.galleryIndex) === index;
        button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active));
      });
    };
    const setViewer = value => {
      viewerIndex = wrap(value);
      dialog.querySelector('.viewer-image').src = views[viewerIndex].src;
      dialog.querySelector('.viewer-image').alt = views[viewerIndex].alt;
      dialog.querySelector('#imageViewerCaption').textContent = views[viewerIndex].caption;
      dialog.querySelector('.viewer-count').textContent = (viewerIndex + 1) + ' / ' + views.length;
    };
    const openViewer = value => {
      setViewer(value);
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      dialog.showModal();
    };
    root.querySelector('.gallery-prev')?.addEventListener('click', () => setView(index - 1));
    root.querySelector('.gallery-next')?.addEventListener('click', () => setView(index + 1));
    root.querySelectorAll('[data-gallery-index]').forEach(button => button.addEventListener('click', () => setView(Number(button.dataset.galleryIndex))));
    root.querySelector('.gallery-zoom').addEventListener('click', () => openViewer(index));
    root.addEventListener('keydown', event => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); setView(index + (event.key === 'ArrowRight' ? 1 : -1)); }
    });
    document.querySelectorAll('[data-detail-image]').forEach(button => button.addEventListener('click', () => {
      const view = product.gallery[Number(button.dataset.detailImage)];
      openViewer(views.findIndex(image => image.src === view.src));
    }));
    dialog.querySelector('.viewer-close').addEventListener('click', () => dialog.close());
    dialog.querySelector('.viewer-prev').addEventListener('click', () => setViewer(viewerIndex - 1));
    dialog.querySelector('.viewer-next').addEventListener('click', () => setViewer(viewerIndex + 1));
    dialog.addEventListener('keydown', event => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); setViewer(viewerIndex + (event.key === 'ArrowRight' ? 1 : -1)); }
    });
    dialog.addEventListener('close', () => { document.body.style.overflow = previousOverflow; });
    dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  }
  return { hero, section, viewer, mount };
})();
