const express = require("express");
const store = require("../lib/store");
const productsStore = require("../lib/productsStore");
const couponsStore = require("../lib/couponsStore");
const settingsStore = require("../lib/settingsStore");
const { login, logout, requireAdmin } = require("../lib/adminAuth");

const router = express.Router();

/* ---------- Auth ---------- */

router.post("/login", function (req, res) {
  const result = login(req.body && req.body.password);
  if (!result.ok) return res.status(401).json({ error: result.error });
  res.json({ token: result.token, expiresAt: result.expiresAt });
});

router.post("/logout", requireAdmin, function (req, res) {
  logout(req.adminToken);
  res.json({ ok: true });
});

router.get("/me", requireAdmin, function (req, res) {
  res.json({ ok: true });
});

/* ---------- Dashboard ---------- */

router.get("/stats", requireAdmin, function (req, res) {
  const orders = store.readAll();
  const products = productsStore.getProducts();
  const coupons = couponsStore.getAll();
  const paid = orders.filter(function (o) { return o.status === "paid"; });
  const revenue = paid.reduce(function (sum, o) { return sum + (Number(o.total) || 0); }, 0);
  res.json({
    products: products.length,
    coupons: coupons.length,
    activeCoupons: coupons.filter(function (c) { return c.active; }).length,
    orders: orders.length,
    paidOrders: paid.length,
    revenue: revenue,
    lowStock: products.filter(function (p) { return Number(p.stock) > 0 && Number(p.stock) <= 5; }).length,
    recentOrders: orders.slice().sort(function (a, b) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }).slice(0, 8)
  });
});

/* ---------- Products ---------- */

router.get("/products", requireAdmin, function (req, res) {
  res.json(productsStore.getAll());
});

router.post("/products", requireAdmin, function (req, res) {
  try {
    const body = req.body || {};
    const name = String(body.name || "").trim();
    if (!name) return res.status(400).json({ error: "Product name is required." });
    const price = Number(body.price);
    if (!Number.isFinite(price) || price < 0) return res.status(400).json({ error: "Valid price is required." });

    const id = body.id ? String(body.id).trim() : productsStore.uniqueId(name);
    if (productsStore.getById(id)) return res.status(400).json({ error: "Product id already exists." });

    const product = normalizeProduct(Object.assign({}, body, { id: id, name: name, price: price }));
    productsStore.upsert(product);
    res.status(201).json({ product: product });
  } catch (err) {
    res.status(400).json({ error: err.message || "Could not create product." });
  }
});

router.put("/products/:id", requireAdmin, function (req, res) {
  try {
    const existing = productsStore.getById(req.params.id);
    if (!existing) return res.status(404).json({ error: "Product not found." });
    const product = normalizeProduct(Object.assign({}, existing, req.body || {}, { id: existing.id }));
    productsStore.upsert(product);
    res.json({ product: product });
  } catch (err) {
    res.status(400).json({ error: err.message || "Could not update product." });
  }
});

router.delete("/products/:id", requireAdmin, function (req, res) {
  const result = productsStore.remove(req.params.id);
  if (!result) return res.status(404).json({ error: "Product not found." });
  res.json({ ok: true });
});

function normalizeProduct(input) {
  const price = Number(input.price);
  const mrp = input.mrp != null && input.mrp !== "" ? Number(input.mrp) : price;
  if (!Number.isFinite(price) || price < 0) throw new Error("Valid price is required.");
  return {
    id: String(input.id),
    name: String(input.name || "").trim(),
    category: String(input.category || "accessories"),
    brand: String(input.brand || "Apple"),
    price: price,
    mrp: Number.isFinite(mrp) ? mrp : price,
    badge: input.badge || null,
    rating: Number(input.rating) || 4.5,
    reviews: Number(input.reviews) || 0,
    stock: Number(input.stock) || 0,
    images: Array.isArray(input.images) ? input.images.filter(Boolean) : (input.image ? [input.image] : []),
    colors: Array.isArray(input.colors) ? input.colors : [],
    storageOptions: Array.isArray(input.storageOptions) ? input.storageOptions : [],
    short: String(input.short || "").trim(),
    description: String(input.description || "").trim(),
    specs: input.specs && typeof input.specs === "object" ? input.specs : {}
  };
}

/* ---------- Coupons ---------- */

router.get("/coupons", requireAdmin, function (req, res) {
  res.json({ coupons: couponsStore.getAll() });
});

router.post("/coupons", requireAdmin, function (req, res) {
  try {
    const coupon = couponsStore.create(req.body || {});
    res.status(201).json({ coupon: coupon });
  } catch (err) {
    res.status(400).json({ error: err.message || "Could not create coupon." });
  }
});

router.put("/coupons/:id", requireAdmin, function (req, res) {
  try {
    const coupon = couponsStore.update(req.params.id, req.body || {});
    if (!coupon) return res.status(404).json({ error: "Coupon not found." });
    res.json({ coupon: coupon });
  } catch (err) {
    res.status(400).json({ error: err.message || "Could not update coupon." });
  }
});

router.delete("/coupons/:id", requireAdmin, function (req, res) {
  const ok = couponsStore.remove(req.params.id);
  if (!ok) return res.status(404).json({ error: "Coupon not found." });
  res.json({ ok: true });
});

/* ---------- Orders ---------- */

router.get("/orders", requireAdmin, function (req, res) {
  const orders = store.readAll().slice().sort(function (a, b) {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
  res.json({ orders: orders });
});

router.get("/orders/:id", requireAdmin, function (req, res) {
  const order = store.getOrder(req.params.id);
  if (!order) return res.status(404).json({ error: "Order not found." });
  res.json({ order: order });
});

router.patch("/orders/:id", requireAdmin, function (req, res) {
  const allowed = ["created", "paid", "failed", "refunded", "shipped", "delivered", "cancelled"];
  const status = req.body && req.body.status;
  if (!allowed.includes(status)) {
    return res.status(400).json({ error: "Invalid status. Allowed: " + allowed.join(", ") });
  }
  const order = store.updateOrder(req.params.id, { status: status });
  if (!order) return res.status(404).json({ error: "Order not found." });
  res.json({ order: order });
});

/* ---------- Settings ---------- */

router.get("/settings", requireAdmin, function (req, res) {
  res.json({ settings: settingsStore.get() });
});

router.put("/settings", requireAdmin, function (req, res) {
  const settings = settingsStore.update(req.body || {});
  res.json({ settings: settings });
});

module.exports = router;
