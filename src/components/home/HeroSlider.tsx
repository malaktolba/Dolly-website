"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export type Slide = { image: string; title: string; href: string; position?: string };

export default function HeroSlider({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const n = slides.length;
  const go = (d: number) => setIndex((i) => (i + d + n) % n);

  useEffect(() => {
    const t = setTimeout(() => go(1), 6000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const prev = slides[(index - 1 + n) % n];
  const next = slides[(index + 1) % n];
  const current = slides[index];

  return (
    <section className="relative h-[calc(100svh-32px)] min-h-[560px] w-full overflow-hidden bg-cocoa text-cream">
      {slides.map((s, i) => (
        <Image
          key={s.image}
          src={s.image}
          alt={s.title}
          fill
          priority={i === 0}
          sizes="100vw"
          className={`object-cover transition-[opacity,transform] duration-[1.6s] ease-soft ${
            i === index ? "scale-100 opacity-100" : "scale-105 opacity-0"
          }`}
          style={{ objectPosition: s.position ?? "center 30%" }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-cocoa/35 via-transparent to-cocoa/45" />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <h1 className="font-display text-[22vw] leading-[0.82] font-medium tracking-[0.04em] md:text-[15vw]">
          DOLLY
        </h1>
        <Link href={current.href} className="label mt-8 border border-cream/70 px-8 py-4 backdrop-blur-[2px] transition-colors hover:bg-cream hover:text-cocoa">
          Explore {current.title}
        </Link>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-5 pb-7 md:px-10">
        <button onClick={() => go(-1)} className="label flex items-center gap-2 link-line">
          ‹ {prev.title}
        </button>
        <div className="hidden gap-2 md:flex">
          {slides.map((s, i) => (
            <button
              key={s.title}
              onClick={() => setIndex(i)}
              aria-label={`Show ${s.title}`}
              className={`h-px w-10 transition-colors ${i === index ? "bg-cream" : "bg-cream/35"}`}
            />
          ))}
        </div>
        <button onClick={() => go(1)} className="label flex items-center gap-2 link-line">
          {next.title} ›
        </button>
      </div>
    </section>
  );
}
