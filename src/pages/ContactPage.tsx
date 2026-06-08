import { useState, type ReactElement, type FormEvent } from "react";
import { useLocaleContext } from "@/context/LocaleContext";
import {
  hasContactErrors,
  validateContact,
} from "@/lib/contactValidation";
import type { ContactFieldErrors } from "@/lib/types";
import styles from "./ContactPage.module.css";

export const ContactPage = (): ReactElement => {
  const { locale, content } = useLocaleContext();
  const c = content.contact;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const onSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    const payload = { name, email, message, locale };
    const nextErrors = validateContact(payload);
    setErrors(nextErrors);
    if (hasContactErrors(nextErrors)) return;

    setStatus("sending");
    const endpoint = import.meta.env.VITE_CONTACT_FORM_ENDPOINT as string | undefined;
    const url = endpoint ?? "/api/contact";
    const isFormspree = url.includes("formspree.io");

    if (isFormspree && url.includes("@")) {
      setStatus("error");
      return;
    }

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div>
      <h1>{c.title}</h1>
      <form className={styles.form} onSubmit={(e) => void onSubmit(e)} noValidate>
        <div className={styles.field}>
          <label htmlFor="name">{c.name}</label>
          <input
            id="name"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
            autoComplete="name"
          />
          {errors.name ? <span className={styles.error}>{errors.name}</span> : null}
        </div>
        <div className={styles.field}>
          <label htmlFor="email">{c.email}</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            autoComplete="email"
          />
          {errors.email ? (
            <span className={styles.error}>{errors.email}</span>
          ) : null}
        </div>
        <div className={styles.field}>
          <label htmlFor="message">{c.message}</label>
          <textarea
            id="message"
            rows={5}
            value={message}
            onChange={(ev) => setMessage(ev.target.value)}
          />
          {errors.message ? (
            <span className={styles.error}>{errors.message}</span>
          ) : null}
        </div>
        <button
          type="submit"
          className={styles.submit}
          disabled={status === "sending"}
        >
          {status === "sending" ? c.sending : c.submit}
        </button>
        {status === "success" ? (
          <p className={styles.success} role="status">
            {c.success}
          </p>
        ) : null}
        {status === "error" ? (
          <p className={styles.error} role="alert">
            {c.error}
          </p>
        ) : null}
      </form>
    </div>
  );
};
