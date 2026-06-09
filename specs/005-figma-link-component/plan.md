# Implementation Plan: Figma Link Component

**Branch**: `005-figma-link-component` | **Date**: 2026-06-09 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/005-figma-link-component/spec.md`

## Summary

Introduce a shared **`Link`** React component styled to match the Figma SDD Component Library ([Link page `64:2`](https://www.figma.com/design/YR4A9Vf42an3qee8HaiwDx/SDD-Component-Library?node-id=64-2)) with **Default**, **Hover**, and **Active** states. All styling MUST use **`--link-*` CSS custom properties** in `components.css` composing from foundational tokens (FR-009). Migrate **`PrimaryNav`** header destinations (main + legal) off ad-hoc React Router link CSS.

## Technical Context

**Language/Version**: TypeScript 5.x, React 19, Node 20+

**Primary Dependencies**: Vite, React Router (existing), CSS Modules — no new npm packages

**Storage**: N/A (presentational component)

**Testing**: Vitest for `Link` route-active behavior + CSS token literal audit; manual visual parity vs. Figma Editorial/Dark and Preview Light/Dark frames

**Target Platform**: Modern browsers; existing Vercel static deploy unchanged

**Project Type**: Single Vite SPA (extends `001-shopify-bookstore` codebase)

**Performance Goals**: No measurable perf impact; static CSS only

**Constraints**: Scoped CSS only; FR-009 token-only Link styles; `:focus-visible` ring where Figma lacks Focus symbol; `NavLink` for route-active state

**Scale/Scope**: 1 component, ~12 link tokens, 1 consumer file (`PrimaryNav`) + layout CSS cleanup

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Static-First Delivery | **Pass** | Client-only component; no backend |
| II. Browser-Verifiable & Tested Logic | **Pass** | Vitest for Link + token audit; browser smoke per quickstart |
| III. Simplicity (YAGNI) | **Pass** | No UI library; CSS Modules + existing token tiers |
| IV. Figma-Aligned Design Tokens | **Pass** | `--link-*` in `components.css`; module CSS token-only |

**Post-design re-check**: **Pass** — design artifacts use approved stack; no new dependencies.

## Design System Check

*GATE for Figma-sourced UI features. Re-check after Phase 1 design.*

- [x] Figma component node URL documented in `spec.md` and `research.md` (`64:2`)
- [x] `contracts/design-tokens.md` created from design-tokens template
- [x] New `--link-*` tokens specified for `src/styles/tokens/components.css` (composition from `--sys-*` / `--font-*`)
- [x] Component `Link.module.css` contract: component tokens only — no color/spacing literals
- [x] Vitest CSS audit planned (`Link.test.tsx` + extend `tokens.test.ts`)
- [x] Light + dark manual review documented in `quickstart.md` (`prefers-color-scheme`)

## Project Structure

### Documentation (this feature)

```text
specs/005-figma-link-component/
├── plan.md              # This file
├── research.md          # Phase 0
├── data-model.md        # Phase 1
├── quickstart.md        # Phase 1
├── contracts/
│   ├── link-component.md
│   └── design-tokens.md
└── tasks.md             # Phase 2 (/speckit-tasks)
```

### Source Code (changes)

```text
src/
├── components/
│   └── Link/
│       ├── Link.tsx           # wraps React Router NavLink
│       ├── Link.module.css    # var(--link-*) only
│       └── index.ts
├── components/layout/
│   ├── PrimaryNav.tsx         # migrate 7 destinations to <Link>
│   └── PrimaryNav.module.css  # layout-only; remove .link / .legalLink chrome
└── styles/tokens/
    └── components.css         # + --link-* block

tests/
└── unit/
    ├── Link.test.tsx
    └── tokens.test.ts         # extend for --link-* composition
```

**Structure Decision**: Single component folder under existing `src/components/`; extend `components.css` with link token block; strip duplicated nav link styling from `PrimaryNav.module.css`.

## Complexity Tracking

No constitution violations. No new dependencies.

| Item | Notes |
|------|-------|
| `Link` name vs React Router `Link` | DS component imported from `@/components/Link`; internal implementation uses `NavLink` |
| Figma Focus state absent | `:focus-visible` tokens documented in contracts (Button precedent) |
| Single style for main + legal nav | Spec supersedes legacy smaller legal link CSS |

## Implementation Phases (for /speckit-tasks)

### Phase A — Design tokens (FR-009)

- Extract values from Figma symbols `133:2`, `133:4`, `133:6`
- Add `--link-*` tokens to `src/styles/tokens/components.css`
- Complete mapping table in [contracts/design-tokens.md](./contracts/design-tokens.md)
- Add Link composition rows to [004 component-token-composition](../../004-figma-design-tokens/contracts/component-token-composition.md)

### Phase B — Link component (P1)

- Implement `Link.tsx` + `Link.module.css` per [contracts/link-component.md](./contracts/link-component.md)
- Vitest: active class, `end` matching, optional CSS literal audit

### Phase C — PrimaryNav migration (FR-006 / SC-002)

- Replace seven RR `Link` instances in `PrimaryNav.tsx` with DS `<Link>`
- Remove `.link` / `.legalLink` typography/color from `PrimaryNav.module.css`
- Verify route-active styling for all destinations (SC-006)

### Phase D — Verification (SC-001, SC-005)

- Manual: 3-state Figma matrix + Preview Light/Dark comparison
- Run quickstart smoke checklist
- `npm test`

## Artifacts Generated

| Artifact | Path |
|----------|------|
| Research | [research.md](./research.md) |
| Data model | [data-model.md](./data-model.md) |
| Link contract | [contracts/link-component.md](./contracts/link-component.md) |
| Token contract | [contracts/design-tokens.md](./contracts/design-tokens.md) |
| Quickstart | [quickstart.md](./quickstart.md) |

**Status**: Implemented — **27/27** tasks complete (2026-06-09). See [tasks.md](./tasks.md) and [quickstart.md](./quickstart.md).
