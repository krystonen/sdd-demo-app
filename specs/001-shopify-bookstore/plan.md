# Implementation Plan: Shopify Bookstore Website

**Branch**: `main` (feature `001-shopify-bookstore`) | **Date**: 2026-06-08 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-shopify-bookstore/spec.md`

## Summary

**v1 (shipped)**: React + Vite bilingual bookstore with route-scoped HU age gate on `/books` only.

**v2 (planned)**: **Site-wide** 18+ age gate on **every route** before any content is interactable. Gate copy in **EN or HU** via **browser locale** auto-detection (default HU). On confirm, **seed** `bookstore_locale` when none stored. **Decline**, **Escape**, and **outside-click** enter a blocked state with **retry**—no generic-page bypass.

Commerce, contact, and deployment model unchanged (Shopify Storefront API, Formspree, Vercel).

## Technical Context

**Language/Version**: TypeScript 5.x, React 19, Node 20+

**Primary Dependencies**: Vite, react-router-dom, Vitest; Storefront GraphQL via raw `fetch` in `src/lib/shopify/client.ts` (no `@shopify/storefront-api-client` in v1)

**Storage**: Browser `localStorage` (age verification, locale); Shopify (products, cart, checkout); static content modules in repo

**Testing**: Vitest for `ageGate`, `detectBrowserLocale`, `locale`, `mapProduct`, `contactValidation`, app-level `AgeGateGuard`; manual browser smoke per spec user stories

**Target Platform**: Modern browsers; production on Vercel (static SPA + optional serverless `/api/contact`)

**Project Type**: Single-page web application (static storefront)

**Performance Goals**: LCP < 2.5s on 4G for landing (manual check); catalog shows a loading indicator until Shopify responds (skeleton optional polish)

**Constraints**: No custom commerce backend; scoped CSS only; book pages Hungarian-only; **site-wide age gate**—no route bypass until confirmed (FR-008–FR-009)

**Scale/Scope**: ~8 page types, 2 locales for marketing/legal + gate copy, 1 Shopify collection, self-declared age verification

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Static-First Delivery | **Pass** | Vite static build; Shopify client-side; checkout redirect |
| II. Browser-Verifiable & Tested Logic | **Pass** | Vitest coverage planned for all `src/lib/*` business modules |
| III. Simplicity (YAGNI) | **Pass** | No i18n framework, no Hydrogen; see Complexity Tracking for contact API |

**Post-design re-check**: Pass — design artifacts align with approved stack.

## Project Structure

### Documentation (this feature)

```text
specs/001-shopify-bookstore/
├── plan.md              # This file
├── research.md          # Phase 0
├── data-model.md        # Phase 1
├── quickstart.md        # Phase 1
├── contracts/           # Phase 1
│   ├── shopify-storefront.md
│   ├── routes-and-guards.md
│   ├── age-gate.md
│   └── contact-api.md
└── tasks.md             # Phase 2 (/speckit-tasks)
```

### Source Code (repository root)

```text
index.html
package.json
vite.config.ts
vitest.config.ts
vercel.json
.env.example
api/
└── contact.ts              # Vercel serverless (optional if Formspree used)
src/
├── main.tsx
├── App.tsx
├── routes/
│   └── index.tsx
├── pages/
│   ├── LandingPage.tsx
│   ├── AboutPage.tsx
│   ├── ContactPage.tsx
│   ├── LegalPage.tsx
│   ├── BooksOverviewPage.tsx
│   ├── BookDetailPage.tsx
│   └── NotFoundPage.tsx
├── components/
│   ├── layout/
│   │   ├── SiteLayout.tsx
│   │   ├── SiteLayout.module.css
│   │   ├── PrimaryNav.tsx
│   │   └── LanguageSwitcher.tsx
│   ├── AgeGateModal/
│   ├── BookCard/
│   └── ...
├── content/
│   ├── en/
│   │   └── ageGate.ts
│   └── hu/
│       └── ageGate.ts
├── lib/
│   ├── ageGate.ts
│   ├── detectBrowserLocale.ts
│   ├── locale.ts
│   ├── contactValidation.ts
│   └── shopify/
│       ├── client.ts
│       ├── queries.ts
│       └── mapProduct.ts
├── hooks/
│   ├── useLocale.ts
│   ├── useAgeGate.ts
│   └── useBooks.ts
└── styles/
    ├── global.css          # reset + tokens only
    └── tokens.css
tests/
└── unit/
    ├── ageGate.test.ts
    ├── detectBrowserLocale.test.ts
    ├── locale.test.ts
    ├── mapProduct.test.ts
    └── contactValidation.test.ts
public/
└── favicon.svg
```

**Structure Decision**: Single Vite app at repo root. **v2**: `AgeGateGuard` wraps `RouterProvider` in `App.tsx` (global), not per `/books` route. Gate strings in `src/content/{en,hu}/ageGate.ts`; detection in `src/lib/detectBrowserLocale.ts`.

## Complexity Tracking

| Violation / exception | Why Needed | Simpler Alternative Rejected Because |
|----------------------|------------|-------------------------------------|
| Vercel serverless `/api/contact` | Static SPA cannot send email; spec requires form delivery | mailto-only fails FR-017/FR-018 UX; Formspree documented as zero-code alternative in quickstart |
| Raw `fetch` for Storefront GraphQL (not `@shopify/storefront-api-client`) | Implemented in `src/lib/shopify/client.ts`; fewer deps, sufficient for v1 | SDK adds typing but was not required for MVP |
| Formspree for contact (`VITE_CONTACT_FORM_ENDPOINT`) | Client-side POST; no mail provider keys on Vercel for v1 | Vercel `/api/contact` + Resend remains documented alternative |

No other constitution violations.

## Implementation Phases (for /speckit-tasks)

### Phase A — Scaffold

- Vite + React + TS + CSS Modules + react-router-dom + Vitest
- `vercel.json` SPA rewrite; `.env.example`
- Shell: `SiteLayout`, routes, placeholder pages

### Phase B — Cross-cutting (P1 stories)

- `ageGate.ts` + `AgeGateModal` + `AgeGateGuard`
- `locale.ts` + `LanguageSwitcher` + content bundles EN/HU
- Vitest for age + locale

### Phase C — Bilingual pages (P2–P7)

- Landing, About, Contact, Legal (privacy, terms, cookies)
- Contact validation + API/Formspree integration

### Phase D — Commerce (P3–P5)

- Shopify client, catalog + detail pages (HU)
- Buy CTA → cart → checkout URL
- Vitest for `mapProduct`

### Phase E — Polish

- Empty/error states, a11y for modal, responsive nav
- README + quickstart alignment

### Phase F — Age gate v2 (2026-06-08 spec change)

- `detectBrowserLocale.ts` + Vitest
- EN/HU `ageGate` content modules
- Refactor `AgeGateModal`: browser-locale copy, decline + retry UI, overlay/Escape → decline
- Move `AgeGateGuard` to `App.tsx` (site-wide); remove route-level guards
- `confirmAge` seeds `bookstore_locale` when absent (FR-008b)
- Update contracts, quickstart smoke, guard tests (SC-002 all routes)

## Artifacts Generated

| Artifact | Path |
|----------|------|
| Research | [research.md](./research.md) |
| Data model | [data-model.md](./data-model.md) |
| Contracts | [contracts/](./contracts/) |
| Quickstart | [quickstart.md](./quickstart.md) |
| Age gate contract | [contracts/age-gate.md](./contracts/age-gate.md) |

**Status**: v1 + v2 implemented (78/78 tasks). See [tasks.md](./tasks.md) and [quickstart.md](./quickstart.md).
