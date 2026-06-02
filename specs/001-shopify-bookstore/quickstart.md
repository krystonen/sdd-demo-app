# Quickstart: Shopify Bookstore Website

**Feature**: `001-shopify-bookstore`

## Prerequisites

- Node.js 20+
- Shopify store with Admin access
- Vercel account (deploy target)

## 1. Shopify setup

1. **Settings → Apps and sales channels → Develop apps** → create custom app.
2. Enable **Storefront API** scopes: `unauthenticated_read_product_listings`, `unauthenticated_write_checkouts`, `unauthenticated_read_checkouts`.
3. Install app; copy **Storefront API access token**.
4. Create collection handle **`books`**; add products with:
   - Hungarian titles/descriptions (or metafields per `data-model.md`)
   - Variant option **Format**: `Physical` / `E-book` (or equivalent per `contracts/shopify-storefront.md`)
5. Note store domain: `your-store.myshopify.com`.

## 2. Local development

```bash
# From repo root (after /speckit-implement scaffolds the app)
npm install
cp .env.example .env.local
```

`.env.local` (minimum):

```env
VITE_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
VITE_SHOPIFY_STOREFRONT_TOKEN=your_storefront_token
VITE_SHOPIFY_BOOKS_COLLECTION=books
# Optional: Formspree instead of Vercel contact API
# VITE_CONTACT_FORM_ENDPOINT=https://formspree.io/f/xxxx
```

```bash
npm run dev    # http://localhost:5173
npm test       # Vitest — age gate, i18n, shopify mappers, contact validation
npm run build
npm run preview
```

## 3. Verify user stories (smoke)

| Story | Check |
|-------|--------|
| Age gate | Open `/books` → modal → accept → catalog loads |
| Decline age | Decline → stay off `/books`; `/` still works |
| Language | On `/`, switch EN/HU → copy changes |
| Books HU only | `/books` has no language switcher |
| Detail + buy | Open book → buy physical/ebook → Shopify checkout |
| Contact | Submit valid form → confirmation |
| Legal | `/legal/privacy` in EN and HU |

## 4. Deploy to Vercel

1. Import Git repo; framework preset **Vite**.
2. Set environment variables (same as `.env.local` + contact secrets).
3. Deploy; confirm SPA rewrites (`vercel.json` `rewrites` → `/index.html`).
4. Smoke test production URL with age gate and checkout.

## 5. Content updates

- Bilingual copy: edit `src/content/{en,hu}/*.ts` (or JSON) — no Shopify change needed.
- Book catalog: managed in Shopify Admin only.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Empty catalog | Products in `books` collection; token scopes |
| Checkout 404 | Variant `availableForSale`; correct merchandise GID |
| Age gate loop | Clear `localStorage` keys `bookstore_age_verified`, `bookstore_locale` |
| CORS errors | Storefront token must be public Storefront token, not Admin API |
