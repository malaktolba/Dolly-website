import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import { collections } from "@/lib/catalog";
import { getProducts } from "@/lib/store";

export const metadata: Metadata = { title: "Lookbook" };

// Editorial layout pattern repeated per collection: wide, tall, tall, wide…
const spans = ["md:col-span-7", "md:col-span-5 md:mt-40", "md:col-span-5", "md:col-span-6 md:col-start-7 md:-mt-24"];

export default async function LookbookPage() {
  const cover = collections[0].cover;
  const all = await getProducts();
  return (
    <>
      <section className="relative h-[90svh] min-h-[520px] overflow-hidden bg-cocoa text-cream">
        <Image src={cover} alt="Dolly lookbook" fill priority sizes="100vw" className="object-cover object-[center_25%]" />
        <div className="absolute inset-0 bg-cocoa/30" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <p className="label">Lookbook</p>
          <h1 className="mt-4 font-display text-7xl italic md:text-[9rem]">Our world</h1>
        </div>
      </section>

      {collections.map((c) => {
        const shots = all.filter((p) => p.collections.includes(c.slug)).flatMap((p) => p.images.slice(0, 2).map((src) => ({ src, p }))).slice(0, 4);
        return (
          <section key={c.slug} className="mt-28 px-5 md:mt-44 md:px-10">
            <Reveal className="mb-12 flex items-end justify-between border-b border-sand pb-6">
              <div>
                <p className="label text-cocoa-soft">{c.code} · {c.season}</p>
                <h2 className="mt-3 font-display text-5xl md:text-7xl">{c.name}</h2>
              </div>
              <Link href={`/collections/${c.slug}`} className="label link-line">
                Shop
              </Link>
            </Reveal>
            <div className="grid gap-6 md:grid-cols-12">
              {shots.map(({ src, p }, i) => (
                <Reveal key={src} className={spans[i % spans.length]}>
                  <Link href={`/products/${p.slug}`} className="group block">
                    <div className="relative aspect-[4/5] overflow-hidden bg-sand">
                      <Image
                        src={src}
                        alt={p.name}
                        fill
                        sizes="(min-width: 768px) 55vw, 100vw"
                        className="object-cover transition-transform duration-[1.6s] ease-soft group-hover:scale-[1.03]"
                      />
                    </div>
                    <p className="label mt-3 text-cocoa-soft">
                      {p.code} — {p.name}
                    </p>
                  </Link>
                </Reveal>
              ))}
            </div>
          </section>
        );
      })}
    </>
  );
}
