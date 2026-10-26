import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPolicy, policies } from "@/lib/policies";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return policies.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getPolicy((await params).slug);
  return p ? { title: p.title } : {};
}

export default async function PolicyPage({ params }: Props) {
  const slug = (await params).slug;
  const policy = getPolicy(slug);
  if (!policy) notFound();

  return (
    <div className="grid gap-12 px-5 pt-20 md:grid-cols-12 md:px-10 md:pt-32">
      <nav className="flex flex-row flex-wrap gap-4 md:col-span-3 md:flex-col">
        {policies.map((p) => (
          <Link key={p.slug} href={`/policies/${p.slug}`} className={`label self-start ${p.slug === slug ? "" : "text-cocoa-soft link-line"}`}>
            {p.title}
          </Link>
        ))}
      </nav>
      <article className="md:col-span-7 md:col-start-5">
        <h1 className="font-display text-5xl md:text-7xl">{policy.title}</h1>
        <div className="mt-12 space-y-5 leading-relaxed text-cocoa-soft">
          {policy.body.map((para) => (
            <p key={para}>{para}</p>
          ))}
        </div>
      </article>
    </div>
  );
}
