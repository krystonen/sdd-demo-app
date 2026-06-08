import type { Locale } from "@/lib/types";

const STORAGE_KEY = "bookstore_locale";
export const LOCALE_CHANGE_EVENT = "locale-change";
export const DEFAULT_LOCALE: Locale = "hu";

export const hasStoredLocale = (): boolean => {
  if (typeof localStorage === "undefined") return false;
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === "en" || stored === "hu";
};

export const readLocale = (): Locale => {
  if (typeof localStorage === "undefined") return DEFAULT_LOCALE;
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === "en" || stored === "hu" ? stored : DEFAULT_LOCALE;
};

export const writeLocale = (locale: Locale): void => {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(STORAGE_KEY, locale);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(LOCALE_CHANGE_EVENT));
  }
};

export const toggleLocale = (current: Locale): Locale => {
  const next: Locale = current === "en" ? "hu" : "en";
  writeLocale(next);
  return next;
};
