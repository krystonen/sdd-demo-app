# Contract: Link Component

**Spec**: FR-001–FR-010 | **Research**: R3, R4, R5 | **Figma**: [Link page `64:2`](https://www.figma.com/design/YR4A9Vf42an3qee8HaiwDx/SDD-Component-Library?node-id=64-2)

## Public API

```tsx
import type { ReactNode } from "react";

type LinkProps = {
  to: string;
  end?: boolean;
  className?: string;
  children: ReactNode;
};
```

**Export**: `Link` from `src/components/Link/Link.tsx`  
**Barrel**: `src/components/Link/index.ts`

## Visual contract

| State | Figma symbol | CSS application |
|-------|--------------|-----------------|
| Default | `133:2` | Base `.link` class |
| Hover | `133:4` | `:hover` |
| Active (current route) | `133:6` | `.active` from `NavLink` `isActive` |

**Typography**: Label size/weight from Figma symbols (~21px line box; map to nearest body/label token at implement).

**Styling rule**: `Link.module.css` references **only** `--link-*` tokens from [design-tokens.md](./design-tokens.md). No `#`, `rgb(`, or raw semantic px literals (SC-005 audit).

## Accessibility

| Requirement | Behavior |
|-------------|----------|
| Accessible name | Visible `children` text |
| Keyboard | Native anchor via `NavLink`; Enter activates |
| Focus | Visible `:focus-visible` ring via `--link-focus-ring-*` |
| Landmark | Parent `<nav aria-label="Main">` unchanged in `PrimaryNav` |
| Current page | Route-active link uses Active tokens; `NavLink` sets `aria-current` when active (`"page"` with `end`, otherwise `"true"`) — verified in `Link.test.tsx` |

## Consumer mapping (FR-006)

| Consumer | Destinations | Notes |
|----------|--------------|-------|
| `PrimaryNav` | Home, Books, About, Contact | Main row; see `end` flags in research R5 |
| `PrimaryNav` | Privacy, Terms, Cookies | Legal group; same `Link` component |

`PrimaryNav.module.css` retains layout only (flex, gap, responsive stack). Remove `.link` / `.legalLink` color/typography rules.

## Tests (Vitest)

- `Link.test.tsx`: renders anchor with `href`; active class when `MemoryRouter` initial entry matches; `end` prop respected for `/` vs `/books`; legal route active; active-link re-click keeps route (FR-005)
- Optional: CSS audit — `Link.module.css` has no hex color literals
- Extend `tokens.test.ts` after `--link-*` added (composition from foundations)

## Out of scope

- External URLs / `mailto:`
- Inline body copy links
- `SiteLayout` brand link
- Disabled link state (not in Figma)
- Code Connect (deferred)
