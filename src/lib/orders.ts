import { priceOf, type Product, type ShippingZone } from "@/lib/catalog";

export const ORDER_STATUSES = ["new", "confirmed", "shipped", "delivered", "cancelled"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const PHONE_PATTERN = "^(\\+?20)?0?1[0125][0-9]{8}$";

export type PricedOrder = {
  name: string;
  phone: string;
  region: string;
  city: string;
  address: string;
  notes: string | null;
  items: {
    productId: number;
    slug: string;
    code: string;
    name: string;
    size: string;
    qty: number;
    unitPrice: number;
    lineTotal: number;
  }[];
  subtotal: number;
  shipping: number;
  total: number;
};

export type OrderRow = {
  id: number;
  number: string;
  created_at: string;
  status: OrderStatus;
  name: string;
  phone: string;
  region: string;
  city: string;
  address: string;
  notes: string | null;
  subtotal: number;
  shipping: number;
  total: number;
};

export type OrderItemRow = {
  product_id: number | null;
  slug: string;
  code: string;
  name: string;
  size: string;
  qty: number;
  unit_price: number;
  line_total: number;
};

const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/**
 * Validates checkout input and prices it from the live catalogue.
 * Client prices are never trusted. Stock is checked here for a friendly message;
 * the database constraint is what actually prevents overselling.
 */
export function priceOrder(
  input: unknown,
  products: Product[],
  zones: ShippingZone[],
): { ok: true; order: PricedOrder } | { ok: false; error: string } {
  const body = (input ?? {}) as Record<string, unknown>;
  const name = text(body.name, 100);
  const phone = text(body.phone, 20).replace(/[\s-]/g, "");
  const region = text(body.region, 50);
  const city = text(body.city, 100);
  const address = text(body.address, 300);
  const notes = text(body.notes, 500) || null;

  if (name.length < 2) return { ok: false, error: "Please enter your full name." };
  if (!new RegExp(PHONE_PATTERN).test(phone)) return { ok: false, error: "Please enter a valid Egyptian mobile number." };
  const zone = zones.find((z) => z.name === region);
  if (!zone) return { ok: false, error: "Please choose a delivery region." };
  if (city.length < 2 || address.length < 5) return { ok: false, error: "Please enter your full address." };

  const rawItems = Array.isArray(body.items) ? body.items.slice(0, 20) : [];
  const items: PricedOrder["items"] = [];
  for (const raw of rawItems) {
    const r = (raw ?? {}) as Record<string, unknown>;
    const product = products.find((p) => p.slug === String(r.slug));
    const size = String(r.size);
    const qty = Number(r.qty);
    if (!product || !product.sizes.includes(size) || !Number.isInteger(qty) || qty < 1 || qty > 10) {
      return { ok: false, error: "One of the items in your bag is no longer available." };
    }
    const already = items.filter((i) => i.productId === product.id && i.size === size).reduce((n, i) => n + i.qty, 0);
    if ((product.stock[size] ?? 0) < already + qty) {
      const left = product.stock[size] ?? 0;
      return {
        ok: false,
        error: left === 0 ? `${product.name} in size ${size} just sold out.` : `Only ${left} left of ${product.name} in size ${size}.`,
      };
    }
    const unitPrice = priceOf(product);
    items.push({
      productId: product.id,
      slug: product.slug,
      code: product.code,
      name: product.name,
      size,
      qty,
      unitPrice,
      lineTotal: unitPrice * qty,
    });
  }
  if (items.length === 0) return { ok: false, error: "Your bag is empty." };

  const subtotal = items.reduce((n, i) => n + i.lineTotal, 0);
  return {
    ok: true,
    order: { name, phone, region, city, address, notes, items, subtotal, shipping: zone.fee, total: subtotal + zone.fee },
  };
}

export function newOrderNumber() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return "DL-" + Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}
