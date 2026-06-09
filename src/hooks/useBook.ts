import { useEffect, useState } from "react";
import { siblingHandle } from "@/lib/bookHandles";
import { fetchBookByHandle } from "@/lib/shopify/queries";
import type { Book } from "@/lib/types";

export const useBook = (
  handle: string | undefined,
): {
  book: Book | null;
  sibling: Book | null;
  loading: boolean;
  error: string | null;
} => {
  const [book, setBook] = useState<Book | null>(null);
  const [sibling, setSibling] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!handle) {
      setBook(null);
      setSibling(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);

    const otherHandle = siblingHandle(handle);
    Promise.all([
      fetchBookByHandle(handle),
      otherHandle ? fetchBookByHandle(otherHandle) : Promise.resolve(null),
    ])
      .then(([data, siblingData]) => {
        if (cancelled) return;
        setBook(data);
        setSibling(siblingData);
      })
      .catch(() => {
        if (!cancelled) setError("fetch_failed");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [handle]);

  return { book, sibling, loading, error };
};
