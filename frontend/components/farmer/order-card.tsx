"use client";

import { useState } from "react";
import { toast } from "sonner";
import { formatCurrency, formatDate } from "@/lib/utils";

//  UPGRADED: Modern pill badge styles with borders and crisp colors
const STATUS_STYLES: Record<string, string> = {
  Pending:   "bg-amber-50 text-amber-700 border-amber-200",
  Placed:    "bg-amber-50 text-amber-700 border-amber-200",
  Confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  Accepted:  "bg-blue-50 text-blue-700 border-blue-200",
  Delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Cancelled: "bg-red-50 text-red-700 border-red-200",
};

export function FarmerOrderCard({ order, onUpdate }: { order: any; onUpdate?: () => void }) {
  const [loading, setLoading] = useState(false);

  const orderId = (order._id || "").toString();
  const shortId = orderId.slice(-8).toUpperCase();
  const buyerName = order.buyer ? `${order.buyer.firstName} ${order.buyer.lastName}` : "Unknown Buyer";
  const badgeStyle = STATUS_STYLES[order.status] ?? "bg-zinc-100 text-zinc-600 border-zinc-200";
  const isTerminal = order.status === "Delivered" || order.status === "Cancelled";

  //  FIX: This ensures the farmer sees the photo that was saved at checkout!
  const imageUrl = order.produceItem?.photos?.[0] || order.photo || order.producePhoto || null;

  async function setStatus(status: string) {
    setLoading(true);
    try {
      const token = localStorage.getItem("khetse_token");
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}/status`, {
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
    <div className={`py-6 border-b border-zinc-200 last:border-0 ${isTerminal ? "opacity-80" : ""}`}>
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
        <div className="flex items-start gap-5">
          
          {/* IMAGE RENDER */}
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={order.produceItem?.name || "Product"} 
              className="h-14 w-14 rounded-xl object-cover border border-zinc-200 shadow-sm shrink-0"
            />
          ) : (
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-400 text-xl shadow-sm">
              🌾
            </div>
          )}
          
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-1">
              {/*  UPGRADED: The 50% border "Pill" Badge */}
              <span className={`px-3 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-widest shadow-sm ${badgeStyle}`}>
                {order.status}
              </span>
              <span className="text-zinc-300">·</span>
              <span className="text-xs text-zinc-400 font-mono">#{shortId}</span>
            </div>
            
            <h3 className="text-lg font-bold text-zinc-900 mt-1">
               {order.produceItem?.name || "Deleted Item"}
            </h3>
            
            <p className="mt-1.5 text-sm text-zinc-600">
               <strong className="font-bold text-zinc-900">{order.quantityOrdered} {order.produceItem?.unit || "kg"}</strong> ordered by <span className="font-medium">{buyerName}</span>
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:items-end justify-between gap-4 h-full">
           <div className="text-left sm:text-right">
             <p className="text-2xl font-bold text-[#2E7D32]">{formatCurrency(order.totalPrice)}</p>
             <p className="text-xs font-medium text-zinc-400 mt-1">{order.createdAt ? formatDate(order.createdAt) : "Recently"}</p>
           </div>
           
           <div className="flex items-center gap-3">
            {order.status === "Pending" && (
              <>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setStatus("Cancelled")}
                  //  UPGRADED: Pill-shaped decline button
                  className="px-5 py-2 rounded-full border border-red-200 bg-red-50 text-xs font-bold text-red-700 hover:bg-red-100 hover:border-red-300 transition-all active:scale-95"
                >
                  Decline
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setStatus("Confirmed")}
                  //  UPGRADED: Pill-shaped accept button
                  className="px-6 py-2 rounded-full bg-[#EF9F27] text-xs font-bold text-white shadow-sm hover:bg-[#d68b20] hover:shadow-md transition-all active:scale-95"
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
                //  UPGRADED: Pill-shaped delivery button
                className="px-6 py-2 rounded-full bg-[#2E7D32] text-xs font-bold text-white shadow-sm hover:bg-[#236326] hover:shadow-md transition-all active:scale-95"
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