import { describe, expect, it } from "vitest";
import { mapShopifyProduct } from "@/lib/shopify/mapProduct";
import fixture from "./fixtures/shopifyProduct.json";

describe("mapShopifyProduct", () => {
  it("maps product with physical and ebook formats", () => {
    const book = mapShopifyProduct(fixture);
    expect(book.handle).toBe("test-book");
    expect(book.title).toBe("Teszt könyv");
    expect(book.formats).toHaveLength(2);
    expect(book.formats.map((f) => f.type).sort()).toEqual(["ebook", "physical"]);
    expect(book.available).toBe(true);
  });

  it("falls back to first variant when Format option is missing", () => {
    const book = mapShopifyProduct({
      ...fixture,
      variants: {
        edges: [
          {
            node: {
              id: "gid://shopify/ProductVariant/99",
              title: "Default Title",
              availableForSale: true,
              price: { amount: "5.00", currencyCode: "USD" },
              selectedOptions: [{ name: "Title", value: "Default Title" }],
            },
          },
        ],
      },
    });
    expect(book.formats).toHaveLength(1);
    expect(book.formats[0].type).toBe("physical");
    expect(book.formats[0].variantId).toBe("gid://shopify/ProductVariant/99");
    expect(book.formats[0].price).toEqual({ amount: "5.00", currencyCode: "USD" });
    expect(book.available).toBe(true);
  });
});
