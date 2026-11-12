const { chromium } = require('playwright');
const path = require('path');

async function diagnoseBoth() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });

  // 1. Diagnose iPad mini
  const miniUrl = 'file:///' + path.resolve(__dirname, 'client/ipad-mini.html').replace(/\\/g, '/');
  const miniPage = await browser.newPage({ viewport: { width: 393, height: 852 }, isMobile: true, hasTouch: true });
  await miniPage.goto(miniUrl, { waitUntil: 'load' });
  await miniPage.waitForTimeout(500);

  // Check Highlights (scrolling section)
  const highlightsInfo = await miniPage.evaluate(() => {
    const sec = document.getElementById('highlights');
    if (!sec) return { error: 'no highlights' };
    const cards = Array.from(sec.querySelectorAll('.card')).map((c, i) => {
      const text = c.querySelector('.card__text');
      const note = c.querySelector('.card__note');
      const bg = c.querySelector('.card__bg');
      const cBox = c.getBoundingClientRect();
      const tBox = text ? text.getBoundingClientRect() : null;
      return {
        cardIndex: i,
        cardBox: { w: cBox.width, h: cBox.height, left: cBox.left },
        text: text ? text.innerText.replace(/\s+/g, ' ').trim() : null,
        textStyles: text ? {
          color: window.getComputedStyle(text).color,
          fontSize: window.getComputedStyle(text).fontSize,
          position: window.getComputedStyle(text).position,
          bottom: window.getComputedStyle(text).bottom,
          left: window.getComputedStyle(text).left,
          maxW: window.getComputedStyle(text).maxWidth,
          box: tBox ? { w: tBox.width, h: tBox.height, top: tBox.top, left: tBox.left } : null
        } : null,
        note: note ? note.innerText : null
      };
    });

    const pager = sec.querySelector('.pager');
    const head = sec.querySelector('.highlights__head');
    return {
      secBox: sec.getBoundingClientRect(),
      headBox: head ? head.getBoundingClientRect() : null,
      cards,
      pagerVisible: pager ? window.getComputedStyle(pager).display !== 'none' : false
    };
  });

  // Check Buy section (last section of iPad mini)
  const miniBuyInfo = await miniPage.evaluate(() => {
    const sec = document.getElementById('buy');
    if (!sec) return { error: 'no buy section' };
    const title = sec.querySelector('.buy-title');
    const preview = sec.querySelector('.preview-card');
    const config = sec.querySelector('.config-controls');
    const bottomBar = sec.querySelector('.bottom-bar');
    const swatches = sec.querySelectorAll('.swatch-btn');
    const storages = sec.querySelectorAll('.storage-btn');
    const connBtns = sec.querySelectorAll('.conn-btn');

    return {
      titleText: title ? title.innerText : null,
      titleSize: title ? window.getComputedStyle(title).fontSize : null,
      previewBox: preview ? preview.getBoundingClientRect() : null,
      configBox: config ? config.getBoundingClientRect() : null,
      bottomBarBox: bottomBar ? bottomBar.getBoundingClientRect() : null,
      bottomBarStyles: bottomBar ? {
        display: window.getComputedStyle(bottomBar).display,
        position: window.getComputedStyle(bottomBar).position,
        color: window.getComputedStyle(bottomBar).color,
        bg: window.getComputedStyle(bottomBar).backgroundColor
      } : null,
      swatchesCount: swatches.length,
      storagesCount: storages.length,
      connBtnsCount: connBtns.length
    };
  });

  // Screenshots of Highlights & Buy in iPad mini
  await miniPage.locator('#highlights').scrollIntoViewIfNeeded();
  await miniPage.waitForTimeout(300);
  await miniPage.locator('#highlights').screenshot({ path: 'C:/Users/koush/.gemini/antigravity/brain/ae9f6285-1fb2-4397-a97e-c89990f06934/ipad_mob_highlights.png' });

  await miniPage.locator('#buy').scrollIntoViewIfNeeded();
  await miniPage.waitForTimeout(300);
  await miniPage.locator('#buy').screenshot({ path: 'C:/Users/koush/.gemini/antigravity/brain/ae9f6285-1fb2-4397-a97e-c89990f06934/ipad_mob_buy.png' });

  await miniPage.close();

  // 2. Diagnose iPhone 18 Pro
  const ip18Url = 'file:///' + path.resolve(__dirname, 'client/iphone-18-pro.html').replace(/\\/g, '/');
  const ipPage = await browser.newPage({ viewport: { width: 393, height: 852 }, isMobile: true, hasTouch: true });
  await ipPage.goto(ip18Url, { waitUntil: 'load' });
  await ipPage.waitForTimeout(500);

  // Check gallery captions & text
  const ipGallery = await ipPage.evaluate(() => {
    const gallery = document.getElementById('gallery');
    const slides = Array.from(gallery.querySelectorAll('.slide')).map((s, i) => {
      const cap = s.querySelector('.caption');
      const sBox = s.getBoundingClientRect();
      const cBox = cap ? cap.getBoundingClientRect() : null;
      return {
        slide: i,
        sBox,
        cBox,
        captionText: cap ? cap.innerText : null,
        captionStyles: cap ? {
          color: window.getComputedStyle(cap).color,
          fontSize: window.getComputedStyle(cap).fontSize,
          position: window.getComputedStyle(cap).position,
          bottom: window.getComputedStyle(cap).bottom,
          left: window.getComputedStyle(cap).left,
          transform: window.getComputedStyle(cap).transform,
          overflow: window.getComputedStyle(cap).overflow,
          whiteSpace: window.getComputedStyle(cap).whiteSpace
        } : null
      };
    });
    return { slides };
  });

  // Check upgrade section
  const ipUpgrade = await ipPage.evaluate(() => {
    const u = document.querySelector('.upgrade');
    const eyebrow = u.querySelector('.upgrade__eyebrow');
    const title = u.querySelector('.upgrade__title');
    const body = u.querySelector('.upgrade__body');
    return {
      eyebrow: eyebrow ? { text: eyebrow.innerText, size: window.getComputedStyle(eyebrow).fontSize, color: window.getComputedStyle(eyebrow).color } : null,
      title: title ? { text: title.innerText, size: window.getComputedStyle(title).fontSize, color: window.getComputedStyle(title).color, box: title.getBoundingClientRect() } : null,
      body: body ? { text: body.innerText, size: window.getComputedStyle(body).fontSize, color: window.getComputedStyle(body).color, box: body.getBoundingClientRect() } : null
    };
  });

  // Check compare section
  const ipCompare = await ipPage.evaluate(() => {
    const c = document.querySelector('.compare');
    const label = c.querySelector('.compare__label');
    const select = c.querySelector('.compare__select');
    const stats = Array.from(c.querySelectorAll('.stat')).map(st => ({
      pre: st.querySelector('.stat__pre')?.innerText,
      val: st.querySelector('.stat__value')?.innerText,
      post: st.querySelector('.stat__post')?.innerText,
      box: st.getBoundingClientRect(),
      color: window.getComputedStyle(st).color
    }));
    return {
      label: label ? label.innerText : null,
      selectBox: select ? select.getBoundingClientRect() : null,
      stats
    };
  });

  // Check buy section in iPhone 18 Pro
  const ipBuy = await ipPage.evaluate(() => {
    const b = document.getElementById('buy');
    const title = b.querySelector('.buy-title');
    const cards = Array.from(b.querySelectorAll('.size-card, .storage-card')).map(card => ({
      text: card.innerText.replace(/\s+/g, ' ').trim(),
      box: card.getBoundingClientRect(),
      color: window.getComputedStyle(card).color
    }));
    return {
      titleText: title ? title.innerText : null,
      cardsBox: b.getBoundingClientRect(),
      cards
    };
  });

  await ipPage.close();
  await browser.close();

  console.log(JSON.stringify({
    highlightsInfo,
    miniBuyInfo,
    ipGallery,
    ipUpgrade,
    ipCompare,
    ipBuy
  }, null, 2));
}

diagnoseBoth().catch(err => {
  console.error(err);
  process.exit(1);
});

