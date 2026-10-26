"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { collections } from "@/lib/catalog";
import { useCart } from "@/components/cart/CartProvider";
import Wordmark from "@/components/ui/Wordmark";

const nav = [
  { href: "/lookbook", label: "Lookbook" },
  { href: "/about", label: "About" },
];

export default function Header() {
  const pathname = usePathname();
  const { count, open } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Header floats transparently over full-bleed heroes
  const overHero = pathname === "/" || pathname.startsWith("/collections/") || pathname === "/lookbook";
  const solid = !overHero || scrolled || shopOpen || menuOpen;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setShopOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <div className="relative z-50 bg-cocoa py-2 text-center text-cream">
        <p className="label !text-[0.625rem]">Cash on delivery across Egypt · Prices in EGP</p>
      </div>

      <header
        onMouseLeave={() => setShopOpen(false)}
        className={`sticky top-0 z-50 transition-colors duration-500 ${
          solid ? "bg-cream/95 text-cocoa backdrop-blur-sm" : "text-cream"
        } ${overHero ? "-mb-[68px]" : ""}`}
      >
        <div className="relative mx-auto grid h-[68px] grid-cols-[1fr_auto_1fr] items-center px-5 md:px-10">
          {/* Left */}
          <nav className="hidden items-center gap-8 md:flex">
            <button
              onMouseEnter={() => setShopOpen(true)}
              onClick={() => setShopOpen((v) => !v)}
              className="label link-line"
              aria-expanded={shopOpen}
            >
              Shop
            </button>
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className="label link-line">
                {n.label}
              </Link>
            ))}
          </nav>
          <button className="label md:hidden justify-self-start" onClick={() => setMenuOpen((v) => !v)}>
            {menuOpen ? "Close" : "Menu"}
          </button>

          {/* Centre */}
          <Link href="/" aria-label="Dolly home" className="justify-self-center">
            <Wordmark className="h-6 md:h-7" />
          </Link>

          {/* Right */}
          <div className="flex items-center justify-end gap-6 md:gap-8">
            <Link href="/search" className="label link-line hidden md:inline">
              Search
            </Link>
            <Link href="/contact" className="label link-line hidden md:inline">
              Contact
            </Link>
            <button onClick={open} className="label link-line">
              Bag ({count})
            </button>
          </div>
        </div>

        {/* Shop mega menu */}
        <div
          className={`absolute inset-x-0 top-full hidden overflow-hidden bg-cream transition-[max-height,opacity] duration-500 ease-soft md:block ${
            shopOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="grid grid-cols-4 gap-10 border-t border-sand px-10 py-10 text-cocoa">
            <div className="flex flex-col gap-3">
              <p className="label text-cocoa-soft">Shop</p>
              <Link href="/shop" className="font-display text-2xl hover:italic">
                All pieces
              </Link>
              <Link href="/shop?sale=1" className="font-display text-2xl hover:italic">
                Sale
              </Link>
            </div>
            {collections.map((c) => (
              <Link key={c.slug} href={`/collections/${c.slug}`} className="group flex flex-col gap-3">
                <p className="label text-cocoa-soft">{c.code}</p>
                <span className="font-display text-2xl group-hover:italic">{c.name}</span>
                <span className="text-sm text-cocoa-soft">{c.season}</span>
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-40 bg-cream pt-[100px] transition-opacity duration-500 md:hidden ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <nav className="flex flex-col gap-5 px-6">
          <Link href="/shop" className="font-display text-4xl">
            Shop all
          </Link>
          {collections.map((c) => (
            <Link key={c.slug} href={`/collections/${c.slug}`} className="font-display text-4xl">
              {c.name}
            </Link>
          ))}
          <div className="mt-6 flex flex-col gap-4 border-t border-sand pt-6">
            {[...nav, { href: "/search", label: "Search" }, { href: "/contact", label: "Contact" }].map((n) => (
              <Link key={n.href} href={n.href} className="label">
                {n.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </>
  );
}
