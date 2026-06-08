import type { ContactFieldErrors, ContactPayload, Locale } from "@/lib/types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const messages: Record<Locale, Record<string, string>> = {
  en: {
    nameRequired: "Name is required.",
    nameShort: "Name must be at least 2 characters.",
    emailRequired: "Email is required.",
    emailInvalid: "Enter a valid email address.",
    messageRequired: "Message is required.",
    messageShort: "Message must be at least 10 characters.",
  },
  hu: {
    nameRequired: "A név megadása kötelező.",
    nameShort: "A név legalább 2 karakter legyen.",
    emailRequired: "Az e-mail megadása kötelező.",
    emailInvalid: "Érvényes e-mail címet adj meg.",
    messageRequired: "Az üzenet megadása kötelező.",
    messageShort: "Az üzenet legalább 10 karakter legyen.",
  },
};

export const validateContact = (
  payload: ContactPayload,
): ContactFieldErrors => {
  const m = messages[payload.locale];
  const errors: ContactFieldErrors = {};
  const name = payload.name.trim();
  const email = payload.email.trim();
  const message = payload.message.trim();

  if (!name) errors.name = m.nameRequired;
  else if (name.length < 2) errors.name = m.nameShort;

  if (!email) errors.email = m.emailRequired;
  else if (!EMAIL_RE.test(email)) errors.email = m.emailInvalid;

  if (!message) errors.message = m.messageRequired;
  else if (message.length < 10) errors.message = m.messageShort;

  return errors;
};

export const hasContactErrors = (errors: ContactFieldErrors): boolean =>
  Object.keys(errors).length > 0;
