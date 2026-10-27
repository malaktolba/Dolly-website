import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getOrder } from "@/lib/db";
import { formatEGP } from "@/lib/catalog";
import StatusForm from "./StatusForm";
import AdminBar from "../../AdminBar";
import StatusBadge from "../../StatusBadge";
import { cairoTime } from "../../format";

export const dynamic = "force-dynamic";

export default async function AdminOrderPage({ params }: { params: Promise<{ number: string }> }) {
  await requireAdmin();
  const data = await getOrder((await params).number);
  if (!data) notFound();
  const { order, items } = data;

  return (
    <>
      <AdminBar />
      <div className="px-5 py-10 md:px-10">
        <Link href="/admin" className="label link-line text-cocoa-soft">
          ← All orders
        </Link>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <h1 className="font-display text-5xl">{order.number}</h1>
          <StatusBadge status={order.status} />
        </div>
        <p className="mt-2 text-sm text-cocoa-soft">Placed {cairoTime(order.created_at)} · Cash on delivery</p>

        <div className="mt-10 grid gap-10 md:grid-cols-12">
          <section className="md:col-span-7">
            <p className="label text-cocoa-soft">Items</p>
            <ul className="mt-4 divide-y divide-sand border-y border-sand">
              {items.map((i, idx) => (
                <li key={idx} className="flex items-center justify-between gap-4 py-4 text-sm">
                  <div>
                    <p className="font-display text-lg">{i.name}</p>
                    <p className="text-cocoa-soft">
                      {i.code} · Size {i.size} · {i.qty} × {formatEGP(i.unit_price)}
                    </p>
                  </div>
                  <p className="whitespace-nowrap">{formatEGP(i.line_total)}</p>
                </li>
              ))}
            </ul>
            <dl className="mt-4 grid max-w-xs grid-cols-2 gap-y-2 text-sm md:ml-auto">
              <dt className="text-cocoa-soft">Subtotal</dt>
              <dd className="text-right">{formatEGP(order.subtotal)}</dd>
              <dt className="text-cocoa-soft">Shipping</dt>
              <dd className="text-right">{formatEGP(order.shipping)}</dd>
              <dt className="label mt-2">Total to collect</dt>
              <dd className="mt-2 text-right font-display text-xl">{formatEGP(order.total)}</dd>
            </dl>
          </section>

          <aside className="space-y-8 md:col-span-4 md:col-start-9">
            <div className="bg-cream p-6">
              <p className="label text-cocoa-soft">Customer</p>
              <p className="mt-3 font-display text-xl">{order.name}</p>
              <a href={`tel:${order.phone}`} className="mt-1 block text-sm underline underline-offset-4">
                {order.phone}
              </a>
              <p className="label mt-6 text-cocoa-soft">Deliver to</p>
              <p className="mt-3 text-sm leading-relaxed">
                {order.address}
                <br />
                {order.city}, {order.region}
              </p>
              {order.notes && (
                <>
                  <p className="label mt-6 text-cocoa-soft">Notes</p>
                  <p className="mt-3 text-sm leading-relaxed">{order.notes}</p>
                </>
              )}
            </div>

            <StatusForm number={order.number} status={order.status} />
          </aside>
        </div>
      </div>
    </>
  );
}
