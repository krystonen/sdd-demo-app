import { getBooksCollectionHandle, isShopifyConfigured, storefrontFetch } from "@/lib/shopify/client";
import { mapShopifyProduct } from "@/lib/shopify/mapProduct";
import { MOCK_BOOKS } from "@/lib/shopify/mockBooks";
import type { Book } from "@/lib/types";

const COLLECTION_PRODUCTS_QUERY = `
  query Books($handle: String!) {
    collection(handle: $handle) {
      products(first: 50) {
        edges {
          node {
            id
            handle
            title
            description
            images(first: 1) { edges { node { url } } }
            variants(first: 10) {
              edges {
                node {
                  id
                  title
                  availableForSale
                  price { amount currencyCode }
                  selectedOptions { name value }
                }
              }
            }
          }
        }
      }
    }
  }
`;

const PRODUCT_BY_HANDLE_QUERY = `
  query Product($handle: String!) {
    product(handle: $handle) {
      id
      handle
      title
      description
      images(first: 1) { edges { node { url } } }
      variants(first: 10) {
        edges {
          node {
            id
            title
            availableForSale
            price { amount currencyCode }
            selectedOptions { name value }
          }
        }
      }
    }
  }
`;

type CollectionResponse = {
  collection: {
    products: { edges: { node: Parameters<typeof mapShopifyProduct>[0] }[] };
  } | null;
};

type ProductResponse = {
  product: Parameters<typeof mapShopifyProduct>[0] | null;
};

export const fetchBooks = async (): Promise<Book[]> => {
  if (!isShopifyConfigured()) return MOCK_BOOKS;

  const data = await storefrontFetch<CollectionResponse>(COLLECTION_PRODUCTS_QUERY, {
    handle: getBooksCollectionHandle(),
  });

  const edges = data.collection?.products.edges ?? [];
  return edges.map((e) => mapShopifyProduct(e.node));
};

export const fetchBookByHandle = async (handle: string): Promise<Book | null> => {
  if (!isShopifyConfigured()) {
    return MOCK_BOOKS.find((b) => b.handle === handle) ?? null;
  }

  const data = await storefrontFetch<ProductResponse>(PRODUCT_BY_HANDLE_QUERY, {
    handle,
  });
  if (!data.product) return null;
  return mapShopifyProduct(data.product);
};
