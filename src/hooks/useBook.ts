import { useEffect, useState } from "react";
import { fetchBookByHandle } from "@/lib/shopify/queries";
import type { Book } from "@/lib/types";

export const useBook = (
  handle: string | undefined,
): {
  book: Book | null;
  loading: boolean;
  error: string | null;
} => {
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!handle) {
      setBook(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchBookByHandle(handle)
      .then((data) => {
        if (!cancelled) setBook(data);
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

  return { book, loading, error };
};
