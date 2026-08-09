const express = require("express");
const { nanoid } = require("nanoid");
const { priceCart } = require("../lib/catalog");
const { razorpay, keyId } = require("../lib/razorpay");
const store = require("../lib/store");

const router = express.Router();

function isValidEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v || ""); }
function isValidPhone(v) { return /^[6-9]\d{9}$/.test(v || ""); }
function isValidPincode(v) { return /^\d{6}$/.test(v || ""); }

// POST /api/orders — validates the cart, recomputes the price
// server-side, creates a Razorpay order, and stores a "created"
// order record awaiting payment confirmation.
router.post("/", async function (req, res) {
  try {
    const { items, customer, shipping } = req.body || {};

    if (!customer || !isValidEmail(customer.email) || !isValidPhone(customer.phone) || !customer.name || customer.name.trim().length < 3) {
      return res.status(400).json({ error: "Please provide a valid name, 10-digit phone number and email address." });
    }
    if (!shipping || !shipping.address || !shipping.city || !shipping.state || !isValidPincode(shipping.pincode)) {
      return res.status(400).json({ error: "Please provide a complete shipping address with a valid 6-digit pincode." });
    }

    const pricing = priceCart(items);

    if (!razorpay) {
      return res.status(503).json({
        error: "Payment gateway is not configured yet. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to server/.env (see server/.env.example) and restart the server."
      });
    }

    const internalId = "TASP" + nanoid(8).toUpperCase();
    const amountPaise = Math.round(pricing.total * 100);

    const razorpayOrder = await razorpay.orders.create({
      amount: amountPaise,
      currency: process.env.CURRENCY || "INR",
      receipt: internalId,
      notes: { internalId: internalId, customerPhone: customer.phone }
    });

    const order = {
      id: internalId,
      razorpayOrderId: razorpayOrder.id,
      status: "created", // created -> paid -> failed / refunded
      items: pricing.lines,
      subtotal: pricing.subtotal,
      shipping: pricing.shipping,
      total: pricing.total,
      currency: razorpayOrder.currency,
      customer: { name: customer.name, email: customer.email, phone: customer.phone },
      shippingAddress: shipping,
      createdAt: new Date().toISOString()
    };
    store.createOrder(order);

    res.json({
      orderId: internalId,
      razorpayOrderId: razorpayOrder.id,
      amount: amountPaise,
      currency: razorpayOrder.currency,
      keyId: keyId,
      totals: { subtotal: pricing.subtotal, shipping: pricing.shipping, total: pricing.total }
    });
  } catch (err) {
    console.error("[orders] create failed:", err.message);
    res.status(400).json({ error: err.message || "Could not create order." });
  }
});

// GET /api/orders/:id — order status lookup for the confirmation page.
router.get("/:id", function (req, res) {
  const order = store.getOrder(req.params.id);
  if (!order) return res.status(404).json({ error: "Order not found" });
  // Never leak the razorpay order id / internal notes to the public lookup.
  const { razorpayOrderId, ...safeOrder } = order;
  res.json({ order: safeOrder });
});

module.exports = router;
