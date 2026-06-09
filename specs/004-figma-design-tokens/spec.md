# Feature Specification: Figma Foundational Design Tokens

**Feature Branch**: `004-figma-design-tokens`

**Created**: 2026-06-09

**Status**: Draft

**Input**: User description: "Revisit tokens.css — foundational Figma tokens should provide the base of our design system and be referenced accordingly; support light/dark mode; identify typography, colors, and spacings and map values to Figma variables/tokens."

## Design Reference

Authoritative Figma source: [SDD Component Library](https://www.figma.com/design/YR4A9Vf42an3qee8HaiwDx/SDD-Component-Library) — **Foundations** pages:

| Foundation area | Figma page (node) | Purpose |
| --------------- | ----------------- | ------- |
| Colors | [Foundations / Colors](https://www.figma.com/design/YR4A9Vf42an3qee8HaiwDx/SDD-Component-Library?node-id=13-4) (`13:4`) | M3 semantic color tokens with **Light** and **Dark** mode values |
| Typography | [Foundations / Typography](https://www.figma.com/design/YR4A9Vf42an3qee8HaiwDx/SDD-Component-Library?node-id=13-5) (`13:5`) | Editorial type ramp; text styles bound to typography variables (size, line-height, letter-spacing) |
| Layout | [Foundations / Layout](https://www.figma.com/design/YR4A9Vf42an3qee8HaiwDx/SDD-Component-Library?node-id=13-6) (`13:6`) | Spacing scale, border radius, breakpoints |

The storefront's shared token set (`src/styles/tokens.css`) currently mixes ad-hoc legacy values (e.g. bookstore-specific greens) with component-scoped tokens (`--button-*`, `--book-card-*`) that embed raw color literals. This feature establishes a **foundational token layer** aligned with the Figma Foundations pages so all surfaces and components reference the same semantic source of truth.

### Figma token inventory (minimum in scope)

**Colors** — M3 semantic system tokens documented on the Colors page, including at minimum:

- Brand accent group: `sys/accent`, `sys/onAccent`, `sys/accentContainer`, `sys/onAccentContainer`
- M3 system group: `sys/primary`, `sys/onPrimary`, `sys/primaryContainer`, `sys/onPrimaryContainer`, `sys/secondary`, `sys/onSecondary`, `sys/secondaryContainer`, `sys/onSecondaryContainer`, `sys/tertiary`, `sys/surface`, `sys/onSurface`, `sys/surfaceContainer`, `sys/surfaceContainerHigh`, `sys/background`, `sys/outline`, `sys/outlineVariant`, `sys/error`, `sys/onError`
- Each semantic color MUST resolve to distinct values for **Light mode** and **Dark mode** as shown in Figma

**Typography** — Editorial type ramp from the Typography page (`13:5`), including font families, sizes, weights, line heights, and letter spacing for display, headline, title, body, label, and monospace specimens used in the SDD library

**Spacing** — Layout scale from the Layout page (`13:6`):

| Figma variable | Documented size |
| -------------- | --------------- |
| `space/xs` | 4px |
| `space/sm` | 8px |
| `space/md` | 16px |
| `space/lg` | 24px |
| `space/xl` | 32px |
| `space/2xl` | 48px |
| `space/3xl` | 64px |

**Radius** — `radius/none` (0px, editorial CTAs) and `radius/md` (8px, default UI)

**Breakpoints** — Mobile canvas 375px, mobile max 640px, desktop 1440px, editorial content max width 720px (documented on Layout page; used for responsive spacing/layout decisions, not necessarily new CSS media queries in v1)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Consistent Visual Language From Figma Foundations (Priority: P1)

A visitor browsing the Hungarian bookstore sees pages and components whose colors, typography, and spacing derive from the same foundational tokens defined in the SDD Component Library — not from one-off values that drift from design.

**Why this priority**: Foundational tokens are the design-system base; without them, Button and BookCard tokens remain isolated islands of hardcoded hex values.

**Independent Test**: Inspect the shared token set against the Figma Foundations pages (Colors, Typography, Layout); confirm every foundational category is represented with values matching Figma Dev Mode / variable export for Light mode.

**Acceptance Scenarios**:

1. **Given** the Figma Colors page (`13:4`) in Light mode, **When** foundational color tokens are defined in the storefront token set, **Then** each in-scope M3 semantic color (`sys/*`) resolves to the same value as its Figma variable binding.
2. **Given** the Figma Typography page (`13:5`), **When** foundational typography tokens are defined, **Then** each documented text style in the editorial ramp has a corresponding token (family, size, weight, line-height, letter-spacing as applicable).
3. **Given** the Figma Layout page spacing scale (`13:6`), **When** foundational spacing tokens are defined, **Then** `space/xs` through `space/3xl` match the documented pixel sizes (4, 8, 16, 24, 32, 48, 64).
4. **Given** existing legacy tokens (`--color-bg`, `--color-accent`, etc.) used by storefront pages, **When** foundational tokens ship, **Then** legacy aliases either map to semantic foundation tokens or are replaced so pages no longer depend on bookstore-specific literals unrelated to Figma.

---

### User Story 2 - Light and Dark Mode Support (Priority: P2)

A visitor whose device or browser prefers dark appearance sees the storefront rendered with Dark-mode semantic colors from Figma; visitors preferring light appearance see Light-mode values — without broken contrast or unreadable text.

**Why this priority**: The Figma Colors foundation explicitly documents Light/Dark modes; the token architecture must support both to stay aligned with the design system.

**Independent Test**: Toggle system color scheme (or documented theme override) and verify semantic surfaces, text, borders, and accents switch to Dark-mode Figma values while maintaining readable contrast.

**Acceptance Scenarios**:

1. **Given** a visitor with light color scheme preference, **When** any storefront page loads, **Then** semantic color tokens resolve to Light-mode values from Figma (`13:4`).
2. **Given** a visitor with dark color scheme preference, **When** any storefront page loads, **Then** semantic color tokens resolve to Dark-mode values from Figma (`13:4`).
3. **Given** a page using semantic tokens for background, surface, on-surface text, and outline, **When** switching between Light and Dark modes, **Then** no text/background pair falls below WCAG AA contrast (4.5:1 body, 3:1 large text) for primary content regions.
4. **Given** component tokens (`--button-*`, `--book-card-*`) that represent fills, borders, or text colors, **When** color mode changes, **Then** those component tokens derive from foundational semantic colors (directly or via aliases) so components track mode automatically.

---

### User Story 3 - Component Tokens Reference Foundations (Priority: P3)

Developers and designers maintain Button and BookCard styling by updating foundational tokens once; component-level tokens compose from semantics instead of duplicating raw literals.

**Why this priority**: Prior Button and BookCard features required token-driven styling but allowed component tokens with embedded hex values; this feature closes the loop so Figma variable changes propagate through the hierarchy.

**Independent Test**: Audit `--button-*` and `--book-card-*` declarations; confirm color, spacing, typography, and radius values reference foundational tokens (or documented semantic aliases), not orphan literals.

**Acceptance Scenarios**:

1. **Given** the Button component token contract, **When** foundational tokens are in place, **Then** Button color tokens (primary, secondary, ghost states) reference semantic color tokens aligned with Figma variable bindings — not standalone hex unrelated to `sys/*`.
2. **Given** the BookCard component token contract, **When** foundational tokens are in place, **Then** BookCard surface, border, title, meta, and format tokens reference semantic colors and typography/spacing foundations where applicable.
3. **Given** a foundational spacing or radius token update matching a Figma variable change, **When** the storefront is rebuilt, **Then** affected components and pages reflect the new value without per-component literal edits.
4. **Given** an audit of all scoped styles in the storefront, **When** searching for raw color/spacing literals outside the token file, **Then** zero orphan literals remain in in-scope component and page styles (excluding token definition file(s)).

---

### Edge Cases

- What happens when a visitor's browser does not report color-scheme preference? Light mode values apply as the documented default.
- What happens when a Figma semantic token has no direct legacy equivalent? A documented alias maps old token names to new semantics during migration so existing pages do not break mid-rollout.
- What happens when component tokens need a value with no semantic match (e.g. focus ring accent)? Component tokens MAY reference the nearest semantic token or a documented extension token — but MUST NOT introduce unrelated hex literals.
- What happens when typography web fonts from Figma are not licensed for web? Fallback stacks documented in Assumptions preserve hierarchy while matching size/weight/spacing tokens.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The shared token set MUST define a **foundational layer** covering colors (M3 semantic `sys/*`), typography (editorial ramp from `13:5`), spacing (`space/xs`–`space/3xl`), and radius (`radius/none`, `radius/md`) sourced from the Figma Foundations pages cited above.
- **FR-002**: Every foundational token MUST map to a named Figma variable or documented text style on the Foundations pages; a token-to-Figma mapping table MUST be maintained as a planning artifact (exact file location decided in plan phase).
- **FR-003**: Semantic color tokens MUST support **Light mode** and **Dark mode** with values matching Figma variable mode bindings on the Colors page (`13:4`).
- **FR-004**: The storefront MUST apply the correct color mode based on the visitor's system color-scheme preference, with Light mode as the explicit fallback when preference is unknown.
- **FR-005**: Legacy global tokens (`--color-bg`, `--color-surface`, `--color-text`, `--color-text-muted`, `--color-accent`, `--color-accent-hover`, `--color-border`, `--color-error`, `--space-*`, `--radius`, `--font-sans`) MUST be migrated to reference foundational semantics or be superseded by documented aliases so no page relies on values outside the Figma-aligned system.
- **FR-006**: Component token groups (`--button-*`, `--book-card-*`) MUST compose from foundational tokens for colors, spacing, typography, and radius wherever Figma component variables bind to foundation variables — raw literals in component tokens are **not permitted** after migration except for values explicitly documented as having no Figma semantic equivalent.
- **FR-007**: Spacing tokens MUST use the Figma Layout scale pixel values (4/8/16/24/32/48/64) and be consumable by pages and components currently using legacy `--space-*` names via alias or rename.
- **FR-008**: Typography tokens MUST cover the text styles shown on the Typography page (`13:5`), including monospace specimens used for prices, ISBNs, and SKUs.
- **FR-009**: A token audit checklist MUST verify: (a) foundational coverage vs. Figma Foundations inventory, (b) Light/Dark parity, (c) component token composition from foundations, (d) zero orphan literals in in-scope styles.
- **FR-010**: Visual parity for Light and Dark modes MUST be verifiable by side-by-side comparison against Figma Foundations swatches and typography specimens.

### Key Entities

- **Foundational token**: A named design variable in the shared token set that corresponds 1:1 (or via documented alias) to a Figma Foundation variable or text style — colors, typography, spacing, radius.
- **Semantic color token**: An M3 `sys/*` role (e.g. primary, onSurface, outline) whose value changes by color mode.
- **Component token**: A scoped token (`--button-*`, `--book-card-*`) that composes foundational tokens for a specific component contract.
- **Color mode**: Light or Dark appearance context; drives which resolved value a semantic color token exposes.
- **Legacy alias**: A deprecated token name retained temporarily mapping to a foundational token to ease migration of existing pages.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of in-scope M3 semantic colors on the Figma Colors page (`13:4`) have a storefront foundational token with Light and Dark values matching Figma (no perceptible hue shift in brand colors during visual review).
- **SC-002**: 100% of spacing steps on the Figma Layout page (`13:6`) are available as foundational tokens with exact pixel parity (±0px).
- **SC-003**: 100% of text styles on the Figma Typography page (`13:5`) have corresponding foundational typography tokens; visual review confirms size, weight, and line-height match within 1px / 0.01em tolerance.
- **SC-004**: When toggling Light/Dark mode, 100% of primary content regions (navigation, catalog grid, book detail, landing hero) maintain WCAG AA contrast for body and large text.
- **SC-005**: Token audit passes with **zero** raw color/spacing literals in in-scope page and component styles outside token definition file(s).
- **SC-006**: After a simulated foundational color change (e.g. `sys/primary` Light value), Button and BookCard components update visually without editing component token literals — confirming composition from foundations.

## Assumptions

- **Default mode**: Light mode is the default when `prefers-color-scheme` is unavailable; no separate in-app theme toggle is required for v1 unless planning discovers a product need.
- **Scope**: In-scope surfaces include all existing storefront pages and shared components (layout, Button, BookCard, AgeGate, error banners); out of scope for v1: third-party embed styling and Shopify checkout chrome.
- **Fonts**: Webfont loading for Figma-specified families follows the simplest approach compatible with static Vite deployment; if a Figma family is display-only, a documented system fallback preserves token-driven size/weight/spacing.
- **Migration strategy**: Legacy token names MAY remain as aliases during one release cycle; removal of aliases is a follow-up only if no references remain.
- **Dependencies**: Builds on completed Button (`002`) and BookCard (`003`) token contracts; those contracts will be updated to reference foundations rather than re-specified from scratch.
- **Breakpoints**: Breakpoint tokens from Figma Layout are documented for design alignment; implementing new responsive layouts beyond existing pages is not required unless needed to consume spacing token renames.

## Out of Scope

- Creating new UI components beyond token and consumer migration work
- Changing Figma variable definitions in the library file (code follows Figma, not vice versa)
- User-configurable theme picker independent of system preference (may be a future feature)
- Exporting tokens to non-CSS platforms (iOS, Android)
