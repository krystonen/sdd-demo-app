import type { ReactElement } from "react";
import { BookCard } from "@/components/BookCard/BookCard";
import { ShopifyErrorBanner } from "@/components/ShopifyErrorBanner/ShopifyErrorBanner";
import { booksHu } from "@/content/hu/books";
import { useBooks } from "@/hooks/useBooks";
import styles from "./BooksOverviewPage.module.css";

export const BooksOverviewPage = (): ReactElement => {
  const { books, loading, error, retry } = useBooks();

  return (
    <div>
      <h1 className={styles.title}>{booksHu.catalogTitle}</h1>
      {error ? <ShopifyErrorBanner onRetry={retry} /> : null}
      {loading ? <p>{booksHu.catalogTitle}…</p> : null}
      {!loading && !error && books.length === 0 ? (
        <p className={styles.empty}>{booksHu.catalogEmpty}</p>
      ) : null}
      {!loading && books.length > 0 ? (
        <div className={styles.grid}>
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : null}
    </div>
  );
};
