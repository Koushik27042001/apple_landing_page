/* Loads the live catalog from the backend when available so admin
   panel product edits appear on the storefront. Falls back silently
   to the bundled client/js/data.js catalog if the API is offline. */
(function () {
  if (typeof PRODUCTS === "undefined" || typeof CATEGORIES === "undefined") return;
  const base = (typeof APPLE_STORE_API_BASE !== "undefined" && APPLE_STORE_API_BASE)
    ? APPLE_STORE_API_BASE
    : "http://localhost:4000/api";

  fetch(base + "/products", { method: "GET" })
    .then(function (res) { return res.ok ? res.json() : null; })
    .then(function (data) {
      if (!data || !Array.isArray(data.products) || !data.products.length) return;
      PRODUCTS.length = 0;
      data.products.forEach(function (p) { PRODUCTS.push(p); });
      if (Array.isArray(data.categories) && data.categories.length) {
        CATEGORIES.length = 0;
        data.categories.forEach(function (c) { CATEGORIES.push(c); });
      }
      document.dispatchEvent(new CustomEvent("catalog:updated", { detail: data }));
    })
    .catch(function () { /* keep bundled catalog */ });
})();
