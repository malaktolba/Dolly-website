import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getProductById } from "@/lib/store";
import AdminBar from "../../AdminBar";
import ProductForm, { DeleteProductButton } from "../ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const product = await getProductById(Number((await params).id));
  if (!product) notFound();

  return (
    <>
      <AdminBar active="products" />
      <div className="px-5 py-10 md:px-10">
        <Link href="/admin/products" className="label link-line text-cocoa-soft">
          ← All products
        </Link>
        <div className="mt-6 mb-10 flex flex-wrap items-end justify-between gap-4">
          <h1 className="font-display text-5xl">{product.name}</h1>
          {product.visible && (
            <Link href={`/products/${product.slug}`} target="_blank" className="label link-line">
              View in shop ↗
            </Link>
          )}
        </div>
        <ProductForm product={product} />
        <div className="mt-16 border-t border-sand pt-6">
          <DeleteProductButton id={product.id} name={product.name} />
        </div>
      </div>
    </>
  );
}
