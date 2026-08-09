require("dotenv").config();
const express = require("express");
const cors = require("cors");

const productsRoute = require("./src/routes/products");
const ordersRoute = require("./src/routes/orders");
const paymentsRoute = require("./src/routes/payments");

const app = express();
const PORT = process.env.PORT || 4000;
const allowedOrigins = (process.env.CORS_ORIGIN || "*").split(",").map(function (s) { return s.trim(); });

app.use(cors({ origin: allowedOrigins.includes("*") ? true : allowedOrigins }));

// The Razorpay webhook needs the raw (unparsed) body to verify its
// signature, so it MUST be mounted before the global express.json().
app.use("/api/payments/webhook", express.raw({ type: "application/json" }));

app.use(express.json());

app.get("/api/health", function (req, res) {
  res.json({ ok: true, service: "apple-store-pune-api", time: new Date().toISOString() });
});

app.use("/api/products", productsRoute);
app.use("/api/orders", ordersRoute);
app.use("/api/payments", paymentsRoute);

app.use(function (req, res) {
  res.status(404).json({ error: "Not found" });
});

// eslint-disable-next-line no-unused-vars
app.use(function (err, req, res, next) {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, function () {
  console.log("The Apple Store Pune API running on http://localhost:" + PORT);
  console.log("Health check: http://localhost:" + PORT + "/api/health");
});
