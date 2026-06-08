import type { ReactElement } from "react";
import { useLocaleContext } from "@/context/LocaleContext";
import styles from "./AboutPage.module.css";

export const AboutPage = (): ReactElement => {
  const { content } = useLocaleContext();
  return (
    <article className={styles.page}>
      <h1>{content.about.title}</h1>
      <p>{content.about.body}</p>
    </article>
  );
};
