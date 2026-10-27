import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
export const metadata: Metadata = { title: "About" };

// Editorial photos for this page (from the Winter '25 shoot)
const a = { name: "The Beige Set", images: ["https://files.easy-orders.net/1764598597164260579.jpeg"] };
const b = { name: "The Funnel Suede Jacket", images: ["https://files.easy-orders.net/1764390672474292804.jpeg"] };

// Placeholder brand copy; replace with Dolly's own story.
export default function AboutPage() {
  return (
    <>
      <section className="px-5 pt-20 md:px-10 md:pt-32">
        <p className="label text-cocoa-soft">About</p>
        <h1 className="mt-6 max-w-5xl font-display text-5xl leading-[1.05] md:text-8xl">
          Clothes that tell a <span className="italic">story</span> before you say a word.
        </h1>
      </section>

      <section className="mt-20 grid gap-10 px-5 md:mt-32 md:grid-cols-12 md:px-10">
        <Reveal className="md:col-span-5">
          <div className="relative aspect-[3/4] bg-sand">
            <Image src={a.images[0]} alt={a.name} fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover" />
          </div>
        </Reveal>
        <Reveal className="flex flex-col justify-end md:col-span-5 md:col-start-8" delay={120}>
          <div className="space-y-6 leading-relaxed text-cocoa-soft">
            <p className="font-display text-2xl leading-snug text-cocoa md:text-3xl">
              Dolly is an Egyptian womenswear label built around a simple idea: every woman deserves a piece that makes her
              feel unforgettable.
            </p>
            <p>
              We design in small seasonal drops: sparkling skirts for summer nights, tailored sets in chalk beige, and
              sculpted outerwear for the colder months. Each collection is made in limited quantities, so every piece stays
              special.
            </p>
            <p>
              From the first sketch to the moment it reaches your door, we care about the details: the fabric, the fit, and
              how it makes you feel.
            </p>
          </div>
        </Reveal>
      </section>

      <section className="mt-24 grid gap-10 px-5 md:mt-40 md:grid-cols-12 md:px-10">
        <Reveal className="md:col-span-4 md:col-start-2 md:self-center">
          <p className="label text-cocoa-soft">Our promise</p>
          <ul className="mt-6 space-y-5 font-display text-2xl">
            <li>Designed in Egypt</li>
            <li>Limited seasonal drops</li>
            <li>Delivered to your door</li>
            <li>Cash on delivery</li>
          </ul>
          <Link href="/shop" className="label mt-10 inline-block bg-cocoa px-8 py-4 text-cream hover:bg-cocoa/85">
            Shop the collections
          </Link>
        </Reveal>
        <Reveal className="md:col-span-6 md:col-start-7">
          <div className="relative aspect-[4/5] bg-sand">
            <Image src={b.images[0]} alt={b.name} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          </div>
        </Reveal>
      </section>
    </>
  );
}
