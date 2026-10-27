"use client";

import { useEffect, useMemo, useState } from "react";
import ProductCard from "@/components/product/ProductCard";
import { categories, collections, priceOf, type Product } from "@/lib/catalog";

type Sort = "featured" | "low" | "high";

export default function ShopGrid({
  products,
  showCollectionFilter = true,
}: {
  products: Product[];
  showCollectionFilter?: boolean;
}) {
  const [collection, setCollection] = useState<string>("all");
  const [category, setCategory] = useState<string>("all");
  const [sale, setSale] = useState(false);
  const [sort, setSort] = useState<Sort>("featured");

  // The page is cached as static HTML, so read ?sale=1 in the browser
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("sale") === "1") setSale(true);
  }, []);

  const available = useMemo(() => categories.filter((c) => products.some((p) => p.category === c)), [products]);

  const list = useMemo(() => {
    let out = products.filter(
      (p) =>
        (collection === "all" || p.collections.includes(collection as Product["collections"][number])) &&
        (category === "all" || p.category === category) &&
        (!sale || p.salePrice),
    );
    if (sort !== "featured") out = [...out].sort((a, b) => (sort === "low" ? 1 : -1) * (priceOf(a) - priceOf(b)));
    return out;
  }, [products, collection, category, sale, sort]);

  const chip = (active: boolean) =>
    `label whitespace-nowrap border px-4 py-2 transition-colors ${
      active ? "border-cocoa bg-cocoa text-cream" : "border-sand hover:border-cocoa"
    }`;

  return (
    <>
      <div className="sticky top-[68px] z-30 -mx-5 mb-10 flex flex-col gap-3 border-y border-sand bg-cream/95 px-5 py-4 backdrop-blur-sm md:-mx-10 md:flex-row md:items-center md:justify-between md:px-10">
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          {showCollectionFilter && (
            <>
              <button className={chip(collection === "all")} onClick={() => setCollection("all")}>
                All
              </button>
              {collections.map((c) => (
                <button key={c.slug} className={chip(collection === c.slug)} onClick={() => setCollection(c.slug)}>
                  {c.name}
                </button>
              ))}
              <span className="mx-2 w-px shrink-0 bg-sand" />
            </>
          )}
          <button className={chip(category === "all")} onClick={() => setCategory("all")}>
            All types
          </button>
          {available.map((c) => (
            <button key={c} className={chip(category === c)} onClick={() => setCategory(c)}>
              {c}
            </button>
          ))}
          <button className={chip(sale)} onClick={() => setSale((v) => !v)}>
            Sale
          </button>
        </div>
        <div className="flex items-center gap-4">
          <span className="label text-cocoa-soft">{list.length} pieces</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="label cursor-pointer bg-transparent outline-none"
            aria-label="Sort"
          >
            <option value="featured">Featured</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
          </select>
        </div>
      </div>

      {list.length === 0 ? (
        <p className="py-24 text-center font-display text-3xl italic">Nothing here yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-14 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
          {list.map((p, i) => (
            <ProductCard key={p.slug} product={p} priority={i < 4} />
          ))}
        </div>
      )}
    </>
  );
}
