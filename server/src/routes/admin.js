const express = require("express");
const store = require("../lib/store");
const productsStore = require("../lib/productsStore");
const couponsStore = require("../lib/couponsStore");
const settingsStore = require("../lib/settingsStore");
const { login, logout, requireAdmin } = require("../lib/adminAuth");

const router = express.Router();

/* ---------- Auth ---------- */

router.post("/login", async function (req, res, next) {
  try {
    const result = await login(req.body && req.body.password);
    if (!result.ok) return res.status(401).json({ error: result.error });
    res.json({ token: result.token, expiresAt: result.expiresAt });
  } catch (err) {
    next(err);
  }
});

router.post("/logout", requireAdmin, async function (req, res, next) {
  try {
    await logout(req.adminToken);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

router.get("/me", requireAdmin, function (req, res) {
  res.json({ ok: true });
});

/* ---------- Dashboard ---------- */

router.get("/stats", requireAdmin, async function (req, res, next) {
  try {
    const orders = await store.readAll();
    const products = await productsStore.getProducts();
    const coupons = await couponsStore.getAll();
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
  } catch (err) {
    next(err);
  }
});

/* ---------- Products ---------- */

router.get("/products", requireAdmin, async function (req, res, next) {
  try {
    res.json(await productsStore.getAll());
  } catch (err) {
    next(err);
  }
});

router.post("/products", requireAdmin, async function (req, res, next) {
  try {
    const body = req.body || {};
    const name = String(body.name || "").trim();
    if (!name) return res.status(400).json({ error: "Product name is required." });
    const price = Number(body.price);
    if (!Number.isFinite(price) || price < 0) return res.status(400).json({ error: "Valid price is required." });

    const id = body.id ? String(body.id).trim() : await productsStore.uniqueId(name);
    if (await productsStore.getById(id)) return res.status(400).json({ error: "Product id already exists." });

    const product = normalizeProduct(Object.assign({}, body, { id: id, name: name, price: price }));
    await productsStore.upsert(product);
    res.status(201).json({ product: product });
  } catch (err) {
    res.status(400).json({ error: err.message || "Could not create product." });
  }
});

router.put("/products/:id", requireAdmin, async function (req, res, next) {
  try {
    const existing = await productsStore.getById(req.params.id);
    if (!existing) return res.status(404).json({ error: "Product not found." });
    const product = normalizeProduct(Object.assign({}, existing, req.body || {}, { id: existing.id }));
    await productsStore.upsert(product);
    res.json({ product: product });
  } catch (err) {
    res.status(400).json({ error: err.message || "Could not update product." });
  }
});

router.delete("/products/:id", requireAdmin, async function (req, res, next) {
  try {
    const result = await productsStore.remove(req.params.id);
    if (!result) return res.status(404).json({ error: "Product not found." });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
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

router.get("/coupons", requireAdmin, async function (req, res, next) {
  try {
    res.json({ coupons: await couponsStore.getAll() });
  } catch (err) {
    next(err);
  }
});

router.post("/coupons", requireAdmin, async function (req, res) {
  try {
    const coupon = await couponsStore.create(req.body || {});
    res.status(201).json({ coupon: coupon });
  } catch (err) {
    res.status(400).json({ error: err.message || "Could not create coupon." });
  }
});

router.put("/coupons/:id", requireAdmin, async function (req, res) {
  try {
    const coupon = await couponsStore.update(req.params.id, req.body || {});
    if (!coupon) return res.status(404).json({ error: "Coupon not found." });
    res.json({ coupon: coupon });
  } catch (err) {
    res.status(400).json({ error: err.message || "Could not update coupon." });
  }
});

router.delete("/coupons/:id", requireAdmin, async function (req, res, next) {
  try {
    const ok = await couponsStore.remove(req.params.id);
    if (!ok) return res.status(404).json({ error: "Coupon not found." });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

/* ---------- Orders ---------- */

router.get("/orders", requireAdmin, async function (req, res, next) {
  try {
    const orders = (await store.readAll()).slice().sort(function (a, b) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    res.json({ orders: orders });
  } catch (err) {
    next(err);
  }
});

router.get("/orders/:id", requireAdmin, async function (req, res, next) {
  try {
    const order = await store.getOrder(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found." });
    res.json({ order: order });
  } catch (err) {
    next(err);
  }
});

router.patch("/orders/:id", requireAdmin, async function (req, res, next) {
  try {
    const allowed = ["created", "paid", "failed", "refunded", "shipped", "delivered", "cancelled"];
    const status = req.body && req.body.status;
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: "Invalid status. Allowed: " + allowed.join(", ") });
    }
    const order = await store.updateOrder(req.params.id, { status: status });
    if (!order) return res.status(404).json({ error: "Order not found." });
    res.json({ order: order });
  } catch (err) {
    next(err);
  }
});

/* ---------- Settings ---------- */

router.get("/settings", requireAdmin, async function (req, res, next) {
  try {
    res.json({ settings: await settingsStore.get() });
  } catch (err) {
    next(err);
  }
});

router.put("/settings", requireAdmin, async function (req, res, next) {
  try {
    const settings = await settingsStore.update(req.body || {});
    res.json({ settings: settings });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
