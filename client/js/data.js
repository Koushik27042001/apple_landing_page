/* ============================================================
   Product Catalog Data — The Apple Store Pune
   All prices in INR, matching Apple India's official price list
   for the current lineup. EMI figures are illustrative (12-month
   no-cost EMI approximation) for UI demonstration only.
   ============================================================ */

const CATEGORIES = [
  { id: "mac", name: "Mac", tagline: "Supercharged for pros and creators.", image: "images/hero/images.jpeg" },
  { id: "ipad", name: "iPad", tagline: "Your next computer isn't a computer.", image: "images/hero/hero-ipad.png" },
  { id: "iphone", name: "iPhone", tagline: "The ultimate iPhone lineup.", image: "images/products/iphone-17-pro-orange.jpeg" },
  { id: "watch", name: "Watch", tagline: "A healthy leap ahead.", image: "images/products/watch-ultra3-titanium.png" },
  { id: "vision", name: "Vision", tagline: "Welcome to the era of spatial computing.", image: "images/products/apple-vision-pro.png" },
  { id: "airpods", name: "AirPods", tagline: "Immerse yourself.", image: "images/products/airpods-pro.png" },
  { id: "tvhome", name: "TV & Home", tagline: "Entertainment and smart home, elevated.", image: "images/products/apple-tv-4k.png" },
  { id: "accessories", name: "Accessories", tagline: "Essentials, cases &amp; AppleCare+.", image: "images/hero/hero-accessories.png" }
];

const IPHONE_OFFICIAL_IMAGES = {
  duo: "images/hero/iphone_duo__hefmlegzwbmi_large_2x.png",
  pro18: "images/hero/iphone_18_pro__dj48ysc0yagm_large_2x.png",
  air: "images/hero/iphone_air__b5qmgl05ojyq_large_2x.png",
  iphone17: "images/hero/iphone_17__fb1277oq3eaa_large_2x.png",
  iphone17e: "images/hero/iphone_17e__cq5ygzct314y_large_2x.png",
  iphone16: "images/hero/iphone_16__b6tkv86m2gc2_large_2x.png",
  shop: "images/hero/shop__dmmu8wcl1iie_large_2x.png",
  ios: "images/hero/ios__8z58j1o80yqi_large_2x.png",
  accessories: "images/hero/accessories__ghgqo4vsxcqe_large_2x.png",
  compare: "images/hero/compare__e479gubocjau_large_2x.png"
};

const WATCH_OFFICIAL_IMAGES = {
  s12: "images/hero/watch/nav_s12_f44b9543e.png",
  ultra4: "images/hero/watch/nav_ultra4_9058c8c8d.png",
  se3: "images/hero/watch/nav_se3_67e2d8619.png",
  nike: "images/hero/watch/nav_nike_54b594efc.png",
  bands: "images/hero/watch/nav_bands_1f41ae96b.png",
  compare: "images/hero/watch/nav_compare_49d773718.png",
  accessories: "images/hero/watch/nav_accessories_dd24224d8_small.png",
  fitness: "images/hero/watch/nav_fitness_d3886b6a7.png",
  os: "images/hero/watch/nav_os_da52c9155.png",
  shop: "images/hero/watch/nav_shop_130ff8980.png"
};

const MAC_OFFICIAL_IMAGES = {
  mbp: "images/hero/mac/nav_mbp_bfa749034.png",
  mba: "images/hero/mac/nav_mba_ea12e0d5b.png",
  imac: "images/hero/mac/nav_imac_24_832584093.png",
  macMini: "images/hero/mac/nav_mac_mini_bff82a643.png",
  macStudio: "images/hero/mac/nav_mac_studio_f2f3212ea.png",
  macbook: "images/hero/mac/nav_mbn_1fa302e95.png",
  displays: "images/hero/mac/nav_displays_7c0628398.png",
  compare: "images/hero/mac/nav_compare_cacd858a8.png",
  accessories: "images/hero/mac/nav_accessories_2a4e78f16.png",
  macos: "images/hero/mac/nav_macos_889578ffc.png",
  shop: "images/hero/mac/nav_shop_mac_0f8893308.png"
};

const IPAD_OFFICIAL_IMAGES = {
  pro: "images/hero/ipad/ipad_pro_8c6c9576c.png",
  air: "images/hero/ipad/ipad_air_a25153037.png",
  ipad: "images/hero/ipad/ipad_9308ca47a.png",
  mini: "images/hero/ipad/ipad_mini_6884caafc.png",
  pencil: "images/hero/ipad/apple_pencil_6c8408c54.png",
  keyboards: "images/hero/ipad/keyboards_c8202d7ef.png",
  compare: "images/hero/ipad/compare_b74d7a1e3.png",
  accessories: "images/hero/ipad/accessories_d7234e26e.png",
  shop: "images/hero/ipad/shop_ipad_fad2a5a84.png",
  ipados: "images/hero/ipad/ipados_14bbae36a.png"
};

const PRODUCTS = [



  {
    id: "iphone-duo",
    name: "iPhone Duo",
    category: "iphone",
    brand: "Apple",
    price: 299900,
    mrp: 299900,
    badge: "New",
    rating: 4.9,
    reviews: 18,
    stock: 6,
    images: [IPHONE_OFFICIAL_IMAGES.duo],
    colors: [
      { name: "Night Sky", hex: "#2f3a49", image: IPHONE_OFFICIAL_IMAGES.duo },
      { name: "Star White", hex: "#f4f2ee", image: IPHONE_OFFICIAL_IMAGES.duo }
    ],
    storageOptions: [
      { label: "256GB", extra: 0 },
      { label: "512GB", extra: 24000 },
      { label: "1TB", extra: 74000 },
      { label: "2TB", extra: 150000 }
    ],
    short: "The largest iPhone display ever. Foldable. Poseable. Durable.",
    description: "iPhone Duo brings a foldable titanium design, a 7.6-inch inner display, a 5.4-inch outer display, A20 Pro, and reimagined iOS 27 experiences.",
    specs: {
      "Display": "7.6-inch folding Super Retina XDR inner display + 5.4-inch outer display",
      "Chip": "A20 Pro chip",
      "Camera": "48MP Dual Fusion camera system",
      "Battery": "Up to 44 hours video playback on the outer display",
      "Storage": "256GB / 512GB / 1TB / 2TB",
      "Body": "Titanium foldable design",
      "Connectivity": "5G, Wi-Fi 7, Bluetooth 6, eSIM",
      "OS": "iOS 27"
    }
  },
  {
    id: "iphone-18-pro",
    name: "iPhone 18 Pro",
    category: "iphone",
    brand: "Apple",
    price: 164900,
    mrp: 164900,
    badge: "New",
    rating: 4.9,
    reviews: 42,
    stock: 12,
    images: [IPHONE_OFFICIAL_IMAGES.pro18],
    colors: [
      { name: "Burgundy", hex: "#4d2028", image: IPHONE_OFFICIAL_IMAGES.pro18 },
      { name: "Glacier", hex: "#dce7ee", image: IPHONE_OFFICIAL_IMAGES.pro18 },
      { name: "Silver", hex: "#e3e4e6", image: IPHONE_OFFICIAL_IMAGES.pro18 },
      { name: "Black", hex: "#1c1c1e", image: IPHONE_OFFICIAL_IMAGES.pro18 }
    ],
    storageOptions: [
      { label: "256GB", extra: 0 },
      { label: "512GB", extra: 25000 },
      { label: "1TB", extra: 75000 },
      { label: "2TB", extra: 150000 }
    ],
    short: "A big leap in battery life, performance, and camera.",
    description: "iPhone 18 Pro features A20 Pro, a vapour chamber, a 48MP Pro Fusion camera system with variable aperture, and up to 43 hours of video playback on Pro Max.",
    specs: {
      "Display": "6.3-inch or 6.9-inch Super Retina XDR, ProMotion 120Hz",
      "Chip": "A20 Pro chip",
      "Camera": "48MP Pro Fusion camera system with variable aperture",
      "Battery": "Up to 43 hours video playback on iPhone 18 Pro Max",
      "Storage": "256GB / 512GB / 1TB / 2TB",
      "Body": "Aluminium unibody",
      "Connectivity": "5G, Wi-Fi 7, Bluetooth 6",
      "OS": "iOS 27"
    }
  },
  {
    id: "iphone-17e",
    name: "iPhone 17e",
    category: "iphone",
    brand: "Apple",
    price: 79900,
    mrp: 79900,
    badge: "New",
    rating: 4.6,
    reviews: 128,
    stock: 24,
    images: [IPHONE_OFFICIAL_IMAGES.iphone17e],
    colors: [
      { name: "Black", hex: "#1c1c1e", image: IPHONE_OFFICIAL_IMAGES.iphone17e },
      { name: "White", hex: "#f5f5f0", image: IPHONE_OFFICIAL_IMAGES.iphone17e },
      { name: "Soft Pink", hex: "#f2c6cf", image: IPHONE_OFFICIAL_IMAGES.iphone17e }
    ],
    storageOptions: [
      { label: "256GB", extra: 0 },
      { label: "512GB", extra: 20000 }
    ],
    short: "The most affordable way into the iPhone 17 lineup.",
    description: "iPhone 17e brings the power of the A18 chip, a 48MP Fusion camera, and all-day battery life to the most accessible iPhone yet.",
    specs: {
      "Model No.": "MHRV4HN/A (Black), MHRW4HN/A (White), MHRX4HN/A (Soft Pink)",
      "Display": "6.1-inch Super Retina XDR",
      "Chip": "Apple A18 chip",
      "Camera": "48MP Fusion camera",
      "Battery": "Up to 26 hours video playback",
      "Storage": "256GB / 512GB",
      "Body": "Aluminium, Ceramic Shield front and back",
      "Connectivity": "5G, USB-C, Wi-Fi 6, Bluetooth 5.3",
      "OS": "iOS 27"
    }
  },
  {
    id: "iphone-17",
    name: "iPhone 17",
    category: "iphone",
    brand: "Apple",
    price: 99900,
    mrp: 99900,
    badge: "New",
    rating: 4.8,
    reviews: 96,
    stock: 30,
    images: [IPHONE_OFFICIAL_IMAGES.iphone17],
    colors: [
      { name: "Black", hex: "#1c1c1e", image: IPHONE_OFFICIAL_IMAGES.iphone17 },
      { name: "White", hex: "#f5f5f5", image: IPHONE_OFFICIAL_IMAGES.iphone17 },
      { name: "Mist Blue", hex: "#a9c4d9", image: IPHONE_OFFICIAL_IMAGES.iphone17 },
      { name: "Lavender", hex: "#c9b8e0", image: IPHONE_OFFICIAL_IMAGES.iphone17 },
      { name: "Sage", hex: "#b7c4ab", image: IPHONE_OFFICIAL_IMAGES.iphone17 }
    ],
    storageOptions: [
      { label: "256GB", extra: 0 },
      { label: "512GB", extra: 20000 }
    ],
    short: "A total powerhouse. Now in five gorgeous colors.",
    description: "iPhone 17 features a 6.3-inch ProMotion display, the A19 chip, and a 48MP Dual Fusion camera system — all in a durable Ceramic Shield 2 design.",
    specs: {
      "Model No.": "MG6J–MG6N4HN/A (256GB), MG6P–MG6V4HN/A (512GB)",
      "Display": "6.3-inch Super Retina XDR, ProMotion 120Hz",
      "Chip": "A19 chip, 6-core CPU",
      "Camera": "48MP Fusion Main + 48MP Ultra Wide",
      "Battery": "Up to 30 hours video playback",
      "Storage": "256GB / 512GB",
      "Body": "Aluminium, Ceramic Shield 2 front and back",
      "Connectivity": "5G, USB-C, Wi-Fi 7, Bluetooth 6",
      "OS": "iOS 27"
    }
  },
  {
    id: "iphone-air",
    name: "iPhone Air",
    category: "iphone",
    brand: "Apple",
    price: 149900,
    mrp: 149900,
    badge: "New",
    rating: 4.7,
    reviews: 64,
    stock: 18,
    images: [IPHONE_OFFICIAL_IMAGES.air],
    colors: [
      { name: "Space Black", hex: "#1c1c1e", image: IPHONE_OFFICIAL_IMAGES.air },
      { name: "Cloud White", hex: "#f5f5f0", image: IPHONE_OFFICIAL_IMAGES.air },
      { name: "Light Gold", hex: "#e6d2a8", image: IPHONE_OFFICIAL_IMAGES.air },
      { name: "Sky Blue", hex: "#b9d9ef", image: IPHONE_OFFICIAL_IMAGES.air }
    ],
    storageOptions: [
      { label: "256GB", extra: 0 },
      { label: "512GB", extra: 20000 },
      { label: "1TB", extra: 40000 }
    ],
    short: "Astonishingly thin. Astonishingly capable.",
    description: "iPhone Air is Apple's thinnest iPhone ever, built around the A19 Pro chip with a striking titanium frame and an advanced single-lens camera system that shoots like a Pro.",
    specs: {
      "Model No.": "MG2L–MG304HN/A",
      "Display": "6.5-inch Super Retina XDR, ProMotion 120Hz",
      "Chip": "A19 Pro chip, 6-core CPU",
      "Camera": "48MP Fusion Main camera",
      "Battery": "Up to 27 hours video playback",
      "Storage": "256GB / 512GB / 1TB",
      "Body": "Titanium frame, Ceramic Shield 2 front and back",
      "Connectivity": "5G (eSIM only), USB-C, Wi-Fi 7, Bluetooth 6",
      "OS": "iOS 27"
    }
  },
  {
    id: "iphone-17-pro",
    name: "iPhone 17 Pro",
    category: "iphone",
    brand: "Apple",
    price: 134900,
    mrp: 134900,
    badge: "Best Seller",
    rating: 4.9,
    reviews: 210,
    stock: 22,
    images: [
      "images/products/iphone-17-pro-orange.jpeg",
      "images/products/iphone-17-pro-silver.png"
    ],
    colors: [
      { name: "Cosmic Orange", hex: "#e36414", image: "images/products/iphone-17-pro-orange.jpeg" },
      { name: "Silver", hex: "#e3e4e6", image: "images/products/iphone-17-pro-silver.png" },
      { name: "Deep Blue", hex: "#35507a", image: "images/products/iphone-17-pro-silver.png" }
    ],
    storageOptions: [
      { label: "256GB", extra: 0 },
      { label: "512GB", extra: 20000 },
      { label: "1TB", extra: 40000 }
    ],
    short: "Forged in aluminium. Powered by A19 Pro.",
    description: "iPhone 17 Pro features a new forged-aluminium unibody design, the blazing-fast A19 Pro chip with a vapor chamber, and a full triple 48MP Pro camera system with up to 8x optical-quality zoom.",
    specs: {
      "Model No.": "MG8G–MG8R4HN/A",
      "Display": "6.3-inch Super Retina XDR, ProMotion 120Hz",
      "Chip": "A19 Pro chip, 6-core CPU with vapor chamber cooling",
      "Camera": "48MP Main + 48MP Ultra Wide + 48MP 8x Telephoto",
      "Battery": "Up to 33 hours video playback",
      "Storage": "256GB / 512GB / 1TB",
      "Body": "Forged aluminium unibody, Ceramic Shield 2 front and back",
      "Connectivity": "5G, USB-C 3, Wi-Fi 7, Bluetooth 6",
      "OS": "iOS 19"
    }
  },
  {
    id: "iphone-17-pro-max",
    name: "iPhone 17 Pro Max",
    category: "iphone",
    brand: "Apple",
    price: 149900,
    mrp: 149900,
    badge: "Best Seller",
    rating: 4.9,
    reviews: 356,
    stock: 16,
    images: [
      "images/products/iphone-17-pro-orange.jpeg",
      "images/products/iphone-17-pro-silver.png"
    ],
    colors: [
      { name: "Cosmic Orange", hex: "#e36414", image: "images/products/iphone-17-pro-orange.jpeg" },
      { name: "Silver", hex: "#e3e4e6", image: "images/products/iphone-17-pro-silver.png" },
      { name: "Deep Blue", hex: "#35507a", image: "images/products/iphone-17-pro-silver.png" }
    ],
    storageOptions: [
      { label: "256GB", extra: 0 },
      { label: "512GB", extra: 20000 },
      { label: "1TB", extra: 40000 },
      { label: "2TB", extra: 80000 }
    ],
    short: "The biggest, most capable Pro. Ever.",
    description: "iPhone 17 Pro Max pairs the largest iPhone display ever with the longest battery life of any iPhone, all driven by the A19 Pro chip and a pro-grade triple-camera system.",
    specs: {
      "Model No.": "MFYM–MGO14HN/A",
      "Display": "6.9-inch Super Retina XDR, ProMotion 120Hz",
      "Chip": "A19 Pro chip, 6-core CPU with vapor chamber cooling",
      "Camera": "48MP Main + 48MP Ultra Wide + 48MP 8x Telephoto",
      "Battery": "Up to 39 hours video playback",
      "Storage": "256GB / 512GB / 1TB / 2TB",
      "Body": "Forged aluminium unibody, Ceramic Shield 2 front and back",
      "Connectivity": "5G, USB-C 3, Wi-Fi 7, Bluetooth 6",
      "OS": "iOS 19"
    }
  },
  {
    id: "iphone-16",
    name: "iPhone 16",
    category: "iphone",
    brand: "Apple",
    price: 89900,
    mrp: 89900,
    badge: null,
    rating: 4.7,
    reviews: 118,
    stock: 20,
    images: [IPHONE_OFFICIAL_IMAGES.iphone16],
    colors: [
      { name: "Ultramarine", hex: "#8aa7e8", image: IPHONE_OFFICIAL_IMAGES.iphone16 },
      { name: "Teal", hex: "#8fc4bd", image: IPHONE_OFFICIAL_IMAGES.iphone16 },
      { name: "Pink", hex: "#f1b8c8", image: IPHONE_OFFICIAL_IMAGES.iphone16 },
      { name: "White", hex: "#f5f5f0", image: IPHONE_OFFICIAL_IMAGES.iphone16 },
      { name: "Black", hex: "#1c1c1e", image: IPHONE_OFFICIAL_IMAGES.iphone16 }
    ],
    storageOptions: [
      { label: "128GB", extra: 0 },
      { label: "256GB", extra: 10000 },
      { label: "512GB", extra: 30000 }
    ],
    short: "Built for Apple Intelligence with the A18 chip.",
    description: "iPhone 16 features the A18 chip, Camera Control, Action button, and a 48MP Fusion camera in a durable aluminium design.",
    specs: {
      "Display": "6.1-inch Super Retina XDR",
      "Chip": "A18 chip",
      "Camera": "48MP Fusion camera",
      "Battery": "Up to 22 hours video playback",
      "Storage": "128GB / 256GB / 512GB",
      "Body": "Aluminium frame, Ceramic Shield front",
      "Connectivity": "5G, USB-C, Wi-Fi 7, Bluetooth 5.3",
      "OS": "iOS 27 compatible"
    }
  },

  /* =============================== Mac =============================== */

  {
    id: "macbook-neo-13",
    name: "MacBook (13-inch, A18 Pro)",
    category: "mac",
    brand: "Apple",
    price: 79900,
    mrp: 79900,
    badge: "New",
    rating: 4.6,
    reviews: 58,
    stock: 20,
    images: ["images/products/macbook-neo-silver.png"],
    colors: [
      { name: "Silver", hex: "#e3e4e6", image: "images/products/macbook-neo-silver.png" },
      { name: "Citrus", hex: "#f2c14e", image: "images/products/macbook-neo-silver.png" },
      { name: "Indigo", hex: "#4b4e8f", image: "images/products/macbook-neo-silver.png" },
      { name: "Blush", hex: "#f1c8c8", image: "images/products/macbook-neo-silver.png" }
    ],
    storageOptions: [
      { label: "8GB / 256GB SSD", extra: 0 },
      { label: "8GB / 512GB SSD", extra: 10000 }
    ],
    short: "The most affordable Mac. Now with A18 Pro.",
    description: "The all-new entry-level MacBook brings Apple silicon performance to a fanless, ultra-portable design in four fresh colors — perfect for students and everyday use.",
    specs: {
      "Model No.": "MHFA–MHFJ4HN/A",
      "Display": "13.6-inch Liquid Retina",
      "Chip": "Apple A18 Pro chip, 6-core CPU / 5-core GPU / 16-core Neural Engine",
      "Memory": "8GB unified memory",
      "Battery": "Up to 18 hours",
      "Storage": "256GB / 512GB SSD",
      "Body": "Aluminium unibody, fanless design",
      "Connectivity": "Wi-Fi 6, Bluetooth 5.3, USB-C, 20W power adapter included",
      "OS": "macOS Sequoia"
    }
  },
  {
    id: "macbook-air-13-m5",
    name: "MacBook Air 13\u2033 M5",
    category: "mac",
    brand: "Apple",
    price: 149900,
    mrp: 149900,
    badge: "New",
    rating: 4.8,
    reviews: 84,
    stock: 15,
    images: ["images/products/macbook-air-silver.png"],
    colors: [
      { name: "Silver", hex: "#e3e4e6", image: "images/products/macbook-air-silver.png" },
      { name: "Starlight", hex: "#f0ece1", image: "images/products/macbook-air-silver.png" },
      { name: "Midnight", hex: "#1e2129", image: "images/products/macbook-air-silver.png" },
      { name: "Sky Blue", hex: "#b9d3e6", image: "images/products/macbook-air-silver.png" }
    ],
    storageOptions: [
      { label: "16GB / 512GB SSD", extra: 0 },
      { label: "16GB / 1TB SSD", extra: 36000 },
      { label: "24GB / 1TB SSD", extra: 60000 }
    ],
    short: "Impressively big. Impressively thin. Supercharged by M5.",
    description: "MacBook Air with M5 delivers a huge leap in performance in the same strikingly thin fanless design, with up to 18 hours of battery life.",
    specs: {
      "Model No.": "MDH7–MDHK4HN/A",
      "Display": "13.6-inch Liquid Retina",
      "Chip": "Apple M5 chip, 10-core CPU / 8-core GPU",
      "Memory": "16GB unified memory (up to 24GB)",
      "Battery": "Up to 18 hours",
      "Storage": "512GB / 1TB SSD",
      "Body": "Aluminium unibody, fanless design",
      "Connectivity": "Wi-Fi 6E, Bluetooth 5.3, 2x Thunderbolt / USB4",
      "OS": "macOS Sequoia"
    }
  },
  {
    id: "macbook-air-15-m5",
    name: "MacBook Air 15\u2033 M5",
    category: "mac",
    brand: "Apple",
    price: 179900,
    mrp: 179900,
    badge: "New",
    rating: 4.8,
    reviews: 71,
    stock: 12,
    images: ["images/products/macbook-air-silver.png"],
    colors: [
      { name: "Silver", hex: "#e3e4e6", image: "images/products/macbook-air-silver.png" },
      { name: "Starlight", hex: "#f0ece1", image: "images/products/macbook-air-silver.png" },
      { name: "Midnight", hex: "#1e2129", image: "images/products/macbook-air-silver.png" },
      { name: "Sky Blue", hex: "#b9d3e6", image: "images/products/macbook-air-silver.png" }
    ],
    storageOptions: [
      { label: "16GB / 512GB SSD", extra: 0 },
      { label: "16GB / 1TB SSD", extra: 36000 },
      { label: "24GB / 1TB SSD", extra: 60000 }
    ],
    short: "Impressively big. Impressively thin.",
    description: "MacBook Air with M5 delivers incredible performance in a strikingly thin design, with a big 15.3-inch Liquid Retina display and up to 18 hours of battery life.",
    specs: {
      "Model No.": "MDV9–MDVU4HN/A",
      "Display": "15.3-inch Liquid Retina",
      "Chip": "Apple M5 chip, 10-core CPU / 10-core GPU",
      "Memory": "16GB unified memory (up to 24GB)",
      "Battery": "Up to 18 hours",
      "Storage": "512GB / 1TB SSD",
      "Body": "Aluminium unibody, fanless design",
      "Connectivity": "Wi-Fi 6E, Bluetooth 5.3, 2x Thunderbolt / USB4",
      "OS": "macOS Sequoia"
    }
  },
  {
    id: "macbook-pro-14-m5",
    name: "MacBook Pro 14\u2033 M5",
    category: "mac",
    brand: "Apple",
    price: 239900,
    mrp: 239900,
    badge: "Best Seller",
    rating: 4.9,
    reviews: 132,
    stock: 9,
    images: ["images/products/macbook-pro-black.png"],
    colors: [
      { name: "Space Black", hex: "#1c1c1e", image: "images/products/macbook-pro-black.png" },
      { name: "Silver", hex: "#e3e4e6", image: "images/products/macbook-pro-black.png" }
    ],
    storageOptions: [
      { label: "M5 \u00b7 16GB / 1TB SSD", extra: 0 },
      { label: "M5 \u00b7 24GB / 1TB SSD", extra: 24000 },
      { label: "M5 \u00b7 32GB / 1TB SSD", extra: 48000 },
      { label: "M5 Pro \u00b7 24GB / 1TB SSD", extra: 60000 },
      { label: "M5 Pro \u00b7 24GB / 2TB SSD", extra: 120000 },
      { label: "M5 Pro (18-core) \u00b7 24GB / 2TB SSD", extra: 160000 },
      { label: "M5 Max \u00b7 36GB / 2TB SSD", extra: 260000 }
    ],
    short: "Mind-blowing performance with M5, M5 Pro or M5 Max.",
    description: "The 14-inch MacBook Pro scales from the all-new M5 chip to M5 Pro and M5 Max, bringing exceptional performance and up to 24 hours of battery life to a stunning Liquid Retina XDR display.",
    specs: {
      "Model No.": "MDE1–MJ3E / MGDN–MGDU4HN/A",
      "Display": "14.2-inch Liquid Retina XDR",
      "Chip": "Apple M5 / M5 Pro / M5 Max chip",
      "Memory": "16GB unified memory (up to 36GB)",
      "Battery": "Up to 24 hours",
      "Storage": "1TB / 2TB SSD",
      "Body": "Aluminium unibody, Space Black or Silver",
      "Connectivity": "Wi-Fi 6E, Bluetooth 5.3, 3x Thunderbolt 5",
      "OS": "macOS Sequoia"
    }
  },
  {
    id: "macbook-pro-16-m5",
    name: "MacBook Pro 16\u2033 M5",
    category: "mac",
    brand: "Apple",
    price: 359900,
    mrp: 359900,
    badge: "New",
    rating: 4.9,
    reviews: 47,
    stock: 6,
    images: ["images/products/macbook-pro-black.png"],
    colors: [
      { name: "Space Black", hex: "#1c1c1e", image: "images/products/macbook-pro-black.png" },
      { name: "Silver", hex: "#e3e4e6", image: "images/products/macbook-pro-black.png" }
    ],
    storageOptions: [
      { label: "M5 Pro \u00b7 24GB / 1TB SSD", extra: 0 },
      { label: "M5 Pro \u00b7 48GB / 1TB SSD", extra: 72000 },
      { label: "M5 Max \u00b7 36GB / 2TB SSD", extra: 180000 },
      { label: "M5 Max \u00b7 48GB / 2TB SSD", extra: 260000 }
    ],
    short: "The ultimate pro laptop. M5 Pro and M5 Max.",
    description: "The 16-inch MacBook Pro is built for the most demanding workflows, with the M5 Pro or M5 Max chip, a massive Liquid Retina XDR display, and up to 24 hours of battery life.",
    specs: {
      "Model No.": "MGEA–MGE94HN/A",
      "Display": "16.2-inch Liquid Retina XDR",
      "Chip": "Apple M5 Pro / M5 Max chip",
      "Memory": "24GB unified memory (up to 48GB)",
      "Battery": "Up to 24 hours",
      "Storage": "1TB / 2TB SSD",
      "Body": "Aluminium unibody, Space Black or Silver",
      "Connectivity": "Wi-Fi 6E, Bluetooth 5.3, 3x Thunderbolt 5",
      "OS": "macOS Sequoia"
    }
  },
  {
    id: "imac-24-m4",
    name: "iMac 24\u2033 M4",
    category: "mac",
    brand: "Apple",
    price: 174900,
    mrp: 174900,
    badge: "New",
    rating: 4.8,
    reviews: 39,
    stock: 10,
    images: ["images/products/imac-24-blue.png"],
    colors: [
      { name: "Silver", hex: "#e3e4e6", image: "images/products/imac-24-blue.png" },
      { name: "Green", hex: "#a8c8a0", image: "images/products/imac-24-blue.png" },
      { name: "Blue", hex: "#7fa8d9", image: "images/products/imac-24-blue.png" },
      { name: "Pink", hex: "#f0c3d3", image: "images/products/imac-24-blue.png" }
    ],
    storageOptions: [
      { label: "8-core GPU \u00b7 16GB / 256GB SSD", extra: 0 },
      { label: "10-core GPU \u00b7 16GB / 256GB SSD", extra: 25000 },
      { label: "10-core GPU \u00b7 16GB / 512GB SSD", extra: 49000 },
      { label: "10-core GPU \u00b7 24GB / 512GB SSD", extra: 73000 }
    ],
    short: "Hello, color. Supercharged by M4.",
    description: "iMac with M4 packs a stunning 24-inch 4.5K Retina display, a 12MP Center Stage camera, and all-day performance into a strikingly thin all-in-one design available in four colors.",
    specs: {
      "Model No.": "MWUC–MD2U4HN/A",
      "Display": "24-inch Retina 4.5K",
      "Chip": "Apple M4 chip, 8-core / 10-core GPU",
      "Memory": "16GB unified memory (up to 24GB)",
      "Camera": "12MP Center Stage camera",
      "Storage": "256GB / 512GB SSD",
      "Connectivity": "Wi-Fi 6E, Bluetooth 5.3, 2x Thunderbolt / USB4, 2x USB 3",
      "OS": "macOS Sequoia"
    }
  },
  {
    id: "mac-mini-m4",
    name: "Mac mini M4",
    category: "mac",
    brand: "Apple",
    price: 59900,
    mrp: 59900,
    badge: "Sale",
    rating: 4.7,
    reviews: 65,
    stock: 22,
    images: ["images/products/macmini-silver.png"],
    colors: [
      { name: "Silver", hex: "#e3e4e6", image: "images/products/macmini-silver.png" }
    ],
    storageOptions: [
      { label: "M4 \u00b7 16GB / 256GB SSD", extra: 0 },
      { label: "M4 \u00b7 16GB / 512GB SSD", extra: 59000 },
      { label: "M4 \u00b7 24GB / 512GB SSD", extra: 83000 },
      { label: "M4 Pro \u00b7 24GB / 512GB SSD", extra: 140000 }
    ],
    short: "Mini in size. Mighty in power.",
    description: "Mac mini with M4 or M4 Pro packs immense power into an impossibly compact design — perfect as a desktop workstation or home media hub.",
    specs: {
      "Model No.": "MU9D–MCX44HN/A",
      "Chip": "Apple M4 / M4 Pro chip",
      "Memory": "16GB unified memory (up to 24GB)",
      "Storage": "256GB / 512GB SSD",
      "Connectivity": "Wi-Fi 6E, Bluetooth 5.3, Thunderbolt 4 / 5",
      "OS": "macOS Sequoia"
    }
  },

  /* =============================== iPad =============================== */

  {
    id: "ipad-11-gen",
    name: "iPad (11th generation)",
    category: "ipad",
    brand: "Apple",
    price: 34900,
    mrp: 34900,
    badge: "New",
    rating: 4.7,
    reviews: 88,
    stock: 35,
    images: ["images/products/ipad-air-blue.png"],
    colors: [
      { name: "Silver", hex: "#e3e4e6", image: "images/products/ipad-air-blue.png" },
      { name: "Blue", hex: "#8fb6de", image: "images/products/ipad-air-blue.png" },
      { name: "Yellow", hex: "#f2d675", image: "images/products/ipad-air-blue.png" },
      { name: "Pink", hex: "#f3c6d6", image: "images/products/ipad-air-blue.png" }
    ],
    storageOptions: [
      { label: "128GB", extra: 0 },
      { label: "256GB", extra: 10000 },
      { label: "512GB", extra: 30000 }
    ],
    short: "Powerful. Colorful. Wonderful.",
    description: "The 11th-generation iPad brings the A16 chip, a bigger Liquid Retina display, and Apple Pencil Pro support to the most affordable full-size iPad.",
    specs: {
      "Model No.": "MD3Y–MD5C4HN/A (Wi-Fi)",
      "Display": "11-inch Liquid Retina",
      "Chip": "Apple A16 chip",
      "Camera": "12MP Wide, 12MP Ultra Wide front",
      "Battery": "Up to 10 hours",
      "Storage": "128GB / 256GB / 512GB",
      "Connectivity": "Wi-Fi 6, Bluetooth 5.3, USB-C (Wi-Fi + Cellular option available)",
      "OS": "iPadOS 18"
    }
  },
  {
    id: "ipad-air-11-m4",
    name: "iPad Air 11\u2033 M4",
    category: "ipad",
    brand: "Apple",
    price: 64900,
    mrp: 64900,
    badge: "New",
    rating: 4.8,
    reviews: 74,
    stock: 28,
    images: ["images/products/ipad-air-blue.png"],
    colors: [
      { name: "Space Grey", hex: "#6e6e73", image: "images/products/ipad-air-blue.png" },
      { name: "Blue", hex: "#8fb6de", image: "images/products/ipad-air-blue.png" },
      { name: "Starlight", hex: "#f0ece1", image: "images/products/ipad-air-blue.png" },
      { name: "Purple", hex: "#b79fd1", image: "images/products/ipad-air-blue.png" }
    ],
    storageOptions: [
      { label: "128GB", extra: 0 },
      { label: "256GB", extra: 10000 },
      { label: "512GB", extra: 30000 },
      { label: "1TB", extra: 50000 }
    ],
    short: "Serious performance in a thin, light design.",
    description: "iPad Air is more capable than ever with the M4 chip, a gorgeous 11-inch Liquid Retina display, and support for Apple Pencil Pro and Magic Keyboard.",
    specs: {
      "Model No.": "MH30–MH7Q4HN/A",
      "Display": "11-inch Liquid Retina",
      "Chip": "Apple M4 chip",
      "Camera": "12MP Wide",
      "Battery": "Up to 10 hours",
      "Storage": "128GB / 256GB / 512GB / 1TB",
      "Connectivity": "Wi-Fi 6E, Bluetooth 5.3, USB-C (Wi-Fi + Cellular option available)",
      "OS": "iPadOS 18"
    }
  },
  {
    id: "ipad-air-13-m4",
    name: "iPad Air 13\u2033 M4",
    category: "ipad",
    brand: "Apple",
    price: 84900,
    mrp: 84900,
    badge: "New",
    rating: 4.8,
    reviews: 52,
    stock: 20,
    images: ["images/products/ipad-air-blue.png"],
    colors: [
      { name: "Space Grey", hex: "#6e6e73", image: "images/products/ipad-air-blue.png" },
      { name: "Blue", hex: "#8fb6de", image: "images/products/ipad-air-blue.png" },
      { name: "Starlight", hex: "#f0ece1", image: "images/products/ipad-air-blue.png" },
      { name: "Purple", hex: "#b79fd1", image: "images/products/ipad-air-blue.png" }
    ],
    storageOptions: [
      { label: "128GB", extra: 0 },
      { label: "256GB", extra: 10000 },
      { label: "512GB", extra: 30000 },
      { label: "1TB", extra: 50000 }
    ],
    short: "The bigger Air. Just as light.",
    description: "iPad Air 13-inch pairs the M4 chip with a large, immersive Liquid Retina display — ideal for creativity, note-taking, and productivity on the go.",
    specs: {
      "Model No.": "MH5N–MH9V4HN/A",
      "Display": "13-inch Liquid Retina",
      "Chip": "Apple M4 chip",
      "Camera": "12MP Wide",
      "Battery": "Up to 10 hours",
      "Storage": "128GB / 256GB / 512GB / 1TB",
      "Connectivity": "Wi-Fi 6E, Bluetooth 5.3, USB-C (Wi-Fi + Cellular option available)",
      "OS": "iPadOS 18"
    }
  },
  {
    id: "ipad-pro-11-m5",
    name: "iPad Pro 11\u2033 M5",
    category: "ipad",
    brand: "Apple",
    price: 99900,
    mrp: 99900,
    badge: "New",
    rating: 4.9,
    reviews: 61,
    stock: 14,
    images: ["images/products/ipad-pro-silver.png"],
    colors: [
      { name: "Space Black", hex: "#1c1c1e", image: "images/products/ipad-pro-silver.png" },
      { name: "Silver", hex: "#e3e4e6", image: "images/products/ipad-pro-silver.png" }
    ],
    storageOptions: [
      { label: "256GB", extra: 0 },
      { label: "512GB", extra: 20000 },
      { label: "1TB", extra: 60000 },
      { label: "2TB", extra: 100000 }
    ],
    short: "Unbelievably thin. Impossibly capable. M5.",
    description: "iPad Pro features the M5 chip, an Ultra Retina XDR tandem OLED display, and support for Apple Pencil Pro — built for the most demanding pro workflows on the go.",
    specs: {
      "Model No.": "MDWK–ME6D4HN/A",
      "Display": "11-inch Ultra Retina XDR (tandem OLED)",
      "Chip": "Apple M5 chip",
      "Camera": "12MP Wide + LiDAR Scanner",
      "Battery": "Up to 10 hours",
      "Storage": "256GB / 512GB / 1TB / 2TB",
      "Connectivity": "Wi-Fi 6E, Bluetooth 5.3, Thunderbolt / USB4 (Wi-Fi + Cellular option available)",
      "OS": "iPadOS 18"
    }
  },
  {
    id: "ipad-pro-13-m5",
    name: "iPad Pro 13\u2033 M5",
    category: "ipad",
    brand: "Apple",
    price: 129900,
    mrp: 129900,
    badge: "Best Seller",
    rating: 4.9,
    reviews: 89,
    stock: 11,
    images: ["images/products/ipad-pro-silver.png"],
    colors: [
      { name: "Space Black", hex: "#1c1c1e", image: "images/products/ipad-pro-silver.png" },
      { name: "Silver", hex: "#e3e4e6", image: "images/products/ipad-pro-silver.png" }
    ],
    storageOptions: [
      { label: "256GB", extra: 0 },
      { label: "512GB", extra: 20000 },
      { label: "1TB", extra: 60000 },
      { label: "2TB", extra: 100000 }
    ],
    short: "The ultimate iPad experience, supersized.",
    description: "iPad Pro 13-inch pairs the M5 chip with the largest, most immersive Ultra Retina XDR display ever on an iPad — a true portable studio.",
    specs: {
      "Model No.": "MDYJ–ME8N4HN/A",
      "Display": "13-inch Ultra Retina XDR (tandem OLED)",
      "Chip": "Apple M5 chip",
      "Camera": "12MP Wide + LiDAR Scanner",
      "Battery": "Up to 10 hours",
      "Storage": "256GB / 512GB / 1TB / 2TB",
      "Connectivity": "Wi-Fi 6E, Bluetooth 5.3, Thunderbolt / USB4 (Wi-Fi + Cellular option available)",
      "OS": "iPadOS 18"
    }
  },

  /* =============================== Watch =============================== */

  {
    id: "watch-se-3",
    name: "Apple Watch SE 3",
    category: "watch",
    brand: "Apple",
    price: 25900,
    mrp: 25900,
    badge: "New",
    rating: 4.6,
    reviews: 74,
    stock: 34,
    images: ["images/products/watch-se3-starlight.png"],
    colors: [
      { name: "Starlight", hex: "#f0ece1", image: "images/products/watch-se3-starlight.png" },
      { name: "Midnight", hex: "#1e2129", image: "images/products/watch-se3-starlight.png" }
    ],
    storageOptions: [
      { label: "40mm GPS", extra: 0 },
      { label: "44mm GPS", extra: 3000 },
      { label: "40mm GPS + Cellular", extra: 5000 },
      { label: "44mm GPS + Cellular", extra: 8000 }
    ],
    short: "A great deal to love. A great deal to give.",
    description: "Apple Watch SE 3 has the essential features to keep you moving, motivated, and connected — including Crash Detection, sleep tracking, and up to 18 hours of battery life.",
    specs: {
      "Model No.": "MEH3–MEPJ4HN/A",
      "Display": "Retina LTPO OLED, Always-On",
      "Chip": "S10 SiP",
      "Health": "Heart Rate, Crash Detection, Sleep Apnea notifications",
      "Battery": "Up to 18 hours",
      "Case": "40mm / 44mm Aluminium",
      "Water Resistance": "50 meters",
      "Connectivity": "GPS or GPS + Cellular, Wi-Fi, Bluetooth 5.3",
      "OS": "watchOS 12"
    }
  },
  {
    id: "watch-series-11",
    name: "Apple Watch Series 11",
    category: "watch",
    brand: "Apple",
    price: 46900,
    mrp: 46900,
    badge: "Best Seller",
    rating: 4.8,
    reviews: 156,
    stock: 26,
    images: ["images/products/watch-series9-black.png"],
    colors: [
      { name: "Jet Black", hex: "#1c1c1e", image: "images/products/watch-series9-black.png" },
      { name: "Space Grey", hex: "#6e6e73", image: "images/products/watch-series9-black.png" },
      { name: "Rose Gold", hex: "#e8c2c2", image: "images/products/watch-series9-black.png" },
      { name: "Silver", hex: "#e3e4e6", image: "images/products/watch-series9-black.png" }
    ],
    storageOptions: [
      { label: "42mm GPS", extra: 0 },
      { label: "46mm GPS", extra: 3000 },
      { label: "42mm GPS + Cellular", extra: 10000 },
      { label: "46mm GPS + Cellular", extra: 13000 },
      { label: "42mm GPS + Cellular \u00b7 Titanium", extra: 33000 }
    ],
    short: "Smarter. Brighter. Mightier.",
    description: "Apple Watch Series 11 introduces hypertension notifications, all-day battery life up to 24 hours, and a brighter always-on display, all powered by the S10 chip.",
    specs: {
      "Model No.": "MEQT–MF8N4HN/A",
      "Display": "Always-On Retina LTPO OLED",
      "Chip": "S10 SiP with 4-core Neural Engine",
      "Health": "Blood Oxygen, ECG, Hypertension notifications",
      "Battery": "Up to 24 hours",
      "Case": "42mm / 46mm Aluminium or Titanium",
      "Water Resistance": "50 meters",
      "Connectivity": "GPS or GPS + Cellular, Wi-Fi, Bluetooth 5.3",
      "OS": "watchOS 12"
    }
  },
  {
    id: "watch-ultra-3",
    name: "Apple Watch Ultra 3",
    category: "watch",
    brand: "Apple",
    price: 89900,
    mrp: 89900,
    badge: "New",
    rating: 4.9,
    reviews: 41,
    stock: 9,
    images: ["images/products/watch-ultra3-titanium.png"],
    colors: [
      { name: "Natural Titanium", hex: "#b8b2a7", image: "images/products/watch-ultra3-titanium.png" },
      { name: "Black Titanium", hex: "#2b2b2b", image: "images/products/watch-ultra3-titanium.png" }
    ],
    storageOptions: [
      { label: "49mm \u00b7 Ocean / Alpine / Trail Loop", extra: 0 },
      { label: "49mm \u00b7 Titanium Milanese Loop", extra: 15000 }
    ],
    short: "The ultimate sports watch. Now with satellite communication.",
    description: "Apple Watch Ultra 3 features the biggest, brightest display yet, satellite communication for emergencies off the grid, and up to 42 hours of normal battery life (72 hours in low power mode).",
    specs: {
      "Model No.": "MEWH–MF1T4HN/A",
      "Display": "Always-On LTPO OLED, largest &amp; brightest yet",
      "Chip": "S10 SiP",
      "Health": "Depth Gauge, Dive computer, ECG, Blood Oxygen",
      "Battery": "Up to 42 hours (72 hours low power mode)",
      "Case": "49mm Titanium",
      "Water Resistance": "100 meters, EN13319 dive rated",
      "Connectivity": "GPS + Cellular + Satellite, Wi-Fi, Bluetooth 5.3",
      "OS": "watchOS 12"
    }
  },

  /* =============================== Vision =============================== */

  {
    id: "apple-vision-pro",
    name: "Apple Vision Pro",
    category: "vision",
    brand: "Apple",
    price: 349900,
    mrp: 349900,
    badge: "New",
    rating: 4.7,
    reviews: 29,
    stock: 6,
    images: ["images/products/apple-vision-pro.png"],
    colors: [
      { name: "Space Black", hex: "#1c1c1e", image: "images/products/apple-vision-pro.png" }
    ],
    storageOptions: [
      { label: "256GB", extra: 0 },
      { label: "512GB", extra: 40000 },
      { label: "1TB", extra: 80000 }
    ],
    short: "Welcome to the era of spatial computing.",
    description: "Apple Vision Pro seamlessly blends digital content with the physical world, powered by the M2 chip and the all-new R1 chip for real-time sensor processing, with an ultra-high-resolution micro-OLED display system.",
    specs: {
      "Display": "Micro-OLED dual displays, more pixels than a 4K TV per eye",
      "Chip": "Apple M2 chip + R1 chip",
      "Input": "Eyes, hands, and voice \u2014 no controllers needed",
      "Battery": "Up to 2 hours with external battery pack (included)",
      "Storage": "256GB / 512GB / 1TB",
      "Audio": "Spatial Audio with dynamic head tracking",
      "Connectivity": "Wi-Fi 6, Bluetooth 5.3",
      "OS": "visionOS 2"
    }
  },

  /* =============================== TV & Home =============================== */

  {
    id: "apple-tv-4k",
    name: "Apple TV 4K",
    category: "tvhome",
    brand: "Apple",
    price: 14900,
    mrp: 14900,
    badge: "New",
    rating: 4.7,
    reviews: 112,
    stock: 45,
    images: ["images/products/apple-tv-4k.png"],
    colors: [
      { name: "Black", hex: "#1c1c1e", image: "images/products/apple-tv-4k.png" }
    ],
    storageOptions: [
      { label: "64GB \u00b7 Wi-Fi", extra: 0 },
      { label: "128GB \u00b7 Wi-Fi + Ethernet", extra: 4000 }
    ],
    short: "Whole new ways to experience your favorite entertainment.",
    description: "Apple TV 4K brings the ultimate home entertainment experience with the A15 Bionic chip, stunning 4K HDR with Dolby Vision, and the redesigned Siri Remote.",
    specs: {
      "Chip": "A15 Bionic",
      "Video": "4K HDR with Dolby Vision, HDR10+",
      "Audio": "Dolby Atmos",
      "Storage": "64GB / 128GB",
      "Remote": "Siri Remote (USB-C)",
      "Connectivity": "Wi-Fi 6, Gigabit Ethernet (128GB), Thread, Bluetooth 5.0",
      "OS": "tvOS 18"
    }
  },
  {
    id: "homepod-2nd-gen",
    name: "HomePod (2nd generation)",
    category: "tvhome",
    brand: "Apple",
    price: 32900,
    mrp: 32900,
    badge: "New",
    rating: 4.6,
    reviews: 54,
    stock: 20,
    images: ["images/products/homepod-2nd-gen.png"],
    colors: [
      { name: "Midnight", hex: "#1e2129", image: "images/products/homepod-2nd-gen.png" },
      { name: "White", hex: "#f5f5f0", image: "images/products/homepod-2nd-gen.png" }
    ],
    storageOptions: [],
    short: "Deep bass. Room-filling sound. A smarter home.",
    description: "HomePod delivers immersive, room-filling sound with computational audio, a high-excursion woofer and five tweeters, plus built-in temperature and humidity sensing for the smart home.",
    specs: {
      "Audio": "High-excursion woofer + 5 tweeter array",
      "Chip": "Apple S7 chip",
      "Sensors": "Temperature and humidity sensor",
      "Smart Home": "Apple Home hub, Matter support",
      "Connectivity": "Wi-Fi, Bluetooth 5.0, Thread",
      "Voice": "Hey Siri"
    }
  },
  {
    id: "homepod-mini",
    name: "HomePod mini",
    category: "tvhome",
    brand: "Apple",
    price: 10900,
    mrp: 10900,
    badge: "Best Seller",
    rating: 4.7,
    reviews: 187,
    stock: 60,
    images: ["images/products/homepod-mini.png"],
    colors: [
      { name: "Space Grey", hex: "#6e6e73", image: "images/products/homepod-mini.png" },
      { name: "White", hex: "#f5f5f0", image: "images/products/homepod-mini.png" },
      { name: "Yellow", hex: "#f2d675", image: "images/products/homepod-mini.png" },
      { name: "Orange", hex: "#d9713c", image: "images/products/homepod-mini.png" },
      { name: "Blue", hex: "#7fa8d9", image: "images/products/homepod-mini.png" }
    ],
    storageOptions: [],
    short: "Big sound. Tiny package.",
    description: "HomePod mini fills the room with rich 360-degree audio, works as an intercom and smart home hub, and pairs two together for stereo sound.",
    specs: {
      "Audio": "Full-range driver + dual passive radiators, 360\u00b0 sound",
      "Chip": "Apple S5 chip",
      "Smart Home": "Apple Home hub, Matter support",
      "Connectivity": "Wi-Fi, Bluetooth 5.0, Thread, U1 chip",
      "Voice": "Hey Siri"
    }
  },

  /* =============================== AirPods =============================== */

  {
    id: "airpods-pro-3",
    name: "AirPods Pro (3rd gen)",
    category: "airpods",
    brand: "Apple",
    price: 24900,
    mrp: 24900,
    badge: "Best Seller",
    rating: 4.9,
    reviews: 540,
    stock: 40,
    images: ["images/products/airpods-pro.png"],
    colors: [
      { name: "White", hex: "#ffffff", image: "images/products/airpods-pro.png" }
    ],
    storageOptions: [],
    short: "Heart rate sensing. Even richer sound.",
    description: "AirPods Pro 3 feature up to 2x more Active Noise Cancellation, a built-in heart-rate sensor, Adaptive Audio, and a MagSafe Charging Case with speaker.",
    specs: {
      "Model No.": "SYLW2HN/A",
      "Chip": "Apple H3 headphone chip",
      "Health": "Built-in heart-rate sensor",
      "Noise Control": "Active Noise Cancellation + Adaptive Transparency",
      "Battery": "Up to 8 hours (30 hrs with case)",
      "Case": "MagSafe & Qi wireless charging",
      "Water Resistance": "IP57",
      "Connectivity": "Bluetooth 5.4"
    }
  },
  {
    id: "airpods-max",
    name: "AirPods Max",
    category: "airpods",
    brand: "Apple",
    price: 59900,
    mrp: 64900,
    badge: "Sale",
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

  /* =============================== Accessories =============================== */

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
  },

  /* AppleCare+ plans — sold as standalone protection add-ons */
  {
    id: "applecare-iphone-17e",
    name: "AppleCare+ for iPhone 17e",
    category: "accessories",
    brand: "Apple",
    price: 11900,
    mrp: 11900,
    badge: null,
    rating: 4.6,
    reviews: 22,
    stock: 999,
    images: ["images/products/magsafe-charger.png"],
    colors: [{ name: "Digital", hex: "#0066cc", image: "images/products/magsafe-charger.png" }],
    storageOptions: [],
    short: "2 years of accidental damage protection for iPhone 17e.",
    description: "AppleCare+ provides expert repairs and support directly from Apple, including coverage for accidental damage (deductibles apply, 2 incidents every 12 months) and 24/7 priority support.",
    specs: { "Model No.": "SCYW3HN/A", "Coverage Term": "2 years from purchase", "Accidental Damage": "2 incidents every 12 months", "Support": "24/7 priority access to Apple experts", "Battery Service": "Included if capacity falls below 80%" }
  },
  {
    id: "applecare-iphone-17",
    name: "AppleCare+ for iPhone 17",
    category: "accessories",
    brand: "Apple",
    price: 14900,
    mrp: 14900,
    badge: null,
    rating: 4.6,
    reviews: 34,
    stock: 999,
    images: ["images/products/magsafe-charger.png"],
    colors: [{ name: "Digital", hex: "#0066cc", image: "images/products/magsafe-charger.png" }],
    storageOptions: [],
    short: "2 years of accidental damage protection for iPhone 17.",
    description: "AppleCare+ provides expert repairs and support directly from Apple, including coverage for accidental damage (deductibles apply, 2 incidents every 12 months) and 24/7 priority support.",
    specs: { "Model No.": "SWXT2HN/A", "Coverage Term": "2 years from purchase", "Accidental Damage": "2 incidents every 12 months", "Support": "24/7 priority access to Apple experts", "Battery Service": "Included if capacity falls below 80%" }
  },
  {
    id: "applecare-iphone-air",
    name: "AppleCare+ for iPhone Air",
    category: "accessories",
    brand: "Apple",
    price: 20900,
    mrp: 20900,
    badge: null,
    rating: 4.7,
    reviews: 18,
    stock: 999,
    images: ["images/products/magsafe-charger.png"],
    colors: [{ name: "Digital", hex: "#0066cc", image: "images/products/magsafe-charger.png" }],
    storageOptions: [],
    short: "2 years of accidental damage protection for iPhone Air.",
    description: "AppleCare+ provides expert repairs and support directly from Apple, including coverage for accidental damage (deductibles apply, 2 incidents every 12 months) and 24/7 priority support.",
    specs: { "Model No.": "SWXY2HN/A", "Coverage Term": "2 years from purchase", "Accidental Damage": "2 incidents every 12 months", "Support": "24/7 priority access to Apple experts", "Battery Service": "Included if capacity falls below 80%" }
  },
  {
    id: "applecare-iphone-17-pro",
    name: "AppleCare+ for iPhone 17 Pro / Pro Max",
    category: "accessories",
    brand: "Apple",
    price: 20900,
    mrp: 20900,
    badge: null,
    rating: 4.7,
    reviews: 47,
    stock: 999,
    images: ["images/products/magsafe-charger.png"],
    colors: [{ name: "Digital", hex: "#0066cc", image: "images/products/magsafe-charger.png" }],
    storageOptions: [],
    short: "2 years of accidental damage protection for iPhone 17 Pro & Pro Max.",
    description: "AppleCare+ provides expert repairs and support directly from Apple, including coverage for accidental damage (deductibles apply, 2 incidents every 12 months) and 24/7 priority support.",
    specs: { "Model No.": "SWY42HN/A / SWY92HN/A", "Coverage Term": "2 years from purchase", "Accidental Damage": "2 incidents every 12 months", "Support": "24/7 priority access to Apple experts", "Battery Service": "Included if capacity falls below 80%" }
  },
  {
    id: "applecare-ipad-air",
    name: "AppleCare+ for iPad Air (M4)",
    category: "accessories",
    brand: "Apple",
    price: 7900,
    mrp: 7900,
    badge: null,
    rating: 4.6,
    reviews: 15,
    stock: 999,
    images: ["images/products/magsafe-charger.png"],
    colors: [{ name: "Digital", hex: "#0066cc", image: "images/products/magsafe-charger.png" }],
    storageOptions: [],
    short: "2 years of accidental damage protection for iPad Air.",
    description: "AppleCare+ provides expert repairs and support directly from Apple, including coverage for accidental damage (deductibles apply, 2 incidents every 12 months) and 24/7 priority support.",
    specs: { "Model No.": "SCV93HN/A / SCVD3HN/A", "Coverage Term": "2 years from purchase", "Accidental Damage": "2 incidents every 12 months", "Support": "24/7 priority access to Apple experts" }
  },
  {
    id: "applecare-ipad-pro",
    name: "AppleCare+ for iPad Pro (M5)",
    category: "accessories",
    brand: "Apple",
    price: 15900,
    mrp: 15900,
    badge: null,
    rating: 4.7,
    reviews: 12,
    stock: 999,
    images: ["images/products/magsafe-charger.png"],
    colors: [{ name: "Digital", hex: "#0066cc", image: "images/products/magsafe-charger.png" }],
    storageOptions: [],
    short: "2 years of accidental damage protection for iPad Pro.",
    description: "AppleCare+ provides expert repairs and support directly from Apple, including coverage for accidental damage (deductibles apply, 2 incidents every 12 months) and 24/7 priority support.",
    specs: { "Model No.": "SXTO2HN/A / SXT12HN/A", "Coverage Term": "2 years from purchase", "Accidental Damage": "2 incidents every 12 months", "Support": "24/7 priority access to Apple experts" }
  },
  {
    id: "applecare-macbook-air",
    name: "AppleCare+ for MacBook Air (M5)",
    category: "accessories",
    brand: "Apple",
    price: 19900,
    mrp: 19900,
    badge: null,
    rating: 4.6,
    reviews: 29,
    stock: 999,
    images: ["images/products/magsafe-charger.png"],
    colors: [{ name: "Digital", hex: "#0066cc", image: "images/products/magsafe-charger.png" }],
    storageOptions: [],
    short: "3 years of accidental damage protection for MacBook Air.",
    description: "AppleCare+ provides expert repairs and support directly from Apple, including coverage for accidental damage (deductibles apply, 2 incidents every 12 months) and 24/7 priority support.",
    specs: { "Model No.": "SCW83HN/A / SCW93HN/A", "Coverage Term": "3 years from purchase", "Accidental Damage": "2 incidents every 12 months", "Support": "24/7 priority access to Apple experts" }
  },
  {
    id: "applecare-macbook-pro",
    name: "AppleCare+ for MacBook Pro (M5)",
    category: "accessories",
    brand: "Apple",
    price: 26900,
    mrp: 26900,
    badge: null,
    rating: 4.7,
    reviews: 21,
    stock: 999,
    images: ["images/products/magsafe-charger.png"],
    colors: [{ name: "Digital", hex: "#0066cc", image: "images/products/magsafe-charger.png" }],
    storageOptions: [],
    short: "3 years of accidental damage protection for MacBook Pro.",
    description: "AppleCare+ provides expert repairs and support directly from Apple, including coverage for accidental damage (deductibles apply, 2 incidents every 12 months) and 24/7 priority support.",
    specs: { "Model No.": "SXKH2HN/A / SCXU3HN/A", "Coverage Term": "3 years from purchase", "Accidental Damage": "2 incidents every 12 months", "Support": "24/7 priority access to Apple experts" }
  },
  {
    id: "applecare-watch",
    name: "AppleCare+ for Apple Watch",
    category: "accessories",
    brand: "Apple",
    price: 7900,
    mrp: 7900,
    badge: null,
    rating: 4.5,
    reviews: 19,
    stock: 999,
    images: ["images/products/magsafe-charger.png"],
    colors: [{ name: "Digital", hex: "#0066cc", image: "images/products/magsafe-charger.png" }],
    storageOptions: [],
    short: "2 years of accidental damage protection for Apple Watch SE 3 / Series 11.",
    description: "AppleCare+ provides expert repairs and support directly from Apple, including coverage for accidental damage (deductibles apply, 2 incidents every 12 months) and 24/7 priority support.",
    specs: { "Model No.": "SXHW2HN/A / SXCJ2HN/A", "Coverage Term": "2 years from purchase", "Accidental Damage": "2 incidents every 12 months", "Support": "24/7 priority access to Apple experts" }
  },
  {
    id: "applecare-airpods",
    name: "AppleCare+ for AirPods Pro 3",
    category: "accessories",
    brand: "Apple",
    price: 4900,
    mrp: 4900,
    badge: null,
    rating: 4.5,
    reviews: 27,
    stock: 999,
    images: ["images/products/magsafe-charger.png"],
    colors: [{ name: "Digital", hex: "#0066cc", image: "images/products/magsafe-charger.png" }],
    storageOptions: [],
    short: "2 years of accidental damage protection for AirPods Pro 3.",
    description: "AppleCare+ provides expert repairs and support directly from Apple, including coverage for accidental damage (deductibles apply) and battery service.",
    specs: { "Model No.": "SYLW2HN/A", "Coverage Term": "2 years from purchase", "Accidental Damage": "Covered, deductible applies per incident", "Support": "24/7 priority access to Apple experts" }
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

/* Isomorphic export: makes this catalog the single source of truth for
   both the browser storefront and the Node.js backend (server/), so
   product prices/stock never drift out of sync between the two. This
   block is a no-op in browsers (module is undefined there). */
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    CATEGORIES: CATEGORIES,
    PRODUCTS: PRODUCTS,
    formatINR: formatINR,
    getEmi: getEmi,
    getProductById: getProductById,
    getProductsByCategory: getProductsByCategory,
    getCategoryById: getCategoryById,
    searchProducts: searchProducts
  };
}
