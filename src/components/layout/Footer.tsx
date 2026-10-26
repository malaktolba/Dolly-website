import Link from "next/link";
import { brand, collections } from "@/lib/catalog";
import { policies } from "@/lib/policies";
import NotifyForm from "@/components/ui/NotifyForm";

export default function Footer() {
  return (
    <footer className="mt-32 bg-cocoa text-cream">
      <div className="mx-auto grid gap-14 px-5 pt-20 pb-10 md:grid-cols-12 md:px-10">
        <div className="md:col-span-5">
          <p className="font-display text-3xl leading-tight md:text-4xl">
            Be the first to know
            <br />
            <span className="italic">when the next drop lands.</span>
          </p>
          <NotifyForm tone="dark" className="mt-8 max-w-md" />
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 md:col-span-7">
          <div className="flex flex-col gap-3">
            <p className="label text-cream/50">Shop</p>
            <Link href="/shop" className="text-sm link-line self-start">All pieces</Link>
            {collections.map((c) => (
              <Link key={c.slug} href={`/collections/${c.slug}`} className="text-sm link-line self-start">
                {c.name}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-3">
            <p className="label text-cream/50">Info</p>
            <Link href="/about" className="text-sm link-line self-start">About</Link>
            <Link href="/lookbook" className="text-sm link-line self-start">Lookbook</Link>
            {policies.map((p) => (
              <Link key={p.slug} href={`/policies/${p.slug}`} className="text-sm link-line self-start">
                {p.title}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-3">
            <p className="label text-cream/50">Contact</p>
            <a href={`https://wa.me/${brand.whatsapp}`} target="_blank" rel="noreferrer" className="text-sm link-line self-start">
              WhatsApp
            </a>
            <a href={`mailto:${brand.email}`} className="text-sm link-line self-start">Email</a>
            <a href={brand.instagram} target="_blank" rel="noreferrer" className="text-sm link-line self-start">
              Instagram
            </a>
            <p className="text-sm text-cream/60">{brand.phone}</p>
          </div>
        </div>
      </div>

      <div className="overflow-hidden px-5 md:px-10">
        <p className="font-display text-center text-[24vw] leading-[0.8] tracking-[0.06em] text-cream/95 select-none">
          DOLLY
        </p>
      </div>
      <div className="flex flex-col justify-between gap-2 px-5 py-6 text-cream/50 md:flex-row md:px-10">
        <p className="label">© {new Date().getFullYear()} Dolly. All rights reserved.</p>
        <p className="label">Designed in Egypt</p>
      </div>
    </footer>
  );
}
