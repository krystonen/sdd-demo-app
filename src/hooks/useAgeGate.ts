import { useCallback, useSyncExternalStore } from "react";
import {
  clearAgeVerification,
  confirmAge,
  isAgeVerified,
  readAgeVerification,
} from "@/lib/ageGate";

const subscribe = (onStoreChange: () => void): (() => void) => {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener("agegate-change", onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener("agegate-change", onStoreChange);
  };
};

const notify = (): void => {
  window.dispatchEvent(new Event("agegate-change"));
};

export const useAgeGate = (): {
  verified: boolean;
  confirm: () => void;
  clear: () => void;
} => {
  const verified = useSyncExternalStore(
    subscribe,
    isAgeVerified,
    () => false,
  );

  const confirm = useCallback(() => {
    confirmAge();
    notify();
  }, []);

  const clear = useCallback(() => {
    clearAgeVerification();
    notify();
  }, []);

  return { verified, confirm, clear };
};

export const useAgeVerificationRecord = () =>
  useSyncExternalStore(subscribe, readAgeVerification, () => null);
