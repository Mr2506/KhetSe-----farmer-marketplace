"use client";

import { MapPin, Phone, Star } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

//  UPGRADED: Modern pill badge styles with borders and crisp colors
const STATUS_STYLES: Record<string, string> = {
  Pending:   "bg-amber-50 text-amber-700 border-amber-200",
  Placed:    "bg-amber-50 text-amber-700 border-amber-200",
  Confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  Accepted:  "bg-blue-50 text-blue-700 border-blue-200",
  Packed:    "bg-indigo-50 text-indigo-700 border-indigo-200",
  Shipped:   "bg-indigo-50 text-indigo-700 border-indigo-200",
  Delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Cancelled: "bg-red-50 text-red-700 border-red-200",
};

export function BuyerOrderCard({ order, onRate }: { order: any, onRate?: (produceId: string, cropName: string, orderId: string) => void }) {
  const dateStr = order.createdAt ? formatDate(order.createdAt) : "Recently";
  const badgeStyle = STATUS_STYLES[order.status] ?? "bg-zinc-100 text-zinc-600 border-zinc-200";
  const isTerminal = order.status === "Delivered" || order.status === "Cancelled";

  //  FIX: Smarter image fallback checks multiple possible locations
  const imageUrl = order.produceItem?.photos?.[0] || order.photo || order.producePhoto || null;

  return (
    <div className={`py-6 border-b border-zinc-200 last:border-0 group hover:bg-zinc-50/50 transition-colors -mx-4 px-4 sm:mx-0 sm:px-0 sm:hover:bg-transparent ${isTerminal ? "opacity-80" : ""}`}>
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex items-start gap-5 flex-1 min-w-0">
          
          {/* IMAGE RENDER */}
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={order.produceItem?.name || "Product"} 
              className="h-16 w-16 shrink-0 rounded-xl object-cover border border-zinc-200 shadow-sm"
            />
          ) : (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-400 text-2xl shadow-sm">
              🌾
            </div>
          )}
          
          <div className="flex-1 min-w-0">
             <div className="flex flex-wrap items-center gap-3 mb-1">
               {/*  UPGRADED: The 50% border "Pill" Badge */}
               <span className={`px-3 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-widest shadow-sm ${badgeStyle}`}>
                 {order.status}
               </span>
               <span className="text-zinc-300">·</span>
               <span className="text-xs font-mono text-zinc-400">#{order._id?.slice(-8).toUpperCase()}</span>
             </div>
             
             <h3 className="text-xl font-bold text-zinc-900 truncate mt-1">
               {order.produceItem?.name || "Deleted Item"}
             </h3>
             
             <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-zinc-600">
               <span>Qty: <strong className="font-bold text-zinc-900">{order.quantityOrdered} {order.produceItem?.unit || "kg"}</strong></span>
               <span className="w-px h-3 bg-zinc-300" />
               <span>Total: <strong className="font-bold text-[#2E7D32]">{formatCurrency(order.totalPrice)}</strong></span>
             </div>
             
             <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-medium text-zinc-500">
               <span className="flex items-center gap-1.5">
                 <MapPin className="w-3.5 h-3.5" /> 
                 {order.farmer?.farmVillageName || "Local Farm"}
               </span>
               <span className="w-px h-3 bg-zinc-300" />
               <a href={`tel:${order.farmer?.phone}`} className="flex items-center gap-1.5 hover:text-[#2E7D32] transition-colors">
                 <Phone className="w-3.5 h-3.5" /> 
                 {order.farmer?.phone || "No phone"}
               </a>
             </div>
          </div>
        </div>
        
        <div className="flex flex-col md:items-end justify-between gap-4 h-full">
          <p className="text-xs font-medium text-zinc-400">Ordered {dateStr}</p>
          
          {order.status === "Delivered" && !order.isRated && order.produceItem?._id && onRate && (
            <button
              onClick={() => onRate(order.produceItem._id, order.produceItem.name, order._id)}
              //  UPGRADED: Rating button is now a rounded pill too!
              className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-5 py-2 text-xs font-bold text-zinc-700 hover:border-amber-400 hover:bg-amber-50 hover:text-amber-600 hover:shadow-sm transition-all bg-white mt-auto"
            >
              <Star className="h-3.5 w-3.5" />
              Rate Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
}