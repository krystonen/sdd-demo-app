# Contract: Shopify Storefront API

**Consumer**: React SPA (`src/lib/shopify/`)  
**Provider**: Shopify Storefront API (GraphQL)  
**Auth**: Public Storefront access token in `VITE_SHOPIFY_STOREFRONT_TOKEN` (domain: `VITE_SHOPIFY_STORE_DOMAIN`)

## Operations

### List books (catalog)

**Query**: `collection(handle: $handle) { products(first: 50) { edges { node { ... } } } }`

**Response mapping** → `Catalog.books[]` per `data-model.md`

**Errors**:

| Condition | UI behavior |
|-----------|-------------|
| Network failure | Hungarian error banner on `/books`; retry button |
| Empty collection | Empty state copy (HU) |
| Invalid token (401) | Dev-only detailed error; prod generic “Store unavailable” |

### Product by handle (detail)

**Query**: `product(handle: $handle) { id title description images variants { ... } }`

**Response mapping** → `Book`

### Create cart & checkout

**Mutation**: `cartCreate` with `lines: [{ merchandiseId, quantity: 1 }]`

**Output**: `cart.checkoutUrl` — browser `window.location.assign(checkoutUrl)`

**Invariant**: Displayed variant price on detail page MUST match cart line price (SC-009).

## Variant → format mapping

| Shopify variant option value (case-insensitive) | `BookFormat` |
|-------------------------------------------------|--------------|
| physical, print, könyv, fizikai | `physical` |
| ebook, e-book, digital, epub | `ebook` |

Unmapped variants: excluded from buy CTAs; logged in dev.

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_SHOPIFY_STORE_DOMAIN` | yes | `your-store.myshopify.com` |
| `VITE_SHOPIFY_STOREFRONT_TOKEN` | yes | Storefront API public token |
| `VITE_SHOPIFY_BOOKS_COLLECTION` | no | Default `books` |
