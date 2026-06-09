---
description: "Task list for Figma BookCard Component"
---

# Tasks: Figma BookCard Component

**Input**: Design documents from `/specs/003-figma-book-card/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Vitest for `BookCard` per plan.md and constitution (render, conditional author, link target + optional CSS token audit).

**Organization**: Tasks grouped by user story (spec.md P1–P3). Setup and Foundational phases block all stories.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no incomplete-task dependencies)
- **[Story]**: US1–US3 from spec.md

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm feature context and prerequisites

- [X] T001 Confirm `.specify/feature.json` points to `specs/003-figma-book-card` on branch `003-figma-book-card`
- [X] T002 [P] Verify shared `Button` component exists at `src/components/Button/Button.tsx` (dependency from `002-figma-button-component`)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Figma design tokens and Hungarian CTA copy — **blocks all user stories**

**⚠️ CRITICAL**: No BookCard rewrite until this phase is complete

- [X] T003 Extract resolved values from Figma symbols `218:50` (Default) and `218:59` (Hover) and fill mapping table in `specs/003-figma-book-card/contracts/design-tokens.md`
- [X] T004 Add `--book-card-*` CSS custom properties to `src/styles/tokens.css` per `contracts/design-tokens.md` (FR-010)
- [X] T005 Add `viewBook` Hungarian CTA label to `src/content/hu/books.ts` (research R7)

**Checkpoint**: `tokens.css` contains book-card token block; `booksHu.viewBook` available

---

## Phase 3: User Story 1 - Browse Catalog With Design-Aligned Cards (Priority: P1) 🎯 MVP

**Goal**: Books overview shows Figma-accurate Default-state cards with cover, title, author (when present), format, and price

**Independent Test**: Load `/books` after age confirm; each card matches Figma `218:50` layout and Hungarian field hierarchy; author line omitted when empty

### Tests for User Story 1

- [X] T006 [P] [US1] Write `tests/unit/BookCard.test.tsx` covering title, format, price, and author present vs omitted when `book.author` is empty

### Implementation for User Story 1

- [X] T007 [US1] Rewrite `src/components/BookCard/BookCard.tsx` with Figma layout regions (cover, title, author, format, price) per `specs/003-figma-book-card/contracts/book-card-component.md`
- [X] T008 [US1] Rewrite `src/components/BookCard/BookCard.module.css` Default state using **only** `var(--book-card-*)` tokens — remove legacy `--color-surface`, `--shadow`, and rem-hardcoded sizes

**Checkpoint**: Books overview renders redesigned cards in Default state; `npm test -- BookCard` passes content assertions

---

## Phase 4: User Story 2 - Navigate to Book Detail From a Card (Priority: P2)

**Goal**: Whole-card link navigates to book detail; card shows Figma Hover feedback; keyboard-accessible activation

**Independent Test**: Click card → `/books/{handle}`; hover card matches `218:59`; Tab to card shows focus ring; Enter navigates

### Tests for User Story 2

- [X] T009 [P] [US2] Extend `tests/unit/BookCard.test.tsx` asserting card link `href` includes `book.handle`

### Implementation for User Story 2

- [X] T010 [US2] Wrap card in whole-card React Router `Link` to `/books/{book.handle}` with `aria-label` from `booksHu.viewBook` in `src/components/BookCard/BookCard.tsx` (Figma symbols have no separate button)
- [X] T011 [US2] Implement Hover state in `src/components/BookCard/BookCard.module.css` via `.card:hover` and `.card:focus-within` per symbol `218:59`
- [X] T012 [US2] Ensure accessible name (title heading + link `aria-label`) and keyboard activation on the card link in `src/components/BookCard/BookCard.tsx` (FR-005)

**Checkpoint**: SC-006 navigation works; hover/focus visible on manual smoke per `quickstart.md` sections 2–5

---

## Phase 5: User Story 3 - Replace Legacy BookCard (Priority: P3)

**Goal**: 100% books-overview adoption; responsive grid; zero orphan hardcoded values in BookCard styling

**Independent Test**: Grep `BookCard.module.css` for legacy globals and literals; grid readable 320px–1440px; all catalog entries use new component

### Tests for User Story 3

- [X] T013 [P] [US3] Add CSS literal audit to `tests/unit/BookCard.test.tsx` — assert `src/components/BookCard/BookCard.module.css` has no `#` or `rgb(` literals (SC-005)

### Implementation for User Story 3

- [X] T014 [US3] Confirm `src/pages/BooksOverviewPage.tsx` renders `<BookCard key={book.id} book={book} />` for every catalog entry (FR-006 / SC-002)
- [X] T015 [US3] Update `.grid` `minmax` track in `src/pages/BooksOverviewPage.module.css` to preserve ≥240px card width (FR-008 / SC-004)
- [X] T016 [US3] Manual responsive smoke on books overview at 320px, 640px, and 1440px per `specs/003-figma-book-card/quickstart.md` section 7

**Checkpoint**: SC-002, SC-004, SC-005 satisfied; token audit test green

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Visual sign-off and repo hygiene

- [X] T017 [P] Run full `npm test` suite and resolve failures
- [X] T018 Side-by-side visual review: Figma `218:50` Default and `218:59` Hover vs books overview (SC-001)
- [X] T019 Update implementation status in `specs/003-figma-book-card/plan.md` when feature ships
- [X] T020 [P] Check off completed tasks in this file (`specs/003-figma-book-card/tasks.md`)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup — **BLOCKS** US1–US3
- **User Stories (Phases 3–5)**: Depend on Foundational; execute P1 → P2 → P3 sequentially for clean checkpoints
- **Polish (Phase 6)**: Depends on Phases 3–5 complete

### User Story Dependencies

- **US1 (P1)**: After Phase 2 — no dependency on US2/US3
- **US2 (P2)**: After US1 — adds whole-card link navigation and hover on completed card shell
- **US3 (P3)**: After US2 — grid tuning and audits assume final component

### Within Each User Story

- Tests before or alongside first implementation in that story
- TSX changes before related CSS when same feature area
- Story checkpoint before next priority

### Parallel Opportunities

- **Phase 1**: T001 and T002 parallel
- **US1**: T006 parallel with T007 once Phase 2 done
- **US2**: T009 parallel with T010 once T007–T008 done
- **US3**: T013 parallel with T014–T015 after US2
- **Polish**: T017 and T020 parallel

---

## Parallel Example: User Story 1

```bash
# After T003–T005 (Foundational), run in parallel:
Task T006: tests/unit/BookCard.test.tsx (content assertions)
Task T007: src/components/BookCard/BookCard.tsx (layout shell)
# Then T008: BookCard.module.css (depends on T007 structure)
```

---

## Parallel Example: User Story 3

```bash
# After US2 checkpoint:
Task T013: BookCard.test.tsx CSS audit
Task T014: BooksOverviewPage.tsx verification
Task T015: BooksOverviewPage.module.css grid tweak
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup  
2. Complete Phase 2: Foundational (**required**)  
3. Complete Phase 3: US1 (Default-state card + content tests)  
4. **STOP and VALIDATE**: `/books` cards match Figma Default layout  
5. Demo before adding navigation/hover (US2)

### Incremental Delivery

1. Setup + Foundational → tokens + `booksHu.viewBook` ready  
2. US1 → Default card on overview → test → demo (**MVP**)  
3. US2 → link + Hover + keyboard → navigation smoke  
4. US3 → grid + token audit → responsive smoke  
5. Polish → SC-001 visual review + full test suite

### Parallel Team Strategy

1. One developer: Foundational (T003–T005)  
2. After checkpoint:  
   - Dev A: US1 (T006–T008)  
   - Dev B: prep US2 tests (T009) once T007 lands  
3. US2 sequential on `BookCard.tsx` / `BookCard.module.css`  
4. US3 audits + grid in parallel (T013–T015)

---

## Notes

- Figma source: [BookCard `218:68`](https://www.figma.com/design/YR4A9Vf42an3qee8HaiwDx/SDD-Component-Library?node-id=218-68)
- **FR-010**: Never add hex/rgb/px literals to `BookCard.module.css` — `--book-card-*` tokens only
- Legacy `--color-surface` globals stay for non–book-card UI until a future rebrand
- Landing page featured teaser out of scope per spec Assumptions
- Code Connect deferred per spec Assumptions
- Navigation: whole-card `Link` with `aria-label` from `booksHu.viewBook` — no `Button` child
