"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, Clock, XCircle, User, AlertCircle } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

const STATUS_STYLE: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  Pending:   { bg: "bg-amber-50",   text: "text-amber-700",   icon: <AlertCircle className="h-3.5 w-3.5" /> },
  Confirmed: { bg: "bg-blue-50",    text: "text-blue-700",    icon: <Clock className="h-3.5 w-3.5" /> },
  Delivered: { bg: "bg-emerald-50", text: "text-emerald-700", icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  Cancelled: { bg: "bg-red-50",     text: "text-red-700",     icon: <XCircle className="h-3.5 w-3.5" /> },
};

// ADDED: onUpdate function to the props
export function FarmerOrderCard({ order, onUpdate }: { order: any; onUpdate?: () => void }) {
  const [loading, setLoading] = useState(false);

  const orderId = (order._id || "").toString();
  const shortId = orderId.slice(-8).toUpperCase();
  const buyerName = order.buyer ? `${order.buyer.firstName} ${order.buyer.lastName}` : "Unknown Buyer";
  const style = STATUS_STYLE[order.status] ?? { bg: "bg-zinc-100", text: "text-zinc-600", icon: null };
  const isTerminal = order.status === "Delivered" || order.status === "Cancelled";

  async function setStatus(status: string) {
    setLoading(true);
    try {
      const token = localStorage.getItem("khetse_token");
      
      const res = await fetch(`https://khetse-backend.onrender.com/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      toast.success(`Order marked as ${status}`);
      
      // FIXED: Call the parent update function instead of reloading the page!
      if (onUpdate) {
        onUpdate();
      } else {
        window.location.reload(); 
      }
    } catch (error) {
      toast.error("Could not update order status");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`rounded-2xl border bg-white shadow-sm transition-all duration-200 hover:shadow-md ${
      isTerminal ? "border-zinc-200/60 opacity-80" : "border-zinc-200/80"
    }`}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 px-5 py-3.5 bg-zinc-50/50 rounded-t-2xl">
        <div className="flex items-center gap-2">
          <User className="h-3.5 w-3.5 text-zinc-400" />
          <p className="text-sm font-semibold text-zinc-700">{buyerName}</p>
          <span className="text-zinc-300 text-xs">·</span>
          <p className="text-xs text-zinc-400 font-mono">{shortId}</p>
        </div>
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${style.bg} ${style.text}`}>
          {style.icon}
          {order.status}
        </span>
      </div>

      <div className="p-5">
        <ul className="space-y-1.5 mb-4">
          <li className="flex items-center justify-between text-sm">
            <span className="font-medium text-zinc-800">
              {order.produceItem?.name || "Deleted Item"}
            </span>
            <span className="text-zinc-500 font-medium">
              {order.quantityOrdered} {order.produceItem?.unit || "kg"}
            </span>
          </li>
        </ul>

        <div className="flex items-center justify-between border-t border-zinc-100 pt-3.5">
          <div>
            <p className="text-xs text-zinc-400 mb-0.5">{order.createdAt ? formatDate(order.createdAt) : "Recently"}</p>
            <p className="text-lg font-bold text-emerald-700">{formatCurrency(order.totalPrice)}</p>
          </div>

          <div className="flex gap-2">
            {order.status === "Pending" && (
              <>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setStatus("Confirmed")}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm shadow-emerald-600/20 hover:bg-emerald-500 active:scale-95 disabled:opacity-50 transition-all"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {loading ? "Saving..." : "Accept"}
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

            {order.status === "Confirmed" && (
              <button
                type="button"
                disabled={loading}
                onClick={() => setStatus("Delivered")}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm shadow-emerald-600/20 hover:bg-emerald-500 active:scale-95 disabled:opacity-50 transition-all"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                {loading ? "Updating..." : "Mark Delivered"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}