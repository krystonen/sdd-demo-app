---
description: "Task list for Figma Link Component"
---

# Tasks: Figma Link Component

**Input**: Design documents from `/specs/005-figma-link-component/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Vitest for `Link` per plan.md and constitution (route-active behavior, `end` prop, optional CSS token audit).

**Organization**: Tasks grouped by user story (spec.md P1–P3). Setup and Foundational phases block all stories.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no incomplete-task dependencies)
- **[Story]**: US1–US3 from spec.md

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm feature context and prepare component folder

- [X] T001 Confirm `.specify/feature.json` points to `specs/005-figma-link-component` on branch `005-figma-link-component`
- [X] T002 [P] Create `src/components/Link/` directory with barrel file `src/components/Link/index.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Figma design tokens and shared `Link` component — **blocks all user stories**

**⚠️ CRITICAL**: No PrimaryNav migration until this phase is complete

- [X] T003 Extract resolved values from Figma symbols `133:2` (Default), `133:4` (Hover), `133:6` (Active) and fill mapping table in `specs/005-figma-link-component/contracts/design-tokens.md`
- [X] T004 Add `--link-*` CSS custom properties to `src/styles/tokens/components.css` per `contracts/design-tokens.md` (FR-009)
- [X] T005 [P] Add Link composition rows to `specs/004-figma-design-tokens/contracts/component-token-composition.md`
- [X] T006 Implement `src/components/Link/Link.tsx` wrapping React Router `NavLink` per `specs/005-figma-link-component/contracts/link-component.md`
- [X] T007 Implement `src/components/Link/Link.module.css` with default, hover, and route-active styles using **only** `var(--link-*)` tokens
- [X] T008 Export `Link` from `src/components/Link/index.ts`

**Checkpoint**: Import `<Link to="/books">Books</Link>` in dev; Default/Hover/Active token styles apply; no hex literals in module CSS

---

## Phase 3: User Story 1 - Consistent Header Main Nav (Priority: P1) 🎯 MVP

**Goal**: Home, Books, About, and Contact use the shared Link component with Figma Default/Hover/Active styling

**Independent Test**: Open any page; four main nav labels match Figma `133:2`; hover matches `133:4`; current section shows `133:6` (Books active on `/books` and `/books/:handle`; Home active only on `/`)

### Tests for User Story 1

- [X] T009 [P] [US1] Write `tests/unit/Link.test.tsx` covering `href` render, `end` prop on `/`, and active class when `MemoryRouter` initial entry matches

### Implementation for User Story 1

- [X] T010 [US1] Replace Home, Books, About, and Contact with `<Link>` in `src/components/layout/PrimaryNav.tsx` (`end` on Home/About/Contact; Books without `end` per research R5)
- [X] T011 [US1] Remove `.link` color and typography rules from `src/components/layout/PrimaryNav.module.css` — retain layout-only `.nav` flex/gap/responsive rules
- [X] T012 [US1] Manual smoke: main nav Default/Hover/Active on dev per `specs/005-figma-link-component/quickstart.md` section 2–3 (main destinations only)

**Checkpoint**: Four main nav links use DS `<Link>`; `npm test -- Link` passes; Books shows Active on book detail

---

## Phase 4: User Story 2 - Legal Nav Links (Priority: P2)

**Goal**: Privacy, Terms, and Cookies use the same Link component as main navigation

**Independent Test**: Header legal group shows three DS links; hover/active match Figma; no `.legalLink` ad-hoc styling remains

### Implementation for User Story 2

- [X] T013 [US2] Replace Privacy, Terms, and Cookies with `<Link end>` in `src/components/layout/PrimaryNav.tsx`
- [X] T014 [US2] Remove `.legalLink` color and typography rules from `src/components/layout/PrimaryNav.module.css`
- [X] T015 [US2] Confirm 100% header nav adoption (FR-006 / SC-002): no raw `Link` import from `react-router-dom` remains in `src/components/layout/PrimaryNav.tsx`

**Checkpoint**: All seven header destinations use DS `<Link>`; legal Active state on each `/legal/*` route

---

## Phase 5: User Story 3 - Accessible Keyboard Navigation (Priority: P3)

**Goal**: Visible focus ring, `aria-current="page"` on active route, keyboard activation without ambiguity

**Independent Test**: Tab through header links; focus ring distinct from Default/Hover; Enter navigates; active link announces current page

### Tests for User Story 3

- [X] T016 [P] [US3] Extend `tests/unit/Link.test.tsx` asserting `aria-current="page"` when route is active
- [X] T017 [P] [US3] Add CSS literal audit to `tests/unit/Link.test.tsx` — assert `src/components/Link/Link.module.css` has no `#` or `rgb(` literals (SC-005)
- [X] T018 [P] [US3] Extend `tests/unit/tokens.test.ts` to assert `--link-*` tokens exist in `src/styles/tokens/components.css` and compose from foundations

### Implementation for User Story 3

- [X] T019 [US3] Implement `:focus-visible` outline using `--link-focus-ring-*` in `src/components/Link/Link.module.css` (FR-008)
- [X] T020 [US3] Verify `NavLink` sets `aria-current` when active (explicit prop not required in RR7); covered by `tests/unit/Link.test.tsx`
- [X] T021 [US3] Manual keyboard smoke per `specs/005-figma-link-component/quickstart.md` section 4

**Checkpoint**: SC-003 focus smoke passes; token audit tests green

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Visual sign-off, light/dark review, and repo hygiene

- [X] T022 [P] Run full `npm test` suite and resolve failures
- [X] T023 Side-by-side visual review: Figma symbols `133:2`–`133:6` vs header links (SC-001)
- [X] T024 Light and dark review with `prefers-color-scheme` per `specs/005-figma-link-component/quickstart.md` section 5
- [X] T025 Route-active matrix for all seven destinations per quickstart section 3 (SC-006)
- [X] T026 Update implementation status in `specs/005-figma-link-component/plan.md` when feature ships
- [X] T027 [P] Check off completed tasks in this file (`specs/005-figma-link-component/tasks.md`)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup — **BLOCKS** US1–US3
- **User Stories (Phases 3–5)**: Depend on Foundational; execute P1 → P2 → P3 sequentially for clean checkpoints
- **Polish (Phase 6)**: Depends on Phases 3–5 complete

### User Story Dependencies

- **US1 (P1)**: After Phase 2 — no dependency on US2/US3; delivers main nav MVP
- **US2 (P2)**: After US1 — same `PrimaryNav.tsx` file; legal links added after main links migrated
- **US3 (P3)**: After US2 — focus/a11y polish on completed Link component and full nav

### Within Each User Story

- Tests before or alongside first implementation in that story
- `Link.tsx` active/focus behavior before manual smoke in US3
- Story checkpoint before next priority

### Parallel Opportunities

- **Phase 1**: T001 and T002 parallel
- **Phase 2**: T005 parallel with T003–T004; T006–T007 sequential after T004
- **US1**: T009 parallel with T010 once Phase 2 done (coordinate PrimaryNav if both touch same file — run T009 first, then T010–T011)
- **US3**: T016, T017, T018 parallel after US2; T019–T020 sequential on `Link.module.css` / `Link.tsx`
- **Polish**: T022 and T027 parallel

---

## Parallel Example: Foundational Phase

```bash
# After T001–T002 (Setup):
Task T003: Fill design-tokens.md mapping from Figma MCP
Task T004: Add --link-* block to components.css
Task T005: Update component-token-composition.md (parallel with T003–T004)
# Then sequential:
Task T006: Link.tsx
Task T007: Link.module.css
Task T008: index.ts export
```

---

## Parallel Example: User Story 3

```bash
# After US2 checkpoint, run in parallel:
Task T016: Link.test.tsx aria-current assertion
Task T017: Link.test.tsx CSS literal audit
Task T018: tokens.test.ts --link-* composition
# Then:
Task T019: focus-visible in Link.module.css
Task T020: aria-current in Link.tsx
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup  
2. Complete Phase 2: Foundational (**required**)  
3. Complete Phase 3: US1 (main nav + route-active tests)  
4. **STOP and VALIDATE**: Header main links match Figma; Books active on detail routes  
5. Demo before legal links (US2)

### Incremental Delivery

1. Setup + Foundational → `--link-*` tokens + `Link` component ready  
2. US1 → four main nav links → test → demo (**MVP**)  
3. US2 → three legal links → SC-002 complete  
4. US3 → focus ring + a11y tests → keyboard smoke  
5. Polish → SC-001 visual + light/dark review + full test suite

### Parallel Team Strategy

1. One developer: Foundational (T003–T008)  
2. After checkpoint:  
   - Dev A: US1 tests + PrimaryNav main links (T009–T012)  
   - Dev B: prep US3 token audit test (T018) once T004 lands  
3. US2 sequential on `PrimaryNav.tsx` (T013–T015)  
4. US3 a11y + polish in parallel where marked [P]

---

## Notes

- Figma source: [Link `64:2`](https://www.figma.com/design/YR4A9Vf42an3qee8HaiwDx/SDD-Component-Library?node-id=64-2); symbols `133:2`, `133:4`, `133:6`
- **FR-009**: Never add hex/rgb/px semantic literals to `Link.module.css` — `--link-*` tokens only
- Import DS `Link` from `@/components/Link`; do not import `Link` from `react-router-dom` in `PrimaryNav.tsx`
- Legacy `--color-text` / `--color-accent` in other modules stay until broader cleanup
- `SiteLayout` brand link, body copy links, and BookCard links **out of scope** per spec Assumptions
- Code Connect deferred per spec Assumptions
