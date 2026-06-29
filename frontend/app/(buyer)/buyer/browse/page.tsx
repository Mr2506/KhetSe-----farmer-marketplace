import { Suspense } from "react";
import Link from "next/link";
import { Search, Leaf, MapPin, TrendingDown, ShoppingCart } from "lucide-react";

import { BrowseFilters } from "@/components/buyer/browse-filters";
import { BuyerBanner } from "@/components/buyer/buyer-banner";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function BuyerBrowsePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;

  let allProduce: any[] = [];
  try {
    const res = await fetch("http://localhost:5000/api/produce", { cache: "no-store" });
    if (res.ok) allProduce = await res.json();
  } catch (error) {
    console.error("Failed to fetch produce:", error);
  }

  let listings = allProduce.map((item: any) => {
    let validHarvestDate = new Date().toISOString();
    if (item.harvestDate) {
      const parsedDate = new Date(item.harvestDate);
      if (!isNaN(parsedDate.getTime())) validHarvestDate = item.harvestDate;
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
      harvestDate: validHarvestDate,
      photos: item.photos || [],
      farmerName: item.farmer ? `${item.farmer.firstName} ${item.farmer.lastName}` : "Unknown Farmer",
      distance: Math.floor(Math.random() * 14) + 2,
    };
  });

  if (params.q) listings = listings.filter((l) => l.cropName.toLowerCase().includes(params.q!.toLowerCase()));
  if (params.category) listings = listings.filter((l) => l.category === params.category);
  if (params.maxPrice) listings = listings.filter((l) => l.price <= Number(params.maxPrice));
  if (params.organic === "1") listings = listings.filter((l) => l.isOrganic);

  const categories = [...new Set(listings.map((l) => l.category)) as Set<string>];

  return (
    <div className="space-y-7">

      {/* Page header */}
      <div id="listings">
        <h1 className="text-2xl font-bold text-[#1A1A1A] sm:text-3xl tracking-tight">Browse Produce</h1>
        <p className="mt-1 text-sm text-[#6B7280]">
          {listings.length} listings available · fresh from local farms
        </p>
      </div>

      {/* Hero banner */}
      <BuyerBanner />

      {/* Filters */}
      <Suspense
        fallback={
          <div className="h-14 animate-pulse rounded-xl border border-[#E5E7EB] bg-white" />
        }
      >
        <BrowseFilters categories={categories} />
      </Suspense>

      {/* Product grid */}
      {listings.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {listings.map((listing) => {
            const photo = listing.photos?.[0];
            const isImage = typeof photo === "string" && photo.startsWith("http");
            const savings =
              listing.mandiPrice > 0
                ? Math.round(((listing.mandiPrice - listing.price) / listing.mandiPrice) * 100)
                : 0;
            const farmerInitial = listing.farmerName.charAt(0).toUpperCase();

            return (
              <Link
                key={listing.id}
                href={`/buyer/products/${listing.id}`}
                className="ks-card group flex flex-col overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-sm"
              >
                {/* Image — 180px fixed height */}
                <div className="relative h-[180px] w-full overflow-hidden bg-gradient-to-br from-[#F0FAF0] to-[#FFF8E1]">
                  {isImage ? (
                    <img
                      src={photo}
                      alt={listing.cropName}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-5xl">
                      {photo || "🌾"}
                    </div>
                  )}

                  {/* Overlaid badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {listing.isOrganic && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-[#2E7D32]/20 bg-white/90 backdrop-blur-sm px-2.5 py-0.5 text-[11px] font-bold text-[#2E7D32]">
                        <Leaf className="h-2.5 w-2.5" />
                        Organic
                      </span>
                    )}
                    {savings > 0 && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-[#F9A825]/40 bg-white/90 backdrop-blur-sm px-2.5 py-0.5 text-[11px] font-bold text-[#F9A825]">
                        <TrendingDown className="h-2.5 w-2.5" />
                        {savings}% off mandi
                      </span>
                    )}
                  </div>
                </div>

                {/* Card body */}
                <div className="flex flex-1 flex-col p-4">
                  {/* Category + title */}
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-0.5">
                    {listing.category}
                  </p>
                  <h2 className="font-bold text-[#1A1A1A] text-base leading-tight transition-colors duration-150 group-hover:text-[#2E7D32]">
                    {listing.cropName}
                  </h2>

                  {/* Farmer row */}
                  <div className="mt-2 flex items-center gap-2">
                    <div className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#F0FAF0] text-[10px] font-black text-[#2E7D32] border border-[#2E7D32]/15">
                      {farmerInitial}
                    </div>
                    <p className="text-xs text-[#6B7280] truncate">
                      {listing.farmerName}
                      <span className="mx-1 text-[#D1D5DB]">·</span>
                      <MapPin className="inline h-3 w-3 mr-0.5 -mt-0.5" />
                      {listing.distance} km
                    </p>
                  </div>

                  {/* Spacer */}
                  <div className="flex-1" />

                  {/* Price row */}
                  <div className="mt-3 flex items-end justify-between">
                    <div>
                      <p className="text-lg font-black text-[#2E7D32] leading-none">
                        {formatCurrency(listing.price)}
                        <span className="text-xs font-medium text-[#9CA3AF] ml-1">/{listing.unit}</span>
                      </p>
                      {listing.mandiPrice > 0 && (
                        <p className="mt-0.5 text-[11px] text-[#9CA3AF] line-through">
                          Mandi {formatCurrency(listing.mandiPrice)}
                        </p>
                      )}
                    </div>
                    <p className="text-[11px] text-[#9CA3AF] text-right">
                      {listing.quantity} {listing.unit} left
                    </p>
                  </div>

                  {/* CTA button */}
                  <button
                    type="button"
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#2E7D32] py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#256727] active:scale-[0.97] transition-all duration-150"
                  >
                    <ShoppingCart className="h-3.5 w-3.5" />
                    View & Order
                  </button>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        /* Empty state */
        <div className="flex flex-col items-center justify-center rounded-xl border border-[#E5E7EB] bg-white py-16 text-center shadow-sm">
          <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-[#F0FAF0] text-[#2E7D32]">
            <Search className="h-7 w-7" />
          </div>
          <h3 className="text-base font-bold text-[#1A1A1A]">No produce found</h3>
          <p className="mt-1.5 text-sm text-[#6B7280] max-w-xs">
            Try adjusting your filters — category, price range, or distance.
          </p>
          <Link
            href="/buyer/browse"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#2E7D32] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#256727] transition-colors duration-150 shadow-sm"
          >
            Clear all filters
          </Link>
        </div>
      )}
    </div>
  );
}