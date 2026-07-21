"use client";

import { MapPin, Phone, Package, Star } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  Confirmed: { bg: "bg-zinc-100",   text: "text-zinc-700",  dot: "bg-zinc-400" },
  Placed:    { bg: "bg-amber-50",   text: "text-amber-700",  dot: "bg-amber-500" },
  Accepted:  { bg: "bg-amber-50",  text: "text-amber-700", dot: "bg-amber-500" },
  Packed:    { bg: "bg-zinc-100", text: "text-zinc-700", dot: "bg-zinc-400" },
  Shipped:   { bg: "bg-zinc-100", text: "text-zinc-700", dot: "bg-zinc-400" },
  Delivered: { bg: "bg-zinc-100", text: "text-[#2E7D32]", dot: "bg-[#2E7D32]" },
  Cancelled: { bg: "bg-zinc-100",    text: "text-zinc-500",   dot: "bg-zinc-400" },
};

export function BuyerOrderCard({ order, onRate }: { order: any, onRate?: (produceId: string, cropName: string) => void }) {
  const dateStr = order.createdAt ? formatDate(order.createdAt) : "Recently";
  const style = STATUS_STYLES[order.status] ?? { bg: "bg-zinc-100", text: "text-zinc-600", dot: "bg-zinc-400" };
  const isTerminal = order.status === "Delivered" || order.status === "Cancelled";

  return (
    <div className={`py-6 border-b border-zinc-200 last:border-0 group hover:bg-zinc-50/50 transition-colors -mx-4 px-4 sm:mx-0 sm:px-0 sm:hover:bg-transparent ${isTerminal ? "opacity-80" : ""}`}>
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex items-start gap-5 flex-1 min-w-0">
          {order.produceItem?.photos?.[0] ? (
            <img 
              src={order.produceItem.photos[0]} 
              alt={order.produceItem.name || "Product"} 
              className="h-16 w-16 shrink-0 rounded-sm object-cover bg-zinc-100"
            />
          ) : (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-sm bg-zinc-100 text-zinc-400 text-2xl">
              🌾
            </div>
          )}
          
          <div className="flex-1 min-w-0">
             <div className="flex flex-wrap items-center gap-2 mb-1">
               <span className={`text-[10px] font-bold uppercase tracking-widest ${style.text}`}>
                 {order.status}
               </span>
               <span className="text-zinc-300">·</span>
               <span className="text-xs font-mono text-zinc-400">#{order._id?.slice(-8).toUpperCase()}</span>
             </div>
             
             <h3 className="text-xl font-medium text-zinc-900 truncate">
               {order.produceItem?.name || "Deleted Item"}
             </h3>
             
             <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-zinc-600">
               <span>Qty: <strong className="font-medium text-zinc-900">{order.quantityOrdered} {order.produceItem?.unit || "kg"}</strong></span>
               <span className="w-px h-3 bg-zinc-300" />
               <span>Total: <strong className="font-medium text-[#2E7D32]">{formatCurrency(order.totalPrice)}</strong></span>
             </div>
             
             {/* Farmer info inline */}
             <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-zinc-500">
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
        
        {/* Actions */}
        <div className="flex flex-col md:items-end justify-between gap-4">
          <p className="text-xs text-zinc-400">Ordered {dateStr}</p>
          
          {(order.status === "Delivered" || order.status === "Placed" || order.status === "Confirmed") && order.produceItem?._id && onRate && (
            <button
              onClick={() => onRate(order.produceItem._id, order.produceItem.name)}
              className="inline-flex items-center gap-2 rounded-sm border border-zinc-200 px-4 py-2 text-xs font-medium text-zinc-700 hover:border-[#EF9F27] hover:text-[#EF9F27] transition-colors bg-white mt-auto"
            >
              <Star className="h-3.5 w-3.5" />
              Rate Crop
            </button>
          )}
        </div>
      </div>
    </div>
  );
}