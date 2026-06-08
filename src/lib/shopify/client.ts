const getConfig = (): {
  domain: string;
  token: string;
  collection: string;
} | null => {
  const domain = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN as string | undefined;
  const token = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN as string | undefined;
  const collection =
    (import.meta.env.VITE_SHOPIFY_BOOKS_COLLECTION as string | undefined) ?? "books";
  if (!domain || !token) return null;
  return { domain, token, collection };
};

export const isShopifyConfigured = (): boolean => getConfig() !== null;

export const storefrontFetch = async <T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> => {
  const config = getConfig();
  if (!config) throw new Error("Shopify is not configured");

  const res = await fetch(
    `https://${config.domain}/api/2024-10/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": config.token,
      },
      body: JSON.stringify({ query, variables }),
    },
  );

  if (!res.ok) throw new Error(`Shopify API error: ${res.status}`);
  const json = (await res.json()) as { data?: T; errors?: unknown[] };
  if (json.errors?.length) throw new Error("Shopify GraphQL error");
  if (!json.data) throw new Error("No data from Shopify");

  console.log(json);
  return json.data;
};

export const getBooksCollectionHandle = (): string =>
  getConfig()?.collection ?? "books";
