/* Authoritative catalog + pricing. Reads from the editable products
   store (seeded from js/data.js) so admin panel changes apply to
   checkout totals. */

const productsStore = require("./productsStore");
const couponsStore = require("./couponsStore");
const settingsStore = require("./settingsStore");

function getProducts() {
  return productsStore.getProducts();
}

function getCategories() {
  return productsStore.getCategories();
}

function getProductById(id) {
  return productsStore.getById(id);
}

function getUnitPrice(productId, storageLabel) {
  const product = getProductById(productId);
  if (!product) return null;
  const opt = (product.storageOptions || []).find(function (o) { return o.label === storageLabel; });
  return product.price + (opt ? opt.extra : 0);
}

/**
 * Recomputes an authoritative order total from cart line items.
 * Optional couponCode is validated and applied server-side.
 */
function priceCart(items, couponCode) {
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

  const settings = settingsStore.get();
  const SHIPPING_THRESHOLD = settings.shippingThreshold != null ? settings.shippingThreshold : 50000;
  const SHIPPING_FEE = settings.shippingFee != null ? settings.shippingFee : 199;
  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;

  let discount = 0;
  let coupon = null;
  if (couponCode) {
    const applied = couponsStore.applyCoupon(couponCode, subtotal);
    if (!applied.ok) throw new Error(applied.error);
    discount = applied.discount;
    coupon = applied.coupon;
  }

  const total = Math.max(0, subtotal - discount) + shipping;

  return {
    lines: lines,
    subtotal: subtotal,
    discount: discount,
    coupon: coupon,
    shipping: shipping,
    total: total
  };
}

module.exports = {
  get PRODUCTS() { return getProducts(); },
  get CATEGORIES() { return getCategories(); },
  getProductById,
  getUnitPrice,
  priceCart
};
