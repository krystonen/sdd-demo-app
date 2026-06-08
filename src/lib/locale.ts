import type { Locale } from "@/lib/types";

const STORAGE_KEY = "bookstore_locale";
export const DEFAULT_LOCALE: Locale = "hu";

export const readLocale = (): Locale => {
  if (typeof localStorage === "undefined") return DEFAULT_LOCALE;
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === "en" || stored === "hu" ? stored : DEFAULT_LOCALE;
};

export const writeLocale = (locale: Locale): void => {
  localStorage.setItem(STORAGE_KEY, locale);
};

export const toggleLocale = (current: Locale): Locale => {
  const next: Locale = current === "en" ? "hu" : "en";
  writeLocale(next);
  return next;
};
