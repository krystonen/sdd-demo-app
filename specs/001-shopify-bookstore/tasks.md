---
description: "Task list for Shopify Bookstore Website"
---

# Tasks: Shopify Bookstore Website

**Input**: Design documents from `/specs/001-shopify-bookstore/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Vitest required per constitution for business logic in `src/lib/` and `tests/unit/`.

**Organization**: Tasks grouped by user story (spec.md priorities). Setup and Foundational phases block all stories.

## Implementation status (2026-06-04)

| Status | Count |
|--------|-------|
| Completed | 67 |
| Open | 0 |

**All tasks complete** (signed off 2026-06-04).

**Deviations (documented in `plan.md` Complexity Tracking)**: raw Storefront `fetch` (T001); `createBrowserRouter` (T009); `LocaleContext` (T025); modal in `AgeGateGuard` (T014); no `LegalPage.module.css` (T059); Formspree for contact (T056).

### Keeping Spec Kit in sync

When you change behavior, update artifacts in this order:

1. **spec.md** — requirements / status (if scope changes)
2. **plan.md** — stack or architecture
3. **tasks.md** — add or check off tasks
4. **quickstart.md** — env vars, smoke steps, troubleshooting
5. **contracts/** — API/integration contracts
6. **checklists/** — re-run `/speckit-checklist` if spec changes

Commands: `/speckit-analyze` (consistency), `/speckit-git-commit` (save artifacts).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no incomplete-task dependencies)
- **[Story]**: US1–US8 from spec.md

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize Vite + React project per plan.md

- [X] T001 Create `package.json` with React 19, Vite, TypeScript, react-router-dom, Vitest, `@shopify/storefront-api-client` in `/package.json`
- [X] T002 Add `vite.config.ts`, `tsconfig.json`, `vitest.config.ts` at repo root
- [X] T003 Add `index.html` and `src/main.tsx` entry point in `/src/main.tsx`
- [X] T004 Add `vercel.json` SPA rewrites and `.env.example` per `quickstart.md`
- [X] T005 [P] Add global tokens in `src/styles/tokens.css` and minimal reset in `src/styles/global.css`
- [X] T006 [P] Add npm scripts `dev`, `build`, `preview`, `test` in `package.json`
- [X] T007 Create `public/favicon.svg` and verify `npm run build` succeeds

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: App shell, routing, and layout—all user stories depend on this

**⚠️ CRITICAL**: No user story work until this phase is complete

- [X] T008 Create route table in `src/routes/index.tsx` per `contracts/routes-and-guards.md`
- [X] T009 Create `src/App.tsx` with `BrowserRouter` and route outlet
- [X] T010 Create `src/components/layout/SiteLayout.tsx` and `SiteLayout.module.css`
- [X] T011 Create `src/components/layout/PrimaryNav.tsx` and `PrimaryNav.module.css`
- [X] T012 Create placeholder pages: `src/pages/NotFoundPage.tsx` and stubs for all routes in `src/pages/`
- [X] T013 Wire `LocaleProvider` shell in `src/App.tsx` (implementation completed in US2)
- [X] T014 Mount global `AgeGateModal` host in `src/App.tsx` (logic completed in US1)
- [X] T015 Add route meta flags (`bilingual`, `ageGated`) in `src/routes/index.tsx`

**Checkpoint**: All routes resolve; layout renders; `npm run dev` shows nav skeleton

---

## Phase 3: User Story 1 - Age Verification (Priority: P1) 🎯 MVP gate

**Goal**: 18+ popup blocks `/books` routes until confirmed; persists 30 days

**Independent Test**: New visitor → modal on `/books` → accept → catalog accessible; decline → blocked; generic `/` still works

### Tests for User Story 1

- [X] T016 [P] [US1] Write `tests/unit/ageGate.test.ts` for confirm, decline, expiry, and storage clear

### Implementation for User Story 1

- [X] T017 [US1] Implement `src/lib/ageGate.ts` (read/write `bookstore_age_verified`, 30-day expiry)
- [X] T018 [P] [US1] Create `src/components/AgeGateModal/AgeGateModal.tsx` and `AgeGateModal.module.css` (HU copy, a11y focus trap)
- [X] T019 [US1] Create `src/hooks/useAgeGate.ts` wrapping `ageGate` helpers
- [X] T020 [US1] Implement `AgeGateGuard` wrapper in `src/routes/index.tsx` for `/books` and `/books/:handle`
- [X] T021 [US1] Add decline path: redirect or block content when unverified on gated routes
- [X] T022 [US1] Verify deep link to `/books/:handle` shows modal before content (manual smoke)

**Checkpoint**: US1 independent test passes; Vitest green for `ageGate`

---

## Phase 4: User Story 2 - Site Language on Generic Pages (Priority: P1)

**Goal**: EN/HU switcher on bilingual pages only; default `hu`; persisted locale

**Independent Test**: Landing EN↔HU switch; `/books` has no switcher

### Tests for User Story 2

- [X] T023 [P] [US2] Write `tests/unit/locale.test.ts` for default, persist, and read locale

### Implementation for User Story 2

- [X] T024 [US2] Implement `src/lib/locale.ts` (`en` | `hu`, `localStorage` key `bookstore_locale`)
- [X] T025 [US2] Implement `src/hooks/useLocale.ts` and `LocaleProvider` in `src/App.tsx`
- [X] T026 [P] [US2] Create content structure `src/content/en/common.ts` and `src/content/hu/common.ts` (nav labels)
- [X] T027 [P] [US2] Create `src/components/layout/LanguageSwitcher.tsx` and `LanguageSwitcher.module.css`
- [X] T028 [US2] Show `LanguageSwitcher` only when `route.meta.bilingual` in `SiteLayout.tsx`
- [X] T029 [US2] Add Hungarian-only UI string module `src/content/hu/books.ts` for commerce labels

**Checkpoint**: US2 independent test passes; book route hides switcher

---

## Phase 5: User Story 3 - Landing Page (Priority: P2)

**Goal**: Bilingual landing with value prop, nav, featured book path (after age gate)

**Independent Test**: `/` in EN and HU; link to books triggers age gate if needed

### Implementation for User Story 3

- [X] T030 [P] [US3] Add `src/content/en/landing.ts` and `src/content/hu/landing.ts`
- [X] T031 [US3] Implement `src/pages/LandingPage.tsx` and `LandingPage.module.css`
- [X] T032 [US3] Add featured book section linking to `/books` or `/books/:handle` in `LandingPage.tsx`
- [X] T033 [US3] Wire landing as `/` route in `src/routes/index.tsx`

**Checkpoint**: US3 smoke—landing bilingual, navigation to books respects age gate

---

## Phase 6: User Story 4 - Browse Catalog (Priority: P3)

**Goal**: Hungarian books overview from Shopify collection

**Independent Test**: After age confirm, `/books` lists titles, covers, formats, prices

### Tests for User Story 4

- [X] T034 [P] [US4] Write `tests/unit/mapProduct.test.ts` for variant→format mapping and `Book` view model
- [X] T035 [P] [US4] Add Shopify GraphQL fixtures in `tests/unit/fixtures/shopifyProduct.json`

### Implementation for User Story 4

- [X] T036 [US4] Implement `src/lib/shopify/client.ts` using env vars per `contracts/shopify-storefront.md`
- [X] T037 [US4] Implement `src/lib/shopify/queries.ts` (collection products query)
- [X] T038 [US4] Implement `src/lib/shopify/mapProduct.ts` per `data-model.md`
- [X] T039 [US4] Create `src/hooks/useBooks.ts` for catalog fetch and loading/error state
- [X] T040 [P] [US4] Create `src/components/BookCard/BookCard.tsx` and `BookCard.module.css`
- [X] T041 [US4] Implement `src/pages/BooksOverviewPage.tsx` and `BooksOverviewPage.module.css` (HU only)
- [X] T042 [US4] Add empty and error states on `BooksOverviewPage.tsx`

**Checkpoint**: US4 smoke—catalog loads from Shopify dev store

---

## Phase 7: User Story 5 - View and Purchase a Book (Priority: P4)

**Goal**: Hungarian detail page; buy physical/e-book → Shopify checkout

**Independent Test**: Detail shows full info; buy opens checkout URL for chosen format

### Implementation for User Story 5

- [X] T043 [US5] Extend `src/lib/shopify/queries.ts` with product-by-handle query
- [X] T044 [US5] Create `src/hooks/useBook.ts` for single product fetch in `src/hooks/useBook.ts`
- [X] T045 [US5] Implement `src/pages/BookDetailPage.tsx` and `BookDetailPage.module.css`
- [X] T046 [US5] Add format selector and buy CTAs in `BookDetailPage.tsx`
- [X] T047 [US5] Implement `src/lib/shopify/cart.ts` (`cartCreate` → `checkoutUrl` redirect)
- [X] T048 [US5] Handle unavailable variant (disabled CTA) in `BookDetailPage.tsx`

**Checkpoint**: US5 smoke—checkout opens for physical and e-book variants

---

## Phase 8: User Story 6 - About Page (Priority: P5)

**Goal**: Bilingual about content and navigation to books

**Independent Test**: `/about` EN/HU switch; link to books respects age gate

### Implementation for User Story 6

- [X] T049 [P] [US6] Add `src/content/en/about.ts` and `src/content/hu/about.ts`
- [X] T050 [US6] Implement `src/pages/AboutPage.tsx` and `AboutPage.module.css`
- [X] T051 [US6] Wire `/about` route in `src/routes/index.tsx`

**Checkpoint**: US6 smoke—about page bilingual

---

## Phase 9: User Story 7 - Contact Page (Priority: P6)

**Goal**: Bilingual contact form with validation and submission

**Independent Test**: Valid submit → confirmation in active locale; invalid → field errors

### Tests for User Story 7

- [X] T052 [P] [US7] Write `tests/unit/contactValidation.test.ts` per `contracts/contact-api.md`

### Implementation for User Story 7

- [X] T053 [US7] Implement `src/lib/contactValidation.ts` with localized error codes
- [X] T054 [P] [US7] Add `src/content/en/contact.ts` and `src/content/hu/contact.ts` (labels, messages)
- [X] T055 [US7] Implement `src/pages/ContactPage.tsx` and `ContactPage.module.css`
- [X] T056 [US7] Implement `api/contact.ts` Vercel handler OR client POST to `VITE_CONTACT_FORM_ENDPOINT`
- [X] T057 [US7] Wire form submit handler in `ContactPage.tsx` with loading and success states

**Checkpoint**: US7 smoke—contact form end-to-end (dev API or Formspree)

---

## Phase 10: User Story 8 - Legal Pages (Priority: P7)

**Goal**: Privacy, terms, cookies in EN/HU

**Independent Test**: Each `/legal/*` route readable in both languages

### Implementation for User Story 8

- [X] T058 [P] [US8] Add legal content modules in `src/content/en/legal.ts` and `src/content/hu/legal.ts`
- [X] T059 [US8] Implement `src/pages/LegalPage.tsx` and `LegalPage.module.css` (param: policy type)
- [X] T060 [US8] Wire `/legal/privacy`, `/legal/terms`, `/legal/cookies` in `src/routes/index.tsx`
- [X] T061 [US8] Add legal links to footer or nav in `PrimaryNav.tsx`

**Checkpoint**: US8 smoke—all legal pages bilingual

---

## Phase 11: Polish & Cross-Cutting Concerns

**Purpose**: Production readiness and quickstart alignment

- [X] T062 [P] Add responsive styles for nav and book grid in `SiteLayout.module.css` and `BooksOverviewPage.module.css`
- [X] T063 Improve `AgeGateModal` keyboard and screen-reader labels in `AgeGateModal.tsx`
- [X] T064 [P] Add Shopify unavailable banner component in `src/components/ShopifyErrorBanner/`
- [X] T065 Add root `README.md` pointing to `specs/001-shopify-bookstore/quickstart.md`
- [X] T066 Run full `quickstart.md` smoke checklist and fix gaps
- [X] T067 Run `npm test` and `npm run build` in CI-ready state (document in README)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)** → **Foundational (Phase 2)** → **US1 & US2 (Phases 3–4)** → **US3 (Phase 5)**
- **US4–US5 (Phases 6–7)** require US1 (age gate) + Shopify env; US4 before US5
- **US6–US8 (Phases 8–10)** require US2 (locale); can run in parallel after Phase 4
- **Polish (Phase 11)** after desired stories complete

### User Story Dependencies

| Story | Depends on | Blocks |
|-------|------------|--------|
| US1 | Phase 2 | US4, US5 |
| US2 | Phase 2 | US3, US6, US7, US8 |
| US3 | US2 | — |
| US4 | US1, US2 | US5 |
| US5 | US4 | — |
| US6 | US2 | — |
| US7 | US2 | — |
| US8 | US2 | — |

### Within Each User Story

- Vitest tests before or alongside lib implementation (constitution)
- `src/lib/*` before pages that consume hooks
- Pages before polish

### Parallel Opportunities

- T005, T006 after T004
- T016–T018 (US1 tests + lib + modal CSS) after T017 starts
- T023–T027 (US2) parallel content files
- T030–T031 (US3 content + page)
- T034–T035, T040 (US4 tests + BookCard)
- T049, T054, T058 (content modules across US6, US7, US8) after US2
- T062, T064 (polish) in parallel

---

## Parallel Example: User Story 4

```bash
# Tests + fixtures together:
tests/unit/mapProduct.test.ts
tests/unit/fixtures/shopifyProduct.json

# UI component while hooks are reviewed:
src/components/BookCard/BookCard.tsx
```

---

## Implementation Strategy

### MVP First (User Stories 1–3)

1. Complete Phase 1–2 (setup + shell)
2. Complete Phase 3–4 (age gate + locale)
3. Complete Phase 5 (landing)
4. **STOP and VALIDATE**: Age gate, language switch, landing smoke
5. Demo/deploy preview

### Incremental Delivery

1. Add US4–US5 → shop catalog and checkout (core revenue path)
2. Add US6–US8 → trust and legal pages
3. Polish → production deploy to Vercel

### Suggested MVP Scope

**US1 + US2 + US3** (Phases 1–5): Proves bilingual marketing site and age gate before Shopify integration.

**Commerce MVP**: Add **US4 + US5** (Phases 6–7).

---

## Notes

- **T056**: Done via Formspree when `VITE_CONTACT_FORM_ENDPOINT` uses the 8-char form ID (see `contracts/contact-api.md`).
- **T066**: Mark `[X]` after every row in `quickstart.md` §3 smoke table is checked.
- ISBN: not in v1; use Shopify variant barcode only if needed later
- Commit plan artifacts before implement if still untracked (`/speckit-git-commit`)
- Task count: **67** tasks | US1: 7 | US2: 7 | US3: 4 | US4: 9 | US5: 6 | US6: 3 | US7: 6 | US8: 4 | Setup: 7 | Foundational: 8 | Polish: 6
