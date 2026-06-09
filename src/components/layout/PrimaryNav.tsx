import type { ReactElement } from "react";
import { Link } from "@/components/Link";
import { useLocaleContext } from "@/context/LocaleContext";
import styles from "./PrimaryNav.module.css";

export const PrimaryNav = (): ReactElement => {
  const { content } = useLocaleContext();
  const n = content.common.nav;

  return (
    <nav className={styles.nav} aria-label="Main">
      <Link to="/" end>
        {n.home}
      </Link>
      <Link to="/books">{n.books}</Link>
      <Link to="/about" end>
        {n.about}
      </Link>
      <Link to="/contact" end>
        {n.contact}
      </Link>
      <div className={styles.legalGroup}>
        <Link to="/legal/privacy" end>
          {n.privacy}
        </Link>
        <Link to="/legal/terms" end>
          {n.terms}
        </Link>
        <Link to="/legal/cookies" end>
          {n.cookies}
        </Link>
      </div>
    </nav>
  );
};
