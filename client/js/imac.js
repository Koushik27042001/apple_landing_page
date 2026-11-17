(() => {
  renderHeader('mac');
  renderFooter();

  // Keep the product navigation below the shared header at every breakpoint.
  const header = document.getElementById('site-header');
  const syncHeaderHeight = () => {
    document.documentElement.style.setProperty('--imac-header-height', header.getBoundingClientRect().height + 'px');
  };
  syncHeaderHeight();
  if ('ResizeObserver' in window) {
    new ResizeObserver(syncHeaderHeight).observe(header);
  } else {
    window.addEventListener('resize', syncHeaderHeight);
  }

  const views = {
    blue: { src: 'images/imac/colors_pf_blue__dcjh5k0mdhea_large_2x.jpg', alt: 'Blue iMac, front view with Magic Keyboard and Magic Mouse', caption: 'iMac in Blue' },
    purple: { src: 'images/imac/highlights_design__e0tsklsnzwk2_large_2x.jpg', alt: 'Purple iMac viewed from the side, showing its thin design', caption: 'iMac in Purple' }
  };
  document.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => {
    const view = views[button.dataset.view];
    const image = document.getElementById('gallery-image');
    image.src = view.src;
    image.alt = view.alt;
    document.getElementById('gallery-caption').textContent = view.caption;
    document.querySelectorAll('[data-view]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  }));
  const descriptions = {
    apps: 'Mac is optimised to handle AI apps — including Claude, LM Studio, Gemini and tools from Topaz Labs — so you can learn faster, think in new ways and get more done.',
    features: 'Bring AI into the apps you already use. Explore creative tools in Pixelmator Pro and Affinity, refine a message in Mail and turn everyday tasks into simpler workflows.'
  };
  document.querySelectorAll('[data-ai]').forEach(button => button.addEventListener('click', () => {
    document.getElementById('ai-description').textContent = descriptions[button.dataset.ai];
    document.querySelectorAll('[data-ai]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  }));
})();
