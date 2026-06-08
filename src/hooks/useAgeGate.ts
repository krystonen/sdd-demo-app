import { useCallback, useSyncExternalStore } from "react";
import {
  clearAgeVerification,
  confirmAge,
  confirmAgeWithLocale,
  isAgeVerified,
  readAgeVerification,
} from "@/lib/ageGate";
import type { Locale } from "@/lib/types";

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
  confirmWithLocale: (locale: Locale) => void;
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

  const confirmWithLocale = useCallback((locale: Locale) => {
    confirmAgeWithLocale(locale);
    notify();
  }, []);

  const clear = useCallback(() => {
    clearAgeVerification();
    notify();
  }, []);

  return { verified, confirm, confirmWithLocale, clear };
};

export const useAgeVerificationRecord = () =>
  useSyncExternalStore(subscribe, readAgeVerification, () => null);
