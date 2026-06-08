import { useState, type ReactElement, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { AgeGateModal } from "@/components/AgeGateModal/AgeGateModal";
import { useAgeGate } from "@/hooks/useAgeGate";

type AgeGateGuardProps = {
  children: ReactNode;
};

export const AgeGateGuard = ({ children }: AgeGateGuardProps): ReactElement => {
  const { verified, confirm } = useAgeGate();
  const [declined, setDeclined] = useState(false);

  if (verified) return <>{children}</>;

  if (declined) return <Navigate to="/" replace />;

  return (
    <>
      <AgeGateModal
        open
        onConfirm={confirm}
        onDecline={() => setDeclined(true)}
      />
      <div aria-hidden="true" style={{ visibility: "hidden" }}>
        {children}
      </div>
    </>
  );
};
