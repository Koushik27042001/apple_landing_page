const { readJson, writeJson } = require("./jsonDb");
const { isConnected } = require("./mongo");
const { Settings } = require("../models");

const FILE = "settings.json";

const DEFAULTS = {
  key: "store",
  storeName: "Iswift Gadgets Private Limited",
  email: "info@axion.co.in",
  phones: ["08041492709", "919972612530", "917975627008", "917980128631"],
  whatsapp: "917975627008",
  address: [
    "#L-176, Ground Floor, 5th Main,",
    "HSR Layout, Sector 6,",
    "Bengaluru, 560102"
  ],
  mapLink: "https://share.google/xm1mcXn94xCpgRc7I",
  shippingFee: 199,
  shippingThreshold: 50000,
  announcement: "",
  updatedAt: null
};

async function get() {
  if (isConnected()) {
    let doc = await Settings.findOne({ key: "store" }).lean();
    if (!doc) {
      await Settings.create(DEFAULTS);
      doc = await Settings.findOne({ key: "store" }).lean();
    }
    const settings = Object.assign({}, DEFAULTS, doc);
    delete settings._id;
    delete settings.__v;
    delete settings.key;
    return settings;
  }

  const data = readJson(FILE, null);
  if (!data) {
    const seeded = Object.assign({}, DEFAULTS);
    delete seeded.key;
    writeJson(FILE, seeded);
    return seeded;
  }
  const settings = Object.assign({}, DEFAULTS, data);
  delete settings.key;
  return settings;
}

async function update(patch) {
  const current = await get();
  const next = Object.assign({}, current, patch || {}, {
    updatedAt: new Date().toISOString()
  });
  if (Array.isArray(patch && patch.phones)) next.phones = patch.phones.map(String);
  if (Array.isArray(patch && patch.address)) next.address = patch.address.map(String);
  if (patch && patch.shippingFee != null) next.shippingFee = Number(patch.shippingFee) || 0;
  if (patch && patch.shippingThreshold != null) next.shippingThreshold = Number(patch.shippingThreshold) || 0;

  if (isConnected()) {
    await Settings.findOneAndUpdate(
      { key: "store" },
      { $set: Object.assign({}, next, { key: "store" }) },
      { upsert: true }
    );
    return get();
  }

  writeJson(FILE, next);
  return next;
}

module.exports = { get, update, DEFAULTS };
