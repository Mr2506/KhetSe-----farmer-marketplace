"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { deleteListingAction, updateListingFieldAction } from "@/lib/actions";
import { formatListingStatus } from "@/lib/roles";
import { formatCurrency } from "@/lib/utils";

type Listing = {
  id: string;
  cropName: string;
  category: string;
  price: number;
  mandiPrice: number;
  quantity: number;
  unit: string;
  status: string;
  photos: string[];
};

export function FarmerListingRow({ listing }: { listing: Listing }) {
  const router = useRouter();
  const [price, setPrice] = useState(listing.price);
  const [qty, setQty] = useState(listing.quantity);
  const [loading, setLoading] = useState(false);

  async function save(field: "price" | "quantity") {
    setLoading(true);
    try {
      await updateListingFieldAction(listing.id, field === "price" ? { price } : { quantity: qty });
      toast.success("Updated");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function togglePause() {
    setLoading(true);
    try {
      await updateListingFieldAction(listing.id, {
        status: listing.status === "PAUSED" ? "LIVE" : "PAUSED",
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function remove() {
    if (!confirm("Delete this listing?")) return;
    await deleteListingAction(listing.id);
    toast.success("Deleted");
    router.refresh();
  }

  const statusColor =
    listing.status === "LIVE" ? "bg-emerald-50 text-emerald-700" :
    listing.status === "LOW_STOCK" ? "bg-amber-50 text-amber-700" :
    listing.status === "SOLD_OUT" ? "bg-red-50 text-red-700" :
    "bg-zinc-100 text-zinc-600";

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-50 text-2xl">{listing.photos[0]}</div>
        <div className="flex-1 min-w-[200px]">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-bold">{listing.cropName}</p>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${statusColor}`}>
              {formatListingStatus(listing.status)}
            </span>
          </div>
          <p className="text-xs text-zinc-500">{listing.category} · Mandi ref {formatCurrency(listing.mandiPrice)}</p>
          <div className="mt-3 flex flex-wrap gap-3">
            <label className="text-xs">
              Price (₹)
              <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="ml-1 w-20 rounded border px-2 py-1" />
              <button type="button" disabled={loading} onClick={() => save("price")} className="ml-1 text-emerald-700">Save</button>
            </label>
            <label className="text-xs">
              Qty ({listing.unit})
              <input type="number" value={qty} onChange={(e) => setQty(Number(e.target.value))} className="ml-1 w-20 rounded border px-2 py-1" />
              <button type="button" disabled={loading} onClick={() => save("quantity")} className="ml-1 text-emerald-700">Save</button>
            </label>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Link href={`/farmer/listings/${listing.id}/edit`} className="text-xs font-semibold text-emerald-700">Edit</Link>
          <button type="button" disabled={loading} onClick={togglePause} className="text-xs font-semibold text-zinc-600">
            {listing.status === "PAUSED" ? "Resume" : "Pause"}
          </button>
          <button type="button" disabled={loading} onClick={remove} className="text-xs font-semibold text-red-600">Delete</button>
        </div>
      </div>
    </div>
  );
}
