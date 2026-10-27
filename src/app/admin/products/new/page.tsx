import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import AdminBar from "../../AdminBar";
import ProductForm from "../ProductForm";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  await requireAdmin();
  return (
    <>
      <AdminBar active="products" />
      <div className="px-5 py-10 md:px-10">
        <Link href="/admin/products" className="label link-line text-cocoa-soft">
          ← All products
        </Link>
        <h1 className="mt-6 mb-10 font-display text-5xl">New product</h1>
        <ProductForm />
      </div>
    </>
  );
}
