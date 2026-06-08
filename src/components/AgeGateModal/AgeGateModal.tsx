import { useEffect, useRef, type ReactElement } from "react";
import styles from "./AgeGateModal.module.css";

export type AgeGateCopy = {
  title: string;
  body: string;
  confirmLabel: string;
  declineLabel: string;
  declineMessage: string;
  retryLabel: string;
};
export type AgeGateView = "prompt" | "declined";

type AgeGateModalProps = {
  open: boolean;
  view: AgeGateView;
  copy: AgeGateCopy;
  onConfirm: () => void;
  onDecline: () => void;
  onRetry: () => void;
};

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const getFocusableElements = (root: HTMLElement): HTMLElement[] =>
  Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE));

export const AgeGateModal = ({
  open,
  view,
  copy,
  onConfirm,
  onDecline,
  onRetry,
}: AgeGateModalProps): ReactElement | null => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const primaryRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const onConfirmRef = useRef(onConfirm);
  const onDeclineRef = useRef(onDecline);
  const onRetryRef = useRef(onRetry);

  onConfirmRef.current = onConfirm;
  onDeclineRef.current = onDecline;
  onRetryRef.current = onRetry;

  useEffect(() => {
    if (!open) return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    primaryRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        event.preventDefault();
        if (view === "prompt") {
          onDeclineRef.current();
        }
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
  }, [open, view]);

  if (!open) return null;

  const handleOverlayClick = (): void => {
    if (view === "prompt") {
      onDeclineRef.current();
    }
  };

  return (
    <div
      className={styles.overlay}
      onClick={handleOverlayClick}
      data-testid="age-gate-overlay"
    >
      <div
        ref={dialogRef}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="age-gate-title"
        aria-describedby={view === "prompt" ? "age-gate-desc" : undefined}
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="age-gate-title" className={styles.title}>
          {view === "prompt" ? copy.title : copy.declineMessage}
        </h2>
        {view === "prompt" ? (
          <p id="age-gate-desc" className={styles.text}>
            {copy.body}
          </p>
        ) : null}
        <div className={styles.actions}>
          {view === "prompt" ? (
            <>
              <button
                ref={primaryRef}
                type="button"
                className={styles.primary}
                onClick={() => onConfirmRef.current()}
              >
                {copy.confirmLabel}
              </button>
              <button
                type="button"
                className={styles.secondary}
                onClick={() => onDeclineRef.current()}
              >
                {copy.declineLabel}
              </button>
            </>
          ) : (
            <button
              ref={primaryRef}
              type="button"
              className={styles.primary}
              onClick={() => onRetryRef.current()}
            >
              {copy.retryLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
