# Contract: Foundational Design Tokens

**Spec**: FR-001, FR-002, FR-003, FR-008 | **Research**: R2, R3, R4 | **Figma file**: `YR4A9Vf42an3qee8HaiwDx`

## Rule

All foundational visual properties MUST be declared in `src/styles/tokens/foundation.css` (imported via `src/styles/tokens.css`). **Implementer action**: populate Light/Dark color values by inspecting Figma Foundations pages `13:4`, `13:5`, `13:6` via Dev Mode / Figma MCP.

Page and component styles MUST NOT declare raw color/spacing literals — they consume tokens via `var()` or legacy aliases that resolve to foundations.

## File layout

```text
src/styles/tokens.css          → @import partials
src/styles/tokens/
├── foundation.css             → THIS CONTRACT (sys/*, typography, space, radius, breakpoints)
├── legacy-aliases.css         → see legacy-aliases.md
└── components.css             → --button-* / --book-card-* composition
```

## Naming convention

Figma slash paths → kebab-case CSS custom properties:

```text
sys/{role}           → --sys-{role-kebab}
space/{step}         → --space-{step}
radius/{name}        → --radius-{name}
typography/...       → --font-* (family, size, weight, line-height, letter-spacing)
```

## Color mode blocks

```css
:root {
  color-scheme: light dark;
  /* Light mode — default + prefers-color-scheme fallback (FR-004) */
  --sys-primary: /* Figma Light sys/primary */;
  /* ... all sys/* tokens ... */
}

@media (prefers-color-scheme: dark) {
  :root {
    --sys-primary: /* Figma Dark sys/primary */;
    /* ... all sys/* tokens ... */
  }
}
```

Mode-invariant tokens (spacing, radius, shared typography sizes) live outside the media query.

## Required semantic colors (minimum)

Populate exact hex during implementation from Figma Colors page (`13:4`).

### Brand accent

| Figma variable | CSS token |
|----------------|-----------|
| `sys/accent` | `--sys-accent` |
| `sys/onAccent` | `--sys-on-accent` |
| `sys/accentContainer` | `--sys-accent-container` |
| `sys/onAccentContainer` | `--sys-on-accent-container` |

### M3 system

| Figma variable | CSS token |
|----------------|-----------|
| `sys/primary` | `--sys-primary` |
| `sys/onPrimary` | `--sys-on-primary` |
| `sys/primaryContainer` | `--sys-primary-container` |
| `sys/onPrimaryContainer` | `--sys-on-primary-container` |
| `sys/secondary` | `--sys-secondary` |
| `sys/onSecondary` | `--sys-on-secondary` |
| `sys/secondaryContainer` | `--sys-secondary-container` |
| `sys/onSecondaryContainer` | `--sys-on-secondary-container` |
| `sys/tertiary` | `--sys-tertiary` |
| `sys/surface` | `--sys-surface` |
| `sys/onSurface` | `--sys-on-surface` |
| `sys/surfaceContainer` | `--sys-surface-container` |
| `sys/surfaceContainerHigh` | `--sys-surface-container-high` |
| `sys/background` | `--sys-background` |
| `sys/outline` | `--sys-outline` |
| `sys/outlineVariant` | `--sys-outline-variant` |
| `sys/error` | `--sys-error` |
| `sys/onError` | `--sys-on-error` |

### Figma ↔ CSS mapping table (fill at implement)

| Figma variable | CSS token | Light value | Dark value |
|----------------|-----------|-------------|------------|
| `sys/accent` | `--sys-accent` | `#d4a373` | `#d4a373` |
| `sys/onAccent` | `--sys-on-accent` | `#1a1208` | `#1a1208` |
| `sys/accentContainer` | `--sys-accent-container` | `#f3e8da` | `#3d3024` |
| `sys/onAccentContainer` | `--sys-on-accent-container` | `#4a3828` | `#e8d4bc` |
| `sys/primary` | `--sys-primary` | `#006874` | `#82d3e0` |
| `sys/onPrimary` | `--sys-on-primary` | `#ffffff` | `#00363d` |
| `sys/primaryContainer` | `--sys-primary-container` | `#9eeffd` | `#004f58` |
| `sys/onPrimaryContainer` | `--sys-on-primary-container` | `#004f58` | `#9eeffd` |
| `sys/secondary` | `--sys-secondary` | `#4a6267` | `#b1cbd0` |
| `sys/onSecondary` | `--sys-on-secondary` | `#ffffff` | `#1c3438` |
| `sys/secondaryContainer` | `--sys-secondary-container` | `#cde7ec` | `#334b4f` |
| `sys/onSecondaryContainer` | `--sys-on-secondary-container` | `#334b4f` | `#cde7ec` |
| `sys/tertiary` | `--sys-tertiary` | `#525e7d` | `#bac6ea` |
| `sys/surface` | `--sys-surface` | `#f5fafb` | `#0e1415` |
| `sys/onSurface` | `--sys-on-surface` | `#171d1e` | `#dee3e5` |
| `sys/onSurfaceVariant` | `--sys-on-surface-variant` | `#2e3638` | `#bfc8ca` |
| `sys/surfaceContainer` | `--sys-surface-container` | `#e9eff0` | `#1b2122` |
| `sys/surfaceContainerHigh` | `--sys-surface-container-high` | `#e3e9ea` | `#252b2c` |
| `sys/background` | `--sys-background` | `#f5fafb` | `#0e1415` |
| `sys/outline` | `--sys-outline` | `#6f797a` | `#899294` |
| `sys/outlineVariant` | `--sys-outline-variant` | `#9ea6a8` | `#3f484a` |
| `sys/error` | `--sys-error` | `#ba1a1a` | `#ffb4ab` |
| `sys/onError` | `--sys-on-error` | `#ffffff` | `#690005` |

## Spacing tokens

From Figma Layout page (`13:6`):

| Figma variable | CSS token | Value |
|----------------|-----------|-------|
| `space/xs` | `--space-xs` | `4px` |
| `space/sm` | `--space-sm` | `8px` |
| `space/md` | `--space-md` | `16px` |
| `space/lg` | `--space-lg` | `24px` |
| `space/xl` | `--space-xl` | `32px` |
| `space/2xl` | `--space-2xl` | `48px` |
| `space/3xl` | `--space-3xl` | `64px` |

## Radius tokens

| Figma variable | CSS token | Value | Usage |
|----------------|-----------|-------|-------|
| `radius/none` | `--radius-none` | `0` | Editorial CTAs, Button, BookCard |
| `radius/md` | `--radius-md` | `8px` | Default UI chrome |

## Breakpoint tokens (documented)

| Token | Value | Figma note |
|-------|-------|------------|
| `--breakpoint-mobile` | `375px` | Mobile design canvas |
| `--breakpoint-mobile-max` | `640px` | Mobile max (CSS) |
| `--breakpoint-desktop` | `1440px` | Desktop canvas |
| `--content-max-width` | `720px` | Editorial hero copy |

## Typography tokens (minimum)

Extract from Typography page (`13:5`) specimens (`16:2`, `131:4`). Minimum groups:

| Style group | Token prefix | Properties |
|-------------|--------------|------------|
| Display | `--font-display-*` | family, sizes (lg/md/sm), weight, line-height |
| Headline | `--font-headline-*` | family, sizes, weight, line-height |
| Title | `--font-title-*` | family, sizes (lg/md/sm), weight, line-height |
| Body | `--font-body-*` | family, sizes (lg/md/sm), weight, line-height |
| Label | `--font-label-*` | family, sizes (lg/sm), weight, line-height |
| Monospace | `--font-mono-*` | family, size, weight, line-height (prices, ISBN, SKU) |

### Typography mapping table (fill at implement)

| Figma text style | CSS tokens | Resolved values |
|------------------|------------|-----------------|
| Display/Wordmark | `--font-size-display`, `--font-weight-bold`, `--line-height-tight` | 48px / 700 / 1.2 |
| Display/Hero | `--font-size-headline`, `--font-weight-regular`, `--line-height-tight` | 32px / 400 / 1.2 |
| Body/Large | `--font-size-body-lg`, `--line-height-body` | 18px / 1.5 |
| Body/Medium | `--font-size-body-md`, `--line-height-body` | 16px / 1.5 |
| Body/Small | `--font-size-body-sm`, `--line-height-body` | 14px / 1.5 |
| Label/CTA | `--font-size-label-sm`, `--font-weight-medium`, `--letter-spacing-cta` | 11px / 500 / 3px |
| Label/Caption | `--font-size-label-lg`, `--letter-spacing-wide` | 12px / 2.5px |
| Mono/Default | `--font-size-mono-md`, `--font-family-mono` | 14px / Roboto Mono |
| Mono/Caption | `--font-size-mono-sm`, `--letter-spacing-mono-caption` | 12px / 0.5px |

## Audit (SC-001, SC-002, SC-003)

Before feature complete:

1. Every row in color mapping table filled with Light + Dark hex from Figma.
2. Spacing tokens match Layout page exactly (±0px).
3. Typography specimens visually match within 1px / 0.01em tolerance.
4. Grep `src/**/*.module.css` — zero `#`, `rgb(`, `hsl(` outside comments.
5. Toggle OS dark mode — semantic surfaces update without page edits.
