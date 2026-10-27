import type { Metadata } from "next";
import SearchClient from "@/components/shop/SearchClient";
import { getProducts } from "@/lib/store";

export const metadata: Metadata = { title: "Search" };

export default async function SearchPage() {
  return <SearchClient products={await getProducts()} />;
}
