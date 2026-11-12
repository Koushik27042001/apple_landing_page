const { chromium } = require('playwright');
const path = require('path');

const pages = [
  'iphone-18-pro.html',
  'ipad-mini.html',
  'index.html',
  'macbook-neo.html',
  'macbook-air.html'
];

async function checkAllHeaders() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const results = {};

  for (const pageName of pages) {
    const pageUrl = 'file:///' + path.resolve(__dirname, 'client/' + pageName).replace(/\\/g, '/');
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(pageUrl, { waitUntil: 'load' });
    await page.waitForTimeout(400);

    const desktopData = await page.evaluate(() => {
      const header = document.querySelector('header');
      if (!header) return { error: 'No header found' };

      const cs = window.getComputedStyle(header);
      const logo = header.querySelector('.logo');
      const storeTag = header.querySelector('.store-tag');
      const appleLogo = header.querySelector('.apple-logo-svg');
      const navLinks = Array.from(header.querySelectorAll('.main-nav > a, .products-menu-toggle, .biz-dropdown-toggle')).map(el => ({
        text: el.innerText.trim(),
        color: window.getComputedStyle(el).color,
        display: window.getComputedStyle(el).display,
        visibility: window.getComputedStyle(el).visibility
      }));

      const searchInput = header.querySelector('.search-input');
      const bag = header.querySelector('.header-bag-btn');

      return {
        headerClass: header.className,
        bg: cs.backgroundColor,
        backdropFilter: cs.backdropFilter || cs.webkitBackdropFilter,
        borderBottom: cs.borderBottom,
        height: header.offsetHeight,
        storeTag: storeTag ? {
          color: window.getComputedStyle(storeTag).color,
          text: storeTag.innerText.replace(/\s+/g, ' ').trim()
        } : null,
        appleLogo: appleLogo ? {
          fill: window.getComputedStyle(appleLogo).fill,
          color: window.getComputedStyle(appleLogo).color,
          display: window.getComputedStyle(appleLogo).display
        } : null,
        navLinks,
        searchVisible: searchInput ? window.getComputedStyle(searchInput).display !== 'none' : false,
        bagVisible: bag ? window.getComputedStyle(bag).display !== 'none' : false
      };
    });

    const shotPath = `C:/Users/koush/.gemini/antigravity/brain/ae9f6285-1fb2-4397-a97e-c89990f06934/header_${pageName.replace('.html','')}_desktop.png`;
    await page.screenshot({ path: shotPath, clip: { x: 0, y: 0, width: 1440, height: 90 } });

    await page.close();

    // Mobile check
    const mPage = await browser.newPage({ viewport: { width: 393, height: 852 }, isMobile: true, hasTouch: true });
    await mPage.goto(pageUrl, { waitUntil: 'load' });
    await mPage.waitForTimeout(400);

    const mobileData = await mPage.evaluate(() => {
      const header = document.querySelector('header');
      if (!header) return { error: 'No header' };
      const menuBtn = header.querySelector('.menu-toggle');
      const logo = header.querySelector('.logo');
      const bag = header.querySelector('.header-bag-btn');
      const storeTag = header.querySelector('.store-tag');

      return {
        menuBtnVisible: menuBtn ? window.getComputedStyle(menuBtn).display : 'none',
        menuBtnColor: menuBtn ? window.getComputedStyle(menuBtn).color : null,
        storeTagColor: storeTag ? window.getComputedStyle(storeTag).color : null,
        bagVisible: bag ? window.getComputedStyle(bag).display : 'none',
        height: header.offsetHeight
      };
    });

    const mShotPath = `C:/Users/koush/.gemini/antigravity/brain/ae9f6285-1fb2-4397-a97e-c89990f06934/header_${pageName.replace('.html','')}_mobile.png`;
    await mPage.screenshot({ path: mShotPath, clip: { x: 0, y: 0, width: 393, height: 70 } });

    await mPage.close();

    results[pageName] = { desktopData, mobileData, shotPath, mShotPath };
  }

  await browser.close();
  console.log(JSON.stringify(results, null, 2));
}

checkAllHeaders().catch(err => {
  console.error(err);
  process.exit(1);
});

