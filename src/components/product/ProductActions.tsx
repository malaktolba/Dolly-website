"use client";

import { useState } from "react";
import { brand, type Product } from "@/lib/catalog";
import { useCart } from "@/components/cart/CartProvider";

export default function ProductActions({ product }: { product: Product }) {
  const { add } = useCart();
  const [size, setSize] = useState<string | null>(product.sizes.length === 1 ? product.sizes[0] : null);
  const [error, setError] = useState(false);

  const onAdd = () => {
    if (!size) {
      setError(true);
      return;
    }
    add(product.slug, size);
  };

  const whatsappText = encodeURIComponent(`Hi Dolly, I'd like to ask about the ${product.name} (${product.code}).`);

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between">
        <p className="label">Size{size ? `: ${size}` : ""}</p>
        {error && !size && <p className="label text-blush-deep">Please choose a size</p>}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {product.sizes.map((s) => (
          <button
            key={s}
            onClick={() => {
              setSize(s);
              setError(false);
            }}
            aria-pressed={size === s}
            className={`label min-w-14 border px-4 py-3 transition-colors ${
              size === s ? "border-cocoa bg-cocoa text-cream" : "border-sand hover:border-cocoa"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <button onClick={onAdd} className="label mt-6 w-full bg-cocoa py-4 text-cream transition-colors hover:bg-cocoa/85">
        Add to bag
      </button>
      <a
        href={`https://wa.me/${brand.whatsapp}?text=${whatsappText}`}
        target="_blank"
        rel="noreferrer"
        className="label mt-3 block w-full border border-cocoa py-4 text-center transition-colors hover:bg-cocoa hover:text-cream"
      >
        Ask on WhatsApp
      </a>
    </div>
  );
}
