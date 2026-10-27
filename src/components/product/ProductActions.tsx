"use client";

import { useState } from "react";
import type { Product } from "@/lib/catalog";
import { useCart } from "@/components/cart/CartProvider";

export default function ProductActions({ product }: { product: Product }) {
  const { add } = useCart();
  const inStock = product.sizes.filter((s) => (product.stock[s] ?? 0) > 0);
  const [size, setSize] = useState<string | null>(inStock.length === 1 && product.sizes.length === 1 ? inStock[0] : null);
  const [error, setError] = useState(false);
  const soldOut = inStock.length === 0;
  const left = size ? (product.stock[size] ?? 0) : 0;

  const onAdd = () => {
    if (!size) {
      setError(true);
      return;
    }
    add(product, size);
  };

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between">
        <p className="label">Size{size ? `: ${size}` : ""}</p>
        {error && !size && <p className="label text-blush-deep">Please choose a size</p>}
        {size && left > 0 && left <= 2 && <p className="label text-blush-deep">Only {left} left</p>}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {product.sizes.map((s) => {
          const out = (product.stock[s] ?? 0) === 0;
          return (
            <button
              key={s}
              disabled={out}
              onClick={() => {
                setSize(s);
                setError(false);
              }}
              aria-pressed={size === s}
              title={out ? "Sold out" : undefined}
              className={`label min-w-14 border px-4 py-3 transition-colors ${
                out
                  ? "cursor-not-allowed border-sand text-cocoa/30 line-through"
                  : size === s
                    ? "border-cocoa bg-cocoa text-cream"
                    : "border-sand hover:border-cocoa"
              }`}
            >
              {s}
            </button>
          );
        })}
      </div>

      <button
        onClick={onAdd}
        disabled={soldOut}
        className="label mt-6 w-full bg-cocoa py-4 text-cream transition-colors hover:bg-cocoa/85 disabled:cursor-not-allowed disabled:bg-cocoa/40"
      >
        {soldOut ? "Sold out" : "Add to bag"}
      </button>
    </div>
  );
}
