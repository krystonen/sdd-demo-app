# Quickstart: Shopify Bookstore Website

**Feature**: `001-shopify-bookstore`  
**Status**: Implemented v1 (see [tasks.md](./tasks.md))

## Prerequisites

- Node.js 20+
- Shopify store with Admin access
- Vercel account (deploy target)
- Formspree account (contact form) **or** Vercel mail provider keys

## 1. Shopify setup

1. **Settings → Apps and sales channels → Develop apps** → create custom app.
2. Enable **Storefront API** scopes: `unauthenticated_read_product_listings`, `unauthenticated_write_checkouts`, `unauthenticated_read_checkouts`.
3. Install app; copy **Storefront API access token**.
4. Create collection handle **`books`**; add products with:
   - Hungarian titles/descriptions (or metafields per `data-model.md`)
   - Variant option **Format**: `Physical` / `E-book` (or equivalent per `contracts/shopify-storefront.md`)
5. Note store domain: `your-store.myshopify.com`.
6. **Publish to Storefront channel** (critical): for each product **and** the `books` collection, enable your custom app channel (e.g. **Unclean Cut Publishing**) plus **Online Store**. Admin-only collection membership is not enough for the React app.
7. **Test products**: import [shopify-import/products.csv](../../shopify-import/products.csv) and [inventory.csv](../../shopify-import/inventory.csv) — see [shopify-import/README.md](../../shopify-import/README.md).
8. **Payments (dev)**: enable **Bogus Gateway**; test card `1` = approved.

## 2. Local development

```bash
npm install
cp .env.example .env
```

`.env` (minimum):

```env
VITE_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
VITE_SHOPIFY_STOREFRONT_TOKEN=your_storefront_token
VITE_SHOPIFY_BOOKS_COLLECTION=books
# Formspree: create form at formspree.io → copy 8-char ID (NOT your email)
VITE_CONTACT_FORM_ENDPOINT=https://formspree.io/f/your_form_id
```

```bash
npm run dev    # http://localhost:5173
npm test       # Vitest — age gate, i18n, shopify mappers, contact validation
npm run build
npm run preview
```

Restart `npm run dev` after changing `.env`.

## 3. Verify user stories (smoke) — T066 checklist

| Story | Check | Done |
|-------|--------|------|
| Age gate | Open `/books` → modal → accept → catalog loads | [x] |
| Decline age | Decline → redirect off `/books`; `/` still works | [x] |
| Language | On `/`, switch EN/HU → copy changes | [x] |
| Books HU only | `/books` has no language switcher | [x] |
| Detail + buy | Open book → buy physical/ebook → Shopify checkout | [x] |
| Contact | Submit valid form → Formspree 200 → confirmation | [x] |
| Legal | `/legal/privacy` in EN and HU | [x] |
| Featured book | `/` featured link opens real Shopify book (not mock handle) | [x] |

Mark `[x]` in this table when signed off; then mark **T066** complete in `tasks.md`.

## 4. Deploy to Vercel

1. Import Git repo; framework preset **Vite**.
2. Set environment variables (same as `.env`).
3. Deploy; confirm SPA rewrites (`vercel.json` `rewrites` → `/index.html`).
4. Smoke test production URL with age gate, catalog, and checkout.

## 5. Content updates

- Bilingual copy: edit `src/content/{en,hu}/*.ts` — no Shopify change needed.
- Book catalog: managed in Shopify Admin only.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Empty catalog | Products in `books` collection; token scopes |
| Old/wrong products in app | Publish collection + products to custom app sales channel; remove demo items from `books` |
| Buy disabled | Variant **Format** option `Physical` / `E-book`; or fallback uses first variant |
| Checkout unavailable | Bogus Gateway / shipping rates / product channel publish |
| Contact `FORM_NOT_FOUND` | Use Formspree **form ID** (`https://formspree.io/f/abcd1234`), not recipient email |
| Age gate loop | Clear `localStorage` keys `bookstore_age_verified`, `bookstore_locale` |
| CORS errors | Storefront token must be public Storefront token, not Admin API |
