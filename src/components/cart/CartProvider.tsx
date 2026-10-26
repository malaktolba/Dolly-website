"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getProduct, priceOf, type Product } from "@/lib/catalog";

export type CartLine = { slug: string; size: string; qty: number };
export type CartItem = CartLine & { product: Product; lineTotal: number };

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (slug: string, size: string, qty?: number) => void;
  setQty: (slug: string, size: string, qty: number) => void;
  remove: (slug: string, size: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "dolly-bag";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setLines(JSON.parse(saved));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {}
  }, [lines, loaded]);

  const add = useCallback((slug: string, size: string, qty = 1) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.slug === slug && l.size === size);
      if (existing) {
        return prev.map((l) => (l === existing ? { ...l, qty: l.qty + qty } : l));
      }
      return [...prev, { slug, size, qty }];
    });
    setIsOpen(true);
  }, []);

  const setQty = useCallback((slug: string, size: string, qty: number) => {
    setLines((prev) =>
      prev
        .map((l) => (l.slug === slug && l.size === size ? { ...l, qty } : l))
        .filter((l) => l.qty > 0),
    );
  }, []);

  const remove = useCallback((slug: string, size: string) => {
    setLines((prev) => prev.filter((l) => !(l.slug === slug && l.size === size)));
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const items = lines.flatMap((l) => {
      const product = getProduct(l.slug);
      return product ? [{ ...l, product, lineTotal: priceOf(product) * l.qty }] : [];
    });
    return {
      items,
      count: items.reduce((n, i) => n + i.qty, 0),
      subtotal: items.reduce((n, i) => n + i.lineTotal, 0),
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      add,
      setQty,
      remove,
      clear: () => setLines([]),
    };
  }, [lines, isOpen, add, setQty, remove]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
