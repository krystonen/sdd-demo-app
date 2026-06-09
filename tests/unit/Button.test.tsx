import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button, type ButtonVariant } from "@/components/Button";

const buttonCssPath = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../../src/components/Button/Button.module.css",
);

describe("Button", () => {
  it.each<ButtonVariant>(["primary", "secondary", "ghost"])(
    "renders %s variant",
    (variant) => {
      render(<Button variant={variant}>Label</Button>);
      const button = screen.getByRole("button", { name: "Label" });
      expect(button.getAttribute("data-variant")).toBe(variant);
    },
  );

  it("sets disabled attribute when disabled", () => {
    render(
      <Button variant="primary" disabled>
        Label
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Label" }) as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });

  it("preserves submit type", () => {
    render(
      <Button variant="primary" type="submit">
        Send
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Send" }) as HTMLButtonElement;
    expect(button.type).toBe("submit");
  });

  it("Button.module.css uses design tokens only (SC-006)", () => {
    const css = readFileSync(buttonCssPath, "utf8");
    expect(css).not.toMatch(/#[0-9a-fA-F]{3,8}/);
    expect(css).not.toMatch(/\brgb\(/);
    expect(css).not.toMatch(/\bhsl\(/);
    expect(css).toMatch(/var\(--button-/);
  });
});
