/* ============================================================
   Frontend configuration.
   ------------------------------------------------------------
   APPLE_STORE_API_BASE points the storefront at the backend in
   /server. Leave it as-is for local development (the backend's
   default port is 4000 — see server/.env.example).

   When the backend also serves /client (npm start in server/),
   you can set this to the relative path "/api" instead.

   For production, once the backend is deployed, either:
     a) point this at its public URL, e.g. "https://api.yourdomain.in/api"
     b) or serve the frontend from the SAME origin as the backend and
        set this to the relative path "/api" (recommended — avoids CORS).

   If the backend is unreachable (e.g. this site is opened as a plain
   static demo with no server running), checkout.html automatically
   falls back to a simulated "demo mode" checkout so the storefront
   still works standalone.
   ============================================================ */
const APPLE_STORE_API_BASE = "http://localhost:4000/api";

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
