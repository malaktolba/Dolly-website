import Link from "next/link";

export default function NotFound() {
  return (
    <div className="px-6 py-40 text-center">
      <p className="label text-cocoa-soft">404</p>
      <h1 className="mt-6 font-display text-6xl italic md:text-8xl">Lost in the archive.</h1>
      <Link href="/shop" className="label mt-12 inline-block border border-cocoa px-8 py-4 hover:bg-cocoa hover:text-cream">
        Back to the shop
      </Link>
    </div>
  );
}
