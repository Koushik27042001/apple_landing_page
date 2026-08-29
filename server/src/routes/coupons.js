const express = require("express");
const couponsStore = require("../lib/couponsStore");

const router = express.Router();

/* Public coupon validation — used by checkout before placing order. */
router.post("/validate", async function (req, res, next) {
  try {
    const code = req.body && req.body.code;
    const subtotal = Number(req.body && req.body.subtotal) || 0;
    const result = await couponsStore.applyCoupon(code, subtotal);
    if (!result.ok) return res.status(400).json({ error: result.error });
    res.json({
      code: result.coupon.code,
      type: result.coupon.type,
      value: result.coupon.value,
      discount: result.discount
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
