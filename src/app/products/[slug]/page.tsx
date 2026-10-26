import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductActions from "@/components/product/ProductActions";
import ProductCard from "@/components/product/ProductCard";
import Accordion from "@/components/ui/Accordion";
import { formatEGP, getCollection, getProduct, products } from "@/lib/catalog";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getProduct((await params).slug);
  return p ? { title: p.name, description: p.description, openGraph: { images: [p.images[0]] } } : {};
}

export default async function ProductPage({ params }: Props) {
  const product = getProduct((await params).slug);
  if (!product) notFound();
  const collection = getCollection(product.collections[0])!;
  const related = products
    .filter((p) => p.slug !== product.slug && p.collections.some((c) => product.collections.includes(c)))
    .slice(0, 4);

  return (
    <>
      <div className="grid md:grid-cols-12">
        {/* Gallery */}
        <div className="md:col-span-7">
          <div className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto md:block md:overflow-visible">
            {product.images.map((src, i) => (
              <div key={src} className="relative aspect-[3/4] w-full shrink-0 snap-start bg-sand md:mb-1">
                <Image
                  src={src}
                  alt={`${product.name}, view ${i + 1}`}
                  fill
                  priority={i === 0}
                  sizes="(min-width: 768px) 58vw, 100vw"
                  className="object-cover"
                />
                <span className="label absolute bottom-4 right-4 text-cream md:hidden">
                  {i + 1} / {product.images.length}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="px-5 pt-10 md:col-span-5 md:px-12 md:pt-16">
          <div className="md:sticky md:top-[100px]">
            <nav className="label text-cocoa-soft">
              <Link href="/shop" className="link-line">Shop</Link>
              <span className="mx-2">/</span>
              <Link href={`/collections/${collection.slug}`} className="link-line">{collection.name}</Link>
            </nav>
            <p className="label mt-10 text-cocoa-soft">{product.code}</p>
            <h1 className="mt-3 font-display text-4xl leading-[1.05] md:text-5xl">{product.name}</h1>
            <p className="mt-5 text-lg">
              {formatEGP(product.salePrice ?? product.price)}
              {product.salePrice && (
                <span className="ml-3 text-base text-cocoa-soft line-through">{formatEGP(product.price)}</span>
              )}
            </p>

            <p className="mt-8 max-w-md leading-relaxed text-cocoa-soft">{product.description}</p>

            <ProductActions product={product} />

            <div className="mt-10 border-t border-sand">
              <Accordion title="Details" defaultOpen>
                <dl className="grid grid-cols-[7rem_1fr] gap-y-2">
                  <dt className="text-cocoa-soft">Style</dt>
                  <dd>{product.style}</dd>
                  <dt className="text-cocoa-soft">Colour</dt>
                  <dd>{product.color}</dd>
                  <dt className="text-cocoa-soft">Collection</dt>
                  <dd>{collection.name}</dd>
                </dl>
              </Accordion>
              <Accordion title="Size & fit">
                <p>Model wears size {product.modelWears}.</p>
                <p className="mt-2">Available in {product.sizes.join(", ")}. Not sure? Message us on WhatsApp and we&apos;ll help you choose.</p>
              </Accordion>
              <Accordion title="Shipping & returns">
                <p>Delivered across Egypt in 3–7 working days. Cash on delivery.</p>
                <p className="mt-2">
                  Exchanges within 14 days. <Link href="/policies/refunds" className="underline">Read the policy</Link>.
                </p>
              </Accordion>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-32 px-5 md:px-10">
          <h2 className="mb-10 font-display text-4xl md:text-5xl">
            Complete the <span className="italic">look</span>
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-4 md:gap-x-6">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
