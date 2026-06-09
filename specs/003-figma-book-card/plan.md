# Implementation Plan: Figma BookCard Component

**Branch**: `003-figma-book-card` | **Date**: 2026-06-09 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/003-figma-book-card/spec.md`

## Summary

Rebuild the shared **`BookCard`** React component to match the Figma SDD Component Library ([BookCard `218:68`](https://www.figma.com/design/YR4A9Vf42an3qee8HaiwDx/SDD-Component-Library?node-id=218-68)) with **Default** and **Hover** states. All BookCard chrome MUST use **`--book-card-*` CSS custom properties** mapped from Figma variables (FR-010). Replace the legacy ad-hoc `BookCard` on the books overview catalog grid. Navigation uses a **whole-card `Link`** with `aria-label` from `booksHu.viewBook` — Figma symbols have no separate button (FR-004 / US2).

## Technical Context

**Language/Version**: TypeScript 5.x, React 19, Node 20+

**Primary Dependencies**: Vite, CSS Modules, React Router `Link` (existing) — no new npm packages

**Storage**: N/A (presentational component; consumes existing `Book` type)

**Testing**: Vitest for `BookCard` render, link target, conditional author, format label; optional CSS token literal audit; manual visual parity vs. Figma Default/Hover symbols

**Target Platform**: Modern browsers; existing Vercel static deploy unchanged

**Project Type**: Single Vite SPA (extends `001-shopify-bookstore` + `002-figma-button-component`)

**Performance Goals**: No measurable perf impact; static CSS, lazy-loaded cover images retained

**Constraints**: Scoped CSS only; FR-010 token-only BookCard styles; 240 × 504 px Figma reference size; `:focus-visible` ring where Figma lacks Focus symbol; Hungarian copy via `booksHu`

**Scale/Scope**: 1 component rewrite, ~25 book-card tokens, 1 consumer page (`BooksOverviewPage`), 1 new `booksHu.viewBook` navigation label

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Static-First Delivery | **Pass** | Client-only component; no backend |
| II. Browser-Verifiable & Tested Logic | **Pass** | Vitest for BookCard render/link; browser smoke per quickstart |
| III. Simplicity (YAGNI) | **Pass** | No UI library; CSS Modules + tokens; whole-card `Link` only |

**Post-design re-check**: **Pass** — design artifacts use approved stack; no new dependencies.

## Project Structure

### Documentation (this feature)

```text
specs/003-figma-book-card/
├── plan.md              # This file
├── research.md          # Phase 0
├── data-model.md        # Phase 1
├── quickstart.md        # Phase 1
├── contracts/
│   ├── book-card-component.md
│   └── design-tokens.md
└── tasks.md             # Phase 2 — 20/20 complete (2026-06-09)
```

### Source Code (changes)

```text
src/
├── components/
│   └── BookCard/
│       ├── BookCard.tsx         # rewrite — Figma layout + whole-card Link
│       └── BookCard.module.css  # var(--book-card-*) only
├── content/
│   └── hu/books.ts              # + viewBook navigation label (Hungarian)
├── pages/
│   ├── BooksOverviewPage.tsx    # unchanged import; grid tweak optional
│   └── BooksOverviewPage.module.css  # grid min track ≥ 240px if needed
└── styles/
    └── tokens.css               # + --book-card-* design tokens

tests/
└── unit/
    └── BookCard.test.tsx
```

**Structure Decision**: Rewrite in place under existing `src/components/BookCard/`; extend global `tokens.css` with book-card token block; remove legacy `--color-surface` / `--shadow` usage from BookCard module.

## Complexity Tracking

No constitution violations. No new dependencies.

| Item | Notes |
|------|-------|
| Dual token sets (legacy globals + new `--book-card-*`) | Intentional — card feature scoped; global rebrand deferred |
| Figma Focus state absent | `:focus-visible` token documented in contracts |
| Whole-card `Link` (no separate CTA control) | Figma symbols `218:50`/`218:59` have no View Book button; `booksHu.viewBook` supplies `aria-label` only |

## Implementation Phases (for /speckit-tasks)

### Phase A — Design tokens (FR-010)

- Extract values from Figma symbols `218:50` (Default) and `218:59` (Hover)
- Add `--book-card-*` tokens to `src/styles/tokens.css`
- Complete mapping table in [contracts/design-tokens.md](./contracts/design-tokens.md)

### Phase B — BookCard component (P1 / P2)

- Rewrite `BookCard.tsx` + `BookCard.module.css` per [contracts/book-card-component.md](./contracts/book-card-component.md)
- Add `booksHu.viewBook` Hungarian navigation label (link `aria-label`)
- Vitest: render fields, author omission, `href` to `/books/{handle}`, optional CSS literal audit

### Phase C — Consumer migration (FR-006 / SC-002)

- Verify `BooksOverviewPage` uses updated BookCard (import path unchanged)
- Tune `.grid` `minmax` track if cards clip below 240px reference width
- Delete obsolete BookCard CSS rules (replaced by token-driven module)

### Phase D — Verification (SC-001, SC-005, SC-006)

- Manual: Default + Hover side-by-side vs. Figma symbols `218:50` / `218:59`
- Run quickstart smoke checklist
- `npm test`

## Artifacts Generated

| Artifact | Path |
|----------|------|
| Research | [research.md](./research.md) |
| Data model | [data-model.md](./data-model.md) |
| BookCard contract | [contracts/book-card-component.md](./contracts/book-card-component.md) |
| Token contract | [contracts/design-tokens.md](./contracts/design-tokens.md) |
| Quickstart | [quickstart.md](./quickstart.md) |

**Status**: Implemented — **20/20** tasks complete (2026-06-09). See [tasks.md](./tasks.md) and [quickstart.md](./quickstart.md).
