const { chromium } = require('playwright');
const path = require('path');

async function testCascadeFlow() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const htmlPath = 'file:///' + path.resolve(__dirname, 'client/iphone-18-pro.html').replace(/\\/g, '/');

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(htmlPath, { waitUntil: 'load' });
  await page.waitForTimeout(500);

  // Hover over Apple
  await page.locator('#productsMenuToggle').hover();
  await page.waitForTimeout(200);

  // Hover over Products item in Panel 1
  const productsItem = page.locator('.cascade-item.has-submenu[data-sub="products"]');
  await productsItem.hover();
  await page.waitForTimeout(200);

  // Hover over iPhone category in Panel 2
  const iphoneItem = page.locator('.cascade-cat-item.has-submenu[data-cat="iphone"]');
  await iphoneItem.hover();
  await page.waitForTimeout(200);

  const cascadeState = await page.evaluate(() => {
    const p1 = document.getElementById('cascadePanel1');
    const p2 = document.getElementById('cascadePanel2');
    const p3 = document.getElementById('cascadePanel3');
    const group = document.querySelector('.cascade-prod-group[data-cat-group="iphone"]');

    const iphone18Link = document.querySelector('a[href="iphone-18-pro.html"]');

    return {
      p1Open: p1 ? window.getComputedStyle(p1).display : null,
      p2Open: p2 ? window.getComputedStyle(p2).display : null,
      p2Opacity: p2 ? window.getComputedStyle(p2).opacity : null,
      p3Open: p3 ? window.getComputedStyle(p3).display : null,
      p3Opacity: p3 ? window.getComputedStyle(p3).opacity : null,
      groupDisplay: group ? window.getComputedStyle(group).display : null,
      iphone18LinkText: iphone18Link ? iphone18Link.innerText : null,
      iphone18LinkColor: iphone18Link ? window.getComputedStyle(iphone18Link).color : null
    };
  });

  const shotPath = 'C:/Users/koush/.gemini/antigravity/brain/ae9f6285-1fb2-4397-a97e-c89990f06934/cascade_full_hover.png';
  await page.screenshot({ path: shotPath, clip: { x: 0, y: 0, width: 1440, height: 600 } });

  console.log(JSON.stringify(cascadeState, null, 2));

  await browser.close();
}

testCascadeFlow().catch(err => {
  console.error(err);
  process.exit(1);
});

