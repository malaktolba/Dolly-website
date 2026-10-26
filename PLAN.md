# Dolly — New Website Plan

## 1. Where we are

**Current site (dolly-shop.com)**
- Built on **EasyOrders** (an Egyptian store builder). It's a generic template: a white page, product grids, a dark top bar that says "Total order value at checkout appears in Egyptian pounds".
- 3 collections: **Winter '25**, **Ramadan Set**, **Summer '26**. About 12 products priced 1,000–2,500 EGP, some on sale (e.g. The Brown Coat 2,500 → 2,300).
- Product page: one big photo, size chips (e.g. S-M), Buy now / Add to cart, plain-text description (style, colour, "model wears").
- Contact: WhatsApp 01035723775, dollyy825@gmail.com. 4 policy pages (privacy, refund, terms, shipping).
- Brand assets: a round pink "DOLLY" logo and a dark cocoa-brown accent. The photography is strong (e.g. the Terra Dress shot against a red door), but the template hides it.

**Reference (aoiofficial.com)**: what makes it feel premium
- Full-bleed editorial imagery and a huge stacked serif logo on the hero. A transparent header sits on top of the photo.
- Small, uppercase, widely spaced nav (SHOP · CRAFT · OUR WORLD · ABOUT). Two type families: a high-contrast display serif (Saol Display) and a clean grotesk (Trio Grotesk).
- Story first, product second. Long-form brand copy is mixed with single hero products, and each piece gets a code and edition ("6-C-14, Edition of 6").
- Category tiles with a single "EXPLORE" call to action. A "1 of 1" gallery section, plus "Be the first to know when our next drop is launching".
- Lots of whitespace, slow fades and reveals, and a large, organised footer.
- Built on Shopify (headless-style custom front end).

**Repo**: github.com/malaktolba/Dolly-website exists and is **empty**. The local folder is empty. Node 24 and git are installed.

## 2. Direction: "Dolly, editorial"

The goal is to keep Dolly's identity (pink logo, cocoa brown, playful collection names) and present it the AOI way: image-led, quiet, and confident.

| Element | Choice |
|---|---|
| Palette | Cream background `#F6F1EA`, cocoa ink `#2B1511` (from the current top bar), Dolly pink accent `#F2B8C6` (used sparingly: logo, badges, hover) |
| Display font | **Bodoni Moda** or **Cormorant Garamond** (free Google Fonts alternatives to Saol) |
| UI font | **Inter Tight** or **Manrope**, uppercase and letter-spaced for nav and labels |
| Imagery | Full-bleed, edge to edge, no rounded cards, with a large gap between sections |
| Motion | Smooth scroll (Lenis), fade-up on reveal, image crossfade on product hover (a second photo) |
| Product codes | AOI-style tags, e.g. **SS26-04 · Terra Dress**, which make Dolly drops feel collectible |

## 3. Sitemap

1. **Home**
   - Hero: a full-screen campaign image or video, a large DOLLY wordmark, and arrows to switch collections (like AOI's "‹ SKIRTS | SCULPTURES ›")
   - A short brand statement in serif
   - A featured drop (Summer '26): one big image with 3–4 products
   - Collection tiles: Summer '26 / Winter '25 / Ramadan Set → EXPLORE
   - A spotlight piece with a long description (e.g. The Brown Coat)
   - "Get notified for the next drop" (email or WhatsApp number)
   - Instagram strip
2. **Shop**: all products, filterable by collection, category (skirts, dresses, sets, outerwear) and size
3. **Collection page**: a campaign header image, an intro paragraph and a product grid
4. **Product page**: a scrolling image gallery on the left and a sticky info panel on the right (code, name, price, sale price, size picker, size guide, Add to bag), with accordions for Details / Fit / Shipping & Returns and a "Complete the look" row
5. **Bag**: a slide-out drawer
6. **Checkout**: name, phone, governorate, address, notes; **cash on delivery** at launch, cards later. Shipping fee depends on governorate.
7. **Order confirmation**: with a "Confirm on WhatsApp" button
8. **Lookbook / Our World**: campaign shoots per season
9. **About**: the Dolly story
10. **Contact**: WhatsApp, email, Instagram
11. **Policies**: Privacy, Refund, Terms, Shipping (content carried over)
12. **Search** and **404**
13. **Admin** (private): add, edit and remove products and stock; view and update orders

Later: an Arabic (RTL) version and the EN/AR toggle.

## 4. Tech stack (recommended)

- **Next.js 15 (App Router) + TypeScript**: fast, SEO-friendly, deploys free on Vercel
- **Tailwind CSS** for styling, **Framer Motion** + **Lenis** for the AOI-style motion
- **Supabase** (free tier) for products, collections, orders and stock, auth for the admin, and image storage
- **Payments**: cash on delivery at launch, then **Paymob** (cards, wallets, InstaPay) in phase 2
- **Email**: Resend, for order confirmations to the customer and to Dolly
- **Hosting**: Vercel. Point **dolly-shop.com** at it at launch, once the old site is retired.

**Alternative**: headless **Shopify** (what AOI uses). It gives a ready-made admin, inventory and payment apps, and works with cash on delivery in Egypt. The downside is roughly US$39/month plus fees, and less flexibility.

## 5. Build phases

| # | Phase | Output |
|---|---|---|
| 0 | **Setup** | Next.js project, Tailwind, fonts, design tokens, push to the GitHub repo, Vercel preview link |
| 1 | **Design system** | Header (transparent → solid on scroll), mobile menu, footer, buttons, product card, type scale |
| 2 | **Front end with sample data** | Home, Shop, Collection and Product pages built from a local `products.json` (the 12 current products and photos) |
| 3 | **Cart + checkout** | Bag drawer, checkout form, governorate shipping fees, cash-on-delivery orders saved to the database, confirmation email and WhatsApp link |
| 4 | **Admin** | Login, product and stock management, image upload, order list with status (new → confirmed → shipped → delivered) |
| 5 | **Content pages** | About, Lookbook, Contact, the 4 policies, drop-notify signup |
| 6 | **Polish** | Motion, image optimisation, SEO (meta, Open Graph, sitemap), Meta Pixel and analytics, accessibility, mobile QA |
| 7 | **Launch** | Move the domain, redirect old `/products/...` URLs, test orders |
| 8 | **Phase 2** | Paymob card payments, Arabic/RTL, discount codes |

Phases 0–2 give a clickable site that can be reviewed before any backend work.

## 6. What I need from you

- [ ] **Logo** files (SVG or high-res PNG)
- [ ] **High-res photos** for every product (2–4 per item, plus campaign/lookbook shots)
- [ ] Product details: sizes per item, stock, fabric/care, a size chart
- [ ] **Shipping fees** per governorate and delivery times
- [ ] Brand story and about text (or a few lines I can write from)
- [ ] Policy texts (I can copy them from the current site)
- [ ] Instagram handle, and the WhatsApp number to use
- [ ] Decisions: **Supabase vs Shopify**, and whether Arabic is needed at launch
