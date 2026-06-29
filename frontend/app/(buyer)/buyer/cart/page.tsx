"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { useCartStore } from "@/lib/cart-store";
import { formatCurrency } from "@/lib/utils";

type ListingPreview = {
  id: string;
  cropName: string;
  price: number;
  unit: string;
  photos: string[];
  farmerName: string;
};

// Mock listing data for cart preview — matches mock data in lib/data.ts
const mockCartListings: ListingPreview[] = [
  { id: "listing-1", cropName: "Tomato", price: 35, unit: "kg", photos: ["🍅"], farmerName: "Ramesh Patel" },
  { id: "listing-2", cropName: "Cabbage", price: 22, unit: "kg", photos: ["🥬"], farmerName: "Ramesh Patel" },
  { id: "listing-3", cropName: "Kesar Mango", price: 180, unit: "dozen", photos: ["🥭"], farmerName: "Suresh Desai" },
  { id: "listing-4", cropName: "Onion", price: 28, unit: "kg", photos: ["🧅"], farmerName: "Suresh Desai" },
  { id: "listing-5", cropName: "Basmati Rice", price: 95, unit: "kg", photos: ["🌾"], farmerName: "Ramesh Patel" },
  { id: "listing-6", cropName: "Wheat", price: 32, unit: "kg", photos: ["🌾"], farmerName: "Suresh Desai" },
];

export default function CartPage() {
  const { cart, updateCartQty, removeFromCart } = useCartStore();
  const [listings, setListings] = useState<ListingPreview[]>([]);

  useEffect(() => {
    if (cart.length === 0) {
      setListings([]);
      return;
    }
    // Use mock data instead of API call
    const matched = cart
      .map((item) => mockCartListings.find((l) => l.id === item.listingId))
      .filter(Boolean) as ListingPreview[];
    setListings(matched);
  }, [cart]);

  const rows = cart
    .map((item) => {
      const listing = listings.find((l) => l.id === item.listingId);
      if (!listing) return null;
      return { ...item, listing };
    })
    .filter(Boolean) as { listingId: string; quantity: number; listing: ListingPreview }[];

  const subtotal = rows.reduce((s, r) => s + r.listing.price * r.quantity, 0);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900">Your cart</h1>
        <p className="mt-1 text-sm text-zinc-500">{rows.length} item(s)</p>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 sm:p-12 text-center shadow-sm">
          <p className="text-zinc-600 font-medium">Your cart is currently empty</p>
          <Link href="/buyer/browse" className="mt-4 inline-flex items-center rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 transition-all">
            Browse produce →
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3 lg:items-start lg:gap-8">
          <div className="space-y-3 lg:col-span-2">
            {rows.map(({ listingId, quantity, listing }) => (
              <div key={listingId} className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3 sm:gap-4 flex-1">
                  <div className="flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-50 to-amber-50 text-2xl sm:text-3xl border border-emerald-100">
                    {listing.photos[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-zinc-900 truncate">{listing.cropName}</p>
                    <p className="text-xs text-zinc-500 truncate">{listing.farmerName}</p>
                    <p className="mt-1 text-xs font-semibold text-emerald-700 sm:hidden">
                      {formatCurrency(listing.price)} / {listing.unit}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 border-zinc-100 pt-3 sm:pt-0">
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => updateCartQty(listingId, quantity - 1)} className="h-8 w-8 rounded-lg bg-zinc-100 font-bold text-zinc-700 hover:bg-zinc-200 transition-colors">−</button>
                    <span className="w-6 text-center text-sm font-bold text-zinc-900">{quantity}</span>
                    <button type="button" onClick={() => updateCartQty(listingId, quantity + 1)} className="h-8 w-8 rounded-lg bg-zinc-100 font-bold text-zinc-700 hover:bg-zinc-200 transition-colors">+</button>
                  </div>
                  
                  <div className="text-right sm:min-w-[90px]">
                    <p className="font-bold text-emerald-700 text-base sm:text-lg">{formatCurrency(listing.price * quantity)}</p>
                    <button type="button" onClick={() => removeFromCart(listingId)} className="text-xs text-red-600 hover:underline">Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-sm sticky top-6">
            <h2 className="text-lg font-bold text-zinc-900 mb-4 pb-3 border-b border-zinc-100">Order Summary</h2>
            <div className="space-y-2 text-sm text-zinc-600">
              <div className="flex justify-between">
                <span>Items ({rows.length})</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Delivery / Pickup</span>
                <span className="text-emerald-600 font-medium">Free</span>
              </div>
            </div>
            <div className="flex justify-between items-center text-base pt-4 mt-4 border-t border-zinc-100">
              <span className="font-bold text-zinc-900">Total Subtotal</span>
              <span className="font-bold text-emerald-700 text-xl">{formatCurrency(subtotal)}</span>
            </div>
            <Link
              href="/buyer/checkout"
              className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-emerald-600 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 transition-all"
            >
              Proceed to checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
