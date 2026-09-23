const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
require("dotenv").config({ path: path.join(__dirname, "../.env") });
require("./src/lib/environment").validateEnvironment();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { rateLimit } = require("express-rate-limit");

const { connectMongo, getDbMode } = require("./src/lib/mongo");
const productsStore = require("./src/lib/productsStore");
const couponsStore = require("./src/lib/couponsStore");
const settingsStore = require("./src/lib/settingsStore");
const bannersStore = require("./src/lib/bannersStore");
const uploadsStore = require("./src/lib/uploadsStore");

const productsRoute = require("./src/routes/products");
const ordersRoute = require("./src/routes/orders");
const paymentsRoute = require("./src/routes/payments");
const couponsRoute = require("./src/routes/coupons");
const bannersRoute = require("./src/routes/banners");
const adminRoute = require("./src/routes/admin");

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", 1);
// Existing pages use inline scripts and third-party product/payment resources.
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
const PORT = process.env.PORT || 4000;
const allowedOrigins = (process.env.CORS_ORIGIN || "").split(",").map(function (s) { return s.trim(); }).filter(Boolean);

app.use(cors({ origin: allowedOrigins.length === 0 || allowedOrigins.includes("*") ? true : allowedOrigins }));
app.use("/api", function (req, res, next) {
  res.set("Cache-Control", "no-store");
  next();
});
app.use("/api/admin/login", rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: "draft-8", legacyHeaders: false }));
app.use("/api/orders", rateLimit({ windowMs: 60 * 1000, limit: 30, standardHeaders: "draft-8", legacyHeaders: false }));

app.use("/api/payments/webhook", express.raw({ type: "application/json" }));
app.use(express.json({ limit: "10mb" }));

app.get("/api/health", function (req, res) {
  const mongoose = require("./src/lib/mongo").mongoose;
  const dbMode = getDbMode();
  if (dbMode === "mongo" && mongoose.connection.readyState !== 1) {
    return res.status(503).json({ ok: false, db: dbMode });
  }
  res.json({
    ok: true,
    service: "iswift-gadgets-api",
    db: dbMode,
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
app.use("/api/banners", bannersRoute);
app.use("/api/admin", adminRoute);

const fs = require("fs");
const clientDir = path.join(__dirname, "../client");
const uploadsDir = process.env.UPLOAD_DIR || path.join(clientDir, "images/uploads");
uploadsStore.ensureUploadsDir();

app.use("/images/uploads", async function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");

  const filename = path.basename(req.path);
  if (!filename || filename === "/" || filename === ".") {
    return next();
  }

  const filePath = path.join(uploadsDir, filename);
  if (fs.existsSync(filePath)) {
    return res.sendFile(filePath);
  }

  try {
    const item = await uploadsStore.getUpload(filename);
    if (item && item.buffer) {
      res.contentType(item.contentType || "image/png");
      return res.send(item.buffer);
    }
  } catch (err) {
    console.error("Error retrieving upload:", err);
  }

  return res.status(404).json({ error: "Image not found" });
});
app.use("/admin", express.static(path.join(clientDir, "admin")));
app.use(express.static(clientDir));

app.use(function (req, res) {
  res.status(404).json({ error: "Not found" });
});

// eslint-disable-next-line no-unused-vars
app.use(function (err, req, res, next) {
  console.error(err);
  const status = err.status >= 400 && err.status < 600 ? err.status : 500;
  res.status(status).json({ error: status === 500 ? "Internal server error" : "Invalid request" });
});

async function start() {
  await connectMongo();
  await productsStore.seedIfNeeded();
  await couponsStore.seedIfNeeded();
  await bannersStore.seedIfNeeded();
  await settingsStore.get();

  const server = app.listen(PORT, "0.0.0.0", function () {
    console.log("Iswift Gadgets API running on http://localhost:" + PORT);
    console.log("Storefront:     http://localhost:" + PORT + "/");
    console.log("Control panel:  http://localhost:" + PORT + "/admin/");
    console.log("Health check:   http://localhost:" + PORT + "/api/health");
    console.log("Database:       " + getDbMode());
    console.log("Admin password: configured through environment");
  });

  function shutdown() {
    server.close(async function () {
      await require("./src/lib/mongo").mongoose.disconnect();
      process.exit(0);
    });
    setTimeout(function () { process.exit(1); }, 10000).unref();
  }
  process.once("SIGTERM", shutdown);
  process.once("SIGINT", shutdown);

  server.on("error", function (err) {
    if (err.code === "EADDRINUSE") {
      console.error("\n[server error] Port " + PORT + " is already in use by another running server instance.");
      console.error("Please stop the existing process listening on port " + PORT + " or set a different PORT in server/.env.\n");
      process.exit(1);
    }
  });
}

start().catch(function (err) {
  console.error("[boot] Failed to start server:", err.message);
  process.exit(1);
});
