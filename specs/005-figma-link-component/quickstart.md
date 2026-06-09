# Quickstart: Figma Link Component

**Feature**: `005-figma-link-component`  
**Status**: Implemented (27/27 tasks, 2026-06-09)

## Prerequisites

- Node.js 20+
- Feature branch `005-figma-link-component`
- Figma access to [Link page](https://www.figma.com/design/YR4A9Vf42an3qee8HaiwDx/SDD-Component-Library?node-id=64-2)

## Local development

```bash
npm install
npm run dev    # http://localhost:5173
npm test       # Vitest — Link + token tests after implementation
```

No new environment variables for this feature.

## Implementation smoke (after `/speckit-implement`)

### 1. Token spot-check

Open `src/styles/tokens/components.css` — confirm `--link-*` tokens exist, composing from `--sys-*` / `--font-*` per [contracts/design-tokens.md](./contracts/design-tokens.md).

### 2. State matrix (dev)

Inspect header navigation links:

| State | Trigger | Figma symbol |
|-------|---------|--------------|
| Default | Idle link on non-current page | `133:2` |
| Hover | Pointer over link | `133:4` |
| Active | Current route matches destination | `133:6` |

Compare side-by-side with Figma **Editorial / Dark** frame (`155:140`) and **Preview / Light / Desktop** (`137:4`).

### 3. Header migration (FR-006)

| Destination | Route | Active when |
|-------------|-------|-------------|
| Home | `/` | Landing only |
| Books | `/books` | Books list or `/books/:handle` |
| About | `/about` | About page |
| Contact | `/contact` | Contact page |
| Privacy | `/legal/privacy` | Privacy page |
| Terms | `/legal/terms` | Terms page |
| Cookies | `/legal/cookies` | Cookies page |

Confirm no ad-hoc `.link` / `.legalLink` color rules remain in `PrimaryNav.module.css`.

### 4. Keyboard

Tab through header links — visible focus ring (`--link-focus-ring-*`). Enter navigates; active link shows `aria-current="page"`.

### 5. Light + dark review

Toggle OS **light / dark** appearance (`prefers-color-scheme`). Re-check Default, Hover, and Active on header links against Figma Preview Light (`137:4`) and Preview Dark (`137:28`) frames.

### 6. Responsive layout (SC-004)

Resize the browser or use DevTools device mode. Confirm nav labels remain readable and the header does not overflow horizontally:

| Viewport | Check |
|----------|-------|
| 320px | Stacked nav; all EN/HU labels visible |
| 640px | Breakpoint transition; no overlapping links |
| 1440px | Horizontal nav row; legal group aligned |

Switch locale (EN/HU) and repeat at 320px and 1440px.

### 7. Token audit

```bash
npm test -- Link
npm test -- tokens
```

## Figma reference

- **Page**: Link (`64:2`)
- **Component set**: Link (`133:8`)
- **Symbols**: Default `133:2`, Hover `133:4`, Active `133:6`
- **Preview frames**: Light `137:4`, Dark `137:28`
