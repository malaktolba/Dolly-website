"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { brand, formatEGP, shippingZones } from "@/lib/catalog";
import { useCart } from "@/components/cart/CartProvider";

type Placed = { number: string; summary: string; total: number; name: string };

const field =
  "w-full border-b border-cocoa/25 bg-transparent py-3 text-sm outline-none placeholder:text-cocoa/40 focus:border-cocoa";

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const [zone, setZone] = useState("");
  const [placed, setPlaced] = useState<Placed | null>(null);

  const shipping = shippingZones.find((z) => z.name === zone)?.fee ?? 0;
  const total = subtotal + shipping;

  // Front-end only: the order is not stored yet. It's summarised for WhatsApp confirmation.
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const number = `DL-${Date.now().toString().slice(-6)}`;
    const lines = items.map((i) => `• ${i.product.name} (${i.size}) × ${i.qty}: ${formatEGP(i.lineTotal)}`).join("\n");
    const summary = [
      `New order ${number}`,
      lines,
      `Shipping (${zone}): ${formatEGP(shipping)}`,
      `Total: ${formatEGP(total)}`,
      "",
      `Name: ${data.get("name")}`,
      `Phone: ${data.get("phone")}`,
      `Address: ${data.get("address")}, ${data.get("city")}, ${zone}`,
      data.get("notes") ? `Notes: ${data.get("notes")}` : "",
    ]
      .filter(Boolean)
      .join("\n");
    setPlaced({ number, summary, total, name: String(data.get("name")).split(" ")[0] });
    clear();
    window.scrollTo({ top: 0 });
  };

  if (placed) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center md:py-36">
        <p className="label text-cocoa-soft">Order {placed.number}</p>
        <h1 className="mt-6 font-display text-5xl md:text-6xl">
          Thank you, <span className="italic">{placed.name}</span>.
        </h1>
        <p className="mt-8 leading-relaxed text-cocoa-soft">
          Your order total is {formatEGP(placed.total)}, paid in cash on delivery. To confirm it, send us your order on
          WhatsApp and we&apos;ll reply with your delivery date.
        </p>
        <a
          href={`https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(placed.summary)}`}
          target="_blank"
          rel="noreferrer"
          className="label mt-10 inline-block bg-cocoa px-10 py-4 text-cream hover:bg-cocoa/85"
        >
          Confirm on WhatsApp
        </a>
        <div className="mt-6">
          <Link href="/shop" className="label link-line">
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="px-6 py-36 text-center">
        <h1 className="font-display text-5xl italic">Your bag is empty.</h1>
        <Link href="/shop" className="label mt-10 inline-block border border-cocoa px-8 py-4 hover:bg-cocoa hover:text-cream">
          Explore the shop
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-16 px-5 pt-16 md:grid-cols-12 md:px-10 md:pt-24">
      <form onSubmit={onSubmit} className="md:col-span-6 md:col-start-1">
        <h1 className="font-display text-5xl md:text-6xl">Checkout</h1>

        <fieldset className="mt-12 grid gap-6">
          <legend className="label mb-2 text-cocoa-soft">Contact</legend>
          <input name="name" required placeholder="Full name" autoComplete="name" className={field} />
          <input
            name="phone"
            required
            type="tel"
            inputMode="tel"
            pattern="^(\+?20)?0?1[0125][0-9]{8}$"
            title="Egyptian mobile number, e.g. 01012345678"
            placeholder="Mobile number (WhatsApp)"
            autoComplete="tel"
            className={field}
          />
        </fieldset>

        <fieldset className="mt-12 grid gap-6">
          <legend className="label mb-2 text-cocoa-soft">Delivery</legend>
          <select name="zone" required value={zone} onChange={(e) => setZone(e.target.value)} className={`${field} cursor-pointer`}>
            <option value="" disabled>
              Region
            </option>
            {shippingZones.map((z) => (
              <option key={z.name} value={z.name}>
                {z.name}: {formatEGP(z.fee)}
              </option>
            ))}
          </select>
          <input name="city" required placeholder="City / area" className={field} />
          <input name="address" required placeholder="Street, building, floor, apartment" autoComplete="street-address" className={field} />
          <textarea name="notes" rows={2} placeholder="Notes for delivery (optional)" className={`${field} resize-none`} />
        </fieldset>

        <fieldset className="mt-12">
          <legend className="label mb-4 text-cocoa-soft">Payment</legend>
          <label className="flex items-center gap-3 border border-cocoa px-5 py-4 text-sm">
            <input type="radio" name="payment" defaultChecked className="accent-cocoa" />
            Cash on delivery
          </label>
          <p className="mt-3 text-xs text-cocoa-soft">Card payments are coming soon.</p>
        </fieldset>

        <button type="submit" className="label mt-12 w-full bg-cocoa py-5 text-cream transition-colors hover:bg-cocoa/85">
          Place order · {formatEGP(total)}
        </button>
      </form>

      <aside className="md:col-span-5 md:col-start-8">
        <div className="bg-paper p-6 md:sticky md:top-[100px] md:p-8">
          <p className="label">Your bag</p>
          <ul className="mt-6 divide-y divide-sand">
            {items.map((i) => (
              <li key={`${i.slug}-${i.size}`} className="flex gap-4 py-4">
                <div className="relative aspect-[3/4] w-16 shrink-0 bg-sand">
                  <Image src={i.product.images[0]} alt={i.product.name} fill sizes="64px" className="object-cover" />
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-cocoa text-[10px] text-cream">
                    {i.qty}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-display leading-tight">{i.product.name}</p>
                  <p className="mt-1 text-xs text-cocoa-soft">Size {i.size}</p>
                </div>
                <p className="text-sm">{formatEGP(i.lineTotal)}</p>
              </li>
            ))}
          </ul>
          <dl className="mt-4 grid grid-cols-2 gap-y-2 border-t border-sand pt-4 text-sm">
            <dt className="text-cocoa-soft">Subtotal</dt>
            <dd className="text-right">{formatEGP(subtotal)}</dd>
            <dt className="text-cocoa-soft">Shipping</dt>
            <dd className="text-right">{zone ? formatEGP(shipping) : "Choose a region"}</dd>
            <dt className="label mt-3">Total</dt>
            <dd className="mt-3 text-right font-display text-xl">{formatEGP(total)}</dd>
          </dl>
        </div>
      </aside>
    </div>
  );
}
