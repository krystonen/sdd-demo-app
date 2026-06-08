import { isShopifyConfigured, storefrontFetch } from "@/lib/shopify/client";

const CART_CREATE = `
  mutation CartCreate($lines: [CartLineInput!]!) {
    cartCreate(input: { lines: $lines }) {
      cart { checkoutUrl }
      userErrors { message }
    }
  }
`;

type CartCreateResponse = {
  cartCreate: {
    cart: { checkoutUrl: string } | null;
    userErrors: { message: string }[];
  };
};

export const startCheckout = async (
  variantId: string,
): Promise<string> => {
  if (!isShopifyConfigured()) {
    window.alert(
      "Demo mód: állítsd be a Shopify környezeti változókat a valódi fizetéshez.",
    );
    return "";
  }

  const data = await storefrontFetch<CartCreateResponse>(CART_CREATE, {
    lines: [{ merchandiseId: variantId, quantity: 1 }],
  });

  const errors = data.cartCreate.userErrors;
  if (errors.length > 0) throw new Error(errors[0].message);

  const url = data.cartCreate.cart?.checkoutUrl;
  if (!url) throw new Error("No checkout URL");
  return url;
};

export const redirectToCheckout = async (variantId: string): Promise<void> => {
  const url = await startCheckout(variantId);
  if (url) window.location.assign(url);
};
