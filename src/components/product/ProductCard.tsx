import Image from "next/image";
import Link from "next/link";
import { formatEGP, isSoldOut, type Product } from "@/lib/catalog";

export default function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const [first, second] = product.images;
  const soldOut = isSoldOut(product);
  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-sand">
        {first && (
          <Image
            src={first}
            alt={product.name}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 25vw, 50vw"
            className={`object-cover transition-all duration-[1.2s] ease-soft group-hover:scale-[1.03] ${second ? "group-hover:opacity-0" : ""} ${soldOut ? "opacity-70" : ""}`}
          />
        )}
        {second && (
          <Image
            src={second}
            alt=""
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="object-cover opacity-0 transition-opacity duration-[1.2s] ease-soft group-hover:opacity-100"
          />
        )}
        {soldOut ? (
          <span className="label absolute left-3 top-3 bg-cream px-2 py-1 text-cocoa">Sold out</span>
        ) : (
          product.salePrice && <span className="label absolute left-3 top-3 bg-blush px-2 py-1 text-cocoa">Sale</span>
        )}
      </div>
      <div className="mt-4 flex flex-col gap-1 md:flex-row md:items-start md:justify-between md:gap-3">
        <div>
          <p className="label text-cocoa-soft">{product.code}</p>
          <p className="mt-1 font-display text-lg leading-snug">{product.name}</p>
        </div>
        <p className="shrink-0 text-sm md:pt-[1.1rem]">
          {product.salePrice ? (
            <>
              <span>{formatEGP(product.salePrice)}</span>
              <span className="ml-2 text-cocoa-soft line-through">{product.price.toLocaleString()}</span>
            </>
          ) : (
            formatEGP(product.price)
          )}
        </p>
      </div>
    </Link>
  );
}
