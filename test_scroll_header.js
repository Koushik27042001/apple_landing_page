const { chromium } = require('playwright');
const path = require('path');

async function checkScroll() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const htmlPath = 'file:///' + path.resolve(__dirname, 'client/iphone-18-pro.html').replace(/\\/g, '/');

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(htmlPath, { waitUntil: 'load' });
  await page.waitForTimeout(500);

  // Scroll down 500px
  await page.evaluate(() => window.scrollTo(0, 500));
  await page.waitForTimeout(400);

  const scrolledData = await page.evaluate(() => {
    const header = document.querySelector('header');
    const cs = window.getComputedStyle(header);
    const rect = header.getBoundingClientRect();
    return {
      top: rect.top,
      bottom: rect.bottom,
      position: cs.position,
      zIndex: cs.zIndex,
      bg: cs.backgroundColor,
      scrolledClass: header.classList.contains('scrolled'),
      display: cs.display,
      visibility: cs.visibility,
      opacity: cs.opacity
    };
  });

  const shotPath = 'C:/Users/koush/.gemini/antigravity/brain/ae9f6285-1fb2-4397-a97e-c89990f06934/header_iphone18_scrolled.png';
  await page.screenshot({ path: shotPath, clip: { x: 0, y: 0, width: 1440, height: 120 } });

  console.log(JSON.stringify(scrolledData, null, 2));

  await browser.close();
}

checkScroll().catch(err => {
  console.error(err);
  process.exit(1);
});

