import { requireAdmin } from "@/lib/auth";
import { getShippingZones } from "@/lib/store";
import AdminBar from "../AdminBar";
import ShippingForm from "./ShippingForm";

export const dynamic = "force-dynamic";

export default async function AdminShippingPage() {
  await requireAdmin();
  const zones = await getShippingZones();
  return (
    <>
      <AdminBar active="shipping" />
      <div className="max-w-2xl px-5 py-10 md:px-10">
        <h1 className="font-display text-5xl">Shipping</h1>
        <p className="mt-3 text-sm text-cocoa-soft">
          Customers choose one of these regions at checkout and pay its fee on delivery.
        </p>
        <ShippingForm initial={zones.map((z) => ({ name: z.name, fee: String(z.fee) }))} />
      </div>
    </>
  );
}
