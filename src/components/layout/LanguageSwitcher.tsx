import type { ReactElement } from "react";
import { Button } from "@/components/Button";
import { useLocaleContext } from "@/context/LocaleContext";
import type { Locale } from "@/lib/types";
import styles from "./LanguageSwitcher.module.css";

export const LanguageSwitcher = (): ReactElement => {
  const { locale, setLocale, content } = useLocaleContext();

  const set = (l: Locale): void => setLocale(l);

  return (
    <div className={styles.switcher} role="group" aria-label={content.common.language}>
      <span className={styles.label}>{content.common.language}:</span>
      <Button
        variant={locale === "en" ? "primary" : "ghost"}
        onClick={() => set("en")}
        aria-pressed={locale === "en"}
      >
        EN
      </Button>
      <Button
        variant={locale === "hu" ? "primary" : "ghost"}
        onClick={() => set("hu")}
        aria-pressed={locale === "hu"}
      >
        HU
      </Button>
    </div>
  );
};
