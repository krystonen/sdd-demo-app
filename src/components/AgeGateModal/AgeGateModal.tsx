import { useEffect, useRef, type ReactElement } from "react";
import styles from "./AgeGateModal.module.css";

type AgeGateModalProps = {
  open: boolean;
  onConfirm: () => void;
  onDecline: () => void;
};

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const getFocusableElements = (root: HTMLElement): HTMLElement[] =>
  Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE));

export const AgeGateModal = ({
  open,
  onConfirm,
  onDecline,
}: AgeGateModalProps): ReactElement | null => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const onConfirmRef = useRef(onConfirm);
  const onDeclineRef = useRef(onDecline);

  onConfirmRef.current = onConfirm;
  onDeclineRef.current = onDecline;

  useEffect(() => {
    if (!open) return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    confirmRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        event.preventDefault();
        onDeclineRef.current();
        return;
      }

      if (event.key !== "Tab") return;

      const dialog = dialogRef.current;
      if (!dialog) return;

      const focusable = getFocusableElements(dialog);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
      previousFocusRef.current?.focus();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className={styles.overlay}>
      <div
        ref={dialogRef}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="age-gate-title"
        aria-describedby="age-gate-desc"
      >
        <h2 id="age-gate-title" className={styles.title}>
          Korhatár-ellenőrzés
        </h2>
        <p id="age-gate-desc" className={styles.text}>
          A könyvek böngészéséhez és vásárlásához meg kell erősítened, hogy
          betöltötted a 18. életévedet.
        </p>
        <div className={styles.actions}>
          <button
            ref={confirmRef}
            type="button"
            className={styles.primary}
            onClick={() => onConfirmRef.current()}
          >
            Igen, 18 éves vagy idősebb vagyok
          </button>
          <button
            type="button"
            className={styles.secondary}
            onClick={() => onDeclineRef.current()}
          >
            Nem, 18 év alatti vagyok
          </button>
        </div>
      </div>
    </div>
  );
};
