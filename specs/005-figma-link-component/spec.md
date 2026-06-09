# Feature Specification: Figma Link Component

**Feature Branch**: `005-figma-link-component`

**Created**: 2026-06-09

**Status**: Draft → Implemented (2026-06-09)

**Input**: User description: "implement link component following figma design replace them in navigation"

## Design Reference

Authoritative Figma source: [Link page — SDD Component Library](https://www.figma.com/design/YR4A9Vf42an3qee8HaiwDx/SDD-Component-Library?node-id=64-2) (node `64:2`, component set `Link` at `133:8`).

Published states in Figma:

| State   | Symbol node |
| ------- | ----------- |
| Default | `133:2`     |
| Hover   | `133:4`     |
| Active  | `133:6`     |

The file also includes **Preview / Light / Desktop** and **Preview / Dark / Desktop** frames showing Link instances in a horizontal navigation row (main destinations) and a secondary row (legal destinations), mirroring the bookstore header navigation pattern.

Link styling in Figma is bound to **design variables** (colors, typography). The implemented Link MUST use the equivalent shared variables in the storefront — not one-off values.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Navigate the Storefront With Consistent Header Links (Priority: P1)

A visitor uses the site header to move between Home, Books, About, and Contact and sees every destination styled as the Figma Link component, so navigation feels cohesive with the SDD Component Library and easy to scan.

**Why this priority**: Primary navigation is present on every page and is the main way visitors explore the bookstore. Inconsistent link styling undermines wayfinding and brand trust.

**Independent Test**: Open any page with the header visible; verify the four main nav destinations match Figma Link **State=Default** styling and respond to hover without migrating footer or in-page body links.

**Acceptance Scenarios**:

1. **Given** a visitor viewing the site header, **When** main navigation destinations (Home, Books, About, Contact) are displayed, **Then** each label uses the shared Link component and matches **State=Default** in the Figma Link component set.
2. **Given** a main nav Link in its default state, **When** the visitor hovers or focuses it with keyboard, **Then** visual feedback matches **State=Hover** without reducing label contrast below readable levels.
3. **Given** the visitor is on a page that corresponds to a nav destination, **When** that destination appears in the header, **Then** it presents **State=Active** styling so the current section is identifiable at a glance.
4. **Given** localized labels in English or Hungarian of typical length, **When** rendered in the header on viewports from 320px to 1440px width, **Then** labels remain fully visible without breaking the header layout.

---

### User Story 2 - Access Legal Pages Through Secondary Nav Links (Priority: P2)

A visitor opens Privacy, Terms, or Cookies from the header's legal link group and sees the same Link component treatment as main navigation, preserving visual hierarchy while keeping legal destinations discoverable.

**Why this priority**: Legal links share the header navigation region today; migrating only main links would leave a mixed, inconsistent nav cluster.

**Independent Test**: From the header, verify Privacy, Terms, and Cookies use the shared Link component with correct default, hover, and active states; confirm they sit in the legal group without ad-hoc styling.

**Acceptance Scenarios**:

1. **Given** a visitor viewing the header legal link group, **When** Privacy, Terms, and Cookies are displayed, **Then** each uses the shared Link component (not bespoke styled anchors).
2. **Given** a legal nav Link, **When** hovered or focused, **Then** appearance matches **State=Hover** in Figma.
3. **Given** the visitor is on a legal page (e.g., Privacy Policy), **When** that legal destination appears in the header, **Then** it presents **State=Active** styling.

---

### User Story 3 - Accessible Keyboard Navigation and Current-Page Indication (Priority: P3)

A visitor using keyboard navigation or assistive technology can reach every header link, perceive which page is current, and activate links without ambiguity.

**Why this priority**: Navigation must be operable for all visitors; active-route indication is a core wayfinding requirement for multi-page storefronts.

**Independent Test**: Tab through header links on a page where one main and one legal destination should be active; verify focus order, visible focus indicator, and active styling on the correct items.

**Acceptance Scenarios**:

1. **Given** a focusable header Link, **When** navigated to via keyboard, **Then** a visible focus indicator is distinct from Default and Hover (see Assumptions where Figma does not define a dedicated focus state).
2. **Given** header Links in a `<nav>` landmark, **When** announced by assistive technology, **Then** each link's accessible name matches its visible label.
3. **Given** an enabled header Link, **When** activated via Enter while focused, **Then** the visitor navigates to the intended destination once.

---

### Edge Cases

- What happens when two nav items could match the current URL (e.g., `/books` vs. `/books/some-handle`)? Only the most specific matching destination shows **Active** styling; parent routes (e.g., Books) remain active when viewing a child book detail path if that is the established routing convention.
- What happens on the home route (`/`)? Home shows **Active** only on the landing page, not on every page.
- How does the system handle unusually long localized nav labels? Text wraps or truncates only if Figma specifies truncation; otherwise labels wrap without breaking header alignment or overlapping adjacent links.
- What happens on high-contrast or forced-colors modes? Focus, hover, and active states remain perceivable even if exact colors are adjusted by the user agent.
- What happens on narrow mobile viewports where nav stacks vertically? Link spacing and touch targets remain usable; stacked layout matches existing responsive header behavior without losing Figma link styling.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The product MUST provide a single reusable **Link** component whose visual design is sourced from the Figma Link page ([node `64:2`](https://www.figma.com/design/YR4A9Vf42an3qee8HaiwDx/SDD-Component-Library?node-id=64-2), file key `YR4A9Vf42an3qee8HaiwDx`).
- **FR-002**: The Link MUST implement exactly these interaction states as published in Figma: **Default**, **Hover**, and **Active**.
- **FR-003**: The Link MUST accept a text label and expose it to assistive technologies as the accessible name.
- **FR-004**: The Link MUST be activatable via pointer, keyboard (Enter when focused), and standard touch interaction for in-app navigation destinations.
- **FR-005**: When the Link's destination matches the visitor's current page (per routing rules in Assumptions), it MUST present **State=Active** styling and MUST NOT navigate away when already on that destination.
- **FR-006**: The site header navigation MUST adopt the shared Link component for all in-scope destinations: Home, Books, About, Contact, Privacy, Terms, and Cookies — replacing bespoke styled navigation anchors.
- **FR-007**: Visual parity with Figma MUST be verifiable by side-by-side comparison against the **Editorial / Dark** component matrix and **Preview / Light / Desktop** and **Preview / Dark / Desktop** frames for every state in FR-002.
- **FR-008**: Focus indicators MUST remain visible on keyboard navigation and MUST NOT be removed for aesthetic reasons; where Figma lacks a dedicated focus state, focus appearance MUST be distinct from Default and Hover.
- **FR-009**: Every visual property of the Link (colors, typography, text decoration, opacity) MUST be driven by **shared design variables** from the SDD Component Library that correspond to Figma variable bindings — hardcoded or page-specific values are **not permitted** for in-scope Link styling.
- **FR-010**: Header navigation MUST retain its existing information architecture (main destinations plus legal group) and localized labels (English/Hungarian) after migration; only presentation and component structure change.

### Key Entities

- **Link state**: A named interaction appearance (**Default**, **Hover**, **Active**) as defined in the Figma Link component set (node `133:8`).
- **Link label**: User-visible text describing the destination; localized per existing bookstore i18n rules.
- **Navigation destination**: A header route (e.g., Home → `/`, Books → `/books`, Privacy → `/legal/privacy`) mapped to a Link instance.
- **Design reference**: Figma page **Link** (`64:2`) in SDD Component Library; states outside Default / Hover / Active are out of scope until added to that component set.
- **Design variable**: A named token in the component library (Figma variable and its storefront equivalent) for color, typography, or decoration used by Link states; all Link styling MUST reference these variables.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In a structured visual review, 100% of in-scope Link states (Default, Hover, Active) match their Figma symbols with no more than 2px deviation in spacing/size and no perceptible hue shift in brand colors.
- **SC-002**: 100% of header navigation destinations listed in FR-006 use the shared Link component rather than ad-hoc styled anchors.
- **SC-003**: Keyboard-only testers can reach and activate every enabled header Link with a visible focus indicator on first attempt in 95% of moderated sessions.
- **SC-004**: On viewports from 320px to 1440px width, nav labels for standard EN/HU copy remain readable without horizontal overflow breaking header layout in 100% of acceptance test cases.
- **SC-005**: In a design-token audit, 100% of Link visual properties (all states) map to a named design variable from the SDD Component Library — zero orphan hardcoded values remain in Link styling.
- **SC-006**: When visiting each major section (Home, Books, About, Contact, and each legal page), the corresponding header Link shows **Active** styling in 100% of route-to-nav mapping test cases.

## Assumptions

- The Link component set is **published and ready** on the Figma Link page ([node `64:2`](https://www.figma.com/design/YR4A9Vf42an3qee8HaiwDx/SDD-Component-Library?node-id=64-2)) with Default, Hover, and Active states only; no separate Disabled symbol exists in Figma.
- Figma does not define a dedicated **Focus** state; keyboard focus uses a distinct accessible outline consistent with other design-system components (Button precedent).
- Scope is **header navigation only** (main destinations and legal link group). Inline links in page body copy, footer-only links, catalog card navigation, and external URLs are **out of scope** for v1 unless explicitly added later.
- Figma publishes a **single Link style** (no Style= variant dimension); main and legal nav links share the same component. Any prior size/weight differences in legacy CSS are superseded by the Figma symbol.
- **Active** state is driven by current route matching: exact match for leaf routes (e.g., `/legal/privacy`); prefix match for Books when viewing `/books/:handle` if that matches existing storefront routing behavior.
- Shared design variables in Figma and the storefront MUST stay in sync; when a Figma variable changes, updating the matching storefront variable MUST update all Link states without per-state ad-hoc edits.
- The Link component wraps in-app navigation semantics; whether it renders as a router link or native anchor is an implementation detail, but accessibility and visuals must match this spec.
- Code Connect mapping (Figma ↔ code) is desirable follow-up but not required for spec acceptance.
