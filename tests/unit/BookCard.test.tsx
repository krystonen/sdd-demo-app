import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { BookCard } from "@/components/BookCard/BookCard";
import { booksHu } from "@/content/hu/books";
import type { Book } from "@/lib/types";

const bookCardCssPath = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../../src/components/BookCard/BookCard.module.css",
);

const baseBook: Book = {
  id: "test-1",
  handle: "test-handle",
  title: "Teszt könyv",
  author: "Teszt Szerző",
  description: "Leírás",
  coverImageUrl: "https://example.com/cover.jpg",
  format: "physical",
  variantId: "v1",
  price: { amount: "4990", currencyCode: "HUF" },
  available: true,
};

const renderBookCard = (book: Book): ReturnType<typeof render> =>
  render(
    <MemoryRouter>
      <BookCard book={book} />
    </MemoryRouter>,
  );

describe("BookCard", () => {
  it("renders title, format, and price", () => {
    renderBookCard(baseBook);

    expect(screen.getByRole("heading", { name: "Teszt könyv" })).toBeTruthy();
    expect(screen.getByText(booksHu.formatPhysical)).toBeTruthy();
    expect(screen.getByText("4990 HUF")).toBeTruthy();
  });

  it("renders author when present", () => {
    renderBookCard(baseBook);
    expect(screen.getByText("Teszt Szerző")).toBeTruthy();
  });

  it("omits author line when author is empty", () => {
    renderBookCard({ ...baseBook, author: "" });
    expect(screen.queryByText("Teszt Szerző")).toBeNull();
  });

  it("links to the book detail page", () => {
    renderBookCard(baseBook);
    const link = screen.getByRole("link", {
      name: `${booksHu.viewBook}: Teszt könyv`,
    });
    expect(link.getAttribute("href")).toBe("/books/test-handle");
  });

  it("BookCard.module.css uses design tokens only (SC-005)", () => {
    const css = readFileSync(bookCardCssPath, "utf8");
    expect(css).not.toMatch(/#[0-9a-fA-F]{3,8}/);
    expect(css).not.toMatch(/\brgb\(/);
    expect(css).not.toMatch(/\bhsl\(/);
    expect(css).toMatch(/var\(--book-card-/);
  });
});
