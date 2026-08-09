const express = require("express");
const crypto = require("crypto");
const store = require("../lib/store");

const router = express.Router();

// POST /api/payments/verify — called by the frontend immediately after
// the Razorpay Checkout popup succeeds. We re-verify the signature
// ourselves (never trust the browser) before marking the order paid.
router.post("/verify", express.json(), function (req, res) {
  const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};
  const order = store.getOrder(orderId);

  if (!order) return res.status(404).json({ error: "Order not found" });
  if (order.razorpayOrderId !== razorpay_order_id) {
    return res.status(400).json({ error: "Order/payment mismatch" });
  }

  const secret = process.env.RAZORPAY_KEY_SECRET;
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    store.updateOrder(orderId, { status: "failed", failureReason: "Signature mismatch" });
    return res.status(400).json({ error: "Payment verification failed. Please contact support." });
  }

  const updated = store.updateOrder(orderId, {
    status: "paid",
    razorpayPaymentId: razorpay_payment_id,
    paidAt: new Date().toISOString()
  });

  res.json({ success: true, orderId: updated.id, total: updated.total });
});

// POST /api/payments/webhook — Razorpay server-to-server notification.
// This is the *reliable* source of truth (works even if the customer
// closes the tab right after paying) and must be registered in the
// Razorpay Dashboard under Settings > Webhooks pointing at
// https://yourdomain.com/api/payments/webhook
//
// IMPORTANT: this route needs the raw request body to verify the
// signature, so it is mounted with express.raw() in server.js
// *before* the global express.json() body parser.
router.post("/webhook", function (req, res) {
  const signature = req.headers["x-razorpay-signature"];
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const rawBody = req.body; // Buffer, thanks to express.raw()

  if (!secret || secret.indexOf("your_webhook_secret") !== -1) {
    console.warn("[webhook] RAZORPAY_WEBHOOK_SECRET not configured — rejecting webhook.");
    return res.status(503).send("Webhook secret not configured");
  }

  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  if (expected !== signature) {
    return res.status(400).send("Invalid webhook signature");
  }

  let event;
  try {
    event = JSON.parse(rawBody.toString("utf8"));
  } catch (e) {
    return res.status(400).send("Invalid JSON");
  }

  const razorpayOrderId = event.payload && event.payload.payment && event.payload.payment.entity
    ? event.payload.payment.entity.order_id
    : null;
  const order = razorpayOrderId ? store.findByRazorpayOrderId(razorpayOrderId) : null;

  if (order) {
    if (event.event === "payment.captured") {
      store.updateOrder(order.id, { status: "paid", webhookConfirmedAt: new Date().toISOString() });
    } else if (event.event === "payment.failed") {
      store.updateOrder(order.id, { status: "failed" });
    } else if (event.event === "refund.processed") {
      store.updateOrder(order.id, { status: "refunded" });
    }
  }

  // Always 200 quickly so Razorpay doesn't retry unnecessarily.
  res.status(200).send("ok");
});

module.exports = router;
