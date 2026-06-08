import type { Book, BookFormat, BookFormatType, Money } from "@/lib/types";

type ShopifyVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: { amount: string; currencyCode: string };
  selectedOptions?: { name: string; value: string }[];
};

type ShopifyProductNode = {
  id: string;
  handle: string;
  title: string;
  description: string;
  images?: { edges: { node: { url: string } }[] };
  variants: { edges: { node: ShopifyVariant }[] };
};

const mapFormatType = (value: string): BookFormatType | null => {
  const v = value.toLowerCase();
  if (["physical", "print", "könyv", "fizikai", "paperback"].some((k) => v.includes(k)))
    return "physical";
  if (["ebook", "e-book", "digital", "epub", "e-könyv"].some((k) => v.includes(k)))
    return "ebook";
  return null;
};

const variantToFormat = (variant: ShopifyVariant): BookFormat | null => {
  const option = variant.selectedOptions?.find(
    (o) => o.name.toLowerCase() === "format",
  );
  const type = mapFormatType(option?.value ?? variant.title);
  if (!type) return null;
  const price: Money = {
    amount: variant.price.amount,
    currencyCode: variant.price.currencyCode,
  };
  return {
    type,
    variantId: variant.id,
    price,
    availableForSale: variant.availableForSale,
  };
};

/** Products without a Format option (e.g. "Default Title") still need a buyable variant. */
const fallbackFormats = (
  variants: ShopifyVariant[],
  productTitle: string,
): BookFormat[] => {
  if (variants.length === 0) return [];

  const pick = variants.find((v) => v.availableForSale) ?? variants[0];
  if (import.meta.env.DEV) {
    console.warn(
      `[shopify] "${productTitle}": no Format variant; using "${pick.title}" as physical.`,
    );
  }

  return [
    {
      type: "physical",
      variantId: pick.id,
      price: {
        amount: pick.price.amount,
        currencyCode: pick.price.currencyCode,
      },
      availableForSale: pick.availableForSale,
    },
  ];
};

export const mapShopifyProduct = (node: ShopifyProductNode): Book => {
  const variants = node.variants.edges.map((e) => e.node);
  const mapped = variants
    .map((v) => variantToFormat(v))
    .filter((f): f is BookFormat => f !== null);
  const formats =
    mapped.length > 0 ? mapped : fallbackFormats(variants, node.title);

  const coverImageUrl = node.images?.edges[0]?.node.url ?? "";
  const defaultFormat = formats.find((f) => f.availableForSale) ?? formats[0];
  const price: Money = defaultFormat?.price ?? {
    amount: "0",
    currencyCode: "HUF",
  };

  return {
    id: node.id,
    handle: node.handle,
    title: node.title,
    author: "",
    description: node.description,
    coverImageUrl,
    price,
    formats,
    available: formats.some((f) => f.availableForSale),
  };
};
