const fs = require("fs");
const path = require("path");

const base = "http://localhost:4000";
const results = [];

function log(step, ok, extra) {
  results.push({ step, ok });
  console.log((ok ? "PASS" : "FAIL") + " - " + step + (extra ? " (" + extra + ")" : ""));
}

(async () => {
  try {
    const root = path.join(__dirname, "..");
    log("client/ folder exists", fs.existsSync(path.join(root, "client", "index.html")));
    log("server/ folder exists", fs.existsSync(path.join(root, "server", "server.js")));
    log("No leftover root index.html", !fs.existsSync(path.join(root, "index.html")));

    let catalogOk = false;
    try {
      const store = require("../server/src/lib/productsStore");
      catalogOk = store.getProducts().length >= 40;
    } catch (e) {
      console.log("catalog error:", e.message);
    }
    log("Catalog seed path resolvable", catalogOk);

    const health = await fetch(base + "/api/health").then(function (r) { return r.json(); }).catch(function () { return null; });
    log("API health", !!(health && health.ok), health && health.service);

    const pages = [
      "/",
      "/index.html",
      "/category.html?cat=ipad",
      "/product.html?id=ipad-air-11-m4",
      "/cart.html",
      "/checkout.html",
      "/about.html",
      "/contact.html",
      "/support.html",
      "/entertainment.html",
      "/admin/"
    ];
    for (const p of pages) {
      const r = await fetch(base + p);
      const t = await r.text();
      const ok = r.status === 200 && t.length > 200 && t.indexOf('"error":"Not found"') === -1;
      log("Serve " + p, ok, "status=" + r.status + " bytes=" + t.length);
    }

    const assets = [
      "/css/style.css",
      "/js/data.js",
      "/js/main.js",
      "/js/config.js",
      "/js/catalog-sync.js",
      "/admin/css/admin.css",
      "/admin/js/admin.js"
    ];
    for (const a of assets) {
      const r = await fetch(base + a);
      log("Asset " + a, r.status === 200, "status=" + r.status);
    }

    const products = await fetch(base + "/api/products").then(function (r) { return r.json(); });
    log("GET /api/products", Array.isArray(products.products) && products.products.length >= 40, "count=" + (products.products || []).length);

    const oneRes = await fetch(base + "/api/products/ipad-air-11-m4");
    const one = await oneRes.json();
    log("GET /api/products/:id", oneRes.status === 200 && one.product && one.product.id === "ipad-air-11-m4", one.product && one.product.name);

    const settings = await fetch(base + "/api/settings/public").then(function (r) { return r.json(); });
    log("GET /api/settings/public", !!(settings.email && settings.email.indexOf("@") !== -1), settings.email);

    const couponRes = await fetch(base + "/api/coupons/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: "WELCOME10", subtotal: 20000 })
    });
    const coupon = await couponRes.json();
    log("Coupon WELCOME10 validate", couponRes.status === 200 && coupon.discount === 2000, "discount=" + coupon.discount);

    const bad = await fetch(base + "/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: "nope" })
    });
    log("Admin rejects bad password", bad.status === 401);

    const login = await fetch(base + "/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: "admin123" })
    }).then(function (r) { return r.json(); });
    log("Admin login", !!login.token);

    const h = { Authorization: "Bearer " + login.token, "Content-Type": "application/json" };
    const me = await fetch(base + "/api/admin/me", { headers: h });
    log("Admin /me", me.status === 200);

    const stats = await fetch(base + "/api/admin/stats", { headers: h }).then(function (r) { return r.json(); });
    log("Admin stats", stats.products > 0, "products=" + stats.products + " coupons=" + stats.coupons);

    const createdRes = await fetch(base + "/api/admin/products", {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        name: "Conn Test Item",
        category: "accessories",
        price: 999,
        stock: 3,
        short: "connectivity test",
        image: "images/products/usb-c-cable.png"
      })
    });
    const created = await createdRes.json();
    log("Admin create product", createdRes.status === 201 && created.product, created.product && created.product.id);

    const pubHas = await fetch(base + "/api/products").then(function (r) { return r.json(); });
    log(
      "Public catalog includes new product",
      (pubHas.products || []).some(function (p) { return p.id === created.product.id; })
    );

    const del = await fetch(base + "/api/admin/products/" + encodeURIComponent(created.product.id), {
      method: "DELETE",
      headers: h
    });
    log("Admin delete product", del.status === 200);

    const orders = await fetch(base + "/api/admin/orders", { headers: h }).then(function (r) { return r.json(); });
    log("Admin list orders", Array.isArray(orders.orders));

    const adminSettings = await fetch(base + "/api/admin/settings", { headers: h }).then(function (r) { return r.json(); });
    log("Admin settings load", !!(adminSettings.settings && adminSettings.settings.storeName));

    const pdp = await fetch(base + "/product.html?id=ipad-air-11-m4").then(function (r) { return r.text(); });
    log("PDP has details-below layout code", pdp.indexOf("pdp-details") !== -1 && pdp.indexOf("pdp-details-grid") !== -1);

    const config = await fetch(base + "/js/config.js").then(function (r) { return r.text(); });
    log(
      "Client config has API base",
      config.indexOf("APPLE_STORE_API_BASE") !== -1 &&
        (config.indexOf("4000") !== -1 || config.indexOf("/api") !== -1)
    );
  } catch (e) {
    log("FATAL", false, e.message);
  }

  const failed = results.filter(function (r) { return !r.ok; }).length;
  console.log("====================================");
  console.log(failed === 0 ? "ALL CHECKS PASSED (" + results.length + ")" : failed + " FAILED / " + results.length);
  process.exit(failed ? 1 : 0);
})();
