"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { addReviewAction, cancelOrderAction } from "@/lib/actions";
import { ORDER_STATUS_FLOW, formatOrderStatus } from "@/lib/roles";
import { formatCurrency, formatDate } from "@/lib/utils";

type Order = {
  id: string;
  status: string;
  grandTotal: number;
  placedAt: string;
  fulfillment: string;
  address?: string;
  timeSlot?: string;
  farmerName: string;
  items: { cropName: string; quantity: number; unit: string; price: number }[];
  review?: { rating: number; comment: string };
};

export function BuyerOrderCard({ order }: { order: Order }) {
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const statusIndex = ORDER_STATUS_FLOW.indexOf(order.status as (typeof ORDER_STATUS_FLOW)[number]);

  async function cancel() {
    setLoading(true);
    try {
      await cancelOrderAction(order.id);
      toast.success("Order cancelled");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  async function submitReview() {
    setLoading(true);
    try {
      await addReviewAction(order.id, rating, comment);
      toast.success("Review submitted");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-bold text-zinc-900">{order.id}</p>
          <p className="text-sm text-zinc-500">{formatDate(order.placedAt)} · {order.farmerName}</p>
          <p className="text-xs text-zinc-400">📞 Contact Farmer</p>
        </div>
        <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800">
          {formatOrderStatus(order.status)}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {ORDER_STATUS_FLOW.map((step, i) => (
          <div
            key={step}
            className={`h-1.5 flex-1 min-w-[40px] rounded-full ${i <= statusIndex ? "bg-emerald-500" : "bg-zinc-200"}`}
            title={formatOrderStatus(step)}
          />
        ))}
      </div>

      <ul className="mt-4 space-y-1 text-sm text-zinc-600">
        {order.items.map((item, i) => (
          <li key={i}>{item.cropName} × {item.quantity} {item.unit} — {formatCurrency(item.price * item.quantity)}</li>
        ))}
      </ul>

      <p className="mt-3 font-bold text-emerald-700">{formatCurrency(order.grandTotal)}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {["Placed", "Accepted"].includes(order.status) && (
          <button type="button" disabled={loading} onClick={cancel} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700">
            Cancel
          </button>
        )}
        {order.status === "Delivered" && !order.review && (
          <div className="w-full space-y-2 rounded-xl bg-zinc-50 p-3">
            <p className="text-xs font-semibold">Leave a review</p>
            <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="rounded-lg border px-2 py-1 text-sm">
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>{r} stars</option>
              ))}
            </select>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="How was the produce?" className="w-full rounded-lg border px-2 py-1 text-sm" rows={2} />
            <button type="button" disabled={loading} onClick={submitReview} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white">
              Submit review
            </button>
          </div>
        )}
        {order.status === "Delivered" && (
          <Link href="/buyer/browse" className="rounded-lg border border-emerald-200 px-3 py-1.5 text-xs font-semibold text-emerald-800">
            Reorder
          </Link>
        )}
      </div>
    </div>
  );
}
