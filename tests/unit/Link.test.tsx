import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MemoryRouter, useLocation } from "react-router-dom";
import type { ReactElement } from "react";
import { Link } from "@/components/Link";

const linkCssPath = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../../src/components/Link/Link.module.css",
);

const componentsCssPath = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../../src/styles/tokens/components.css",
);

describe("Link", () => {
  // Only one nav destination is active at a time; Books uses prefix match without `end`.
  it("renders anchor with href", () => {
    render(
      <MemoryRouter>
        <Link to="/books">Books</Link>
      </MemoryRouter>,
    );
    const anchor = screen.getByRole("link", { name: "Books" });
    expect(anchor.getAttribute("href")).toBe("/books");
  });

  it("applies active state when route matches", () => {
    render(
      <MemoryRouter initialEntries={["/books"]}>
        <Link to="/books">Books</Link>
      </MemoryRouter>,
    );
    const anchor = screen.getByRole("link", { name: "Books" });
    expect(anchor.getAttribute("aria-current")).toBeTruthy();
  });

  it("does not mark Home active on nested routes when end is set", () => {
    render(
      <MemoryRouter initialEntries={["/books"]}>
        <Link to="/" end>
          Home
        </Link>
      </MemoryRouter>,
    );
    const anchor = screen.getByRole("link", { name: "Home" });
    expect(anchor.getAttribute("aria-current")).toBeNull();
  });

  it("marks Home active only on exact / when end is set", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Link to="/" end>
          Home
        </Link>
      </MemoryRouter>,
    );
    const anchor = screen.getByRole("link", { name: "Home" });
    expect(anchor.getAttribute("aria-current")).toBe("page");
  });

  it("marks Books active on book detail path", () => {
    render(
      <MemoryRouter initialEntries={["/books/test-handle"]}>
        <Link to="/books">Books</Link>
      </MemoryRouter>,
    );
    const anchor = screen.getByRole("link", { name: "Books" });
    expect(anchor.getAttribute("aria-current")).toBeTruthy();
  });

  it("sets aria-current=page when route is active", () => {
    render(
      <MemoryRouter initialEntries={["/about"]}>
        <Link to="/about" end>
          About
        </Link>
      </MemoryRouter>,
    );
    const anchor = screen.getByRole("link", { name: "About" });
    expect(anchor.getAttribute("aria-current")).toBe("page");
  });

  it("marks Privacy active on legal privacy path (SC-006)", () => {
    render(
      <MemoryRouter initialEntries={["/legal/privacy"]}>
        <Link to="/legal/privacy" end>
          Privacy
        </Link>
      </MemoryRouter>,
    );
    const anchor = screen.getByRole("link", { name: "Privacy" });
    expect(anchor.getAttribute("aria-current")).toBe("page");
  });

  const PathProbe = (): ReactElement => {
    const { pathname } = useLocation();
    return <span data-testid="path">{pathname}</span>;
  };

  it("keeps current route when active link is clicked (FR-005)", () => {
    render(
      <MemoryRouter initialEntries={["/about"]}>
        <PathProbe />
        <Link to="/about" end>
          About
        </Link>
      </MemoryRouter>,
    );
    const anchor = screen.getByRole("link", { name: "About" });
    expect(anchor.getAttribute("aria-current")).toBe("page");
    fireEvent.click(anchor);
    expect(screen.getByTestId("path").textContent).toBe("/about");
    expect(anchor.getAttribute("aria-current")).toBe("page");
  });

  it("Link.module.css uses design tokens only (SC-005)", () => {
    const css = readFileSync(linkCssPath, "utf8");
    expect(css).not.toMatch(/#[0-9a-fA-F]{3,8}/);
    expect(css).not.toMatch(/\brgb\(/);
    expect(css).not.toMatch(/\bhsl\(/);
    expect(css).toMatch(/var\(--link-/);
  });

  it("components.css defines link tokens composing from foundations", () => {
    const css = readFileSync(componentsCssPath, "utf8");
    expect(css).toContain("--link-text-default:");
    expect(css).toContain("--link-text-hover:");
    expect(css).toContain("--link-text-active:");
    expect(css).toMatch(/--link-text-default:\s*var\(--sys-/);
    expect(css).toMatch(/--link-text-hover:\s*var\(--sys-/);
  });
});
