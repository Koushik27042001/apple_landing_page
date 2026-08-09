# The Apple Store Pune

An Apple-style e-commerce storefront for iPhone, Mac, iPad, Apple Watch, AirPods and accessories, built for the Indian market (UPI, No-Cost EMI, WhatsApp support, Pune store details).

- **Frontend:** Plain HTML, CSS and JavaScript (no framework, no build step) — see `/index.html` and friends.
- **Backend:** Node.js + Express API with real Razorpay payment integration — see `/server`.
- **Docs:** Client-facing project documentation and requirements checklist — see `/docs`.

## Quick Start (frontend only, demo mode)

No backend needed to browse the store, add to cart, and click through checkout in simulated "demo mode":

```bash
python -m http.server 8080
```

Open `http://localhost:8080`.

## Quick Start (full stack, real payments)

1. Start the backend (see `server/README.md` for full details):

   ```bash
   cd server
   npm install
   cp .env.example .env   # then add your Razorpay TEST keys
   npm start
   ```

2. In another terminal, serve the frontend from the project root:

   ```bash
   python -m http.server 8080
   ```

3. Open `http://localhost:8080/checkout.html` and place a test order — with the backend running and test keys configured, this opens a real Razorpay test-mode payment window.

## Project Structure

```
apple_landing_page/
├── index.html, category.html, product.html, cart.html, checkout.html,
│   about.html, contact.html, terms.html      # Storefront pages
├── css/style.css                              # Design system
├── js/
│   ├── data.js        # Product catalog — single source of truth (frontend + backend)
│   ├── cart.js         # localStorage-backed shopping cart
│   ├── icons.js         # Inline SVG icon library
│   ├── main.js          # Shared header/footer, search, toasts, reveal animations
│   └── config.js         # Backend API base URL
├── images/               # Product photos & hero banners
├── server/                # Node.js/Express backend + Razorpay integration (see server/README.md)
└── docs/
    ├── PROJECT_DOCUMENTATION.md   # What's built, what's needed to go live, architecture
    └── CLIENT_CHECKLIST.md         # Fillable questionnaire to collect business/payment/product info
```

## Where to Go Next

- **If you're the client:** read `docs/PROJECT_DOCUMENTATION.md` first, then fill in `docs/CLIENT_CHECKLIST.md`.
- **If you're continuing development:** read `server/README.md` to wire up real payments, and `js/data.js` to manage the product catalog.
