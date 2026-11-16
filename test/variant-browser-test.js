const { chromium } = require('playwright');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { PRODUCTS, CATEGORIES } = require('../client/js/data');
(async () => {
 const root = path.resolve('client');
 const server = http.createServer((req,res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
  if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); res.end(); return; }
  const mime = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml' }[path.extname(file)] || 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': mime }); fs.createReadStream(file).pipe(res);
 });
 await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
 let browser;
 try {
  browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  page.setDefaultTimeout(30000);
  await page.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  const base = 'http://127.0.0.1:' + server.address().port;
  await page.goto(base + '/product.html?id=macbook-pro-14-m6&configure=1', { waitUntil: 'domcontentloaded' });
  await page.locator('#variant-ram').waitFor();
  for (const category of CATEGORIES) {
   const expected = PRODUCTS.filter(p => p.category === category.id).map(p => p.id).sort();
   const actual = await page.locator('.cascade-prod-group[data-cat-group="' + category.id + '"] .cascade-prod-item').evaluateAll(nodes => nodes.map(n => new URL(n.href).searchParams.get('id')).sort());
   assert.deepEqual(actual, expected);
   const mobile = await page.locator('.mobile-subcat-group[data-subcat="' + category.id + '"] .mobile-leaf-link:not(.mobile-leaf-explore)').evaluateAll(nodes => nodes.map(n => new URL(n.href).searchParams.get('id')).sort());
   assert.deepEqual(mobile, expected);
  }
  await page.selectOption('#variant-ram', '32GB');
  await page.selectOption('#variant-color', 'Silver');
  assert.match(await page.locator('.pdp-price').first().textContent(), /2,87,900/);
  assert.match(await page.locator('.pdp-variant-summary').textContent(), /MHWY4HN\/A/);
  await page.click('#addToCartBtn');
  const cart = await page.evaluate(() => getCart());
  assert.equal(cart[0].modelNumber, 'MHWY4HN/A'); assert.equal(cart[0].price, 287900);
  const style = await page.locator('#pdpGalleryMain').evaluate(el => ({ background: getComputedStyle(el).backgroundColor, border: getComputedStyle(el).borderTopWidth }));
  assert.equal(style.border, '0px'); assert.equal(style.background, 'rgba(0, 0, 0, 0)');
  for (const p of PRODUCTS.filter(p => p.variants)) {
   console.log('Checking ' + p.id);
   await page.goto(base + '/product.html?id=' + p.id + '&configure=1', { waitUntil: 'domcontentloaded' });
   await page.locator('.variant-select').first().waitFor();
   const ids = await page.locator('.variant-select').evaluateAll(nodes => nodes.map(n => n.id));
   for (const id of ids) {
    const values = await page.locator('#' + id + ' option').evaluateAll(nodes => nodes.map(n => n.value));
    if (values.length > 1) await page.selectOption('#' + id, values[values.length - 1]);
   }
   assert.match(await page.locator('.pdp-variant-summary').textContent(), /Model:/);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base + '/product.html?id=mac-studio-m5&configure=1', { waitUntil: 'domcontentloaded' });
  await page.selectOption('#variant-chip', 'M5 Ultra');
  assert.match(await page.locator('.pdp-variant-summary').textContent(), /96G/);
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  assert.deepEqual(errors, []);
  console.log('Browser verified desktop/mobile model menus, all 24 model configurators, exact SKU pricing, bag details, standalone gallery, and mobile layout.');
 } finally { if (browser) await browser.close(); server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); }
})().catch(e => { console.error(e); process.exitCode = 1; });
