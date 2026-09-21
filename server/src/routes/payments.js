const express = require("express");
const crypto = require("crypto");
const store = require("../lib/store");
const { razorpay } = require("../lib/razorpay");

function validSignature(expected, supplied) {
  return typeof supplied === "string" && /^[a-f0-9]{64}$/i.test(supplied) &&
    crypto.timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(supplied, "hex"));
}

const router = express.Router();

router.post("/verify", express.json(), async function (req, res, next) {
  try {
    const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};
    if (![orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature].every(value => typeof value === "string" && value.length > 0)) {
      return res.status(400).json({ error: "Missing payment verification fields" });
    }
    if (!razorpay) return res.status(503).json({ error: "Payment verification unavailable" });
    const order = await store.getOrder(orderId);

    if (!order) return res.status(404).json({ error: "Order not found" });
    if (order.razorpayOrderId !== razorpay_order_id) {
      return res.status(400).json({ error: "Order/payment mismatch" });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (!validSignature(expectedSignature, razorpay_signature)) {
      return res.status(400).json({ error: "Payment verification failed. Please contact support." });
    }

    const payment = await razorpay.payments.fetch(razorpay_payment_id);
    if (payment.status !== "captured" || payment.order_id !== order.razorpayOrderId ||
        payment.amount !== Math.round(order.total * 100) || payment.currency !== order.currency) {
      return res.status(409).json({ error: "Payment has not been captured for this order" });
    }
    if (order.status === "refunded") return res.status(409).json({ error: "Order already refunded" });

    const updated = await store.updateOrder(orderId, {
      status: "paid",
      razorpayPaymentId: razorpay_payment_id,
      paidAt: new Date().toISOString()
    });

    res.json({ success: true, orderId: updated.id, total: updated.total });
  } catch (err) {
    next(err);
  }
});

router.post("/webhook", async function (req, res) {
  try {
    const signature = req.headers["x-razorpay-signature"];
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const rawBody = req.body;

    if (!secret || secret.indexOf("your_webhook_secret") !== -1) {
      console.warn("[webhook] RAZORPAY_WEBHOOK_SECRET not configured — rejecting webhook.");
      return res.status(503).send("Webhook secret not configured");
    }

    const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
    if (!validSignature(expected, signature)) {
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
    const order = razorpayOrderId ? await store.findByRazorpayOrderId(razorpayOrderId) : null;

    if (order) {
      const payment = event.payload.payment.entity;
      if (event.event === "payment.captured" && order.status !== "refunded" &&
          payment.amount === Math.round(order.total * 100) && payment.currency === order.currency) {
        await store.updateOrder(order.id, { status: "paid", webhookConfirmedAt: new Date().toISOString() });
      } else if (event.event === "payment.failed" && !["paid", "refunded"].includes(order.status)) {
        await store.updateOrder(order.id, { status: "failed" });
      } else if (event.event === "refund.processed") {
        await store.updateOrder(order.id, { status: "refunded" });
      }
    }

    res.status(200).send("ok");
  } catch (err) {
    console.error("[webhook] error:", err.message);
    res.status(500).send("error");
  }
});

module.exports = router;
