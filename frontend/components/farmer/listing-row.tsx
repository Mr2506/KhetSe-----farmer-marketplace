"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

type Listing = {
  _id: string;
  name: string;
  category: string;
  pricePerUnit: number;
  mandiPrice: number;
  quantityAvailable: number;
  unit: string;
  isAvailable: boolean;
  photos: string[];
};

export function FarmerListingRow({ listing, onRefresh }: { listing: Listing, onRefresh: () => void }) {
  const [price, setPrice] = useState(listing.pricePerUnit);
  const [qty, setQty] = useState(listing.quantityAvailable);
  const [loading, setLoading] = useState(false);

  let status = "LIVE";
  if (!listing.isAvailable) status = "PAUSED";
  else if (listing.quantityAvailable === 0) status = "SOLD_OUT";
  else if (listing.quantityAvailable < 10) status = "LOW_STOCK";

  const statusColor =
    status === "LIVE" ? "bg-emerald-50 text-emerald-700" :
    status === "LOW_STOCK" ? "bg-amber-50 text-amber-700" :
    status === "SOLD_OUT" ? "bg-red-50 text-red-700" :
    "bg-zinc-100 text-zinc-600";

  const photo = listing.photos && listing.photos.length > 0 ? listing.photos[0] : "🌾";
  const isImage = photo.startsWith("http");

  async function save(field: "price" | "quantity") {
    setLoading(true);
    try {
      const token = localStorage.getItem("khetse_token");
      
      // Determine if they clicked save on price or save on quantity
      const updateData = field === "price" 
        ? { pricePerUnit: price } 
        : { quantityAvailable: qty };

      const res = await fetch(`http://localhost:5000/api/produce/${listing._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      if (!res.ok) throw new Error("Failed to update");
      
      toast.success(`${field === "price" ? "Price" : "Quantity"} updated!`);
      onRefresh(); // Tells the parent page to re-fetch the data!
    } catch (error) {
      toast.error("Error updating listing");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function togglePause() {
    setLoading(true);
    try {
      const token = localStorage.getItem("khetse_token");
      const res = await fetch(`http://localhost:5000/api/produce/${listing._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ isAvailable: !listing.isAvailable })
      });

      if (!res.ok) throw new Error("Failed to toggle status");
      
      toast.success(listing.isAvailable ? "Listing Paused" : "Listing Resumed");
      onRefresh();
    } catch (error) {
      toast.error("Error toggling status");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function remove() {
    if (!confirm("Are you sure you want to delete this listing permanently?")) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem("khetse_token");
      const res = await fetch(`http://localhost:5000/api/produce/${listing._id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error("Failed to delete");
      
      toast.success("Listing deleted");
      onRefresh();
    } catch (error) {
      toast.error("Error deleting listing");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`rounded-2xl border ${!listing.isAvailable ? 'border-zinc-200 bg-zinc-50 opacity-75' : 'border-zinc-200 bg-white'} p-4 shadow-sm transition-all`}>
      <div className="flex flex-wrap items-start gap-4">
        
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-emerald-50 text-2xl border border-zinc-100">
          {isImage ? (
             <img src={photo} alt={listing.name} className="h-full w-full object-cover" />
          ) : (
             photo
          )}
        </div>

        <div className="flex-1 min-w-[200px]">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-bold">{listing.name}</p>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${statusColor}`}>
              {status.replace("_", " ")}
            </span>
          </div>
          <p className="text-xs text-zinc-500">{listing.category} · Mandi ref ₹{listing.mandiPrice}</p>
          <div className="mt-3 flex flex-wrap gap-3">
            <label className="text-xs text-zinc-600 font-medium">
              Price (₹)
              <input 
                type="number" 
                value={price.toString()} 
                onChange={(e) => setPrice(e.target.value === '' ? 0 : Number(e.target.value))} 
                onWheel={(e) => (e.target as HTMLElement).blur()} 
                disabled={!listing.isAvailable} 
                className="ml-1 w-20 rounded-md border border-zinc-200 px-2 py-1 outline-none focus:border-emerald-500 disabled:bg-zinc-100" 
              />
              <button type="button" disabled={loading || !listing.isAvailable} onClick={() => save("price")} className="ml-2 text-emerald-700 font-semibold hover:underline disabled:opacity-50 disabled:cursor-not-allowed">Save</button>
            </label>
            <label className="text-xs text-zinc-600 font-medium">
              Qty ({listing.unit})
              <input 
                type="number" 
                value={qty.toString()} 
                onChange={(e) => setQty(e.target.value === '' ? 0 : Number(e.target.value))} 
                onWheel={(e) => (e.target as HTMLElement).blur()} 
                disabled={!listing.isAvailable} 
                className="ml-1 w-20 rounded-md border border-zinc-200 px-2 py-1 outline-none focus:border-emerald-500 disabled:bg-zinc-100" 
              />
              <button type="button" disabled={loading || !listing.isAvailable} onClick={() => save("quantity")} className="ml-2 text-emerald-700 font-semibold hover:underline disabled:opacity-50 disabled:cursor-not-allowed">Save</button>
            </label>
          </div>
        </div>
        <div className="flex flex-col gap-2 border-l border-zinc-100 pl-4">
          <Link href={`/farmer/listings/${listing._id}/edit`} className="text-xs font-semibold text-emerald-700 hover:underline">Edit</Link>
          <button type="button" disabled={loading} onClick={togglePause} className="text-xs font-semibold text-zinc-600 hover:underline text-left">
            {listing.isAvailable ? "Pause" : "Resume"}
          </button>
          <button type="button" disabled={loading} onClick={remove} className="text-xs font-semibold text-red-600 hover:underline text-left">Delete</button>
        </div>
      </div>
    </div>
  );
}