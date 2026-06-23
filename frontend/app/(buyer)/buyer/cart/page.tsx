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
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Your cart</h1>
        <p className="text-sm text-zinc-500">{rows.length} item(s)</p>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-10 text-center">
          <p className="text-zinc-600">Cart is empty</p>
          <Link href="/buyer/browse" className="mt-3 inline-block text-sm font-semibold text-emerald-700">
            Browse produce →
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {rows.map(({ listingId, quantity, listing }) => (
              <div key={listingId} className="flex gap-4 rounded-2xl border border-zinc-200 bg-white p-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-emerald-50 text-2xl">
                  {listing.photos[0]}
                </div>
                <div className="flex-1">
                  <p className="font-bold">{listing.cropName}</p>
                  <p className="text-xs text-zinc-500">{listing.farmerName}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <button type="button" onClick={() => updateCartQty(listingId, quantity - 1)} className="h-8 w-8 rounded-lg bg-zinc-100">−</button>
                    <span className="w-6 text-center text-sm font-bold">{quantity}</span>
                    <button type="button" onClick={() => updateCartQty(listingId, quantity + 1)} className="h-8 w-8 rounded-lg bg-zinc-100">+</button>
                    <button type="button" onClick={() => removeFromCart(listingId)} className="ml-auto text-xs text-red-600">Remove</button>
                  </div>
                </div>
                <p className="font-bold text-emerald-700">{formatCurrency(listing.price * quantity)}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-4">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span className="font-bold">{formatCurrency(subtotal)}</span>
            </div>
            <Link
              href="/buyer/checkout"
              className="mt-4 flex h-12 items-center justify-center rounded-xl bg-emerald-600 text-sm font-semibold text-white hover:bg-emerald-500"
            >
              Proceed to checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
