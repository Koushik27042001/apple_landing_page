/* ============================================================
   Product Catalog Data — The Apple Store Pune (Demo)
   All prices in INR. EMI figures are illustrative (12-month
   no-cost EMI approximation) for UI demonstration only.
   ============================================================ */

const CATEGORIES = [
  { id: "iphone", name: "iPhone", tagline: "The ultimate iPhone lineup.", image: "images/hero/hero-iphone.png" },
  { id: "mac", name: "Mac", tagline: "Supercharged for pros and creators.", image: "images/hero/hero-macbook.png" },
  { id: "ipad", name: "iPad", tagline: "Your next computer isn't a computer.", image: "images/hero/hero-ipad.png" },
  { id: "watch", name: "Watch", tagline: "A healthy leap ahead.", image: "images/products/watch-series9-black.png" },
  { id: "airpods", name: "AirPods", tagline: "Immerse yourself.", image: "images/products/airpods-pro.png" },
  { id: "accessories", name: "Accessories", tagline: "Essentials for every device.", image: "images/hero/hero-accessories.png" }
];

const PRODUCTS = [
  {
    id: "iphone-15-pro-max",
    name: "iPhone 15 Pro Max",
    category: "iphone",
    brand: "Apple",
    price: 159900,
    mrp: 169900,
    badge: "Best Seller",
    rating: 4.9,
    reviews: 482,
    stock: 14,
    images: ["images/products/iphone-15-pro-max-black.png", "images/products/iphone-15-pro-blue.png"],
    colors: [
      { name: "Black Titanium", hex: "#3b3b3d", image: "images/products/iphone-15-pro-max-black.png" },
      { name: "Blue Titanium", hex: "#4c5a67", image: "images/products/iphone-15-pro-blue.png" }
    ],
    storageOptions: [
      { label: "256GB", extra: 0 },
      { label: "512GB", extra: 20000 },
      { label: "1TB", extra: 40000 }
    ],
    short: "Titanium. So strong. So light. So Pro.",
    description: "iPhone 15 Pro Max features a strong and light titanium design, the groundbreaking A17 Pro chip, a customizable Action button, and the most powerful iPhone camera system ever with 5x Telephoto.",
    specs: {
      "Display": "6.7-inch Super Retina XDR, ProMotion 120Hz",
      "Chip": "A17 Pro chip, 6-core CPU",
      "Camera": "48MP Main + 12MP Ultra Wide + 12MP 5x Telephoto",
      "Battery": "Up to 29 hours video playback",
      "Storage": "256GB / 512GB / 1TB",
      "Body": "Titanium, MagSafe, Ceramic Shield front",
      "Connectivity": "5G, USB-C, Wi-Fi 6E, Bluetooth 5.3",
      "OS": "iOS 17"
    }
  },
  {
    id: "iphone-15-pro",
    name: "iPhone 15 Pro",
    category: "iphone",
    brand: "Apple",
    price: 134900,
    mrp: 139900,
    badge: "New",
    rating: 4.8,
    reviews: 356,
    stock: 22,
    images: ["images/products/iphone-15-pro-blue.png"],
    colors: [
      { name: "Blue Titanium", hex: "#4c5a67", image: "images/products/iphone-15-pro-blue.png" },
      { name: "Black Titanium", hex: "#3b3b3d", image: "images/products/iphone-15-pro-max-black.png" }
    ],
    storageOptions: [
      { label: "128GB", extra: 0 },
      { label: "256GB", extra: 10000 },
      { label: "512GB", extra: 30000 }
    ],
    short: "Titanium design. A17 Pro chip. Action button.",
    description: "iPhone 15 Pro brings titanium design, the A17 Pro chip for console-level gaming, and a versatile pro camera system with 3x optical zoom, all in a lighter, more durable body.",
    specs: {
      "Display": "6.1-inch Super Retina XDR, ProMotion 120Hz",
      "Chip": "A17 Pro chip, 6-core CPU",
      "Camera": "48MP Main + 12MP Ultra Wide + 12MP 3x Telephoto",
      "Battery": "Up to 23 hours video playback",
      "Storage": "128GB / 256GB / 512GB",
      "Body": "Titanium, MagSafe, Ceramic Shield front",
      "Connectivity": "5G, USB-C, Wi-Fi 6E, Bluetooth 5.3",
      "OS": "iOS 17"
    }
  },
  {
    id: "iphone-15",
    name: "iPhone 15",
    category: "iphone",
    brand: "Apple",
    price: 74900,
    mrp: 79900,
    badge: "Sale",
    rating: 4.7,
    reviews: 610,
    stock: 30,
    images: ["images/products/iphone-15-pink.png"],
    colors: [
      { name: "Pink", hex: "#f2c9c2", image: "images/products/iphone-15-pink.png" },
      { name: "Blue", hex: "#7a9bc4", image: "images/products/iphone-15-pink.png" }
    ],
    storageOptions: [
      { label: "128GB", extra: 0 },
      { label: "256GB", extra: 10000 },
      { label: "512GB", extra: 30000 }
    ],
    short: "Dynamic Island. 48MP Main camera. USB-C.",
    description: "iPhone 15 features Dynamic Island, a 48MP Main camera for super-high-resolution photos, and USB-C connectivity — all powered by the A16 Bionic chip.",
    specs: {
      "Display": "6.1-inch Super Retina XDR",
      "Chip": "A16 Bionic chip",
      "Camera": "48MP Main + 12MP Ultra Wide",
      "Battery": "Up to 20 hours video playback",
      "Storage": "128GB / 256GB / 512GB",
      "Body": "Aluminium, MagSafe, Ceramic Shield front",
      "Connectivity": "5G, USB-C, Wi-Fi 6, Bluetooth 5.3",
      "OS": "iOS 17"
    }
  },
  {
    id: "iphone-14",
    name: "iPhone 14",
    category: "iphone",
    brand: "Apple",
    price: 55900,
    mrp: 69900,
    badge: "Sale",
    rating: 4.6,
    reviews: 892,
    stock: 18,
    images: ["images/products/iphone-14-blue.png"],
    colors: [
      { name: "Blue", hex: "#6f89b3", image: "images/products/iphone-14-blue.png" }
    ],
    storageOptions: [
      { label: "128GB", extra: 0 },
      { label: "256GB", extra: 10000 }
    ],
    short: "A great value big-screen iPhone.",
    description: "iPhone 14 offers a powerful dual-camera system, Crash Detection, and all-day battery life — all in a beautifully durable design with the A15 Bionic chip.",
    specs: {
      "Display": "6.1-inch Super Retina XDR",
      "Chip": "A15 Bionic chip",
      "Camera": "12MP Main + 12MP Ultra Wide",
      "Battery": "Up to 20 hours video playback",
      "Storage": "128GB / 256GB",
      "Body": "Aluminium, MagSafe, Ceramic Shield front",
      "Connectivity": "5G, Lightning, Wi-Fi 6, Bluetooth 5.3",
      "OS": "iOS 17"
    }
  },
  {
    id: "macbook-pro-14",
    name: "MacBook Pro 14\u2033 M3",
    category: "mac",
    brand: "Apple",
    price: 169900,
    mrp: 179900,
    badge: "Best Seller",
    rating: 4.9,
    reviews: 214,
    stock: 9,
    images: ["images/products/macbook-pro-black.png"],
    colors: [
      { name: "Space Black", hex: "#1c1c1e", image: "images/products/macbook-pro-black.png" }
    ],
    storageOptions: [
      { label: "512GB SSD", extra: 0 },
      { label: "1TB SSD", extra: 20000 }
    ],
    short: "Mind-blowing performance with M3 Pro.",
    description: "The 14-inch MacBook Pro with the M3 chip brings exceptional performance and up to 22 hours of battery life to a stunning Liquid Retina XDR display.",
    specs: {
      "Display": "14.2-inch Liquid Retina XDR",
      "Chip": "Apple M3 chip, 8-core CPU / 10-core GPU",
      "Memory": "8GB unified memory (up to 24GB)",
      "Battery": "Up to 22 hours",
      "Storage": "512GB / 1TB SSD",
      "Body": "Aluminium unibody, Space Black",
      "Connectivity": "Wi-Fi 6E, Bluetooth 5.3, 3x Thunderbolt 4",
      "OS": "macOS Sonoma"
    }
  },
  {
    id: "macbook-air-15",
    name: "MacBook Air 15\u2033 M2",
    category: "mac",
    brand: "Apple",
    price: 134900,
    mrp: 144900,
    badge: "New",
    rating: 4.8,
    reviews: 176,
    stock: 12,
    images: ["images/products/macbook-air-silver.png"],
    colors: [
      { name: "Silver", hex: "#e3e4e6", image: "images/products/macbook-air-silver.png" }
    ],
    storageOptions: [
      { label: "256GB SSD", extra: 0 },
      { label: "512GB SSD", extra: 15000 }
    ],
    short: "Impressively big. Impressively thin.",
    description: "MacBook Air with M2 delivers incredible performance in a strikingly thin design, with a big 15.3-inch Liquid Retina display and up to 18 hours of battery life.",
    specs: {
      "Display": "15.3-inch Liquid Retina",
      "Chip": "Apple M2 chip, 8-core CPU / 10-core GPU",
      "Memory": "8GB unified memory (up to 24GB)",
      "Battery": "Up to 18 hours",
      "Storage": "256GB / 512GB SSD",
      "Body": "Aluminium unibody, fanless design",
      "Connectivity": "Wi-Fi 6, Bluetooth 5.3, 2x Thunderbolt / USB 4",
      "OS": "macOS Sonoma"
    }
  },
  {
    id: "ipad-pro-12",
    name: "iPad Pro 12.9\u2033",
    category: "ipad",
    brand: "Apple",
    price: 112900,
    mrp: 119900,
    badge: "New",
    rating: 4.8,
    reviews: 143,
    stock: 16,
    images: ["images/products/ipad-pro-silver.png"],
    colors: [
      { name: "Silver", hex: "#e3e4e6", image: "images/products/ipad-pro-silver.png" }
    ],
    storageOptions: [
      { label: "128GB", extra: 0 },
      { label: "256GB", extra: 12000 },
      { label: "512GB", extra: 32000 }
    ],
    short: "The ultimate iPad experience with M2.",
    description: "iPad Pro features the M2 chip, a stunning Liquid Retina XDR display, and support for Apple Pencil hover — built for pro workflows on the go.",
    specs: {
      "Display": "12.9-inch Liquid Retina XDR",
      "Chip": "Apple M2 chip",
      "Camera": "12MP Wide + 10MP Ultra Wide, LiDAR",
      "Battery": "Up to 10 hours",
      "Storage": "128GB / 256GB / 512GB",
      "Body": "Aluminium unibody",
      "Connectivity": "Wi-Fi 6E, Bluetooth 5.3, Thunderbolt / USB 4",
      "OS": "iPadOS 17"
    }
  },
  {
    id: "ipad-air",
    name: "iPad Air",
    category: "ipad",
    brand: "Apple",
    price: 59900,
    mrp: 64900,
    badge: "Sale",
    rating: 4.7,
    reviews: 268,
    stock: 25,
    images: ["images/products/ipad-air-blue.png"],
    colors: [
      { name: "Blue", hex: "#6f89b3", image: "images/products/ipad-air-blue.png" }
    ],
    storageOptions: [
      { label: "64GB", extra: 0 },
      { label: "256GB", extra: 15000 }
    ],
    short: "Serious performance in a thin, light design.",
    description: "iPad Air is more capable than ever with the M1 chip, a gorgeous 10.9-inch Liquid Retina display, and support for Apple Pencil (2nd generation) and Magic Keyboard.",
    specs: {
      "Display": "10.9-inch Liquid Retina",
      "Chip": "Apple M1 chip",
      "Camera": "12MP Wide",
      "Battery": "Up to 10 hours",
      "Storage": "64GB / 256GB",
      "Body": "Aluminium unibody",
      "Connectivity": "Wi-Fi 6, Bluetooth 5.0, USB-C",
      "OS": "iPadOS 17"
    }
  },
  {
    id: "watch-series-9",
    name: "Apple Watch Series 9",
    category: "watch",
    brand: "Apple",
    price: 41900,
    mrp: 45900,
    badge: "Best Seller",
    rating: 4.8,
    reviews: 321,
    stock: 20,
    images: ["images/products/watch-series9-black.png"],
    colors: [
      { name: "Midnight", hex: "#2a2a2e", image: "images/products/watch-series9-black.png" }
    ],
    storageOptions: [
      { label: "41mm", extra: 0 },
      { label: "45mm", extra: 3000 }
    ],
    short: "Smarter. Brighter. Mightier.",
    description: "Apple Watch Series 9 introduces the new S9 chip, a magical new way to interact with your watch without touching the screen, and a brighter display.",
    specs: {
      "Display": "Always-On Retina LTPO OLED",
      "Chip": "S9 SiP with 4-core Neural Engine",
      "Health": "Blood Oxygen, ECG, Heart Rate",
      "Battery": "Up to 18 hours",
      "Case": "41mm / 45mm Aluminium",
      "Water Resistance": "50 meters",
      "Connectivity": "GPS + Cellular options, Wi-Fi, Bluetooth 5.3",
      "OS": "watchOS 10"
    }
  },
  {
    id: "watch-se",
    name: "Apple Watch SE",
    category: "watch",
    brand: "Apple",
    price: 27900,
    mrp: 31900,
    badge: "Sale",
    rating: 4.6,
    reviews: 198,
    stock: 27,
    images: ["images/products/watch-se-pink.png"],
    colors: [
      { name: "Pink", hex: "#f0b8c0", image: "images/products/watch-se-pink.png" }
    ],
    storageOptions: [
      { label: "40mm", extra: 0 },
      { label: "44mm", extra: 2500 }
    ],
    short: "A great deal to love. A great deal to give.",
    description: "Apple Watch SE has the essential features to keep you moving, motivated, and connected — including Crash Detection, and up to 18 hours of battery life.",
    specs: {
      "Display": "Retina LTPO OLED",
      "Chip": "S8 SiP",
      "Health": "Heart Rate, Crash Detection",
      "Battery": "Up to 18 hours",
      "Case": "40mm / 44mm Aluminium",
      "Water Resistance": "50 meters",
      "Connectivity": "GPS options, Wi-Fi, Bluetooth 5.3",
      "OS": "watchOS 10"
    }
  },
  {
    id: "airpods-pro-2",
    name: "AirPods Pro (2nd gen)",
    category: "airpods",
    brand: "Apple",
    price: 24900,
    mrp: 26900,
    badge: "Best Seller",
    rating: 4.9,
    reviews: 540,
    stock: 40,
    images: ["images/products/airpods-pro.png"],
    colors: [
      { name: "White", hex: "#ffffff", image: "images/products/airpods-pro.png" }
    ],
    storageOptions: [],
    short: "Adaptive Audio. Now playing.",
    description: "AirPods Pro feature up to 2x more Active Noise Cancellation, Adaptive Transparency, Personalized Spatial Audio, and a MagSafe Charging Case with speaker.",
    specs: {
      "Chip": "Apple H2 headphone chip",
      "Noise Control": "Active Noise Cancellation + Transparency",
      "Battery": "Up to 6 hours (30 hrs with case)",
      "Case": "MagSafe & Qi wireless charging",
      "Water Resistance": "IP54",
      "Connectivity": "Bluetooth 5.3"
    }
  },
  {
    id: "airpods-max",
    name: "AirPods Max",
    category: "airpods",
    brand: "Apple",
    price: 59900,
    mrp: 64900,
    badge: "New",
    rating: 4.7,
    reviews: 132,
    stock: 11,
    images: ["images/products/airpods-max.png"],
    colors: [
      { name: "Silver", hex: "#e3e4e6", image: "images/products/airpods-max.png" }
    ],
    storageOptions: [],
    short: "Computational audio. Effortlessly.",
    description: "AirPods Max reimagine over-ear headphones, with high-fidelity sound, industry-leading Active Noise Cancellation, and a breathable knit mesh canopy.",
    specs: {
      "Chip": "Apple H1 (x2)",
      "Noise Control": "Active Noise Cancellation + Transparency",
      "Battery": "Up to 20 hours",
      "Case": "Smart Case included",
      "Fit": "Breathable knit mesh canopy",
      "Connectivity": "Bluetooth 5.0"
    }
  },
  {
    id: "magsafe-charger",
    name: "MagSafe Charger",
    category: "accessories",
    brand: "Apple",
    price: 4500,
    mrp: 4900,
    badge: null,
    rating: 4.5,
    reviews: 88,
    stock: 60,
    images: ["images/products/magsafe-charger.png"],
    colors: [
      { name: "White", hex: "#ffffff", image: "images/products/magsafe-charger.png" }
    ],
    storageOptions: [],
    short: "Perfectly aligned wireless charging.",
    description: "The MagSafe Charger provides a magnetic connection to your iPhone for faster wireless charging up to 15W, perfectly aligned every time.",
    specs: {
      "Output": "Up to 15W wireless",
      "Cable Length": "1 meter, braided USB-C",
      "Compatibility": "iPhone 12 and later",
      "Connector": "USB-C"
    }
  },
  {
    id: "phone-case-clear",
    name: "Clear Case with MagSafe",
    category: "accessories",
    brand: "Apple",
    price: 3900,
    mrp: 4500,
    badge: "Sale",
    rating: 4.4,
    reviews: 156,
    stock: 75,
    images: ["images/products/phone-case-clear.png"],
    colors: [
      { name: "Clear", hex: "#f2f2f2", image: "images/products/phone-case-clear.png" }
    ],
    storageOptions: [],
    short: "Slim protection that shows off your iPhone.",
    description: "This slim, transparent case shows off your iPhone's design while providing responsive tactile buttons and precise alignment for MagSafe accessories.",
    specs: {
      "Material": "Flexible transparent polycarbonate",
      "Protection": "Drop protection up to 2m",
      "Compatibility": "MagSafe ready",
      "Style": "Slim fit, scratch resistant"
    }
  },
  {
    id: "power-adapter-20w",
    name: "20W USB-C Power Adapter",
    category: "accessories",
    brand: "Apple",
    price: 1900,
    mrp: 2200,
    badge: null,
    rating: 4.6,
    reviews: 210,
    stock: 100,
    images: ["images/products/power-adapter.png"],
    colors: [
      { name: "White", hex: "#ffffff", image: "images/products/power-adapter.png" }
    ],
    storageOptions: [],
    short: "Fast, efficient charging at home or on the go.",
    description: "This compact and efficient 20W USB-C Power Adapter enables fast charging capability for your iPhone, iPad, or other USB-C device.",
    specs: {
      "Output": "20W USB-C Power Delivery",
      "Input": "100-240V AC",
      "Compatibility": "iPhone, iPad, AirPods",
      "Weight": "32.5g"
    }
  },
  {
    id: "usb-c-cable",
    name: "USB-C Charge Cable (2m)",
    category: "accessories",
    brand: "Apple",
    price: 1900,
    mrp: 2100,
    badge: "New",
    rating: 4.5,
    reviews: 97,
    stock: 90,
    images: ["images/products/usb-c-cable.png"],
    colors: [
      { name: "White", hex: "#ffffff", image: "images/products/usb-c-cable.png" }
    ],
    storageOptions: [],
    short: "Durable braided cable for fast charging & sync.",
    description: "The USB-C Charge Cable connects your USB-C-enabled Mac, iPad, or iPhone to a USB-C power adapter for fast, efficient charging, with a durable braided design.",
    specs: {
      "Length": "2 meters",
      "Connector": "USB-C to USB-C",
      "Design": "Braided, tangle resistant",
      "Compatibility": "USB-C devices, supports USB-PD"
    }
  }
];

/* ---------- Helper functions shared across pages ---------- */

function formatINR(amount) {
  return "\u20B9" + Math.round(amount).toLocaleString("en-IN");
}

function getEmi(price, months) {
  months = months || 12;
  // Simple no-cost EMI approximation for display purposes only.
  return Math.ceil(price / months);
}

function getProductById(id) {
  return PRODUCTS.find(function (p) { return p.id === id; });
}

function getProductsByCategory(catId) {
  if (!catId || catId === "all") return PRODUCTS.slice();
  return PRODUCTS.filter(function (p) { return p.category === catId; });
}

function getCategoryById(id) {
  return CATEGORIES.find(function (c) { return c.id === id; });
}

function searchProducts(query) {
  query = (query || "").trim().toLowerCase();
  if (!query) return [];
  return PRODUCTS.filter(function (p) {
    return p.name.toLowerCase().indexOf(query) !== -1 ||
      p.category.toLowerCase().indexOf(query) !== -1 ||
      p.short.toLowerCase().indexOf(query) !== -1;
  });
}
