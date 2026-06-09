# Contract: [Component Name] Design Tokens

**Spec**: FR-[token requirement], SC-[audit criterion] | **Figma file**: `YR4A9Vf42an3qee8HaiwDx`

**Figma source**: [Component page — SDD Component Library](FIGMA_URL) (node `X:Y`)

## Rule

All [Component] visual properties MUST use CSS custom properties prefixed
`--<component-kebab>-*` declared in `src/styles/tokens/components.css`. Every color and
semantic spacing token MUST compose from foundational tokens via `var(--sys-*)`,
`var(--space-*)`, `var(--font-*)`, or `var(--radius-*)` per
[component-token-composition.md](../../specs/004-figma-design-tokens/contracts/component-token-composition.md).

**Not permitted** in `[Component].module.css`: raw `#`, `rgb()`, `hsl()`, or ad-hoc px for
semantic spacing. Allowed exceptions: `transparent`, `none`, `0`, and fixed layout
dimensions documented below (e.g. Figma-defined control height).

**Implementer action**: populate values by inspecting Figma symbols and bound variables via
Dev Mode or Figma MCP at implement time.

## Naming convention

```text
--<component>-{property}-{state}
--<component>-focus-ring-color     # shared focus (if Figma lacks Focus symbol)
--<component>-height                 # fixed layout only when Figma defines it
--<component>-padding-x / -padding-y
--<component>-font-size / -font-weight
--<component>-radius
```

States: `default`, `hover`, `disabled` (suffix omitted for shared layout tokens).

## Required token groups (minimum)

Populate exact composition targets during implementation. Example structure:

### [Variant or surface group 1]

| Token | Property | Composes from |
|-------|----------|---------------|
| `--<component>-bg-default` | Background Default | `var(--sys-…)` |
| `--<component>-bg-hover` | Background Hover | `var(--sys-…)` |
| `--<component>-text-default` | Label Default | `var(--sys-…)` |

### Shared layout

| Token | Property | Composes from / fixed |
|-------|----------|----------------------|
| `--<component>-padding-x` | Horizontal padding | `var(--space-md)` |
| `--<component>-gap` | Internal gap | `var(--space-sm)` |
| `--<component>-radius` | Corner radius | `var(--radius-none)` |
| `--<component>-focus-ring-color` | Focus outline | `var(--sys-primary-container)` |

## Figma ↔ CSS mapping table (fill at implement)

| Figma symbol / variable | CSS token | Foundation target |
|-------------------------|-----------|-------------------|
| `[node-id]` Default fill | `--<component>-bg-default` | `var(--sys-…)` |
| `[node-id]` Hover fill | `--<component>-bg-hover` | `var(--sys-…)` |
| Shared layout | `--<component>-padding-x`, etc. | `var(--space-…)` |

## Audit

Before feature complete:

1. Grep `[Component].module.css` for `#`, `rgb`, `hsl` — expect **zero** matches outside `var()`.
2. Grep `components.css` for new `--<component>-*` entries — each color/spacing value MUST use `var(--sys-|var(--space-|var(--font-|var(--radius-`.
3. Run `npm test` — token and component CSS audits must pass.
4. Visual review: every in-scope Figma symbol vs. rendered state on dev preview; repeat in
   dark mode (`prefers-color-scheme: dark`).

## Propagation test

Temporarily change one foundational token (e.g. `--sys-primary` Light value) in
`foundation.css`, reload, confirm the component updates without editing `--<component>-*`
declarations. Revert before commit.

## Legacy tokens

Existing page globals (`--color-*` aliases in `legacy-aliases.css`) remain for non-component
UI. Do **not** reference legacy accent tokens from `[Component].module.css` — use
`--<component>-*` only.
