"use client";

import { useState } from "react";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";
import { ShoppingCart, Minus, Plus } from "lucide-react";

export function AddToCartPanel({
  listingId,
  maxQty,
  price,
  unit,
  cropName,
  farmerName,
  photo,
  farmerLocation
}: {
  listingId: string;
  maxQty: number;
  price: number;
  unit: string;
  cropName: string;
  farmerName: string;
  photo: string;
  farmerLocation?: { lat: number; lng: number } | null;
}) {
  const [qty, setQty] = useState(1);

  function handleAddToCart() {
    if (maxQty <= 0) {
      toast.error("Sold out");
      return;
    }

    const existingCartStr = localStorage.getItem("khetse_cart");
    let cart = existingCartStr ? JSON.parse(existingCartStr) : [];

    const existingItemIndex = cart.findIndex((item: any) => item.produceId === listingId);

    if (existingItemIndex >= 0) {
      // If it is already in the cart, increase quantity (up to max stock)
      const newQty = cart[existingItemIndex].quantityOrdered + qty;
      if (newQty > maxQty) {
        toast.error(`You can only buy up to ${maxQty} ${unit}`);
        return;
      }
      cart[existingItemIndex].quantityOrdered = newQty;
    } else {
      // New item! Add all details so Cart Page can display it
      cart.push({
        produceId: listingId,
        cropName,
        farmerName,
        photo,
        price,
        unit,
        maxQty,
        quantityOrdered: qty,
        farmerLocation: farmerLocation || null,
      });
    }

    localStorage.setItem("khetse_cart", JSON.stringify(cart));

    // Update the sidebar count if needed
    window.dispatchEvent(new Event('cartUpdated'));

    toast.success(`${qty} ${unit} added to cart!`, {
      icon: <ShoppingCart className="h-4 w-4 text-[#2E7D32]" />,
    });
  }

  return (
    <div className="rounded-xl border border-[#2E7D32]/20 bg-[#F0FAF0] p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2" role="group" aria-label="Select quantity">
          <button
            type="button"
            onClick={() => setQty(Math.max(1, qty - 1))}
            aria-label="Decrease quantity"
            disabled={qty <= 1}
            className="h-11 w-11 rounded-xl bg-white text-lg font-bold shadow-sm active:scale-95 transition-transform border border-[#E5E7EB] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Minus className="h-4 w-4" aria-hidden="true" />
          </button>
          <span
            className="w-10 text-center font-bold text-[#1A1A1A]"
            aria-live="polite"
            aria-atomic="true"
          >
            {qty}
          </span>
          <button
            type="button"
            onClick={() => setQty(Math.min(maxQty, qty + 1))}
            aria-label="Increase quantity"
            disabled={qty >= maxQty}
            className="h-11 w-11 rounded-xl bg-white text-lg font-bold shadow-sm active:scale-95 transition-transform border border-[#E5E7EB] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
          </button>
          <span className="text-sm text-[#6B7280] font-medium">{unit}</span>
        </div>
        <p
          className="font-bold text-[#1B5E20] text-xl"
          aria-live="polite"
          aria-atomic="true"
        >
          {formatCurrency(price * qty)}
        </p>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={maxQty <= 0}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#2E7D32] py-3.5 text-sm font-bold text-white hover:bg-[#256727] disabled:opacity-50 shadow-sm transition-all active:scale-[0.98]"
        >
          <ShoppingCart className="h-4 w-4" aria-hidden="true" />
          Add to Cart
        </button>
      </div>

      {maxQty > 0 && maxQty <= 10 && (
        <p className="text-[10px] text-[#B47A00] font-bold mt-3 text-center uppercase tracking-wider">
          Hurry! Only {maxQty} {unit} left in stock
        </p>
      )}
    </div>
  );
}