import { formatFromHandle } from "@/lib/bookHandles";
import type { Book, Money } from "@/lib/types";

type ShopifyVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: { amount: string; currencyCode: string };
};

type ShopifyProductNode = {
  id: string;
  handle: string;
  title: string;
  description: string;
  images?: { edges: { node: { url: string } }[] };
  variants: { edges: { node: ShopifyVariant }[] };
};

const pickVariant = (variants: ShopifyVariant[]): ShopifyVariant | null => {
  if (variants.length === 0) return null;
  return variants.find((v) => v.availableForSale) ?? variants[0] ?? null;
};

export const mapShopifyProduct = (node: ShopifyProductNode): Book => {
  const variants = node.variants.edges.map((e) => e.node);
  const variant = pickVariant(variants);
  const coverImageUrl = node.images?.edges[0]?.node.url ?? "";
  const price: Money = variant?.price ?? {
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
    format: formatFromHandle(node.handle),
    variantId: variant?.id ?? "",
    price,
    available: variant?.availableForSale ?? false,
  };
};
