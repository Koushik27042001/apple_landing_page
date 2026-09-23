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
  return String(PAYMENT_LINK || "https://razorpay.me/@iswiftgadgetsprivatelimit3022").replace(/[?#].*$/, "");
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

    if (paymentMode === "cod") {
      const order = {
        id: internalId,
        razorpayOrderId: null,
        status: "created",
        paymentMode: "cod",
        paymentLink: null,
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
        paymentMode: "cod",
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

function buildInvoiceData(order) {
  const invoiceNo = "INV-2026-" + (order.id || "0000");
  const subtotal = order.subtotal || order.total || 0;
  const discount = order.discount || 0;
  const grandTotal = order.total || 0;
  
  const taxableAmount = Math.round((grandTotal / 1.18) * 100) / 100;
  const gstAmount = Math.round((grandTotal - taxableAmount) * 100) / 100;
  const cgst = Math.round((gstAmount / 2) * 100) / 100;
  const sgst = Math.round((gstAmount - cgst) * 100) / 100;

  const hsnMap = {
    mac: "84713010",
    iphone: "85171300",
    ipad: "84713090",
    watch: "90318000",
    airpods: "85183000",
    accessories: "85044090",
    vision: "90049090",
    tvhome: "85287200"
  };

  const items = (order.items || []).map(function(item) {
    const itemTotal = item.total || (item.price * item.quantity);
    const itemTaxable = Math.round((itemTotal / 1.18) * 100) / 100;
    const itemGst = Math.round((itemTotal - itemTaxable) * 100) / 100;
    const category = (item.product && item.product.category) || "mac";
    return {
      id: item.id || item.productId,
      name: item.name || (item.product ? item.product.name : "Apple Product"),
      quantity: item.quantity || 1,
      unitPrice: item.price,
      total: itemTotal,
      taxableAmount: itemTaxable,
      cgst: Math.round((itemGst / 2) * 100) / 100,
      sgst: Math.round((itemGst / 2) * 100) / 100,
      gstRate: "18%",
      hsn: hsnMap[category] || "84713010"
    };
  });

  return {
    invoiceNo: invoiceNo,
    invoiceDate: order.createdAt || new Date().toISOString(),
    orderId: order.id,
    paymentStatus: order.status === "paid" ? "PAID" : (order.paymentMode === "cod" ? "CONFIRMED (COD)" : "PENDING PAYMENT"),
    paymentMode: order.paymentMode ? order.paymentMode.toUpperCase() : "ONLINE",
    company: {
      name: "ISWIFT GADGETS PRIVATE LIMITED",
      tagline: "Apple Authorised Reseller & Retailer",
      address: "104 FC Road, Shivaji Nagar, Pune, Maharashtra 411005",
      gstin: "27AAACI1234F1Z8",
      pan: "AAACI1234F",
      cin: "U52100PN2024PTC192837",
      email: "sales@iswiftgadgets.in",
      phone: "+91 98765 43210",
      website: "https://iswiftgadgets.in"
    },
    customer: order.customer,
    shippingAddress: order.shippingAddress,
    items: items,
    pricing: {
      subtotal: subtotal,
      discount: discount,
      shipping: order.shipping || 0,
      taxableAmount: taxableAmount,
      cgst: cgst,
      sgst: sgst,
      totalGst: gstAmount,
      grandTotal: grandTotal,
      currency: order.currency || "INR"
    }
  };
}

router.get("/:id/public", async function (req, res, next) {
  try {
    const order = await store.getOrder(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    const invoice = buildInvoiceData(order);
    res.json({ order: order, invoice: invoice });
  } catch (err) {
    next(err);
  }
});

router.get("/:id/invoice", async function (req, res, next) {
  try {
    const order = await store.getOrder(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    const invoice = buildInvoiceData(order);
    res.json({ invoice: invoice });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", require("../lib/adminAuth").requireAdmin, async function (req, res, next) {
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

