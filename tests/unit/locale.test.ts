import { beforeEach, describe, expect, it } from "vitest";
import {
  DEFAULT_LOCALE,
  readLocale,
  toggleLocale,
  writeLocale,
} from "@/lib/locale";

describe("locale", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("defaults to Hungarian", () => {
    expect(readLocale()).toBe(DEFAULT_LOCALE);
    expect(DEFAULT_LOCALE).toBe("hu");
  });

  it("persists locale", () => {
    writeLocale("en");
    expect(readLocale()).toBe("en");
  });

  it("toggles locale", () => {
    writeLocale("hu");
    expect(toggleLocale("hu")).toBe("en");
    expect(readLocale()).toBe("en");
  });
});
