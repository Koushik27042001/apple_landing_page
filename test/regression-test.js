const { chromium } = require("playwright");

const { fork } = require("child_process");
const http = require("http");
const path = require("path");

async function ensureServerRunning() {
  const check = () => new Promise((resolve) => {
    const req = http.get("http://127.0.0.1:4000/api/health", (res) => resolve(res.statusCode === 200));
    req.on("error", () => resolve(false));
    req.end();
  });
  if (await check()) return null;
  const proc = fork(path.join(__dirname, "../server/server.js"), [], {
    cwd: path.join(__dirname, "../server"),
    env: Object.assign({}, process.env, { PORT: "4000" }),
    stdio: "ignore"
  });
  for (let i = 0; i < 75; i++) {
    await new Promise((r) => setTimeout(r, 200));
    if (await check()) return proc;
  }
  return proc;
}

(async () => {
  const serverProc = await ensureServerRunning();
  const launchOpts = process.platform === "win32" ? { channel: "msedge" } : {};
  let browser;
  try {
    browser = await chromium.launch(launchOpts);
  } catch (_) {
    browser = await chromium.launch();
  }
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  const errors = [];
  page.on("pageerror", (err) => errors.push("[pageerror] " + err.message));
  page.on("console", (msg) => { if (msg.type() === "error") errors.push("[console] " + msg.text()); });

  const base = process.env.TEST_BASE_URL || "http://127.0.0.1:4000/";
  const results = [];
  function log(step, ok, extra) { results.push({ step, ok, extra: extra || "" }); }

  try {
    // Icons render as real SVGs, not raw emoji/boxes
    await page.goto(base + "index.html", { waitUntil: "domcontentloaded" });
    const headerSvgCount = await page.locator("#site-header svg.icon-svg").count();
    log("Header renders SVG icons (search/menu)", headerSvgCount >= 2, "count=" + headerSvgCount);

    const navLinkTexts = await page.locator(".main-nav > a").allTextContents();
    log("Main nav Level 1 links loaded", navLinkTexts.includes("Home") && navLinkTexts.includes("Contact Us"), "got=" + JSON.stringify(navLinkTexts));
    const productsToggle = page.locator("#productsMenuToggle");
    const cascadeCategories = await page.locator(".cascade-cat-item").allTextContents();
    log("Products dropdown contains the requested categories", cascadeCategories.some(c => c.includes("iPhone")) && cascadeCategories.some(c => c.includes("Mac")), "got=" + JSON.stringify(cascadeCategories));
    await productsToggle.click();
    log("Products dropdown opens accessibly", await productsToggle.getAttribute("aria-expanded") === "true" && await page.locator("#productsSubmenu").isVisible());

    const footerSvgCount = await page.locator("#site-footer svg.icon-svg").count();
    log("Footer trust badges render SVG icons", footerSvgCount >= 4, "count=" + footerSvgCount);

    const waSvg = await page.locator("#whatsapp-float svg.icon-svg").count();
    log("WhatsApp float button renders SVG icon", waSvg === 1);

    const logoText = await page.locator(".logo").first().textContent();
    log("Logo shows Iswift and Business Partner", logoText.includes("Iswift") && logoText.includes("Business") && logoText.includes("Partner"), "text=" + logoText.trim());

    await page.goto(base + "product.html?id=iphone-17", { waitUntil: "domcontentloaded" });
    await page.locator("#addToCartBtn").click();
    await page.goto(base + "product.html?id=iphone-17e", { waitUntil: "domcontentloaded" });
    await page.locator("#buyNowBtn").click();
    await page.waitForURL("**/checkout.html?buy=1");
    await page.locator("#checkoutItems .checkout-line").waitFor();
    log("Buy Now checks out the selected product", await page.locator("#checkoutItems .checkout-line").count() === 1 &&
      (await page.locator("#checkoutItems").textContent()).includes("iPhone 17e"));
    const contact = { name: "Rohan Sharma", phone: "9876543210", email: "rohan@example.com" };
    const shipping = { address: "401, Sunshine Apartments, FC Road", city: "Pune", state: "Maharashtra", pincode: "411001" };
    for (const [field, value] of Object.entries({ ...contact, ...shipping })) {
      await page.locator('[name="' + field + '"]').fill(value);
    }
    await page.getByRole("radio", { name: /Cash on delivery/ }).check();
    await page.locator("#placeOrder").click();
    await page.getByRole("heading", { name: "Order placed" }).waitFor();
    log("Cash on delivery saves the order", await page.getByText("Due on delivery").isVisible());
    const orderLink = await page.getByRole("link", { name: "View order details" }).getAttribute("href");
    await page.goto(new URL(orderLink, base).href);
    await page.getByText("Pending dispatch").waitFor();
    log("Shipment status is available after checkout", await page.getByText("Pending dispatch").isVisible());
    log("Direct checkout keeps the bag intact", await page.evaluate(() => getCart().some(item => item.id === "iphone-17")));

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
  if (serverProc) serverProc.kill();
  process.exit(failCount > 0 || errors.length > 0 ? 1 : 0);
})();
