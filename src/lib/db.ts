import "server-only";
import { cfEnv } from "@/lib/cf";
import type { CollectionSlug, Category } from "@/lib/catalog";
import { newOrderNumber, type OrderItemRow, type OrderRow, type OrderStatus, type PricedOrder } from "@/lib/orders";

export class OutOfStockError extends Error {}

const isStockViolation = (err: unknown) => String(err).includes("CHECK constraint failed");

// ---------- Orders ----------

/** Saves the order and deducts stock in one transaction; throws OutOfStockError if any size would go below zero. */
export async function insertOrder(order: PricedOrder) {
  const { DB } = await cfEnv();
  const number = newOrderNumber();
  const statements = [
    DB.prepare(
      `INSERT INTO orders (number, name, phone, region, city, address, notes, subtotal, shipping, total)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).bind(number, order.name, order.phone, order.region, order.city, order.address, order.notes, order.subtotal, order.shipping, order.total),
    ...order.items.map((i) =>
      DB.prepare(
        `INSERT INTO order_items (order_id, product_id, slug, code, name, size, qty, unit_price, line_total)
         VALUES ((SELECT id FROM orders WHERE number = ?), ?, ?, ?, ?, ?, ?, ?, ?)`,
      ).bind(number, i.productId, i.slug, i.code, i.name, i.size, i.qty, i.unitPrice, i.lineTotal),
    ),
    ...order.items.map((i) =>
      DB.prepare("UPDATE product_sizes SET stock = stock - ? WHERE product_id = ? AND size = ?").bind(i.qty, i.productId, i.size),
    ),
  ];
  try {
    await DB.batch(statements);
  } catch (err) {
    if (isStockViolation(err)) throw new OutOfStockError();
    throw err;
  }
  return number;
}

export async function listOrders(status?: OrderStatus) {
  const { DB } = await cfEnv();
  const stmt = status
    ? DB.prepare("SELECT * FROM orders WHERE status = ? ORDER BY created_at DESC, id DESC LIMIT 200").bind(status)
    : DB.prepare("SELECT * FROM orders ORDER BY created_at DESC, id DESC LIMIT 200");
  return (await stmt.all<OrderRow>()).results;
}

export async function countByStatus() {
  const { DB } = await cfEnv();
  const { results } = await DB.prepare("SELECT status, COUNT(*) AS n FROM orders GROUP BY status").all<{ status: OrderStatus; n: number }>();
  return Object.fromEntries(results.map((r) => [r.status, r.n])) as Partial<Record<OrderStatus, number>>;
}

export async function getOrder(number: string) {
  const { DB } = await cfEnv();
  const order = await DB.prepare("SELECT * FROM orders WHERE number = ?").bind(number).first<OrderRow>();
  if (!order) return null;
  const { results: items } = await DB.prepare(
    "SELECT product_id, slug, code, name, size, qty, unit_price, line_total FROM order_items WHERE order_id = ? ORDER BY id",
  )
    .bind(order.id)
    .all<OrderItemRow>();
  return { order, items };
}

/**
 * Changes an order's status. Cancelling puts its items back in stock;
 * un-cancelling takes them out again (and fails if they've sold out meanwhile).
 */
export async function setOrderStatus(number: string, status: OrderStatus) {
  const { DB } = await cfEnv();
  const data = await getOrder(number);
  if (!data || data.order.status === status) return;
  const wasCancelled = data.order.status === "cancelled";
  const nowCancelled = status === "cancelled";
  const sign = nowCancelled && !wasCancelled ? 1 : wasCancelled && !nowCancelled ? -1 : 0;

  const statements = [DB.prepare("UPDATE orders SET status = ? WHERE number = ?").bind(status, number)];
  if (sign !== 0) {
    for (const i of data.items) {
      if (i.product_id === null) continue;
      statements.push(
        DB.prepare("UPDATE product_sizes SET stock = stock + ? WHERE product_id = ? AND size = ?").bind(sign * i.qty, i.product_id, i.size),
      );
    }
  }
  try {
    await DB.batch(statements);
  } catch (err) {
    if (isStockViolation(err)) throw new OutOfStockError();
    throw err;
  }
}

// ---------- Products ----------

export type ProductInput = {
  slug: string;
  code: string;
  name: string;
  price: number;
  salePrice: number | null;
  category: Category;
  color: string;
  style: string;
  description: string;
  modelWears: string;
  collections: CollectionSlug[];
  images: string[];
  visible: boolean;
  sizes: { size: string; stock: number }[];
};

export async function saveProduct(id: number | null, p: ProductInput) {
  const { DB } = await cfEnv();
  const fields = [
    p.slug, p.code, p.name, p.price, p.salePrice, p.category, p.color, p.style, p.description, p.modelWears,
    p.collections.join(","), JSON.stringify(p.images), p.visible ? 1 : 0,
  ];
  let productId = id;
  if (productId === null) {
    const res = await DB.prepare(
      `INSERT INTO products (slug, code, name, price, sale_price, category, color, style, description, model_wears, collections, images, visible, position)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, (SELECT COALESCE(MIN(position), 0) - 1 FROM products))`,
    )
      .bind(...fields)
      .run();
    productId = res.meta.last_row_id;
  } else {
    await DB.prepare(
      `UPDATE products SET slug = ?, code = ?, name = ?, price = ?, sale_price = ?, category = ?, color = ?, style = ?,
       description = ?, model_wears = ?, collections = ?, images = ?, visible = ? WHERE id = ?`,
    )
      .bind(...fields, productId)
      .run();
  }
  await DB.batch([
    DB.prepare("DELETE FROM product_sizes WHERE product_id = ?").bind(productId),
    ...p.sizes.map((s, i) =>
      DB.prepare("INSERT INTO product_sizes (product_id, size, stock, position) VALUES (?, ?, ?, ?)").bind(productId, s.size, s.stock, i),
    ),
  ]);
  return productId;
}

export async function deleteProduct(id: number) {
  const { DB } = await cfEnv();
  await DB.batch([
    DB.prepare("DELETE FROM product_sizes WHERE product_id = ?").bind(id),
    DB.prepare("DELETE FROM products WHERE id = ?").bind(id),
  ]);
}

export async function moveProduct(id: number, direction: -1 | 1) {
  const { DB } = await cfEnv();
  const { results } = await DB.prepare("SELECT id FROM products ORDER BY position, id").all<{ id: number }>();
  const ids = results.map((r) => r.id);
  const i = ids.indexOf(id);
  const j = i + direction;
  if (i < 0 || j < 0 || j >= ids.length) return;
  [ids[i], ids[j]] = [ids[j], ids[i]];
  await DB.batch(ids.map((pid, pos) => DB.prepare("UPDATE products SET position = ? WHERE id = ?").bind(pos, pid)));
}

export async function slugTaken(slug: string, exceptId: number | null) {
  const { DB } = await cfEnv();
  const row = await DB.prepare("SELECT id FROM products WHERE slug = ? AND id IS NOT ?").bind(slug, exceptId).first();
  return !!row;
}

// ---------- Shipping ----------

export async function saveShippingZones(zones: { name: string; fee: number }[]) {
  const { DB } = await cfEnv();
  await DB.batch([
    DB.prepare("DELETE FROM shipping_zones"),
    ...zones.map((z, i) => DB.prepare("INSERT INTO shipping_zones (name, fee, position) VALUES (?, ?, ?)").bind(z.name, z.fee, i)),
  ]);
}

// ---------- Settings ----------

export async function adminPassword() {
  return (await cfEnv()).ADMIN_PASSWORD;
}
