import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminPassword } from "@/lib/db";

export const ADMIN_COOKIE = "dolly_admin";

/** Session token derived from the admin password; changing the password signs everyone out. */
export async function sessionToken(password: string) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(password), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode("dolly-admin-session-v1"));
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, "0")).join("");
}

export function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function isAdmin() {
  const password = await adminPassword();
  if (!password) return false;
  const cookie = (await cookies()).get(ADMIN_COOKIE)?.value;
  return !!cookie && safeEqual(cookie, await sessionToken(password));
}

export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}
