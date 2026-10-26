"use client";

import { useMemo, useState } from "react";
import ProductCard from "@/components/product/ProductCard";
import { products } from "@/lib/catalog";

export default function SearchPage() {
  const [q, setQ] = useState("");
  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    return products.filter((p) =>
      [p.name, p.code, p.color, p.category, p.style].some((s) => s.toLowerCase().includes(term)),
    );
  }, [q]);

  return (
    <div className="px-5 pt-20 md:px-10 md:pt-32">
      <label htmlFor="q" className="label text-cocoa-soft">
        Search
      </label>
      <input
        id="q"
        autoFocus
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Skirt, coat, beige…"
        className="mt-4 w-full border-b border-cocoa bg-transparent pb-4 font-display text-5xl outline-none placeholder:text-cocoa/25 md:text-8xl"
      />
      <p className="label mt-6 text-cocoa-soft">{q ? `${results.length} results` : "Type to search the collection"}</p>
      <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-14 md:grid-cols-4 md:gap-x-6">
        {results.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </div>
  );
}
