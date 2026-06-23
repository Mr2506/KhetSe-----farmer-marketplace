"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { useCartStore } from "@/lib/cart-store";
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
  const addToCart = useCartStore((s) => s.addToCart);
  const [qty, setQty] = useState(1);

  function handleAdd() {
    if (maxQty <= 0) {
      toast.error("Sold out");
      return;
    }
    addToCart(listingId, Math.min(qty, maxQty));
    toast.success("Added to cart");
  }

  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setQty(Math.max(1, qty - 1))}
            className="h-10 w-10 rounded-xl bg-white text-lg font-bold shadow-sm"
          >
            −
          </button>
          <span className="w-10 text-center font-bold">{qty}</span>
          <button
            type="button"
            onClick={() => setQty(Math.min(maxQty, qty + 1))}
            className="h-10 w-10 rounded-xl bg-white text-lg font-bold shadow-sm"
          >
            +
          </button>
          <span className="text-sm text-zinc-500">{unit}</span>
        </div>
        <p className="font-bold text-emerald-800">{formatCurrency(price * qty)}</p>
      </div>
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={handleAdd}
          disabled={maxQty <= 0}
          className="flex-1 rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
        >
          Add to cart
        </button>
        <Link
          href="/buyer/cart"
          className="rounded-xl border border-emerald-300 bg-white px-4 py-3 text-sm font-semibold text-emerald-800"
        >
          View cart
        </Link>
      </div>
    </div>
  );
}
