# Quickstart: Figma Button Component

**Feature**: `002-figma-button-component`  
**Status**: Implemented (28/28 tasks, 2026-06-09)

## Prerequisites

- Node.js 20+
- Feature branch `002-figma-button-component`
- Figma access to [Button page](https://www.figma.com/design/YR4A9Vf42an3qee8HaiwDx/SDD-Component-Library?node-id=21-2)

## Local development

```bash
npm install
npm run dev    # http://localhost:5173
npm test       # Vitest — Button component tests after implementation
```

No new environment variables for this feature.

## Implementation smoke (after `/speckit-implement`)

### 1. Token spot-check

Open `src/styles/tokens.css` — confirm `--button-*` tokens exist with values sourced from Figma symbols `25:2`–`25:18`.

### 2. Variant matrix (dev)

Navigate to a page or temporary dev route showing all variants:

| Variant | Default | Hover | Disabled |
|---------|---------|-------|----------|
| Primary | ✓ | ✓ | ✓ |
| Secondary | ✓ | ✓ | ✓ |
| Ghost | ✓ | ✓ | ✓ |

Compare side-by-side with Figma **Editorial / Dark** frame.

### 3. Migrated flows (FR-007)

| Flow | Action | Expected variant |
|------|--------|----------------|
| Age gate | Confirm / decline / retry | primary / secondary / primary |
| Contact | Submit form | primary; disabled while sending |
| Book detail | Buy / add to cart | primary |
| Shopify error banner | Retry | ghost |
| Language switcher | EN / HU toggle | ghost / primary |

### 4. Keyboard

Tab to each button — visible focus ring (`--button-focus-ring`). Enter/Space activates; disabled buttons do not submit twice on contact form.

### 5. Token audit

```bash
npm test -- Button
```

Pass CSS literal audit if implemented (see [contracts/design-tokens.md](./contracts/design-tokens.md)).

## Figma reference

- **Page**: Button (`21:2`)
- **Component set**: Button (`25:20`)
- **Preview frames**: Light / Dark desktop (`136:22`, `136:32`)
