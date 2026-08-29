const seed = require("../../../client/js/data.js");
const { readJson, writeJson } = require("./jsonDb");
const { isConnected } = require("./mongo");
const { Product, Category, toPlain } = require("../models");

const FILE = "products.json";

function emptyCatalog() {
  return { products: [], categories: [], updatedAt: null };
}

function readFileCatalog() {
  const data = readJson(FILE, null);
  if (!data || !Array.isArray(data.products)) return emptyCatalog();
  return {
    products: data.products,
    categories: Array.isArray(data.categories) ? data.categories : [],
    updatedAt: data.updatedAt || null
  };
}

function writeFileCatalog(products, categories) {
  const payload = {
    products: products || [],
    categories: categories || [],
    updatedAt: new Date().toISOString()
  };
  writeJson(FILE, payload);
  return payload;
}

async function seedIfNeeded() {
  if (isConnected()) {
    const count = await Product.countDocuments();
    if (count > 0) {
      const categories = await Category.find({}).lean();
      if (!categories.length && seed.CATEGORIES) {
        await Category.insertMany(seed.CATEGORIES);
      }
      return;
    }
    console.log("[mongo] Seeding products from client/js/data.js …");
    await Product.insertMany(seed.PRODUCTS);
    await Category.deleteMany({});
    await Category.insertMany(seed.CATEGORIES);
    console.log("[mongo] Seeded", seed.PRODUCTS.length, "products,", seed.CATEGORIES.length, "categories");
    return;
  }

  const data = readFileCatalog();
  if (data.products.length) return;
  console.log("[json] Seeding products from client/js/data.js …");
  writeFileCatalog(seed.PRODUCTS, seed.CATEGORIES);
}

async function getCategories() {
  await seedIfNeeded();
  if (isConnected()) {
    const cats = await Category.find({}).lean();
    return cats.map(function (c) {
      return { id: c.id, name: c.name, tagline: c.tagline || "", image: c.image || "" };
    });
  }
  return readFileCatalog().categories;
}

async function getProducts() {
  await seedIfNeeded();
  if (isConnected()) {
    const products = await Product.find({}).lean();
    return products.map(function (p) {
      const plain = toPlain(p);
      if (plain.mrp == null) plain.mrp = plain.price;
      return plain;
    });
  }
  return readFileCatalog().products.map(function (p) {
    if (p.mrp == null) p.mrp = p.price;
    return p;
  });
}

async function getAll() {
  const products = await getProducts();
  const categories = await getCategories();
  return { products: products, categories: categories, updatedAt: new Date().toISOString() };
}

async function getById(id) {
  await seedIfNeeded();
  if (isConnected()) {
    const product = await Product.findOne({ id: id }).lean();
    return product ? toPlain(product) : null;
  }
  return readFileCatalog().products.find(function (p) { return p.id === id; }) || null;
}

async function saveAll(products, categories) {
  if (isConnected()) {
    await Product.deleteMany({});
    if (products && products.length) await Product.insertMany(products);
    if (categories) {
      await Category.deleteMany({});
      if (categories.length) await Category.insertMany(categories);
    }
    return getAll();
  }
  return writeFileCatalog(products, categories);
}

async function upsert(product) {
  if (isConnected()) {
    await Product.findOneAndUpdate(
      { id: product.id },
      { $set: product },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    return getAll();
  }
  const data = readFileCatalog();
  const idx = data.products.findIndex(function (p) { return p.id === product.id; });
  if (idx >= 0) data.products[idx] = product;
  else data.products.push(product);
  return writeFileCatalog(data.products, data.categories);
}

async function remove(id) {
  if (isConnected()) {
    const result = await Product.deleteOne({ id: id });
    if (!result.deletedCount) return null;
    return getAll();
  }
  const data = readFileCatalog();
  const next = data.products.filter(function (p) { return p.id !== id; });
  if (next.length === data.products.length) return null;
  return writeFileCatalog(next, data.categories);
}

function slugify(name) {
  return String(name || "product")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48) || "product";
}

async function uniqueId(base) {
  let id = slugify(base);
  const products = await getProducts();
  const ids = new Set(products.map(function (p) { return p.id; }));
  if (!ids.has(id)) return id;
  let n = 2;
  while (ids.has(id + "-" + n)) n++;
  return id + "-" + n;
}

module.exports = {
  seedIfNeeded,
  getAll,
  getProducts,
  getCategories,
  getById,
  saveAll,
  upsert,
  remove,
  uniqueId
};
