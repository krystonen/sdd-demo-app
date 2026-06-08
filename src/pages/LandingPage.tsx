import { Link } from "react-router-dom";
import type { ReactElement } from "react";
import { useLocaleContext } from "@/context/LocaleContext";
import { useBooks } from "@/hooks/useBooks";
import { isShopifyConfigured } from "@/lib/shopify/client";
import { MOCK_BOOKS } from "@/lib/shopify/mockBooks";
import type { Book } from "@/lib/types";
import styles from "./LandingPage.module.css";

const featuredBook = (books: Book[]): Book | null => {
  if (isShopifyConfigured()) return books[0] ?? null;
  return MOCK_BOOKS[0] ?? null;
};

export const LandingPage = (): ReactElement => {
  const { content } = useLocaleContext();
  const { books, loading } = useBooks();
  const featured = featuredBook(books);

  return (
    <div>
      <section className={styles.hero}>
        <h1 className={styles.title}>{content.landing.title}</h1>
        <p className={styles.subtitle}>{content.landing.subtitle}</p>
        <Link to="/books" className={styles.cta}>
          {content.landing.ctaBooks}
        </Link>
      </section>
      {loading && isShopifyConfigured() ? (
        <p className={styles.featured}>{content.landing.featured}…</p>
      ) : null}
      {!loading && featured ? (
        <section className={styles.featured}>
          <h2 className={styles.featuredTitle}>{content.landing.featured}</h2>
          <Link to={`/books/${featured.handle}`}>{featured.title}</Link>
        </section>
      ) : null}
    </div>
  );
};
