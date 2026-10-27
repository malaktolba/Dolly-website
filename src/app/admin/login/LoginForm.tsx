"use client";

import { useActionState } from "react";
import { login } from "../actions";

export default function LoginForm() {
  const [error, action, pending] = useActionState(login, null);
  return (
    <form action={action} className="mt-12">
      <input
        name="password"
        type="password"
        required
        autoFocus
        placeholder="Password"
        aria-label="Password"
        autoComplete="current-password"
        className="w-full border-b border-cocoa/30 bg-transparent py-3 text-sm outline-none focus:border-cocoa"
      />
      {error && <p className="mt-4 text-sm text-blush-deep">{error}</p>}
      <button disabled={pending} className="label mt-8 w-full bg-cocoa py-4 text-cream hover:bg-cocoa/85 disabled:opacity-60">
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
