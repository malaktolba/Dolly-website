import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import ShopGrid from "@/components/shop/ShopGrid";
import Reveal from "@/components/ui/Reveal";
import { collections, getCollection } from "@/lib/catalog";
import { productsIn } from "@/lib/store";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = getCollection((await params).slug);
  return c ? { title: c.name, description: c.intro } : {};
}

export default async function CollectionPage({ params }: Props) {
  const collection = getCollection((await params).slug);
  if (!collection) notFound();
  const items = await productsIn(collection.slug);

  return (
    <>
      <section className="relative h-[85svh] min-h-[520px] overflow-hidden bg-cocoa text-cream">
        <Image src={collection.cover} alt={collection.name} fill priority sizes="100vw" className="object-cover object-[center_30%]" />
        <div className="absolute inset-0 bg-gradient-to-b from-cocoa/30 via-transparent to-cocoa/55" />
        <div className="absolute inset-x-0 bottom-0 px-5 pb-12 md:px-10 md:pb-16">
          <p className="label">{collection.code} · {collection.season}</p>
          <h1 className="mt-4 font-display text-7xl leading-[0.9] md:text-[10rem]">{collection.name}</h1>
        </div>
      </section>

      <Reveal className="mx-auto max-w-2xl px-6 py-24 text-center md:py-32">
        <p className="font-display text-2xl leading-relaxed md:text-3xl">{collection.intro}</p>
      </Reveal>

      <div className="px-5 md:px-10">
        <ShopGrid products={items} showCollectionFilter={false} />
      </div>
    </>
  );
}
