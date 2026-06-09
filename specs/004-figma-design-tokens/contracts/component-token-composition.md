# Contract: Component Token Composition

**Spec**: FR-006, SC-006 | **Research**: R6 | **File**: `src/styles/tokens/components.css`

## Rule

All `--button-*` and `--book-card-*` tokens MUST compose from foundational tokens in `foundation.css` using `var()`. Raw hex, rgb, hsl, and px spacing literals are **not permitted** except:

- `transparent`
- `none`
- `0` / `0px` where semantically zero
- Documented extension tokens (e.g. `--button-opacity-disabled: 0.38` if Figma exports opacity separately)

Prior contracts remain authoritative for **token names and states** — this contract adds the **composition layer** on top of [002 button tokens](../../002-figma-button-component/contracts/design-tokens.md) and [003 book-card tokens](../../003-figma-book-card/contracts/design-tokens.md).

## Button composition (target)

| Component token | Composes from | Figma alignment |
|-----------------|---------------|-----------------|
| `--button-primary-bg-default` | `var(--sys-primary)` | Primary Default fill |
| `--button-primary-bg-hover` | `var(--sys-primary-container)` or darker primary semantic | Primary Hover — verify binding |
| `--button-primary-text-default` | `var(--sys-on-primary)` | Primary Default label |
| `--button-primary-text-hover` | `var(--sys-primary-fixed)` | Hover label (#9eeffd — mode-invariant) |
| `--button-secondary-bg-default` | `var(--sys-secondary)` | Secondary Default |
| `--button-secondary-text-default` | `var(--sys-on-secondary)` | Secondary label |
| `--button-ghost-border-default` | `var(--sys-accent)` | Ghost border (gold accent) |
| `--button-ghost-text-default` | `var(--sys-on-surface)` | Ghost label on dark surface |
| `--button-ghost-bg-hover` | `var(--sys-surface-container-high)` | Ghost Hover fill |
| `--button-height` | `34px` | Layout constant from Figma symbol — allowed fixed dimension |
| `--button-padding-x` | `var(--space-lg)` | 24px horizontal padding |
| `--button-font-size` | `var(--font-label-sm-size)` | 11px label — map to nearest label token |
| `--button-radius` | `var(--radius-none)` | Editorial sharp corners |
| `--button-focus-ring-color` | `var(--sys-primary-container)` | Extension — no Figma Focus symbol |

Disabled states: apply `opacity: var(--button-opacity-disabled)` on control; bg/text tokens reuse Default semantic colors.

## BookCard composition (target)

| Component token | Composes from | Figma alignment |
|-----------------|---------------|-----------------|
| `--book-card-bg-default` | `var(--sys-surface-container)` | Card Default fill |
| `--book-card-border-default` | `var(--sys-outline-variant)` | Default border |
| `--book-card-border-hover` | `var(--sys-accent)` | Hover accent border |
| `--book-card-cover-bg` | `var(--sys-outline-variant)` | Placeholder |
| `--book-card-title-color-default` | `var(--sys-on-surface)` | Title |
| `--book-card-meta-color-default` | `var(--sys-on-surface-variant)` | Author / price |
| `--book-card-format-bg-default` | `var(--sys-accent-container)` | Format badge |
| `--book-card-format-border-default` | `var(--sys-accent)` | Badge border |
| `--book-card-format-color-default` | `var(--sys-on-accent-container)` | Badge text |
| `--book-card-padding-x` | `var(--space-md)` | 16px |
| `--book-card-padding-y` | `var(--space-md)` | 16px |
| `--book-card-gap` | `var(--space-sm)` | 8px |
| `--book-card-radius` | `var(--radius-none)` | Sharp card |
| `--book-card-title-font-family` | `var(--font-family-body)` | Inter title |
| `--book-card-title-font-size` | `var(--font-size-title-md)` | 16px title |
| `--book-card-title-line-height` | `var(--line-height-body)` | 150% title |
| `--book-card-meta-font-family` | `var(--font-family-body)` | Inter author |
| `--book-card-meta-font-size` | `var(--font-size-body-sm)` | 14px meta |
| `--book-card-meta-line-height` | `var(--line-height-body)` | 150% author |
| `--book-card-price-font-family` | `var(--font-family-mono)` | Roboto Mono price |
| `--book-card-price-font-size` | `var(--font-size-mono-md)` | 14px price |
| `--book-card-price-line-height` | `var(--line-height-body)` | 150% price |
| `--book-card-format-font-family` | `var(--font-family-body)` | Inter badge |
| `--book-card-format-font-size` | `var(--font-size-label-lg)` | 12px Label/Caption |
| `--book-card-format-font-weight` | `var(--font-weight-regular)` | 400 badge |
| `--book-card-format-line-height` | `var(--line-height-tight)` | 120% badge |
| `--book-card-format-letter-spacing` | `var(--letter-spacing-wide)` | 2.5px badge |
| `--book-card-focus-ring-color` | `var(--sys-primary-container)` | Shared with Button focus |

## Link composition (target)

| Component token | Composes from | Figma alignment |
|-----------------|---------------|-----------------|
| `--link-text-default` | `var(--sys-on-surface)` | Default `133:2` label |
| `--link-text-hover` | `var(--sys-accent)` | Hover `133:4` label |
| `--link-text-active` | `var(--sys-accent)` | Active `133:6` label |
| `--link-font-size` | `var(--font-size-body-sm)` | 14px body-sm label |
| `--link-font-weight` | `var(--font-weight-medium)` | 500 weight |
| `--link-line-height` | `var(--line-height-body)` | 150% line height |
| `--link-text-decoration-default` | `none` | No underline Default |
| `--link-focus-ring-color` | `var(--sys-primary-container)` | Extension — no Figma Focus symbol |

Exact semantic bindings verified against Figma component variable links at implement time; update this table if MCP export differs.

## Propagation test (SC-006)

After migration, change `--sys-primary` Light value in `foundation.css` only:

- Button Primary Default background MUST change
- No edits to `--button-primary-bg-default` declaration required (must already be `var(--sys-primary)`)

## Audit

```bash
# components.css must not contain hex (except transparent in comments)
rg '#[0-9a-fA-F]{3,8}' src/styles/tokens/components.css
# Expect zero matches (or only inside comments)

# Every color/spacing component token should reference foundation
rg 'var\(--sys-|var\(--space-|var\(--font-|var\(--radius-' src/styles/tokens/components.css
```

Existing Vitest audits in `Button.test.tsx` and `BookCard.test.tsx` remain valid for module CSS; add `tokens.test.ts` for `components.css` composition rules.
