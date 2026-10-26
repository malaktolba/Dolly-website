import type { Metadata } from "next";
import { brand } from "@/lib/catalog";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  const rows = [
    { label: "WhatsApp", value: brand.phone, href: `https://wa.me/${brand.whatsapp}` },
    { label: "Email", value: brand.email, href: `mailto:${brand.email}` },
    { label: "Instagram", value: "Follow Dolly", href: brand.instagram },
  ];
  return (
    <div className="px-5 pt-20 md:px-10 md:pt-32">
      <p className="label text-cocoa-soft">Contact</p>
      <h1 className="mt-6 max-w-4xl font-display text-5xl leading-[1.05] md:text-8xl">
        We&apos;d love to <span className="italic">hear</span> from you.
      </h1>
      <p className="mt-8 max-w-lg leading-relaxed text-cocoa-soft">
        Questions about sizing, an order or a piece you love? The quickest way to reach us is WhatsApp.
      </p>
      <ul className="mt-16 border-t border-sand">
        {rows.map((r) => (
          <li key={r.label}>
            <a
              href={r.href}
              target={r.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="group flex flex-col gap-2 border-b border-sand py-8 md:flex-row md:items-baseline md:justify-between"
            >
              <span className="label text-cocoa-soft">{r.label}</span>
              <span className="font-display text-3xl transition-all group-hover:italic md:text-5xl">{r.value} →</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
