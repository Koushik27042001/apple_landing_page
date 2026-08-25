const { readJson, writeJson } = require("./jsonDb");

const FILE = "settings.json";

const DEFAULTS = {
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

function get() {
  return Object.assign({}, DEFAULTS, readJson(FILE, DEFAULTS));
}

function update(patch) {
  const current = get();
  const next = Object.assign({}, current, patch || {}, { updatedAt: new Date().toISOString() });
  if (Array.isArray(patch.phones)) next.phones = patch.phones.map(String);
  if (Array.isArray(patch.address)) next.address = patch.address.map(String);
  if (patch.shippingFee != null) next.shippingFee = Number(patch.shippingFee) || 0;
  if (patch.shippingThreshold != null) next.shippingThreshold = Number(patch.shippingThreshold) || 0;
  writeJson(FILE, next);
  return next;
}

module.exports = { get, update, DEFAULTS };
