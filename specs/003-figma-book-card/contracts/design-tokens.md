# Contract: BookCard Design Tokens

**Spec**: FR-010, SC-005 | **Research**: R2 | **Figma file**: `YR4A9Vf42an3qee8HaiwDx`

## Rule

All BookCard visual properties MUST use CSS custom properties defined in `src/styles/tokens.css`. **Implementer action**: populate values by inspecting Figma symbols `218:50` (Default) and `218:59` (Hover) and bound Figma variables on the BookCard component.

## Naming convention

```text
--book-card-{property}-{state}
--book-card-width              # shared layout (240px from Figma)
--book-card-padding-*          # shared inner spacing
--book-card-gap-*              # vertical rhythm between regions
--book-card-image-aspect-ratio # cover region
--book-card-font-*             # title / meta / format typography
--book-card-radius             # card corner radius
--book-card-image-radius       # cover inset radius
--book-card-shadow-default     # elevation Default
--book-card-shadow-hover       # elevation Hover (if distinct)
--book-card-focus-ring-*       # shared focus (no Figma symbol)
```

States: `default`, `hover` (suffix omitted for shared layout tokens).

## Required token groups (minimum)

Populate exact values during implementation from Figma Dev Mode / MCP export.

### Surface

| Token | Property |
|-------|----------|
| `--book-card-bg-default` | Card background Default |
| `--book-card-bg-hover` | Card background Hover |
| `--book-card-border-default` | Border Default (if any) |
| `--book-card-border-hover` | Border Hover (if any) |

### Typography

| Token | Property |
|-------|----------|
| `--book-card-title-color-default` | Title Default |
| `--book-card-title-color-hover` | Title Hover (if distinct) |
| `--book-card-title-font-size` | Title size |
| `--book-card-title-font-weight` | Title weight |
| `--book-card-meta-color-default` | Author / price Default |
| `--book-card-meta-color-hover` | Author / price Hover |
| `--book-card-meta-font-size` | Meta size |
| `--book-card-format-color-default` | Format label Default |
| `--book-card-format-font-weight` | Format emphasis |

### Layout & chrome

| Token | Property |
|-------|----------|
| `--book-card-width` | Reference width 240px |
| `--book-card-padding-x` | Horizontal padding |
| `--book-card-padding-y` | Vertical padding |
| `--book-card-gap` | Stack gap between regions |
| `--book-card-radius` | Card radius |
| `--book-card-image-radius` | Cover image radius |
| `--book-card-shadow-default` | Box shadow Default |
| `--book-card-shadow-hover` | Box shadow Hover |

### Focus (no Figma symbol)

| Token | Property |
|-------|----------|
| `--book-card-focus-ring-width` | Focus outline width |
| `--book-card-focus-ring-offset` | Focus outline offset |
| `--book-card-focus-ring-color` | Focus outline color |

## Figma ↔ CSS mapping table (fill at implement)

| Figma symbol | CSS token | Resolved value |
|--------------|-----------|----------------|
| `218:50` Default card fill | `--book-card-bg-default` | `#eaf4f6` |
| `218:59` Hover card fill | `--book-card-bg-hover` | `#eaf4f6` |
| `218:50` Default card border | `--book-card-border-default` | `#c5d8dc` |
| `218:59` Hover card border | `--book-card-border-hover` | `#d4a373` |
| `218:50` Cover placeholder | `--book-card-cover-bg` | `#b0b0b0` |
| `218:59` Cover border hover | `--book-card-cover-border-hover` | `#d4a373` |
| `218:50` Default shadow | `--book-card-shadow-default` | `none` |
| `218:59` Hover shadow | `--book-card-shadow-hover` | `none` |
| `218:50` Title text | `--book-card-title-color-default` | `#1a1a1a` |
| `218:50` Meta text | `--book-card-meta-color-default` | `#5c5c5c` |
| `218:50` Format badge fill | `--book-card-format-bg-default` | `#f5ebe0` |
| `218:50` Format badge border | `--book-card-format-border-default` | `#d4a373` |
| `218:50` Format text | `--book-card-format-color-default` | `#5c4033` |
| `218:50` Card radius | `--book-card-radius` | `0` |
| `218:50` Image radius | `--book-card-image-radius` | `0` |
| Shared layout | `--book-card-width`, `--book-card-min-height`, padding, gap | `240px`, `504px`, `16px`, `8px` |
| Shared focus | `--book-card-focus-ring-color` | `#9eeffd` (matches `--button-focus-ring-color`) |

## Audit (SC-005)

Before feature complete:

1. Grep `BookCard.module.css` for `#`, `rgb`, `hsl` — expect **zero** matches (except inside comments).
2. Every `var(--book-card-` reference must resolve to a token declared in `tokens.css`.
3. Visual review: Default + Hover Figma symbols vs. rendered card on books overview.

## Legacy tokens

Do **not** reference `--color-surface`, `--shadow`, or rem-hardcoded font sizes from `BookCard.module.css` after migration — use `--book-card-*` only. Global legacy tokens remain for other pages.

## CTA tokens

The View Book CTA uses **`--button-*`** tokens via the shared `Button` component — not duplicated in `--book-card-*`.
