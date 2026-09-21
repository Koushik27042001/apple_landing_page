// Run with: node test/admin-demo-browser.js (Playwright + a browser required).
const { chromium } = require('playwright');
const express = require('../server/node_modules/express');
const path = require('node:path');
const assert = require('node:assert/strict');
const { once } = require('node:events');

(async function () {
  // Deliberately expose static files only, under a GitHub Pages-style prefix.
  const app = express();
  app.use('/showcase', express.static(path.resolve(__dirname, '../client')));
  const server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  let browser;
  try {
    browser = await chromium.launch({ channel: process.platform === 'win32' ? 'msedge' : undefined });
    const page = await browser.newPage();
    const errors = [];
    const apiRequests = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('request', req => { if (new URL(req.url()).pathname.startsWith('/api/')) apiRequests.push(req.url()); });
    const base = `http://127.0.0.1:${server.address().port}/showcase/admin/index.html`;
    await page.goto(base);
    assert.equal(await page.locator('#loginView').isVisible(), true);
    await page.evaluate(() => localStorage.setItem('iswift_admin_token', 'existing-live-token'));
    await page.getByRole('link', { name: 'Explore admin demo' }).click();
    await page.locator('.stat-card').first().waitFor();
    assert.equal(await page.locator('#demoNotice').isVisible(), true);
    for (const view of ['products', 'banners', 'coupons', 'orders', 'settings']) {
      await page.locator(`[data-view="${view}"]`).click();
      await page.locator(view === 'settings' ? '#settingsForm' : '#content table').waitFor();
    }
    await page.locator('#s_storeName').fill('Browser demo edit');
    await page.getByRole('button', { name: 'Save settings', exact: true }).click();
    await page.getByText('Settings saved', { exact: true }).waitFor();
    await page.reload();
    await page.locator('[data-view="settings"]').click();
    await page.locator('#s_storeName').waitFor();
    assert.equal(await page.locator('#s_storeName').inputValue(), 'Browser demo edit');
    await page.locator('[data-view="products"]').click();
    await page.locator('[data-edit-product]').first().click();
    await page.locator('#p_image').fill('images/products/iphone-17-pro-silver.png');
    await page.locator('#p_image').dispatchEvent('input');
    assert.match(await page.locator('#p_image_preview').getAttribute('src'), /iphone-17-pro-silver/);
    await page.locator('#p_add_color_btn').click();
    await page.locator('.color-file-input').last().setInputFiles({ name: 'sample.png', mimeType: 'image/png', buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=', 'base64') });
    await page.getByText('Color variant image uploaded', { exact: true }).waitFor();
    await page.locator('#productModal').getByRole('button', { name: 'Cancel', exact: true }).click();
    await page.locator('[data-view="orders"]').click();
    await page.locator('[data-status-order="DEMO-1000"]').selectOption('delivered');
    await page.getByText('Order status updated', { exact: true }).waitFor();
    page.once('dialog', dialog => dialog.accept());
    await page.locator('#resetDemoBtn').click();
    await page.getByText('Demo reset', { exact: true }).waitFor();
    await page.locator('[data-view="settings"]').click();
    await page.locator('#s_storeName').waitFor();
    assert.equal(await page.locator('#s_storeName').inputValue(), 'Iswift Gadgets Demo');
    assert.equal(await page.evaluate(() => localStorage.getItem('iswift_admin_token')), 'existing-live-token');
    assert.deepEqual(apiRequests, []);
    assert.deepEqual(errors, []);
    // Avoid triggering a real-session probe after exit in this static-only fixture.
    await page.evaluate(() => localStorage.removeItem('iswift_admin_token'));
    await page.locator('#logoutBtn').click();
    await page.locator('#loginView').waitFor();
    console.log('PASS: static subdirectory demo, all sections, edits, persistence, image helpers, reset, exit, no API requests or browser errors.');
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
