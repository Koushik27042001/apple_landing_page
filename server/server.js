require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");

const productsRoute = require("./src/routes/products");
const ordersRoute = require("./src/routes/orders");
const paymentsRoute = require("./src/routes/payments");
const couponsRoute = require("./src/routes/coupons");
const adminRoute = require("./src/routes/admin");
const settingsStore = require("./src/lib/settingsStore");

const app = express();
const PORT = process.env.PORT || 4000;
const allowedOrigins = (process.env.CORS_ORIGIN || "*").split(",").map(function (s) { return s.trim(); });

app.use(cors({ origin: allowedOrigins.includes("*") ? true : allowedOrigins }));

// The Razorpay webhook needs the raw (unparsed) body to verify its
// signature, so it MUST be mounted before the global express.json().
app.use("/api/payments/webhook", express.raw({ type: "application/json" }));

app.use(express.json({ limit: "2mb" }));

app.get("/api/health", function (req, res) {
  res.json({ ok: true, service: "iswift-gadgets-api", time: new Date().toISOString() });
});

app.get("/api/settings/public", function (req, res) {
  const s = settingsStore.get();
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
});

app.use("/api/products", productsRoute);
app.use("/api/orders", ordersRoute);
app.use("/api/payments", paymentsRoute);
app.use("/api/coupons", couponsRoute);
app.use("/api/admin", adminRoute);

/* Serve admin control panel + static storefront from the project root
   so one server can run everything locally / in production. */
const rootDir = path.join(__dirname, "..");
app.use("/admin", express.static(path.join(rootDir, "admin")));
app.use(express.static(rootDir));

app.use(function (req, res) {
  res.status(404).json({ error: "Not found" });
});

// eslint-disable-next-line no-unused-vars
app.use(function (err, req, res, next) {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, function () {
  console.log("Iswift Gadgets API running on http://localhost:" + PORT);
  console.log("Storefront:     http://localhost:" + PORT + "/");
  console.log("Control panel:  http://localhost:" + PORT + "/admin/");
  console.log("Health check:   http://localhost:" + PORT + "/api/health");
  console.log("Admin password: " + (process.env.ADMIN_PASSWORD ? "(from .env ADMIN_PASSWORD)" : "admin123 (default — change in .env)"));
});
