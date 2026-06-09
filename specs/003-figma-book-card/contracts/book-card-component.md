# Contract: BookCard Component

**Spec**: FR-001–FR-010 | **Research**: R3, R4 | **Figma**: [BookCard `218:68`](https://www.figma.com/design/YR4A9Vf42an3qee8HaiwDx/SDD-Component-Library?node-id=218-68)

## Public API

```tsx
import type { ReactElement } from "react";
import type { Book } from "@/lib/types";

type BookCardProps = {
  book: Book;
};

export const BookCard = ({ book }: BookCardProps): ReactElement => { ... };
```

**Export**: `BookCard` from `src/components/BookCard/BookCard.tsx`

## Visual contract

| State | Figma symbol | Reference size |
|-------|--------------|----------------|
| Default | `218:50` | 240 × 504 px |
| Hover | `218:59` | 240 × 504 px |

**Layout regions** (top → bottom):

| Region | Content | Rules |
|--------|---------|-------|
| Cover | `book.coverImageUrl` | Aspect ratio per Figma; `loading="lazy"`; `alt=""` decorative (title provides name) |
| Title | `book.title` | Heading element; primary typography tokens |
| Author | `booksHu.author`: `book.author` | Omit entire line when `author` is falsy |
| Format | `formatLabel(book.format)` | Hungarian via `booksHu` |
| Price | `{amount} {currencyCode}` | Meta typography tokens |
| Navigation label | `booksHu.viewBook` | Used in link `aria-label` only — not a visible button (Figma symbols have no separate control) |

**Styling rule**: `BookCard.module.css` references **only** `--book-card-*` tokens from [design-tokens.md](./design-tokens.md). No `#`, `rgb(`, or raw layout literals in module file (SC-005 audit).

## Interaction contract

| Requirement | Behavior |
|-------------|----------|
| Navigation | The card root is a `Link` to `/books/{book.handle}`; click, tap, or keyboard activation navigates to book detail |
| Card hover | `.card:hover` and `.card:focus-within` apply Hover tokens (`218:59`) |
| Accessible name | Book title exposed via heading; link `aria-label` is `` `${booksHu.viewBook}: ${book.title}` `` |
| Keyboard | Tab focuses the card link (single logical target); Enter activates navigation |
| Focus | Visible `:focus-visible` outline on `.card` using `--book-card-focus-ring-*` tokens; distinct from Default and Hover |

## Consumer mapping (FR-006)

| Consumer | Usage | Notes |
|----------|-------|-------|
| `BooksOverviewPage` | `<BookCard key={book.id} book={book} />` | Only in-scope consumer; grid in `BooksOverviewPage.module.css` |

## Composition

No child components. The card is a single React Router `Link` wrapping cover and body regions — no `Button` composition.

## Tests (Vitest)

- `BookCard.test.tsx`: renders title, format, price; `href` contains `book.handle`; author line absent when `author` is `""`
- Optional: CSS audit — `BookCard.module.css` has no hex color literals

## Out of scope

- Landing page featured-book teaser
- Disabled / unavailable book styling (no Figma symbol)
- Multiple card size variants
- Code Connect (deferred)
