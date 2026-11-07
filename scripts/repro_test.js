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
  page.on("pageerror", (err) => console.log("[pageerror] " + err.message));
  page.on("console", (msg) => console.log("[console] " + msg.type() + ": " + msg.text()));
  page.on("dialog", d => {
    console.log("[dialog]", d.message());
    d.accept();
  });

  const base = "http://127.0.0.1:4000/";

  await page.goto(base + "index.html", { waitUntil: "domcontentloaded" });
  const productsToggle = page.locator("#productsMenuToggle");
  await productsToggle.click();

  console.log("Navigating to product.html?id=iphone-duo");
  await page.goto(base + "product.html?id=iphone-duo", { waitUntil: "domcontentloaded" });
  await page.waitForSelector("#buyNowBtn", { timeout: 5000 });
  await page.waitForTimeout(500);

  console.log("Clicking #buyNowBtn...");
  await page.locator("#buyNowBtn").click();
  console.log("Clicked! Current URL is:", page.url());

  try {
    await page.waitForURL("**/checkout.html", { timeout: 5000 });
    console.log("waitForURL succeeded! Current URL:", page.url());
  } catch (e) {
    console.log("waitForURL failed!", e.message);
    console.log("Current URL after failure:", page.url());
  }

  await browser.close();
  if (serverProc) serverProc.kill();
})();
