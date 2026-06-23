import { Suspense } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

import { BrowseFilters } from "@/components/buyer/browse-filters";
import { getLiveListings } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function BuyerBrowsePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const listings = await getLiveListings({
    search: params.q,
    category: params.category,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    organic: params.organic === "1",
    maxDistance: params.distance ? Number(params.distance) : undefined,
  });

  const categories = [...new Set(listings.map((l) => l.category))];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl">Browse produce near you</h1>
        <p className="mt-1 text-sm text-zinc-500">Fresh from local farmers — compare with mandi rates</p>
      </div>

      <Suspense fallback={<div className="h-24 animate-pulse rounded-2xl bg-white" />}>
        <BrowseFilters categories={categories} />
      </Suspense>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {listings.map((listing) => (
          <Link
            key={listing.id}
            href={`/buyer/products/${listing.id}`}
            className="group overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex h-36 items-center justify-center bg-gradient-to-br from-emerald-50 to-amber-50 text-5xl">
              {listing.photos[0] ?? "🌾"}
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="font-bold text-zinc-900 group-hover:text-emerald-700">{listing.cropName}</h2>
                  <p className="text-xs text-zinc-500">{listing.farmerName} · {listing.distance} km</p>
                </div>
                {listing.isOrganic && (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">Organic</span>
                )}
              </div>
              <div className="mt-3 flex items-end justify-between">
                <div>
                  <p className="text-lg font-bold text-emerald-700">{formatCurrency(listing.price)}/{listing.unit}</p>
                  <p className="text-xs text-zinc-400 line-through">Mandi {formatCurrency(listing.mandiPrice)}</p>
                </div>
                <p className="text-xs text-zinc-500">Harvest {formatDate(listing.harvestDate)}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {listings.length === 0 && (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-12 text-center">
          <Search className="mx-auto h-8 w-8 text-zinc-300" />
          <p className="mt-3 font-medium text-zinc-600">No listings match your filters</p>
          <p className="text-sm text-zinc-400">Try adjusting category, distance, or price</p>
        </div>
      )}
    </div>
  );
}
