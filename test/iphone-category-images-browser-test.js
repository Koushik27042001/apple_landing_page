const { chromium } = require('playwright');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { PRODUCTS, CATEGORIES } = require('../client/js/data');
(async () => {
 const root = path.resolve('client');
 const server = http.createServer((req,res) => {
  let pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  if (pathname === '/category') pathname = '/category.html';
  const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
  if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); res.end(); return; }
  const mime = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml' }[path.extname(file)] || 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': mime }); fs.createReadStream(file).pipe(res);
 });
 await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
 let browser;
 try {
  browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  page.setDefaultTimeout(30000);
  await page.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
  await page.addInitScript(() => { window.APPLE_STORE_API_BASE = '/api'; });
  const errors=[]; page.on('pageerror',e=>errors.push(e.message));
  const backend=JSON.parse(JSON.stringify(PRODUCTS));
  for(const p of backend.filter(p=>p.category==='iphone')) {
   p.images=['images/old-backend-missing.png'];
   p.colors.forEach(c=>{c.image='images/old-backend-color.png';});
  }
  await page.addInitScript(()=>document.addEventListener('catalog:updated',()=>{window.imageCatalogSynced=true;}));
  await page.route('**/api/products?**',route=>route.fulfill({json:{products:backend,categories:CATEGORIES}}));
  const base='http://127.0.0.1:'+server.address().port;
  await page.goto(base+'/category?cat=iphone',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.imageCatalogSynced);
  await page.locator('.product-card .pc-image img').evaluateAll(imgs=>Promise.all(imgs.map(img=>img.decode())));
  const images=await page.locator('.product-card[data-product-id^="iphone-"] .pc-image img').evaluateAll(imgs=>imgs.map(img=>({id:img.closest('[data-product-id]').dataset.productId,src:img.getAttribute('src'),width:img.naturalWidth,height:img.naturalHeight,rendered:img.getBoundingClientRect().height})));
  assert.ok(images.length>=9);
  for(const image of images) {assert.ok(image.width>0&&image.height>0&&image.rendered>0,image.id+' image failed');assert.ok(!image.src.includes('old-backend'));}
  for(const id of ['iphone-18-pro','iphone-18-pro-max']) {
   assert.equal(images.find(img=>img.id===id).src,'images/iphone 18pro/hero__elo7tt0mnqy6_large.jpg');
  }
  await page.setViewportSize({width:390,height:844});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  assert.deepEqual(errors,[]);
  console.log('All '+images.length+' iPhone card images decode, user-provided photo appears on both iPhone 18 Pro cards, stale backend images are replaced, and mobile layout fits.');
 } finally { if (browser) await browser.close(); server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); }
})().catch(e => { console.error(e); process.exitCode = 1; });
