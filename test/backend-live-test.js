const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  const base = "http://localhost:8080/";
  const results = [];
  function log(step, ok, extra) { results.push({ step, ok, extra: extra || "" }); }

  try {
    await page.goto(base + "cart.html", { waitUntil: "networkidle" });
    await page.evaluate(() => localStorage.setItem("tasp_cart_v1", JSON.stringify([{ lineId: "x::y::z", id: "iphone-14", name: "iPhone 14", image: "images/products/iphone-14-blue.png", price: 55900, color: "Blue", storage: "128GB", qty: 1, category: "iphone" }])));
    await page.goto(base + "checkout.html", { waitUntil: "networkidle" });
    await page.fill("#fullName", "Priya Mehta");
    await page.fill("#phone", "9988776655");
    await page.fill("#email", "priya@example.com");
    await page.locator("#toStep2").click();
    await page.fill("#address", "12, MG Road");
    await page.fill("#pincode", "411001");
    await page.locator("#toStep3").click();
    await page.waitForSelector("#paymentModeNotice", { state: "visible", timeout: 4000 });
    const noticeText = await page.locator("#paymentModeNotice").textContent();
    log("Notice shows 'Live payment gateway connected' when backend is up", noticeText.includes("Live payment gateway connected"), noticeText.trim());

    await page.locator("#placeOrderBtn").click();
    await page.waitForSelector(".toast.show", { timeout: 5000 });
    const toastText = await page.locator(".toast.show").textContent();
    log("Attempting real payment with unconfigured gateway shows a clear error toast (not a fake success)", toastText.toLowerCase().includes("payment gateway is not configured"), toastText.trim());

    const btnText = await page.locator("#placeOrderBtn").textContent();
    log("Place Order button re-enabled after error", btnText.trim() === "Place Order");

    const successVisible = await page.locator(".success-screen").count();
    log("No fake success screen shown when gateway misconfigured", successVisible === 0);
  } catch (e) {
    log("FATAL", false, e.message);
  }

  console.log("\n===== BACKEND-LIVE TEST RESULTS =====");
  let failCount = 0;
  for (const r of results) {
    console.log((r.ok ? "PASS" : "FAIL") + " - " + r.step + (r.extra ? " (" + r.extra + ")" : ""));
    if (!r.ok) failCount++;
  }
  console.log(failCount === 0 ? "ALL TESTS PASSED" : failCount + " TEST(S) FAILED");
  await browser.close();
  process.exit(failCount > 0 ? 1 : 0);
})();
