import Image from "next/image";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { formatEGP, totalStock } from "@/lib/catalog";
import { getAllProducts } from "@/lib/store";
import { moveProductAction } from "../actions";
import AdminBar from "../AdminBar";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  await requireAdmin();
  const products = await getAllProducts(true);

  return (
    <>
      <AdminBar active="products" />
      <div className="px-5 py-10 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h1 className="font-display text-5xl">Products</h1>
          <Link href="/admin/products/new" className="label bg-cocoa px-6 py-3 text-cream hover:bg-cocoa/85">
            + New product
          </Link>
        </div>
        <p className="mt-3 text-sm text-cocoa-soft">The order here is the order customers see in the shop.</p>

        <ul className="mt-8 divide-y divide-sand border-y border-sand">
          {products.map((p, i) => {
            const stock = totalStock(p);
            return (
              <li key={p.id} className="flex items-center gap-4 py-3">
                <div className="flex flex-col">
                  {[-1, 1].map((d) => (
                    <form key={d} action={moveProductAction}>
                      <input type="hidden" name="id" value={p.id} />
                      <input type="hidden" name="direction" value={d} />
                      <button
                        disabled={(d < 0 && i === 0) || (d > 0 && i === products.length - 1)}
                        aria-label={d < 0 ? `Move ${p.name} up` : `Move ${p.name} down`}
                        className="h-6 w-6 text-cocoa-soft hover:text-cocoa disabled:opacity-20"
                      >
                        {d < 0 ? "▲" : "▼"}
                      </button>
                    </form>
                  ))}
                </div>
                <Link href={`/admin/products/${p.id}`} className="flex flex-1 items-center gap-4">
                  <div className="relative aspect-[3/4] w-14 shrink-0 bg-sand">
                    {p.images[0] && <Image src={p.images[0]} alt="" fill sizes="56px" className="object-cover" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-lg leading-tight">{p.name}</p>
                    <p className="text-xs text-cocoa-soft">
                      {p.code} · {p.category}
                    </p>
                  </div>
                  <div className="hidden text-right text-sm sm:block">
                    {formatEGP(p.salePrice ?? p.price)}
                    {p.salePrice && <span className="ml-2 text-cocoa-soft line-through">{p.price.toLocaleString()}</span>}
                  </div>
                  <div className="w-36 text-right text-xs text-cocoa-soft">
                    {p.sizes.map((s) => (
                      <span key={s} className={`ml-2 inline-block ${p.stock[s] === 0 ? "text-blush-deep" : ""}`}>
                        {s}: {p.stock[s]}
                      </span>
                    ))}
                  </div>
                  <div className="w-24 text-right">
                    {!p.visible ? (
                      <span className="label !text-[0.625rem] border border-cocoa/30 px-2 py-1 text-cocoa-soft">Hidden</span>
                    ) : stock === 0 ? (
                      <span className="label !text-[0.625rem] bg-blush px-2 py-1">Sold out</span>
                    ) : null}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
