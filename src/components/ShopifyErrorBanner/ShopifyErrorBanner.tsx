import type { ReactElement } from "react";
import { booksHu } from "@/content/hu/books";
import styles from "./ShopifyErrorBanner.module.css";

type ShopifyErrorBannerProps = {
  onRetry?: () => void;
};

export const ShopifyErrorBanner = ({
  onRetry,
}: ShopifyErrorBannerProps): ReactElement => (
  <div className={styles.banner} role="alert">
    <span>{booksHu.catalogError}</span>
    {onRetry ? (
      <button type="button" className={styles.retry} onClick={onRetry}>
        {booksHu.retry}
      </button>
    ) : null}
  </div>
);
