# Contract: Routes & Access Guards

**Router**: `react-router-dom` v7  
**Base**: `/` (Vercel SPA fallback to `index.html`)

## Routes

| Path | Page component | Bilingual | Age gate |
|------|----------------|-----------|----------|
| `/` | `LandingPage` | yes | no |
| `/about` | `AboutPage` | yes | no |
| `/contact` | `ContactPage` | yes | no |
| `/legal/privacy` | `LegalPage` (privacy) | yes | no |
| `/legal/terms` | `LegalPage` (terms) | yes | no |
| `/legal/cookies` | `LegalPage` (cookies) | yes | no |
| `/books` | `BooksOverviewPage` | no (HU) | yes |
| `/books/:handle` | `BookDetailPage` | no (HU) | yes |
| `*` | `NotFoundPage` | yes | no |

## Guards

### `AgeGateGuard`

- Wraps `/books` and `/books/:handle` route elements.
- If `!isAgeVerified()`: render `AgeGateModal` (blocking) OR redirect to `/` with modal—implementation choice; modal on current route preferred for deep links.
- Does not block bilingual routes.

### `LocaleProvider`

- Wraps app shell; reads/writes `bookstore_locale`.
- `LanguageSwitcher` only rendered when `route.meta.bilingual === true`.

## Navigation contract

Primary nav items (labels from locale bundle):

- Home → `/`
- Books → `/books` (triggers age gate if needed)
- About → `/about`
- Contact → `/contact`
- Legal → dropdown or footer links to `/legal/*`

All routes reachable without dead ends (SC-008).
