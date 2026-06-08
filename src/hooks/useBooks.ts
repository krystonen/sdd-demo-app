import { useEffect, useState } from "react";
import { fetchBooks } from "@/lib/shopify/queries";
import type { Book } from "@/lib/types";

export const useBooks = (): {
  books: Book[];
  loading: boolean;
  error: string | null;
  retry: () => void;
} => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchBooks()
      .then((data) => {
        if (!cancelled) setBooks(data);
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
  }, [tick]);

  return {
    books,
    loading,
    error,
    retry: () => setTick((t) => t + 1),
  };
};
