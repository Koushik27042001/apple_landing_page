const Razorpay = require("razorpay");

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

if (!keyId || !keySecret || keyId.indexOf("xxxx") !== -1) {
  console.warn(
    "\n[warn] RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET are not set (or still placeholders) in server/.env.\n" +
    "       Payment endpoints will respond with a clear error until real Razorpay TEST keys are added.\n" +
    "       Get free test keys at https://dashboard.razorpay.com/app/keys\n"
  );
}

const razorpay = keyId && keySecret && keyId.indexOf("xxxx") === -1
  ? new Razorpay({ key_id: keyId, key_secret: keySecret })
  : null;

module.exports = { razorpay, keyId };
