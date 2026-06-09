# Research: Figma Button Component

**Feature**: `002-figma-button-component` | **Date**: 2026-06-09

## R1: Figma design source

**Decision**: Implement against the **Button** component set on Figma page `21:2` ([SDD Component Library](https://www.figma.com/design/YR4A9Vf42an3qee8HaiwDx/SDD-Component-Library?node-id=21-2)), component set node `25:20`.

**Rationale**: Spec FR-001/FR-008 lock visual parity to this file. Published symbols: Primary / Secondary / Ghost × Default / Hover / Disabled (9 symbols, 165×34px reference size).

**Alternatives considered**:

| Alternative | Rejected because |
|-------------|------------------|
| Approximate from existing `--color-accent` tokens | Violates FR-011; colors differ from Figma editorial/dark matrix |
| Third-party button library (Radix, MUI) | Constitution YAGNI; adds dep for a single component |

## R2: Design variables → CSS custom properties

**Decision**: Add **button-scoped CSS custom properties** under `:root` in `src/styles/tokens.css` (or a dedicated `src/styles/button-tokens.css` imported by `tokens.css`). Names mirror Figma semantic paths (e.g. `--button-primary-bg-default`, `--button-primary-bg-hover`, `--button-secondary-border-default`). **Button.module.css MUST reference only these variables** — no literal hex/rgb/px except where Figma exports a token value into `:root`.

**Rationale**: FR-011 requires 100% variable-driven styling (SC-006). Central tokens allow Figma updates without touching component CSS. Existing global tokens (`--color-accent`, etc.) remain for non-button UI until a broader design-system migration.

**Alternatives considered**:

| Alternative | Rejected because |
|-------------|------------------|
| Hardcode Figma values in Button.module.css | Fails FR-011 / SC-006 |
| Replace all global tokens in one PR | Out of scope; button feature only |

**Implementation note**: Extract resolved values from Figma symbols (`25:2` … `25:18`) via Figma MCP or Dev Mode at task time; document mapping in [contracts/design-tokens.md](./contracts/design-tokens.md).

## R3: React component API

**Decision**: Single **`Button`** component at `src/components/Button/Button.tsx` with props:

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `variant` | `'primary' \| 'secondary' \| 'ghost'` | `'primary'` | Maps to Figma Style |
| `disabled` | `boolean` | `false` | Applies Disabled state tokens |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Native form semantics |
| `children` | `ReactNode` | — | Visible label (FR-004) |
| `className` | `string` | optional | Layout only (e.g. full width); no color overrides |
| `onClick` | handler | optional | Ignored when disabled |

Render native `<button>`; forward standard button HTML attributes except `className` merge.

**Rationale**: Covers all in-scope call sites (form submit, modal actions, retry). No `as="a"` in v1 — bookstore CTAs are actions, not link-styled navigation.

**Alternatives considered**: Polymorphic `asChild` (deferred); separate `PrimaryButton`/`SecondaryButton` files (unnecessary duplication).

## R4: Focus and hover (Figma gaps)

**Decision**:

- **Hover**: CSS `:hover` uses Hover state tokens per variant.
- **Focus**: CSS `:focus-visible` with `--button-focus-ring` token (distinct from Default and Hover); Figma has no Focus symbol — documented in spec Assumptions.
- **Active/pressed**: Reuse Hover tokens on `:active` for pointer feedback.

**Rationale**: Meets FR-010 without inventing unpublished Figma states.

## R5: Migration mapping (FR-007)

**Decision**: Replace ad-hoc buttons in these files:

| Location | Current | Target variant |
|----------|---------|----------------|
| `AgeGateModal` confirm | `.primary` | `primary` |
| `AgeGateModal` decline | `.secondary` | `secondary` |
| `AgeGateModal` retry | `.primary` | `primary` |
| `ContactPage` submit | `.submit` | `primary` + `disabled` while sending |
| `BookDetailPage` buy | `.buy` | `primary` |
| `ShopifyErrorBanner` retry | `.retry` | `ghost` or `secondary` (match Figma preview hierarchy) |
| `LanguageSwitcher` EN/HU | `.btn` / `.btnActive` | `ghost` inactive / `primary` active (or secondary for active if preview shows outline — verify against Preview frames) |

Remove obsolete button CSS rules from page/module files after migration.

**Rationale**: SC-002 requires 100% adoption on listed flows.

## R6: Testing strategy

**Decision**:

- **Vitest**: Unit test `Button` renders correct variant class names and `disabled`/`type` attributes; optional test that `Button.module.css` contains no `#` hex literals (regex audit).
- **Manual**: Side-by-side Figma Editorial/Dark matrix vs. local story or dev page showing all 9 states.
- **No E2E** in v1 unless tasks add Playwright later.

**Rationale**: Constitution requires Vitest for business logic; styling parity is visual gate per SC-001. Component is mostly presentational — class/attribute tests + token audit satisfy FR-011 enforcement.

## R7: Code Connect

**Decision**: **Defer** Figma Code Connect (`.figma.ts`) to a follow-up task; not blocking spec/plan acceptance.

**Rationale**: Spec Assumptions explicitly allow deferral; repo has no existing Code Connect files.
