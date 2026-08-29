# Iswift Gadgets — Storefront

Separated frontend (`client/`) and backend (`server/`) for an Apple-style e-commerce storefront.

- **Client:** Plain HTML, CSS and JavaScript (no framework, no build step) — see `/client`
- **Server:** Node.js + Express API, admin panel APIs, Razorpay payments — see `/server`
- **Docs:** Client-facing documentation — see `/docs`

## Project structure

```
apple_landing_page/
├── client/                 # Frontend (storefront + admin UI)
│   ├── index.html, …       # Store pages
│   ├── css/, js/, images/
│   └── admin/              # Control panel UI
├── server/                 # Backend API
│   ├── server.js
│   ├── src/
│   └── data/               # JSON stores (products, coupons, orders, …)
├── docs/
└── test/
```

## Quick start — frontend only (demo mode)

```bash
cd client
python -m http.server 8080
```

Open `http://localhost:8080`.

## Quick start — full stack

1. Backend:

   ```bash
   cd server
   npm install
   cp .env.example .env   # set ADMIN_PASSWORD + Razorpay keys
   npm start
   ```

   This serves **both** the API and the client:

   - Store: http://localhost:4000/
   - Admin: http://localhost:4000/admin/  (password `admin123` by default)
   - API:   http://localhost:4000/api/health

2. Or run the client separately on port 8080 (pointed at the API via `client/js/config.js`):

   ```bash
   cd client
   python -m http.server 8080
   ```

## Scripts (repo root)

```bash
npm run start:server   # start API + serve client from /client
npm run serve:client   # static client only on :8080
npm test               # Playwright regression + catalog tests
```

## Where to go next

- Admin panel guide: `client/admin/README.md`
- Backend / payments: `server/README.md`
- Product seed catalog: `client/js/data.js`
- Client handover docs: `docs/PROJECT_DOCUMENTATION.md`
