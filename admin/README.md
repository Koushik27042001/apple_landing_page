# Admin Control Panel

Manage products, coupons, orders and store settings for the Iswift Gadgets storefront.

## Quick start

```bash
cd server
npm install
npm start
```

Then open:

**http://localhost:4000/admin/**

Default password: `admin123`  
Change it by setting `ADMIN_PASSWORD` in `server/.env`.

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

- `products.json` — catalog (seeded from `js/data.js` on first run)
- `coupons.json` — coupon codes
- `settings.json` — store contact & shipping settings
- `orders.json` — customer orders
- `admin-sessions.json` — login tokens

Restart is not required after edits — the next API request reads the updated files.
