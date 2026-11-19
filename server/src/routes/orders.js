const express = require("express");
const { randomBytes } = require("crypto");
const { priceCart } = require("../lib/catalog");
const { razorpay, keyId } = require("../lib/razorpay");
const store = require("../lib/store");
const couponsStore = require("../lib/couponsStore");

const router = express.Router();

const checkoutRequests = new Map();

router.post("/quote", async function (req, res) {
  try {
    const pricing = await priceCart(req.body?.items, req.body?.couponCode);
    res.json({ pricing, onlinePaymentAvailable: Boolean(razorpay) });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

function field(value, max) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

async function placeOrder(id, payload) {
  const { items, couponCode, paymentMode, expectedTotal } = payload;
  const customer = {
    name: field(payload.customer?.name, 120),
    email: field(payload.customer?.email, 254),
    phone: field(payload.customer?.phone, 30)
  };
  const shippingAddress = {
    address: field(payload.shipping?.address, 250),
    city: field(payload.shipping?.city, 100),
    state: field(payload.shipping?.state, 100),
    pincode: field(payload.shipping?.pincode, 30),
    landmark: field(payload.shipping?.landmark, 150),
    country: "India"
  };
  if (customer.name.length < 3 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email) || !/^[6-9]\d{9}$/.test(customer.phone)) {
    throw new Error("Enter your full name, email and a valid Indian mobile number.");
  }
  if (!shippingAddress.address || !shippingAddress.city || !shippingAddress.state || !/^[1-9]\d{5}$/.test(shippingAddress.pincode)) {
    throw new Error("Enter a complete shipping address and a valid Indian PIN code.");
  }

  const existing = await store.getOrder(id);
  if (existing) return existing;

  const pricing = await priceCart(items, couponCode);
  if (expectedTotal != null && expectedTotal !== pricing.total) {
    throw Object.assign(new Error("Your total changed. Review the updated order summary and try again."), { status: 409 });
  }

  const currency = "INR";
  const amount = Math.round(pricing.total * 100);
  const gatewayOrder = paymentMode === "gateway" && await razorpay.orders.create({
    amount,
    currency,
    receipt: id
  });
  const order = await store.createOrder({
    id,
    razorpayOrderId: gatewayOrder ? gatewayOrder.id : null,
    status: "created",
    paymentMode,
    items: pricing.lines,
    subtotal: pricing.subtotal,
    discount: pricing.discount,
    coupon: pricing.coupon,
    shipping: pricing.shipping,
    total: pricing.total,
    currency,
    customer,
    shippingAddress,
    fulfillmentStatus: "pending",
    createdAt: new Date().toISOString()
  });

  if (pricing.coupon?.code) {
    await couponsStore.incrementUsage(pricing.coupon.code).catch(err => {
      console.error("[orders] could not record coupon use:", err.message);
    });
  }
  return order;
}

router.post("/", async function (req, res) {
  const payload = req.body || {};
  const { requestId, paymentMode = "gateway" } = payload;
  if (!["gateway", "cod"].includes(paymentMode)) {
    return res.status(400).json({ error: "Select online payment or Cash on Delivery." });
  }
  if (paymentMode === "gateway" && !razorpay) {
    return res.status(503).json({ error: "Online payment is currently unavailable. Choose Cash on Delivery." });
  }
  if (requestId != null && (typeof requestId !== "string" || !/^[a-f0-9]{32}$/.test(requestId))) {
    return res.status(400).json({ error: "Invalid checkout reference." });
  }

  const id = requestId ? "ISW" + requestId : "ISW" + randomBytes(16).toString("hex");
  let pending = checkoutRequests.get(id);
  if (!pending) {
    pending = placeOrder(id, { ...payload, paymentMode }).finally(() => checkoutRequests.delete(id));
    checkoutRequests.set(id, pending);
  }
  try {
    const order = await pending;
    res.json({
      orderId: order.id,
      paymentMode: order.paymentMode,
      razorpayOrderId: order.razorpayOrderId,
      amount: Math.round(order.total * 100),
      currency: order.currency,
      keyId: order.razorpayOrderId ? keyId : undefined,
      totals: { subtotal: order.subtotal, discount: order.discount, shipping: order.shipping, total: order.total, coupon: order.coupon }
    });
  } catch (err) {
    console.error("[orders] create failed:", err.message || err.error?.description);
    res.status(err.status || (err.statusCode ? 502 : 400)).json({ error: err.message || "Could not create order. Please try again." });
  }
});

function buildInvoiceData(order) {
  const invoiceNo = "INV-" + new Date(order.createdAt || Date.now()).getFullYear() + "-" + order.id;
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
    const itemTotal = item.lineTotal ?? item.total ?? ((item.unitPrice ?? item.price) * (item.qty ?? item.quantity ?? 1));
    const itemTaxable = Math.round((itemTotal / 1.18) * 100) / 100;
    const itemGst = Math.round((itemTotal - itemTaxable) * 100) / 100;
    const category = item.category || (item.product && item.product.category) || "mac";
    return {
      id: item.id || item.productId,
      name: item.name || (item.product ? item.product.name : "Apple Product"),
      quantity: item.qty ?? item.quantity ?? 1,
      unitPrice: item.unitPrice ?? item.price,
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
    fulfillmentStatus: order.fulfillmentStatus || (["shipped", "delivered"].includes(order.status) ? order.status : "pending"),
    carrier: order.carrier,
    trackingNumber: order.trackingNumber,
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

router.get("/:id/status", async function (req, res, next) {
  try {
    if (!/^ISW[a-f0-9]{32}$/.test(req.params.id)) return res.status(404).json({ error: "Order not found." });
    const order = await store.getOrder(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found." });
    res.set("Cache-Control", "private, no-store");
    res.json({
      orderId: order.id,
      paymentMode: order.paymentMode,
      status: order.status,
      fulfillmentStatus: order.fulfillmentStatus || "pending",
      carrier: order.carrier,
      trackingNumber: order.trackingNumber,
      totals: { total: order.total }
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:id/public", async function (req, res, next) {
  try {
    const order = await store.getOrder(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    const invoice = buildInvoiceData(order);
    res.set("Cache-Control", "private, no-store");
    res.json({ invoice });
  } catch (err) {
    next(err);
  }
});

router.get("/:id/invoice", async function (req, res, next) {
  try {
    const order = await store.getOrder(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    const invoice = buildInvoiceData(order);
    res.set("Cache-Control", "private, no-store");
    res.json({ invoice });
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

