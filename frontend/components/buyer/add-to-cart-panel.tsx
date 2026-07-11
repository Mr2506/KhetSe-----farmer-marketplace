"use client";

import { useState } from "react";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";

export function AddToCartPanel({
  listingId,
  maxQty,
  price,
  unit,
  cropName,
  farmerName,
  photo,
  farmerLocation // NEW: Catching the coordinates from the Product Page!
}: {
  listingId: string;
  maxQty: number;
  price: number;
  unit: string;
  cropName: string;
  farmerName: string;
  photo: string;
  farmerLocation?: { lat: number; lng: number } | null; // NEW: Defining the type
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
        farmerLocation: farmerLocation || null, // NEW: Saving the GPS coordinates into the Cart!
      });
    }

    localStorage.setItem("khetse_cart", JSON.stringify(cart));
    
    // Update the sidebar count if needed
    window.dispatchEvent(new Event('cartUpdated'));

    toast.success(`${qty} ${unit} added to cart!`, {
      icon: <ShoppingCart className="h-4 w-4 text-emerald-600" />
    });
  }

  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setQty(Math.max(1, qty - 1))}
            className="h-10 w-10 rounded-xl bg-white text-lg font-bold shadow-sm active:scale-95 transition-transform"
          >
            −
          </button>
          <span className="w-10 text-center font-bold text-zinc-900">{qty}</span>
          <button
            type="button"
            onClick={() => setQty(Math.min(maxQty, qty + 1))}
            className="h-10 w-10 rounded-xl bg-white text-lg font-bold shadow-sm active:scale-95 transition-transform"
          >
            +
          </button>
          <span className="text-sm text-zinc-500 font-medium">{unit}</span>
        </div>
        <p className="font-bold text-emerald-800 text-xl">{formatCurrency(price * qty)}</p>
      </div>
      
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={maxQty <= 0}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50 shadow-sm transition-all active:scale-[0.98]"
        >
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </button>
      </div>
      
      {maxQty > 0 && maxQty <= 10 && (
        <p className="text-[10px] text-amber-600 font-bold mt-3 text-center uppercase tracking-wider animate-pulse">
          Hurry! Only {maxQty} {unit} left in stock
        </p>
      )}
    </div>
  );
}