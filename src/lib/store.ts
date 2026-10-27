import "server-only";
import { cache } from "react";
import { readRows } from "@/lib/cf";
import type { Category, CollectionSlug, Product, ShippingZone } from "@/lib/catalog";

type ProductRow = {
  id: number;
  slug: string;
  code: string;
  name: string;
  price: number;
  sale_price: number | null;
  category: Category;
  color: string;
  style: string;
  description: string;
  model_wears: string;
  collections: string;
  images: string;
  visible: number;
};

type SizeRow = { product_id: number; size: string; stock: number };

function toProduct(row: ProductRow, sizes: SizeRow[]): Product {
  const own = sizes.filter((s) => s.product_id === row.id);
  return {
    id: row.id,
    slug: row.slug,
    code: row.code,
    name: row.name,
    price: row.price,
    salePrice: row.sale_price ?? undefined,
    category: row.category,
    color: row.color,
    style: row.style,
    description: row.description,
    modelWears: row.model_wears,
    collections: row.collections.split(",").filter(Boolean) as CollectionSlug[],
    images: JSON.parse(row.images) as string[],
    visible: row.visible === 1,
    sizes: own.map((s) => s.size),
    stock: Object.fromEntries(own.map((s) => [s.size, s.stock])),
  };
}

/** All products in display order. Cached per request. */
export const getAllProducts = cache(async (includeHidden = false): Promise<Product[]> => {
  const [rows, sizes] = await Promise.all([
    readRows<ProductRow>(`SELECT * FROM products ${includeHidden ? "" : "WHERE visible = 1"} ORDER BY position, id`),
    readRows<SizeRow>("SELECT product_id, size, stock FROM product_sizes ORDER BY position, size"),
  ]);
  return rows.map((r) => toProduct(r, sizes));
});

export const getProducts = () => getAllProducts(false);

export async function getProductBySlug(slug: string) {
  return (await getProducts()).find((p) => p.slug === slug);
}

export async function getProductById(id: number) {
  return (await getAllProducts(true)).find((p) => p.id === id);
}

export async function productsIn(slug: CollectionSlug) {
  return (await getProducts()).filter((p) => p.collections.includes(slug));
}

export const getShippingZones = cache(async (): Promise<ShippingZone[]> =>
  readRows<ShippingZone>("SELECT id, name, fee FROM shipping_zones ORDER BY position, id"),
);
