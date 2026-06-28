"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FarmerListingRow } from "@/components/farmer/listing-row";

export default function FarmerListingsPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyListings = async () => {
    try {
      const token = localStorage.getItem("khetse_token");
      if (!token) return;

      const response = await fetch("http://localhost:5000/api/produce/mylistings", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      if (response.ok) {
        setListings(data);
      }
    } catch (error) {
      console.error("Failed to fetch listings", error);
    } finally {
      setLoading(false);
    }
  };

  // Run this function as soon as the page loads!
  useEffect(() => {
    fetchMyListings();
  }, []);

  if (loading) {
    return <div className="p-10 text-center text-zinc-500 animate-pulse font-medium">Loading your marketplace...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">My listings</h1>
          <p className="text-sm text-zinc-500">{listings.length} products · live stock & pricing</p>
        </div>
        <Link href="/farmer/listings/new" className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 transition shadow-sm">
          + New listing
        </Link>
      </div>

      <div className="space-y-3">
        {listings.map((listing) => (
          <FarmerListingRow 
            key={listing._id} 
            listing={listing} 
            onRefresh={fetchMyListings} 
          />
        ))}
      </div>

      {listings.length === 0 && (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-10 text-center shadow-sm">
          <p className="text-zinc-600">No listings yet</p>
          <Link href="/farmer/listings/new" className="mt-2 inline-block text-sm font-semibold text-emerald-700 hover:underline">
            Create your first listing
          </Link>
        </div>
      )}
    </div>
  );
}