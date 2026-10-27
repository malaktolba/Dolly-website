"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { formatEGP } from "@/lib/catalog";
import { useCart } from "./CartProvider";
import QtyStepper from "./QtyStepper";

export default function CartDrawer() {
  const { items, subtotal, isOpen, close, setQty, remove, count } = useCart();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  return (
    <div className={`fixed inset-0 z-[60] ${isOpen ? "" : "pointer-events-none"}`} aria-hidden={!isOpen}>
      <div
        onClick={close}
        className={`absolute inset-0 bg-cocoa/30 transition-opacity duration-500 ${isOpen ? "opacity-100" : "opacity-0"}`}
      />
      <aside
        role="dialog"
        aria-label="Shopping bag"
        data-lenis-prevent
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-paper transition-transform duration-700 ease-soft ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-sand px-6 py-5">
          <p className="label">Bag ({count})</p>
          <button onClick={close} className="label link-line">
            Close
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
            <p className="font-display text-3xl italic">Your bag is empty.</p>
            <Link href="/shop" onClick={close} className="label border border-cocoa px-8 py-4 hover:bg-cocoa hover:text-cream transition-colors">
              Explore the shop
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-sand overflow-y-auto px-6">
              {items.map((item) => (
                <li key={`${item.slug}-${item.size}`} className="flex gap-4 py-6">
                  <Link href={`/products/${item.slug}`} onClick={close} className="relative aspect-[3/4] w-24 shrink-0 bg-sand">
                    {item.image && <Image src={item.image} alt={item.name} fill sizes="96px" className="object-cover" />}
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <p className="label text-cocoa-soft">{item.code}</p>
                    <p className="mt-1 font-display text-lg leading-tight">{item.name}</p>
                    <p className="mt-1 text-sm text-cocoa-soft">Size {item.size}</p>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <QtyStepper value={item.qty} onChange={(q) => setQty(item.slug, item.size, q)} />
                      <p className="text-sm">{formatEGP(item.lineTotal)}</p>
                    </div>
                    <button onClick={() => remove(item.slug, item.size)} className="label mt-3 self-start text-cocoa-soft link-line">
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-sand px-6 py-6">
              <div className="flex justify-between text-sm">
                <span className="label">Subtotal</span>
                <span>{formatEGP(subtotal)}</span>
              </div>
              <p className="mt-2 text-xs text-cocoa-soft">Shipping calculated at checkout. Cash on delivery across Egypt.</p>
              <Link
                href="/checkout"
                onClick={close}
                className="label mt-5 block bg-cocoa py-4 text-center text-cream transition-colors hover:bg-cocoa/85"
              >
                Checkout
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
