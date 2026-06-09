# Data Model: Figma Button Component

**Feature**: `002-figma-button-component` | **Date**: 2026-06-09

## Overview

No server persistence. This feature defines a **presentational UI component** and **design-token entities** in the storefront. Runtime state is limited to native button behavior (`disabled`, focus).

## Entities

### Button (component props)

| Field | Type | Rules |
|-------|------|--------|
| `variant` | `'primary' \| 'secondary' \| 'ghost'` | Required semantic style; maps 1:1 to Figma `Style=` property |
| `disabled` | `boolean` | When true, apply Disabled state tokens; block activation |
| `type` | `'button' \| 'submit' \| 'reset'` | Default `'button'`; use `'submit'` on contact form |
| `children` | `ReactNode` | Non-empty text label for in-scope usages |
| `className` | `string?` | Layout modifiers only; MUST NOT override color/spacing tokens |
| `onClick` | `function?` | Optional; not called when `disabled` |

**Relationships**: Consumed by pages/modals listed in FR-007; styled exclusively via **ButtonDesignTokens**.

### ButtonVariant (enum)

| Value | Figma symbol prefix |
|-------|---------------------|
| `primary` | `Style=Primary` |
| `secondary` | `Style=Secondary` |
| `ghost` | `Style=Ghost` |

### ButtonInteractionState (enum)

| Value | CSS trigger | Figma symbol suffix |
|-------|-------------|---------------------|
| `default` | base class | `State=Default` |
| `hover` | `:hover`, `:active` | `State=Hover` |
| `disabled` | `[disabled]`, `:disabled` | `State=Disabled` |
| `focus` | `:focus-visible` | *(not in Figma — uses `--button-focus-ring`)* |

### ButtonDesignToken

Named CSS custom property on `:root` backing one visual property for one variant/state.

| Field | Type | Rules |
|-------|------|--------|
| `name` | string | `--button-{variant}-{property}-{state}` convention |
| `figmaSource` | string | Figma variable name or symbol node id |
| `value` | string | Resolved CSS value (color, length, font, shadow) |
| `property` | enum | `bg`, `text`, `border`, `radius`, `padding-x`, `padding-y`, `font-size`, `font-weight`, `opacity`, `focus-ring`, … |
| `variant` | ButtonVariant \| `shared` | Token scope |
| `state` | ButtonInteractionState \| `shared` | Token scope |

**Validation (FR-011 / SC-006)**:

- Every declaration in `Button.module.css` MUST use `var(--button-…)` or other approved token — no raw color/spacing literals.
- Token registry maintained in [contracts/design-tokens.md](./contracts/design-tokens.md).

### MigrationTarget (checklist entity)

| Field | Type | Rules |
|-------|------|--------|
| `file` | string | Source file path |
| `actionLabel` | string | e.g. confirm, submit, buy |
| `assignedVariant` | ButtonVariant | Per research R5 |
| `migrated` | boolean | Set true when `<Button>` replaces native `<button>` |

## State transitions

```text
enabled + default ──hover/active──► hover appearance
enabled + default ──focus-visible──► focus ring
enabled ──disabled=true──► disabled appearance (no click)
disabled ──disabled=false──► default appearance
```

No internal React state required beyond `disabled` prop from parents (e.g. contact form `sending`).
