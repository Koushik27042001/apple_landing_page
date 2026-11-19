(() => {
  const product = getProductById('ipad-air-11-m4');
  if (!product || !product.variants?.length) return;
  let selected = product.variants[0];
  const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
  const storageButtons = [...document.querySelectorAll('.storage-card')];
  const colorButtons = [...document.querySelectorAll('.swatch-btn')];
  const connectionButtons = [...document.querySelectorAll('.conn-card')];
  function update() {
    storageButtons.forEach(b => { const active = b.dataset.storage === selected.storage; b.classList.toggle('active',active); b.setAttribute('aria-pressed',String(active)); const v=product.variants.find(v=>v.storage===b.dataset.storage&&v.color===selected.color&&v.connectivity===selected.connectivity); b.disabled=!v; b.querySelector('.storage-extra').textContent=v?formatINR(v.price):'Unavailable'; });
    colorButtons.forEach(b => { const active=b.dataset.color===selected.color; b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active)); });
    connectionButtons.forEach(b => { const active=(b.dataset.conn==='cellular'?'Wi-Fi + Cellular':'Wi-Fi')===selected.connectivity;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active)); });
    document.getElementById('previewTitle').textContent='iPad Air 11-inch M4 · '+selected.connectivity+' · '+selected.storage;
    document.getElementById('previewColorText').textContent=selected.color+' finish · '+selected.modelNumber;
    document.getElementById('colorLabel').textContent=selected.color;
    document.getElementById('totalPriceDisplay').textContent=formatINR(selected.price);
    document.getElementById('emiDisplay').textContent='Estimated EMI '+formatINR(Math.round(selected.price/12))+'/mo. for 12 months. Final lender terms apply.';
    const price=Math.min(...product.variants.map(v=>v.price));
    document.getElementById('airStartingPrice').innerHTML='From '+esc(formatINR(price))+'*<br>11-inch iPad Air with M4';
  }
  function choose(field,value) { const next=product.variants.find(v=>v[field]===value&&['storage','color','connectivity'].every(f=>f===field||v[f]===selected[f]));if(next){selected=next;update();} }
  storageButtons.forEach(b=>b.addEventListener('click',()=>choose('storage',b.dataset.storage)));
  colorButtons.forEach(b=>b.addEventListener('click',()=>choose('color',b.dataset.color)));
  connectionButtons.forEach(b=>b.addEventListener('click',()=>choose('connectivity',b.dataset.conn==='cellular'?'Wi-Fi + Cellular':'Wi-Fi')));
  bindPurchaseButtons(document.getElementById('addToBagBtn'), () => ({
    product,
    options: { unitPrice: selected.price, storage: selected.configuration, color: selected.color, modelNumber: selected.modelNumber }
  }), () => showToast('Added iPad Air ' + selected.storage + ' in ' + selected.color + ' to your bag.'));
  update();
})();
