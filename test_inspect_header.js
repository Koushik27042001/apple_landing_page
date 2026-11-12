const { chromium } = require('playwright');
const path = require('path');

async function checkHeader() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const htmlPath = 'file:///' + path.resolve(__dirname, 'client/iphone-18-pro.html').replace(/\\/g, '/');

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  const consoleMessages = [];
  page.on('console', msg => consoleMessages.push(msg.text()));
  page.on('pageerror', err => consoleMessages.push('ERROR: ' + err.message));

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
      visibility: window.getComputedStyle(l).visibility,
      display: window.getComputedStyle(l).display,
      opacity: window.getComputedStyle(l).opacity
    })) : [];

    const logo = header.querySelector('.logo');
    const headerInner = header.querySelector('.header-inner');

    return {
      headerClasses: header.className,
      headerBg: window.getComputedStyle(header).backgroundColor,
      headerColor: window.getComputedStyle(header).color,
      headerHeight: header.offsetHeight,
      headerInnerHeight: headerInner ? headerInner.offsetHeight : null,
      links,
      logoComputed: logo ? {
        color: window.getComputedStyle(logo).color,
        display: window.getComputedStyle(logo).display
      } : null
    };
  });

  const shotPath = 'C:/Users/koush/.gemini/antigravity/brain/ae9f6285-1fb2-4397-a97e-c89990f06934/iphone18_header_inspect.png';
  await page.screenshot({ path: shotPath, clip: { x: 0, y: 0, width: 1440, height: 200 } });

  console.log(JSON.stringify({ headerDetails, consoleMessages }, null, 2));

  await browser.close();
}

checkHeader().catch(err => {
  console.error(err);
  process.exit(1);
});

