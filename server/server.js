require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");

const { connectMongo, getDbMode } = require("./src/lib/mongo");
const productsStore = require("./src/lib/productsStore");
const couponsStore = require("./src/lib/couponsStore");
const settingsStore = require("./src/lib/settingsStore");

const productsRoute = require("./src/routes/products");
const ordersRoute = require("./src/routes/orders");
const paymentsRoute = require("./src/routes/payments");
const couponsRoute = require("./src/routes/coupons");
const adminRoute = require("./src/routes/admin");

const app = express();
const PORT = process.env.PORT || 4000;
const allowedOrigins = (process.env.CORS_ORIGIN || "*").split(",").map(function (s) { return s.trim(); });

app.use(cors({ origin: allowedOrigins.includes("*") ? true : allowedOrigins }));

app.use("/api/payments/webhook", express.raw({ type: "application/json" }));
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", function (req, res) {
  res.json({
    ok: true,
    service: "iswift-gadgets-api",
    db: getDbMode(),
    time: new Date().toISOString()
  });
});

app.get("/api/settings/public", async function (req, res, next) {
  try {
    const s = await settingsStore.get();
    res.json({
      storeName: s.storeName,
      email: s.email,
      phones: s.phones,
      whatsapp: s.whatsapp,
      address: s.address,
      mapLink: s.mapLink,
      shippingFee: s.shippingFee,
      shippingThreshold: s.shippingThreshold,
      announcement: s.announcement
    });
  } catch (err) {
    next(err);
  }
});

app.use("/api/products", productsRoute);
app.use("/api/orders", ordersRoute);
app.use("/api/payments", paymentsRoute);
app.use("/api/coupons", couponsRoute);
app.use("/api/admin", adminRoute);

const clientDir = path.join(__dirname, "../client");
app.use("/admin", express.static(path.join(clientDir, "admin")));
app.use(express.static(clientDir));

app.use(function (req, res) {
  res.status(404).json({ error: "Not found" });
});

// eslint-disable-next-line no-unused-vars
app.use(function (err, req, res, next) {
  console.error(err);
  res.status(500).json({ error: err.message || "Internal server error" });
});

async function start() {
  await connectMongo();
  await productsStore.seedIfNeeded();
  await couponsStore.seedIfNeeded();
  await settingsStore.get();

  app.listen(PORT, function () {
    console.log("Iswift Gadgets API running on http://localhost:" + PORT);
    console.log("Storefront:     http://localhost:" + PORT + "/");
    console.log("Control panel:  http://localhost:" + PORT + "/admin/");
    console.log("Health check:   http://localhost:" + PORT + "/api/health");
    console.log("Database:       " + getDbMode());
    console.log("Admin password: " + (process.env.ADMIN_PASSWORD ? "(from .env ADMIN_PASSWORD)" : "admin123 (default — change in .env)"));
  });
}

start().catch(function (err) {
  console.error("[boot] Failed to start server:", err.message);
  process.exit(1);
});
