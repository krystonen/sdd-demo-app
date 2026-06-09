import type { BookFormatType } from "@/lib/types";

export const EBOOK_HANDLE_SUFFIX = "-e-book";

export const isEbookHandle = (handle: string): boolean =>
  handle.endsWith(EBOOK_HANDLE_SUFFIX);

export const baseHandle = (handle: string): string =>
  isEbookHandle(handle)
    ? handle.slice(0, -EBOOK_HANDLE_SUFFIX.length)
    : handle;

export const ebookHandle = (base: string): string => `${base}${EBOOK_HANDLE_SUFFIX}`;

export const formatFromHandle = (handle: string): BookFormatType =>
  isEbookHandle(handle) ? "ebook" : "physical";

/** Sibling edition URL handle, or null when base is empty after stripping suffix. */
export const siblingHandle = (handle: string): string | null => {
  if (isEbookHandle(handle)) {
    const base = baseHandle(handle);
    return base.length > 0 ? base : null;
  }
  return ebookHandle(handle);
};
