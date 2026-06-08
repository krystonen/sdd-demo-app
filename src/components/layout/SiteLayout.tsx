import { Link, Outlet, useMatches } from "react-router-dom";
import type { ReactElement } from "react";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { PrimaryNav } from "@/components/layout/PrimaryNav";
import type { RouteHandle } from "@/routes/types";
import styles from "./SiteLayout.module.css";

export const SiteLayout = (): ReactElement => {
  const matches = useMatches();
  const handle = matches[matches.length - 1]?.handle as RouteHandle | undefined;
  const bilingual = handle?.bilingual ?? false;

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <Link to="/" className={styles.brand}>
          Bookstore
        </Link>
        <PrimaryNav />
        {bilingual ? <LanguageSwitcher /> : null}
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
      <footer className={styles.footer}>© Bookstore</footer>
    </div>
  );
};
