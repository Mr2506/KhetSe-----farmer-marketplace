"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

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

export function FarmerOrderCard({ order }: { order: Order }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const currentIdx = FARMER_ORDER_FLOW.indexOf(order.status as (typeof FARMER_ORDER_FLOW)[number]);
  const nextStatus = FARMER_ORDER_FLOW[currentIdx + 1];

  async function setStatus(status: string) {
    setLoading(true);
    try {
      await updateOrderStatusAction(order.id, status);
      toast.success(`Order ${formatOrderStatus(status)}`);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5">
      <div className="flex flex-wrap justify-between gap-2">
        <div>
          <p className="font-bold">{order.id}</p>
          <p className="text-sm text-zinc-600">{order.buyerName} · Buyer</p>
          <p className="text-xs text-zinc-400">📞 Contact Buyer</p>
        </div>
        <span className="rounded-lg bg-amber-50 px-2 py-1 text-xs font-bold text-amber-800">
          {formatOrderStatus(order.status)}
        </span>
      </div>

      <ul className="mt-3 text-sm text-zinc-600">
        {order.items.map((item, i) => (
          <li key={i}>{item.cropName} × {item.quantity} {item.unit}</li>
        ))}
      </ul>

      <p className="mt-2 font-bold text-emerald-700">{formatCurrency(order.grandTotal)} · {formatDate(order.placedAt)}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {order.status === "Placed" && (
          <>
            <button type="button" disabled={loading} onClick={() => setStatus("Accepted")} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white">
              Accept
            </button>
            <button type="button" disabled={loading} onClick={() => setStatus("Cancelled")} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700">
              Decline
            </button>
          </>
        )}
        {nextStatus && order.status !== "Placed" && order.status !== "Delivered" && order.status !== "Cancelled" && (
          <button type="button" disabled={loading} onClick={() => setStatus(nextStatus)} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white">
            Mark {formatOrderStatus(nextStatus)}
          </button>
        )}
      </div>
    </div>
  );
}
