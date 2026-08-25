const { readJson, writeJson } = require("./jsonDb");
const seed = require("../../../js/data.js");

const FILE = "products.json";

function seedIfNeeded() {
  const existing = readJson(FILE, null);
  if (existing && Array.isArray(existing.products) && existing.products.length) {
    return existing;
  }
  const data = {
    categories: seed.CATEGORIES,
    products: seed.PRODUCTS,
    updatedAt: new Date().toISOString()
  };
  writeJson(FILE, data);
  return data;
}

function getAll() {
  return seedIfNeeded();
}

function getProducts() {
  return getAll().products;
}

function getCategories() {
  return getAll().categories;
}

function getById(id) {
  return getProducts().find(function (p) { return p.id === id; }) || null;
}

function saveAll(products, categories) {
  const data = {
    categories: categories || getCategories(),
    products: products,
    updatedAt: new Date().toISOString()
  };
  writeJson(FILE, data);
  return data;
}

function upsert(product) {
  const all = getAll();
  const idx = all.products.findIndex(function (p) { return p.id === product.id; });
  if (idx === -1) all.products.push(product);
  else all.products[idx] = product;
  return saveAll(all.products, all.categories);
}

function remove(id) {
  const all = getAll();
  const next = all.products.filter(function (p) { return p.id !== id; });
  if (next.length === all.products.length) return null;
  return saveAll(next, all.categories);
}

function slugify(name) {
  return String(name || "product")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48) || "product";
}

function uniqueId(base) {
  let id = slugify(base);
  const ids = new Set(getProducts().map(function (p) { return p.id; }));
  if (!ids.has(id)) return id;
  let n = 2;
  while (ids.has(id + "-" + n)) n++;
  return id + "-" + n;
}

module.exports = {
  getAll,
  getProducts,
  getCategories,
  getById,
  saveAll,
  upsert,
  remove,
  uniqueId
};
