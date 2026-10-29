/**
 * Dynamic API Base & Store Config
 * 
 * Works same-origin (/api) when running through Express or when deployed (e.g. Render/Vercel).
 * Automatically resolves to the local Express backend (http://127.0.0.1:4000/api) when frontend
 * is served via Live Server (5500), client static serve (8080), or file://.
 */
(function () {
  function getApiBase() {
    if (window.APPLE_STORE_API_BASE) return window.APPLE_STORE_API_BASE;
    if (typeof location !== "undefined") {
      const port = location.port;
      const hostname = location.hostname;
      const isLocal = hostname === "localhost" || hostname === "127.0.0.1" || hostname === "0.0.0.0";
      if ((isLocal && port && port !== "4000") || location.protocol === "file:") {
        return "http://127.0.0.1:4000/api";
      }
    }
    return "/api";
  }
  window.APPLE_STORE_API_BASE = getApiBase();
})();
const APPLE_STORE_API_BASE = window.APPLE_STORE_API_BASE;

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
  return String(RAZORPAY_PAYMENT_LINK || "https://razorpay.me/@iswiftgadgetsprivatelimit3022").replace(/[?#].*$/, "");
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
