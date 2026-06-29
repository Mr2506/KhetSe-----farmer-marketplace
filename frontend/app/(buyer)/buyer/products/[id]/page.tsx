import { notFound } from "next/navigation";
import { AddToCartPanel } from "@/components/buyer/add-to-cart-panel";
import { BackButton } from "@/components/buyer/back-button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { MapPin, Calendar, Package, Star, Leaf, TrendingDown } from "lucide-react";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let item = null;

  try {
    const res = await fetch(`http://localhost:5000/api/produce/${id}`, { cache: "no-store" });
    if (res.ok) item = await res.json();
  } catch (error) {
    console.error("Failed to fetch product details:", error);
  }

  if (!item) notFound();

  let validHarvestDate = new Date().toISOString();
  if (item.harvestDate) {
    const parsedDate = new Date(item.harvestDate);
    if (!isNaN(parsedDate.getTime())) validHarvestDate = item.harvestDate;
  }

  const listing = {
    id: item._id,
    cropName: item.name,
    category: item.category,
    price: item.pricePerUnit,
    mandiPrice: item.mandiPrice || 0,
    quantity: item.quantityAvailable,
    unit: item.unit || "kg",
    harvestDate: validHarvestDate,
    photos: item.photos || [],
    description: item.description || "No description provided by the farmer.",
    farmerName: item.farmer ? `${item.farmer.firstName} ${item.farmer.lastName}` : "Unknown Farmer",
    village: item.farmer?.farmVillageName || "Local Farm",
    isOrganic: item.isOrganic,
    rating: 4.8,
    distance: Math.floor(Math.random() * 14) + 2,
  };

  const mandi = listing.mandiPrice;
  const savings = mandi > 0 ? Math.round(((mandi - listing.price) / mandi) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <BackButton />

      <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
        
        {/* Photo gallery */}
        <div>
          {listing.photos.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {listing.photos.map((photo: string, i: number) => {
                const isImage = typeof photo === "string" && photo.startsWith("http");
                const isFirst = i === 0;
                return (
                  <div
                    key={i}
                    className={`overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 to-amber-50 border border-zinc-100 shadow-sm group ${
                      isFirst && listing.photos.length > 1 ? "col-span-2 aspect-[16/9]" : "aspect-square"
                    }`}
                  >
                    {isImage ? (
                      <img
                        src={photo}
                        alt={listing.cropName}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-6xl">{photo}</div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex aspect-video items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-50 to-amber-50 border border-zinc-100 text-6xl">
              🌾
            </div>
          )}
        </div>

        {/* Product info + CTA */}
        <div className="space-y-5">
          
          {/* Title */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
                {listing.category}
              </span>
              {listing.isOrganic && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200/60">
                  <Leaf className="h-3 w-3" />
                  Organic
                </span>
              )}
            </div>
            <h1 className="text-2xl font-black text-zinc-900 leading-tight">{listing.cropName}</h1>
            <p className="mt-2 text-sm text-zinc-500 leading-relaxed">{listing.description}</p>
          </div>

          {/* Pricing card */}
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-end justify-between gap-3 mb-3">
              <div>
                <p className="text-3xl font-black text-emerald-700 leading-none">{formatCurrency(listing.price)}</p>
                <p className="text-xs text-zinc-400 mt-1">per {listing.unit}</p>
              </div>
              {mandi > 0 && (
                <div className="text-right">
                  <p className="text-xs text-zinc-400 line-through">{formatCurrency(listing.mandiPrice)}/kg mandi rate</p>
                  {savings > 0 && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60 mt-1">
                      <TrendingDown className="h-3 w-3" />
                      {savings}% below mandi
                    </span>
                  )}
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-3 border-t border-zinc-100 pt-3 text-xs text-zinc-500">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                Harvested {formatDate(listing.harvestDate)}
              </span>
              <span className="flex items-center gap-1.5">
                <Package className="h-3.5 w-3.5 text-zinc-400" />
                <span className="font-semibold text-zinc-700">{listing.quantity} {listing.unit}</span> in stock
              </span>
            </div>
          </div>

          {/* Farmer card */}
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-3">Grown By</p>
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-800 font-black text-base">
                {listing.farmerName.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-zinc-900">{listing.farmerName}</p>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className="flex items-center gap-1 text-xs text-zinc-500">
                    <MapPin className="h-3 w-3 text-emerald-500" />
                    {listing.village} · {listing.distance} km
                  </span>
                  <span className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    {listing.rating.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Add to cart */}
          <AddToCartPanel
            listingId={listing.id}
            maxQty={listing.quantity}
            price={listing.price}
            unit={listing.unit}
          />
        </div>
      </div>
    </div>
  );
}