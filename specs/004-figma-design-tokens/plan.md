# Implementation Plan: Figma Foundational Design Tokens

**Branch**: `004-figma-design-tokens` | **Date**: 2026-06-09 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/004-figma-design-tokens/spec.md`

## Summary

Rearchitect `src/styles/tokens.css` into a **three-tier token system** aligned with Figma Foundations (Colors `13:4`, Typography `13:5`, Layout `13:6`): **foundational** `--sys-*` / `--space-*` / `--font-*` tokens with **Light/Dark** via `prefers-color-scheme`, **legacy aliases** for existing page CSS, and **component tokens** (`--button-*`, `--book-card-*`) composing from foundations via `var()`. Eliminates ad-hoc bookstore greens and isolated hex literals in component tokens (FR-001–FR-006).

## Technical Context

**Language/Version**: TypeScript 5.x, React 19, Node 20+

**Primary Dependencies**: Vite, CSS Modules, scoped CSS — no new npm packages

**Storage**: N/A (CSS custom properties only)

**Testing**: Vitest token literal audits (`tokens.test.ts` + existing Button/BookCard CSS audits); manual Light/Dark visual parity vs. Figma Foundations; WCAG contrast spot-check (SC-004)

**Target Platform**: Modern browsers with `prefers-color-scheme` support; existing Vercel static deploy unchanged

**Project Type**: Single Vite SPA (extends `001` + `002` + `003`)

**Performance Goals**: No measurable perf impact; static CSS, no runtime theme JS

**Constraints**: Scoped CSS only; global token files are constitution-approved exception; `color-scheme: light dark` on `:root`; no in-app theme toggle in v1

**Scale/Scope**: ~22 semantic colors × 2 modes, 7 spacing steps, 2 radius tokens, typography ramp, 11 page/component CSS consumers, refactor ~60 component tokens in `components.css`

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Static-First Delivery | **Pass** | CSS-only theming via media query; no backend or client theme store |
| II. Browser-Verifiable & Tested Logic | **Pass** | Vitest grep audits; browser Light/Dark smoke per quickstart |
| III. Simplicity (YAGNI) | **Pass** | No token framework npm deps; split CSS partials only |

**Post-design re-check**: **Pass** — design artifacts use approved stack; no new dependencies.

## Project Structure

### Documentation (this feature)

```text
specs/004-figma-design-tokens/
├── plan.md              # This file
├── research.md          # Phase 0
├── data-model.md        # Phase 1
├── quickstart.md        # Phase 1
├── contracts/
│   ├── foundational-design-tokens.md
│   ├── legacy-aliases.md
│   └── component-token-composition.md
└── tasks.md             # Phase 2 — 24/24 complete (2026-06-09)
```

### Source Code (changes)

```text
src/styles/
├── tokens.css                    # @import partials (entry unchanged for global.css)
└── tokens/
    ├── foundation.css            # sys/* Light+Dark, typography, spacing, radius, breakpoints
    ├── legacy-aliases.css        # --color-* → var(--sys-*)
    └── components.css            # --button-* / --book-card-* composing foundations

src/styles/global.css             # optional: color-scheme if not in foundation.css

tests/unit/
└── tokens.test.ts                # NEW — foundation + components.css audit
```

**Structure Decision**: Split monolithic `tokens.css` into `src/styles/tokens/` partials per research R2; preserve single `@import "./tokens.css"` from `global.css`. Page module CSS files unchanged in Phase A (legacy aliases); optional direct `--sys-*` migration in Phase C.

## Complexity Tracking

No constitution violations. No new dependencies.

| Item | Notes |
|------|-------|
| Split token files (4 files vs 1) | Justified by ~250+ lines and three-tier hierarchy; single import chain |
| `--sys-on-surface-variant` alias for muted text | Figma may use secondary/onSurface variant — verify at implement; document in mapping table |
| `--shadow: none` legacy alias | No Figma elevation token in Foundations v1 |
| Fixed px spacing vs rem legacy | Prevents root font-size drift; Figma uses px scale |

## Implementation Phases (for /speckit-tasks)

### Phase A — Foundation layer (P1 / FR-001–FR-003, FR-008)

- Create `src/styles/tokens/foundation.css` with all `--sys-*` Light defaults + `@media (prefers-color-scheme: dark)` overrides
- Add spacing (`--space-xs` … `--space-3xl`), radius, breakpoint, typography tokens
- Extract hex values from Figma Foundations via MCP; fill [contracts/foundational-design-tokens.md](./contracts/foundational-design-tokens.md) mapping table
- Wire `@import` chain in `tokens.css`

### Phase B — Legacy aliases (P1 / FR-005, FR-007)

- Create `legacy-aliases.css` per [contracts/legacy-aliases.md](./contracts/legacy-aliases.md)
- Verify all 11 consumer files still render correctly (aliases only — no page edits required)
- Visual check: bookstore pages shift from green accent palette to Figma M3 semantics

### Phase C — Component composition (P3 / FR-006, SC-006)

- Move existing button/book-card token blocks to `components.css`
- Replace hex literals with `var(--sys-*)`, `var(--space-*)`, `var(--font-*)` per [contracts/component-token-composition.md](./contracts/component-token-composition.md)
- Run propagation test: change `--sys-primary` → Button/BookCard update without component literal edits

### Phase D — Verification (SC-001–SC-006)

- Add `tests/unit/tokens.test.ts`
- Manual Light/Dark matrix per [quickstart.md](./quickstart.md)
- WCAG contrast spot-check on primary content regions
- `npm test`

## Artifacts Generated

| Artifact | Path |
|----------|------|
| Research | [research.md](./research.md) |
| Data model | [data-model.md](./data-model.md) |
| Foundation contract | [contracts/foundational-design-tokens.md](./contracts/foundational-design-tokens.md) |
| Legacy alias contract | [contracts/legacy-aliases.md](./contracts/legacy-aliases.md) |
| Component composition contract | [contracts/component-token-composition.md](./contracts/component-token-composition.md) |
| Quickstart | [quickstart.md](./quickstart.md) |

**Status**: Implemented — **24/24** tasks complete (2026-06-09). See [tasks.md](./tasks.md) and [quickstart.md](./quickstart.md).
