# SDD Demo App — Shopify Bookstore

React + Vite bilingual bookstore with Hungarian catalog, age verification, and Shopify Storefront API integration.

## Quick start

See [specs/001-shopify-bookstore/quickstart.md](specs/001-shopify-bookstore/quickstart.md).

```bash
npm install
cp .env.example .env.local   # optional Shopify keys
npm run dev                  # http://localhost:5173
npm test
npm run build
```

Without Shopify env vars, the catalog uses **demo mock books**.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Vite dev server |
| `npm run build` | Typecheck + production build |
| `npm run preview` | Preview production build |
| `npm test` | Vitest unit tests |

## Deploy

Deploy to [Vercel](https://vercel.com) with SPA rewrites (`vercel.json`). Set environment variables from `.env.example`.

## Spec Kit

Feature docs: `specs/001-shopify-bookstore/`
