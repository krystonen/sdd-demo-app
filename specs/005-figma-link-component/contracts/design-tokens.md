# Contract: Link Design Tokens

**Spec**: FR-009, SC-005 | **Research**: R2 | **Figma file**: `YR4A9Vf42an3qee8HaiwDx`

**Figma source**: [Link page — SDD Component Library](https://www.figma.com/design/YR4A9Vf42an3qee8HaiwDx/SDD-Component-Library?node-id=64-2) (node `64:2`, symbols `133:2`–`133:6`)

## Rule

All Link visual properties MUST use CSS custom properties prefixed `--link-*` declared in `src/styles/tokens/components.css`. Every color and semantic typography token MUST compose from foundational tokens via `var(--sys-*)`, `var(--font-*)`, or `var(--space-*)` per [component-token-composition.md](../../004-figma-design-tokens/contracts/component-token-composition.md).

**Not permitted** in `Link.module.css`: raw `#`, `rgb()`, `hsl()`, or ad-hoc px for semantic spacing. Allowed exceptions: `transparent`, `none`, `0`.

**Implementer action**: populate values by inspecting Figma symbols `133:2`, `133:4`, `133:6` and bound variables via Dev Mode or Figma MCP at implement time.

## Naming convention

```text
--link-text-{state}
--link-text-decoration-{state}
--link-font-size
--link-font-weight
--link-line-height
--link-focus-ring-width
--link-focus-ring-offset
--link-focus-ring-color
```

States: `default`, `hover`, `active` (suffix omitted for shared layout tokens).

## Required token groups (minimum)

### Text / decoration

| Token | Property | Composes from (target) |
|-------|----------|------------------------|
| `--link-text-default` | Label Default | `var(--sys-on-surface)` |
| `--link-text-hover` | Label Hover | `var(--sys-accent)` |
| `--link-text-active` | Label Active (current route) | `var(--sys-accent)` or `var(--sys-primary-container)` — verify Figma `133:6` |
| `--link-text-decoration-default` | Underline Default | `none` or Figma value |
| `--link-text-decoration-hover` | Underline Hover | verify symbol |
| `--link-text-decoration-active` | Underline Active | verify symbol |

### Shared layout / typography

| Token | Property | Composes from / fixed |
|-------|----------|----------------------|
| `--link-font-size` | Label size | `var(--font-size-body-sm)` or nearest Figma match |
| `--link-font-weight` | Label weight | `var(--font-weight-medium)` — verify `133:2` |
| `--link-line-height` | Line height | `var(--line-height-body)` |
| `--link-focus-ring-width` | Focus outline | `2px` (Button precedent) |
| `--link-focus-ring-offset` | Focus offset | `2px` |
| `--link-focus-ring-color` | Focus color | `var(--sys-primary-container)` |

## Figma ↔ CSS mapping table (fill at implement)

| Figma symbol | CSS token | Foundation target |
|--------------|-----------|-------------------|
| `133:2` Default text fill | `--link-text-default` | `var(--sys-on-surface)` |
| `133:4` Hover text fill | `--link-text-hover` | `var(--sys-accent)` |
| `133:6` Active text fill | `--link-text-active` | `var(--sys-accent)` |
| Shared typography | `--link-font-size`, `--link-font-weight` | `var(--font-size-body-sm)`, `var(--font-weight-medium)` |
| Text decoration (all states) | `--link-text-decoration-*` | `none` |
| Focus (no Figma symbol) | `--link-focus-ring-color` | `var(--sys-primary-container)` |

## Audit (SC-005)

Before feature complete:

1. Grep `Link.module.css` for `#`, `rgb`, `hsl` — expect **zero** matches outside `var()`.
2. Grep new `--link-*` in `components.css` — each color value MUST use `var(--sys-…)`.
3. Run `npm test` — token and Link tests pass.
4. Visual review: 3 Figma symbols + Preview Light/Dark frames; repeat with `prefers-color-scheme: dark`.

## Propagation test

Temporarily change `--sys-accent` Light value in `foundation.css`, reload header links — Hover/Active labels MUST update without editing `--link-text-hover` declaration (must already compose from `--sys-accent`).

## Legacy tokens

Do **not** reference `--color-text`, `--color-accent`, or other legacy aliases from `Link.module.css` — use `--link-*` only. Legacy aliases remain for non-migrated page UI until broader cleanup.
