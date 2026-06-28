"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

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
      toast.error("Sold out");
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
      // Send the order to our real backend!
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // VIP Pass from Firebase login!
        },
        body: JSON.stringify({
          produceId: listingId,
          quantityOrdered: qty,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to place order");
      }

      toast.success(`Successfully ordered ${qty} ${unit}!`);
      
      // Navigate them to their orders page to see the receipt
      router.push("/buyer/orders");
      router.refresh(); 

    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setQty(Math.max(1, qty - 1))}
            disabled={loading}
            className="h-10 w-10 rounded-xl bg-white text-lg font-bold shadow-sm disabled:opacity-50"
          >
            −
          </button>
          <span className="w-10 text-center font-bold">{qty}</span>
          <button
            type="button"
            onClick={() => setQty(Math.min(maxQty, qty + 1))}
            disabled={loading}
            className="h-10 w-10 rounded-xl bg-white text-lg font-bold shadow-sm disabled:opacity-50"
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
          onClick={handleBuy}
          disabled={maxQty <= 0 || loading}
          className="flex-1 rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50 shadow-sm"
        >
          {loading ? "Processing..." : "Place Order Now"}
        </button>
      </div>
      
      {maxQty > 0 && maxQty <= 10 && (
        <p className="text-[10px] text-amber-600 font-bold mt-2 text-center uppercase tracking-wider animate-pulse">
          Hurry! Only {maxQty} {unit} left!
        </p>
      )}
    </div>
  );
}