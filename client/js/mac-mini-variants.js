(() => {
  const families = { m6: 'mac-mini-m6', m4: 'mac-mini-m4' };
  const picker = document.getElementById('miniVariant');
  if (!picker) return;
  const buttons = [...document.querySelectorAll('[data-mini-family]')];
  let family = new URLSearchParams(location.search).get('family') === 'm4' ? 'm4' : 'm6';
  let model, selected;
  const memoryStorage = v => {
    const memory = (v.specs.match(/(\d+)\s*GB(?:\s*[,|/])/i) || [])[1];
    const storage = v.storage || ((v.specs.match(/(256|512)\s*GB/i) || [])[1] || '') + 'GB';
    return [memory && memory + 'GB memory',storage].filter(Boolean).join(' / ');
  };
  function updateVariant() {
    selected = model.variants.find(v => v.modelNumber === picker.value);
    document.getElementById('miniVariantSpecs').textContent = selected.specs;
    document.getElementById('miniVariantModel').textContent = 'Model: ' + selected.modelNumber;
    document.getElementById('miniVariantAvailability').textContent = selected.availability || 'Check availability';
    document.getElementById('miniVariantPrice').textContent = formatINR(selected.price);
    document.getElementById('miniVariantStatus').textContent = '';
  }
  function selectFamily(value, syncUrl = true) {
    family = value;
    model = PRICING_CATALOGUE.find(p => p.id === families[family]);
    if (!model?.variants.length) return;
    buttons.forEach(b => b.setAttribute('aria-pressed',String(b.dataset.miniFamily === family)));
    document.getElementById('miniFamilyTitle').textContent = model.name;
    document.getElementById('miniFamilyDescription').textContent = family === 'm4' ? 'M4 and M4 Pro configurations. Mini in size. Mighty in power.' : 'M6 and M5 Pro configurations. Find your next little do-it-all.';
    picker.replaceChildren(...model.variants.map(v => new Option((/M5\s*PRO/i.test(v.specs)?'M5 Pro':/M4\s*Pro/i.test(v.specs)?'M4 Pro':family==='m4'?'M4':'M6') + ' · ' + memoryStorage(v) + ' · ' + formatINR(v.price),v.modelNumber)));
    if (syncUrl) { const url = new URL(location.href);if(family==='m4')url.searchParams.set('family','m4');else url.searchParams.delete('family');history.replaceState(null,'',url.pathname+url.search+url.hash); }
    updateVariant();
  }
  buttons.forEach(b => b.addEventListener('click',()=>selectFamily(b.dataset.miniFamily)));
  picker.addEventListener('change',updateVariant);
  bindPurchaseButtons(document.getElementById('miniVariantAdd'), () => {
    const product = getProductById(families[family]);
    const variant = product?.variants?.find(v => v.modelNumber === selected.modelNumber);
    if (!variant) return null;
    return { product, options: { unitPrice: variant.price, modelNumber: variant.modelNumber, storage: variant.configuration, color: variant.color } };
  }, () => {
    document.getElementById('miniVariantStatus').textContent = 'Added '+model.name+' ('+selected.modelNumber+') to your bag.';
  });
  selectFamily(family,false);
})();
