# Research: Shopify Bookstore Website

**Feature**: `001-shopify-bookstore` | **Date**: 2026-06-02

## R1: Hosting & Shopify integration

**Decision**: Deploy on **Vercel**; catalog and checkout via **Shopify Storefront API** (GraphQL) from the React SPA using a public Storefront access token.

**Rationale**: Vercel matches the constitution default and pairs well with a Vite static build. Storefront API is Shopify’s supported headless path—no custom cart server, checkout redirects to Shopify-hosted checkout URLs. Works with static/edge deployment when all calls are browser-side to `*.myshopify.com`.

**Alternatives considered**:

| Alternative | Rejected because |
|-------------|------------------|
| Shopify Buy Button embed only | Poor fit for custom bilingual layout and Hungarian-only catalog UX |
| Custom Node cart backend | Violates static-first; adds ops without v1 need |
| Hydrogen full framework | Heavier than constitution YAGNI allows for a marketing + catalog site |

## R2: React toolchain & styling

**Decision**: **Vite 6** + **React 19** + **TypeScript**; **CSS Modules** for scoped component styles; **react-router-dom** for client routes.

**Rationale**: Matches constitution. CSS Modules ship with Vite, no extra styling framework. React Router handles bilingual vs Hungarian-only routes and age-gated route guards.

**Alternatives considered**: vanilla-extract (valid per constitution, deferred to keep v1 deps minimal); Next.js (SSR not required for static marketing site).

## R3: Internationalization

**Decision**: Lightweight **locale context** (`en` | `hu`) with **per-page content modules** (JSON/TS objects) for bilingual pages; book pages use Hungarian strings + Shopify product fields as-is.

**Rationale**: Spec splits bilingual generic pages vs Hungarian-only commerce pages—a full i18n library is optional overhead for two locales and fixed page set.

**Alternatives considered**: react-i18next (justified only if copy volume grows); separate URL prefixes `/en/` `/hu/` (deferred; switcher + `localStorage` sufficient for v1).

## R4: Age verification persistence

**Decision**: **localStorage** key `bookstore_age_verified` with ISO timestamp; **30-day** expiry; re-prompt after expiry or storage clear.

**Rationale**: Spec requires persistence across page views without accounts; sessionStorage alone would not survive tab close if user expects “remember me” behavior—30 days balances UX and reconfirmation.

**Alternatives considered**: session-only (too aggressive for returning shoppers); server session (no backend in v1).

## R5: Contact form delivery

**Decision**: **Vercel Serverless Function** at `/api/contact` forwarding to store owner email (e.g. Resend/SendGrid) OR **Formspree** if owner prefers zero-code email.

**Rationale**: Static SPA cannot send email alone. One minimal serverless endpoint on Vercel is the smallest custom backend; Formspree is the zero-code fallback documented in quickstart.

**Alternatives considered**: mailto-only (poor UX, no validation pipeline); full CRM integration (out of scope).

## R6: Product format (physical vs e-book)

**Decision**: Model formats as **Shopify product variants** (e.g. variant option `Format: Physical | E-book`) or separate variant SKUs; UI derives `physical` / `ebook` / `both` from variant availability.

**Rationale**: Keeps FR-011–FR-016 aligned with Shopify as source of truth; Vitest tests map raw Shopify nodes → `Book` view model.

## R7: Testing strategy

**Decision**: **Vitest** unit tests for `ageGate`, `locale`, `shopify/mapProduct`, `routeGuards`, `contactValidation`; manual browser smoke per user story; no E2E framework in v1 unless tasks add Playwright later.

**Rationale**: Constitution mandates Vitest for business logic; UI is mostly presentational with guarded routes.

## R8: Default locale

**Decision**: Default bilingual locale **`hu`** on first visit (per spec assumptions).

**Rationale**: Hungarian book catalog is primary commerce language; aligns with target market inference from spec.

## R9: Site-wide age gate (v2, 2026-06-08)

**Decision**: Mount **`AgeGateGuard`** once in **`App.tsx`**, wrapping **`RouterProvider`**, blocking all routes until `isAgeVerified()`. Remove per-route guards on `/books`.

**Rationale**: Spec FR-008 requires every route blocked before interactable content; single guard avoids bypass via `/`, `/about`, or deep links.

**Alternatives considered**:

| Alternative | Rejected because |
|-------------|------------------|
| Keep route-level guards only | Violates FR-008; generic pages remain reachable |
| Server middleware | No server in static SPA; constitution static-first |

## R10: Age-gate language (v2, 2026-06-08)

**Decision**: **`detectBrowserLocale()`** maps `navigator.language` → `en` | `hu` (default `hu` if neither). Gate copy from `src/content/{en,hu}/ageGate.ts`. **No switcher on modal.** On confirm, if `bookstore_locale` unset, persist detected locale (FR-008b).

**Rationale**: Clarification session 2026-06-08; matches reference overlay UX with localized strings without duplicating site switcher on gate.

**Alternatives considered**:

| Alternative | Rejected because |
|-------------|------------------|
| EN/HU switcher on modal | User chose browser auto-detect |
| Geolocation API | Privacy/heavier; browser locale sufficient for EN/HU |
| Always Hungarian gate | Fails bilingual gate requirement |

## R11: Decline and dismiss (v2, 2026-06-08)

**Decision**: Decline, **Escape**, and **overlay click** set UI state to **`declined`** (not persisted). Show localized decline message + **retry** button returning to confirm/decline prompt. No `Navigate` to `/` bypass.

**Rationale**: FR-009 full lockout with retry; mis-clicks recoverable without opening site content.
