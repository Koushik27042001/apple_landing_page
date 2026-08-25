const express = require("express");
const productsStore = require("../lib/productsStore");

const router = express.Router();

router.get("/", function (req, res) {
  const data = productsStore.getAll();
  res.json({ products: data.products, categories: data.categories, updatedAt: data.updatedAt });
});

router.get("/:id", function (req, res) {
  const product = productsStore.getById(req.params.id);
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json({ product: product });
});

module.exports = router;
