"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Minus, Plus, ShoppingBag, Zap, AlertTriangle } from "lucide-react";

import { formatCurrency } from "@/lib/utils";

export function AddToCartPanel({
  listingId,
  maxQty,
  price,
  unit,
}: {
  listingId: string;
  maxQty: number;
  price: number;
  unit: string;
}) {
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);

  async function handleBuy() {
    if (maxQty <= 0) {
      toast.error("Sorry, this item is sold out.");
      return;
    }

    const token = localStorage.getItem("khetse_token");
    if (!token) {
      toast.error("Please log in to place an order.");
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ produceId: listingId, quantityOrdered: qty }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to place order");

      toast.success(`Order placed — ${qty} ${unit} incoming!`);
      router.push("/buyer/orders");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const isSoldOut = maxQty <= 0;
  const isLowStock = maxQty > 0 && maxQty <= 10;
  const total = formatCurrency(price * qty);

  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm space-y-4">
      
      {/* Low stock warning */}
      {isLowStock && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-200/80 bg-amber-50 px-3.5 py-2.5">
          <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
          <p className="text-xs font-bold text-amber-800">
            Only {maxQty} {unit} left — order soon!
          </p>
        </div>
      )}

      {/* Quantity selector */}
      <div>
        <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Quantity</label>
        <div className="flex items-center gap-4">
          <div className="flex items-center rounded-xl border border-zinc-200 bg-zinc-50 p-1">
            <button
              type="button"
              onClick={() => setQty(Math.max(1, qty - 1))}
              disabled={loading || qty <= 1}
              className="grid h-9 w-9 place-items-center rounded-lg text-zinc-600 transition-all hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-12 text-center text-base font-bold text-zinc-900">{qty}</span>
            <button
              type="button"
              onClick={() => setQty(Math.min(maxQty, qty + 1))}
              disabled={loading || qty >= maxQty}
              className="grid h-9 w-9 place-items-center rounded-lg text-zinc-600 transition-all hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <span className="text-sm text-zinc-400 font-medium">{unit}</span>
          <div className="ml-auto text-right">
            <p className="text-xs text-zinc-400">Total</p>
            <p className="text-xl font-black text-emerald-700">{total}</p>
          </div>
        </div>
      </div>

      {/* CTA button */}
      <button
        type="button"
        onClick={handleBuy}
        disabled={isSoldOut || loading}
        className={`group w-full flex items-center justify-center gap-2.5 rounded-xl py-3.5 text-sm font-bold shadow-md transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${
          isSoldOut
            ? "bg-zinc-200 text-zinc-500 shadow-none"
            : "bg-emerald-600 text-white shadow-emerald-600/25 hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-600/30"
        }`}
      >
        {loading ? (
          "Processing..."
        ) : isSoldOut ? (
          "Out of Stock"
        ) : (
          <>
            <Zap className="h-4 w-4" />
            Place Order Now
          </>
        )}
      </button>

      <div className="flex items-center gap-2 text-xs text-zinc-400">
        <ShoppingBag className="h-3.5 w-3.5 shrink-0" />
        <span>Direct from farmer — no middlemen, no markup</span>
      </div>
    </div>
  );
}