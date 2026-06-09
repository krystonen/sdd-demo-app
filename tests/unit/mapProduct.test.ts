import { describe, expect, it } from "vitest";
import {
  baseHandle,
  ebookHandle,
  formatFromHandle,
  isEbookHandle,
  siblingHandle,
} from "@/lib/bookHandles";
import { mapShopifyProduct } from "@/lib/shopify/mapProduct";
import fixture from "./fixtures/shopifyProduct.json";

describe("bookHandles", () => {
  it("detects e-book suffix on handle", () => {
    expect(isEbookHandle("az-ejfeli-kert-e-book")).toBe(true);
    expect(isEbookHandle("az-ejfeli-kert")).toBe(false);
  });

  it("derives base and e-book handles", () => {
    expect(baseHandle("az-ejfeli-kert-e-book")).toBe("az-ejfeli-kert");
    expect(ebookHandle("az-ejfeli-kert")).toBe("az-ejfeli-kert-e-book");
  });

  it("maps format from handle suffix", () => {
    expect(formatFromHandle("az-ejfeli-kert")).toBe("physical");
    expect(formatFromHandle("az-ejfeli-kert-e-book")).toBe("ebook");
  });

  it("returns sibling handle for cross-edition links", () => {
    expect(siblingHandle("az-ejfeli-kert")).toBe("az-ejfeli-kert-e-book");
    expect(siblingHandle("az-ejfeli-kert-e-book")).toBe("az-ejfeli-kert");
  });
});

describe("mapShopifyProduct", () => {
  it("maps a single-variant physical product from handle", () => {
    const book = mapShopifyProduct(fixture);
    expect(book.handle).toBe("test-book");
    expect(book.title).toBe("Teszt könyv");
    expect(book.format).toBe("physical");
    expect(book.variantId).toBe("gid://shopify/ProductVariant/1");
    expect(book.price).toEqual({ amount: "4990", currencyCode: "HUF" });
    expect(book.available).toBe(true);
  });

  it("maps e-book format from -e-book handle suffix", () => {
    const book = mapShopifyProduct({
      ...fixture,
      handle: "test-book-e-book",
    });
    expect(book.format).toBe("ebook");
  });

  it("marks unavailable when no sellable variant exists", () => {
    const book = mapShopifyProduct({
      ...fixture,
      variants: {
        edges: [
          {
            node: {
              id: "gid://shopify/ProductVariant/99",
              title: "Default Title",
              availableForSale: false,
              price: { amount: "5.00", currencyCode: "USD" },
            },
          },
        ],
      },
    });
    expect(book.available).toBe(false);
    expect(book.variantId).toBe("gid://shopify/ProductVariant/99");
  });
});
