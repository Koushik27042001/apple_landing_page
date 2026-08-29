/* ============================================================
   Cart Module — localStorage based cart, shared across pages.
   Cart item shape: { id, name, image, price, color, storage,
   qty, category }
   ============================================================ */

const CART_KEY = "tasp_cart_v1";

function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function cartLineId(productId, color, storage) {
  return productId + "::" + (color || "") + "::" + (storage || "");
}

function addToCart(product, opts) {
  opts = opts || {};
  const color = opts.color || (product.colors && product.colors[0] && product.colors[0].name) || "";
  const storage = opts.storage || (product.storageOptions && product.storageOptions[0] && product.storageOptions[0].label) || "";
  const qty = opts.qty || 1;
  const unitPrice = opts.unitPrice != null ? opts.unitPrice : product.price;
  const image = opts.image || product.images[0];

  const cart = getCart();
  const lineId = cartLineId(product.id, color, storage);
  const existing = cart.find(function (i) { return i.lineId === lineId; });

  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      lineId: lineId,
      id: product.id,
      name: product.name,
      image: image,
      price: unitPrice,
      color: color,
      storage: storage,
      qty: qty,
      category: product.category
    });
  }
  saveCart(cart);
  return cart;
}

function updateCartQty(lineId, qty) {
  let cart = getCart();
  if (qty <= 0) {
    cart = cart.filter(function (i) { return i.lineId !== lineId; });
  } else {
    const item = cart.find(function (i) { return i.lineId === lineId; });
    if (item) item.qty = qty;
  }
  saveCart(cart);
  return cart;
}

function removeFromCart(lineId) {
  const cart = getCart().filter(function (i) { return i.lineId !== lineId; });
  saveCart(cart);
  return cart;
}

function clearCart() {
  saveCart([]);
}

function cartCount() {
  return getCart().reduce(function (sum, i) { return sum + i.qty; }, 0);
}

function cartSubtotal() {
  return getCart().reduce(function (sum, i) { return sum + i.qty * i.price; }, 0);
}

function updateCartBadge() {
  const badges = document.querySelectorAll(".cart-count");
  const count = cartCount();
  badges.forEach(function (b) {
    b.textContent = count;
    b.style.display = count > 0 ? "flex" : "none";
  });
}

document.addEventListener("DOMContentLoaded", updateCartBadge);
