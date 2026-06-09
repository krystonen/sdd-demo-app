# Quickstart: Figma BookCard Component

**Feature**: `003-figma-book-card`  
**Status**: Implemented (20/20 tasks, 2026-06-09)

## Prerequisites

- Node.js 20+
- Feature branch `003-figma-book-card`
- Figma access to [BookCard component set](https://www.figma.com/design/YR4A9Vf42an3qee8HaiwDx/SDD-Component-Library?node-id=218-68)
- `002-figma-button-component` shipped (`Button` available)

## Local development

```bash
npm install
npm run dev    # http://localhost:5173
npm test       # Vitest — BookCard tests after implementation
```

No new environment variables for this feature.

## Implementation smoke (after `/speckit-implement`)

### 1. Token spot-check

Open `src/styles/tokens.css` — confirm `--book-card-*` tokens exist with values sourced from Figma symbols `218:50` and `218:59`.

### 2. State matrix (dev)

Open `/books` after age-gate confirm:

| State | How to trigger | Compare to Figma |
|-------|----------------|------------------|
| Default | Mouse away from card | `218:50` |
| Hover | Hover card or tab into CTA | `218:59` |

### 3. Catalog content (FR-003)

Each card shows: cover, title, format (HU), price; author when present; CTA label in Hungarian (`booksHu.viewBook`).

### 4. Navigation (SC-006)

Click CTA → lands on `/books/{handle}` for that title.

### 5. Keyboard (FR-005 / SC-003)

Tab to card CTA — visible focus ring. Enter activates navigation.

### 6. Token audit

```bash
npm test -- BookCard
```

Pass CSS literal audit if implemented (see [contracts/design-tokens.md](./contracts/design-tokens.md)).

### 7. Responsive grid (SC-004)

Resize 320px–1440px — cards remain readable; grid does not clip titles on typical HU copy.

## Figma reference

- **Component set**: BookCard (`218:68`)
- **Default symbol**: `218:50` (240 × 504 px)
- **Hover symbol**: `218:59` (240 × 504 px)
