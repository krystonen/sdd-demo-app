import { Link } from "react-router-dom";
import type { ReactElement } from "react";
import { booksHu } from "@/content/hu/books";
import type { Book, BookFormatType } from "@/lib/types";
import styles from "./BookCard.module.css";

const formatLabel = (type: BookFormatType): string =>
  type === "physical" ? booksHu.formatPhysical : booksHu.formatEbook;

export const BookCard = ({ book }: { book: Book }): ReactElement => (
  <Link to={`/books/${book.handle}`} className={styles.card}>
    <img
      src={book.coverImageUrl}
      alt=""
      className={styles.image}
      loading="lazy"
    />
    <div className={styles.body}>
      <h3 className={styles.title}>{book.title}</h3>
      {book.author ? (
        <p className={styles.meta}>
          {booksHu.author}: {book.author}
        </p>
      ) : null}
      <p className={styles.format}>{formatLabel(book.format)}</p>
      <p className={styles.meta}>
        {book.price.amount} {book.price.currencyCode}
      </p>
    </div>
  </Link>
);
