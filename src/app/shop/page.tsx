import type { Metadata } from "next";
import ShopGrid from "@/components/shop/ShopGrid";
import { getProducts } from "@/lib/store";

export const metadata: Metadata = { title: "Shop" };

export default async function ShopPage() {
  const products = await getProducts();
  return (
    <div className="px-5 pt-16 md:px-10 md:pt-24">
      <header className="mb-12 md:mb-16">
        <p className="label text-cocoa-soft">Shop</p>
        <h1 className="mt-4 font-display text-6xl md:text-8xl">All pieces</h1>
      </header>
      <ShopGrid products={products} />
    </div>
  );
}
