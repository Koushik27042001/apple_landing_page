/* Loads the shared product catalog from js/data.js (single source of
   truth also used by the frontend). Prices are always recomputed
   server-side from this file — the client is never trusted to send
   the correct amount for a payment. */

const path = require("path");
const { PRODUCTS, CATEGORIES, getProductById } = require(path.join(__dirname, "../../../js/data.js"));

function getUnitPrice(productId, storageLabel) {
  const product = getProductById(productId);
  if (!product) return null;
  const opt = (product.storageOptions || []).find(function (o) { return o.label === storageLabel; });
  return product.price + (opt ? opt.extra : 0);
}

/**
 * Recomputes an authoritative order total from a list of
 * { id, storage, qty } line items, ignoring any price the client sent.
 * Throws if a product/quantity is invalid so bad requests fail loudly.
 */
function priceCart(items) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Cart is empty.");
  }
  let subtotal = 0;
  const lines = items.map(function (item) {
    const product = getProductById(item.id);
    if (!product) throw new Error("Unknown product id: " + item.id);
    const qty = Number(item.qty) || 0;
    if (qty < 1 || qty > 20) throw new Error("Invalid quantity for " + item.id);
    const unitPrice = getUnitPrice(item.id, item.storage);
    if (unitPrice == null) throw new Error("Invalid storage option for " + item.id);
    const lineTotal = unitPrice * qty;
    subtotal += lineTotal;
    return {
      id: product.id,
      name: product.name,
      color: item.color || "",
      storage: item.storage || "",
      qty: qty,
      unitPrice: unitPrice,
      lineTotal: lineTotal
    };
  });

  const SHIPPING_THRESHOLD = 50000;
  const SHIPPING_FEE = 199;
  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;

  return { lines: lines, subtotal: subtotal, shipping: shipping, total: total };
}

module.exports = { PRODUCTS, CATEGORIES, getUnitPrice, priceCart };
