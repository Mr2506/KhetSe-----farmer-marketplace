"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, Clock, XCircle, User, AlertCircle } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

const STATUS_STYLE: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  Pending:   { bg: "bg-amber-50",   text: "text-amber-700",   icon: <AlertCircle className="h-3.5 w-3.5" /> },
  Confirmed: { bg: "bg-zinc-100",    text: "text-zinc-700",    icon: <Clock className="h-3.5 w-3.5" /> },
  Delivered: { bg: "bg-zinc-100", text: "text-[#2E7D32]", icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  Cancelled: { bg: "bg-zinc-100",     text: "text-zinc-500",     icon: <XCircle className="h-3.5 w-3.5" /> },
};

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
    <div className={`py-6 border-b border-zinc-200 last:border-0 ${isTerminal ? "opacity-75" : ""}`}>
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
        <div className="flex items-start gap-4">
          {order.produceItem?.photos?.[0] ? (
            <img 
              src={order.produceItem.photos[0]} 
              alt={order.produceItem.name || "Product"} 
              className="h-14 w-14 rounded-sm object-cover bg-zinc-100 shrink-0"
            />
          ) : (
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-sm bg-zinc-100 text-zinc-400 text-xl">
              🌾
            </div>
          )}
          
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className={`text-[10px] font-bold uppercase tracking-widest ${style.text}`}>
                {order.status}
              </span>
              <span className="text-zinc-300">·</span>
              <span className="text-xs text-zinc-500 font-mono">#{shortId}</span>
            </div>
            <h3 className="text-lg font-medium text-zinc-900">
               {order.produceItem?.name || "Deleted Item"}
            </h3>
            <p className="mt-1 text-sm text-zinc-600">
               <strong className="font-medium text-zinc-900">{order.quantityOrdered} {order.produceItem?.unit || "kg"}</strong> ordered by {buyerName}
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:items-end justify-between gap-4">
           <div className="text-left sm:text-right">
             <p className="text-2xl font-medium text-[#2E7D32]">{formatCurrency(order.totalPrice)}</p>
             <p className="text-xs text-zinc-500 mt-1">{order.createdAt ? formatDate(order.createdAt) : "Recently"}</p>
           </div>
           
           <div className="flex items-center gap-2">
            {order.status === "Pending" && (
              <>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setStatus("Cancelled")}
                  className="px-3 py-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
                >
                  Decline
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setStatus("Confirmed")}
                  className="px-4 py-1.5 text-xs font-medium bg-[#EF9F27] text-white rounded-sm hover:bg-[#d68b20] transition-colors"
                >
                  {loading ? "Accepting..." : "Accept Order"}
                </button>
              </>
            )}

            {order.status === "Confirmed" && (
              <button
                type="button"
                disabled={loading}
                onClick={() => setStatus("Delivered")}
                className="px-4 py-1.5 text-xs font-medium bg-[#2E7D32] text-white rounded-sm hover:bg-[#236326] transition-colors"
              >
                {loading ? "Updating..." : "Mark Delivered"}
              </button>
            )}
           </div>
        </div>
      </div>
    </div>
  );
}