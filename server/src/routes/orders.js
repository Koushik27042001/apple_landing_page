const express = require("express");
const { nanoid } = require("nanoid");
const { priceCart } = require("../lib/catalog");
const { razorpay, keyId } = require("../lib/razorpay");
const store = require("../lib/store");
const couponsStore = require("../lib/couponsStore");

const router = express.Router();

const PAYMENT_LINK =
  process.env.RAZORPAY_PAYMENT_LINK ||
  "https://razorpay.me/@iswiftgadgetsprivatelimit3022";

function isValidEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v || ""); }
function isValidPhone(v) { return /^[6-9]\d{9}$/.test(v || ""); }
function isValidPincode(v) { return /^\d{6}$/.test(v || ""); }

function buildPaymentUrl(amountInr, orderId) {
  const base = String(PAYMENT_LINK || "").replace(/[?#].*$/, "");
  const amount = Math.round(Number(amountInr) || 0);
  const params = [];
  if (amount > 0) params.push("amount=" + amount);
  if (orderId) params.push("description=" + encodeURIComponent("Order " + orderId));
  return params.length ? base + "?" + params.join("&") : base;
}

router.post("/", async function (req, res) {
  try {
    const { items, customer, shipping, couponCode, paymentMode } = req.body || {};
    const useLink = paymentMode === "link" || paymentMode === "upi";

    if (!customer || !isValidEmail(customer.email) || !isValidPhone(customer.phone) || !customer.name || customer.name.trim().length < 3) {
      return res.status(400).json({ error: "Please provide a valid name, 10-digit phone number and email address." });
    }
    if (!shipping || !shipping.address || !shipping.city || !shipping.state || !isValidPincode(shipping.pincode)) {
      return res.status(400).json({ error: "Please provide a complete shipping address with a valid 6-digit pincode." });
    }

    const pricing = await priceCart(items, couponCode);
    const internalId = "ISW" + nanoid(8).toUpperCase();
    const amountPaise = Math.round(pricing.total * 100);
    const currency = process.env.CURRENCY || "INR";

    // UPI / Razorpay.me payment page — no API keys required
    if (useLink) {
      const order = {
        id: internalId,
        razorpayOrderId: null,
        status: "awaiting_payment",
        paymentMode: "link",
        paymentLink: buildPaymentUrl(pricing.total, internalId),
        items: pricing.lines,
        subtotal: pricing.subtotal,
        discount: pricing.discount || 0,
        coupon: pricing.coupon || null,
        shipping: pricing.shipping,
        total: pricing.total,
        currency: currency,
        customer: { name: customer.name, email: customer.email, phone: customer.phone },
        shippingAddress: shipping,
        createdAt: new Date().toISOString()
      };
      await store.createOrder(order);

      if (pricing.coupon && pricing.coupon.code) {
        await couponsStore.incrementUsage(pricing.coupon.code);
      }

      return res.json({
        orderId: internalId,
        paymentMode: "link",
        paymentLink: order.paymentLink,
        amount: amountPaise,
        currency: currency,
        totals: {
          subtotal: pricing.subtotal,
          discount: pricing.discount || 0,
          shipping: pricing.shipping,
          total: pricing.total,
          coupon: pricing.coupon
        }
      });
    }

    if (!razorpay) {
      return res.status(503).json({
        error: "Payment gateway API keys are not configured. Choose UPI / Scan & Pay, or add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to server/.env."
      });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: amountPaise,
      currency: currency,
      receipt: internalId,
      notes: { internalId: internalId, customerPhone: customer.phone }
    });

    const order = {
      id: internalId,
      razorpayOrderId: razorpayOrder.id,
      status: "created",
      paymentMode: "gateway",
      items: pricing.lines,
      subtotal: pricing.subtotal,
      discount: pricing.discount || 0,
      coupon: pricing.coupon || null,
      shipping: pricing.shipping,
      total: pricing.total,
      currency: razorpayOrder.currency,
      customer: { name: customer.name, email: customer.email, phone: customer.phone },
      shippingAddress: shipping,
      createdAt: new Date().toISOString()
    };
    await store.createOrder(order);

    if (pricing.coupon && pricing.coupon.code) {
      await couponsStore.incrementUsage(pricing.coupon.code);
    }

    res.json({
      orderId: internalId,
      paymentMode: "gateway",
      razorpayOrderId: razorpayOrder.id,
      amount: amountPaise,
      currency: razorpayOrder.currency,
      keyId: keyId,
      totals: {
        subtotal: pricing.subtotal,
        discount: pricing.discount || 0,
        shipping: pricing.shipping,
        total: pricing.total,
        coupon: pricing.coupon
      }
    });
  } catch (err) {
    console.error("[orders] create failed:", err.message);
    res.status(400).json({ error: err.message || "Could not create order." });
  }
});

router.get("/:id", async function (req, res, next) {
  try {
    const order = await store.getOrder(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    const { razorpayOrderId, ...safeOrder } = order;
    res.json({ order: safeOrder });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

