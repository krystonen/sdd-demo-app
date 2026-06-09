# Contract: Button Design Tokens

**Spec**: FR-011, SC-006 | **Research**: R2 | **Figma file**: `YR4A9Vf42an3qee8HaiwDx`

## Rule

All Button visual properties MUST use CSS custom properties defined in `src/styles/tokens.css` (or an imported `button-tokens` partial). **Implementer action**: populate values by inspecting Figma symbols `25:2`–`25:18` and bound Figma variables on the Button component.

## Naming convention

```text
--button-{variant}-{property}-{state}
--button-focus-ring          # shared focus (no Figma symbol)
--button-height              # shared layout (34px from Figma)
--button-padding-x           # shared if constant across variants
--button-font-*              # shared typography
--button-radius              # shared corner radius
```

States: `default`, `hover`, `disabled` (suffix omitted for shared layout tokens).

## Required token groups (minimum)

Populate exact values during implementation from Figma Dev Mode / MCP export.

### Primary

| Token | Property |
|-------|----------|
| `--button-primary-bg-default` | Background Default |
| `--button-primary-bg-hover` | Background Hover |
| `--button-primary-bg-disabled` | Background Disabled |
| `--button-primary-text-default` | Label Default |
| `--button-primary-text-hover` | Label Hover |
| `--button-primary-text-disabled` | Label Disabled |
| `--button-primary-border-default` | Border if any |
| `--button-primary-opacity-disabled` | Disabled opacity if not via bg |

### Secondary

| Token | Property |
|-------|----------|
| `--button-secondary-bg-default` | |
| `--button-secondary-bg-hover` | |
| `--button-secondary-bg-disabled` | |
| `--button-secondary-text-default` | |
| `--button-secondary-text-hover` | |
| `--button-secondary-text-disabled` | |
| `--button-secondary-border-default` | |
| `--button-secondary-border-hover` | |
| `--button-secondary-border-disabled` | |

### Ghost

| Token | Property |
|-------|----------|
| `--button-ghost-bg-default` | Typically transparent |
| `--button-ghost-bg-hover` | |
| `--button-ghost-bg-disabled` | |
| `--button-ghost-text-default` | |
| `--button-ghost-text-hover` | |
| `--button-ghost-text-disabled` | |
| `--button-ghost-border-default` | If applicable |

### Shared

| Token | Property |
|-------|----------|
| `--button-height` | 34px |
| `--button-padding-x` | From symbol auto-layout |
| `--button-font-size` | Label typography |
| `--button-font-weight` | Label typography |
| `--button-radius` | Corner radius |
| `--button-focus-ring` | Focus outline (a11y) |

## Figma ↔ CSS mapping table (fill at implement)

| Figma symbol | CSS token | Resolved value |
|--------------|-----------|----------------|
| `25:2` Primary Default fill | `--button-primary-bg-default` | `#82d3e0` |
| `25:2` Primary Default text | `--button-primary-text-default` | `#00363d` |
| `25:4` Primary Hover fill | `--button-primary-bg-hover` | `#004f58` |
| `25:4` Primary Hover text | `--button-primary-text-hover` | `#9eeffd` |
| `25:6` Primary Disabled | `--button-primary-*-disabled` + `--button-opacity-disabled` | `#82d3e0` / `#00363d` / `0.38` |
| `25:8` Secondary Default fill | `--button-secondary-bg-default` | `#334b4f` |
| `25:8` Secondary Default text | `--button-secondary-text-default` | `#cde7ec` |
| `25:10` Secondary Hover fill | `--button-secondary-bg-hover` | `#252b2c` |
| `25:12` Secondary Disabled | `--button-secondary-*-disabled` + opacity | `#334b4f` / `#cde7ec` / `0.38` |
| `25:14` Ghost Default border | `--button-ghost-border-default` | `#d4a373` |
| `25:14` Ghost Default text | `--button-ghost-text-default` | `#dee3e5` |
| `25:16` Ghost Hover fill | `--button-ghost-bg-hover` | `#1b2122` |
| `25:18` Ghost Disabled border/text | `--button-ghost-border-disabled` / `--button-ghost-text-disabled` | `#3f484a` / `#bfc8ca` |
| Shared layout | `--button-height`, `--button-padding-x`, `--button-font-size` | `34px`, `24px`, `11px` |
| Shared focus (no Figma symbol) | `--button-focus-ring-color` | `#9eeffd` |

## Audit (SC-006)

Before feature complete:

1. Grep `Button.module.css` for `#`, `rgb`, `hsl` — expect **zero** matches (except `var()`).
2. Every `var(--button-` reference must resolve to a token declared in `tokens.css`.
3. Visual review: 9 Figma symbols vs. rendered states on dev preview page.

## Legacy tokens

Existing globals (`--color-accent`, `--color-accent-hover`, etc.) remain for non-button UI. Do **not** reference legacy accent tokens from `Button.module.css` — use `--button-*` only.
