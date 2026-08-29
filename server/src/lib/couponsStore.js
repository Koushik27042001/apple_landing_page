const { nanoid } = require("nanoid");
const { readJson, writeJson } = require("./jsonDb");
const { isConnected } = require("./mongo");
const { Coupon, toPlain } = require("../models");

const FILE = "coupons.json";

const STARTER = {
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
  note: "Starter 10% off coupon"
};

function readFileCoupons() {
  const data = readJson(FILE, null);
  if (!data || !Array.isArray(data.coupons)) return null;
  return data.coupons;
}

function writeFileCoupons(coupons) {
  writeJson(FILE, { coupons: coupons, updatedAt: new Date().toISOString() });
  return coupons;
}

async function seedIfNeeded() {
  if (isConnected()) {
    const count = await Coupon.countDocuments();
    if (count > 0) return;
    await Coupon.create(STARTER);
    console.log("[mongo] Seeded starter coupon WELCOME10");
    return;
  }
  if (readFileCoupons()) return;
  const now = new Date().toISOString();
  writeFileCoupons([Object.assign({}, STARTER, { createdAt: now, updatedAt: now })]);
  console.log("[json] Seeded starter coupon WELCOME10");
}

async function getAll() {
  await seedIfNeeded();
  if (isConnected()) {
    const coupons = await Coupon.find({}).lean();
    return coupons.map(toPlain);
  }
  return readFileCoupons() || [];
}

async function getByCode(code) {
  await seedIfNeeded();
  const needle = String(code || "").trim().toUpperCase();
  if (isConnected()) {
    const coupon = await Coupon.findOne({ code: needle }).lean();
    return coupon ? toPlain(coupon) : null;
  }
  const coupons = readFileCoupons() || [];
  return coupons.find(function (c) { return c.code === needle; }) || null;
}

async function create(input) {
  const code = String(input.code || "").trim().toUpperCase();
  if (!code || code.length < 3) throw new Error("Coupon code must be at least 3 characters.");
  if (await getByCode(code)) throw new Error("A coupon with this code already exists.");

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
    note: String(input.note || "").trim()
  };

  if (isConnected()) {
    await Coupon.create(coupon);
    return coupon;
  }

  const now = new Date().toISOString();
  const next = (readFileCoupons() || []).concat([Object.assign({}, coupon, { createdAt: now, updatedAt: now })]);
  writeFileCoupons(next);
  return coupon;
}

async function update(id, patch) {
  if (isConnected()) {
    const current = await Coupon.findOne({ id: id });
    if (!current) return null;

    if (patch.code) {
      const code = String(patch.code).trim().toUpperCase();
      const clash = await Coupon.findOne({ code: code, id: { $ne: id } });
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

    await current.save();
    return toPlain(current.toObject());
  }

  const coupons = readFileCoupons() || [];
  const idx = coupons.findIndex(function (c) { return c.id === id; });
  if (idx < 0) return null;
  const current = Object.assign({}, coupons[idx]);

  if (patch.code) {
    const code = String(patch.code).trim().toUpperCase();
    if (coupons.some(function (c) { return c.code === code && c.id !== id; })) {
      throw new Error("A coupon with this code already exists.");
    }
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

  coupons[idx] = current;
  writeFileCoupons(coupons);
  return current;
}

async function remove(id) {
  if (isConnected()) {
    const result = await Coupon.deleteOne({ id: id });
    return !!result.deletedCount;
  }
  const coupons = readFileCoupons() || [];
  const next = coupons.filter(function (c) { return c.id !== id; });
  if (next.length === coupons.length) return false;
  writeFileCoupons(next);
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

async function applyCoupon(code, subtotal) {
  const coupon = await getByCode(code);
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

async function incrementUsage(code) {
  if (isConnected()) {
    await Coupon.updateOne(
      { code: String(code || "").toUpperCase() },
      { $inc: { usedCount: 1 } }
    );
    return;
  }
  const needle = String(code || "").toUpperCase();
  const coupons = readFileCoupons() || [];
  const idx = coupons.findIndex(function (c) { return c.code === needle; });
  if (idx < 0) return;
  coupons[idx].usedCount = (coupons[idx].usedCount || 0) + 1;
  coupons[idx].updatedAt = new Date().toISOString();
  writeFileCoupons(coupons);
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
  isCouponValidNow,
  seedIfNeeded
};
