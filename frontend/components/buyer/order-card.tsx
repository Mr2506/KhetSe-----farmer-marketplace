"use client";

import { MapPin, Phone } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

export function BuyerOrderCard({ order }: { order: any }) {
  // Fallback date just in case
  const dateStr = order.createdAt ? formatDate(order.createdAt) : "Recently";

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-md">
      {/* Top Bar: Date & Status */}
      <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50 px-5 py-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Ordered on {dateStr}
        </p>
        <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
          {order.status}
        </span>
      </div>

      {/* Main Order Details */}
      <div className="gap-6 p-5 sm:flex sm:items-center sm:justify-between">
        <div className="flex-1">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            {order.produceItem?.category || 'Produce'}
          </p>
          <h3 className="mt-1 text-xl font-bold text-zinc-900">
            {order.produceItem?.name || 'Deleted Item'}
          </h3>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-zinc-600">
            <p>
              <span className="font-semibold text-zinc-900">Qty:</span> {order.quantityOrdered} {order.produceItem?.unit || 'kg'}
            </p>
            <p className="hidden text-zinc-300 sm:block">|</p>
            <p>
              <span className="font-semibold text-zinc-900">Total:</span> <span className="font-bold text-emerald-700">{formatCurrency(order.totalPrice)}</span>
            </p>
          </div>
        </div>

        {/* Farmer Contact Info Box */}
        <div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 sm:mt-0 sm:min-w-[240px]">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-emerald-800">Pickup Details</p>
          <p className="font-semibold text-zinc-900">
            {order.farmer?.firstName} {order.farmer?.lastName}
          </p>
          <div className="mt-2 space-y-1.5 text-xs text-zinc-600">
            <p className="flex items-start gap-1.5">
              <MapPin className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>{order.farmer?.farmVillageName || 'Local Farm'}</span>
            </p>
            <p className="flex items-center gap-1.5">
              <Phone className="h-4 w-4 shrink-0 text-emerald-600" />
              <a href={`tel:${order.farmer?.phone}`} className="font-medium hover:text-emerald-700 hover:underline">
                {order.farmer?.phone || 'No phone provided'}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}