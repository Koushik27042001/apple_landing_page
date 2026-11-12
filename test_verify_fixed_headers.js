const { chromium } = require('playwright');
const path = require('path');

const pages = [
  'iphone-18-pro.html',
  'ipad-mini.html',
  'index.html',
  'macbook-neo.html',
  'macbook-air.html',
  'category.html',
  'pricing.html'
];

async function verifyAllHeaders() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const results = {};

  for (const pageName of pages) {
    const pageUrl = 'file:///' + path.resolve(__dirname, 'client/' + pageName).replace(/\\/g, '/');
    
    // Desktop Viewport
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(pageUrl, { waitUntil: 'load' });
    await page.waitForTimeout(300);

    const desktopData = await page.evaluate(() => {
      const header = document.querySelector('header');
      if (!header) return { error: 'No header found' };

      const cs = window.getComputedStyle(header);
      const storeTag = header.querySelector('.store-tag');
      const appleLogo = header.querySelector('.apple-logo-svg');
      const logoImg = header.querySelector('.site-logo-img');
      const navLinks = Array.from(header.querySelectorAll('.main-nav > a, .products-menu-toggle, .biz-dropdown-toggle')).map(el => ({
        text: el.innerText.trim(),
        color: window.getComputedStyle(el).color,
        visibility: window.getComputedStyle(el).visibility,
        display: window.getComputedStyle(el).display
      }));

      const searchInput = header.querySelector('.search-input');
      const bag = header.querySelector('.header-bag-btn');

      return {
        headerClass: header.className,
        bg: cs.backgroundColor,
        storeTag: storeTag ? {
          color: window.getComputedStyle(storeTag).color,
          text: storeTag.innerText.replace(/\s+/g, ' ').trim(),
          visible: window.getComputedStyle(storeTag).visibility !== 'hidden'
        } : null,
        appleLogo: appleLogo ? {
          fill: window.getComputedStyle(appleLogo).fill,
          color: window.getComputedStyle(appleLogo).color,
          display: window.getComputedStyle(appleLogo).display
        } : null,
        logoImg: logoImg ? {
          display: window.getComputedStyle(logoImg).display,
          width: logoImg.offsetWidth,
          height: logoImg.offsetHeight
        } : null,
        navLinks,
        searchVisible: searchInput ? window.getComputedStyle(searchInput).display !== 'none' : false,
        bagVisible: bag ? window.getComputedStyle(bag).display !== 'none' : false
      };
    });

    const shotPath = `C:/Users/koush/.gemini/antigravity/brain/ae9f6285-1fb2-4397-a97e-c89990f06934/header_${pageName.replace('.html','')}_desktop_fixed.png`;
    await page.screenshot({ path: shotPath, clip: { x: 0, y: 0, width: 1440, height: 75 } });
    await page.close();

    // Mobile Viewport
    const mPage = await browser.newPage({ viewport: { width: 393, height: 852 }, isMobile: true, hasTouch: true });
    await mPage.goto(pageUrl, { waitUntil: 'load' });
    await mPage.waitForTimeout(300);

    const mobileData = await mPage.evaluate(() => {
      const header = document.querySelector('header');
      if (!header) return { error: 'No header found' };
      const menuBtn = header.querySelector('.menu-toggle');
      const storeTag = header.querySelector('.store-tag');
      const bag = header.querySelector('.header-bag-btn');

      return {
        menuBtnVisible: menuBtn ? window.getComputedStyle(menuBtn).display : 'none',
        menuBtnColor: menuBtn ? window.getComputedStyle(menuBtn).color : null,
        storeTagColor: storeTag ? window.getComputedStyle(storeTag).color : null,
        bagVisible: bag ? window.getComputedStyle(bag).display : 'none'
      };
    });

    const mShotPath = `C:/Users/koush/.gemini/antigravity/brain/ae9f6285-1fb2-4397-a97e-c89990f06934/header_${pageName.replace('.html','')}_mobile_fixed.png`;
    await mPage.screenshot({ path: mShotPath, clip: { x: 0, y: 0, width: 393, height: 60 } });
    await mPage.close();

    results[pageName] = { desktopData, mobileData, shotPath, mShotPath };
  }

  await browser.close();
  console.log(JSON.stringify(results, null, 2));
}

verifyAllHeaders().catch(err => {
  console.error(err);
  process.exit(1);
});

