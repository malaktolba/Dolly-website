"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ADMIN_COOKIE, requireAdmin, safeEqual, sessionToken } from "@/lib/auth";
import { cfEnv } from "@/lib/cf";
import { categories, collections, type Category, type CollectionSlug } from "@/lib/catalog";
import {
  adminPassword,
  deleteProduct,
  moveProduct,
  OutOfStockError,
  saveProduct,
  saveShippingZones,
  setOrderStatus,
  slugTaken,
  type ProductInput,
} from "@/lib/db";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/orders";

/** Shop pages are cached; call after anything customers can see changes. */
const refreshShop = () => revalidatePath("/", "layout");

// ---------- Auth ----------

export async function login(_prev: string | null, formData: FormData) {
  const expected = await adminPassword();
  const given = String(formData.get("password") ?? "");
  if (!expected) return "Admin password is not configured.";
  if (!safeEqual(given, expected)) return "Incorrect password.";

  (await cookies()).set(ADMIN_COOKIE, await sessionToken(expected), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    maxAge: 60 * 60 * 24 * 7,
  });
  redirect("/admin");
}

export async function logout() {
  (await cookies()).delete({ name: ADMIN_COOKIE, path: "/admin" });
  redirect("/admin/login");
}

// ---------- Orders ----------

export async function updateStatus(_prev: string | null, formData: FormData) {
  await requireAdmin();
  const number = String(formData.get("number"));
  const status = String(formData.get("status")) as OrderStatus;
  if (!ORDER_STATUSES.includes(status)) return "Unknown status.";
  try {
    await setOrderStatus(number, status);
  } catch (err) {
    if (err instanceof OutOfStockError) return "Not enough stock left to restore this order.";
    throw err;
  }
  refreshShop();
  revalidatePath("/admin", "layout");
  return null;
}

// ---------- Products ----------

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

const isImageUrl = (u: string) => /^https:\/\/\S+$/.test(u) || /^\/media\/[\w./-]+$/.test(u);

export async function saveProductAction(id: number | null, raw: ProductInput): Promise<{ error: string } | undefined> {
  await requireAdmin();

  const name = String(raw.name ?? "").trim().slice(0, 120);
  const slug = slugify(String(raw.slug || name));
  const price = Math.round(Number(raw.price));
  const salePrice = raw.salePrice === null || String(raw.salePrice) === "" ? null : Math.round(Number(raw.salePrice));
  const sizes = (raw.sizes ?? [])
    .map((s) => ({ size: String(s.size).trim().slice(0, 20), stock: Math.round(Number(s.stock)) }))
    .filter((s) => s.size);

  if (name.length < 2) return { error: "Please enter a product name." };
  if (!slug) return { error: "Please enter a web address (slug)." };
  if (!Number.isFinite(price) || price <= 0) return { error: "Price must be more than 0." };
  if (salePrice !== null && (!Number.isFinite(salePrice) || salePrice <= 0 || salePrice >= price)) {
    return { error: "Sale price must be lower than the normal price, or empty." };
  }
  if (!categories.includes(raw.category as Category)) return { error: "Please choose a category." };
  if (sizes.length === 0) return { error: "Add at least one size." };
  if (new Set(sizes.map((s) => s.size)).size !== sizes.length) return { error: "Each size can only be listed once." };
  if (sizes.some((s) => !Number.isInteger(s.stock) || s.stock < 0 || s.stock > 9999)) {
    return { error: "Stock must be a whole number from 0 to 9999." };
  }
  const images = (raw.images ?? []).map(String).filter(isImageUrl).slice(0, 12);
  if (await slugTaken(slug, id)) return { error: `Another product already uses the address "${slug}".` };

  const valid = new Set(collections.map((c) => c.slug));
  await saveProduct(id, {
    slug,
    code: String(raw.code ?? "").trim().slice(0, 20),
    name,
    price,
    salePrice,
    category: raw.category,
    color: String(raw.color ?? "").trim().slice(0, 60),
    style: String(raw.style ?? "").trim().slice(0, 160),
    description: String(raw.description ?? "").trim().slice(0, 2000),
    modelWears: String(raw.modelWears ?? "").trim().slice(0, 20),
    collections: (raw.collections ?? []).filter((c): c is CollectionSlug => valid.has(c)),
    images,
    visible: !!raw.visible,
    sizes,
  });
  refreshShop();
  revalidatePath("/admin", "layout");
  redirect("/admin/products");
}

export async function deleteProductAction(formData: FormData) {
  await requireAdmin();
  await deleteProduct(Number(formData.get("id")));
  refreshShop();
  revalidatePath("/admin", "layout");
  redirect("/admin/products");
}

export async function moveProductAction(formData: FormData) {
  await requireAdmin();
  await moveProduct(Number(formData.get("id")), Number(formData.get("direction")) < 0 ? -1 : 1);
  refreshShop();
  revalidatePath("/admin/products");
}

// ---------- Photos ----------

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

/** Detects the image type from the file's first bytes (servers don't always send a correct content type). */
function sniffImage(body: ArrayBuffer): { contentType: string; ext: string } | null {
  const b = new Uint8Array(body.slice(0, 12));
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return { contentType: "image/jpeg", ext: "jpg" };
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return { contentType: "image/png", ext: "png" };
  const ascii = String.fromCharCode(...b);
  if (ascii.startsWith("RIFF") && ascii.slice(8, 12) === "WEBP") return { contentType: "image/webp", ext: "webp" };
  return null;
}

async function storeImage(body: ArrayBuffer) {
  const type = sniffImage(body);
  if (!type) throw new Error("Only JPG, PNG or WebP photos are supported.");
  const { contentType, ext } = type;
  if (body.byteLength > MAX_IMAGE_BYTES) throw new Error("That photo is too large (max 5 MB).");
  const id = Array.from(crypto.getRandomValues(new Uint8Array(8)), (b) => b.toString(16).padStart(2, "0")).join("");
  const key = `products/${Date.now().toString(36)}-${id}.${ext}`;
  const { MEDIA } = await cfEnv();
  await MEDIA.put(key, body, { metadata: { contentType } });
  return `/media/${key}`;
}

/** Stores a photo uploaded from the admin (already resized in the browser). */
export async function uploadImage(formData: FormData): Promise<{ url: string } | { error: string }> {
  await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File)) return { error: "No photo received." };
  try {
    return { url: await storeImage(await file.arrayBuffer()) };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Upload failed." };
  }
}

/** Copies an external photo (e.g. from the old EasyOrders store) into Dolly's own storage. */
export async function importImage(url: string): Promise<{ url: string } | { error: string }> {
  await requireAdmin();
  if (!/^https:\/\//.test(url)) return { error: "Only https links can be imported." };
  try {
    const res = await fetch(url);
    if (!res.ok) return { error: `Couldn't download the photo (${res.status}).` };
    return { url: await storeImage(await res.arrayBuffer()) };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Import failed." };
  }
}

// ---------- Shipping ----------

export async function saveShippingAction(zones: { name: string; fee: number }[]): Promise<{ error?: string; ok?: boolean }> {
  await requireAdmin();
  const clean = zones.map((z) => ({ name: String(z.name).trim().slice(0, 50), fee: Math.round(Number(z.fee)) })).filter((z) => z.name);
  if (clean.length === 0) return { error: "Add at least one delivery region." };
  if (new Set(clean.map((z) => z.name)).size !== clean.length) return { error: "Each region can only be listed once." };
  if (clean.some((z) => !Number.isInteger(z.fee) || z.fee < 0 || z.fee > 10000)) {
    return { error: "Fees must be whole numbers from 0 to 10,000." };
  }
  await saveShippingZones(clean);
  refreshShop();
  return { ok: true };
}
