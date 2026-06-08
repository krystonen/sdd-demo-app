import { describe, expect, it } from "vitest";
import { hasContactErrors, validateContact } from "@/lib/contactValidation";

describe("contactValidation", () => {
  it("accepts valid payload", () => {
    const errors = validateContact({
      name: "Jane Doe",
      email: "jane@example.com",
      message: "Hello, I have a question about shipping.",
      locale: "en",
    });
    expect(hasContactErrors(errors)).toBe(false);
  });

  it("rejects short name", () => {
    const errors = validateContact({
      name: "J",
      email: "jane@example.com",
      message: "Hello world message here",
      locale: "en",
    });
    expect(errors.name).toBeDefined();
  });

  it("rejects invalid email", () => {
    const errors = validateContact({
      name: "Jane",
      email: "not-an-email",
      message: "Hello world message here",
      locale: "hu",
    });
    expect(errors.email).toBeDefined();
  });
});
