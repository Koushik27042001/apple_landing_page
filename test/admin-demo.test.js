const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createDemoStore } = require('../client/admin/js/demo-store');
const catalog = require('../client/js/data');

function memoryStorage() {
  const values = new Map([['iswift_admin_token', 'real-token-do-not-touch']]);
  return { getItem: key => values.get(key) || null, setItem: (key, value) => values.set(key, value) };
}
const write = (method, body) => ({ method, body: JSON.stringify(body) });

test('demo features persist only in their separate browser store and can reset', async () => {
  const storage = memoryStorage();
  const demo = createDemoStore(storage, catalog);
  const initial = await demo.request('/admin/stats');
  assert.equal(initial.products, catalog.PRODUCTS.length);
  assert.equal(initial.orders, 3);
  for (const resource of ['products', 'banners', 'coupons']) {
    const record = { id: 'demo-new', name: 'Sample product', title: 'Sample banner', code: 'TEST', price: 100, active: true };
    await demo.request('/admin/' + resource, write('POST', record));
    await demo.request('/admin/' + resource + '/demo-new', write('PUT', { active: false }));
    const reloaded = createDemoStore(storage, catalog);
    assert.equal((await reloaded.request('/admin/' + resource))[resource].find(r => r.id === 'demo-new').active, false);
    await demo.request('/admin/' + resource + '/demo-new', { method: 'DELETE' });
    assert.ok(!(await demo.request('/admin/' + resource))[resource].some(r => r.id === 'demo-new'));
  }
  await demo.request('/admin/orders/DEMO-1000', write('PATCH', { status: 'delivered' }));
  assert.equal((await demo.request('/admin/orders')).orders[0].status, 'delivered');
  await demo.request('/admin/settings', write('PUT', { storeName: 'My sample store' }));
  assert.equal((await createDemoStore(storage, catalog).request('/admin/settings')).settings.storeName, 'My sample store');
  assert.equal(storage.getItem('iswift_admin_token'), 'real-token-do-not-touch');
  assert.equal(catalog.PRODUCTS.length, initial.products);
  demo.reset();
  assert.equal((await demo.request('/admin/settings')).settings.storeName, 'Iswift Gadgets Demo');
  assert.equal((await demo.request('/admin/orders')).orders[0].status, 'paid');
});

test('demo errors never fall through to a backend and failed saves keep previous data', async () => {
  const storage = memoryStorage();
  const demo = createDemoStore(storage, catalog);
  await assert.rejects(demo.request('/admin/login'), /Unsupported/);
  await assert.rejects(demo.request('/orders'), /Unsupported/);
  await assert.rejects(demo.request('/admin/products/missing', write('PUT', {})), /not found/);
  await assert.rejects(demo.request('/admin/upload', write('POST', { image: 'data:image/svg+xml;base64,AAAA' })), /PNG/);
  assert.equal((await demo.request('/admin/upload', write('POST', { image: 'data:image/png;base64,AAAA' }))).url, 'data:image/png;base64,AAAA');
  storage.setItem = () => { throw new Error('Quota exceeded'); };
  await assert.rejects(demo.request('/admin/settings', write('PUT', { storeName: 'Lost' })), /storage/);
  assert.equal((await demo.request('/admin/settings')).settings.storeName, 'Iswift Gadgets Demo');
});
