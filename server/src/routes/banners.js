const express = require("express");
const bannersStore = require("../lib/bannersStore");

const router = express.Router();

router.get("/", async function (req, res, next) {
  try {
    const { placement, category } = req.query;
    if (placement || category) {
      const active = await bannersStore.getActive(placement, category);
      return res.json({ banners: active });
    }
    const allActive = await bannersStore.getActive();
    res.json({ banners: allActive });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async function (req, res, next) {
  try {
    const banner = await bannersStore.getById(req.params.id);
    if (!banner) return res.status(404).json({ error: "Banner not found." });
    res.json({ banner: banner });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
