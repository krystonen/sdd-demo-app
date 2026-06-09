# Contract: Button Component

**Spec**: FR-001–FR-011 | **Research**: R3, R4 | **Figma**: [Button page `21:2`](https://www.figma.com/design/YR4A9Vf42an3qee8HaiwDx/SDD-Component-Library?node-id=21-2)

## Public API

```tsx
import type { ButtonHTMLAttributes, MouseEventHandler, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = {
  variant?: ButtonVariant;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
} & Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "className" | "type" | "disabled" | "onClick" | "children"
>;
```

**Export**: `Button` from `src/components/Button/Button.tsx`

## Visual contract

| `variant` | Figma Style | Default symbol | Hover symbol | Disabled symbol |
|-----------|-------------|----------------|--------------|-----------------|
| `primary` | Primary | `25:2` | `25:4` | `25:6` |
| `secondary` | Secondary | `25:8` | `25:10` | `25:12` |
| `ghost` | Ghost | `25:14` | `25:16` | `25:18` |

**Dimensions**: 34px height, horizontal padding and typography from Figma symbols (FR-009).

**Styling rule**: `Button.module.css` references **only** `--button-*` tokens from [design-tokens.md](./design-tokens.md). No `#`, `rgb(`, or raw `px` literals in module file (SC-006 audit).

## Accessibility

| Requirement | Behavior |
|-------------|----------|
| Accessible name | `children` text or `aria-label` when provided |
| Keyboard | Native `<button>`; Enter/Space activate |
| Focus | Visible `:focus-visible` ring via `--button-focus-ring` |
| Disabled | `disabled` attribute; no `onClick` when disabled |

## Consumer mapping (FR-007)

| Consumer | `variant` | `type` | Notes |
|----------|-----------|--------|-------|
| `AgeGateModal` confirm | `primary` | `button` | |
| `AgeGateModal` decline | `secondary` | `button` | |
| `AgeGateModal` retry | `primary` | `button` | |
| `ContactPage` submit | `primary` | `submit` | `disabled={status === "sending"}` |
| `BookDetailPage` buy CTA | `primary` | `button` | |
| `ShopifyErrorBanner` retry | `ghost` | `button` | Confirm against Preview frames |
| `LanguageSwitcher` inactive locale | `ghost` | `button` | |
| `LanguageSwitcher` active locale | `primary` | `button` | |

## Tests (Vitest)

- `Button.test.tsx`: renders each variant class; `disabled` prevents attribute omission; `type="submit"` preserved
- Optional: CSS audit test — `Button.module.css` has no hex color literals

## Out of scope

- Icon-only buttons
- `as="a"` / link variant
- Size variants beyond Figma default
- Code Connect (deferred)
