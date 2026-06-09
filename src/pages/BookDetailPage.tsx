import { useState, type ReactElement } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/Button";
import { booksHu } from "@/content/hu/books";
import { useBook } from "@/hooks/useBook";
import { redirectToCheckout } from "@/lib/shopify/cart";
import type { BookFormatType } from "@/lib/types";
import styles from "./BookDetailPage.module.css";

const formatLabel = (type: BookFormatType): string =>
  type === "physical" ? booksHu.formatPhysical : booksHu.formatEbook;

export const BookDetailPage = (): ReactElement => {
  const { handle } = useParams<{ handle: string }>();
  const { book, sibling, loading, error } = useBook(handle);
  const [buying, setBuying] = useState(false);

  if (loading) return <p>…</p>;
  if (error || !book)
    return (
      <div>
        <Link to="/books" className={styles.back}>
          {booksHu.backToCatalog}
        </Link>
        <p>{booksHu.notFound}</p>
      </div>
    );

  const onBuy = async (): Promise<void> => {
    if (!book.available) return;
    setBuying(true);
    try {
      await redirectToCheckout(book.variantId);
    } finally {
      setBuying(false);
    }
  };

  return (
    <div>
      <Link to="/books" className={styles.back}>
        ← {booksHu.backToCatalog}
      </Link>
      <div className={styles.layout}>
        <img src={book.coverImageUrl} alt="" className={styles.image} />
        <div>
          <p className={styles.formatBadge}>{formatLabel(book.format)}</p>
          <h1 className={styles.title}>{book.title}</h1>
          {book.author ? (
            <p className={styles.author}>
              {booksHu.author}: {book.author}
            </p>
          ) : null}
          <div
            className={styles.description}
            dangerouslySetInnerHTML={{ __html: book.description }}
          />
          <p className={styles.price}>
            {book.price.amount} {book.price.currencyCode}
          </p>
          <Button
            variant="primary"
            disabled={!book.available || buying}
            onClick={() => void onBuy()}
          >
            {booksHu.buy}
          </Button>
          {sibling ? (
            <div className={styles.sibling}>
              <p className={styles.siblingLabel}>{booksHu.alsoAvailableAs}</p>
              <Link to={`/books/${sibling.handle}`} className={styles.siblingLink}>
                {formatLabel(sibling.format)} — {sibling.price.amount}{" "}
                {sibling.price.currencyCode}
                {!sibling.available ? ` (${booksHu.unavailable})` : ""}
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
