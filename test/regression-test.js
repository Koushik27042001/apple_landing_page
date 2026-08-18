const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  const errors = [];
  page.on("pageerror", (err) => errors.push("[pageerror] " + err.message));
  page.on("console", (msg) => { if (msg.type() === "error") errors.push("[console] " + msg.text()); });

  const base = "http://localhost:8080/";
  const results = [];
  function log(step, ok, extra) { results.push({ step, ok, extra: extra || "" }); }

  try {
    // Icons render as real SVGs, not raw emoji/boxes
    await page.goto(base + "index.html", { waitUntil: "networkidle" });
    const headerSvgCount = await page.locator("#site-header svg.icon-svg").count();
    log("Header renders SVG icons (search/cart/menu)", headerSvgCount >= 3, "count=" + headerSvgCount);

    const navLinkTexts = await page.locator(".main-nav a").allTextContents();
    const expectedNav = ["Store", "Mac", "iPad", "iPhone", "Watch", "Vision", "AirPods", "TV & Home", "Entertainment", "Accessories", "Support"];
    log("Main nav shows the correct items in the correct order", JSON.stringify(navLinkTexts) === JSON.stringify(expectedNav), "got=" + JSON.stringify(navLinkTexts));

    const footerSvgCount = await page.locator("#site-footer svg.icon-svg").count();
    log("Footer trust badges render SVG icons", footerSvgCount >= 4, "count=" + footerSvgCount);

    const waSvg = await page.locator("#whatsapp-float svg.icon-svg").count();
    log("WhatsApp float button renders SVG icon", waSvg === 1);

    const logoText = await page.locator(".logo").first().textContent();
    log("Logo text renders correctly (no broken glyph)", logoText.includes("Iswift Gadgets"), "text=" + logoText.trim());

    // Add product to cart, go to checkout, verify demo-mode notice
    await page.waitForSelector("#bestPricesGrid .product-card", { timeout: 5000 });
    await page.locator("#bestPricesGrid .product-card").first().locator("text=Add to Bag").click();
    await page.waitForSelector(".toast.show", { timeout: 3000 });

    await page.goto(base + "cart.html", { waitUntil: "networkidle" });
    await page.locator('a.btn.btn-primary:has-text("Proceed to Checkout")').click();
    await page.waitForURL("**/checkout.html", { timeout: 5000 });

    await page.fill("#fullName", "Rohan Sharma");
    await page.fill("#phone", "9876543210");
    await page.fill("#email", "rohan@example.com");
    await page.locator("#toStep2").click();
    await page.fill("#address", "401, Sunshine Apartments, FC Road");
    await page.fill("#pincode", "411001");
    await page.locator("#toStep3").click();
    await page.waitForTimeout(300);

    const paymentIconCount = await page.locator("#step3 .po-icon svg.icon-svg").count();
    log("Payment method icons render as SVG (not emoji)", paymentIconCount === 4, "count=" + paymentIconCount);

    await page.waitForSelector("#paymentModeNotice", { state: "visible", timeout: 4000 });
    const noticeText = await page.locator("#paymentModeNotice").textContent();
    log("Demo-mode notice shown when backend not running", noticeText.includes("Demo mode"), "text=" + noticeText.trim().slice(0, 80));

    // Select COD -> should succeed immediately without needing backend
    await page.locator('.payment-option[data-method="cod"]').click();
    await page.locator("#placeOrderBtn").click();
    await page.waitForSelector(".success-screen", { timeout: 4000 });
    const successText = await page.locator(".success-screen h1").textContent();
    log("COD order completes successfully in demo mode", successText.includes("Order Placed"));

    const checkIconInSuccess = await page.locator(".success-screen .check-mark svg.icon-svg").count();
    log("Success screen checkmark renders as SVG", checkIconInSuccess === 1);

    // Now test again with UPI selected while backend is down -> should fall back to demo
    await page.evaluate(() => localStorage.setItem("tasp_cart_v1", JSON.stringify([{ lineId: "x::y::z", id: "iphone-17", name: "iPhone 17", image: "images/products/iphone-17-lavender.png", price: 82900, color: "Lavender", storage: "256GB", qty: 1, category: "iphone" }])));
    await page.goto(base + "checkout.html", { waitUntil: "networkidle" });
    await page.fill("#fullName", "Priya Mehta");
    await page.fill("#phone", "9988776655");
    await page.fill("#email", "priya@example.com");
    await page.locator("#toStep2").click();
    await page.fill("#address", "12, MG Road");
    await page.fill("#pincode", "411001");
    await page.locator("#toStep3").click();
    await page.waitForTimeout(300);
    await page.locator("#placeOrderBtn").click();
    await page.waitForSelector(".success-screen", { timeout: 4000 });
    const demoNoteVisible = await page.locator(".success-screen").textContent();
    log("UPI checkout falls back to simulated demo order when backend unavailable", demoNoteVisible.includes("Demo mode"), "");

  } catch (e) {
    log("FATAL", false, e.message);
  }

  console.log("\n===== REGRESSION TEST RESULTS =====");
  let failCount = 0;
  for (const r of results) {
    console.log((r.ok ? "PASS" : "FAIL") + " - " + r.step + (r.extra ? " (" + r.extra + ")" : ""));
    if (!r.ok) failCount++;
  }
  console.log("====================================");
  console.log(failCount === 0 ? "ALL TESTS PASSED" : failCount + " TEST(S) FAILED");

  if (errors.length) {
    console.log("\n===== JS ERRORS =====");
    errors.forEach((e) => console.log(e));
  } else {
    console.log("\nNo JS console errors detected.");
  }

  await browser.close();
  process.exit(failCount > 0 || errors.length > 0 ? 1 : 0);
})();
