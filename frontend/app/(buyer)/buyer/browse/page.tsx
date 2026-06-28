import { Suspense } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

import { BrowseFilters } from "@/components/buyer/browse-filters";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function BuyerBrowsePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  
  // Fetch real data from your MongoDB database!
  let allProduce = [];
  try {
    const res = await fetch("http://localhost:5000/api/produce", { 
      cache: "no-store" // Always fetch fresh data, never use stale cache
    });
    if (res.ok) {
      allProduce = await res.json();
    }
  } catch (error) {
    console.error("Failed to fetch produce:", error);
  }

  let listings = allProduce.map((item: any) => {
    // Safety check: ensure harvestDate is a valid parsable string/date
    let validHarvestDate = new Date().toISOString(); // Default fallback to today
    if (item.harvestDate) {
      const parsedDate = new Date(item.harvestDate);
      if (!isNaN(parsedDate.getTime())) {
        validHarvestDate = item.harvestDate;
      }
    }

    return {
      id: item._id,
      cropName: item.name,
      category: item.category,
      price: item.pricePerUnit,
      mandiPrice: item.mandiPrice || 0,
      quantity: item.quantityAvailable,
      unit: item.unit || "kg",
      isOrganic: item.isOrganic,
      harvestDate: validHarvestDate, // Guaranteed to be a valid date string
      photos: item.photos || [],
      // Safely grab the farmer's name if the populated object exists
      farmerName: item.farmer ? `${item.farmer.firstName} ${item.farmer.lastName}` : "Unknown Farmer",
      // Hardcoding a fake distance for the MVP UI (between 2km and 15km)
      distance: Math.floor(Math.random() * 14) + 2 
    };
  });

  if (params.q) {
    listings = listings.filter((l) => l.cropName.toLowerCase().includes(params.q!.toLowerCase()));
  }
  if (params.category) {
    listings = listings.filter((l) => l.category === params.category);
  }
  if (params.maxPrice) {
    listings = listings.filter((l) => l.price <= Number(params.maxPrice));
  }
  if (params.organic === "1") {
    listings = listings.filter((l) => l.isOrganic);
  }

  // Extract unique categories so the filter buttons update dynamically based on real data
  const categories = [...new Set(listings.map((l) => l.category)) as Set<string>];

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
        {listings.map((listing) => {
          // Check if the photo is a Cloudinary URL or an Emoji
          const photo = listing.photos && listing.photos.length > 0 ? listing.photos[0] : "🌾";
          const isImage = photo.startsWith("http");

          return (
            <Link
              key={listing.id}
              href={`/buyer/products/${listing.id}`}
              className="group overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex h-40 w-full items-center justify-center bg-gradient-to-br from-emerald-50 to-amber-50 text-5xl overflow-hidden relative">
                {isImage ? (
                  <img src={photo} alt={listing.cropName} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  photo
                )}
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
          );
        })}
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