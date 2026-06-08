import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { commonEn } from "@/content/en/common";
import { aboutEn } from "@/content/en/about";
import { contactEn } from "@/content/en/contact";
import { landingEn } from "@/content/en/landing";
import { legalEn } from "@/content/en/legal";
import { commonHu } from "@/content/hu/common";
import { aboutHu } from "@/content/hu/about";
import { contactHu } from "@/content/hu/contact";
import { landingHu } from "@/content/hu/landing";
import { legalHu } from "@/content/hu/legal";
import { booksHu } from "@/content/hu/books";
import { LOCALE_CHANGE_EVENT, readLocale, toggleLocale as toggleStored, writeLocale } from "@/lib/locale";
import type { Locale } from "@/lib/types";

type LocaleContent = {
  common: typeof commonEn;
  landing: typeof landingEn;
  about: typeof aboutEn;
  contact: typeof contactEn;
  legal: typeof legalEn;
  books: typeof booksHu;
};

const enContent: LocaleContent = {
  common: commonEn,
  landing: landingEn,
  about: aboutEn,
  contact: contactEn,
  legal: legalEn,
  books: booksHu,
};

const huContent: LocaleContent = {
  common: commonHu,
  landing: landingHu,
  about: aboutHu,
  contact: contactHu,
  legal: legalHu,
  books: booksHu,
};

type LocaleContextValue = {
  locale: Locale;
  content: LocaleContent;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export const LocaleProvider = ({
  children,
}: {
  children: ReactNode;
}): ReactElement => {
  const [locale, setLocaleState] = useState<Locale>(() => readLocale());

  useEffect(() => {
    const syncLocale = (): void => setLocaleState(readLocale());
    window.addEventListener(LOCALE_CHANGE_EVENT, syncLocale);
    return () => window.removeEventListener(LOCALE_CHANGE_EVENT, syncLocale);
  }, []);

  const setLocale = useCallback((next: Locale) => {
    writeLocale(next);
    setLocaleState(next);
  }, []);

  const toggleLocale = useCallback(() => {
    setLocaleState((prev) => toggleStored(prev));
  }, []);

  const content = locale === "en" ? enContent : huContent;

  const value = useMemo(
    () => ({ locale, content, setLocale, toggleLocale }),
    [locale, content, setLocale, toggleLocale],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
};

export const useLocaleContext = (): LocaleContextValue => {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocaleContext must be used within LocaleProvider");
  return ctx;
};
