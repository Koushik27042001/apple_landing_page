const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

test('older live catalogs retain downloaded galleries and finish images', async () => {
 const events = [];
 let response;
 const context = vm.createContext({
  console, window: {}, setInterval() {},
  CustomEvent: class { constructor(type, options) { this.type = type; this.detail = options.detail; } },
  document: { dispatchEvent(event) { events.push(event); } },
  fetch: async url => ({ ok: true, json: async () => url.includes('/products?') ? response : null })
 });
 vm.runInContext(fs.readFileSync('client/js/pricing-data.js', 'utf8'), context);
 vm.runInContext(fs.readFileSync('client/js/data.js', 'utf8'), context);
 const original = vm.runInContext('getProductById("macbook-pro-14-m6")', context);
 response = { products: [{ id: original.id, name: original.name, price: 99999, stock: 3, images: ['old-thumbnail.png'], colors: [{ name: 'Silver', hex: '#eee', image: 'old-silver.png' }] }] };
 vm.runInContext(fs.readFileSync('client/js/catalog-sync.js', 'utf8'), context);
 await new Promise(setImmediate);
 const updated = vm.runInContext('getProductById("macbook-pro-14-m6")', context);
 assert.equal(updated.price, 99999);
 assert.equal(updated.stock, 3);
 assert.equal(updated.gallery.length, 3);
 assert.match(updated.images[0], /images\/products\/catalogue\//);
 assert.match(updated.colors[0].image, /silver\.png$/);
 assert.ok(updated.variants.length);
 assert.ok(vm.runInContext('getProductById("mac-studio-m5").gallery.length', context));
 assert.equal(events[0].type, 'catalog:updated');
});
