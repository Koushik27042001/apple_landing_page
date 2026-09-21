(function () {
  const API = (window.ADMIN_API_BASE || "/api");
  const TOKEN_KEY = "iswift_admin_token";
  const isDemo = new URLSearchParams(location.search).get("demo") === "1";
  const demoStore = isDemo ? window.createAdminDemoStore(localStorage, { PRODUCTS: PRODUCTS, CATEGORIES: CATEGORIES }) : null;
  let liveAvailable = false;

  const state = {
    token: isDemo ? "" : (localStorage.getItem(TOKEN_KEY) || ""),
    view: "dashboard",
    products: [],
    categories: [],
    banners: [],
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
    if (isDemo) return demoStore.request(path, options);
    options = options || {};
    const headers = Object.assign({ "Content-Type": "application/json" }, options.headers || {});
    if (state.token) headers.Authorization = "Bearer " + state.token;
    let res;
    try {
      res = await fetch(API + path, Object.assign({ signal: AbortSignal.timeout(10000) }, options, { headers: headers }));
    } catch (_) {
      const error = new Error("Cannot connect to the live admin server. Retry the connection or explore the sample demo.");
      error.connectionUnavailable = true;
      throw error;
    }
    let data = null;
    try { data = await res.json(); } catch (e) { data = null; }
    if (res.status === 401) {
      logout(true);
      throw new Error((data && data.error) || "Unauthorized");
    }
    if (!res.ok || !data) {
      const error = new Error((data && data.error) || "The admin API is unavailable on this site. Retry the connection or explore the sample demo.");
      error.connectionUnavailable = !data || res.status >= 500 || res.status === 404;
      throw error;
    }
    return data;
  }

  function updateLoginConnection(available) {
    liveAvailable = available;
    $("#loginPassword").hidden = !available;
    $("#loginPassword").required = available;
    $("#loginPasswordLabel").hidden = !available;
    $("#loginSubmit").disabled = false;
    $("#loginSubmit").textContent = available ? "Sign in" : "Open demo panel";
    $("#retryConnection").hidden = available;
    $("#connectionNotice").textContent = available ? "" : "Live admin is unavailable on this site. You can explore the demo with sample data. No password is needed.";
  }

  async function checkConnection() {
    $("#loginSubmit").disabled = true;
    $("#loginSubmit").textContent = "Checking connection...";
    $("#retryConnection").disabled = true;
    let available = false;
    try {
      const response = await fetch(API + "/health", { cache: "no-store", signal: AbortSignal.timeout(5000) });
      const health = response.ok ? await response.json() : null;
      available = !!(health && health.ok === true && health.service === "iswift-gadgets-api");
    } catch (_) { /* A static site has no API. Keep its sample demo accessible. */ }
    updateLoginConnection(available);
    $("#retryConnection").disabled = false;
    return available;
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
    if (isDemo) {
      location.href = location.pathname;
      return;
    }
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
    if (isDemo) {
      $("#demoNotice").hidden = false;
      $("#logoutBtn").textContent = "Exit demo";
      showShell();
      navigate("dashboard");
      return;
    }
    if (!(await checkConnection()) || !state.token) return showLogin();
    try {
      await api("/admin/me");
      showShell();
      navigate("dashboard");
    } catch (e) {
      showLogin();
    }
  }

  function wireGlobal() {
    $("#retryConnection").addEventListener("click", function () {
      $("#loginError").hidden = true;
      checkConnection();
    });
    $("#resetDemoBtn").addEventListener("click", function () {
      if (!confirm("Reset all demo changes to the sample data?")) return;
      try { demoStore.reset(); navigate(state.view); toast("Demo reset"); }
      catch (error) { toast(error.message); }
    });
    $("#loginForm").addEventListener("submit", async function (e) {
      e.preventDefault();
      if (!liveAvailable) {
        const demoUrl = new URL(location.href);
        demoUrl.searchParams.set("demo", "1");
        location.href = demoUrl.href;
        return;
      }
      const err = $("#loginError");
      err.hidden = true;
      $("#loginSubmit").disabled = true;
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
        if (ex.connectionUnavailable) updateLoginConnection(false);
        err.textContent = ex.message;
        err.hidden = false;
      } finally {
        $("#loginSubmit").disabled = false;
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
    $("#bannerForm").addEventListener("submit", saveBanner);
    $("#couponForm").addEventListener("submit", saveCoupon);

    const addColorBtn = $("#p_add_color_btn");
    if (addColorBtn) {
      addColorBtn.addEventListener("click", function () {
        if (!state.modalColors) state.modalColors = [];
        const mainImg = $("#p_image") ? $("#p_image").value.trim() : "";
        state.modalColors.push({ name: "", hex: "#0071e3", image: mainImg });
        renderProductColorRows();
      });
    }

    wireFileUpload("#p_image_file", "#p_image", "#p_image_preview_wrap", "#p_image_preview", "#p_image_status", "product");
    wireFileUpload("#b_image_file", "#b_image", "#b_image_preview_wrap", "#b_image_preview", "#b_image_status", "banner");
  }

  function wireFileUpload(fileInputId, urlInputId, previewWrapId, previewImgId, statusId, defaultFilename) {
    const fileInput = $(fileInputId);
    const urlInput = $(urlInputId);
    const wrap = $(previewWrapId);
    const img = $(previewImgId);
    const status = $(statusId);
    if (!fileInput || !urlInput) return;

    urlInput.addEventListener("input", function () {
      updateImagePreview(urlInput.value, previewWrapId, previewImgId, statusId);
    });

    fileInput.addEventListener("change", function () {
      const file = fileInput.files[0];
      if (!file) return;

      if (status) status.textContent = "Uploading image...";
      if (wrap) wrap.style.display = "flex";

      const reader = new FileReader();
      reader.onload = async function (e) {
        const base64 = e.target.result;
        if (img) {
          img.src = base64;
          img.style.display = "block";
        }
        try {
          const res = await api("/admin/upload", {
            method: "POST",
            body: JSON.stringify({ image: base64, filename: defaultFilename || "upload" })
          });
          if (res && res.url) {
            urlInput.value = res.url;
            if (status) status.textContent = "✓ Image uploaded successfully";
            toast("Image file uploaded successfully");
          }
        } catch (err) {
          if (status) status.textContent = "❌ Upload failed: " + err.message;
          toast("Upload error: " + err.message);
        }
      };
      reader.readAsDataURL(file);
    });
  }

  function uploadFile(file) {
    return new Promise(function (resolve, reject) {
      const reader = new FileReader();
      reader.onerror = function () { reject(new Error("Could not read this image.")); };
      reader.onload = function () {
        api("/admin/upload", { method: "POST", body: JSON.stringify({ image: reader.result, filename: file.name }) }).then(resolve, reject);
      };
      reader.readAsDataURL(file);
    });
  }

  function updateImagePreview(urlVal, previewWrapId, previewImgId, statusId) {
    const wrap = $(previewWrapId);
    const img = $(previewImgId);
    const status = $(statusId);
    if (urlVal && urlVal.trim()) {
      let src = urlVal.trim();
      if (!src.startsWith("http") && !src.startsWith("data:") && !src.startsWith("/")) {
        src = "../" + src;
      }
      if (img) {
        img.src = src;
        img.style.display = "block";
      }
      if (wrap) wrap.style.display = "flex";
      if (status) status.textContent = "";
    } else {
      if (img) img.style.display = "none";
      if (wrap) wrap.style.display = "none";
      if (status) status.textContent = "";
    }
  }

  function navigate(view) {
    state.view = view;
    $$(".nav-btn").forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-view") === view);
    });
    const titles = {
      dashboard: "Dashboard",
      products: "Products",
      banners: "Banners & Advertisements",
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
    if (view === "banners") {
      actions.innerHTML = '<button class="btn btn-primary" id="addBannerBtn">Add Banner / Ad</button>';
      $("#addBannerBtn").onclick = function () { openBannerModal(); };
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
      if (state.view === "banners") await renderBanners(content);
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
        statCard("Active Banners", (stats.activeBanners || 0) + " / " + (stats.banners || 0)) +
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
          ? '<table><thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Badge</th><th>Actions</th></tr></thead><tbody>' +
            list.map(function (p) {
              const imgPath = p.images && p.images[0] ? (p.images[0].startsWith("http") || p.images[0].startsWith("data:") ? p.images[0] : "../" + p.images[0]) : "";
              const thumb = imgPath ? '<img src="' + escapeAttr(imgPath) + '" style="width:40px;height:40px;object-fit:cover;border-radius:6px;margin-right:10px;vertical-align:middle;background:#f5f5f7;" onerror="this.style.display=\'none\'">' : '';
              const stockBadge = Number(p.stock) <= 5
                ? '<span class="badge badge-amber">' + p.stock + ' (Low)</span>'
                : '<span class="badge badge-green">' + p.stock + '</span>';

              const colorsBadge = (p.colors && p.colors.length)
                ? '<div style="display:flex;gap:3px;margin-top:4px;align-items:center;" title="' + escapeAttr(p.colors.map(function(c){return c.name;}).join(', ')) + '">' +
                    p.colors.map(function (c) {
                      return '<span style="display:inline-block;width:11px;height:11px;border-radius:50%;background:' + escapeAttr(c.hex || '#ccc') + ';border:1px solid rgba(0,0,0,0.15);" title="' + escapeAttr(c.name) + '"></span>';
                    }).join("") +
                    '<span class="muted" style="font-size:11px;margin-left:3px;">(' + p.colors.length + ' colors)</span>' +
                  '</div>'
                : '';

              return "<tr>" +
                "<td><div style='display:flex;align-items:center;'>" + thumb + "<div><strong>" + escapeHtml(p.name) + "</strong><div class='muted'>" + escapeHtml(p.id) + "</div>" + colorsBadge + "</div></div></td>" +
                "<td><span class='badge badge-blue'>" + escapeHtml(p.category) + "</span></td>" +
                "<td><strong>" + formatINR(p.price) + "</strong>" + (p.mrp && p.mrp > p.price ? " <span class='muted' style='text-decoration:line-through;font-size:12px;'>" + formatINR(p.mrp) + "</span>" : "") + "</td>" +
                "<td>" + stockBadge + "</td>" +
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
    product = product || null;
    $("#productModalTitle").textContent = product ? "Edit Product: " + product.name : "Add New Product";
    $("#p_id_existing").value = product ? product.id : "";
    $("#p_id").value = product ? product.id : "";
    $("#p_id").disabled = Boolean(product);
    $("#p_name").value = product ? product.name : "";
    $("#p_category").value = product ? product.category : "accessories";
    $("#p_badge").value = product && product.badge ? product.badge : "";
    $("#p_price").value = product ? product.price : "";
    $("#p_mrp").value = product && product.mrp != null ? product.mrp : "";
    $("#p_stock").value = product && product.stock != null ? product.stock : 10;
    $("#p_brand").value = product ? product.brand : "Apple";

    const imageUrl = product && product.images && product.images[0] ? product.images[0] : "";
    $("#p_image").value = imageUrl;
    if ($("#p_image_file")) $("#p_image_file").value = "";
    updateImagePreview(imageUrl, "#p_image_preview_wrap", "#p_image_preview", "#p_image_status");

    $("#p_short").value = product ? product.short || "" : "";
    $("#p_description").value = product ? product.description || "" : "";

    state.modalColors = (product && Array.isArray(product.colors))
      ? JSON.parse(JSON.stringify(product.colors))
      : [];
    renderProductColorRows();

    $("#productModal").showModal();
  }

  function renderProductColorRows() {
    const list = $("#p_colors_list");
    if (!list) return;

    if (!state.modalColors || !state.modalColors.length) {
      list.innerHTML = '<div class="muted" style="font-size:13px;padding:10px;background:#fff;border:1px dashed #ddd;border-radius:6px;text-align:center;">No color variants added yet. Click "+ Add Color" above to add color choices.</div>';
      return;
    }

    list.innerHTML = state.modalColors.map(function (c, idx) {
      const hex = c.hex || "#0071e3";
      const name = c.name || "";
      const img = c.image || "";
      return '<div class="color-variant-row" style="display:flex;gap:8px;align-items:center;background:#ffffff;padding:8px 10px;border-radius:8px;border:1px solid #e2e8f0;flex-wrap:wrap;">' +
        '<input type="color" class="color-hex-picker" data-color-idx="' + idx + '" value="' + escapeAttr(hex.startsWith("#") && hex.length === 7 ? hex : "#0071e3") + '" style="width:34px;height:34px;border:none;background:none;cursor:pointer;padding:0;" title="Pick Color Swatch">' +
        '<input type="text" class="color-name-input" data-color-idx="' + idx + '" placeholder="Color Name (e.g. Citrus)" value="' + escapeAttr(name) + '" style="width:140px;padding:6px 10px;font-size:13px;border:1px solid #ccc;border-radius:6px;">' +
        '<input type="text" class="color-hex-text" data-color-idx="' + idx + '" placeholder="#Hex Code" value="' + escapeAttr(hex) + '" style="width:85px;padding:6px 8px;font-size:13px;border:1px solid #ccc;border-radius:6px;">' +
        '<input type="text" class="color-img-input" data-color-idx="' + idx + '" placeholder="Image URL (images/products/...)" value="' + escapeAttr(img) + '" style="flex:1;min-width:160px;padding:6px 10px;font-size:13px;border:1px solid #ccc;border-radius:6px;">' +
        '<label class="btn btn-ghost btn-sm" style="margin:0;cursor:pointer;background:#f5f5f7;border:1px solid #ccc;font-size:12px;padding:6px 8px;" title="Upload Image">' +
          '📷 <input type="file" class="color-file-input" data-color-idx="' + idx + '" accept="image/*" style="display:none;">' +
        '</label>' +
        '<button type="button" class="btn btn-ghost btn-sm color-del-btn" data-color-idx="' + idx + '" style="color:#d9381e;padding:4px 8px;font-weight:700;" title="Remove Color">✕</button>' +
      '</div>';
    }).join("");

    $$(".color-hex-picker").forEach(function (inp) {
      inp.addEventListener("input", function () {
        const i = Number(inp.dataset.colorIdx);
        if (state.modalColors[i]) {
          state.modalColors[i].hex = inp.value;
          const hexText = list.querySelector('.color-hex-text[data-color-idx="' + i + '"]');
          if (hexText) hexText.value = inp.value;
        }
      });
    });

    $$(".color-hex-text").forEach(function (inp) {
      inp.addEventListener("input", function () {
        const i = Number(inp.dataset.colorIdx);
        if (state.modalColors[i]) {
          state.modalColors[i].hex = inp.value;
          const hexPicker = list.querySelector('.color-hex-picker[data-color-idx="' + i + '"]');
          if (hexPicker && inp.value.startsWith("#") && inp.value.length === 7) {
            hexPicker.value = inp.value;
          }
        }
      });
    });

    $$(".color-name-input").forEach(function (inp) {
      inp.addEventListener("input", function () {
        const i = Number(inp.dataset.colorIdx);
        if (state.modalColors[i]) state.modalColors[i].name = inp.value;
      });
    });

    $$(".color-img-input").forEach(function (inp) {
      inp.addEventListener("input", function () {
        const i = Number(inp.dataset.colorIdx);
        if (state.modalColors[i]) state.modalColors[i].image = inp.value;
      });
    });

    $$(".color-file-input").forEach(function (inp) {
      inp.addEventListener("change", async function () {
        const i = Number(inp.dataset.colorIdx);
        const file = inp.files && inp.files[0];
        if (!file || !state.modalColors[i]) return;
        try {
          const res = await uploadFile(file);
          if (res && res.url) {
            state.modalColors[i].image = res.url;
            renderProductColorRows();
            toast("Color variant image uploaded");
          }
        } catch (e) { toast("Upload failed: " + e.message); }
      });
    });

    $$(".color-del-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const i = Number(btn.dataset.colorIdx);
        state.modalColors.splice(i, 1);
        renderProductColorRows();
      });
    });
  }

  async function saveProduct(e) {
    e.preventDefault();
    const existingId = $("#p_id_existing").value;
    const imgVal = $("#p_image").value.trim();

    const formattedColors = (state.modalColors || [])
      .filter(function (c) { return c && c.name && c.name.trim(); })
      .map(function (c) {
        return {
          name: c.name.trim(),
          hex: c.hex ? c.hex.trim() : "#0071e3",
          image: c.image ? c.image.trim() : imgVal
        };
      });

    let imagesList = imgVal ? [imgVal] : [];
    const colorImages = formattedColors.map(function (c) { return c.image; }).filter(Boolean);
    if (colorImages.length) {
      imagesList = Array.from(new Set(imagesList.concat(colorImages)));
    }

    const payload = {
      id: $("#p_id").value.trim() || undefined,
      name: $("#p_name").value.trim(),
      category: $("#p_category").value,
      badge: $("#p_badge").value || null,
      price: Number($("#p_price").value),
      mrp: $("#p_mrp").value === "" ? undefined : Number($("#p_mrp").value),
      stock: Number($("#p_stock").value),
      brand: $("#p_brand").value.trim() || "Apple",
      images: imagesList,
      colors: formattedColors,
      short: $("#p_short").value.trim(),
      description: $("#p_description").value.trim(),
      storageOptions: [],
      specs: {}
    };

    const btn = $("#productSaveBtn");
    btn.disabled = true;
    try {
      if (existingId) {
        const existing = state.products.find(function (p) { return p.id === existingId; }) || {};
        payload.storageOptions = existing.storageOptions || [];
        payload.specs = existing.specs || {};
        if (!payload.images.length && existing.images) payload.images = existing.images;
        await api("/admin/products/" + encodeURIComponent(existingId), {
          method: "PUT",
          body: JSON.stringify(payload)
        });
        toast("Product updated successfully");
      } else {
        await api("/admin/products", { method: "POST", body: JSON.stringify(payload) });
        toast("Product created successfully");
      }
      $("#productModal").close();
      if (state.view === "products") renderProducts($("#content"));
    } catch (ex) {
      toast(ex.message);
    } finally {
      btn.disabled = false;
    }
  }

  async function renderBanners(el) {
    const data = await api("/admin/banners");
    state.banners = data.banners || [];
    el.innerHTML =
      '<div class="panel">' +
        '<div class="panel-head">' +
          "<h3>" + state.banners.length + " Banners & Advertisements</h3>" +
          '<span class="muted">Active on storefront: ' + state.banners.filter(function (b) { return b.active; }).length + "</span>" +
        "</div>" +
        (state.banners.length
          ? '<table><thead><tr><th>Banner</th><th>Placement</th><th>Target Category</th><th>CTA Button</th><th>Status</th><th>Order</th><th>Actions</th></tr></thead><tbody>' +
            state.banners.map(function (b) {
              const activeBadge = b.active
                ? '<span class="badge badge-green">Active</span>'
                : '<span class="badge badge-amber">Inactive</span>';
              const imagePath = b.image && (/^(https?:|data:|\/)/.test(b.image) ? b.image : "../" + b.image);
              const thumb = imagePath ? '<img src="' + escapeAttr(imagePath) + '" style="width:36px;height:36px;object-fit:cover;border-radius:4px;margin-right:10px;vertical-align:middle;background:#eee;" onerror="this.style.display=\'none\'">' : '';
              return "<tr>" +
                "<td><div style='display:flex;align-items:center;'>" + thumb + "<div><strong>" + escapeHtml(b.title) + "</strong>" +
                  (b.badge ? " <span class='badge badge-blue'>" + escapeHtml(b.badge) + "</span>" : "") +
                  "<div class='muted'>" + escapeHtml(b.subtitle || b.id) + "</div></div></div></td>" +
                "<td><span class='badge badge-blue'>" + escapeHtml(b.placement || "hero") + "</span></td>" +
                "<td>" + escapeHtml(b.category || "all") + "</td>" +
                "<td><a href='../" + escapeAttr(b.link || "#") + "' target='_blank' style='text-decoration:none;color:var(--accent,#0071e3);font-weight:500;'>" + escapeHtml(b.btnText || "Learn More") + " →</a></td>" +
                "<td>" + activeBadge + "</td>" +
                "<td>" + (b.sortOrder || 0) + "</td>" +
                "<td class='actions'>" +
                  '<button class="btn btn-ghost btn-sm b-edit" data-id="' + escapeAttr(b.id) + '">Edit</button>' +
                  '<button class="btn btn-ghost btn-sm b-toggle" data-id="' + escapeAttr(b.id) + '">' + (b.active ? "Deactivate" : "Activate") + '</button>' +
                  '<button class="btn btn-danger btn-sm b-del" data-id="' + escapeAttr(b.id) + '">Delete</button>' +
                "</td>" +
              "</tr>";
            }).join("") +
            "</tbody></table>"
          : '<div class="empty">No banners or advertisements created yet. Click "Add Banner / Ad" to create one.</div>') +
      "</div>";

    el.querySelectorAll(".b-edit").forEach(function (btn) {
      btn.onclick = function () {
        const id = btn.getAttribute("data-id");
        const b = state.banners.find(function (x) { return x.id === id; });
        if (b) openBannerModal(b);
      };
    });

    el.querySelectorAll(".b-toggle").forEach(function (btn) {
      btn.onclick = async function () {
        const id = btn.getAttribute("data-id");
        const b = state.banners.find(function (x) { return x.id === id; });
        if (!b) return;
        try {
          await api("/admin/banners/" + encodeURIComponent(id), {
            method: "PUT",
            body: JSON.stringify({ active: !b.active })
          });
          toast("Banner " + (b.active ? "deactivated" : "activated"));
          renderBanners(el);
        } catch (ex) { toast(ex.message); }
      };
    });

    el.querySelectorAll(".b-del").forEach(function (btn) {
      btn.onclick = async function () {
        const id = btn.getAttribute("data-id");
        if (!confirm("Are you sure you want to delete this banner advertisement?")) return;
        try {
          await api("/admin/banners/" + encodeURIComponent(id), { method: "DELETE" });
          toast("Banner deleted");
          renderBanners(el);
        } catch (ex) { toast(ex.message); }
      };
    });
  }

  function openBannerModal(b) {
    b = b || {};
    $("#bannerModalTitle").textContent = b.id ? "Edit Banner / Advertisement" : "Add Banner / Advertisement";
    $("#b_id_existing").value = b.id || "";
    $("#b_title").value = b.title || "";
    $("#b_id").value = b.id || "";
    $("#b_id").disabled = Boolean(b.id);
    $("#b_placement").value = b.placement || "hero";
    $("#b_category").value = b.category || "all";
    $("#b_badge").value = b.badge || "";
    $("#b_btnText").value = b.btnText || "Learn More";

    const imageUrl = b.image || "";
    $("#b_image").value = imageUrl;
    if ($("#b_image_file")) $("#b_image_file").value = "";
    updateImagePreview(imageUrl, "#b_image_preview_wrap", "#b_image_preview", "#b_image_status");

    $("#b_link").value = b.link || "";
    $("#b_subtitle").value = b.subtitle || "";
    $("#b_sortOrder").value = b.sortOrder != null ? b.sortOrder : 1;
    $("#b_active").checked = b.active !== false;
    $("#bannerModal").showModal();
  }

  async function saveBanner(e) {
    e.preventDefault();
    const existingId = $("#b_id_existing").value;
    const title = $("#b_title").value.trim();
    if (!title) return toast("Title is required");

    const payload = {
      id: existingId || $("#b_id").value.trim(),
      title: title,
      placement: $("#b_placement").value,
      category: $("#b_category").value,
      badge: $("#b_badge").value.trim() || null,
      btnText: $("#b_btnText").value.trim() || "Learn More",
      image: $("#b_image").value.trim(),
      link: $("#b_link").value.trim() || "#",
      subtitle: $("#b_subtitle").value.trim(),
      sortOrder: Number($("#b_sortOrder").value) || 0,
      active: $("#b_active").checked
    };

    const isEdit = Boolean(existingId);
    const url = isEdit ? "/admin/banners/" + encodeURIComponent(existingId) : "/admin/banners";
    const method = isEdit ? "PUT" : "POST";

    const btn = $("#bannerSaveBtn");
    btn.disabled = true;
    try {
      await api(url, { method: method, body: JSON.stringify(payload) });
      toast(isEdit ? "Banner updated successfully" : "Banner created successfully");
      $("#bannerModal").close();
      if (state.view === "banners") renderBanners($("#content"));
    } catch (ex) {
      toast(ex.message);
    } finally {
      btn.disabled = false;
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
