# Data Model: Figma Foundational Design Tokens

**Feature**: `004-figma-design-tokens` | **Date**: 2026-06-09

## Overview

No server persistence. This feature defines **design-token entities** in CSS and their **consumer relationships** across the storefront. Runtime state is limited to the browser's `prefers-color-scheme` media query — no React theme context in v1.

## Entities

### FoundationalDesignToken

A CSS custom property on `:root` mapped 1:1 to a Figma Foundation variable or text style.

| Field | Type | Rules |
|-------|------|--------|
| `name` | string | Tier prefix + kebab path (e.g. `--sys-primary`, `--space-md`, `--font-size-body-md`) |
| `figmaSource` | string | Figma variable path (e.g. `sys/primary`, `space/md`) or text style name from page `13:5` |
| `value` | string | Resolved CSS value (color hex, px length, font stack, weight number) |
| `category` | enum | `color`, `typography`, `spacing`, `radius`, `breakpoint` |
| `mode` | enum | `shared`, `light`, `dark` | Color tokens use light default + dark override; spacing/typography are `shared` |

**Validation (FR-001 / FR-002)**:

- Every in-scope Figma Foundation variable on pages `13:4`–`13:6` MUST have a corresponding token declared in `src/styles/tokens/foundation.css`.
- Mapping registry maintained in [contracts/foundational-design-tokens.md](./contracts/foundational-design-tokens.md).

### SemanticColorToken (extends FoundationalDesignToken)

M3 `sys/*` role whose resolved color changes by color mode.

| Field | Type | Rules |
|-------|------|--------|
| `role` | enum | `accent`, `onAccent`, `accentContainer`, `onAccentContainer`, `primary`, `onPrimary`, `primaryContainer`, `onPrimaryContainer`, `secondary`, `onSecondary`, `secondaryContainer`, `onSecondaryContainer`, `tertiary`, `surface`, `onSurface`, `surfaceContainer`, `surfaceContainerHigh`, `background`, `outline`, `outlineVariant`, `error`, `onError` |
| `lightValue` | color | Figma Light mode binding |
| `darkValue` | color | Figma Dark mode binding |

**Relationships**: Referenced by LegacyAlias and ComponentDesignToken color properties.

### TypographyToken (extends FoundationalDesignToken)

| Field | Type | Rules |
|-------|------|--------|
| `styleName` | string | e.g. `display/large`, `title/medium`, `body/small`, `label/small`, `mono/body` |
| `fontFamily` | token ref | `--font-family-*` |
| `fontSize` | length | px from Figma |
| `fontWeight` | number | 400, 500, 600, … |
| `lineHeight` | length or unitless | From Figma text style |
| `letterSpacing` | length | From Figma (may be 0) |

### SpacingToken (extends FoundationalDesignToken)

| Step | Figma | Pixel value |
|------|-------|-------------|
| xs | `space/xs` | 4 |
| sm | `space/sm` | 8 |
| md | `space/md` | 16 |
| lg | `space/lg` | 24 |
| xl | `space/xl` | 32 |
| 2xl | `space/2xl` | 48 |
| 3xl | `space/3xl` | 64 |

### RadiusToken (extends FoundationalDesignToken)

| Name | Figma | Value |
|------|-------|-------|
| none | `radius/none` | 0 |
| md | `radius/md` | 8px |

### LegacyAlias

Deprecated token name retained for one migration cycle (FR-005).

| Field | Type | Rules |
|-------|------|--------|
| `legacyName` | string | e.g. `--color-bg`, `--space-md` |
| `target` | token ref | `var(--sys-background)`, `var(--space-md)` |
| `status` | enum | `active`, `deprecated` |

Registry: [contracts/legacy-aliases.md](./contracts/legacy-aliases.md).

### ComponentDesignToken (existing — updated relationship)

Named CSS custom property for Button or BookCard scoped groups in `components.css`.

| Field | Type | Rules |
|-------|------|--------|
| `name` | string | `--button-*` or `--book-card-*` per prior contracts |
| `composesFrom` | token ref[] | MUST use `var(--sys-*)`, `var(--space-*)`, `var(--font-*)`, `var(--radius-*)` for colors, spacing, typography, radius after migration |
| `rawLiteralAllowed` | boolean | `true` only for `transparent`, `none`, `0`, or documented extension tokens |

**Relationships**: Consumed by `Button.module.css`, `BookCard.module.css`; updated contracts cross-reference [002](../002-figma-button-component/contracts/design-tokens.md) and [003](../003-figma-book-card/contracts/design-tokens.md) composition rules.

### ColorMode (runtime — browser)

| Value | Trigger | Token resolution |
|-------|---------|------------------|
| `light` | Default `:root` | Light values on `--sys-*` |
| `dark` | `@media (prefers-color-scheme: dark)` | Dark overrides on `--sys-*` |

No application state entity — CSS media query only.

## Consumer map (pages & components)

| Consumer file | Legacy tokens used | Post-migration |
|---------------|-------------------|----------------|
| `global.css` | `--font-sans`, `--color-bg`, `--color-text`, `--color-accent` | Aliases → foundation |
| `SiteLayout.module.css` | `--color-surface`, `--color-border`, `--space-*`, `--color-accent`, `--color-text-muted` | Aliases → foundation |
| `PrimaryNav.module.css` | `--color-text`, `--color-accent`, `--space-*` | Aliases → foundation |
| `LanguageSwitcher.module.css` | `--color-text-muted`, `--space-xs` | Aliases → foundation |
| `LandingPage.module.css` | `--space-*`, `--color-*`, `--radius` | Aliases → foundation |
| `BooksOverviewPage.module.css` | `--space-*`, `--color-text-muted` | Aliases → foundation |
| `BookDetailPage.module.css` | `--space-*`, `--color-*`, `--radius` | Aliases → foundation |
| `ContactPage.module.css` | `--space-*`, `--color-border`, `--color-error`, `--color-accent`, `--radius` | Aliases → foundation |
| `AgeGateModal.module.css` | `--space-*`, `--color-surface`, `--color-text-muted`, `--radius` | Aliases → foundation |
| `ShopifyErrorBanner.module.css` | `--color-error`, `--space-*`, `--radius` | Aliases → foundation |
| `Button.module.css` | `--button-*` | Via composed component tokens |
| `BookCard.module.css` | `--book-card-*` | Via composed component tokens |

## State transitions

```text
[page load]
    └── browser reports prefers-color-scheme
            ├── light (or no preference) → :root Light --sys-* values
            └── dark → @media block Dark --sys-* overrides

[foundational token change in foundation.css]
    └── legacy aliases + component tokens + all var() consumers update on rebuild
```

No React state transitions.
