(() => {
  const model = PRICING_CATALOGUE.find(item => item.id === 'macbook-neo-13');
  if (!model || !model.variants.length) return;
  const storage = document.getElementById('neoVariantStorage');
  const color = document.getElementById('neoVariantColor');
  const variants = model.variants.map(v => ({ ...v, storage: v.storage || ((v.specs.match(/(256|512)\s*GB/i) || [])[1] || '') + 'GB' }));
  const sizes = [...new Set(variants.map(v => v.storage))];
  const fill = (select, values, previous) => {
    select.replaceChildren(...values.map(value => new Option(value, value)));
    select.value = values.includes(previous) ? previous : values[0];
  };
  fill(storage, sizes);
  let selected;
  function update() {
    const candidates = variants.filter(v => v.storage === storage.value);
    fill(color, [...new Set(candidates.map(v => v.color))], color.value);
    selected = candidates.find(v => v.color === color.value);
    document.getElementById('neoVariantPrice').textContent = formatINR(selected.price);
    document.getElementById('neoVariantSummary').textContent = selected.specs + ' · Model: ' + selected.modelNumber;
    const image = document.getElementById('neoVariantImage');
    image.src = 'images/macbook_neo/colors/macbook-neo-' + selected.color.toLowerCase() + '.png';
    image.alt = 'MacBook Neo in ' + selected.color;
    document.getElementById('neoVariantStatus').textContent = '';
  }
  storage.addEventListener('change', update);
  color.addEventListener('change', update);
  bindPurchaseButtons(document.getElementById('neoVariantAdd'), () => {
    const product = getProductById('macbook-neo');
    const variant = product?.variants?.find(v => v.modelNumber === selected?.modelNumber);
    if (!variant) return null;
    return { product, options: { color: variant.color, storage: variant.configuration, unitPrice: variant.price, modelNumber: variant.modelNumber, image: document.getElementById('neoVariantImage').getAttribute('src') } };
  }, () => {
    document.getElementById('neoVariantStatus').textContent = 'Added ' + selected.storage + ' in ' + selected.color + ' to your bag.';
  });
  update();
})();
