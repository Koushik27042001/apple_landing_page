# The Apple Store Pune — Backend API

A small Node.js/Express server that gives the static storefront in the
parent folder real, working payments via **Razorpay** — order creation,
signature verification, and a webhook for reliable payment confirmation.

It shares the exact same product catalog as the frontend
(`../js/data.js`), so prices can never drift or be tampered with from
the browser: every order total is recomputed here, server-side.

## 1. Install

```bash
cd server
npm install
```

## 2. Configure environment variables

```bash
cp .env.example .env
```

Then edit `.env`:

| Variable | Where to get it |
|---|---|
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | [Razorpay Dashboard → Settings → API Keys](https://dashboard.razorpay.com/app/keys). Use **Test Mode** keys (`rzp_test_...`) while developing — they let you simulate full payments with no real money. |
| `RAZORPAY_WEBHOOK_SECRET` | Any string you choose. Enter the same string in the Razorpay Dashboard under **Settings → Webhooks** when you register the webhook URL (see step 5). |
| `CORS_ORIGIN` | The origin(s) your frontend is served from, comma-separated. For local development with the frontend on `http://localhost:8080`, the default in `.env.example` already works. |

Without real keys, the server still starts and `/api/products` works, but order/payment endpoints will return a clear "not configured" error instead of crashing.

## 3. Run it

```bash
npm start
```

You should see:

```
The Apple Store Pune API running on http://localhost:4000
Health check: http://localhost:4000/api/health
```

## 4. Point the frontend at it

The frontend already knows to look for the backend at
`http://localhost:4000/api` (see `../js/config.js`). Just serve the
frontend as usual, e.g. from the project root:

```bash
python -m http.server 8080
```

Open `http://localhost:8080/checkout.html` — with both servers running
and test keys configured, "Place Order" (for UPI/Card/EMI) will open a
**real Razorpay Test Mode checkout window**. Use Razorpay's [test card/UPI
credentials](https://razorpay.com/docs/payments/payments/test-card-upi-details/)
to simulate a full payment with no real money involved.

If the backend isn't running, checkout automatically falls back to the
built-in simulated "demo mode" flow — the storefront always works
standalone, even with zero setup.

## 5. Going live (production)

1. Complete Razorpay KYC and switch `.env` to your **Live Mode** keys.
2. Deploy this folder to a Node host (Render, Railway, a small VPS, etc.).
3. In the Razorpay Dashboard, register a webhook pointing at
   `https://your-backend-domain.com/api/payments/webhook`, subscribed to
   at least `payment.captured`, `payment.failed`, and `refund.processed`.
   Use the same secret you put in `RAZORPAY_WEBHOOK_SECRET`.
4. Update `CORS_ORIGIN` in `.env` to your real frontend domain.
5. Update `APPLE_STORE_API_BASE` in `../js/config.js` to your backend's
   public URL (or serve both from the same origin behind a reverse
   proxy and set it to `/api`).
6. Replace the JSON-file order store (`data/orders.json`) with a real
   database before going live at any meaningful scale — see
   `src/lib/store.js`; it's a small, isolated module specifically so
   this swap doesn't touch any route code.

## API Reference

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Uptime/connectivity check used by the frontend |
| GET | `/api/products` | Full product + category catalog |
| GET | `/api/products/:id` | Single product |
| POST | `/api/orders` | Validates cart + customer + shipping info, recomputes price, creates a Razorpay order, stores a `created` order |
| GET | `/api/orders/:id` | Order status lookup |
| POST | `/api/payments/verify` | Verifies the Razorpay signature after checkout and marks the order `paid` |
| POST | `/api/payments/webhook` | Razorpay server-to-server event notifications (source of truth for order status) |

## Folder Structure

```
server/
├── server.js               # Express app entry point
├── .env.example             # Copy to .env and fill in real values
├── data/
│   └── orders.json          # JSON-file order storage (swap for a real DB later)
└── src/
    ├── lib/
    │   ├── catalog.js        # Reads ../../js/data.js, prices carts server-side
    │   ├── razorpay.js       # Razorpay SDK client
    │   └── store.js          # Order persistence helpers
    └── routes/
        ├── products.js
        ├── orders.js
        └── payments.js
```
