# Quickstart: Figma Foundational Design Tokens

**Feature**: `004-figma-design-tokens`  
**Status**: Implemented (24/24 tasks, 2026-06-09)

## Prerequisites

- Node.js 20+
- Feature branch `004-figma-design-tokens`
- Figma access to [Foundations pages](https://www.figma.com/design/YR4A9Vf42an3qee8HaiwDx/SDD-Component-Library?node-id=13-4) (Colors `13:4`, Typography `13:5`, Layout `13:6`)
- Prior features shipped: `002-figma-button-component`, `003-figma-book-card`

## Local development

```bash
npm install
npm run dev    # http://localhost:5173
npm test       # Vitest — includes token audits after implementation
```

No new environment variables.

## Implementation smoke (after `/speckit-implement`)

### 1. Token file structure

Confirm split layout:

```text
src/styles/tokens.css
src/styles/tokens/foundation.css
src/styles/tokens/legacy-aliases.css
src/styles/tokens/components.css
```

### 2. Foundation spot-check (Light mode)

Open `foundation.css` — every `--sys-*` token has a Light default value matching Figma Colors page swatches.

Spacing: `--space-xs` = `4px` … `--space-3xl` = `64px`.

Radius: `--radius-none` = `0`, `--radius-md` = `8px`.

### 3. Dark mode toggle

1. Open storefront in browser (`npm run dev`)
2. Enable dark mode in OS or browser devtools (Rendering → `prefers-color-scheme: dark`)
3. Verify background, surface, and text colors invert per Figma Dark bindings
4. Check nav, `/books` grid, book detail, landing — text remains readable (WCAG AA spot-check)

### 4. Legacy alias check

Pages using `--color-bg`, `--color-accent`, `--space-md` should visually shift to Figma-aligned palette without editing page CSS files.

### 5. Component propagation (SC-006)

1. Temporarily change `--sys-primary` Light value in `foundation.css`
2. Reload — Button Primary and any `sys-primary`-composed surfaces update
3. Revert change before commit

### 6. Token audits

```bash
npm test -- tokens
npm test -- Button
npm test -- BookCard
```

Pass: zero hex literals in `src/**/*.module.css` and composed `components.css`.

### 7. Visual parity matrix

| Surface | Light compare | Dark compare |
|---------|---------------|--------------|
| Global body | `sys/background`, `sys/onSurface` | Dark mode swatches |
| Site header | `sys/surface`, `sys/outlineVariant` | Dark swatches |
| Button Primary | Existing Figma symbols `25:2` | Dark matrix if published |
| BookCard Default | `218:50` | Dark card if published |
| Typography headings | Typography page specimens | Same tokens, dark on-surface colors |

## Figma reference

| Foundation | Node | URL |
|------------|------|-----|
| Colors | `13:4` | [Foundations / Colors](https://www.figma.com/design/YR4A9Vf42an3qee8HaiwDx/SDD-Component-Library?node-id=13-4) |
| Typography | `13:5` | [Foundations / Typography](https://www.figma.com/design/YR4A9Vf42an3qee8HaiwDx/SDD-Component-Library?node-id=13-5) |
| Layout | `13:6` | [Foundations / Layout](https://www.figma.com/design/YR4A9Vf42an3qee8HaiwDx/SDD-Component-Library?node-id=13-6) |

## Contracts

- [foundational-design-tokens.md](./contracts/foundational-design-tokens.md)
- [legacy-aliases.md](./contracts/legacy-aliases.md)
- [component-token-composition.md](./contracts/component-token-composition.md)
