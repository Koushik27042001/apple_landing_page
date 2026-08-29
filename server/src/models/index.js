const { mongoose } = require("../lib/mongo");

const productSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    category: { type: String, default: "accessories" },
    brand: { type: String, default: "Apple" },
    price: { type: Number, required: true },
    mrp: { type: Number },
    badge: { type: String, default: null },
    rating: { type: Number, default: 4.5 },
    reviews: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    images: { type: [String], default: [] },
    colors: { type: [mongoose.Schema.Types.Mixed], default: [] },
    storageOptions: { type: [mongoose.Schema.Types.Mixed], default: [] },
    short: { type: String, default: "" },
    description: { type: String, default: "" },
    specs: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { timestamps: true, versionKey: false }
);

const categorySchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    tagline: { type: String, default: "" },
    image: { type: String, default: "" }
  },
  { timestamps: true, versionKey: false }
);

const couponSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    code: { type: String, required: true, unique: true, uppercase: true, index: true },
    type: { type: String, enum: ["percent", "fixed"], default: "percent" },
    value: { type: Number, required: true },
    minOrder: { type: Number, default: 0 },
    maxDiscount: { type: Number, default: null },
    usageLimit: { type: Number, default: null },
    usedCount: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
    startsAt: { type: String, default: null },
    endsAt: { type: String, default: null },
    note: { type: String, default: "" }
  },
  { timestamps: true, versionKey: false }
);

const orderSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    razorpayOrderId: { type: String, default: null, index: true },
    razorpayPaymentId: { type: String, default: null },
    status: { type: String, default: "created", index: true },
    items: { type: [mongoose.Schema.Types.Mixed], default: [] },
    subtotal: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    coupon: { type: mongoose.Schema.Types.Mixed, default: null },
    shipping: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    currency: { type: String, default: "INR" },
    customer: { type: mongoose.Schema.Types.Mixed, default: {} },
    shippingAddress: { type: mongoose.Schema.Types.Mixed, default: {} },
    failureReason: { type: String, default: null },
    paidAt: { type: String, default: null },
    webhookConfirmedAt: { type: String, default: null },
    createdAt: { type: String, default: function () { return new Date().toISOString(); } },
    updatedAt: { type: String, default: null }
  },
  { versionKey: false }
);

const settingsSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: "store" },
    storeName: String,
    email: String,
    phones: [String],
    whatsapp: String,
    address: [String],
    mapLink: String,
    shippingFee: Number,
    shippingThreshold: Number,
    announcement: String,
    updatedAt: String
  },
  { versionKey: false }
);

const adminSessionSchema = new mongoose.Schema(
  {
    token: { type: String, required: true, unique: true, index: true },
    createdAt: { type: String, required: true },
    expiresAt: { type: Date, required: true }
  },
  { versionKey: false }
);

adminSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

function toPlain(doc) {
  if (!doc) return null;
  const obj = typeof doc.toObject === "function" ? doc.toObject() : doc;
  delete obj._id;
  delete obj.__v;
  delete obj.createdAt;
  delete obj.updatedAt;
  return obj;
}

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);
const Coupon = mongoose.models.Coupon || mongoose.model("Coupon", couponSchema);
const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
const Settings = mongoose.models.Settings || mongoose.model("Settings", settingsSchema);
const AdminSession = mongoose.models.AdminSession || mongoose.model("AdminSession", adminSessionSchema);

module.exports = {
  Product,
  Category,
  Coupon,
  Order,
  Settings,
  AdminSession,
  toPlain
};
