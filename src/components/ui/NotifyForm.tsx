"use client";

import { useState } from "react";

// Front-end only for now: no data is sent anywhere until a backend is wired up.
export default function NotifyForm({ tone = "light", className = "" }: { tone?: "light" | "dark"; className?: string }) {
  const [done, setDone] = useState(false);
  const line = tone === "dark" ? "border-cream/40 placeholder:text-cream/40" : "border-cocoa/30 placeholder:text-cocoa/40";

  if (done) {
    return <p className={`label ${className}`}>Thank you. We&apos;ll be in touch before the next drop.</p>;
  }

  return (
    <form
      className={`flex items-end gap-4 ${className}`}
      onSubmit={(e) => {
        e.preventDefault();
        setDone(true);
      }}
    >
      <input
        required
        type="email"
        placeholder="Email address"
        aria-label="Email address"
        className={`flex-1 border-b bg-transparent py-3 text-sm outline-none focus:border-current ${line}`}
      />
      <button type="submit" className="label link-line pb-3">
        Get notified
      </button>
    </form>
  );
}
