const express = require("express");
const productsStore = require("../lib/productsStore");

const router = express.Router();

router.get("/", async function (req, res, next) {
  try {
    const data = await productsStore.getAll();
    res.json({ products: data.products, categories: data.categories, updatedAt: data.updatedAt });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async function (req, res, next) {
  try {
    const product = await productsStore.getById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json({ product: product });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
