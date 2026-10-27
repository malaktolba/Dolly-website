import "server-only";
import { formatEGP } from "@/lib/catalog";
import type { PricedOrder } from "@/lib/orders";

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

/**
 * Emails the shop owner about a new order via Resend (free tier).
 * Does nothing unless RESEND_API_KEY and NOTIFY_EMAIL are configured.
 */
export async function notifyNewOrder(env: { RESEND_API_KEY?: string; NOTIFY_EMAIL?: string; SITE_URL?: string }, number: string, order: PricedOrder) {
  if (!env.RESEND_API_KEY || !env.NOTIFY_EMAIL) return;

  const rows = order.items
    .map(
      (i) =>
        `<tr><td style="padding:6px 0">${esc(i.name)} <span style="color:#6b5a54">(${esc(i.size)}) × ${i.qty}</span></td><td style="padding:6px 0;text-align:right">${formatEGP(i.lineTotal)}</td></tr>`,
    )
    .join("");
  const link = env.SITE_URL ? `<p><a href="${env.SITE_URL}/admin/orders/${number}">Open in admin →</a></p>` : "";
  const html = `
    <div style="font-family:Helvetica,Arial,sans-serif;color:#2b1511;max-width:520px">
      <h2 style="font-weight:normal">New order ${number}</h2>
      <table style="width:100%;border-collapse:collapse">${rows}
        <tr><td style="padding:6px 0;color:#6b5a54">Shipping (${esc(order.region)})</td><td style="text-align:right">${formatEGP(order.shipping)}</td></tr>
        <tr><td style="padding:10px 0;font-weight:bold">Total to collect</td><td style="text-align:right;font-weight:bold">${formatEGP(order.total)}</td></tr>
      </table>
      <p><strong>${esc(order.name)}</strong><br>${esc(order.phone)}<br>${esc(order.address)}<br>${esc(order.city)}, ${esc(order.region)}</p>
      ${order.notes ? `<p style="color:#6b5a54">Notes: ${esc(order.notes)}</p>` : ""}
      ${link}
    </div>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Dolly Orders <onboarding@resend.dev>",
        to: [env.NOTIFY_EMAIL],
        subject: `New order ${number} · ${formatEGP(order.total)}`,
        html,
      }),
    });
    if (!res.ok) console.error("Order email failed", res.status, await res.text());
  } catch (err) {
    console.error("Order email failed", err);
  }
}
