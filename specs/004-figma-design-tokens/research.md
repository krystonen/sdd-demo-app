# Research: Figma Foundational Design Tokens

**Feature**: `004-figma-design-tokens` | **Date**: 2026-06-09

## R1: Figma design source

**Decision**: Implement foundational tokens against the SDD Component Library **Foundations** pages:

| Page | Node | Scope |
|------|------|-------|
| [Foundations / Colors](https://www.figma.com/design/YR4A9Vf42an3qee8HaiwDx/SDD-Component-Library?node-id=13-4) | `13:4` | M3 semantic `sys/*` colors, Light + Dark modes |
| [Foundations / Typography](https://www.figma.com/design/YR4A9Vf42an3qee8HaiwDx/SDD-Component-Library?node-id=13-5) | `13:5` | Editorial type ramp + monospace specimens |
| [Foundations / Layout](https://www.figma.com/design/YR4A9Vf42an3qee8HaiwDx/SDD-Component-Library?node-id=13-6) | `13:6` | Spacing scale, radius, breakpoints |

**Rationale**: Spec FR-001/FR-002/FR-010 lock parity to these pages. Button (`002`) and BookCard (`003`) component tokens already mirror Figma component variables but embed raw hex — those values trace back to the same `sys/*` and `space/*` semantics documented on Foundations.

**Alternatives considered**:

| Alternative | Rejected because |
|-------------|------------------|
| Keep legacy bookstore greens (`--color-accent: #2d5016`) | Violates FR-001; unrelated to Figma M3 palette |
| Import third-party token package (Style Dictionary, Theo) | Constitution YAGNI; CSS custom properties sufficient for static Vite app |
| Sync tokens from external design-token npm package | No published package for this Figma file; manual MCP export is source of truth |

## R2: Token file architecture

**Decision**: Split `src/styles/tokens.css` into imported partials:

```text
src/styles/
├── tokens.css                 # @import chain (single entry from global.css)
└── tokens/
    ├── foundation.css         # sys/* colors (mode blocks), typography, spacing, radius, breakpoints
    ├── legacy-aliases.css     # deprecated --color-* / --space-* → foundation var()
    └── components.css         # --button-* / --book-card-* composing from foundation
```

**Rationale**: Foundation layer (~22 semantic colors × 2 modes + typography ramp) exceeds manageable single-file size; separation mirrors Figma Foundations → Components hierarchy (FR-006). `global.css` import path unchanged (`@import "./tokens.css"`).

**Alternatives considered**:

| Alternative | Rejected because |
|-------------|------------------|
| Monolithic tokens.css | Hard to audit; mixes three token tiers |
| Per-component token files only | Duplicates foundation values; fails FR-006 composition goal |

## R3: CSS naming convention (Figma → CSS)

**Decision**: Map Figma variable paths to kebab-case CSS custom properties with tier prefix:

| Figma path | CSS custom property |
|------------|---------------------|
| `sys/primary` | `--sys-primary` |
| `sys/onPrimary` | `--sys-on-primary` |
| `sys/surfaceContainerHigh` | `--sys-surface-container-high` |
| `space/md` | `--space-md` |
| `space/2xl` | `--space-2xl` |
| `radius/none` | `--radius-none` |
| `radius/md` | `--radius-md` |
| `typography/family/body` | `--font-family-body` |
| `typography/size/title/medium` | `--font-size-title-md` |

Typography composite styles from page `13:5` (e.g. display/large) use grouped tokens or utility classes documented in [contracts/foundational-design-tokens.md](./contracts/foundational-design-tokens.md).

**Rationale**: FR-002 requires 1:1 Figma mapping; slash paths become hyphens; `sys/` group uses `--sys-*` prefix to distinguish from legacy `--color-*` aliases.

**Alternatives considered**:

| Alternative | Rejected because |
|-------------|------------------|
| Keep `--color-primary` without `sys` prefix | Collides with legacy `--color-*` aliases during migration |
| Mirror Figma slashes literally (`--sys/primary`) | Invalid CSS custom property syntax |

## R4: Light / Dark mode implementation

**Decision**: Use **CSS `prefers-color-scheme`** only (no JS theme store, no `data-theme` toggle in v1):

```css
:root {
  /* Light mode defaults (FR-004 fallback) */
  --sys-primary: /* from Figma Light */;
  /* ... */
}

@media (prefers-color-scheme: dark) {
  :root {
    --sys-primary: /* from Figma Dark */;
    /* ... */
  }
}
```

Set `color-scheme: light dark` on `:root` in `foundation.css` so form controls and scrollbars respect mode.

**Rationale**: Spec Assumptions defer in-app theme picker; static-first (Constitution I); zero React state; component tokens using `var(--sys-*)` auto-track mode (FR-003, US2).

**Alternatives considered**:

| Alternative | Rejected because |
|-------------|------------------|
| React context + `data-theme` attribute | Adds state + flash on load; out of scope for v1 |
| Separate CSS files loaded by route | Breaks single token import; harder to compose component tokens |
| Dark mode via `filter: invert()` hack | Fails SC-004 contrast and brand fidelity |

## R5: Legacy token migration

**Decision**: Retain legacy names as **aliases** in `legacy-aliases.css` mapping to `--sys-*` / `--space-*` foundations (FR-005). Pages may keep existing `var(--color-bg)` references during migration; aliases ensure values align with Figma immediately.

| Legacy token | Foundation target |
|--------------|-------------------|
| `--color-bg` | `var(--sys-background)` |
| `--color-surface` | `var(--sys-surface)` |
| `--color-text` | `var(--sys-on-surface)` |
| `--color-text-muted` | `var(--sys-on-surface-variant)` *(or documented secondary text semantic)* |
| `--color-accent` | `var(--sys-accent)` |
| `--color-accent-hover` | `var(--sys-accent-container)` *(verify vs Figma accent hover usage)* |
| `--color-border` | `var(--sys-outline-variant)` |
| `--color-error` | `var(--sys-error)` |
| `--space-xs` … `--space-xl` | `var(--space-xs)` … `var(--space-xl)` *(rebased to 4/8/16/24/32 px)* |
| `--radius` | `var(--radius-md)` |
| `--font-sans` | `var(--font-family-body)` |
| `--shadow` | Documented extension or `none` until Figma elevation tokens added |

**Spacing note**: Current legacy `--space-md: 1rem` (16px at default root) coincidentally matches Figma `space/md` 16px, but `--space-lg: 1.5rem` (24px) and `--space-xl: 2rem` (32px) already align. `--space-xs/sm` use rem fractions — rebasing to explicit px tokens prevents root-font-size drift.

**Rationale**: FR-005 + spec Assumptions (one-release alias retention); minimizes page CSS churn in Phase C.

## R6: Component token composition

**Decision**: Refactor `--button-*` and `--book-card-*` in `components.css` to reference `--sys-*`, `--space-*`, `--font-*`, `--radius-*` via `var()` — **no raw hex** except transparent/none.

Example mappings (exact semantics verified at implement time against Figma component variable bindings):

| Component token | Composes from |
|-----------------|---------------|
| `--button-primary-bg-default` | `var(--sys-primary)` |
| `--button-primary-text-default` | `var(--sys-on-primary)` |
| `--button-ghost-border-default` | `var(--sys-accent)` |
| `--book-card-bg-default` | `var(--sys-surface-container)` |
| `--book-card-border-hover` | `var(--sys-accent)` |
| `--book-card-padding-x` | `var(--space-md)` |
| `--book-card-gap` | `var(--space-sm)` |
| `--book-card-title-font-size` | `var(--font-size-title-md)` |

Focus ring color: `var(--sys-primary-container)` or nearest accent semantic — document in component contract if no exact Figma match (spec edge case).

**Rationale**: FR-006, SC-006; changing `--sys-primary` Light value propagates to Button Primary without touching `--button-primary-bg-default` literal.

## R7: Typography & web fonts

**Decision**: Load Figma-specified families via **`@font-face` in `foundation.css`** or `<link>` in `index.html` only if families are confirmed web-licensed at implement time. Default stack:

```css
--font-family-body: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
--font-family-display: /* Figma display family + fallback */;
--font-family-mono: ui-monospace, "Cascadia Code", monospace;
```

Extract size/weight/line-height/letter-spacing from Typography page specimens (`8:2`, `131:4`) via Figma MCP at task time.

**Rationale**: Spec Assumptions allow fallback stacks; static Vite deploy compatible; no font loading library.

**Alternatives considered**:

| Alternative | Rejected because |
|-------------|------------------|
| `@fontsource` npm packages | Adds dependency; justify in Complexity Tracking only if needed |
| Skip typography tokens; keep `--font-sans` only | Fails FR-008 / SC-003 |

## R8: Testing & audit strategy

**Decision**:

- **Vitest**: Extend token literal audits — `tests/unit/tokens.test.ts` greps `src/**/*.module.css` for `#`, `rgb(`, `hsl(` outside comments; verify `components.css` uses `var(--sys-` / `var(--space-` for color/spacing (no hex).
- **Manual**: Light/Dark toggle via OS/browser devtools; compare Foundations swatches + typography specimens; WCAG spot-check on nav, catalog, detail, landing (SC-004).
- **Simulated propagation**: Change one `--sys-primary` Light value in dev; confirm Button + BookCard update without component literal edits (SC-006).

**Rationale**: Constitution II; styling features use visual gate + grep audits (pattern from `002`/`003`).

## R9: Breakpoints

**Decision**: Document as **CSS custom properties** in `foundation.css` for design alignment; **do not** refactor existing media queries in v1 unless a consumer needs them:

```css
--breakpoint-mobile: 375px;
--breakpoint-mobile-max: 640px;
--breakpoint-desktop: 1440px;
--content-max-width: 720px;
```

**Rationale**: Spec Assumptions — breakpoints documented, new responsive work out of scope unless required by spacing migration.

## R10: Value extraction workflow

**Decision**: At implementation (`/speckit-implement`), extract resolved Light/Dark hex values from Figma via MCP `get_metadata` / Dev Mode on Colors page swatch frames (`60:9` … `60:116`) and Typography specimens (`16:2`, `131:4`). Fill mapping tables in [contracts/foundational-design-tokens.md](./contracts/foundational-design-tokens.md).

**Rationale**: Plan phase locks architecture; exact hex values may shift in Figma — implementer refreshes table once per task batch.
