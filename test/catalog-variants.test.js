const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { PRODUCTS, getNavigationProducts } = require('../client/js/data');
const { PRICING_CATALOGUE } = require('../client/js/pricing-data');
const store = require('../server/src/lib/productsStore');
const { getUnitPrice, priceCart } = require('../server/src/lib/catalog');

test('supplier SKUs are unique and configurations retain their exact prices', () => {
 const imported = PRICING_CATALOGUE.flatMap(p => p.variants).filter(v => v.source === 'Supplier product list');
 assert.equal(imported.length, 26);
 assert.equal(new Set(imported.map(v => v.modelNumber)).size, 26);
 for (const v of imported) {
  const matches = PRODUCTS.flatMap(p => p.variants || []).filter(row => row.modelNumber === v.modelNumber);
  assert.equal(matches.length, 1);
  assert.equal(matches[0].price, v.price);
  assert.ok(matches[0].ram);
  assert.ok(matches[0].chip);
  assert.ok(matches[0].storage);
 }
 for (const category of ['mac', 'iphone', 'ipad', 'watch', 'airpods', 'accessories', 'vision', 'tvhome']) {
  const nav = getNavigationProducts(category);
  assert.equal(new Set(nav.map(p => p.id)).size, nav.length);
 }
 for (const p of PRODUCTS.filter(p => ['macbook-pro-14-m6', 'mac-studio-m5', 'mac-mini-m6'].includes(p.id))) {
  assert.ok(fs.existsSync('client/' + p.images[0]));
 }
});

test('server resolves the selected SKU and rejects mismatched variants', async t => {
 t.mock.method(store, 'getById', async id => PRODUCTS.find(p => p.id === id));
 const product = PRODUCTS.find(p => p.id === 'macbook-pro-14-m6');
 const variant = product.variants.find(v => v.ram === '32GB' && v.color === 'Silver');
 assert.equal(await getUnitPrice(product.id, variant.configuration, variant.modelNumber, variant.color), 287900);
 assert.equal(await getUnitPrice(product.id, variant.configuration, 'FORGED-SKU', variant.color), null);
 assert.equal(await getUnitPrice(product.id, variant.configuration, variant.modelNumber, 'Blue'), null);
 const settings = require('../server/src/lib/settingsStore');
 t.mock.method(settings, 'get', async () => ({ shippingThreshold: 50000, shippingFee: 199 }));
 const priced = await priceCart([{ id: product.id, storage: variant.configuration, color: variant.color, modelNumber: variant.modelNumber, qty: 2, price: 1 }]);
 assert.equal(priced.total, 575800);
 assert.equal(priced.lines[0].modelNumber, variant.modelNumber);
});

test('bag keeps different hardware configurations on separate lines', () => {
 const saved = new Map();
 const context = vm.createContext({ localStorage: { getItem: k => saved.get(k), setItem: (k,v) => saved.set(k,v) }, document: { addEventListener() {}, querySelectorAll: () => [] } });
 vm.runInContext(fs.readFileSync('client/js/cart.js', 'utf8'), context);
 const p = PRODUCTS.find(p => p.id === 'macbook-pro-14-m6');
 for (const v of [p.variants[0], p.variants[2]]) context.addToCart(p, { color: v.color, storage: v.configuration, modelNumber: v.modelNumber, unitPrice: v.price });
 assert.equal(context.getCart().length, 2);
 assert.notEqual(context.getCart()[0].modelNumber, context.getCart()[1].modelNumber);
});
