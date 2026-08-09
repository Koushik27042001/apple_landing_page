/* Minimal JSON-file-backed data store for orders.
   Good enough for a low-traffic launch / demo. For real production
   traffic, swap this module out for PostgreSQL/MongoDB — the rest of
   the codebase only talks to the functions exported here, so that
   swap does not require touching any route files. */

const fs = require("fs");
const path = require("path");

const DB_FILE = path.join(__dirname, "../../data/orders.json");

function readAll() {
  try {
    const raw = fs.readFileSync(DB_FILE, "utf8");
    return JSON.parse(raw || "[]");
  } catch (e) {
    return [];
  }
}

function writeAll(orders) {
  fs.writeFileSync(DB_FILE, JSON.stringify(orders, null, 2), "utf8");
}

function createOrder(order) {
  const orders = readAll();
  orders.push(order);
  writeAll(orders);
  return order;
}

function getOrder(id) {
  return readAll().find(function (o) { return o.id === id; });
}

function updateOrder(id, patch) {
  const orders = readAll();
  const idx = orders.findIndex(function (o) { return o.id === id; });
  if (idx === -1) return null;
  orders[idx] = Object.assign({}, orders[idx], patch, { updatedAt: new Date().toISOString() });
  writeAll(orders);
  return orders[idx];
}

function findByRazorpayOrderId(razorpayOrderId) {
  return readAll().find(function (o) { return o.razorpayOrderId === razorpayOrderId; });
}

module.exports = { readAll, createOrder, getOrder, updateOrder, findByRazorpayOrderId };
