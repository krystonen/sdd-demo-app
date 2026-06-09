import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const srcRoot = join(repoRoot, "src");
const tokenDir = join(srcRoot, "styles/tokens");

const TOKEN_FILES = [
  join(tokenDir, "foundation.css"),
  join(tokenDir, "legacy-aliases.css"),
  join(tokenDir, "components.css"),
  join(srcRoot, "styles/tokens.css"),
];

const HEX_PATTERN = /#[0-9a-fA-F]{3,8}/;
const RGB_PATTERN = /\brgb\(/;
const HSL_PATTERN = /\bhsl\(/;

function stripCssComments(css: string): string {
  return css.replace(/\/\*[\s\S]*?\*\//g, "");
}

function collectModuleCssFiles(dir: string): string[] {
  const entries = readdirSync(dir);
  const files: string[] = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      files.push(...collectModuleCssFiles(fullPath));
    } else if (entry.endsWith(".module.css")) {
      files.push(fullPath);
    }
  }
  return files;
}

describe("design tokens", () => {
  it("components.css composes from foundations without color literals (SC-005)", () => {
    const css = readFileSync(join(tokenDir, "components.css"), "utf8");
    const stripped = stripCssComments(css);
    expect(stripped).not.toMatch(HEX_PATTERN);
    expect(stripped).not.toMatch(RGB_PATTERN);
    expect(stripped).not.toMatch(HSL_PATTERN);
    expect(stripped).toMatch(/var\(--sys-/);
    expect(stripped).toMatch(/var\(--space-/);
  });

  it("legacy-aliases.css uses var() references only (FR-005)", () => {
    const css = readFileSync(join(tokenDir, "legacy-aliases.css"), "utf8");
    const stripped = stripCssComments(css);
    expect(stripped).not.toMatch(HEX_PATTERN);
    expect(stripped).not.toMatch(RGB_PATTERN);
    expect(stripped).not.toMatch(HSL_PATTERN);
  });

  it("module CSS files have no orphan color/spacing literals (FR-009)", () => {
    const moduleFiles = collectModuleCssFiles(srcRoot);
    for (const file of moduleFiles) {
      const css = stripCssComments(readFileSync(file, "utf8"));
      expect(css, file).not.toMatch(HEX_PATTERN);
      expect(css, file).not.toMatch(RGB_PATTERN);
      expect(css, file).not.toMatch(HSL_PATTERN);
    }
  });

  it("foundation.css defines Light and Dark sys tokens (FR-003)", () => {
    const css = readFileSync(join(tokenDir, "foundation.css"), "utf8");
    expect(css).toContain("--sys-primary:");
    expect(css).toContain("@media (prefers-color-scheme: dark)");
    expect(css).toContain("color-scheme: light dark");
  });

  it("spacing scale matches Figma Layout 4–64px (SC-002)", () => {
    const css = readFileSync(join(tokenDir, "foundation.css"), "utf8");
    expect(css).toContain("--space-xs: 4px");
    expect(css).toContain("--space-sm: 8px");
    expect(css).toContain("--space-md: 16px");
    expect(css).toContain("--space-lg: 24px");
    expect(css).toContain("--space-xl: 32px");
    expect(css).toContain("--space-2xl: 48px");
    expect(css).toContain("--space-3xl: 64px");
  });

  it("tokens.css imports token partials", () => {
    const css = readFileSync(join(srcRoot, "styles/tokens.css"), "utf8");
    expect(css).toContain('@import "./tokens/foundation.css"');
    expect(css).toContain('@import "./tokens/legacy-aliases.css"');
    expect(css).toContain('@import "./tokens/components.css"');
  });

  it("components.css defines --link-* tokens composing from foundations (SC-005)", () => {
    const css = readFileSync(join(tokenDir, "components.css"), "utf8");
    expect(css).toContain("--link-text-default:");
    expect(css).toContain("--link-text-hover:");
    expect(css).toContain("--link-text-active:");
    expect(css).toMatch(/--link-text-default:\s*var\(--sys-/);
    expect(css).toMatch(/--link-font-size:\s*var\(--font-/);
  });
});
