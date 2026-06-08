import { useState, type ReactElement } from "react";
import { Link, useParams } from "react-router-dom";
import { booksHu } from "@/content/hu/books";
import { useBook } from "@/hooks/useBook";
import { redirectToCheckout } from "@/lib/shopify/cart";
import type { BookFormatType } from "@/lib/types";
import styles from "./BookDetailPage.module.css";

const formatLabel = (type: BookFormatType): string =>
  type === "physical" ? booksHu.formatPhysical : booksHu.formatEbook;

export const BookDetailPage = (): ReactElement => {
  const { handle } = useParams<{ handle: string }>();
  const { book, loading, error } = useBook(handle);
  const [selected, setSelected] = useState<BookFormatType | null>(null);
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

  const activeType = selected ?? book.formats.find((f) => f.availableForSale)?.type ?? book.formats[0]?.type;
  const activeFormat = book.formats.find((f) => f.type === activeType);

  const onBuy = async (): Promise<void> => {
    if (!activeFormat?.availableForSale) return;
    setBuying(true);
    try {
      await redirectToCheckout(activeFormat.variantId);
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
          <p>{booksHu.selectFormat}</p>
          <div className={styles.formats}>
            {book.formats.map((f) => (
              <label key={f.type} className={styles.formatRow}>
                <input
                  type="radio"
                  name="format"
                  checked={activeType === f.type}
                  onChange={() => setSelected(f.type)}
                />
                {formatLabel(f.type)} — {f.price.amount} {f.price.currencyCode}
                {!f.availableForSale ? ` (${booksHu.unavailable})` : ""}
              </label>
            ))}
          </div>
          <button
            type="button"
            className={styles.buy}
            disabled={!activeFormat?.availableForSale || buying}
            onClick={() => void onBuy()}
          >
            {booksHu.buy}
          </button>
        </div>
      </div>
    </div>
  );
};
