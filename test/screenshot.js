const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });
  await page.goto("http://localhost:8080/index.html", { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await page.screenshot({ path: "test/screenshot-home.png", fullPage: false });

  await page.goto("http://localhost:8080/product.html?id=iphone-17-pro", { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  await page.screenshot({ path: "test/screenshot-pdp.png", fullPage: false });

  await page.goto("http://localhost:8080/category.html?cat=mac", { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  await page.screenshot({ path: "test/screenshot-mac.png", fullPage: false });

  await browser.close();
})();
