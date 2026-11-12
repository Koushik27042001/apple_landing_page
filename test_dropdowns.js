const { chromium } = require('playwright');
const path = require('path');

async function testDropdowns() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const htmlPath = 'file:///' + path.resolve(__dirname, 'client/iphone-18-pro.html').replace(/\\/g, '/');

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(htmlPath, { waitUntil: 'load' });
  await page.waitForTimeout(500);

  // Hover over Apple toggle
  const appleToggle = page.locator('#productsMenuToggle');
  await appleToggle.hover();
  await page.waitForTimeout(300);

  const menuState = await page.evaluate(() => {
    const container = document.getElementById('productsSubmenu');
    const panel1 = document.getElementById('cascadePanel1');
    const panel2 = document.getElementById('cascadePanel2');
    const panel3 = document.getElementById('cascadePanel3');
    const appleMenu = document.getElementById('appleCascadeMenu');

    return {
      isOpen: appleMenu ? appleMenu.classList.contains('open') : false,
      containerDisplay: container ? window.getComputedStyle(container).display : null,
      containerOpacity: container ? window.getComputedStyle(container).opacity : null,
      panel1Visible: panel1 ? window.getComputedStyle(panel1).display : null,
      panel2Visible: panel2 ? window.getComputedStyle(panel2).display : null,
      panel3Visible: panel3 ? window.getComputedStyle(panel3).display : null,
    };
  });

  const shotPath = 'C:/Users/koush/.gemini/antigravity/brain/ae9f6285-1fb2-4397-a97e-c89990f06934/header_apple_dropdown.png';
  await page.screenshot({ path: shotPath, clip: { x: 0, y: 0, width: 1440, height: 500 } });

  console.log(JSON.stringify(menuState, null, 2));

  await browser.close();
}

testDropdowns().catch(err => {
  console.error(err);
  process.exit(1);
});

