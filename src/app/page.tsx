import Image from "next/image";
import Link from "next/link";
import HeroSlider from "@/components/home/HeroSlider";
import ProductCard from "@/components/product/ProductCard";
import Reveal from "@/components/ui/Reveal";
import NotifyForm from "@/components/ui/NotifyForm";
import { collections, formatEGP } from "@/lib/catalog";
import { getProducts } from "@/lib/store";

export default async function Home() {
  const all = await getProducts();
  const summer = all.filter((p) => p.collections.includes("summer-26"));
  // Spotlight: the brown coat if it's still listed, otherwise the first piece on sale, otherwise the first piece
  const spotlight = all.find((p) => p.slug === "brown-coat") ?? all.find((p) => p.salePrice) ?? all[0];
  const featureImage = summer.find((p) => p.images.length > 1)?.images[1] ?? collections[0].cover;

  return (
    <>
      <HeroSlider
        slides={collections.map((c) => ({ image: c.cover, title: c.name, href: `/collections/${c.slug}` }))}
      />

      {/* Statement */}
      <section className="mx-auto max-w-3xl px-6 py-28 text-center md:py-40">
        <Reveal>
          <p className="label text-cocoa-soft">The house of Dolly</p>
          <p className="mt-8 font-display text-3xl leading-[1.25] md:text-[2.75rem]">
            Pieces for the woman who wants to be <span className="italic">remembered</span>. Made in small seasonal drops,
            each one designed in Egypt with time, care and a little sparkle.
          </p>
        </Reveal>
      </section>

      {/* Featured drop */}
      <section className="grid gap-10 px-5 md:grid-cols-2 md:gap-6 md:px-10">
        <Reveal className="md:sticky md:top-[88px] md:self-start">
          <Link href="/collections/summer-26" className="group relative block aspect-[4/5] overflow-hidden bg-sand">
            <Image
              src={featureImage}
              alt="Summer '26 campaign"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-[1.6s] ease-soft group-hover:scale-[1.03]"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-cocoa/60 to-transparent p-6 text-cream md:p-8">
              <p className="label">New drop · SS26</p>
              <p className="mt-2 font-display text-5xl md:text-6xl">Summer &apos;26</p>
            </div>
          </Link>
        </Reveal>
        <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-6">
          {summer.map((p, i) => (
            <Reveal key={p.slug} delay={i * 80}>
              <ProductCard product={p} />
            </Reveal>
          ))}
          <Reveal className="col-span-2">
            <Link href="/collections/summer-26" className="label link-line">
              View the collection →
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Collections */}
      <section className="mt-32 px-5 md:mt-48 md:px-10">
        <Reveal className="mb-10 flex items-end justify-between">
          <h2 className="font-display text-4xl md:text-6xl">The collections</h2>
          <Link href="/shop" className="label link-line hidden md:inline">
            Shop all
          </Link>
        </Reveal>
        <div className="grid gap-4 md:grid-cols-3 md:gap-6">
          {collections.map((c, i) => (
            <Reveal key={c.slug} delay={i * 100}>
              <Link href={`/collections/${c.slug}`} className="group relative block aspect-[3/4] overflow-hidden bg-sand">
                <Image
                  src={c.cover}
                  alt={c.name}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-[1.6s] ease-soft group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-cocoa/15 transition-colors duration-700 group-hover:bg-cocoa/30" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-cream">
                  <p className="label">{c.code}</p>
                  <p className="mt-3 px-4 text-center font-display text-4xl md:text-3xl lg:text-5xl">{c.name}</p>
                  <p className="label mt-6 border-b border-cream/70 pb-1">Explore</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Spotlight */}
      {spotlight && spotlight.images.length > 0 && (
      <section className="mt-32 grid items-center gap-10 px-5 md:mt-48 md:grid-cols-12 md:px-10">
        <Reveal className="md:col-span-6 md:col-start-1">
          <div className="relative aspect-[4/5] overflow-hidden bg-sand">
            <Image
              src={spotlight.images[1] ?? spotlight.images[0]}
              alt={spotlight.name}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </Reveal>
        <Reveal className="md:col-span-4 md:col-start-8" delay={150}>
          <p className="label text-cocoa-soft">{spotlight.code} · {spotlight.color}</p>
          <h2 className="mt-4 font-display text-5xl leading-none md:text-6xl">{spotlight.name}</h2>
          <p className="mt-8 leading-relaxed text-cocoa-soft">{spotlight.description}</p>
          <p className="mt-4 leading-relaxed text-cocoa-soft">{spotlight.style}.</p>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link href={`/products/${spotlight.slug}`} className="label whitespace-nowrap bg-cocoa px-8 py-4 text-cream transition-colors hover:bg-cocoa/85">
              Shop now
            </Link>
            <p className="whitespace-nowrap text-sm">
              {formatEGP(spotlight.salePrice ?? spotlight.price)}
              {spotlight.salePrice && <span className="ml-2 text-cocoa-soft line-through">{spotlight.price.toLocaleString()}</span>}
            </p>
          </div>
        </Reveal>
      </section>
      )}

      {/* Notify */}
      <section className="mx-auto mt-32 max-w-2xl px-6 text-center md:mt-48">
        <Reveal>
          <p className="label text-cocoa-soft">Small drops, limited pieces</p>
          <h2 className="mt-6 font-display text-4xl md:text-5xl">
            Hear about the next one <span className="italic">first.</span>
          </h2>
          <NotifyForm className="mx-auto mt-10 max-w-md" />
        </Reveal>
      </section>
    </>
  );
}
