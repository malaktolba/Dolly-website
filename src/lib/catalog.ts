// Shared catalogue types and helpers. Product data itself lives in the D1 database
// (see src/lib/store.ts); collections stay here because they are editorial and rarely change.

export type CollectionSlug = "summer-26" | "winter-25" | "ramadan-set";

export type Collection = {
  slug: CollectionSlug;
  name: string;
  code: string;
  season: string;
  intro: string;
  cover: string;
};

export type Category = "Skirts" | "Dresses" | "Sets" | "Outerwear" | "Tops" | "Bottoms";

export type Product = {
  id: number;
  slug: string;
  code: string;
  name: string;
  price: number;
  salePrice?: number;
  collections: CollectionSlug[];
  category: Category;
  sizes: string[];
  stock: Record<string, number>;
  color: string;
  style: string;
  description: string;
  modelWears: string;
  images: string[];
  visible: boolean;
};

export type ShippingZone = { id: number; name: string; fee: number };

const img = (id: string) => `https://files.easy-orders.net/${id}`;

export const collections: Collection[] = [
  {
    slug: "summer-26",
    name: "Summer '26",
    code: "SS26",
    season: "Spring / Summer 2026",
    intro:
      "Sparkle for the night, crochet for the shore. Pieces made for golden hours, seaside dinners and every moment you want to be seen.",
    cover: img("1785103536298189901.jpg"),
  },
  {
    slug: "winter-25",
    name: "Winter '25",
    code: "AW25",
    season: "Autumn / Winter 2025",
    intro:
      "Rich cocoa, chalk beige and jet black. Tailored silhouettes and soft structure, designed for strength, comfort and quiet confidence.",
    cover: img("1764390252783303731.jpeg"),
  },
  {
    slug: "ramadan-set",
    name: "Ramadan Set",
    code: "RS26",
    season: "Ramadan 2026",
    intro:
      "Flowing capes, high necklines and straight-leg trousers. An elegant, modest two-piece for evenings of gathering.",
    cover: img("1771986850687782724.jpeg"),
  },
];

export const categories: Category[] = ["Dresses", "Skirts", "Sets", "Outerwear", "Tops", "Bottoms"];

export const getCollection = (slug: string) => collections.find((c) => c.slug === slug);
export const priceOf = (p: Pick<Product, "price" | "salePrice">) => p.salePrice ?? p.price;
export const formatEGP = (n: number) => `${n.toLocaleString("en-US")} EGP`;
export const totalStock = (p: Product) => Object.values(p.stock).reduce((a, b) => a + b, 0);
export const isSoldOut = (p: Product) => totalStock(p) === 0;

export const brand = {
  phone: "01035723775",
  email: "dollyy825@gmail.com",
  instagram: "https://www.instagram.com/",
};
