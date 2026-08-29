(function () {
  const API = (window.ADMIN_API_BASE || (location.port === "4000" ? "/api" : "http://localhost:4000/api"));
  const TOKEN_KEY = "iswift_admin_token";

  const state = {
    token: localStorage.getItem(TOKEN_KEY) || "",
    view: "dashboard",
    products: [],
    categories: [],
    coupons: [],
    orders: [],
    settings: null,
    productQuery: "",
    orderFilter: "all"
  };

  const $ = function (sel) { return document.querySelector(sel); };
  const $$ = function (sel) { return Array.from(document.querySelectorAll(sel)); };

  function formatINR(n) {
    return "₹" + Number(n || 0).toLocaleString("en-IN");
  }

  function toast(msg) {
    const el = document.createElement("div");
    el.className = "toast";
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(function () { el.remove(); }, 2600);
  }

  async function api(path, options) {
    options = options || {};
    const headers = Object.assign({ "Content-Type": "application/json" }, options.headers || {});
    if (state.token) headers.Authorization = "Bearer " + state.token;
    const res = await fetch(API + path, Object.assign({}, options, { headers: headers }));
    let data = null;
    try { data = await res.json(); } catch (e) { data = null; }
    if (res.status === 401) {
      logout(true);
      throw new Error((data && data.error) || "Unauthorized");
    }
    if (!res.ok) throw new Error((data && data.error) || ("Request failed (" + res.status + ")"));
    return data;
  }

  function showLogin() {
    $("#loginView").hidden = false;
    $("#shell").hidden = true;
  }

  function showShell() {
    $("#loginView").hidden = true;
    $("#shell").hidden = false;
  }

  function logout(silent) {
    const token = state.token;
    state.token = "";
    localStorage.removeItem(TOKEN_KEY);
    if (token && !silent) {
      fetch(API + "/admin/logout", {
        method: "POST",
        headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" }
      }).catch(function () {});
    }
    showLogin();
  }

  async function boot() {
    wireGlobal();
    if (!state.token) return showLogin();
    try {
      await api("/admin/me");
      showShell();
      navigate("dashboard");
    } catch (e) {
      showLogin();
    }
  }

  function wireGlobal() {
    $("#loginForm").addEventListener("submit", async function (e) {
      e.preventDefault();
      const err = $("#loginError");
      err.hidden = true;
      try {
        const data = await api("/admin/login", {
          method: "POST",
          body: JSON.stringify({ password: $("#loginPassword").value })
        });
        state.token = data.token;
        localStorage.setItem(TOKEN_KEY, data.token);
        showShell();
        navigate("dashboard");
      } catch (ex) {
        err.textContent = ex.message;
        err.hidden = false;
      }
    });

    $("#logoutBtn").addEventListener("click", function () { logout(false); });

    $$(".nav-btn").forEach(function (btn) {
      btn.addEventListener("click", function () { navigate(btn.getAttribute("data-view")); });
    });

    $$("[data-close]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const id = btn.getAttribute("data-close");
        const dlg = document.getElementById(id);
        if (dlg && dlg.open) dlg.close();
      });
    });

    $("#productForm").addEventListener("submit", saveProduct);
    $("#couponForm").addEventListener("submit", saveCoupon);
  }

  function navigate(view) {
    state.view = view;
    $$(".nav-btn").forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-view") === view);
    });
    const titles = {
      dashboard: "Dashboard",
      products: "Products",
      coupons: "Coupons",
      orders: "Orders",
      settings: "Settings"
    };
    $("#pageTitle").textContent = titles[view] || "Control Panel";
    const actions = $("#topbarActions");
    actions.innerHTML = "";
    if (view === "products") {
      actions.innerHTML = '<button class="btn btn-primary" id="addProductBtn">Add product</button>';
      $("#addProductBtn").onclick = function () { openProductModal(); };
    }
    if (view === "coupons") {
      actions.innerHTML = '<button class="btn btn-primary" id="addCouponBtn">Add coupon</button>';
      $("#addCouponBtn").onclick = function () { openCouponModal(); };
    }
    renderView();
  }

  async function renderView() {
    const content = $("#content");
    content.innerHTML = '<p class="muted">Loading…</p>';
    try {
      if (state.view === "dashboard") await renderDashboard(content);
      if (state.view === "products") await renderProducts(content);
      if (state.view === "coupons") await renderCoupons(content);
      if (state.view === "orders") await renderOrders(content);
      if (state.view === "settings") await renderSettings(content);
    } catch (e) {
      content.innerHTML = '<p class="error-msg">' + escapeHtml(e.message) + "</p>";
    }
  }

  async function renderDashboard(el) {
    const stats = await api("/admin/stats");
    el.innerHTML =
      '<div class="stats">' +
        statCard("Products", stats.products) +
        statCard("Active coupons", stats.activeCoupons + " / " + stats.coupons) +
        statCard("Orders", stats.orders) +
        statCard("Paid revenue", formatINR(stats.revenue)) +
      "</div>" +
      '<div class="panel">' +
        '<div class="panel-head"><h3>Recent orders</h3><span class="muted">Low stock items: ' + stats.lowStock + "</span></div>" +
        (stats.recentOrders.length
          ? '<table><thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th></tr></thead><tbody>' +
            stats.recentOrders.map(function (o) {
              return "<tr><td>" + escapeHtml(o.id) + "</td><td>" + escapeHtml((o.customer && o.customer.name) || "—") +
                "</td><td>" + formatINR(o.total) + "</td><td>" + statusBadge(o.status) +
                "</td><td>" + formatDate(o.createdAt) + "</td></tr>";
            }).join("") +
            "</tbody></table>"
          : '<div class="empty">No orders yet.</div>') +
      "</div>";
  }

  function statCard(label, value) {
    return '<div class="stat-card"><div class="label">' + label + '</div><div class="value">' + value + "</div></div>";
  }

  async function renderProducts(el) {
    const data = await api("/admin/products");
    state.products = data.products || [];
    state.categories = data.categories || [];
    const q = state.productQuery.trim().toLowerCase();
    const list = !q ? state.products : state.products.filter(function (p) {
      return (p.name + " " + p.category + " " + p.id).toLowerCase().indexOf(q) !== -1;
    });

    el.innerHTML =
      '<div class="panel">' +
        '<div class="panel-head">' +
          "<h3>" + list.length + " products</h3>" +
          '<div class="toolbar"><input id="productSearch" placeholder="Search products…" value="' + escapeAttr(state.productQuery) + '"></div>' +
        "</div>" +
        (list.length
          ? '<table><thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Badge</th><th></th></tr></thead><tbody>' +
            list.map(function (p) {
              return "<tr>" +
                "<td><strong>" + escapeHtml(p.name) + "</strong><div class='muted'>" + escapeHtml(p.id) + "</div></td>" +
                "<td>" + escapeHtml(p.category) + "</td>" +
                "<td>" + formatINR(p.price) + "</td>" +
                "<td>" + (Number(p.stock) <= 5 ? '<span class="badge badge-amber">' + p.stock + "</span>" : p.stock) + "</td>" +
                "<td>" + (p.badge ? '<span class="badge badge-blue">' + escapeHtml(p.badge) + "</span>" : "—") + "</td>" +
                '<td class="actions">' +
                  '<button class="btn btn-sm btn-ghost" data-edit-product="' + escapeAttr(p.id) + '">Edit</button>' +
                  '<button class="btn btn-sm btn-danger" data-del-product="' + escapeAttr(p.id) + '">Delete</button>' +
                "</td></tr>";
            }).join("") +
            "</tbody></table>"
          : '<div class="empty">No products match your search.</div>') +
      "</div>";

    const search = $("#productSearch");
    if (search) {
      search.addEventListener("input", function () {
        state.productQuery = search.value;
        clearTimeout(search._t);
        search._t = setTimeout(function () { renderProducts(el); }, 180);
      });
    }
    $$("[data-edit-product]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const p = state.products.find(function (x) { return x.id === btn.getAttribute("data-edit-product"); });
        openProductModal(p);
      });
    });
    $$("[data-del-product]").forEach(function (btn) {
      btn.addEventListener("click", async function () {
        if (!confirm("Delete this product?")) return;
        try {
          await api("/admin/products/" + encodeURIComponent(btn.getAttribute("data-del-product")), { method: "DELETE" });
          toast("Product deleted");
          renderProducts(el);
        } catch (e) { toast(e.message); }
      });
    });
  }

  function openProductModal(product) {
    $("#productModalTitle").textContent = product ? "Edit product" : "Add product";
    $("#p_id_existing").value = product ? product.id : "";
    $("#p_id").value = product ? product.id : "";
    $("#p_id").disabled = !!product;
    $("#p_name").value = product ? product.name : "";
    $("#p_category").value = product ? product.category : "accessories";
    $("#p_badge").value = product && product.badge ? product.badge : "";
    $("#p_price").value = product ? product.price : "";
    $("#p_mrp").value = product ? product.mrp : "";
    $("#p_stock").value = product ? product.stock : 10;
    $("#p_brand").value = product ? product.brand : "Apple";
    $("#p_image").value = product && product.images && product.images[0] ? product.images[0] : "";
    $("#p_short").value = product ? product.short : "";
    $("#p_description").value = product ? product.description : "";
    $("#productModal").showModal();
  }

  async function saveProduct(e) {
    e.preventDefault();
    const existingId = $("#p_id_existing").value;
    const payload = {
      id: $("#p_id").value.trim() || undefined,
      name: $("#p_name").value.trim(),
      category: $("#p_category").value,
      badge: $("#p_badge").value || null,
      price: Number($("#p_price").value),
      mrp: $("#p_mrp").value === "" ? undefined : Number($("#p_mrp").value),
      stock: Number($("#p_stock").value),
      brand: $("#p_brand").value.trim() || "Apple",
      images: $("#p_image").value.trim() ? [$("#p_image").value.trim()] : [],
      short: $("#p_short").value.trim(),
      description: $("#p_description").value.trim(),
      colors: [],
      storageOptions: [],
      specs: {}
    };
    try {
      if (existingId) {
        const existing = state.products.find(function (p) { return p.id === existingId; }) || {};
        payload.colors = existing.colors || [];
        payload.storageOptions = existing.storageOptions || [];
        payload.specs = existing.specs || {};
        if (!payload.images.length && existing.images) payload.images = existing.images;
        await api("/admin/products/" + encodeURIComponent(existingId), {
          method: "PUT",
          body: JSON.stringify(payload)
        });
        toast("Product updated");
      } else {
        await api("/admin/products", { method: "POST", body: JSON.stringify(payload) });
        toast("Product created");
      }
      $("#productModal").close();
      if (state.view === "products") renderView();
    } catch (ex) {
      toast(ex.message);
    }
  }

  async function renderCoupons(el) {
    const data = await api("/admin/coupons");
    state.coupons = data.coupons || [];
    el.innerHTML =
      '<div class="panel">' +
        '<div class="panel-head"><h3>' + state.coupons.length + " coupons</h3></div>" +
        (state.coupons.length
          ? '<table><thead><tr><th>Code</th><th>Discount</th><th>Rules</th><th>Usage</th><th>Status</th><th></th></tr></thead><tbody>' +
            state.coupons.map(function (c) {
              const discount = c.type === "percent" ? c.value + "%" : formatINR(c.value);
              const rules = [
                c.minOrder ? "Min " + formatINR(c.minOrder) : null,
                c.maxDiscount != null ? "Cap " + formatINR(c.maxDiscount) : null,
                c.endsAt ? "Ends " + formatDate(c.endsAt, true) : null
              ].filter(Boolean).join(" · ") || "—";
              return "<tr>" +
                "<td><strong>" + escapeHtml(c.code) + "</strong><div class='muted'>" + escapeHtml(c.note || "") + "</div></td>" +
                "<td>" + discount + "</td>" +
                "<td>" + escapeHtml(rules) + "</td>" +
                "<td>" + (c.usedCount || 0) + (c.usageLimit != null ? " / " + c.usageLimit : "") + "</td>" +
                "<td>" + (c.active ? '<span class="badge badge-green">Active</span>' : '<span class="badge badge-red">Off</span>') + "</td>" +
                '<td class="actions">' +
                  '<button class="btn btn-sm btn-ghost" data-edit-coupon="' + escapeAttr(c.id) + '">Edit</button>' +
                  '<button class="btn btn-sm btn-danger" data-del-coupon="' + escapeAttr(c.id) + '">Delete</button>' +
                "</td></tr>";
            }).join("") +
            "</tbody></table>"
          : '<div class="empty">No coupons yet. Create WELCOME10 or festival offers here.</div>') +
      "</div>";

    $$("[data-edit-coupon]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const c = state.coupons.find(function (x) { return x.id === btn.getAttribute("data-edit-coupon"); });
        openCouponModal(c);
      });
    });
    $$("[data-del-coupon]").forEach(function (btn) {
      btn.addEventListener("click", async function () {
        if (!confirm("Delete this coupon?")) return;
        try {
          await api("/admin/coupons/" + encodeURIComponent(btn.getAttribute("data-del-coupon")), { method: "DELETE" });
          toast("Coupon deleted");
          renderCoupons(el);
        } catch (e) { toast(e.message); }
      });
    });
  }

  function openCouponModal(coupon) {
    $("#couponModalTitle").textContent = coupon ? "Edit coupon" : "Add coupon";
    $("#c_id").value = coupon ? coupon.id : "";
    $("#c_code").value = coupon ? coupon.code : "";
    $("#c_type").value = coupon ? coupon.type : "percent";
    $("#c_value").value = coupon ? coupon.value : "";
    $("#c_minOrder").value = coupon ? (coupon.minOrder || 0) : 0;
    $("#c_maxDiscount").value = coupon && coupon.maxDiscount != null ? coupon.maxDiscount : "";
    $("#c_usageLimit").value = coupon && coupon.usageLimit != null ? coupon.usageLimit : "";
    $("#c_startsAt").value = coupon && coupon.startsAt ? coupon.startsAt.slice(0, 10) : "";
    $("#c_endsAt").value = coupon && coupon.endsAt ? coupon.endsAt.slice(0, 10) : "";
    $("#c_active").checked = coupon ? !!coupon.active : true;
    $("#c_note").value = coupon ? (coupon.note || "") : "";
    $("#couponModal").showModal();
  }

  async function saveCoupon(e) {
    e.preventDefault();
    const id = $("#c_id").value;
    const payload = {
      code: $("#c_code").value.trim().toUpperCase(),
      type: $("#c_type").value,
      value: Number($("#c_value").value),
      minOrder: Number($("#c_minOrder").value) || 0,
      maxDiscount: $("#c_maxDiscount").value === "" ? null : Number($("#c_maxDiscount").value),
      usageLimit: $("#c_usageLimit").value === "" ? null : Number($("#c_usageLimit").value),
      startsAt: $("#c_startsAt").value || null,
      endsAt: $("#c_endsAt").value || null,
      active: $("#c_active").checked,
      note: $("#c_note").value.trim()
    };
    try {
      if (id) {
        await api("/admin/coupons/" + encodeURIComponent(id), { method: "PUT", body: JSON.stringify(payload) });
        toast("Coupon updated");
      } else {
        await api("/admin/coupons", { method: "POST", body: JSON.stringify(payload) });
        toast("Coupon created");
      }
      $("#couponModal").close();
      if (state.view === "coupons") renderView();
    } catch (ex) {
      toast(ex.message);
    }
  }

  async function renderOrders(el) {
    const data = await api("/admin/orders");
    state.orders = data.orders || [];
    const filter = state.orderFilter;
    const list = filter === "all" ? state.orders : state.orders.filter(function (o) { return o.status === filter; });

    el.innerHTML =
      '<div class="panel">' +
        '<div class="panel-head">' +
          "<h3>" + list.length + " orders</h3>" +
          '<div class="toolbar"><select id="orderFilter">' +
            ["all", "created", "paid", "shipped", "delivered", "failed", "refunded", "cancelled"].map(function (s) {
              return '<option value="' + s + '"' + (filter === s ? " selected" : "") + ">" + s + "</option>";
            }).join("") +
          "</select></div>" +
        "</div>" +
        (list.length
          ? '<table><thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Update</th></tr></thead><tbody>' +
            list.map(function (o) {
              const itemCount = (o.items || []).reduce(function (n, i) { return n + (i.qty || 0); }, 0);
              return "<tr>" +
                "<td><strong>" + escapeHtml(o.id) + "</strong><div class='muted'>" + formatDate(o.createdAt) + "</div></td>" +
                "<td>" + escapeHtml((o.customer && o.customer.name) || "—") +
                  "<div class='muted'>" + escapeHtml((o.customer && o.customer.phone) || "") + "</div></td>" +
                "<td>" + itemCount + " item(s)" +
                  (o.coupon ? '<div class="muted">Coupon ' + escapeHtml(o.coupon.code) + "</div>" : "") +
                "</td>" +
                "<td>" + formatINR(o.total) +
                  (o.discount ? '<div class="muted">−' + formatINR(o.discount) + "</div>" : "") +
                "</td>" +
                "<td>" + statusBadge(o.status) + "</td>" +
                '<td><select data-status-order="' + escapeAttr(o.id) + '">' +
                  ["created", "paid", "shipped", "delivered", "failed", "refunded", "cancelled"].map(function (s) {
                    return '<option value="' + s + '"' + (o.status === s ? " selected" : "") + ">" + s + "</option>";
                  }).join("") +
                "</select></td></tr>";
            }).join("") +
            "</tbody></table>"
          : '<div class="empty">No orders in this filter.</div>') +
      "</div>";

    $("#orderFilter").addEventListener("change", function () {
      state.orderFilter = $("#orderFilter").value;
      renderOrders(el);
    });
    $$("[data-status-order]").forEach(function (sel) {
      sel.addEventListener("change", async function () {
        try {
          await api("/admin/orders/" + encodeURIComponent(sel.getAttribute("data-status-order")), {
            method: "PATCH",
            body: JSON.stringify({ status: sel.value })
          });
          toast("Order status updated");
          renderOrders(el);
        } catch (e) { toast(e.message); }
      });
    });
  }

  async function renderSettings(el) {
    const data = await api("/admin/settings");
    state.settings = data.settings;
    const s = state.settings;
    el.innerHTML =
      '<form class="panel settings-form" id="settingsForm">' +
        '<label>Store name<input id="s_storeName" value="' + escapeAttr(s.storeName || "") + '"></label>' +
        '<label>Email<input id="s_email" value="' + escapeAttr(s.email || "") + '"></label>' +
        '<label>WhatsApp (digits with country code)<input id="s_whatsapp" value="' + escapeAttr(s.whatsapp || "") + '"></label>' +
        '<label>Map link<input id="s_mapLink" value="' + escapeAttr(s.mapLink || "") + '"></label>' +
        '<label class="span-2">Phones (comma separated)<input id="s_phones" value="' + escapeAttr((s.phones || []).join(", ")) + '"></label>' +
        '<label class="span-2">Address (one line per row)<textarea id="s_address" rows="3">' + escapeHtml((s.address || []).join("\n")) + "</textarea></label>" +
        '<label>Shipping fee (₹)<input id="s_shippingFee" type="number" value="' + escapeAttr(s.shippingFee) + '"></label>' +
        '<label>Free shipping above (₹)<input id="s_shippingThreshold" type="number" value="' + escapeAttr(s.shippingThreshold) + '"></label>' +
        '<label class="span-2">Homepage announcement<textarea id="s_announcement" rows="2">' + escapeHtml(s.announcement || "") + "</textarea></label>" +
        '<div class="span-2" style="display:flex; justify-content:flex-end;"><button class="btn btn-primary" type="submit">Save settings</button></div>' +
      "</form>";

    $("#settingsForm").addEventListener("submit", async function (e) {
      e.preventDefault();
      const payload = {
        storeName: $("#s_storeName").value.trim(),
        email: $("#s_email").value.trim(),
        whatsapp: $("#s_whatsapp").value.trim(),
        mapLink: $("#s_mapLink").value.trim(),
        phones: $("#s_phones").value.split(",").map(function (x) { return x.trim(); }).filter(Boolean),
        address: $("#s_address").value.split("\n").map(function (x) { return x.trim(); }).filter(Boolean),
        shippingFee: Number($("#s_shippingFee").value),
        shippingThreshold: Number($("#s_shippingThreshold").value),
        announcement: $("#s_announcement").value.trim()
      };
      try {
        await api("/admin/settings", { method: "PUT", body: JSON.stringify(payload) });
        toast("Settings saved");
      } catch (ex) { toast(ex.message); }
    });
  }

  function statusBadge(status) {
    const map = {
      paid: "badge-green",
      delivered: "badge-green",
      shipped: "badge-blue",
      created: "badge-amber",
      failed: "badge-red",
      refunded: "badge-red",
      cancelled: "badge-red"
    };
    return '<span class="badge ' + (map[status] || "") + '">' + escapeHtml(status || "—") + "</span>";
  }

  function formatDate(iso, dateOnly) {
    if (!iso) return "—";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return String(iso);
    if (dateOnly) return d.toLocaleDateString("en-IN");
    return d.toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  }

  function escapeHtml(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function escapeAttr(str) { return escapeHtml(str); }

  boot();
})();
