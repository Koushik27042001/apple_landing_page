/* Same-origin API works locally and on Render without public secrets. */
const APPLE_STORE_API_BASE = window.APPLE_STORE_API_BASE || "/api";

/* Live payment page + merchant UPI QR flyer.
   Order total is always appended so Razorpay.me opens with amount locked. */
const RAZORPAY_PAYMENT_LINK = "https://razorpay.me/@iswiftgadgetsprivatelimit3022";
const PAYMENT_QR_IMAGE = "images/payment_QR.jpeg";

/** Round to whole INR (Razorpay.me amount query uses rupees). */
function payableAmountInr(amountInr) {
  const n = Math.round(Number(amountInr) || 0);
  return n > 0 ? n : 0;
}

/**
 * Build Razorpay.me URL with cart/order total pre-filled.
 * Optional orderId is added as description for reconciliation.
 */
function buildPaymentLink(amountInr, orderId) {
  const base = String(RAZORPAY_PAYMENT_LINK || "").replace(/[?#].*$/, "");
  const amount = payableAmountInr(amountInr);
  const params = [];
  if (amount) params.push("amount=" + amount);
  if (orderId) params.push("description=" + encodeURIComponent("Order " + orderId));
  return params.length ? base + "?" + params.join("&") : base;
}

/** Image URL for a QR that encodes the amount-locked payment link. */
function buildPaymentQrImageUrl(amountInr, orderId, size) {
  const link = buildPaymentLink(amountInr, orderId);
  const px = size || 240;
  return (
    "https://api.qrserver.com/v1/create-qr-code/?size=" +
    px +
    "x" +
    px +
    "&margin=8&data=" +
    encodeURIComponent(link)
  );
}

