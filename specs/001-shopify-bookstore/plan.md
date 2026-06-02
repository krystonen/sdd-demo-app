# Implementation Plan: Shopify Bookstore Website

**Branch**: `001-shopify-bookstore` | **Date**: 2026-06-02 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-shopify-bookstore/spec.md`

## Summary

Build a **React + Vite** bilingual bookstore marketing site with **Hungarian-only** catalog/detail pages, **18+ age gate**, and **Shopify Storefront API** for products and checkout. Deploy to **Vercel** with **CSS Modules**, **Vitest** for business logic, and a minimal **contact API** (Vercel function or Formspree).

## Technical Context

**Language/Version**: TypeScript 5.x, React 19, Node 20+

**Primary Dependencies**: Vite, react-router-dom, `@shopify/storefront-api-client` (or lightweight GraphQL fetch), Vitest, @testing-library/react (optional for hooks)

**Storage**: Browser `localStorage` (age verification, locale); Shopify (products, cart, checkout); static content modules in repo

**Testing**: Vitest unit tests for `ageGate`, `locale`, `mapProduct`, `contactValidation`, route guard helpers; manual browser smoke per spec user stories

**Target Platform**: Modern browsers; production on Vercel (static SPA + optional serverless `/api/contact`)

**Project Type**: Single-page web application (static storefront)

**Performance Goals**: LCP < 2.5s on 4G for landing; catalog query < 1s perceived with loading skeleton

**Constraints**: No custom commerce backend; scoped CSS only; book pages Hungarian-only; age gate cannot be bypassed on `/books` routes

**Scale/Scope**: ~8 page types, 2 locales for marketing/legal, 1 Shopify collection, self-declared age verification

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
│   └── hu/
├── lib/
│   ├── ageGate.ts
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
    ├── locale.test.ts
    ├── mapProduct.test.ts
    └── contactValidation.test.ts
public/
└── favicon.svg
```

**Structure Decision**: Single Vite app at repo root (no monorepo). Commerce logic isolated under `src/lib/shopify/` for Vitest. Bilingual copy in `src/content/{en,hu}/`. Route guards in `src/routes/` per `contracts/routes-and-guards.md`.

## Complexity Tracking

| Violation / exception | Why Needed | Simpler Alternative Rejected Because |
|----------------------|------------|-------------------------------------|
| Vercel serverless `/api/contact` | Static SPA cannot send email; spec requires form delivery | mailto-only fails FR-017/FR-018 UX; Formspree documented as zero-code alternative in quickstart |
| `@shopify/storefront-api-client` | Typed Storefront GraphQL + cart mutations | Raw fetch works but more error-prone; still minimal vs Hydrogen |

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

## Artifacts Generated

| Artifact | Path |
|----------|------|
| Research | [research.md](./research.md) |
| Data model | [data-model.md](./data-model.md) |
| Contracts | [contracts/](./contracts/) |
| Quickstart | [quickstart.md](./quickstart.md) |

**Next command**: `/speckit-tasks` to generate `tasks.md` from this plan and the spec user stories.
