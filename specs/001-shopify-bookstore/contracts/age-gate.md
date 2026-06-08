# Contract: Site-Wide Age Gate (v2)

**Spec**: FR-008, FR-008a, FR-008b, FR-009 | **Research**: R9–R11

## Placement

```text
LocaleProvider
  └── AgeGateGuard          ← wraps entire router (App.tsx)
        └── RouterProvider
              └── SiteLayout / pages
```

Do **not** mount `AgeGateGuard` on individual `/books` routes in v2.

## Gate language

| Input | Output |
|-------|--------|
| `navigator.language` starts with `en` | Gate copy from `content/en/ageGate.ts` |
| `navigator.language` starts with `hu` | Gate copy from `content/hu/ageGate.ts` |
| Any other value | Hungarian copy (default) |

No EN/HU switcher on the modal.

## User actions

| Action | Result |
|--------|--------|
| Confirm | Write `bookstore_age_verified`; if `bookstore_locale` missing, write detected gate locale; close gate; render app |
| Decline button | UI → `declined` state; show `declineMessage` + `retryLabel` |
| Escape | Same as decline |
| Click overlay (outside dialog) | Same as decline |
| Retry | UI → `prompt` state; show confirm/decline again |

## Blocked rendering

When `!isAgeVerified()`:

- Do not render route outlet content (or render inert/hidden behind overlay).
- Do not allow primary nav interaction.
- Declined state: no route content; only decline message + retry.

## Persistence

| Key | On confirm | On decline |
|-----|------------|------------|
| `bookstore_age_verified` | JSON record, 30-day expiry | Unchanged |
| `bookstore_locale` | Set to gate locale if absent | Unchanged |

## Accessibility

- `role="dialog"`, `aria-modal="true"`, labelled title + description
- Focus trap in prompt and declined states
- Escape triggers decline path (not silent close)

## Tests (Vitest)

- `detectBrowserLocale.test.ts` — en, hu, fallback
- `ageGate.test.ts` — confirm seeds locale when unset; unchanged when set
- `AgeGateGuard.test.tsx` — blocks outlet; decline + retry; verified passes through
