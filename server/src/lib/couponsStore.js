const { nanoid } = require("nanoid");
const { readJson, writeJson } = require("./jsonDb");

const FILE = "coupons.json";

function getAll() {
  const data = readJson(FILE, null);
  if (!data || !Array.isArray(data.coupons)) {
    const seeded = [
      {
        id: "cpn_welcome10",
        code: "WELCOME10",
        type: "percent",
        value: 10,
        minOrder: 5000,
        maxDiscount: 5000,
        usageLimit: null,
        usedCount: 0,
        active: true,
        startsAt: null,
        endsAt: null,
        note: "Starter 10% off coupon",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    saveAll(seeded);
    return seeded;
  }
  return data.coupons;
}

function saveAll(coupons) {
  writeJson(FILE, { coupons: coupons, updatedAt: new Date().toISOString() });
  return coupons;
}

function getByCode(code) {
  const needle = String(code || "").trim().toUpperCase();
  return getAll().find(function (c) { return c.code === needle; }) || null;
}

function create(input) {
  const code = String(input.code || "").trim().toUpperCase();
  if (!code || code.length < 3) throw new Error("Coupon code must be at least 3 characters.");
  if (getByCode(code)) throw new Error("A coupon with this code already exists.");

  const type = input.type === "fixed" ? "fixed" : "percent";
  const value = Number(input.value);
  if (!Number.isFinite(value) || value <= 0) throw new Error("Discount value must be a positive number.");
  if (type === "percent" && value > 100) throw new Error("Percent discount cannot exceed 100.");

  const coupon = {
    id: "cpn_" + nanoid(8),
    code: code,
    type: type,
    value: value,
    minOrder: Number(input.minOrder) || 0,
    maxDiscount: input.maxDiscount != null && input.maxDiscount !== "" ? Number(input.maxDiscount) : null,
    usageLimit: input.usageLimit != null && input.usageLimit !== "" ? Number(input.usageLimit) : null,
    usedCount: 0,
    active: input.active !== false,
    startsAt: input.startsAt || null,
    endsAt: input.endsAt || null,
    note: String(input.note || "").trim(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  const all = getAll();
  all.push(coupon);
  saveAll(all);
  return coupon;
}

function update(id, patch) {
  const all = getAll();
  const idx = all.findIndex(function (c) { return c.id === id; });
  if (idx === -1) return null;

  const current = all[idx];
  if (patch.code) {
    const code = String(patch.code).trim().toUpperCase();
    const clash = all.find(function (c) { return c.code === code && c.id !== id; });
    if (clash) throw new Error("A coupon with this code already exists.");
    current.code = code;
  }
  if (patch.type) current.type = patch.type === "fixed" ? "fixed" : "percent";
  if (patch.value != null && patch.value !== "") {
    const value = Number(patch.value);
    if (!Number.isFinite(value) || value <= 0) throw new Error("Discount value must be a positive number.");
    if (current.type === "percent" && value > 100) throw new Error("Percent discount cannot exceed 100.");
    current.value = value;
  }
  if (patch.minOrder != null) current.minOrder = Number(patch.minOrder) || 0;
  if (patch.maxDiscount !== undefined) {
    current.maxDiscount = patch.maxDiscount === "" || patch.maxDiscount == null ? null : Number(patch.maxDiscount);
  }
  if (patch.usageLimit !== undefined) {
    current.usageLimit = patch.usageLimit === "" || patch.usageLimit == null ? null : Number(patch.usageLimit);
  }
  if (typeof patch.active === "boolean") current.active = patch.active;
  if (patch.startsAt !== undefined) current.startsAt = patch.startsAt || null;
  if (patch.endsAt !== undefined) current.endsAt = patch.endsAt || null;
  if (patch.note !== undefined) current.note = String(patch.note || "").trim();
  current.updatedAt = new Date().toISOString();

  all[idx] = current;
  saveAll(all);
  return current;
}

function remove(id) {
  const all = getAll();
  const next = all.filter(function (c) { return c.id !== id; });
  if (next.length === all.length) return false;
  saveAll(next);
  return true;
}

function isCouponValidNow(coupon, subtotal) {
  if (!coupon || !coupon.active) return { ok: false, error: "This coupon is not active." };
  const now = Date.now();
  if (coupon.startsAt && new Date(coupon.startsAt).getTime() > now) {
    return { ok: false, error: "This coupon is not valid yet." };
  }
  if (coupon.endsAt && new Date(coupon.endsAt).getTime() < now) {
    return { ok: false, error: "This coupon has expired." };
  }
  if (coupon.usageLimit != null && coupon.usedCount >= coupon.usageLimit) {
    return { ok: false, error: "This coupon has reached its usage limit." };
  }
  const orderAmount = Number(subtotal) || 0;
  if (orderAmount < (coupon.minOrder || 0)) {
    return { ok: false, error: "Minimum order of ₹" + (coupon.minOrder || 0) + " required." };
  }
  return { ok: true };
}

function calculateDiscount(coupon, subtotal) {
  const amount = Number(subtotal) || 0;
  let discount = 0;
  if (coupon.type === "fixed") discount = coupon.value;
  else discount = Math.round((amount * coupon.value) / 100);
  if (coupon.maxDiscount != null) discount = Math.min(discount, coupon.maxDiscount);
  discount = Math.max(0, Math.min(discount, amount));
  return discount;
}

function applyCoupon(code, subtotal) {
  const coupon = getByCode(code);
  if (!coupon) return { ok: false, error: "Invalid coupon code." };
  const validity = isCouponValidNow(coupon, subtotal);
  if (!validity.ok) return validity;
  const discount = calculateDiscount(coupon, subtotal);
  return {
    ok: true,
    coupon: {
      id: coupon.id,
      code: coupon.code,
      type: coupon.type,
      value: coupon.value
    },
    discount: discount
  };
}

function incrementUsage(code) {
  const all = getAll();
  const idx = all.findIndex(function (c) { return c.code === String(code || "").toUpperCase(); });
  if (idx === -1) return;
  all[idx].usedCount = (all[idx].usedCount || 0) + 1;
  all[idx].updatedAt = new Date().toISOString();
  saveAll(all);
}

module.exports = {
  getAll,
  getByCode,
  create,
  update,
  remove,
  applyCoupon,
  incrementUsage,
  calculateDiscount,
  isCouponValidNow
};
