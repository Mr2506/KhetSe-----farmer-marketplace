"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { MoreVertical, Edit3, Pause, Play, Trash2, CheckCircle, AlertTriangle, XCircle, TrendingUp, TrendingDown, Package } from "lucide-react";

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

type StatusConfig = {
  label: string;
  className: string;
  icon: React.ReactNode;
};

const STATUS_MAP: Record<string, StatusConfig> = {
  LIVE:      { label: "Live",      className: "bg-emerald-50 text-emerald-700 border-emerald-200/80",  icon: <CheckCircle className="h-3 w-3" /> },
  LOW_STOCK: { label: "Low Stock", className: "bg-amber-50 text-amber-700 border-amber-200/80",        icon: <AlertTriangle className="h-3 w-3" /> },
  SOLD_OUT:  { label: "Sold Out",  className: "bg-red-50 text-red-700 border-red-200/80",              icon: <XCircle className="h-3 w-3" /> },
  PAUSED:    { label: "Paused",    className: "bg-zinc-100 text-zinc-600 border-zinc-200/80",          icon: <Pause className="h-3 w-3" /> },
};

export function FarmerListingRow({ listing, onRefresh }: { listing: Listing; onRefresh: () => void }) {
  const [price, setPrice] = useState(listing.pricePerUnit);
  const [qty, setQty] = useState(listing.quantityAvailable);
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  let statusKey = "LIVE";
  if (!listing.isAvailable) statusKey = "PAUSED";
  else if (listing.quantityAvailable === 0) statusKey = "SOLD_OUT";
  else if (listing.quantityAvailable < 10) statusKey = "LOW_STOCK";

  const status = STATUS_MAP[statusKey];
  const photo = listing.photos?.[0];
  const isImage = typeof photo === "string" && photo.startsWith("http");
  const savings = listing.mandiPrice > 0 ? listing.pricePerUnit - listing.mandiPrice : null;

  async function save(field: "price" | "quantity") {
    setLoading(true);
    try {
      const token = localStorage.getItem("khetse_token");
      const updateData = field === "price" ? { pricePerUnit: price } : { quantityAvailable: qty };
      const res = await fetch(`http://localhost:5000/api/produce/${listing._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(updateData),
      });
      if (!res.ok) throw new Error("Failed to update");
      toast.success(`${field === "price" ? "Price" : "Quantity"} updated`);
      onRefresh();
    } catch {
      toast.error("Error updating listing");
    } finally {
      setLoading(false);
    }
  }

  async function togglePause() {
    setLoading(true);
    setMenuOpen(false);
    try {
      const token = localStorage.getItem("khetse_token");
      const res = await fetch(`http://localhost:5000/api/produce/${listing._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ isAvailable: !listing.isAvailable }),
      });
      if (!res.ok) throw new Error();
      toast.success(listing.isAvailable ? "Listing paused" : "Listing resumed");
      onRefresh();
    } catch {
      toast.error("Error toggling status");
    } finally {
      setLoading(false);
    }
  }

  async function remove() {
    if (!confirm("Are you sure you want to permanently delete this listing?")) return;
    setLoading(true);
    setMenuOpen(false);
    try {
      const token = localStorage.getItem("khetse_token");
      const res = await fetch(`http://localhost:5000/api/produce/${listing._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      toast.success("Listing deleted");
      onRefresh();
    } catch {
      toast.error("Error deleting listing");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`group relative rounded-2xl border bg-white shadow-sm transition-all duration-200 hover:shadow-md ${
      !listing.isAvailable ? "border-zinc-200 opacity-70" : "border-zinc-200/80"
    }`}>
      <div className="flex flex-wrap items-start gap-4 p-5">
        
        {/* Photo */}
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-zinc-100 bg-emerald-50">
          {isImage ? (
            <img src={photo} alt={listing.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-2xl">
              {photo || "🌾"}
            </div>
          )}
        </div>

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="font-bold text-zinc-900 text-base truncate">{listing.name}</h3>
            <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-bold ${status.className}`}>
              {status.icon}
              {status.label}
            </span>
          </div>
          <p className="text-xs text-zinc-400 mb-3">
            {listing.category}
            {listing.mandiPrice > 0 && (
              <span className="ml-2 text-zinc-400">· Mandi ref ₹{listing.mandiPrice}/{listing.unit}</span>
            )}
            {savings !== null && (
              <span className={`ml-2 font-semibold inline-flex items-center gap-0.5 ${savings < 0 ? "text-emerald-600" : "text-red-500"}`}>
                {savings < 0 ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                {savings < 0 ? `₹${Math.abs(savings)} below mandi` : `₹${savings} above mandi`}
              </span>
            )}
          </p>

          {/* Inline editable fields */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-zinc-500">Price (₹)</label>
              <div className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 px-2 py-1.5 focus-within:border-emerald-400 focus-within:ring-1 focus-within:ring-emerald-400/20 transition-all">
                <input
                  type="number"
                  value={price.toString()}
                  onChange={(e) => setPrice(e.target.value === "" ? 0 : Number(e.target.value))}
                  onWheel={(e) => (e.target as HTMLElement).blur()}
                  disabled={!listing.isAvailable}
                  className="w-16 bg-transparent text-sm font-bold text-zinc-800 outline-none disabled:text-zinc-400"
                />
              </div>
              <button
                type="button"
                disabled={loading || !listing.isAvailable}
                onClick={() => save("price")}
                className="rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-bold text-emerald-700 border border-emerald-200/80 hover:bg-emerald-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Save
              </button>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-zinc-500">Qty ({listing.unit})</label>
              <div className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 px-2 py-1.5 focus-within:border-emerald-400 focus-within:ring-1 focus-within:ring-emerald-400/20 transition-all">
                <Package className="h-3 w-3 text-zinc-400 shrink-0" />
                <input
                  type="number"
                  value={qty.toString()}
                  onChange={(e) => setQty(e.target.value === "" ? 0 : Number(e.target.value))}
                  onWheel={(e) => (e.target as HTMLElement).blur()}
                  disabled={!listing.isAvailable}
                  className="w-16 bg-transparent text-sm font-bold text-zinc-800 outline-none disabled:text-zinc-400"
                />
              </div>
              <button
                type="button"
                disabled={loading || !listing.isAvailable}
                onClick={() => save("quantity")}
                className="rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-bold text-emerald-700 border border-emerald-200/80 hover:bg-emerald-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>

        {/* Actions menu */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            disabled={loading}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors disabled:opacity-40"
          >
            <MoreVertical className="h-4 w-4" />
          </button>

          {menuOpen && (
            <>
              <button
                type="button"
                className="fixed inset-0 z-10"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 top-full z-20 mt-1.5 w-44 overflow-hidden rounded-xl border border-zinc-200/80 bg-white shadow-xl">
                <Link
                  href={`/farmer/listings/${listing._id}/edit`}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
                >
                  <Edit3 className="h-3.5 w-3.5 text-zinc-400" />
                  Edit listing
                </Link>
                <button
                  type="button"
                  disabled={loading}
                  onClick={togglePause}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors disabled:opacity-50"
                >
                  {listing.isAvailable
                    ? <Pause className="h-3.5 w-3.5 text-zinc-400" />
                    : <Play className="h-3.5 w-3.5 text-zinc-400" />}
                  {listing.isAvailable ? "Pause listing" : "Resume listing"}
                </button>
                <div className="border-t border-zinc-100" />
                <button
                  type="button"
                  disabled={loading}
                  onClick={remove}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  <Trash2 className="h-3.5 w-3.5 text-red-400" />
                  Delete listing
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}