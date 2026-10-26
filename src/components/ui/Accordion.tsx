"use client";

import { useState } from "react";

export default function Accordion({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-sand">
      <button onClick={() => setOpen((v) => !v)} aria-expanded={open} className="flex w-full items-center justify-between py-5">
        <span className="label">{title}</span>
        <span className={`text-lg leading-none transition-transform duration-500 ${open ? "rotate-45" : ""}`}>+</span>
      </button>
      <div className={`grid transition-[grid-template-rows] duration-500 ease-soft ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          <div className="pb-6 text-sm leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  );
}
