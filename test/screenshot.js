const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
  
  await page.goto("http://localhost:4000/product.html?id=iphone-17-pro-max", { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await page.screenshot({ path: "test/pdp-3d-twist.png", fullPage: false });
  console.log("Screenshot saved to test/pdp-3d-twist.png");

  await browser.close();
})();
