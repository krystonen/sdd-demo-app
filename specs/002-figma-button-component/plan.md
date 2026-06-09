# Implementation Plan: Figma Button Component

**Branch**: `002-figma-button-component` | **Date**: 2026-06-09 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-figma-button-component/spec.md`

## Summary

Introduce a shared **`Button`** React component styled to match the Figma SDD Component Library ([Button page `21:2`](https://www.figma.com/design/YR4A9Vf42an3qee8HaiwDx/SDD-Component-Library?node-id=21-2)) with **Primary**, **Secondary**, and **Ghost** variants and **Default / Hover / Disabled** states. All styling MUST use **`--button-*` CSS custom properties** mapped from Figma variables (FR-011). Migrate in-scope bookstore actions (age gate, contact, buy CTA, error retry, language switcher) off ad-hoc button CSS.

## Technical Context

**Language/Version**: TypeScript 5.x, React 19, Node 20+

**Primary Dependencies**: Vite, CSS Modules (existing); no new npm packages

**Storage**: N/A (presentational component)

**Testing**: Vitest for `Button` props/class behavior + optional CSS token literal audit; manual visual parity vs. Figma Editorial/Dark matrix

**Target Platform**: Modern browsers; existing Vercel static deploy unchanged

**Project Type**: Single Vite SPA (extends `001-shopify-bookstore` codebase)

**Performance Goals**: No measurable perf impact; static CSS, no runtime theme engine

**Constraints**: Scoped CSS only; FR-011 token-only Button styles; 34px Figma height; `:focus-visible` ring where Figma lacks Focus symbol

**Scale/Scope**: 1 component, ~30 button tokens, 5 consumer files to migrate

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Static-First Delivery | **Pass** | Client-only component; no backend |
| II. Browser-Verifiable & Tested Logic | **Pass** | Vitest for Button + token audit; browser smoke per quickstart |
| III. Simplicity (YAGNI) | **Pass** | No UI library; CSS Modules + tokens only |

**Post-design re-check**: **Pass** — design artifacts use approved stack; no new dependencies.

## Project Structure

### Documentation (this feature)

```text
specs/002-figma-button-component/
├── plan.md              # This file
├── research.md          # Phase 0
├── data-model.md        # Phase 1
├── quickstart.md        # Phase 1
├── contracts/
│   ├── button-component.md
│   └── design-tokens.md
└── tasks.md             # Phase 2 (/speckit-tasks — not yet created)
```

### Source Code (changes)

```text
src/
├── components/
│   └── Button/
│       ├── Button.tsx
│       ├── Button.module.css    # var(--button-*) only
│       └── index.ts
├── components/
│   ├── AgeGateModal/            # migrate to <Button>
│   ├── layout/LanguageSwitcher/
│   └── ShopifyErrorBanner/
├── pages/
│   ├── ContactPage.tsx
│   └── BookDetailPage.tsx
└── styles/
    └── tokens.css               # + --button-* design tokens

tests/
└── unit/
    └── Button.test.tsx
```

**Structure Decision**: Single component folder under existing `src/components/`; extend global `tokens.css` with button token block; remove duplicated `.primary`, `.submit`, `.buy`, `.retry`, `.btn` rules after migration.

## Complexity Tracking

No constitution violations. No new dependencies.

| Item | Notes |
|------|-------|
| Dual token sets (legacy `--color-accent` + new `--button-*`) | Intentional — button feature scoped; global rebrand deferred |
| Figma Focus state absent | `:focus-visible` token documented in contracts |

## Implementation Phases (for /speckit-tasks)

### Phase A — Design tokens (FR-011)

- Extract values from Figma symbols `25:2`–`25:18`
- Add `--button-*` tokens to `src/styles/tokens.css`
- Complete mapping table in [contracts/design-tokens.md](./contracts/design-tokens.md)

### Phase B — Button component (P1)

- Implement `Button.tsx` + `Button.module.css` per [contracts/button-component.md](./contracts/button-component.md)
- Vitest: variant classes, disabled, type, optional CSS literal audit

### Phase C — Consumer migration (FR-007 / SC-002)

- `AgeGateModal` → primary / secondary
- `ContactPage` → primary submit + disabled
- `BookDetailPage` → primary buy
- `ShopifyErrorBanner` → ghost retry
- `LanguageSwitcher` → ghost / primary
- Delete obsolete button CSS from module files

### Phase D — Verification (SC-001, SC-006)

- Manual: 9-state Figma matrix comparison
- Run quickstart smoke checklist
- `npm test`

## Artifacts Generated

| Artifact | Path |
|----------|------|
| Research | [research.md](./research.md) |
| Data model | [data-model.md](./data-model.md) |
| Button contract | [contracts/button-component.md](./contracts/button-component.md) |
| Token contract | [contracts/design-tokens.md](./contracts/design-tokens.md) |
| Quickstart | [quickstart.md](./quickstart.md) |

**Status**: Implemented — **28/28** tasks complete (2026-06-09). See [tasks.md](./tasks.md) and [quickstart.md](./quickstart.md).
