import type { Locale } from "@/lib/types";
import { DEFAULT_LOCALE } from "@/lib/locale";

export const detectBrowserLocale = (): Locale => {
  if (typeof navigator === "undefined") return DEFAULT_LOCALE;
  const lang = navigator.language.toLowerCase();
  if (lang.startsWith("en")) return "en";
  if (lang.startsWith("hu")) return "hu";
  return DEFAULT_LOCALE;
};
