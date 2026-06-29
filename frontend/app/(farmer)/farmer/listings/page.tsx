"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Sprout, LayoutGrid } from "lucide-react";
import { FarmerListingRow } from "@/components/farmer/listing-row";

export default function FarmerListingsPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyListings = async () => {
    try {
      const token = localStorage.getItem("khetse_token");
      if (!token) return;
      const response = await fetch("http://localhost:5000/api/produce/mylistings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) setListings(data);
    } catch (error) {
      console.error("Failed to fetch listings", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyListings();
  }, []);

  const live    = listings.filter((l) => l.isAvailable && l.quantityAvailable > 0);
  const paused  = listings.filter((l) => !l.isAvailable);
  const soldOut = listings.filter((l) => l.isAvailable && l.quantityAvailable === 0);

  if (loading) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">My Listings</h1>
          <p className="text-sm text-zinc-500 mt-1">Loading your marketplace...</p>
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-28 animate-pulse rounded-2xl bg-white border border-zinc-200/80 shadow-sm" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-7">
      
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl tracking-tight">My Listings</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {listings.length} crops · {live.length} live · {paused.length} paused · {soldOut.length} sold out
          </p>
        </div>
        <Link
          href="/farmer/listings/new"
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-500 active:scale-95 transition-all"
        >
          <Plus className="h-4 w-4" />
          New Listing
        </Link>
      </div>

      {/* Stat strip */}
      {listings.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Live", count: live.length, color: "bg-emerald-50 text-emerald-700 border-emerald-200/60" },
            { label: "Paused", count: paused.length, color: "bg-zinc-100 text-zinc-600 border-zinc-200/60" },
            { label: "Sold Out", count: soldOut.length, color: "bg-red-50 text-red-700 border-red-200/60" },
          ].map(({ label, count, color }) => (
            <div key={label} className={`rounded-xl border px-4 py-3 text-center ${color}`}>
              <p className="text-xl font-black">{count}</p>
              <p className="text-xs font-semibold mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Listing rows */}
      {listings.length > 0 ? (
        <div className="space-y-3">
          {listings.map((listing) => (
            <FarmerListingRow key={listing._id} listing={listing} onRefresh={fetchMyListings} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-16 text-center shadow-sm">
          <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
            <Sprout className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900">No listings yet</h3>
          <p className="mt-2 text-sm text-zinc-500 max-w-sm mx-auto leading-relaxed">
            Start selling your harvest on KhetSe. Create your first crop listing and reach buyers near you.
          </p>
          <Link
            href="/farmer/listings/new"
            className="mt-6 inline-flex items-center gap-2.5 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-500 transition-all"
          >
            <Plus className="h-4 w-4" />
            Create First Listing
          </Link>
        </div>
      )}
    </div>
  );
}