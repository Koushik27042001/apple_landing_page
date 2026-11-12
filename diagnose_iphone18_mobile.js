const { chromium } = require('playwright');
const path = require('path');

async function diagnoseIphone18() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const htmlPath = 'file:///' + path.resolve(__dirname, 'client/iphone-18-pro.html').replace(/\\/g, '/');

  const page = await browser.newPage({
    viewport: { width: 393, height: 852 },
    isMobile: true,
    hasTouch: true
  });

  await page.goto(htmlPath, { waitUntil: 'load' });
  await page.waitForTimeout(600);

  // Check all sections
  const sections = await page.evaluate(() => {
    const list = [];
    const allSections = document.querySelectorAll('section, .gallery, .upgrade, .compare, .buy-section');
    
    allSections.forEach(sec => {
      const texts = Array.from(sec.querySelectorAll('h1, h2, h3, h4, p, span, button, select, div.stat, .caption, .upgrade__body, .pro-hero__title, .pro-hero__subtitle'))
        .filter(el => el.innerText && el.innerText.trim().length > 0 && el.children.length === 0)
        .map(el => {
          const cs = window.getComputedStyle(el);
          const rect = el.getBoundingClientRect();
          return {
            tag: el.tagName,
            text: el.innerText.trim().substring(0, 60),
            color: cs.color,
            fontSize: cs.fontSize,
            lineHeight: cs.lineHeight,
            opacity: cs.opacity,
            visibility: cs.visibility,
            display: cs.display,
            width: rect.width,
            left: rect.left,
            right: rect.right,
            isOffscreen: rect.left < -5 || rect.right > window.innerWidth + 5
          };
        });

      list.push({
        id: sec.id || sec.className,
        box: sec.getBoundingClientRect(),
        textsCount: texts.length,
        texts: texts.slice(0, 15),
        hasOffscreenText: texts.some(t => t.isOffscreen)
      });
    });

    return {
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      sections: list
    };
  });

  console.log(JSON.stringify(sections, null, 2));

  // Take screenshot of each section
  const sectionLocators = page.locator('section, .gallery, .upgrade, .compare, .buy-section');
  const count = await sectionLocators.count();
  for (let i = 0; i < count; i++) {
    const s = sectionLocators.nth(i);
    await s.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    const id = (await s.getAttribute('id')) || (await s.getAttribute('class')) || `sec_${i}`;
    const cleanId = id.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 20);
    await s.screenshot({ path: `C:/Users/koush/.gemini/antigravity/brain/ae9f6285-1fb2-4397-a97e-c89990f06934/iphone18_mob_${cleanId}.png` });
  }

  await browser.close();
}

diagnoseIphone18().catch(err => {
  console.error(err);
  process.exit(1);
});

