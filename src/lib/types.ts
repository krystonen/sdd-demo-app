export type Locale = "en" | "hu";

export type BookFormatType = "physical" | "ebook";

export type Money = {
  amount: string;
  currencyCode: string;
};

export type BookFormat = {
  type: BookFormatType;
  variantId: string;
  price: Money;
  availableForSale: boolean;
};

export type Book = {
  id: string;
  handle: string;
  title: string;
  author: string;
  description: string;
  coverImageUrl: string;
  price: Money;
  formats: BookFormat[];
  available: boolean;
};

export type ContactPayload = {
  name: string;
  email: string;
  message: string;
  locale: Locale;
};

export type ContactFieldErrors = Partial<
  Record<"name" | "email" | "message", string>
>;
