---
description: "Task list for Figma Button Component"
---

# Tasks: Figma Button Component

**Input**: Design documents from `/specs/002-figma-button-component/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Vitest for `Button` component per plan.md and constitution (presentational props + optional CSS token audit).

**Organization**: Tasks grouped by user story (spec.md P1–P3). Setup and Foundational phases block all stories.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no incomplete-task dependencies)
- **[Story]**: US1–US3 from spec.md

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare component folder and confirm Spec Kit feature context

- [X] T001 Create `src/components/Button/` directory with barrel file `src/components/Button/index.ts`
- [X] T002 Confirm `.specify/feature.json` points to `specs/002-figma-button-component` on branch `002-figma-button-component`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Figma design tokens and shared `Button` component — **blocks all user stories**

**⚠️ CRITICAL**: No user story migration until this phase is complete

- [X] T003 Extract resolved values from Figma symbols `25:2`–`25:18` and fill mapping table in `specs/002-figma-button-component/contracts/design-tokens.md`
- [X] T004 Add `--button-*` CSS custom properties to `src/styles/tokens.css` per `contracts/design-tokens.md` (FR-011)
- [X] T005 Implement `src/components/Button/Button.tsx` per `specs/002-figma-button-component/contracts/button-component.md` (named type imports from `"react"`)
- [X] T006 Implement `src/components/Button/Button.module.css` with primary, secondary, and ghost default/hover/disabled styles using **only** `var(--button-*)` tokens
- [X] T007 Export `Button` and `ButtonVariant` type from `src/components/Button/index.ts`

**Checkpoint**: Import `<Button variant="primary">` in dev; all three variants render with token-driven styles

---

## Phase 3: User Story 1 - Primary CTA (Priority: P1) 🎯 MVP

**Goal**: Shared primary button on main conversion actions (age confirm/retry, contact submit, buy)

**Independent Test**: Age-gate confirm uses Figma Primary Default styling; hover/disabled behave per spec; no ad-hoc primary CSS remains on migrated screens

### Tests for User Story 1

- [X] T008 [P] [US1] Write `tests/unit/Button.test.tsx` covering variant class names, `disabled`, and `type="submit"`

### Implementation for User Story 1

- [X] T009 [US1] Replace confirm and retry native buttons with `<Button variant="primary">` in `src/components/AgeGateModal/AgeGateModal.tsx`
- [X] T010 [US1] Remove `.primary` button rules from `src/components/AgeGateModal/AgeGateModal.module.css`
- [X] T011 [US1] Replace submit with `<Button variant="primary" type="submit" disabled={status === "sending"}>` in `src/pages/ContactPage.tsx`
- [X] T012 [US1] Remove `.submit` button rules from `src/pages/ContactPage.module.css`
- [X] T013 [US1] Replace buy CTA with `<Button variant="primary">` in `src/pages/BookDetailPage.tsx`
- [X] T014 [US1] Remove `.buy` button rules from `src/pages/BookDetailPage.module.css`

**Checkpoint**: Primary flows use `<Button>`; run `npm test -- Button`

---

## Phase 4: User Story 2 - Secondary and Ghost Variants (Priority: P2)

**Goal**: Visual hierarchy for decline, language toggle, and error retry via Secondary and Ghost

**Independent Test**: Age-gate shows primary confirm beside secondary decline; language switcher shows ghost inactive / primary active; error banner retry uses ghost

### Implementation for User Story 2

- [X] T015 [US2] Replace decline with `<Button variant="secondary">` in `src/components/AgeGateModal/AgeGateModal.tsx`
- [X] T016 [US2] Remove `.secondary` button rules from `src/components/AgeGateModal/AgeGateModal.module.css`
- [X] T017 [P] [US2] Replace EN/HU toggles with `<Button variant="ghost">` / `<Button variant="primary">` in `src/components/layout/LanguageSwitcher.tsx`
- [X] T018 [US2] Remove `.btn` and `.btnActive` rules from `src/components/layout/LanguageSwitcher.module.css`
- [X] T019 [US2] Replace retry with `<Button variant="ghost">` in `src/components/ShopifyErrorBanner/ShopifyErrorBanner.tsx`
- [X] T020 [US2] Remove `.retry` rules from `src/components/ShopifyErrorBanner/ShopifyErrorBanner.module.css`

**Checkpoint**: FR-007 consumers migrated; SC-002 satisfied (no ad-hoc `<button>` styling in scope)

---

## Phase 5: User Story 3 - Accessible Focus and Disabled States (Priority: P3)

**Goal**: Keyboard focus ring, Figma-accurate disabled appearance, legibility on light/dark surfaces

**Independent Test**: Tab through contact form and age gate; disabled submit during send; focus ring distinct from default/hover

### Tests for User Story 3

- [X] T021 [P] [US3] Add CSS literal audit to `tests/unit/Button.test.tsx` — assert `src/components/Button/Button.module.css` has no `#` or `rgb(` literals (SC-006)

### Implementation for User Story 3

- [X] T022 [US3] Implement `:focus-visible` outline using `--button-focus-ring` in `src/components/Button/Button.module.css`
- [X] T023 [US3] Verify disabled tokens for all variants match Figma `State=Disabled` symbols and block duplicate contact submit (SC-004)
- [X] T024 [US3] Manual keyboard and light/dark smoke per `specs/002-figma-button-component/quickstart.md` sections 3–4

**Checkpoint**: SC-003 and SC-004 pass on manual smoke; token audit test green

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Visual sign-off and repo hygiene

- [X] T025 [P] Run full `npm test` suite and resolve failures
- [X] T026 Side-by-side visual review: all 9 Figma states vs local dev against Editorial/Dark matrix (SC-001)
- [X] T027 Update implementation status in `specs/002-figma-button-component/plan.md` when feature ships
- [X] T028 [P] Check off completed tasks in this file (`specs/002-figma-button-component/tasks.md`)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup — **BLOCKS** US1–US3
- **User Stories (Phases 3–5)**: Depend on Foundational; execute P1 → P2 → P3 sequentially for clean checkpoints
- **Polish (Phase 6)**: Depends on Phases 3–5 complete

### User Story Dependencies

- **US1 (P1)**: After Phase 2 — no dependency on US2/US3
- **US2 (P2)**: After Phase 2 — uses same `Button` component; independent test via secondary/ghost consumers
- **US3 (P3)**: After Phase 2 — focus/disabled polish applies to completed component; manual smoke needs US1–US2 migrations

### Within Each User Story

- Tests before or alongside first migration in that story
- TSX migration before removing CSS in the same file pair
- Story checkpoint before next priority

### Parallel Opportunities

- **Phase 2**: T005 and T006 sequential (same feature); T003–T004 sequential
- **US1**: T008 parallel with T009 prep once T005–T007 done; T011–T014 touch different files — T011/T013 parallel after T009
- **US2**: T017 parallel with T019 (different files); T015 before T016 same file
- **US3**: T021 parallel with T022
- **Polish**: T025 and T028 parallel

---

## Parallel Example: User Story 2

```bash
# After T015–T016 (AgeGateModal), run in parallel:
Task T017: LanguageSwitcher.tsx + LanguageSwitcher.module.css
Task T019: ShopifyErrorBanner.tsx + ShopifyErrorBanner.module.css
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup  
2. Complete Phase 2: Foundational (**required**)  
3. Complete Phase 3: US1 (primary migrations + Button tests)  
4. **STOP and VALIDATE**: Age-gate confirm + contact submit match Figma Primary  
5. Demo before migrating secondary/ghost consumers

### Incremental Delivery

1. Setup + Foundational → `<Button>` ready with all variants  
2. US1 → primary CTAs migrated → test → demo (**MVP**)  
3. US2 → secondary/ghost consumers → test hierarchy  
4. US3 → focus/disabled audit → keyboard smoke  
5. Polish → SC-001 visual review + full test suite

### Parallel Team Strategy

1. One developer: Foundational (T003–T007)  
2. After checkpoint:  
   - Dev A: US1 migrations (T009–T014)  
   - Dev B: US2 migrations (T015–T020) after US1 AgeGate split or coordinate AgeGateModal file  
3. Dev C: US3 tests + focus styles (T021–T023) once Foundational done

---

## Notes

- Figma source: [Button page `21:2`](https://www.figma.com/design/YR4A9Vf42an3qee8HaiwDx/SDD-Component-Library?node-id=21-2)
- **FR-011**: Never add hex/rgb/px literals to `Button.module.css` — tokens only
- Legacy `--color-accent` globals stay for non-button UI until a future rebrand
- Code Connect deferred per spec Assumptions
