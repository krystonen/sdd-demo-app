# Data Model: Figma BookCard Component

**Feature**: `003-figma-book-card` | **Date**: 2026-06-09

## Overview

No server persistence. This feature defines a **presentational UI component** and **design-token entities** in the storefront. Runtime state is limited to native link/button focus and CSS hover. Catalog data reuses the existing **`Book`** entity from `001-shopify-bookstore`.

## Entities

### Book (existing — read-only)

| Field | Type | BookCard usage |
|-------|------|----------------|
| `id` | `string` | React `key` on overview grid (parent) |
| `handle` | `string` | CTA link target `/books/{handle}` |
| `title` | `string` | Card heading; accessible name |
| `author` | `string` | Shown when non-empty; omitted otherwise |
| `coverImageUrl` | `string` | Cover `<img src>` |
| `format` | `'physical' \| 'ebook'` | Label via `booksHu.formatPhysical` / `formatEbook` |
| `price.amount` | `string` | Displayed with currency |
| `price.currencyCode` | `string` | Displayed with amount |

**Relationships**: Sourced from `useBooks` / Shopify adapter on `BooksOverviewPage`; shape unchanged (spec Assumptions).

### BookCard (component props)

| Field | Type | Rules |
|-------|------|--------|
| `book` | `Book` | Required; drives all visible fields |

**Relationships**: Consumed by `BooksOverviewPage`; styled via **BookCardDesignTokens**; CTA uses shared **`Button`** component.

### BookCardInteractionState (enum)

| Value | CSS trigger | Figma symbol |
|-------|-------------|--------------|
| `default` | base `.card` | `State=Default` (`218:50`) |
| `hover` | `.card:hover`, `.card:focus-within` | `State=Hover` (`218:59`) |
| `focus` | CTA `:focus-visible` / `--book-card-focus-ring` | *(not in Figma)* |

No `disabled` state in Figma v1.

### BookCardDesignToken

Named CSS custom property on `:root` backing one visual property for one interaction state.

| Field | Type | Rules |
|-------|------|--------|
| `name` | string | `--book-card-{property}-{state}` convention |
| `figmaSource` | string | Figma variable name or symbol node id |
| `value` | string | Resolved CSS value (color, length, font, shadow) |
| `property` | enum | `bg`, `title-color`, `meta-color`, `format-color`, `border`, `radius`, `shadow`, `padding`, `image-radius`, `gap`, `focus-ring`, … |
| `state` | BookCardInteractionState \| `shared` | Token scope |

**Validation (FR-010 / SC-005)**:

- Every declaration in `BookCard.module.css` MUST use `var(--book-card-…)` or other approved token — no raw color/spacing literals.
- Token registry maintained in [contracts/design-tokens.md](./contracts/design-tokens.md).

### BookCardCopy (i18n)

| Key | Locale | Example value |
|-----|--------|---------------|
| `booksHu.viewBook` | HU | `Könyv megtekintése` |
| `booksHu.formatPhysical` | HU | existing |
| `booksHu.formatEbook` | HU | existing |
| `booksHu.author` | HU | existing |

## State transitions

```text
default ──hover/focus-within──► hover card chrome
default ──CTA focus-visible──► focus ring on CTA
CTA click ──► navigate to /books/{handle}
```

No internal React state required.
