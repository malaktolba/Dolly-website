import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { countByStatus, listOrders } from "@/lib/db";
import { formatEGP } from "@/lib/catalog";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/orders";
import AdminBar from "./AdminBar";
import StatusBadge from "./StatusBadge";
import { cairoTime } from "./format";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  await requireAdmin();
  const { status: raw } = await searchParams;
  const status = ORDER_STATUSES.includes(raw as OrderStatus) ? (raw as OrderStatus) : undefined;
  const [orders, counts] = await Promise.all([listOrders(status), countByStatus()]);
  const all = Object.values(counts).reduce((a, b) => a + (b ?? 0), 0);

  const tab = (active: boolean) =>
    `label whitespace-nowrap border px-4 py-2 ${active ? "border-cocoa bg-cocoa text-cream" : "border-sand hover:border-cocoa"}`;

  return (
    <>
      <AdminBar active="orders" />
      <div className="px-5 py-10 md:px-10">
        <h1 className="font-display text-5xl">Orders</h1>

        <nav className="no-scrollbar mt-8 flex gap-2 overflow-x-auto">
          <Link href="/admin" className={tab(!status)}>
            All ({all})
          </Link>
          {ORDER_STATUSES.map((s) => (
            <Link key={s} href={`/admin?status=${s}`} className={tab(status === s)}>
              {s} ({counts[s] ?? 0})
            </Link>
          ))}
        </nav>

        {orders.length === 0 ? (
          <p className="py-24 text-center font-display text-3xl italic text-cocoa-soft">No orders here yet.</p>
        ) : (
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-cocoa/20">
                  {["Order", "Date", "Customer", "Phone", "Region", "Total", "Status"].map((h) => (
                    <th key={h} className="label py-3 pr-4 font-medium text-cocoa-soft">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-b border-sand hover:bg-cream">
                    <td className="py-4 pr-4">
                      <Link href={`/admin/orders/${o.number}`} className="font-medium underline-offset-4 hover:underline">
                        {o.number}
                      </Link>
                    </td>
                    <td className="py-4 pr-4 text-cocoa-soft">{cairoTime(o.created_at)}</td>
                    <td className="py-4 pr-4">{o.name}</td>
                    <td className="py-4 pr-4">
                      <a href={`tel:${o.phone}`} className="hover:underline">
                        {o.phone}
                      </a>
                    </td>
                    <td className="py-4 pr-4 text-cocoa-soft">{o.region}</td>
                    <td className="py-4 pr-4 whitespace-nowrap">{formatEGP(o.total)}</td>
                    <td className="py-4">
                      <StatusBadge status={o.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
