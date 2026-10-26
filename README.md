# Dolly — website

The front end for the Dolly clothing brand. It's built with Next.js 15, Tailwind CSS v4 and Lenis. The design direction and roadmap are in [PLAN.md](PLAN.md).

## Run locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Where things live

| Path | What |
|---|---|
| `src/lib/catalog.ts` | Products, collections, shipping zones and contact details. Edit this to change what is on the site. |
| `src/lib/policies.ts` | Policy page text (placeholder) |
| `src/app/` | Pages: home, shop, collections, products, checkout, lookbook, about, contact, policies, search |
| `src/components/` | Header, footer, bag drawer, product card and other shared pieces |
| `src/app/globals.css` | Design tokens (colours, fonts, easing) |

## Status

The site is **front end only**. The bag is saved in the browser. Checkout writes an order summary, which the customer sends to Dolly on WhatsApp; nothing is saved on a server yet. Product images are still loaded from the current store's CDN.
