"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, Clock, Package, Truck, XCircle, ChevronRight, User } from "lucide-react";

import { updateOrderStatusAction } from "@/lib/actions";
import { FARMER_ORDER_FLOW, formatOrderStatus } from "@/lib/roles";
import { formatCurrency, formatDate } from "@/lib/utils";

type Order = {
  id: string;
  status: string;
  grandTotal: number;
  placedAt: string;
  buyerName: string;
  items: { cropName: string; quantity: number; unit: string }[];
};

const STATUS_STYLE: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  Placed:    { bg: "bg-blue-50",    text: "text-blue-700",    icon: <Clock className="h-3.5 w-3.5" /> },
  Accepted:  { bg: "bg-amber-50",   text: "text-amber-700",   icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  Packed:    { bg: "bg-purple-50",  text: "text-purple-700",  icon: <Package className="h-3.5 w-3.5" /> },
  Shipped:   { bg: "bg-indigo-50",  text: "text-indigo-700",  icon: <Truck className="h-3.5 w-3.5" /> },
  Delivered: { bg: "bg-emerald-50", text: "text-emerald-700", icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  Cancelled: { bg: "bg-red-50",     text: "text-red-700",     icon: <XCircle className="h-3.5 w-3.5" /> },
};

export function FarmerOrderCard({ order }: { order: Order }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const currentIdx = FARMER_ORDER_FLOW.indexOf(order.status as (typeof FARMER_ORDER_FLOW)[number]);
  const nextStatus = FARMER_ORDER_FLOW[currentIdx + 1];
  const style = STATUS_STYLE[order.status] ?? { bg: "bg-zinc-100", text: "text-zinc-600", icon: null };

  const isTerminal = order.status === "Delivered" || order.status === "Cancelled";

  async function setStatus(status: string) {
    setLoading(true);
    try {
      await updateOrderStatusAction(order.id, status);
      toast.success(`Order marked as ${formatOrderStatus(status)}`);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`rounded-2xl border bg-white shadow-sm transition-all duration-200 hover:shadow-md ${
      isTerminal ? "border-zinc-200/60 opacity-80" : "border-zinc-200/80"
    }`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 px-5 py-3.5 bg-zinc-50/50 rounded-t-2xl">
        <div className="flex items-center gap-2">
          <User className="h-3.5 w-3.5 text-zinc-400" />
          <p className="text-sm font-semibold text-zinc-700">{order.buyerName}</p>
          <span className="text-zinc-300 text-xs">·</span>
          <p className="text-xs text-zinc-400 font-mono">{order.id.slice(-8).toUpperCase()}</p>
        </div>
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${style.bg} ${style.text}`}>
          {style.icon}
          {formatOrderStatus(order.status)}
        </span>
      </div>

      {/* Body */}
      <div className="p-5">
        <ul className="space-y-1.5 mb-4">
          {order.items.map((item, i) => (
            <li key={i} className="flex items-center justify-between text-sm">
              <span className="font-medium text-zinc-800">{item.cropName}</span>
              <span className="text-zinc-500 font-medium">{item.quantity} {item.unit}</span>
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between border-t border-zinc-100 pt-3.5">
          <div>
            <p className="text-xs text-zinc-400 mb-0.5">{formatDate(order.placedAt)}</p>
            <p className="text-lg font-bold text-emerald-700">{formatCurrency(order.grandTotal)}</p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            {order.status === "Placed" && (
              <>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setStatus("Accepted")}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm shadow-emerald-600/20 hover:bg-emerald-500 active:scale-95 disabled:opacity-50 transition-all"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Accept
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setStatus("Cancelled")}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-xs font-bold text-red-700 hover:bg-red-100 active:scale-95 disabled:opacity-50 transition-all"
                >
                  <XCircle className="h-3.5 w-3.5" />
                  Decline
                </button>
              </>
            )}

            {nextStatus && order.status !== "Placed" && !isTerminal && (
              <button
                type="button"
                disabled={loading}
                onClick={() => setStatus(nextStatus)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 px-4 py-2 text-xs font-bold text-white hover:bg-zinc-700 active:scale-95 disabled:opacity-50 transition-all"
              >
                Mark {formatOrderStatus(nextStatus)}
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
