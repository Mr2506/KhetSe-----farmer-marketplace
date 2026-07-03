"use client";

import { MapPin, Phone, Package, ChevronRight } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  Confirmed: { bg: "bg-blue-50",   text: "text-blue-700",  dot: "bg-blue-500" }, // Added to match backend!
  Placed:    { bg: "bg-blue-50",   text: "text-blue-700",  dot: "bg-blue-500" },
  Accepted:  { bg: "bg-amber-50",  text: "text-amber-700", dot: "bg-amber-500" },
  Packed:    { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500" },
  Shipped:   { bg: "bg-indigo-50", text: "text-indigo-700", dot: "bg-indigo-500" },
  Delivered: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  Cancelled: { bg: "bg-red-50",    text: "text-red-700",   dot: "bg-red-500" },
};

export function BuyerOrderCard({ order }: { order: any }) {
  const dateStr = order.createdAt ? formatDate(order.createdAt) : "Recently";
  const style = STATUS_STYLES[order.status] ?? { bg: "bg-zinc-100", text: "text-zinc-600", dot: "bg-zinc-400" };

  return (
    <div className="group overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-100 bg-zinc-50/60 px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Package className="h-3.5 w-3.5 text-zinc-400" />
          <p className="text-xs font-medium text-zinc-500">Ordered {dateStr}</p>
        </div>
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${style.bg} ${style.text}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
          {order.status}
        </span>
      </div>

      {/* Body */}
      <div className="p-5 sm:flex sm:items-center sm:justify-between sm:gap-6">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 mb-1">
            {order.produceItem?.category || "Produce"}
          </p>
          <h3 className="text-lg font-bold text-zinc-900 truncate">
            {order.produceItem?.name || "Deleted Item"}
          </h3>
          <div className="mt-2.5 flex flex-wrap items-center gap-4">
            <div className="flex items-baseline gap-1">
              <span className="text-xs text-zinc-400">Qty</span>
              <span className="text-sm font-bold text-zinc-800">
                {order.quantityOrdered} {order.produceItem?.unit || "kg"}
              </span>
            </div>
            <div className="h-4 w-px bg-zinc-200" />
            <div className="flex items-baseline gap-1">
              <span className="text-xs text-zinc-400">Total</span>
              <span className="text-sm font-bold text-emerald-700">
                {formatCurrency(order.totalPrice)}
              </span>
            </div>
          </div>
        </div>

        {/* Farmer contact */}
        <div className="mt-4 sm:mt-0 rounded-xl border border-zinc-200/80 bg-zinc-50 p-4 sm:min-w-[220px] shrink-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">Pickup Details</p>
          <p className="font-semibold text-zinc-900 text-sm">
            {order.farmer?.firstName} {order.farmer?.lastName}
          </p>
          <div className="mt-2 space-y-1.5">
            <p className="flex items-center gap-2 text-xs text-zinc-500">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
              <span>{order.farmer?.farmVillageName || "Local Farm"}</span>
            </p>
            <p className="flex items-center gap-2 text-xs">
              <Phone className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
              <a
                href={`tel:${order.farmer?.phone}`}
                className="font-medium text-zinc-600 hover:text-emerald-700 hover:underline transition-colors"
              >
                {order.farmer?.phone || "No phone provided"}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}