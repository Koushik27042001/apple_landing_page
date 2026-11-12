const { chromium } = require('playwright');
const path = require('path');

const otherPages = ['category.html', 'pricing.html', 'support.html', 'contact.html'];

async function testOtherPages() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const results = {};

  for (const pageName of otherPages) {
    const pageUrl = 'file:///' + path.resolve(__dirname, 'client/' + pageName).replace(/\\/g, '/');
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(pageUrl, { waitUntil: 'load' });
    await page.waitForTimeout(400);

    const data = await page.evaluate(() => {
      const header = document.querySelector('header');
      if (!header) return { error: 'no header' };
      const cs = window.getComputedStyle(header);
      const storeTag = header.querySelector('.store-tag');
      const logoImg = header.querySelector('.site-logo-img');
      const navLinks = Array.from(header.querySelectorAll('.main-nav > a')).map(a => ({
        text: a.innerText,
        color: window.getComputedStyle(a).color
      }));

      return {
        className: header.className,
        bg: cs.backgroundColor,
        storeTagColor: storeTag ? window.getComputedStyle(storeTag).color : null,
        navLinks
      };
    });

    results[pageName] = data;
    await page.close();
  }

  await browser.close();
  console.log(JSON.stringify(results, null, 2));
}

testOtherPages().catch(err => {
  console.error(err);
  process.exit(1);
});

