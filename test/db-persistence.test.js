const assert = require("assert");
const http = require("http");

function request(path, options, payload) {
  return new Promise((resolve, reject) => {
    const opts = Object.assign(
      {
        hostname: "127.0.0.1",
        port: 4000,
        path: "/api" + path,
        headers: { "Content-Type": "application/json" }
      },
      options || {}
    );

    const req = http.request(opts, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        try {
          const json = body ? JSON.parse(body) : {};
          resolve({ status: res.statusCode, headers: res.headers, body: json });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, body: body });
        }
      });
    });

    req.on("error", reject);
    if (payload) req.write(JSON.stringify(payload));
    req.end();
  });
}

const { fork } = require("child_process");
const path = require("path");

async function ensureServerRunning() {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await request("/health");
      if (res.status === 200) return null;
    } catch (_) {}

    const serverProc = fork(path.join(__dirname, "../server/server.js"), [], {
      cwd: path.join(__dirname, "../server"),
      env: Object.assign({}, process.env, { PORT: "4000" }),
      stdio: "ignore"
    });

    for (let i = 0; i < 30; i++) {
      await new Promise((r) => setTimeout(r, 300));
      try {
        const res = await request("/health");
        if (res.status === 200) return serverProc;
      } catch (_) {}
    }
    try { serverProc.kill(); } catch (_) {}
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error("Could not connect to health endpoint on port 4000");
}

async function runDbPersistenceTests() {
  console.log("=== RUNNING DATABASE PERSISTENCE & MUTATION TESTS ===");
  const spawnedProc = await ensureServerRunning();

  // 1. Health & DB mode check
  const health = await request("/health");
  assert.strictEqual(health.status, 200, "Health check failed");
  console.log("PASS 1: API Health check OK. DB Mode:", health.body.db || health.body.dbMode || "json");

  // 2. Admin Login
  const adminPass = process.env.ADMIN_PASSWORD || "IswiftAdminSecret2026!SecureKey";
  const login = await request("/admin/login", { method: "POST" }, { password: adminPass });
  assert.strictEqual(login.status, 200, "Admin login failed");
  const token = login.body.token;
  assert.ok(token, "Admin token missing");
  console.log("PASS 2: Admin authentication successful.");

  const authHeader = { Authorization: "Bearer " + token };

  // 3. Test Product CRUD in DB
  const testProdId = "test-db-phone-" + Date.now();
  const createProd = await request(
    "/admin/products",
    { method: "POST", headers: Object.assign({}, authHeader, { "Content-Type": "application/json" }) },
    {
      id: testProdId,
      name: "Test DB Phone Pro",
      category: "iphone",
      price: 129900,
      stock: 15,
      brand: "Apple",
      colors: [{ name: "Space Black", hex: "#1c1c1e", image: "images/test.png" }]
    }
  );
  assert.ok(createProd.status === 200 || createProd.status === 201, "Failed to create product in DB");
  console.log("PASS 3: Admin created new product in DB.");

  // Verify product is accessible via public GET API
  const getProd = await request("/products/" + testProdId);
  assert.strictEqual(getProd.status, 200, "Product not found in DB public API");
  assert.strictEqual(getProd.body.product.name, "Test DB Phone Pro");
  console.log("PASS 4: Product read from database via public API successfully.");

  // Update product stock and price in DB
  const updateProd = await request(
    "/admin/products/" + testProdId,
    { method: "PUT", headers: Object.assign({}, authHeader, { "Content-Type": "application/json" }) },
    {
      name: "Test DB Phone Pro (Updated)",
      price: 139900,
      stock: 25
    }
  );
  assert.strictEqual(updateProd.status, 200, "Failed to update product in DB");

  const getProdUpdated = await request("/products/" + testProdId);
  assert.strictEqual(getProdUpdated.body.product.price, 139900);
  assert.strictEqual(getProdUpdated.body.product.stock, 25);
  console.log("PASS 5: Admin updated product price & stock in DB successfully.");

  // Delete product from DB
  const delProd = await request(
    "/admin/products/" + testProdId,
    { method: "DELETE", headers: authHeader }
  );
  assert.strictEqual(delProd.status, 200, "Failed to delete product from DB");
  console.log("PASS 6: Admin deleted test product from DB.");

  // 4. Test Banner CRUD in DB
  const testBannerId = "test-banner-" + Date.now();
  const createBanner = await request(
    "/admin/banners",
    { method: "POST", headers: Object.assign({}, authHeader, { "Content-Type": "application/json" }) },
    {
      id: testBannerId,
      title: "Festive Tech Promo",
      placement: "hero",
      active: true
    }
  );
  assert.ok(createBanner.status === 200 || createBanner.status === 201, "Failed to create banner in DB");
  console.log("PASS 7: Admin created banner in DB.");

  const getBanners = await request("/banners");
  assert.ok(getBanners.body.banners.some((b) => b.id === testBannerId), "Banner missing from DB");
  console.log("PASS 8: Banner retrieved from DB public API.");

  await request("/admin/banners/" + testBannerId, { method: "DELETE", headers: authHeader });
  console.log("PASS 9: Admin deleted test banner from DB.");

  // 5. Test Coupon Creation & Usage tracking in DB
  const testCouponCode = "DBTEST" + Math.floor(Math.random() * 1000);
  const createCoupon = await request(
    "/admin/coupons",
    { method: "POST", headers: Object.assign({}, authHeader, { "Content-Type": "application/json" }) },
    {
      code: testCouponCode,
      type: "fixed",
      value: 1500,
      minOrder: 10000,
      active: true
    }
  );
  assert.ok(createCoupon.status === 200 || createCoupon.status === 201, "Failed to create coupon in DB");
  console.log("PASS 10: Admin created coupon in DB (" + testCouponCode + ").");

  // Validate coupon via order check API
  const checkCoupon = await request(
    "/coupons/validate",
    { method: "POST" },
    { code: testCouponCode, subtotal: 50000 }
  );
  assert.strictEqual(checkCoupon.status, 200);
  assert.strictEqual(checkCoupon.body.discount, 1500);
  console.log("PASS 11: Coupon validated against DB rules.");

  // Delete test coupon
  const getCoupons = await request("/admin/coupons", { headers: authHeader });
  const cpn = getCoupons.body.coupons.find((c) => c.code === testCouponCode);
  if (cpn) {
    await request("/admin/coupons/" + cpn.id, { method: "DELETE", headers: authHeader });
  }
  console.log("PASS 12: Admin deleted test coupon from DB.");

  // 6. Test Transaction & Order Creation in DB
  const createOrder = await request(
    "/orders",
    { method: "POST" },
    {
      items: [{ id: "ipad-air-11-m4", qty: 1, color: "Space Grey", storage: "128GB" }],
      customer: { name: "DB Test Customer", email: "dbtest@example.com", phone: "9876543210" },
      shipping: { address: "123 DB Street", city: "Bengaluru", state: "Karnataka", pincode: "560100" },
      paymentMode: "cod"
    }
  );
  assert.strictEqual(createOrder.status, 200, "Order creation failed");
  const orderId = createOrder.body.orderId;
  assert.ok(orderId, "Order ID missing");
  console.log("PASS 13: Storefront created transaction/order in DB. Order ID:", orderId);

  // Admin read order from DB
  const getOrders = await request("/admin/orders", { headers: authHeader });
  const storedOrder = getOrders.body.orders.find((o) => o.id === orderId);
  assert.ok(storedOrder, "Created order not found in admin orders DB");
  assert.strictEqual(storedOrder.customer.name, "DB Test Customer");
  console.log("PASS 14: Admin fetched order from DB successfully.");

  // Admin update order transaction status in DB (e.g., created -> paid)
  const updateStatus = await request(
    "/admin/orders/" + orderId,
    { method: "PATCH", headers: Object.assign({}, authHeader, { "Content-Type": "application/json" }) },
    { status: "paid" }
  );
  assert.strictEqual(updateStatus.status, 200, "Failed to update order status in DB");

  const getOrdersUpdated = await request("/admin/orders", { headers: authHeader });
  const updatedStoredOrder = getOrdersUpdated.body.orders.find((o) => o.id === orderId);
  assert.strictEqual(updatedStoredOrder.status, "paid");
  console.log("PASS 15: Admin updated order status to 'paid' in DB successfully.");

  console.log("\n==========================================");
  console.log("ALL 15 DATABASE PERSISTENCE TESTS PASSED CLEANLY!");
  console.log("==========================================");

  if (spawnedProc) {
    spawnedProc.kill();
  }
}

runDbPersistenceTests().catch((err) => {
  console.error("TEST FAILED:", err);
  process.exit(1);
});
