"use client";

import { useState, useTransition } from "react";
import { saveShippingAction } from "../actions";

const input =
  "w-full border-b border-cocoa/25 bg-transparent py-2.5 text-sm outline-none placeholder:text-cocoa/35 focus:border-cocoa";

export default function ShippingForm({ initial }: { initial: { name: string; fee: string }[] }) {
  const [zones, setZones] = useState(initial);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [saving, start] = useTransition();

  const update = (i: number, key: "name" | "fee", value: string) => {
    setMessage(null);
    setZones((prev) => prev.map((z, j) => (j === i ? { ...z, [key]: value } : z)));
  };

  return (
    <form
      className="mt-10"
      onSubmit={(e) => {
        e.preventDefault();
        start(async () => {
          const res = await saveShippingAction(zones.map((z) => ({ name: z.name, fee: Number(z.fee) })));
          setMessage(res.error ? { ok: false, text: res.error } : { ok: true, text: "Saved. Checkout now uses these fees." });
        });
      }}
    >
      <div className="label grid grid-cols-[1fr_8rem_2rem] gap-4 text-cocoa-soft">
        <span>Region</span>
        <span>Fee (EGP)</span>
      </div>
      <ul className="mt-2 space-y-3">
        {zones.map((z, i) => (
          <li key={i} className="grid grid-cols-[1fr_8rem_2rem] items-end gap-4">
            <input value={z.name} onChange={(e) => update(i, "name", e.target.value)} className={input} placeholder="e.g. Cairo & Giza" aria-label="Region" />
            <input type="number" min={0} value={z.fee} onChange={(e) => update(i, "fee", e.target.value)} className={input} aria-label="Fee" />
            <button
              type="button"
              onClick={() => setZones((prev) => prev.filter((_, j) => j !== i))}
              className="pb-2.5 text-cocoa-soft hover:text-cocoa"
              aria-label={`Remove ${z.name}`}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
      <button type="button" onClick={() => setZones((prev) => [...prev, { name: "", fee: "0" }])} className="label mt-4 link-line">
        + Add region
      </button>

      {message && <p className={`mt-8 text-sm ${message.ok ? "text-cocoa" : "text-blush-deep"}`}>{message.text}</p>}
      <button disabled={saving} className="label mt-6 bg-cocoa px-10 py-4 text-cream hover:bg-cocoa/85 disabled:opacity-60">
        {saving ? "Saving…" : "Save shipping fees"}
      </button>
    </form>
  );
}
