import type { ReactElement } from "react";
import { Button } from "@/components/Button";
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
      <Button variant="ghost" onClick={onRetry}>
        {booksHu.retry}
      </Button>
    ) : null}
  </div>
);
