import { Link } from "react-router-dom";
import type { ReactElement } from "react";
import { useLocaleContext } from "@/context/LocaleContext";
import styles from "./PrimaryNav.module.css";

export const PrimaryNav = (): ReactElement => {
  const { content } = useLocaleContext();
  const n = content.common.nav;

  return (
    <nav className={styles.nav} aria-label="Main">
      <Link to="/" className={styles.link}>
        {n.home}
      </Link>
      <Link to="/books" className={styles.link}>
        {n.books}
      </Link>
      <Link to="/about" className={styles.link}>
        {n.about}
      </Link>
      <Link to="/contact" className={styles.link}>
        {n.contact}
      </Link>
      <div className={styles.legalGroup}>
        <Link to="/legal/privacy" className={styles.legalLink}>
          {n.privacy}
        </Link>
        <Link to="/legal/terms" className={styles.legalLink}>
          {n.terms}
        </Link>
        <Link to="/legal/cookies" className={styles.legalLink}>
          {n.cookies}
        </Link>
      </div>
    </nav>
  );
};
