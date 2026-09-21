/* Browser-only sandbox. No API requests or production credentials are used. */
(function (root) {
  function createDemoStore(storage, catalog) {
    const key = "iswift_admin_demo_v1";
    const copy = value => JSON.parse(JSON.stringify(value));
    function seed() {
      const products = copy(catalog.PRODUCTS).map(p => Object.assign({ stock: 10 }, p));
      return {
        products: products,
        categories: copy(catalog.CATEGORIES),
        banners: [{ id: "demo-banner", title: "Explore the latest iPhone", subtitle: "Sample campaign for the admin demo", image: "images/products/iphone-17-pro-silver.png", placement: "hero", category: "iphone", link: "category.html?cat=iphone", btnText: "Shop iPhone", active: true, sortOrder: 1 }],
        coupons: [{ id: "demo-coupon", code: "DEMO10", type: "percent", value: 10, minOrder: 1000, maxDiscount: 5000, usedCount: 3, active: true, note: "Sample coupon only" }],
        orders: ["paid", "created", "shipped"].map((status, i) => ({
          id: "DEMO-100" + i, status: status, total: products[i].price,
          customer: { name: "Demo Customer " + (i + 1), email: "customer" + i + "@example.com", phone: "Sample customer" },
          items: [{ id: products[i].id, name: products[i].name, qty: 1 }],
          createdAt: new Date(Date.now() - i * 86400000).toISOString()
        })),
        settings: { storeName: "Iswift Gadgets Demo", email: "demo@example.com", phones: [], whatsapp: "", address: ["Sample store address"], mapLink: "", shippingFee: 199, shippingThreshold: 50000, announcement: "Welcome to the admin demo" }
      };
    }
    let data = seed();
    try {
      const saved = JSON.parse(storage.getItem(key));
      if (saved && ["products", "categories", "banners", "coupons", "orders"].every(k => Array.isArray(saved[k])) && saved.settings) data = saved;
    } catch (_) { /* Private browsing or invalid stored data: use fresh sample data. */ }

    function persist(next) {
      try { storage.setItem(key, JSON.stringify(next)); }
      catch (_) { throw new Error("Demo storage is unavailable or full. Try a smaller image or reset the demo."); }
      data = next;
    }

    async function request(route, options) {
      options = options || {};
      const method = options.method || "GET";
      const body = options.body ? JSON.parse(options.body) : {};
      const parts = route.split("/").filter(Boolean);
      if (parts[0] !== "admin") throw new Error("Unsupported demo action");
      const resource = parts[1];
      const id = parts[2] ? decodeURIComponent(parts[2]) : "";
      if (resource === "stats" && method === "GET") {
        return copy({ products: data.products.length, banners: data.banners.length,
          activeBanners: data.banners.filter(b => b.active).length, coupons: data.coupons.length,
          activeCoupons: data.coupons.filter(c => c.active).length, orders: data.orders.length,
          revenue: data.orders.filter(o => ["paid", "shipped", "delivered"].includes(o.status)).reduce((n, o) => n + o.total, 0),
          lowStock: data.products.filter(p => p.stock < 5).length, recentOrders: data.orders.slice(0, 5) });
      }
      if (resource === "upload" && method === "POST") {
        if (typeof body.image !== "string" || !/^data:image\/(png|jpeg|webp|gif);base64,/.test(body.image)) throw new Error("Use PNG, JPEG, WebP or GIF images.");
        if (body.image.length > 700000) throw new Error("Use an image smaller than 500 KB in the demo.");
        return { url: body.image };
      }
      if (!["products", "banners", "coupons", "orders", "settings"].includes(resource)) throw new Error("Unsupported demo action");
      if (method === "GET") {
        return copy(resource === "products" ? { products: data.products, categories: data.categories } : { [resource]: data[resource] });
      }
      const next = copy(data);
      if (resource === "settings" && method === "PUT") {
        next.settings = Object.assign({}, next.settings, body);
      } else if (Array.isArray(next[resource])) {
        const list = next[resource];
        const index = list.findIndex(item => item.id === id);
        if (method === "POST" && resource !== "orders") {
          const newId = body.id || "demo-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8);
          if (list.some(item => item.id === newId)) throw new Error("This ID already exists.");
          list.unshift(Object.assign({}, body, { id: newId }));
        } else if (["PUT", "PATCH", "DELETE"].includes(method) && index >= 0) {
          if (method === "DELETE") list.splice(index, 1);
          else list[index] = Object.assign({}, list[index], body, { id: id });
        } else throw new Error("Demo record not found or action unavailable.");
      } else throw new Error("Unsupported demo action");
      persist(next);
      return { ok: true };
    }
    return { request: request, reset: function () { persist(seed()); } };
  }
  if (typeof module !== "undefined" && module.exports) module.exports = { createDemoStore: createDemoStore };
  else root.createAdminDemoStore = createDemoStore;
})(typeof window !== "undefined" ? window : globalThis);
