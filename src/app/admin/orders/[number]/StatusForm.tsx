"use client";

import { useActionState } from "react";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/orders";
import { updateStatus } from "../../actions";

export default function StatusForm({ number, status }: { number: string; status: OrderStatus }) {
  const [error, action, pending] = useActionState(updateStatus, null);
  return (
    // Keyed by status so the dropdown resets to the saved value after each save
    <form key={status} action={action} className="bg-cream p-6">
      <input type="hidden" name="number" value={number} />
      <label htmlFor="status" className="label text-cocoa-soft">
        Update status
      </label>
      <select
        id="status"
        name="status"
        defaultValue={status}
        className="mt-3 w-full cursor-pointer border-b border-cocoa/30 bg-transparent py-3 text-sm capitalize outline-none"
      >
        {ORDER_STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <p className="mt-3 text-xs text-cocoa-soft">Cancelling an order puts its items back in stock.</p>
      {error && <p className="mt-3 text-sm text-blush-deep">{error}</p>}
      <button disabled={pending} className="label mt-6 w-full bg-cocoa py-3 text-cream hover:bg-cocoa/85 disabled:opacity-60">
        {pending ? "Saving…" : "Save"}
      </button>
    </form>
  );
}
