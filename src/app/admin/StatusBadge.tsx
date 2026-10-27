import type { OrderStatus } from "@/lib/orders";

const styles: Record<OrderStatus, string> = {
  new: "bg-blush text-cocoa",
  confirmed: "bg-sand text-cocoa",
  shipped: "bg-cocoa/80 text-cream",
  delivered: "bg-cocoa text-cream",
  cancelled: "border border-cocoa/30 text-cocoa-soft line-through",
};

export default function StatusBadge({ status }: { status: OrderStatus }) {
  return <span className={`label inline-block px-2 py-1 !text-[0.625rem] ${styles[status]}`}>{status}</span>;
}
