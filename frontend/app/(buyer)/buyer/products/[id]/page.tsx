import { notFound } from "next/navigation";

import { AddToCartPanel } from "@/components/buyer/add-to-cart-panel";
import { getListingById } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const listing = await getListingById(id);
  if (!listing) notFound();

  const savings = Math.round(((listing.mandiPrice - listing.price) / listing.mandiPrice) * 100);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {listing.photos.map((photo, i) => (
            <div
              key={i}
              className="flex aspect-square items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-50 to-amber-50 text-6xl"
            >
              {photo}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">{listing.category}</p>
          <h1 className="mt-1 text-3xl font-bold text-zinc-900">{listing.cropName}</h1>
          <p className="mt-2 text-sm text-zinc-600">{listing.description}</p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-4">
          <div className="flex items-end gap-4">
            <div>
              <p className="text-3xl font-bold text-emerald-700">{formatCurrency(listing.price)}</p>
              <p className="text-sm text-zinc-400">per {listing.unit}</p>
            </div>
            <div className="text-sm text-zinc-500">
              <p>Mandi rate: <span className="line-through">{formatCurrency(listing.mandiPrice)}</span></p>
              <p className="text-emerald-600 font-medium">{Math.abs(savings)}% vs mandi</p>
            </div>
          </div>
          <p className="mt-3 text-sm text-zinc-500">Harvest: {formatDate(listing.harvestDate)} · {listing.quantity} {listing.unit} left</p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-4">
          <p className="text-sm font-semibold text-zinc-900">Farmer</p>
          <p className="mt-1 font-bold">{listing.farmerName}</p>
          <p className="text-sm text-zinc-500">{(listing as any).farmer?.village ?? "Local"} · {listing.distance} km away</p>
          <p className="mt-2 text-sm text-amber-600">★ {listing.rating.toFixed(1)} rating</p>
        </div>

        <AddToCartPanel listingId={listing.id} maxQty={listing.quantity} price={listing.price} unit={listing.unit} />
      </div>
    </div>
  );
}
