# Contract: Legacy Token Aliases

**Spec**: FR-005, FR-007 | **Research**: R5 | **File**: `src/styles/tokens/legacy-aliases.css`

## Rule

Legacy global token names used by pre-2026 storefront pages MUST resolve to foundational tokens via `var()` — **no standalone hex or rem literals** in this file.

Aliases are **deprecated** but retained for one release cycle so page CSS files require minimal or zero edits during migration.

## Alias registry

| Legacy token | Resolves to | Notes |
|--------------|-------------|-------|
| `--color-bg` | `var(--sys-background)` | `global.css` body background |
| `--color-surface` | `var(--sys-surface)` | Cards, header, modals |
| `--color-text` | `var(--sys-on-surface)` | Primary body text |
| `--color-text-muted` | `var(--sys-on-surface-variant)` | Secondary text — verify Figma semantic at implement |
| `--color-accent` | `var(--sys-accent)` | Links, nav active, CTAs |
| `--color-accent-hover` | `var(--sys-accent-container)` | Hover states — verify vs LandingPage usage |
| `--color-border` | `var(--sys-outline-variant)` | Dividers, input borders |
| `--color-error` | `var(--sys-error)` | Form errors, banners |
| `--font-sans` | `var(--font-family-body)` | Global body font |
| `--space-xs` | `var(--space-xs)` | Rebases to 4px foundation (was 0.25rem) |
| `--space-sm` | `var(--space-sm)` | Rebases to 8px foundation |
| `--space-md` | `var(--space-md)` | 16px |
| `--space-lg` | `var(--space-lg)` | 24px |
| `--space-xl` | `var(--space-xl)` | 32px |
| `--radius` | `var(--radius-md)` | Default UI radius 8px |
| `--shadow` | `none` | No Figma elevation token in v1 — extension documented |

## New spacing steps (no legacy names)

These foundation steps have **no** legacy alias — use directly in new/refactored CSS:

| Token | Value |
|-------|-------|
| `--space-2xl` | `48px` |
| `--space-3xl` | `64px` |
| `--radius-none` | `0` |

## Migration phases

1. **Phase A**: Add `foundation.css` + `legacy-aliases.css`; legacy names point to new semantics.
2. **Phase B**: Refactor `components.css` to compose from foundations.
3. **Phase C** (optional follow-up): Replace legacy `var(--color-*)` in page modules with `var(--sys-*)` directly; remove aliases when grep shows zero references.

## Audit

```bash
# No legacy alias should contain a hex literal
rg '#[0-9a-fA-F]' src/styles/tokens/legacy-aliases.css
# Expect zero matches
```

Every legacy name MUST appear exactly once in `legacy-aliases.css` with a `var()` reference.
