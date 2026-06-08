# Contract: Routes & Access Guards

**Router**: `react-router-dom` v7  
**Base**: `/` (Vercel SPA fallback to `index.html`)

## Routes

| Path | Page component | Bilingual (after unlock) | Age gate |
|------|----------------|--------------------------|----------|
| `/` | `LandingPage` | yes | yes (site-wide) |
| `/about` | `AboutPage` | yes | yes |
| `/contact` | `ContactPage` | yes | yes |
| `/legal/privacy` | `LegalPage` (privacy) | yes | yes |
| `/legal/terms` | `LegalPage` (terms) | yes | yes |
| `/legal/cookies` | `LegalPage` (cookies) | yes | yes |
| `/books` | `BooksOverviewPage` | no (HU) | yes |
| `/books/:handle` | `BookDetailPage` | no (HU) | yes |
| `*` | `NotFoundPage` | yes | yes |

**v2**: Age gate is **not** per-route in `routes/index.tsx`; see [age-gate.md](./age-gate.md).

## Guards

### `AgeGateGuard` (site-wide)

- Wraps `RouterProvider` in `App.tsx`.
- If `!isAgeVerified()`: render `AgeGateModal` blocking all routes; see [age-gate.md](./age-gate.md).
- If verified: render children (full router).

### `LocaleProvider`

- Wraps app shell; reads/writes `bookstore_locale`.
- `LanguageSwitcher` only rendered when `route.meta.bilingual === true` **and** age verified.

### Content fallback

- Content modules live in `src/content/{en,hu}/`.
- Resolution order for a key in bundle `B`: `B[activeLocale][key]` → `B.hu[key]` → `"—"` (placeholder).
- Book commerce strings always use `src/content/hu/books.ts` regardless of marketing locale.

## Navigation contract

Primary nav items (labels from locale bundle)—**only after age confirm**:

- Home → `/`
- Books → `/books`
- About → `/about`
- Contact → `/contact`
- Legal → dropdown or footer links to `/legal/*`

All routes reachable without dead ends after unlock (SC-008).
