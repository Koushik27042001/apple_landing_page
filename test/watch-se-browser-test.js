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
  const product=PRODUCTS.find(p=>p.id==='watch-se-3');
  await page.goto(base+'/product.html?id=watch-se-3&configure=1',{waitUntil:'domcontentloaded'});
  assert.ok(await page.locator('body').evaluate(el=>el.classList.contains('watch-se-page')));
  assert.equal(await page.locator('.watch-se-feature').count(),4);
  assert.equal(await page.locator('.watch-se-design img').count(),1);
  assert.equal(await page.locator('.product-photo-section').count(),0);
  assert.equal(await page.locator('h1').count(),1);
  await page.locator('#mainImage').evaluate(img=>img.decode());
  assert.match(await page.locator('#mainImage').getAttribute('src'),/watch_segment\/hero__/);
  const headings = await page.locator('.watch-se-intro h1, .watch-se-section-heading h2, .watch-se-feature h3').evaluateAll(nodes=>nodes.map(el=>getComputedStyle(el).color));
  assert.ok(headings.every(color=>color==='rgb(29, 29, 31)'),'Showcase headings must remain readable on light backgrounds');
  await page.screenshot({path:'test/watch-se-desktop.png'});
  await page.locator('.watch-se-feature img, .watch-se-design img').evaluateAll(imgs=>Promise.all(imgs.map(img=>{img.loading='eager';return img.decode();})));
  assert.equal(await page.locator('.pdp-thumb').count(),6);
  await page.locator('.gallery-next').click();
  assert.match(await page.locator('.gallery-label').textContent(),/Activity Rings/);
  await page.locator('.gallery-zoom').click();
  assert.ok(await page.locator('dialog').evaluate(d=>d.open));
  await page.keyboard.press('Escape');
  for(const variant of product.variants) {
    await page.selectOption('#variant-caseSize',variant.caseSize);
    await page.selectOption('#variant-bandSize',variant.bandSize);
    await page.selectOption('#variant-connectivity',variant.connectivity);
    await page.selectOption('#variant-color',variant.color);
    assert.match(await page.locator('.pdp-variant-summary').textContent(),new RegExp(variant.modelNumber));
    assert.equal(await page.evaluate(()=>currentUnitPrice()),variant.price);
  }
  const textColors=await page.locator('#watchConfigure .title').evaluateAll(nodes=>nodes.map(n=>getComputedStyle(n).color));
  assert.ok(textColors.every(color=>color!=='rgb(255, 255, 255)'),'Configuration labels must contrast with the light panel');
  await page.locator('#addToCartBtn').click();
  const cart=await page.evaluate(()=>getCart());assert.equal(cart[0].modelNumber,product.variants[15].modelNumber);
  assert.equal(cart[0].price,33900);
  await page.locator('.watch-se-highlights').screenshot({path:'test/watch-se-features.png',style:'#site-header,#stickyAtc,#whatsapp-float{visibility:hidden!important}'});
  await page.setViewportSize({width:390,height:844});
  await page.goto(base+'/product.html?id=watch-se-3&configure=1',{waitUntil:'domcontentloaded'});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  assert.equal((await page.locator('.watch-se-feature-grid').evaluate(el=>getComputedStyle(el).gridTemplateColumns)).split(' ').length,1);
  await page.screenshot({path:'test/watch-se-mobile.png'});
  await page.locator('.watch-se-buy').click();
  await page.waitForURL(url=>url.hash==='#watchConfigure');
  assert.ok(await page.locator('#watchConfigure').isVisible());
  await page.locator('.watch-se-feature img, .watch-se-design img').evaluateAll(imgs=>Promise.all(imgs.map(img=>{img.loading='eager';return img.decode();})));
  await page.locator('.watch-se-highlights').screenshot({path:'test/watch-se-features-mobile.png',style:'#site-header,#stickyAtc,#whatsapp-float{visibility:hidden!important}'});
  assert.deepEqual(errors,[]);
  console.log('Watch SE 3: six supplied images, four feature sections, gallery/viewer, all 16 case/band/connectivity/finish variants, exact cart pricing, and desktop/mobile layout passed.');
 } finally { if (browser) await browser.close(); server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); }
})().catch(e => { console.error(e); process.exitCode = 1; });
