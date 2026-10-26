"use client";

export default function QtyStepper({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="flex items-center border border-sand text-sm">
      <button aria-label="Decrease quantity" onClick={() => onChange(value - 1)} className="h-8 w-8 hover:bg-sand">
        −
      </button>
      <span className="w-8 text-center tabular-nums">{value}</span>
      <button aria-label="Increase quantity" onClick={() => onChange(value + 1)} className="h-8 w-8 hover:bg-sand">
        +
      </button>
    </div>
  );
}
