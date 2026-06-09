# Data Model: Figma Link Component

**Feature**: `005-figma-link-component` | **Date**: 2026-06-09

## Overview

No server persistence. This feature defines a **presentational navigation component**, **design-token entities**, and **route-matching rules** for header links. Runtime state is driven by React Router location (`isActive`) and native anchor pseudo-classes (`:hover`, `:focus-visible`).

## Entities

### Link (component props)

| Field | Type | Rules |
|-------|------|--------|
| `to` | `string` | Required destination path; must be an in-app route for v1 |
| `end` | `boolean` | Default `false`; when `true`, active only on exact path match (Home, leaf legal routes) |
| `children` | `ReactNode` | Non-empty visible label; localized via parent (`PrimaryNav`) |
| `className` | `string?` | Layout modifiers only; MUST NOT override color/typography tokens |

**Relationships**: Consumed by `PrimaryNav` for seven header destinations; styled exclusively via **LinkDesignTokens**.

### LinkInteractionState (enum)

| Value | CSS trigger | Figma symbol suffix |
|-------|-------------|---------------------|
| `default` | base class | `State=Default` |
| `hover` | `:hover` | `State=Hover` |
| `active` | route-active class from `NavLink` | `State=Active` |
| `focus` | `:focus-visible` | *(not in Figma — uses `--link-focus-ring-*`)* |
| `pressed` | `:active` | Reuses Hover tokens |

### LinkDesignToken

Named CSS custom property in `components.css` backing one visual property for one state.

| Field | Type | Rules |
|-------|------|--------|
| `name` | string | `--link-{property}-{state}` convention |
| `figmaSource` | string | Figma variable binding or symbol node id |
| `value` | string | Composes from `var(--sys-*)`, `var(--font-*)`, etc. |
| `property` | enum | `text`, `text-decoration`, `font-size`, `font-weight`, `opacity`, `focus-ring`, … |
| `state` | LinkInteractionState \| `shared` | Token scope |

**Validation (FR-009 / SC-005)**:

- Every declaration in `Link.module.css` MUST use `var(--link-…)` — no raw color/spacing literals.
- Registry maintained in [contracts/design-tokens.md](./contracts/design-tokens.md).

### NavDestination (migration entity)

| Field | Type | Rules |
|-------|------|--------|
| `labelKey` | string | i18n key under `content.common.nav.*` |
| `to` | string | Route path |
| `end` | boolean | Exact-match flag for `NavLink` |
| `group` | `'main' \| 'legal'` | Layout grouping in `PrimaryNav` |
| `migrated` | boolean | Set true when `<Link>` replaces raw RR `Link` |

## State transitions

```text
default ──hover──► hover appearance
default ──focus-visible──► focus ring
default ──route match──► active appearance (persists while on route)
active + hover ──► hover tokens (hover must remain visible over active base)
```

No internal React state; `isActive` comes from React Router `NavLink`.
