# Dolly — website

The online store for the Dolly clothing brand. It's built with Next.js 15 and Tailwind CSS v4, and runs on **Cloudflare Workers**, all within Cloudflare's free plan:

| Piece | Cloudflare service | Used for |
|---|---|---|
| Database | **D1** | Orders, products, stock per size, shipping fees |
| Storage | **KV** (`MEDIA`) | Product photos uploaded in the admin |
| Page cache | **KV** (`NEXT_INC_CACHE_KV`) + D1 | Shop pages are cached and only re-rendered when something changes |

The roadmap is in [PLAN.md](PLAN.md).

## Run locally

```bash
npm install
cp .dev.vars.example .dev.vars   # then set your own ADMIN_PASSWORD
npm run db:migrate:local         # creates the local database with the current products
npm run dev                      # http://localhost:3000, admin at /admin
```

To test in the real Cloudflare runtime, including page caching, run `npm run preview` (http://localhost:8787).

## The admin (`/admin`)

- **Orders:** see every order, call the customer, and move it through new → confirmed → shipped → delivered. Cancelling an order puts its items back in stock.
- **Products:** add, edit, hide, reorder or delete products. Set the price, sale price, sizes and stock for each size. Upload photos (they're resized in the browser before upload) or copy linked photos from the old store into Dolly's own storage.
- **Shipping:** edit the delivery regions and fees shown at checkout.

## How orders work

1. The customer checks out with cash on delivery.
2. `POST /api/orders` re-prices everything from the database (client prices are never trusted) and checks stock.
3. The order is saved and stock is deducted **in one transaction**. The database refuses stock below zero, so two people can't both buy the last piece.
4. Cached shop pages refresh so sold-out sizes show straight away.
5. If email is set up, an alert is sent to `NOTIFY_EMAIL`.

## Deploy to Cloudflare (first time)

1. Create the resources and copy each printed id into `wrangler.jsonc`, replacing the placeholder ids:
   ```bash
   npx wrangler login
   npx wrangler d1 create dolly-orders            # id goes in BOTH d1_databases entries
   npx wrangler kv namespace create MEDIA
   npx wrangler kv namespace create NEXT_INC_CACHE_KV
   ```
2. Create the tables and load the products:
   ```bash
   npm run db:migrate:remote
   ```
3. Set the secrets:
   ```bash
   npx wrangler secret put ADMIN_PASSWORD         # choose a strong password
   npx wrangler secret put RESEND_API_KEY         # optional, for new-order emails
   ```
4. Create `.env.production.local` (it's never committed), so the build reads the **live** database:
   ```
   CLOUDFLARE_ACCOUNT_ID=...      # Cloudflare dashboard → Workers & Pages → Account ID
   CLOUDFLARE_API_TOKEN=...       # a token with "D1: Read" permission
   D1_DATABASE_ID=...             # same id as in wrangler.jsonc
   ```
5. Deploy:
   ```bash
   npm run deploy
   ```

**Automatic deploys from GitHub (recommended):** in the Cloudflare dashboard, open the worker → Settings → Builds, connect the repo, and set:
- Build command: `npx opennextjs-cloudflare build`
- Deploy command: `npx opennextjs-cloudflare deploy`
- Build variables: the three values from step 4 (mark the token as secret)

### New-order emails (optional, free)

1. Create a free account at resend.com **using the email in `NOTIFY_EMAIL`** (in `wrangler.jsonc`, currently dollyy825@gmail.com). Without your own verified domain, Resend only delivers to the account's own address.
2. Create an API key and save it with `npx wrangler secret put RESEND_API_KEY`.

## Where things live

| Path | What |
|---|---|
| `src/lib/catalog.ts` | Shared types, collections (Summer '26 etc.) and contact details |
| `src/lib/store.ts` | Reading products and shipping fees |
| `src/lib/db.ts` | Writing orders, products, stock and shipping |
| `src/lib/orders.ts` | Order validation and pricing |
| `src/lib/notify.ts` | New-order email |
| `src/app/api/orders` | Checkout endpoint |
| `src/app/admin` | Admin: orders, products, shipping |
| `src/app/media` | Serves uploaded photos |
| `migrations/` | Database tables plus the starting product data |
| `src/lib/policies.ts` | Policy page text (placeholder) |
