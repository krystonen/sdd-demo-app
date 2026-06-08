import { afterEach, describe, expect, it, vi } from "vitest";
import { detectBrowserLocale } from "@/lib/detectBrowserLocale";

describe("detectBrowserLocale", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns en for English browser locales", () => {
    vi.stubGlobal("navigator", { language: "en-US" });
    expect(detectBrowserLocale()).toBe("en");
  });

  it("returns hu for Hungarian browser locales", () => {
    vi.stubGlobal("navigator", { language: "hu-HU" });
    expect(detectBrowserLocale()).toBe("hu");
  });

  it("defaults to hu for other locales", () => {
    vi.stubGlobal("navigator", { language: "de-DE" });
    expect(detectBrowserLocale()).toBe("hu");
  });
});
