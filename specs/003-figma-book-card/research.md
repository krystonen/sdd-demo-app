# Research: Figma BookCard Component

**Feature**: `003-figma-book-card` | **Date**: 2026-06-09

## R1: Figma design source

**Decision**: Implement against the **BookCard** component set on Figma node `218:68` ([SDD Component Library](https://www.figma.com/design/YR4A9Vf42an3qee8HaiwDx/SDD-Component-Library?node-id=218-68)).

**Rationale**: Spec FR-001/FR-007 lock visual parity to this file. Published symbols: **Default** (`218:50`) and **Hover** (`218:59`), reference size 240 × 504 px.

**Alternatives considered**:

| Alternative | Rejected because |
|-------------|------------------|
| Retain legacy card using `--color-surface` globals | Violates FR-010; colors/layout differ from Figma editorial dark card |
| Third-party card library | Constitution YAGNI; single catalog component |

## R2: Design variables → CSS custom properties

**Decision**: Add **book-card-scoped CSS custom properties** under `:root` in `src/styles/tokens.css`. Names mirror Figma semantic paths (e.g. `--book-card-bg-default`, `--book-card-bg-hover`, `--book-card-title-color-default`). **BookCard.module.css MUST reference only these variables** — no literal hex/rgb/px except where Figma exports a token value into `:root`.

**Rationale**: FR-010 requires 100% variable-driven styling (SC-005). Central tokens allow Figma updates without touching component CSS. Existing global tokens (`--color-surface`, `--shadow`, etc.) remain for non–book-card UI.

**Alternatives considered**:

| Alternative | Rejected because |
|-------------|------------------|
| Hardcode Figma values in BookCard.module.css | Fails FR-010 / SC-005 |
| Reuse `--button-*` tokens for card chrome | Card has distinct surface, image inset, typography, and shadow tokens |

**Implementation note**: Extract resolved values from Figma symbols `218:50` and `218:59` via Figma MCP screenshot / Dev Mode at task time; document mapping in [contracts/design-tokens.md](./contracts/design-tokens.md).

## R3: React component API

**Decision**: Single **`BookCard`** component at `src/components/BookCard/BookCard.tsx`:

| Prop | Type | Notes |
|------|------|-------|
| `book` | `Book` | Existing catalog type — unchanged data contract |

**Layout (from Figma symbols)**:

1. Card container (Default/Hover surface, radius, shadow, padding)
2. Cover image region (fixed aspect per symbol; `object-fit: cover`; lazy load)
3. Title (heading)
4. Author line — omitted when `book.author` is empty (FR-003 / spec edge case)
5. Format label (physical / e-book via `booksHu`)
6. Price (`amount` + `currencyCode`)
7. CTA — **`Button`** child linking to `/books/{handle}` with Hungarian `booksHu.viewBook` label

**Navigation**: Primary activation via CTA `Button` rendered as link (`<Link>` wrapping button styles) or `Button` inside `<Link>` — implementer picks accessible pattern; entire card receives Hover styling on group hover (`:hover` on `.card`).

**Rationale**: Figma symbol includes explicit **View Book** CTA distinct from metadata; legacy whole-card `<Link>` wrapper does not match Figma chrome. Composing shipped `Button` satisfies design-system consistency.

**Alternatives considered**:

| Alternative | Rejected because |
|-------------|------------------|
| Whole-card `<Link>` only (legacy) | Missing Figma CTA button; hover state targets card + button |
| Duplicate button styles in BookCard CSS | Violates DRY; Button tokens already shipped |

## R4: Focus and hover (Figma gaps)

**Decision**:

- **Hover**: CSS `.card:hover` (and optional `.card:focus-within`) applies Hover state tokens (`218:59`) to card chrome; CTA uses native `Button` hover tokens.
- **Focus**: CSS `.card:focus-within` or CTA `:focus-visible` with `--book-card-focus-ring` token; Figma has no Focus symbol — documented in spec Assumptions.
- **Active/pressed**: CTA reuses `Button` active styling; card chrome may reuse Hover tokens on `:active` if Figma shows no separate pressed state.

**Rationale**: Meets FR-009 without inventing unpublished Figma states.

## R5: Migration mapping (FR-006)

**Decision**: Rewrite in place — no new import paths.

| Location | Current | Target |
|----------|---------|--------|
| `BooksOverviewPage` | `<BookCard book={book} />` | Same API; visual/layout from Figma |
| `BookCard.module.css` | Legacy `--color-surface`, `--shadow`, rem font sizes | `--book-card-*` tokens only |
| `BooksOverviewPage.module.css` `.grid` | `minmax(11rem, 1fr)` | Consider `minmax(15rem, 1fr)` (~240px) for FR-008 width parity |

Landing page featured teaser remains **out of scope** (spec Assumptions).

**Rationale**: SC-002 requires 100% books-overview adoption with minimal consumer diff.

## R6: Testing strategy

**Decision**:

- **Vitest**: Render `BookCard` with mock `Book`; assert title, format, price, link `href`, author present/absent
- **Optional**: CSS audit — `BookCard.module.css` contains no `#` hex literals
- **Manual**: Side-by-side Figma Default/Hover vs. books overview

**Rationale**: Constitution requires Vitest for business logic; styling parity is visual gate per SC-001. Component is mostly presentational — render/conditional tests + token audit satisfy FR-010 enforcement.

## R7: i18n

**Decision**: Add `booksHu.viewBook` (e.g. `"Könyv megtekintése"`) for CTA label. Figma sample copy is English ("View Book"); bookstore book surfaces are Hungarian-only per `001-shopify-bookstore` clarifications.

**Rationale**: Matches existing `booksHu` pattern for format/author labels.

## R8: Code Connect

**Decision**: **Defer** Figma Code Connect (`.figma.ts`) to follow-up; not blocking plan acceptance.

**Rationale**: Spec Assumptions explicitly allow deferral; repo has no BookCard Code Connect file yet.
