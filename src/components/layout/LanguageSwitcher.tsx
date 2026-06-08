import type { ReactElement } from "react";
import { useLocaleContext } from "@/context/LocaleContext";
import type { Locale } from "@/lib/types";
import styles from "./LanguageSwitcher.module.css";

export const LanguageSwitcher = (): ReactElement => {
  const { locale, setLocale, content } = useLocaleContext();

  const set = (l: Locale): void => setLocale(l);

  return (
    <div className={styles.switcher} role="group" aria-label={content.common.language}>
      <span className={styles.label}>{content.common.language}:</span>
      <button
        type="button"
        className={locale === "en" ? styles.btnActive : styles.btn}
        onClick={() => set("en")}
        aria-pressed={locale === "en"}
      >
        EN
      </button>
      <button
        type="button"
        className={locale === "hu" ? styles.btnActive : styles.btn}
        onClick={() => set("hu")}
        aria-pressed={locale === "hu"}
      >
        HU
      </button>
    </div>
  );
};
