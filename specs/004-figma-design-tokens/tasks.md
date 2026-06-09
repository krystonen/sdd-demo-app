---
description: "Task list for Figma Foundational Design Tokens"
---

# Tasks: Figma Foundational Design Tokens

**Input**: Design documents from `/specs/004-figma-design-tokens/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Vitest token literal audits per plan.md and constitution (`tests/unit/tokens.test.ts` + existing Button/BookCard CSS audits).

**Organization**: Tasks grouped by user story (spec.md P1–P3). Setup and Foundational phases block all stories.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no incomplete-task dependencies)
- **[Story]**: US1–US3 from spec.md

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm feature context and token directory scaffold

- [X] T001 Confirm `.specify/feature.json` points to `specs/004-figma-design-tokens` on branch `004-figma-design-tokens`
- [X] T002 [P] Create `src/styles/tokens/` directory and stub files `foundation.css`, `legacy-aliases.css`, `components.css` per `specs/004-figma-design-tokens/plan.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Figma value extraction and import chain — **blocks all user stories**

**⚠️ CRITICAL**: No foundation or alias implementation until mapping tables are populated

- [X] T003 Extract Light and Dark `--sys-*` hex values from Figma Foundations Colors page (`13:4`) via MCP/Dev Mode and fill mapping table in `specs/004-figma-design-tokens/contracts/foundational-design-tokens.md`
- [X] T004 [P] Extract typography token values from Figma Foundations Typography page (`13:5`) and fill typography section in `specs/004-figma-design-tokens/contracts/foundational-design-tokens.md`
- [X] T005 Refactor `src/styles/tokens.css` to `@import` chain only (`tokens/foundation.css`, `tokens/legacy-aliases.css`, `tokens/components.css`) preserving `src/styles/global.css` import path

**Checkpoint**: Contract mapping tables populated; `tokens.css` imports partials; monolithic token literals removed from `src/styles/tokens.css`

---

## Phase 3: User Story 1 - Consistent Visual Language From Figma Foundations (Priority: P1) 🎯 MVP

**Goal**: Foundational spacing, typography, radius, and Light-mode semantic colors; legacy aliases map pages to Figma-aligned tokens

**Independent Test**: Inspect `src/styles/tokens/foundation.css` and `legacy-aliases.css` against Figma Foundations Colors/Typography/Layout (Light); legacy `--color-*` resolve to `--sys-*`; spacing matches 4–64px scale

### Implementation for User Story 1

- [X] T006 [US1] Implement spacing (`--space-xs` … `--space-3xl`), radius, and breakpoint tokens in `src/styles/tokens/foundation.css` per `specs/004-figma-design-tokens/contracts/foundational-design-tokens.md` (FR-001, FR-007)
- [X] T007 [US1] Implement typography tokens (display, headline, title, body, label, mono) in `src/styles/tokens/foundation.css` per `specs/004-figma-design-tokens/contracts/foundational-design-tokens.md` (FR-008)
- [X] T008 [US1] Implement Light-mode `--sys-*` semantic color tokens on `:root` in `src/styles/tokens/foundation.css` (FR-001, FR-003)
- [X] T009 [US1] Create `src/styles/tokens/legacy-aliases.css` mapping legacy `--color-*`, `--space-*`, `--radius`, `--font-sans`, `--shadow` to foundation tokens per `specs/004-figma-design-tokens/contracts/legacy-aliases.md` (FR-005)
- [X] T010 [US1] Manual Light-mode spot-check on landing, nav, books overview, and book detail per `specs/004-figma-design-tokens/quickstart.md` section 2 (SC-001, SC-002, SC-003)

**Checkpoint**: Storefront pages render with Figma M3 Light palette via aliases; spacing/typography foundations defined; no bookstore-green literals in `legacy-aliases.css`

---

## Phase 4: User Story 2 - Light and Dark Mode Support (Priority: P2)

**Goal**: Dark-mode semantic colors via `prefers-color-scheme`; readable contrast in both modes

**Independent Test**: Toggle OS/browser dark mode; surfaces, text, and borders switch to Figma Dark bindings; WCAG AA on primary content regions

### Implementation for User Story 2

- [X] T011 [US2] Add `@media (prefers-color-scheme: dark)` `--sys-*` overrides in `src/styles/tokens/foundation.css` using Dark values from `specs/004-figma-design-tokens/contracts/foundational-design-tokens.md` (FR-003, FR-004)
- [X] T012 [US2] Set `color-scheme: light dark` on `:root` in `src/styles/tokens/foundation.css` (research R4)
- [X] T013 [US2] Manual Dark-mode toggle smoke on nav, `/books`, book detail, and landing per `specs/004-figma-design-tokens/quickstart.md` section 3
- [X] T014 [US2] WCAG AA contrast spot-check on primary content regions in Light and Dark modes (SC-004)

**Checkpoint**: US2 acceptance scenarios pass; legacy aliases and pages track mode without page CSS edits

---

## Phase 5: User Story 3 - Component Tokens Reference Foundations (Priority: P3)

**Goal**: `--button-*` and `--book-card-*` compose from foundations; zero orphan literals in module CSS

**Independent Test**: Grep `src/styles/tokens/components.css` for hex; change `--sys-primary` in `foundation.css` and confirm Button/BookCard update without editing component token literals

### Tests for User Story 3

- [X] T015 [P] [US3] Add `tests/unit/tokens.test.ts` asserting `src/styles/tokens/components.css` has no `#` or `rgb(` color literals and module CSS under `src/` has no orphan literals outside token files (SC-005, FR-009)

### Implementation for User Story 3

- [X] T016 [US3] Move existing `--button-*` and `--book-card-*` blocks from prior monolithic tokens into `src/styles/tokens/components.css`
- [X] T017 [US3] Refactor `--button-*` tokens in `src/styles/tokens/components.css` to compose via `var(--sys-*)`, `var(--space-*)`, `var(--font-*)`, `var(--radius-*)` per `specs/004-figma-design-tokens/contracts/component-token-composition.md` (FR-006)
- [X] T018 [US3] Refactor `--book-card-*` tokens in `src/styles/tokens/components.css` to compose from foundation tokens per `specs/004-figma-design-tokens/contracts/component-token-composition.md` (FR-006)
- [X] T019 [US3] Run SC-006 propagation test: temporarily change `--sys-primary` Light value in `src/styles/tokens/foundation.css` and verify Button Primary + BookCard surfaces update without `components.css` literal edits

**Checkpoint**: `npm test -- tokens` passes; Button/BookCard existing audits still pass; component tokens track color mode via foundations

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Full verification and repo hygiene

- [X] T020 [P] Run full `npm test` suite and resolve failures
- [X] T021 Side-by-side visual review: Figma Foundations Light/Dark swatches and typography vs storefront (SC-001, SC-003, SC-010)
- [X] T022 Execute full smoke checklist in `specs/004-figma-design-tokens/quickstart.md` sections 1–7
- [X] T023 Update implementation status in `specs/004-figma-design-tokens/plan.md` when feature ships
- [X] T024 [P] Check off completed tasks in `specs/004-figma-design-tokens/tasks.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup — **BLOCKS** US1–US3
- **User Stories (Phases 3–5)**: Depend on Foundational; execute P1 → P2 → P3 sequentially for clean checkpoints
- **Polish (Phase 6)**: Depends on Phases 3–5 complete

### User Story Dependencies

- **US1 (P1)**: After Phase 2 — no dependency on US2/US3
- **US2 (P2)**: After US1 — adds Dark overrides to completed Light foundation
- **US3 (P3)**: After US2 — component composition assumes both color modes stable

### Within Each User Story

- Contract mapping filled (Phase 2) before CSS implementation
- Foundation tokens before legacy aliases (US1)
- Light foundation before Dark overrides (US2)
- Foundation + aliases before component refactor (US3)
- Token audit test (T015) before or alongside T016–T18

### Parallel Opportunities

- **Phase 1**: T001 and T002 parallel
- **Phase 2**: T003 and T004 parallel (different Figma pages / contract sections)
- **US3**: T015 parallel with T016 once US2 checkpoint done
- **Polish**: T020 and T024 parallel

---

## Parallel Example: Foundational (Phase 2)

```bash
# After T002 (directory scaffold), run in parallel:
Task T003: Extract Colors 13:4 → contracts/foundational-design-tokens.md
Task T004: Extract Typography 13:5 → contracts/foundational-design-tokens.md
# Then T005: wire @import chain in src/styles/tokens.css
```

---

## Parallel Example: User Story 3

```bash
# After US2 checkpoint:
Task T015: tests/unit/tokens.test.ts (audit)
Task T016: src/styles/tokens/components.css (move blocks)
# Then T017–T018 sequential (same file refactor)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup  
2. Complete Phase 2: Foundational (**required**)  
3. Complete Phase 3: US1 (Light foundations + legacy aliases)  
4. **STOP and VALIDATE**: Pages use Figma M3 Light via aliases; spacing/typography match Foundations  
5. Demo before Dark mode (US2) and component refactor (US3)

### Incremental Delivery

1. Setup + Foundational → mapping tables + import chain  
2. US1 → Light palette + aliases → manual Light smoke (**MVP**)  
3. US2 → Dark overrides + contrast check  
4. US3 → component composition + token audits  
5. Polish → full test suite + visual sign-off

### Parallel Team Strategy

1. One developer: Foundational extraction (T003–T005)  
2. After checkpoint:  
   - Dev A: US1 foundation + aliases (T006–T010)  
   - Dev B: prep US3 test file (T015) once US1 T008 lands  
3. US2 sequential on `foundation.css` dark block  
4. US3 refactor `components.css` then propagation test (T019)

---

## Notes

- Figma sources: [Colors `13:4`](https://www.figma.com/design/YR4A9Vf42an3qee8HaiwDx/SDD-Component-Library?node-id=13-4), [Typography `13:5`](https://www.figma.com/design/YR4A9Vf42an3qee8HaiwDx/SDD-Component-Library?node-id=13-5), [Layout `13:6`](https://www.figma.com/design/YR4A9Vf42an3qee8HaiwDx/SDD-Component-Library?node-id=13-6)
- **FR-006**: No raw hex in `src/styles/tokens/components.css` after US3 — foundation literals live only in `foundation.css`
- Page module CSS may keep legacy `var(--color-*)` names through aliases in v1; direct `--sys-*` migration is optional follow-up
- `--sys-on-surface-variant` for muted text: verify exact Figma semantic at T003 and document in contract
- In-app theme toggle out of scope per spec Assumptions
