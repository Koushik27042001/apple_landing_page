const express = require("express");
const { PRODUCTS, CATEGORIES } = require("../lib/catalog");

const router = express.Router();

router.get("/", function (req, res) {
  res.json({ products: PRODUCTS, categories: CATEGORIES });
});

router.get("/:id", function (req, res) {
  const product = PRODUCTS.find(function (p) { return p.id === req.params.id; });
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json({ product: product });
});

module.exports = router;
