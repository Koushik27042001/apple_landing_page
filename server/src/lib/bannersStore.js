const { readJson, writeJson } = require("./jsonDb");
const { isConnected } = require("./mongo");
const { Banner, toPlain } = require("../models");

const FILE = "banners.json";

const DEFAULT_BANNERS = [
  {
    id: "iphone-duo-launch",
    title: "iPhone Duo",
    subtitle: "The largest iPhone display ever. Foldable, posable, standable. Featuring unique iOS experiences for ultimate versatility.",
    badge: "Pre-order starting at 5:30 PM IST on 16 October",
    image: "images/hero/iphone_duo__hefmlegzwbmi_large_2x.png",
    link: "category.html?cat=iphone",
    btnText: "Pre-order Now",
    placement: "hero",
    category: "iphone",
    active: true,
    sortOrder: 1
  },
  {
    id: "festive-apple-sale",
    title: "Festive Season Offers",
    subtitle: "Get instant cashback up to ₹10,000 on eligible cards plus up to 12 months No Cost EMI.",
    badge: "Special Offer",
    image: "images/hero/shop__dmmu8wcl1iie_large_2x.png",
    link: "category.html?cat=mac",
    btnText: "Shop Offers",
    placement: "top_strip",
    category: "all",
    active: true,
    sortOrder: 2
  },
  {
    id: "applecare-plus-promo",
    title: "AppleCare+ Peace of Mind",
    subtitle: "Unlimited repairs for accidental damage protection with genuine Apple parts and expert support.",
    badge: "Protection Plan",
    image: "images/hero/ipad/accessories_d7234e26e.png",
    link: "category.html?cat=accessories",
    btnText: "Explore Plans",
    placement: "category_hero",
    category: "all",
    active: true,
    sortOrder: 3
  }
];

function readFileBanners() {
  const data = readJson(FILE, null);
  if (!data || !Array.isArray(data.banners)) return [];
  return data.banners;
}

function writeFileBanners(banners) {
  const payload = { banners: banners || [], updatedAt: new Date().toISOString() };
  writeJson(FILE, payload);
  return banners;
}

async function seedIfNeeded() {
  if (isConnected()) {
    const count = await Banner.countDocuments();
    if (count === 0) {
      console.log("[mongo] Seeding initial advertisement banners ...");
      await Banner.insertMany(DEFAULT_BANNERS);
    }
    return;
  }
  const existing = readFileBanners();
  if (!existing.length) {
    console.log("[json] Seeding initial advertisement banners ...");
    writeFileBanners(DEFAULT_BANNERS);
  }
}

async function getAll() {
  await seedIfNeeded();
  if (isConnected()) {
    const docs = await Banner.find({}).sort({ sortOrder: 1 }).lean();
    return docs.map(toPlain);
  }
  return readFileBanners().sort(function (a, b) { return (a.sortOrder || 0) - (b.sortOrder || 0); });
}

async function getActive(placement, category) {
  const all = await getAll();
  return all.filter(function (b) {
    if (!b.active) return false;
    if (placement && b.placement !== placement && b.placement !== "all") return false;
    if (category && b.category !== category && b.category !== "all") return false;
    return true;
  });
}

async function getById(id) {
  const all = await getAll();
  return all.find(function (b) { return b.id === id; }) || null;
}

async function upsert(bannerData) {
  await seedIfNeeded();
  const banner = {
    id: String(bannerData.id || "").trim(),
    title: String(bannerData.title || "").trim(),
    subtitle: String(bannerData.subtitle || "").trim(),
    badge: bannerData.badge ? String(bannerData.badge).trim() : null,
    image: String(bannerData.image || "").trim(),
    link: String(bannerData.link || "#").trim(),
    btnText: String(bannerData.btnText || "Learn More").trim(),
    placement: String(bannerData.placement || "hero"),
    category: String(bannerData.category || "all"),
    active: bannerData.active !== false,
    sortOrder: Number(bannerData.sortOrder) || 0
  };

  if (isConnected()) {
    await Banner.findOneAndUpdate(
      { id: banner.id },
      { $set: banner },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    return getAll();
  }

  const list = readFileBanners();
  const idx = list.findIndex(function (b) { return b.id === banner.id; });
  if (idx >= 0) list[idx] = banner;
  else list.push(banner);
  writeFileBanners(list);
  return getAll();
}

async function remove(id) {
  await seedIfNeeded();
  if (isConnected()) {
    const result = await Banner.deleteOne({ id: id });
    if (!result.deletedCount) return null;
    return getAll();
  }
  const list = readFileBanners();
  const next = list.filter(function (b) { return b.id !== id; });
  if (next.length === list.length) return null;
  writeFileBanners(next);
  return getAll();
}

function slugify(text) {
  return String(text || "banner")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48) || "banner";
}

async function uniqueId(baseTitle) {
  let id = slugify(baseTitle);
  const all = await getAll();
  const ids = new Set(all.map(function (b) { return b.id; }));
  if (!ids.has(id)) return id;
  let n = 2;
  while (ids.has(id + "-" + n)) n++;
  return id + "-" + n;
}

module.exports = {
  seedIfNeeded,
  getAll,
  getActive,
  getById,
  upsert,
  remove,
  uniqueId
};
