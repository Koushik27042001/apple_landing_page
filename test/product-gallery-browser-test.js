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
  const base='http://127.0.0.1:'+server.address().port;
  for(const id of ['macbook-pro-14-m6','macbook-pro-14-m5','macbook-pro-16-m5','mac-studio-m5','mac-mini-m6']) {
   const product=PRODUCTS.find(p=>p.id===id);
   await page.goto(base+'/product.html?id='+id,{waitUntil:'domcontentloaded'});
   assert.equal(await page.locator('[data-detail-image]').count(),product.gallery.length);
   await page.locator('#mainImage').evaluate(img=>img.decode());
   assert.equal(await page.locator('#mainImage').evaluate(img=>img.naturalWidth),2400);
   await page.click('.gallery-next');
   assert.match(await page.locator('.gallery-counter').textContent(),/^2 /);
   assert.equal(await page.locator('[data-gallery-index="1"]').getAttribute('aria-pressed'),'true');
   await page.locator('#productGallery').focus(); await page.keyboard.press('ArrowLeft');
   assert.match(await page.locator('.gallery-counter').textContent(),/^1 /);
   await page.click('.gallery-zoom'); assert.ok(await page.locator('dialog').evaluate(d=>d.open));
   await page.keyboard.press('ArrowRight'); assert.match(await page.locator('.viewer-count').textContent(),/^2 /);
   await page.keyboard.press('Escape'); assert.equal(await page.locator('dialog').evaluate(d=>d.open),false);
   await page.locator('[data-detail-image="1"]').click();
   assert.equal(await page.locator('#imageViewerCaption').textContent(),product.gallery[1].caption);
   await page.locator('.viewer-close').click();
   if(id.startsWith('macbook')) {
    await page.selectOption('#variant-color','Silver');
    await page.locator('#mainImage').evaluate(img=>img.decode());
    assert.match(await page.locator('#mainImage').getAttribute('src'),/silver\.png$/);
    assert.match(await page.locator('.gallery-counter').textContent(),/^1 /);
   }
   await page.locator('.product-photo img').evaluateAll(imgs=>Promise.all(imgs.map(img=>{img.loading='eager';return img.decode();})));
   for(const image of product.gallery) {
    const response=await page.request.get(base+'/'+image.src); assert.equal(response.status(),200);
   }
   const border=await page.locator('#pdpGalleryMain').evaluate(el=>getComputedStyle(el).borderTopWidth);
   assert.equal(border,'0px');
   console.log(id+': gallery, navigation, enlarged viewer, colors, and assets passed');
  }
  await page.locator('.product-photo-section').screenshot({path:'test/product-gallery-desktop.png'});
  await page.setViewportSize({width:390,height:844});
  await page.goto(base+'/product.html?id=mac-studio-m5',{waitUntil:'domcontentloaded'});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  const columns=await page.locator('.product-photo-grid').evaluate(el=>getComputedStyle(el).gridTemplateColumns);
  assert.equal(columns.split(' ').length,1);
  await page.locator('[data-detail-image="2"]').click();
  assert.ok(await page.locator('dialog').evaluate(d=>d.open));
  await page.locator('.viewer-close').click();
  await page.locator('.product-photo-section').screenshot({path:'test/product-gallery-mobile.png'});
  assert.deepEqual(errors,[]);
  console.log('Mobile layout and all gallery interactions passed.');
 } finally { if (browser) await browser.close(); server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); }
})().catch(e => { console.error(e); process.exitCode = 1; });
