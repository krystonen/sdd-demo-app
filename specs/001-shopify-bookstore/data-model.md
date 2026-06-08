# Data Model: Shopify Bookstore Website

**Feature**: `001-shopify-bookstore` | **Date**: 2026-06-02 (updated 2026-06-08 for age-gate v2)

## Overview

Client-side view models and browser persistence. Commerce truth lives in **Shopify**; marketing/legal copy lives in **content modules** in the repo.

## Entities

### Book (view model)

Mapped from Shopify Product + variants.

| Field | Type | Rules |
|-------|------|--------|
| `id` | string | Shopify product GID or handle-based stable id |
| `handle` | string | URL slug for `/books/:handle` |
| `title` | string | Hungarian display (from Shopify title or metafield) |
| `author` | string | From metafield `custom.author` or description parse fallback |
| `description` | string | HTML/plain from Shopify body |
| `coverImageUrl` | string | First image `url` |
| `price` | Money | Display price from selected/default variant |
| `formats` | `BookFormat[]` | Derived from variants |
| `available` | boolean | Any purchasable variant in stock |

**BookFormat** (enum): `physical` | `ebook`

| Field | Type | Rules |
|-------|------|--------|
| `type` | BookFormat | |
| `variantId` | string | Shopify variant GID for add-to-cart |
| `price` | Money | Variant price |
| `availableForSale` | boolean | From `availableForSale` |

### Catalog

| Field | Type | Rules |
|-------|------|--------|
| `books` | Book[] | All products in “Books” collection or tagged `book` |
| `fetchedAt` | ISO datetime | Client cache metadata (optional) |

### LocalePreference

| Field | Type | Rules |
|-------|------|--------|
| `locale` | `en` \| `hu` | Bilingual pages only |
| `updatedAt` | ISO datetime | Set on switcher change |

**Persistence**: `localStorage` key `bookstore_locale`

### AgeVerificationRecord

| Field | Type | Rules |
|-------|------|--------|
| `confirmed` | boolean | Must be `true` to access any route (v2) |
| `confirmedAt` | ISO datetime | Set on accept |
| `expiresAt` | ISO datetime | `confirmedAt + 30 days` |

**Persistence**: `localStorage` key `bookstore_age_verified` (JSON)

**Validation**: Expired records treated as unconfirmed.

### ContactInquiry (client payload)

| Field | Type | Rules |
|-------|------|--------|
| `name` | string | Required, min 2 chars |
| `email` | string | Required, valid email format |
| `message` | string | Required, min 10 chars |
| `locale` | `en` \| `hu` | Active UI language for email template |
| `submittedAt` | ISO datetime | Set client-side before POST |

### AgeGateCopy (content module)

| Field | Type | Rules |
|-------|------|--------|
| `title` | string | e.g. "Elmúltál 18 éves?" / "Are you 18 or older?" |
| `body` | string | Site entry restriction message |
| `confirmLabel` | string | Yes button |
| `declineLabel` | string | No button |
| `declineMessage` | string | Shown in blocked state |
| `retryLabel` | string | Return to prompt |

**Locales**: `src/content/en/ageGate.ts`, `src/content/hu/ageGate.ts`

### BilingualPageContent

| Field | Type | Rules |
|-------|------|--------|
| `pageId` | string | `landing` \| `about` \| `contact` \| `privacy` \| `terms` \| `cookies` |
| `en` | PageSlice | Title, body sections, meta |
| `hu` | PageSlice | Same structure |

### LegalPage

Subtype of `BilingualPageContent` with `pageId` in `privacy` | `terms` | `cookies`.

### CartLine (Shopify)

| Field | Type | Rules |
|-------|------|--------|
| `merchandiseId` | string | Variant GID |
| `quantity` | number | Default 1 for buy CTA |

Checkout URL returned from Storefront Cart `checkoutUrl`.

## State transitions

### Age verification

```text
[none] --accept--> [confirmed, not expired] (+ seed locale if unset)
[confirmed] --expiry/clear storage--> [none]
[none] --decline|escape|overlay--> [declined UI, not persisted] --retry--> [none/prompt]
[declined UI] --accept--> [confirmed, not expired]
```

**Client-only `declined` state**: React state in `AgeGateGuard`; not written to `localStorage`.

### Locale (bilingual pages only)

```text
[default: hu or browser-detected on gate confirm] --switch--> [en | hu]
[persisted] --navigate bilingual page--> [same locale]
[persisted] --navigate book page--> [ignored on book UI; locale unchanged in storage]
```

### Book purchase

```text
[detail view] --select format--> [variant chosen]
[variant chosen] --buy--> [Shopify cart create/update] --> [redirect checkoutUrl]
```

## Route access matrix (v2)

| Route | Age required | Locale switcher (after unlock) |
|-------|--------------|--------------------------------|
| All routes (`/`, `/about`, `/contact`, `/legal/*`, `/books`, `/books/:handle`, `*`) | **Yes** (site-wide gate) | Bilingual routes: Yes; book routes: No (HU only) |

**Before confirm**: only age-gate modal interactable (browser-locale copy).

## Shopify collection assumptions

- Products in collection `books` (handle configurable via env `VITE_SHOPIFY_BOOKS_COLLECTION`).
- Variant option name `Format` with values mapping to physical/ebook (documented in quickstart for store admin).
