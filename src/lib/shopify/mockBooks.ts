import type { Book } from "@/lib/types";

/** Demo catalog when Shopify env vars are not configured. */
export const MOCK_BOOKS: Book[] = [
  {
    id: "mock-1",
    handle: "az-ejfeli-kert",
    title: "Minta regény",
    author: "Kovács Anna",
    description: "Egy lebilincselő történet a modern Magyarországról.",
    coverImageUrl: "https://placehold.co/200x300/2d5016/fff?text=Könyv",
    price: { amount: "4990", currencyCode: "HUF" },
    formats: [
      {
        type: "physical",
        variantId: "mock-1-physical",
        price: { amount: "4990", currencyCode: "HUF" },
        availableForSale: true,
      },
      {
        type: "ebook",
        variantId: "mock-1-ebook",
        price: { amount: "2990", currencyCode: "HUF" },
        availableForSale: true,
      },
    ],
    available: true,
  },
  {
    id: "mock-2",
    handle: "programozas-kezdoknek",
    title: "Digitális útmutató",
    author: "Nagy Péter",
    description: "Csak e-könyvként elérhető szakmai kiadvány.",
    coverImageUrl: "https://placehold.co/200x300/3d6b1f/fff?text=E-könyv",
    price: { amount: "1990", currencyCode: "HUF" },
    formats: [
      {
        type: "ebook",
        variantId: "mock-2-ebook",
        price: { amount: "1990", currencyCode: "HUF" },
        availableForSale: true,
      },
    ],
    available: true,
  },
];
