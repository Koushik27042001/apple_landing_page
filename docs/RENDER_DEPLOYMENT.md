# Deploy Iswift Gadgets to Render

## Recommended deployment

Deploy this repository as **one Render Web Service**. Express serves `client/`,
`/admin/`, and `/api/` together. Do not set a root directory to `server`: the
backend also reads the frontend product seed and serves its assets.

1. Push these changes to your GitHub repository.
2. In Render, choose **New > Blueprint**, connect the repository, and select
   `render.yaml`. Review the paid Starter service and its 1 GB persistent disk.
3. Deploy. Render generates a unique `ADMIN_PASSWORD`; find it in the service's
   Environment settings. Do not commit it to GitHub.
4. Open the service URL, `/admin/`, and `/api/health`. Health should return
   `ok: true`. Sign in to the admin panel with the generated password.
5. Verify store settings, prices, stock, merchant payment destination, and a COD
   order before accepting customer orders.

For a password-free feature preview, share `/admin/index.html?demo=1` on your
deployed site. The demo also works when only `client/` is hosted statically.
It uses sample data stored in the visitor's browser and never calls the admin API.
The regular `/admin/` login remains protected.

The Blueprint uses Render's supported `healthCheckPath`, `disk`, and generated
environment values: <https://render.com/docs/blueprint-spec>.

### Manual service setup

| Setting | Value |
| --- | --- |
| Service | Web Service, Node |
| Root directory | Leave empty (repository root) |
| Build command | `npm ci --prefix server --omit=dev && npm run build` |
| Start command | `npm start` |
| Health check | `/api/health` |
| Node version | `22.18.0` |
| Disk mount | `/var/data` (1 GB or larger) |

Add the values from `server/.env.production.example` in Render's Environment
settings. Set a random admin password of at least 20 characters. Render provides
`PORT` automatically; it does not need to be added manually.

## Environment files

- `server/.env`: ignored local configuration; created during this setup with a
  generated admin password. For a new clone, copy `server/.env.example` to this
  file and set a unique password.
- `server/.env.example`: safe, committed local template.
- `server/.env.production.example`: safe, committed template for Render values.
- No frontend `.env` is required. This is plain HTML/JavaScript and uses `/api`.
  Browser code must never contain MongoDB passwords or Razorpay secrets.
- No root `.env` is required; the server supports it only as a legacy fallback.

| Variable | Purpose |
| --- | --- |
| `NODE_ENV` | `production` on Render |
| `ADMIN_PASSWORD` | Required production admin password; Blueprint generates it |
| `DATA_DIR` | `/var/data/store`; persistent JSON store |
| `UPLOAD_DIR` | `/var/data/uploads`; persistent admin uploads |
| `MONGODB_URI` | Optional private MongoDB URI; blank uses disk storage |
| `CORS_ORIGIN` | Blank for this same-origin setup; explicit origins only if needed |
| `CURRENCY` | `INR` |
| `RAZORPAY_PAYMENT_LINK` | Merchant payment destination; verify ownership |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | Optional paired API credentials |
| `RAZORPAY_WEBHOOK_SECRET` | Required when enabling Razorpay webhooks |

If using MongoDB, configure the database user's permissions and network access
for your Render service. A configured but unavailable MongoDB prevents production
startup; a later outage returns errors instead of silently switching databases.
Do not switch between JSON and MongoDB without migrating the existing records.

## Storage and payments

The supplied setup runs **one Node process on one instance**. Its JSON store is
suitable for this single-instance setup, not shared across replicas. Back up the
disk and test restores. MongoDB can replace JSON for database records; uploaded
images still use the disk. Do not remove the disk or use an ephemeral free service
for customer orders. New disks start with an empty order store and seeded catalog;
existing local orders and uploads are not automatically migrated.

The current UI uses COD and merchant payment links. Payment-link orders remain
`awaiting_payment` until the merchant verifies receipt and updates them in admin.
Query-string payment amounts are not proof of payment. API credentials alone do
not change this UI into an automated Razorpay checkout.

If integrating the existing API-based gateway, configure the webhook URL as
`https://YOUR-SERVICE.onrender.com/api/payments/webhook`, add its signing secret,
and test actual capture/refund events in Razorpay test mode before using live keys.
API payment verification requires a captured payment with a matching amount and
currency. Live payment processing has not been verified by the local tests.

## Security follow-up

A database credential was previously present in the tracked environment example.
It has been removed from the current file, but **rotate that database password**:
old Git commits may still contain it. Local order records are also excluded from
future commits; review repository history/access if those records contain real
customer information. Git history has not been rewritten.

Uploaded images accept PNG, JPEG, WebP and GIF; SVG uploads are disabled. The API
adds security headers, login/order rate limits and disables API caching. Public
order retrieval requires admin authentication. Existing inline scripts mean a
strict Content Security Policy still requires a separate frontend refactor.

## Verification

```sh
npm ci --prefix server --omit=dev
npm run build
npm test
npm start
```

The build validates all server/browser JavaScript and executable inline scripts;
there is no bundle or `dist` folder. Automated tests use isolated temporary data
and cover production configuration, HTTP routes, authentication, CORS, malformed
requests, uploads, order persistence, and login throttling. CI runs these checks.
The previous GitHub Pages deployment is manual-only because static Pages cannot
run this backend. Legacy browser scripts remain available via `test:browser` and
require a running site plus Playwright; they are not the deployment gate.

Deployment to a Render account, real MongoDB connectivity, browser interaction,
and live payment transactions must be verified separately.
