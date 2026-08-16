const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
  const errors = [];
  page.on("pageerror", (err) => errors.push("[pageerror] " + err.message));

  const base = "http://localhost:8080/";
  const results = [];
  function log(step, ok, extra) { results.push({ step, ok, extra: extra || "" }); }

  try {
    // Category page shows all new categories with correct counts
    await page.goto(base + "category.html?cat=mac", { waitUntil: "networkidle" });
    const macCount = await page.locator(".product-card").count();
    log("Mac category shows all 7 new Mac products", macCount === 7, "count=" + macCount);

    await page.goto(base + "category.html?cat=iphone", { waitUntil: "networkidle" });
    const iphoneCount = await page.locator(".product-card").count();
    log("iPhone category shows all 5 new iPhone models", iphoneCount === 5, "count=" + iphoneCount);

    await page.goto(base + "category.html?cat=watch", { waitUntil: "networkidle" });
    const watchCount = await page.locator(".product-card").count();
    log("Watch category shows all 3 new Watch models", watchCount === 3, "count=" + watchCount);

    await page.goto(base + "category.html?cat=ipad", { waitUntil: "networkidle" });
    const ipadCount = await page.locator(".product-card").count();
    log("iPad category shows all 5 new iPad models", ipadCount === 5, "count=" + ipadCount);

    await page.goto(base + "category.html?cat=accessories", { waitUntil: "networkidle" });
    const accCount = await page.locator(".product-card").count();
    log("Accessories category shows 14 items (4 originals + 10 AppleCare)", accCount === 14, "count=" + accCount);

    // Product detail page works for a new flagship product, shows price/EMI/storage/color selectors
    await page.goto(base + "product.html?id=iphone-17-pro-max", { waitUntil: "networkidle" });
    const title = await page.locator("h1").first().textContent();
    log("PDP loads iPhone 17 Pro Max correctly", title.includes("iPhone 17 Pro Max"), title.trim());

    const priceText = await page.locator(".price-now, .pdp-price, [class*='price']").first().textContent().catch(() => "");
    const bodyText = await page.locator("body").textContent();
    log("PDP shows correct base price ₹1,49,900", bodyText.includes("1,49,900"), "");

    const colorSwatchCount = await page.locator(".swatch").count().catch(() => 0);
    log("PDP renders all 3 color swatches", colorSwatchCount === 3, "count=" + colorSwatchCount);

    const storageOptionVisible = bodyText.includes("2TB");
    log("PDP shows all storage tiers including 2TB", storageOptionVisible, "");

    // Add a new product to cart and verify checkout total is correct
    await page.goto(base + "cart.html", { waitUntil: "networkidle" });
    await page.evaluate(() => localStorage.clear());
    await page.goto(base + "product.html?id=macbook-neo-13", { waitUntil: "networkidle" });
    const addBtn = page.locator("button:has-text('Add to Bag'), button:has-text('Add to Cart')").first();
    await addBtn.click();
    await page.waitForTimeout(500);
    await page.goto(base + "cart.html", { waitUntil: "networkidle" });
    const cartBodyText = await page.locator("body").textContent();
    log("Cart shows MacBook (A18 Pro) with correct price ₹79,900", cartBodyText.includes("MacBook") && cartBodyText.includes("79,900"), "");

  } catch (e) {
    log("FATAL", false, e.message);
  }

  console.log("\n===== CATALOG TEST RESULTS =====");
  let failCount = 0;
  for (const r of results) {
    console.log((r.ok ? "PASS" : "FAIL") + " - " + r.step + (r.extra ? " (" + r.extra + ")" : ""));
    if (!r.ok) failCount++;
  }
  console.log(failCount === 0 ? "ALL TESTS PASSED" : failCount + " TEST(S) FAILED");
  if (errors.length) { console.log("\nPage errors:"); errors.forEach((e) => console.log(e)); }
  await browser.close();
  process.exit(failCount > 0 ? 1 : 0);
})();
