import { useMemo, useState, type ReactElement, type ReactNode } from "react";
import { AgeGateModal } from "@/components/AgeGateModal/AgeGateModal";
import { ageGateEn } from "@/content/en/ageGate";
import { ageGateHu } from "@/content/hu/ageGate";
import { useAgeGate } from "@/hooks/useAgeGate";
import { detectBrowserLocale } from "@/lib/detectBrowserLocale";

type AgeGateGuardProps = {
  children: ReactNode;
};

type GateView = "prompt" | "declined";

export const AgeGateGuard = ({ children }: AgeGateGuardProps): ReactElement => {
  const { verified, confirmWithLocale } = useAgeGate();
  const [view, setView] = useState<GateView>("prompt");
  const gateLocale = useMemo(() => detectBrowserLocale(), []);
  const copy = gateLocale === "en" ? ageGateEn : ageGateHu;

  if (verified) return <>{children}</>;

  return (
    <AgeGateModal
      open
      view={view}
      copy={copy}
      onConfirm={() => confirmWithLocale(gateLocale)}
      onDecline={() => setView("declined")}
      onRetry={() => setView("prompt")}
    />
  );
};
