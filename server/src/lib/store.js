/* Order store — MongoDB when connected, otherwise JSON files. */

const { readJson, writeJson } = require("./jsonDb");
const { isConnected } = require("./mongo");
const { Order } = require("../models");

const FILE = "orders.json";

function strip(doc) {
  if (!doc) return null;
  const obj = typeof doc.toObject === "function" ? doc.toObject() : Object.assign({}, doc);
  delete obj._id;
  delete obj.__v;
  return obj;
}

function readFileOrders() {
  const data = readJson(FILE, { orders: [] });
  return Array.isArray(data.orders) ? data.orders : [];
}

function writeFileOrders(orders) {
  writeJson(FILE, { orders: orders, updatedAt: new Date().toISOString() });
}

async function readAll() {
  if (isConnected()) {
    const orders = await Order.find({}).lean();
    return orders.map(strip);
  }
  return readFileOrders();
}

async function createOrder(order) {
  if (isConnected()) {
    const created = await Order.create(order);
    return strip(created);
  }
  const orders = readFileOrders();
  orders.push(order);
  writeFileOrders(orders);
  return order;
}

async function getOrder(id) {
  if (isConnected()) {
    const order = await Order.findOne({ id: id }).lean();
    return strip(order);
  }
  return readFileOrders().find(function (o) { return o.id === id; }) || null;
}

async function updateOrder(id, patch) {
  if (isConnected()) {
    const updated = await Order.findOneAndUpdate(
      { id: id },
      { $set: Object.assign({}, patch, { updatedAt: new Date().toISOString() }) },
      { new: true }
    ).lean();
    return strip(updated);
  }
  const orders = readFileOrders();
  const idx = orders.findIndex(function (o) { return o.id === id; });
  if (idx < 0) return null;
  orders[idx] = Object.assign({}, orders[idx], patch, { updatedAt: new Date().toISOString() });
  writeFileOrders(orders);
  return orders[idx];
}

async function findByRazorpayOrderId(razorpayOrderId) {
  if (isConnected()) {
    const order = await Order.findOne({ razorpayOrderId: razorpayOrderId }).lean();
    return strip(order);
  }
  return readFileOrders().find(function (o) { return o.razorpayOrderId === razorpayOrderId; }) || null;
}

module.exports = { readAll, createOrder, getOrder, updateOrder, findByRazorpayOrderId };
