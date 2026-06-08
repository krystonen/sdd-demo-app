import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  clearAgeVerification,
  confirmAge,
  createAgeVerificationRecord,
  isAgeVerified,
  readAgeVerification,
} from "@/lib/ageGate";

describe("ageGate", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns false when not confirmed", () => {
    expect(isAgeVerified()).toBe(false);
  });

  it("confirms and reads verification", () => {
    confirmAge();
    expect(isAgeVerified()).toBe(true);
    expect(readAgeVerification()?.confirmed).toBe(true);
  });

  it("expires after 30 days", () => {
    const now = new Date("2026-01-01T12:00:00Z");
    vi.setSystemTime(now);
    confirmAge();
    vi.setSystemTime(new Date("2026-02-01T12:00:01Z"));
    expect(isAgeVerified()).toBe(false);
  });

  it("clears verification", () => {
    confirmAge();
    clearAgeVerification();
    expect(isAgeVerified()).toBe(false);
  });

  it("creates record with expiry", () => {
    vi.setSystemTime(new Date("2026-06-01T00:00:00Z"));
    const record = createAgeVerificationRecord();
    expect(record.confirmed).toBe(true);
    expect(new Date(record.expiresAt).getTime()).toBeGreaterThan(
      new Date(record.confirmedAt).getTime(),
    );
  });
});
