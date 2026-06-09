# Feature Specification: Figma BookCard Component

**Feature Branch**: `003-figma-book-card`

**Created**: 2026-06-09

**Status**: Draft → Implemented (2026-06-09)

**Input**: User description: "We want to implement BookCard component from Figma design using figma variables and replace it in the app"

## Design Reference

Authoritative Figma source: [BookCard — SDD Component Library](https://www.figma.com/design/YR4A9Vf42an3qee8HaiwDx/SDD-Component-Library?node-id=218-68) (node `218:68`, component set `BookCard`).

Published variants in Figma:

| State   | Symbol node | Reference size |
| ------- | ----------- | -------------- |
| Default | `218:50`    | 240 × 504 px   |
| Hover   | `218:59`    | 240 × 504 px   |

The component set does **not** publish a separate Disabled symbol; unavailable or non-interactive books are handled per Assumptions.

BookCard styling in Figma is bound to **design variables** (colors, spacing, typography, radius, shadow). The implemented BookCard MUST use the equivalent shared variables in the storefront — not one-off values.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Browse the Catalog With Design-Aligned Book Cards (Priority: P1)

A visitor who has confirmed their age opens the Hungarian books overview and sees each title presented in a card that matches the SDD Component Library BookCard design, making the catalog feel cohesive with the rest of the design system.

**Why this priority**: The books overview is the primary catalog surface; BookCard is the main unit of discovery. Visual alignment with Figma builds trust and readability before purchase.

**Independent Test**: Load the books overview with at least one book in the catalog; verify a single BookCard shows cover image, title, author (when present), format label, and price per Figma layout without migrating other pages.

**Acceptance Scenarios**:

1. **Given** a visitor on the books overview with books in the catalog, **When** the page loads, **Then** each book is rendered in a BookCard whose layout, typography, spacing, colors, corner shape, and shadow match the **State=Default** symbol (`218:50`) in the Figma BookCard component set.
2. **Given** a book with a cover image URL, **When** its BookCard is displayed, **Then** the cover appears in the image region with aspect ratio and cropping consistent with the Figma Default symbol.
3. **Given** a book with title, author, format, and price, **When** its BookCard is displayed, **Then** all four data points are visible in Hungarian labels (format uses existing bookstore copy rules) and hierarchy matches Figma (title most prominent, supporting metadata subordinate).
4. **Given** a book without an author value, **When** its BookCard is displayed, **Then** the author line is omitted without leaving a visible gap that breaks vertical rhythm defined in Figma.

---

### User Story 2 - Navigate to Book Detail From a Card (Priority: P2)

A visitor selects a book from the catalog grid and reaches that book's detail page through the card's primary interaction affordance.

**Why this priority**: BookCard is a navigation entry point; browsing must convert to detail views without extra steps.

**Independent Test**: Click or tap a BookCard on the books overview; confirm navigation to `/books/{handle}` and that hover/focus feedback matches Figma before activation.

**Acceptance Scenarios**:

1. **Given** a BookCard on the books overview, **When** the visitor activates the card (click, tap, or Enter/Space while focused), **Then** they are taken to that book's detail page.
2. **Given** a BookCard in its default state, **When** the visitor hovers or focuses it with keyboard, **Then** visual feedback matches **State=Hover** (`218:59`) in Figma without reducing text contrast below readable levels.
3. **Given** a BookCard, **When** the visitor uses keyboard navigation, **Then** a visible focus indicator is present and the entire card remains a single logical target with an accessible name derived from the book title.

---

### User Story 3 - Replace Legacy BookCard Across the Storefront (Priority: P3)

The product team maintains one shared BookCard implementation driven by design variables so catalog styling stays in sync with the SDD Component Library when tokens change.

**Why this priority**: Replacing the ad-hoc BookCard eliminates drift from Figma and satisfies the variable-driven styling requirement established by the Button component feature.

**Independent Test**: Audit the books overview after migration; confirm no legacy BookCard styling remains and a token audit shows zero orphan hardcoded values in BookCard styling.

**Acceptance Scenarios**:

1. **Given** the shared BookCard is available, **When** the books overview renders the catalog grid, **Then** 100% of book entries use the new BookCard — not the previous implementation's ad-hoc styles.
2. **Given** a design variable used by BookCard is updated in the shared token set, **When** the storefront is rebuilt, **Then** all BookCard instances reflect the new value without per-card style edits.
3. **Given** viewports from 320px to 1440px width, **When** the catalog grid displays multiple BookCards, **Then** cards remain legible, tappable, and do not overlap or clip titles for typical Hungarian book titles (up to ~60 characters).

---

### Edge Cases

- What happens when a cover image fails to load? A neutral placeholder or empty image region preserves card dimensions per Figma layout; the card remains navigable.
- What happens when a book title is unusually long? Text wraps or truncates with ellipsis only if the Figma symbol specifies truncation; otherwise wrapping must not break card height or push content outside the card bounds.
- What happens when the catalog is empty? No BookCards render; the existing empty-state message on the books overview is unchanged.
- What happens on high-contrast or forced-colors modes? Hover and focus states remain perceivable even if exact colors are adjusted by the user agent.
- What happens when multiple cards sit in a responsive grid on small screens? Minimum spacing between cards is preserved; touch targets do not merge below minimum size.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The product MUST provide a single reusable **BookCard** component whose visual design is sourced from the Figma BookCard component set ([node `218:68`](https://www.figma.com/design/YR4A9Vf42an3qee8HaiwDx/SDD-Component-Library?node-id=218-68), file key `YR4A9Vf42an3qee8HaiwDx`).
- **FR-002**: The BookCard MUST implement the Figma-defined interaction states: **Default** (`218:50`) and **Hover** (`218:59`).
- **FR-003**: The BookCard MUST display, for each book: cover image, title, format label (physical or e-book per existing Hungarian copy), and price with currency; author MUST be shown when the book record includes an author.
- **FR-004**: The BookCard MUST act as the navigation affordance to the corresponding book detail page for the given book handle.
- **FR-005**: The BookCard MUST expose an accessible name (book title) and support keyboard activation (Enter/Space when focused) in addition to pointer and touch interaction.
- **FR-006**: The books overview catalog grid MUST adopt the shared BookCard for every listed book, replacing the current ad-hoc BookCard implementation.
- **FR-007**: Visual parity with Figma MUST be verifiable by side-by-side comparison against **State=Default** and **State=Hover** symbols for layout, typography, spacing, radius, shadow, and color.
- **FR-008**: BookCard reference dimensions MUST match Figma (240 × 504 px per symbol); the card MAY scale proportionally in responsive grids while preserving internal proportions and token-driven spacing.
- **FR-009**: Focus indicators MUST remain visible on keyboard navigation and MUST NOT be removed for aesthetic reasons; where Figma lacks a dedicated focus state, focus appearance MUST be distinct from Default and Hover.
- **FR-010**: Every visual property of the BookCard (colors, typography, spacing, corner radius, borders, shadow, opacity) MUST be driven by **shared design variables** from the SDD Component Library that correspond to Figma variable bindings — hardcoded or page-specific values are **not permitted** for in-scope BookCard styling.

### Key Entities

- **BookCard state**: A named visual treatment (**Default**, **Hover**) as defined in the Figma component set (node `218:68`).
- **Book display data**: Title, optional author, cover image URL, format type (physical / e-book), price amount, and currency code — sourced from the existing bookstore catalog model.
- **Design reference**: Figma component set **BookCard** (`218:68`) in SDD Component Library; states outside Default and Hover are out of scope until added to that component set.
- **Design variable**: A named token in the component library (Figma variable and its storefront equivalent) for color, spacing, typography, radius, shadow, or border used by BookCard; all BookCard styling MUST reference these variables.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In a structured visual review, 100% of BookCard states (Default, Hover) match their Figma symbols with no more than 2px deviation in spacing/size and no perceptible hue shift in brand colors.
- **SC-002**: 100% of book entries on the books overview use the shared BookCard component rather than the previous ad-hoc implementation.
- **SC-003**: Keyboard-only testers can reach and activate every BookCard on the books overview with a visible focus indicator on first attempt in 95% of moderated sessions.
- **SC-004**: On viewports from 320px to 1440px width, BookCard content for standard Hungarian catalog copy remains readable without horizontal overflow breaking the grid layout in 100% of acceptance test cases.
- **SC-005**: In a design-token audit, 100% of BookCard visual properties (both states) map to a named design variable from the SDD Component Library — zero orphan hardcoded values remain in BookCard styling.
- **SC-006**: 100% of acceptance testers can navigate from a BookCard on the books overview to the correct book detail page on first attempt.

## Assumptions

- The BookCard component set is **published and ready** on the Figma BookCard page ([node `218:68`](https://www.figma.com/design/YR4A9Vf42an3qee8HaiwDx/SDD-Component-Library?node-id=218-68)) with Default and Hover states only.
- Figma does not define separate **Focus**, **Active/pressed**, or **Disabled** symbols; keyboard focus uses a distinct accessible outline, active/pressed may reuse Hover styling, and unavailable books are not visually distinguished in v1 unless a Disabled symbol is added to Figma.
- Scope includes the **books overview catalog grid** only; the landing page featured-book teaser (simple text link today) is **out of scope** unless added explicitly later.
- Book pages remain **Hungarian-only** per existing bookstore language rules; format labels reuse existing `booksHu` copy.
- Shared design variables in Figma and the storefront MUST stay in sync; when a Figma variable changes, updating the matching storefront variable MUST update all BookCard instances without per-instance edits.
- The BookCard renders as a navigational card (link semantics); behavior choice is an implementation detail, but accessibility and visuals must match this spec.
- Code Connect mapping (Figma ↔ code) is desirable follow-up but not required for spec acceptance.
- Catalog data shape (`Book` type) is unchanged; this feature replaces presentation only.
