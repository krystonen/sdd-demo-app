# Research: Figma Link Component

**Feature**: `005-figma-link-component` | **Date**: 2026-06-09

## R1: Figma design source

**Decision**: Implement against the **Link** component set on Figma page `64:2` ([SDD Component Library](https://www.figma.com/design/YR4A9Vf42an3qee8HaiwDx/SDD-Component-Library?node-id=64-2)), component set node `133:8`.

**Rationale**: Spec FR-001/FR-007 lock visual parity to this file. Published symbols: **Default**, **Hover**, **Active** (3 symbols, ~45×21px reference label size). Preview frames show nav-style horizontal rows on Light and Dark backgrounds (`137:4`, `137:28`).

**Alternatives considered**:

| Alternative | Rejected because |
|-------------|------------------|
| Reuse legacy `--color-accent` in `PrimaryNav.module.css` | Violates FR-009; does not match Figma Link symbols |
| Style React Router `Link` inline in `PrimaryNav` | No reusable component; fails FR-001 / SC-002 |
| Third-party link/menu library | Constitution YAGNI; single text-link pattern |

## R2: Design variables → component tokens

**Decision**: Add **link-scoped CSS custom properties** (`--link-*`) to `src/styles/tokens/components.css`, composing from foundational tokens per [004 component-token-composition](../../004-figma-design-tokens/contracts/component-token-composition.md). **`Link.module.css` MUST reference only `--link-*` tokens** — no literal hex/rgb/px for semantic color or typography.

**Rationale**: FR-009 requires 100% variable-driven styling (SC-005). Three-tier token system is established by feature 004; Link follows Button/BookCard precedent.

**Alternatives considered**:

| Alternative | Rejected because |
|-------------|------------------|
| Hardcode Figma values in `Link.module.css` | Fails FR-009 / SC-005 |
| Reuse `--button-*` tokens | Link is text-only; different Figma symbols and states (Active vs Disabled) |

**Implementation note**: Extract resolved values from Figma symbols `133:2`, `133:4`, `133:6` via Figma MCP or Dev Mode at task time; document mapping in [contracts/design-tokens.md](./contracts/design-tokens.md).

## R3: React component API and router integration

**Decision**: Single **`Link`** component at `src/components/Link/Link.tsx`:

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `to` | `string` | required | In-app route path |
| `end` | `boolean` | `false` | Passed to React Router `NavLink` for exact matching (Home `/` uses `true`) |
| `children` | `ReactNode` | required | Visible label (FR-003) |
| `className` | `string` | optional | Layout only; no color overrides |

Render **React Router `NavLink`** internally so **Active** styling maps to Figma **State=Active** when the current URL matches (FR-005). Apply active class via `NavLink`'s `className` callback (`({ isActive }) => …`).

**Rationale**: NavLink provides accessible anchor semantics, keyboard activation, and route-aware active state without custom `useLocation` parsing in every consumer. `end` prop satisfies Home-only-active and exact legal-route rules from spec Assumptions.

**Alternatives considered**:

| Alternative | Rejected because |
|-------------|------------------|
| Plain `Link` + manual `useMatch` in `PrimaryNav` | Duplicates active logic across seven destinations |
| Polymorphic `as` / external `href` in v1 | Out of scope; header uses in-app routes only |
| Rename component `TextLink` | Spec and Figma use **Link**; import path `@/components/Link` avoids clash with RR re-exports in consumers |

## R4: Focus, hover, and active (Figma gaps)

**Decision**:

- **Hover**: CSS `:hover` on the anchor uses Hover state tokens (`--link-text-hover`, etc.).
- **Active (route)**: When `NavLink` reports `isActive`, apply Active state tokens (`--link-text-active`, etc.) — distinct from `:active` pseudo-class.
- **Active (pointer)**: `:active` pseudo may reuse Hover tokens for press feedback.
- **Focus**: CSS `:focus-visible` with `--link-focus-ring-*` tokens (Button precedent); Figma has no Focus symbol.

**Rationale**: Meets FR-008 without inventing unpublished Figma states. Route-active styling must not rely on `:active` alone.

## R5: Navigation migration mapping (FR-006)

**Decision**: Replace styled React Router links in **`PrimaryNav.tsx`** only:

| Destination | `to` | `end` | Notes |
|-------------|------|-------|-------|
| Home | `/` | `true` | Active only on landing |
| Books | `/books` | `false` | Active on `/books` and `/books/:handle` |
| About | `/about` | `true` | |
| Contact | `/contact` | `true` | |
| Privacy | `/legal/privacy` | `true` | Legal group |
| Terms | `/legal/terms` | `true` | Legal group |
| Cookies | `/legal/cookies` | `true` | Legal group |

Remove `.link` and `.legalLink` rules from `PrimaryNav.module.css`; retain layout-only rules (`.nav`, `.legalGroup`, responsive flex).

**Out of scope** (per spec): `SiteLayout` brand link, footer, body copy links, BookCard links.

**Rationale**: SC-002 requires 100% header nav adoption. Spec Assumptions unify main and legal links under one Figma style — drop legacy smaller legal typography.

## R6: Testing strategy

**Decision**:

- **Vitest**: `Link.test.tsx` — renders `NavLink` with correct `href`; active class applied when router context matches; optional CSS literal audit on `Link.module.css`.
- **Extend** `tests/unit/tokens.test.ts` or add Link-specific token composition assertions after `--link-*` land in `components.css`.
- **Manual**: Side-by-side Figma Editorial/Dark matrix + Preview Light/Dark frames; toggle `prefers-color-scheme`.

**Rationale**: Constitution requires Vitest; styling parity is visual gate per SC-001. Route-active behavior is testable with React Router `MemoryRouter`.

## R7: Code Connect

**Decision**: **Defer** Figma Code Connect to follow-up; not blocking plan acceptance.

**Rationale**: Spec Assumptions allow deferral; no existing Code Connect files in repo.
