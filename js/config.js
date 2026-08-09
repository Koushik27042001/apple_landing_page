/* ============================================================
   Frontend configuration.
   ------------------------------------------------------------
   APPLE_STORE_API_BASE points the storefront at the backend in
   /server. Leave it as-is for local development (the backend's
   default port is 4000 — see server/.env.example).

   For production, once the backend is deployed, either:
     a) point this at its public URL, e.g. "https://api.yourdomain.in/api"
     b) or serve the frontend from the SAME origin as the backend and
        set this to the relative path "/api" (recommended — avoids CORS).

   If the backend is unreachable (e.g. this site is opened as a plain
   static demo with no server running), checkout.html automatically
   falls back to a simulated "demo mode" checkout so the storefront
   still works standalone.
   ============================================================ */
const APPLE_STORE_API_BASE = "http://localhost:4000/api";
