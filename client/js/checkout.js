renderHeader("home");
renderFooter();

const direct = new URLSearchParams(location.search).get("buy") === "1";
let directLine;
if (direct) {
  try {
    directLine = JSON.parse(sessionStorage.getItem("store_buy_now"));
  } catch {
    directLine = null;
  }
}
const checkoutCart = direct ? (directLine ? [directLine] : []) : getCart();
const items = checkoutCart.map(({ id, color, storage, modelNumber, qty }) => ({ id, color, storage, modelNumber, qty }));
const form = document.getElementById("checkoutForm");
const couponForm = document.getElementById("couponForm");
const placeButton = document.getElementById("placeOrder");
const quoteStatus = document.getElementById("quoteStatus");
const checkoutStatus = document.getElementById("checkoutStatus");
const retryQuote = document.getElementById("retryQuote");
const gateway = form.querySelector('[value="gateway"]');
let quote;
let couponCode = "";
let paymentResponse;
let confirmationPending = false;
let submitting = false;
let orderRequest;

async function postCheckout(path, body) {
  const response = await fetch(APPLE_STORE_API_BASE + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(20000)
  });
  const result = await response.json();
  if (!response.ok) throw Object.assign(new Error(result.error || "Checkout is temporarily unavailable."), { status: response.status });
  return result;
}

function summaryRow(label, value, total = false) {
  const row = document.createElement("div");
  row.className = "summary-row" + (total ? " total" : "");
  const caption = document.createElement("span");
  caption.textContent = label;
  const amount = document.createElement("span");
  amount.className = "val";
  amount.textContent = value;
  row.append(caption, amount);
  return row;
}

function renderQuote() {
  const list = document.getElementById("checkoutItems");
  list.replaceChildren(...quote.lines.map(line => {
    const row = summaryRow(line.name, formatINR(line.lineTotal));
    row.className = "checkout-line";
    const details = document.createElement("small");
    details.textContent = [line.color, line.storage, line.modelNumber, "Qty " + line.qty].filter(Boolean).join(" · ");
    row.append(details);
    return row;
  }));
  document.getElementById("checkoutTotals").replaceChildren(
    summaryRow("Subtotal", formatINR(quote.subtotal)),
    ...(quote.discount ? [summaryRow("Discount", "−" + formatINR(quote.discount))] : []),
    summaryRow("Shipping", quote.shipping ? formatINR(quote.shipping) : "Free"),
    summaryRow("Total", formatINR(quote.total), true)
  );
}

async function refreshQuote(code = couponCode) {
  placeButton.disabled = true;
  couponForm.querySelector("button").disabled = true;
  retryQuote.hidden = true;
  try {
    const result = await postCheckout("/orders/quote", { items, couponCode: code });
    quote = result.pricing;
    couponCode = code;
    gateway.disabled = !result.onlinePaymentAvailable || typeof Razorpay !== "function";
    if (gateway.disabled) form.querySelector('[value="cod"]').checked = true;
    document.getElementById("gatewayDescription").textContent = gateway.disabled
      ? "Online payment is currently unavailable."
      : "Pay securely with the methods available in Razorpay Checkout.";
    renderQuote();
    quoteStatus.textContent = code ? "Promo code applied." : "";
  } catch (error) {
    quoteStatus.textContent = error.message || "Could not calculate your total.";
    retryQuote.hidden = false;
    if (code === couponCode) quote = null;
  } finally {
    placeButton.disabled = !quote || submitting;
    couponForm.querySelector("button").disabled = submitting;
  }
}

couponForm.addEventListener("submit", event => {
  event.preventDefault();
  if (!submitting && !confirmationPending) refreshQuote(document.getElementById("couponCode").value.trim());
});
retryQuote.addEventListener("click", () => refreshQuote());

function showConfirmation(order) {
  if (direct) sessionStorage.removeItem("store_buy_now");
  else {
    const ordered = new Map(checkoutCart.map(line => [line.lineId, line.qty]));
    saveCart(getCart().map(line => ({ ...line, qty: line.qty - (ordered.get(line.lineId) || 0) })).filter(line => line.qty > 0));
  }
  showOrderStatus(order);
}

function showOrderStatus(order) {
  const main = document.querySelector(".checkout-page");
  const screen = document.createElement("section");
  screen.className = "success-screen";
  screen.innerHTML = '<h1>Order placed</h1><p>Your shipping address is saved with your order.</p><div class="order-id-box"></div><div class="success-actions"><a class="btn btn-primary" target="_blank" rel="noopener">View order details</a> <a href="index.html" class="btn btn-outline">Continue shopping</a></div>';
  screen.querySelector(".order-id-box").append(
    summaryRow("Order reference", order.orderId),
    summaryRow(order.paymentMode === "cod" ? "Due on delivery" : "Paid", formatINR(order.totals.total), true)
  );
  if (order.fulfillmentStatus) {
    screen.querySelector("h1").textContent = "Order details";
    const payment = { paid: "Paid", refunded: "Refunded", failed: "Payment failed", cancelled: "Cancelled" }[order.status]
      || (order.paymentMode === "cod" ? "Cash on delivery" : "Awaiting payment");
    const shipment = order.status === "cancelled" && order.fulfillmentStatus === "pending"
      ? "Cancelled" : { pending: "Pending dispatch", shipped: "Shipped", delivered: "Delivered" }[order.fulfillmentStatus];
    screen.querySelector("p").textContent = "Payment: " + payment;
    screen.querySelector(".summary-row.total .val").previousElementSibling.textContent = "Order total";
    screen.querySelector(".order-id-box").append(summaryRow("Shipment", shipment));
    if (order.trackingNumber) screen.querySelector(".order-id-box").append(summaryRow(order.carrier, order.trackingNumber));
    screen.querySelector("a").remove();
  } else screen.querySelector("a").href = "checkout.html?order=" + encodeURIComponent(order.orderId);
  main.replaceChildren(screen);
  window.scrollTo(0, 0);
}

function openPayment(order, customer) {
  return new Promise((resolve, reject) => {
    const checkout = new Razorpay({
      key: order.keyId,
      order_id: order.razorpayOrderId,
      amount: order.amount,
      currency: order.currency,
      name: "Iswift Gadgets",
      prefill: { name: customer.name, email: customer.email, contact: customer.phone },
      handler: resolve,
      modal: { ondismiss: () => reject(new Error("Payment window closed. You can retry this order.")) }
    });
    checkout.open();
  });
}

form.addEventListener("submit", async event => {
  event.preventDefault();
  if (submitting || !quote) return;
  const fields = Object.fromEntries(new FormData(form));
  const { name, email, phone, paymentMode, address, city, state, pincode, landmark } = fields;
  const customer = { name, email, phone };
  const payload = { items, customer, shipping: { address, city, state, pincode, landmark }, paymentMode, couponCode, expectedTotal: quote.total };
  const fingerprint = JSON.stringify(payload);
  submitting = true;
  placeButton.disabled = true;
  couponForm.querySelector("button").disabled = true;
  checkoutStatus.textContent = confirmationPending ? "Checking your payment…" : "Preparing your order…";
  try {
    if (!confirmationPending) {
      if (orderRequest?.fingerprint !== fingerprint) {
        orderRequest = { fingerprint, id: crypto.randomUUID().replaceAll("-", "") };
      }
      orderRequest.order = await postCheckout("/orders", { ...payload, requestId: orderRequest.id });
      if (orderRequest.order.paymentMode === "gateway") {
        paymentResponse = await openPayment(orderRequest.order, customer);
        confirmationPending = true;
        Array.from(form.elements).forEach(control => { if (control !== placeButton) control.disabled = true; });
      }
    }
    if (confirmationPending) {
      await postCheckout("/payments/verify", { ...paymentResponse, orderId: orderRequest.order.orderId });
    }
    showConfirmation(orderRequest.order);
  } catch (error) {
    checkoutStatus.textContent = confirmationPending
      ? "Payment confirmation is pending. Check again before making another payment. Order: " + orderRequest.order.orderId
      : (error.message || "Could not place your order.");
    if (error.status === 409 && !confirmationPending) await refreshQuote();
  } finally {
    submitting = false;
    placeButton.disabled = !quote;
    placeButton.textContent = confirmationPending ? "Check payment" : "Place order";
    couponForm.querySelector("button").disabled = confirmationPending;
  }
});

const statusId = new URLSearchParams(location.search).get("order");
if (statusId) {
  const main = document.querySelector(".checkout-page");
  main.textContent = "Loading order details?";
  fetch(APPLE_STORE_API_BASE + "/orders/" + encodeURIComponent(statusId) + "/status", { signal: AbortSignal.timeout(15000) })
    .then(response => {
      if (!response.ok) throw new Error("Order details are unavailable.");
      return response.json();
    })
    .then(showOrderStatus)
    .catch(() => { main.textContent = "Order details are unavailable. Check your order link and try again."; });
} else if (items.length) refreshQuote();
else location.replace("cart.html");
