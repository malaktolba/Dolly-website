"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { priceOf, type Product } from "@/lib/catalog";

/** A bag line keeps a snapshot of the product for display; the server re-prices everything at checkout. */
export type CartItem = {
  slug: string;
  size: string;
  qty: number;
  name: string;
  code: string;
  image: string;
  price: number;
  lineTotal: number;
};

type CartLine = Omit<CartItem, "lineTotal">;

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (product: Product, size: string, qty?: number) => void;
  setQty: (slug: string, size: string, qty: number) => void;
  remove: (slug: string, size: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "dolly-bag-v2";

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

  const add = useCallback((product: Product, size: string, qty = 1) => {
    const max = product.stock[size] ?? 0;
    setLines((prev) => {
      const existing = prev.find((l) => l.slug === product.slug && l.size === size);
      if (existing) {
        return prev.map((l) => (l === existing ? { ...l, qty: Math.min(l.qty + qty, max) } : l));
      }
      return [
        ...prev,
        {
          slug: product.slug,
          size,
          qty: Math.min(qty, max),
          name: product.name,
          code: product.code,
          image: product.images[0] ?? "",
          price: priceOf(product),
        },
      ];
    });
    setIsOpen(true);
  }, []);

  const setQty = useCallback((slug: string, size: string, qty: number) => {
    setLines((prev) =>
      prev
        .map((l) => (l.slug === slug && l.size === size ? { ...l, qty: Math.min(qty, 10) } : l))
        .filter((l) => l.qty > 0),
    );
  }, []);

  const remove = useCallback((slug: string, size: string) => {
    setLines((prev) => prev.filter((l) => !(l.slug === slug && l.size === size)));
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const items = lines.map((l) => ({ ...l, lineTotal: l.price * l.qty }));
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
