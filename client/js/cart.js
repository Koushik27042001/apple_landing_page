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

function cartLineId(productId, color, storage, modelNumber) {
  return productId + "::" + (color || "") + "::" + (storage || "") + (modelNumber ? "::" + modelNumber : "");
}

function createCartLine(product, opts) {
  opts = opts || {};
  const color = opts.color || (product.colors && product.colors[0] && product.colors[0].name) || "";
  const storage = opts.storage || (product.storageOptions && product.storageOptions[0] && product.storageOptions[0].label) || "";
  const qty = opts.qty || 1;
  const unitPrice = opts.unitPrice != null ? opts.unitPrice : product.price;
  const image = opts.image || product.images[0];

  return {
    lineId: cartLineId(product.id, color, storage, opts.modelNumber),
    id: product.id,
    name: product.name,
    image: image,
    price: unitPrice,
    color: color,
    storage: storage,
    qty: qty,
    modelNumber: opts.modelNumber || "",
    chip: opts.chip || "",
    ram: opts.ram || "",
    category: product.category
  };
}

function buyNow(product, opts) {
  sessionStorage.setItem("store_buy_now", JSON.stringify(createCartLine(product, opts)));
  window.location.href = "checkout.html?buy=1";
}

function addToCart(product, opts) {
  const line = createCartLine(product, opts);
  const cart = getCart();
  const existing = cart.find(item => item.lineId === line.lineId);
  if (existing) existing.qty = Math.min(20, existing.qty + line.qty);
  else cart.push(line);
  saveCart(cart);
  return cart;
}

function updateCartQty(lineId, qty) {
  let cart = getCart();
  if (qty <= 0) {
    cart = cart.filter(function (i) { return i.lineId !== lineId; });
  } else {
    const item = cart.find(function (i) { return i.lineId === lineId; });
    if (item) item.qty = Math.min(20, qty);
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

function bindPurchaseButtons(addButton, getSelection, onAdded) {
  const buyButton = addButton.cloneNode(false);
  buyButton.id = addButton.id + "BuyNow";
  buyButton.textContent = "Buy Now";
  buyButton.type = "button";
  buyButton.style.marginTop = ".65rem";
  addButton.after(buyButton);

  addButton.addEventListener("click", () => {
    const selected = getSelection();
    if (!selected) return;
    addToCart(selected.product, selected.options);
    onAdded(selected);
  });
  buyButton.addEventListener("click", () => {
    const selected = getSelection();
    if (selected) buyNow(selected.product, selected.options);
  });
}
