import type { Metadata } from "next";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import { getShippingZones } from "@/lib/store";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

export default async function CheckoutPage() {
  return <CheckoutForm shippingZones={await getShippingZones()} />;
}
