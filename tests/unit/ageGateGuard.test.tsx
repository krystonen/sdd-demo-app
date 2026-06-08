import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AgeGateGuard } from "@/routes/AgeGateGuard";

const mockUseAgeGate = vi.fn();

vi.mock("@/hooks/useAgeGate", () => ({
  useAgeGate: (): ReturnType<typeof mockUseAgeGate> => mockUseAgeGate(),
}));

vi.mock("@/lib/detectBrowserLocale", () => ({
  detectBrowserLocale: (): "hu" => "hu",
}));

describe("AgeGateGuard", () => {
  beforeEach(() => {
    mockUseAgeGate.mockReset();
  });

  it("shows age gate and hides children when not verified", () => {
    mockUseAgeGate.mockReturnValue({
      verified: false,
      confirmWithLocale: vi.fn(),
    });

    render(
      <AgeGateGuard>
        <div>Secret catalog</div>
      </AgeGateGuard>,
    );

    expect(screen.getByRole("dialog")).toBeTruthy();
    expect(screen.getByText("Elmúltál 18 éves?")).toBeTruthy();
    expect(screen.queryByText("Secret catalog")).toBeNull();
  });

  it("renders children when verified", () => {
    mockUseAgeGate.mockReturnValue({
      verified: true,
      confirmWithLocale: vi.fn(),
    });

    render(
      <AgeGateGuard>
        <div>Secret catalog</div>
      </AgeGateGuard>,
    );

    expect(screen.queryByRole("dialog")).toBeNull();
    expect(screen.getByText("Secret catalog")).toBeTruthy();
  });

  it("enters decline state with retry", () => {
    mockUseAgeGate.mockReturnValue({
      verified: false,
      confirmWithLocale: vi.fn(),
    });

    render(
      <AgeGateGuard>
        <div>Secret catalog</div>
      </AgeGateGuard>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Nem" }));
    expect(screen.getByText("Az oldalra csak 18 éven felüliek léphetnek be.")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Újrapróbálás" })).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Újrapróbálás" }));
    expect(screen.getByText("Elmúltál 18 éves?")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Igen" })).toBeTruthy();
  });
});
