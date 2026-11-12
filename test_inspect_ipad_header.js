const { chromium } = require('playwright');
const path = require('path');

async function checkIpadHeader() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const htmlPath = 'file:///' + path.resolve(__dirname, 'client/ipad-mini.html').replace(/\\/g, '/');

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(htmlPath, { waitUntil: 'load' });
  await page.waitForTimeout(500);

  const headerDetails = await page.evaluate(() => {
    const el = document.getElementById('site-header');
    if (!el) return { error: 'No #site-header found' };
    const header = el.querySelector('header');
    if (!header) return { error: 'No header inside #site-header' };
    
    const nav = header.querySelector('.main-nav');
    const links = nav ? Array.from(nav.querySelectorAll('a, button')).map(l => ({
      text: l.innerText,
      tag: l.tagName,
      className: l.className,
      color: window.getComputedStyle(l).color,
      bgColor: window.getComputedStyle(l).backgroundColor,
      visibility: window.getComputedStyle(l).visibility,
      display: window.getComputedStyle(l).display
    })) : [];

    const logo = header.querySelector('.logo');
    const storeTag = header.querySelector('.store-tag');

    return {
      headerClasses: header.className,
      headerBg: window.getComputedStyle(header).backgroundColor,
      links: links.slice(0, 10),
      storeTagColor: storeTag ? window.getComputedStyle(storeTag).color : null
    };
  });

  const shotPath = 'C:/Users/koush/.gemini/antigravity/brain/ae9f6285-1fb2-4397-a97e-c89990f06934/ipad_header_inspect.png';
  await page.screenshot({ path: shotPath, clip: { x: 0, y: 0, width: 1440, height: 120 } });

  console.log(JSON.stringify(headerDetails, null, 2));

  await browser.close();
}

checkIpadHeader().catch(err => {
  console.error(err);
  process.exit(1);
});

