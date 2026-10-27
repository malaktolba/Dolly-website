import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { insertOrder, OutOfStockError } from "@/lib/db";
import { notifyNewOrder } from "@/lib/notify";
import { priceOrder } from "@/lib/orders";
import { getProducts, getShippingZones } from "@/lib/store";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: real customers never fill this hidden field
  if (body.website) return NextResponse.json({ number: "DL-000000", total: 0 });

  const [products, zones] = await Promise.all([getProducts(), getShippingZones()]);
  const priced = priceOrder(body, products, zones);
  if (!priced.ok) return NextResponse.json({ error: priced.error }, { status: 422 });

  try {
    const number = await insertOrder(priced.order);
    // Stock changed: refresh cached shop pages so sold-out sizes show
    revalidatePath("/", "layout");
    const { env, ctx } = await getCloudflareContext({ async: true });
    ctx.waitUntil(notifyNewOrder(env, number, priced.order));
    return NextResponse.json({ number, total: priced.order.total });
  } catch (err) {
    if (err instanceof OutOfStockError) {
      return NextResponse.json({ error: "Sorry, one of your items just sold out. Please review your bag." }, { status: 409 });
    }
    console.error("Failed to save order", err);
    return NextResponse.json({ error: "We couldn't place your order. Please try again." }, { status: 500 });
  }
}
