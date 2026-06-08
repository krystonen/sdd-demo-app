import { useParams } from "react-router-dom";
import type { ReactElement } from "react";
import { useLocaleContext } from "@/context/LocaleContext";

type PolicyKey = "privacy" | "terms" | "cookies";

export const LegalPage = (): ReactElement => {
  const { policy } = useParams<{ policy: PolicyKey }>();
  const { content } = useLocaleContext();
  const key = policy ?? "privacy";
  const section = content.legal[key as PolicyKey] ?? content.legal.privacy;

  return (
    <article>
      <h1>{section.title}</h1>
      <p>{section.body}</p>
    </article>
  );
};
