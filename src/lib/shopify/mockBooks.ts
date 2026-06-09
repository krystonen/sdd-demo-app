import type { Book } from "@/lib/types";

/** Demo catalog when Shopify env vars are not configured. */
export const MOCK_BOOKS: Book[] = [
  {
    id: "mock-1-physical",
    handle: "az-ejfeli-kert",
    title: "Minta regény",
    author: "Kovács Anna",
    description: "Egy lebilincselő történet a modern Magyarországról.",
    coverImageUrl: "https://placehold.co/200x300/2d5016/fff?text=Könyv",
    format: "physical",
    variantId: "mock-1-physical",
    price: { amount: "4990", currencyCode: "HUF" },
    available: true,
  },
  {
    id: "mock-1-ebook",
    handle: "az-ejfeli-kert-e-book",
    title: "Minta regény",
    author: "Kovács Anna",
    description: "Egy lebilincselő történet a modern Magyarországról.",
    coverImageUrl: "https://placehold.co/200x300/2d5016/fff?text=Könyv",
    format: "ebook",
    variantId: "mock-1-ebook",
    price: { amount: "2990", currencyCode: "HUF" },
    available: true,
  },
  {
    id: "mock-2-ebook",
    handle: "programozas-kezdoknek-e-book",
    title: "Digitális útmutató",
    author: "Nagy Péter",
    description: "Csak e-könyvként elérhető szakmai kiadvány.",
    coverImageUrl: "https://placehold.co/200x300/3d6b1f/fff?text=E-könyv",
    format: "ebook",
    variantId: "mock-2-ebook",
    price: { amount: "1990", currencyCode: "HUF" },
    available: true,
  },
];
