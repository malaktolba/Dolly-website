import Link from "next/link";
import { logout } from "./actions";

const sections = [
  { key: "orders", href: "/admin", label: "Orders" },
  { key: "products", href: "/admin/products", label: "Products" },
  { key: "shipping", href: "/admin/shipping", label: "Shipping" },
] as const;

export default function AdminBar({ active = "orders" }: { active?: (typeof sections)[number]["key"] }) {
  return (
    <header className="border-b border-sand bg-cream px-5 md:px-10">
      <div className="flex items-center justify-between py-4">
        <Link href="/admin" className="flex items-baseline gap-3">
          <span className="font-display text-2xl tracking-[0.18em]">DOLLY</span>
          <span className="label text-cocoa-soft">Admin</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/" className="label link-line" target="_blank">
            View site
          </Link>
          <form action={logout}>
            <button className="label link-line">Sign out</button>
          </form>
        </div>
      </div>
      <nav className="-mb-px flex gap-6">
        {sections.map((s) => (
          <Link
            key={s.key}
            href={s.href}
            className={`label border-b-2 pb-3 ${active === s.key ? "border-cocoa" : "border-transparent text-cocoa-soft hover:text-cocoa"}`}
          >
            {s.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
