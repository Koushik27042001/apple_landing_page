# Admin Control Panel

Manage products, coupons, orders and store settings for the Iswift Gadgets storefront.

## Public static demo

Open `admin/index.html?demo=1` relative to your hosted storefront, or click
**Explore admin demo** on the admin login page. No password or backend is needed.
For example, when serving `client/` locally, open
`http://localhost:8080/admin/index.html?demo=1`.

Visitors can explore the dashboard, edit sample products, banners and coupons,
change sample order statuses, upload small images, and edit store settings.
Changes persist only in this browser's demo storage. The live storefront, real
orders and admin session are unaffected. **Reset demo** restores the sample data;
**Exit demo** returns to the normal login screen. Images are limited to 500 KB
for browser storage. Host the entire `client/` folder so catalog and image paths
remain available, including on GitHub Pages under a project subdirectory.

## Quick start

```bash
cd server
npm install
npm start
```

Then open:

**http://localhost:4000/admin/**

Use `ADMIN_PASSWORD` from `server/.env` locally, or from Render's Environment
settings for the deployed service. This is separate from the public demo.

## What you can do

| Section | Features |
|---|---|
| **Dashboard** | Product count, coupons, orders, paid revenue, recent orders |
| **Products** | Add / edit / delete products, price, stock, badge, images |
| **Coupons** | Percent or fixed discounts, min order, usage limits, start/end dates |
| **Orders** | View orders, update status (paid → shipped → delivered, etc.) |
| **Settings** | Store name, phones, email, WhatsApp, address, map link, shipping rules |

## Coupons on the storefront

1. Create a coupon in the panel (a starter `WELCOME10` is seeded automatically).
2. Customer enters the code on **Checkout → Payment** and clicks **Apply**.
3. Backend validates the coupon and recalculates the order total before payment.

## Data storage

Editable data is saved as JSON under `server/data/`:

- `products.json` — catalog (seeded from `client/js/data.js` on first run)
- `coupons.json` — coupon codes
- `settings.json` — store contact & shipping settings
- `orders.json` — customer orders
- `admin-sessions.json` — login tokens

Restart is not required after edits — the next API request reads the updated files.
