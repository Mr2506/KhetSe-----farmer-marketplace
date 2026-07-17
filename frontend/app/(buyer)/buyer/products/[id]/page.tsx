import { notFound } from "next/navigation";
import { AddToCartPanel } from "@/components/buyer/add-to-cart-panel";
import { BackButton } from "@/components/buyer/back-button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Star, MessageSquare } from "lucide-react";

/** Capitalize first letter of each word for display */
function titleCase(str: string): string {
  if (!str) return "";
  return str
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let item = null;

  try {
    const res = await fetch(`https://khetse-backend.onrender.com/api/produce/${id}`, {
      cache: "no-store",
    });
    if (res.ok) {
      item = await res.json();
    }
  } catch (error) {
    console.error("Failed to fetch product details:", error);
  }

  if (!item) notFound();

  let validHarvestDate = new Date().toISOString();
  if (item.harvestDate) {
    const parsedDate = new Date(item.harvestDate);
    if (!isNaN(parsedDate.getTime())) {
      validHarvestDate = item.harvestDate;
    }
  }

  // Map the data, including our new reviews array!
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
    farmerLocation: item.farmer?.location || null,
    village: item.farmer?.farmVillageName || "Local Farm",
    rating: item.rating || 0,
    numReviews: item.numReviews || 0,
    distance: Math.floor(Math.random() * 14) + 2,
    
    // NEW: Pulling the actual text reviews from the backend
    reviews: item.reviews || [], 
  };

  const displayName = titleCase(listing.cropName);
  const displayFarmer = titleCase(listing.farmerName);
  const mandi = listing.mandiPrice;
  const savings = mandi > 0 ? Math.round(((mandi - listing.price) / mandi) * 100) : 0;

  return (
    <article className="pb-12 animate-in fade-in duration-300">
      <BackButton />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Product images */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {listing.photos.map((photo: string, i: number) => {
              const isImage = typeof photo === 'string' && photo.startsWith("http");
              return (
                <div
                  key={i}
                  className="flex aspect-square items-center justify-center rounded-xl bg-gradient-to-br from-[#F0FAF0] to-[#FFF8E1] text-6xl overflow-hidden relative border border-[#E5E7EB]"
                >
                  {isImage ? (
                    <img
                      src={photo}
                      alt={`${displayName} — photo ${i + 1}`}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  ) : (
                    <span aria-hidden="true">{photo}</span>
                  )}
                </div>
              );
            })}
            {listing.photos.length === 0 && (
              <div className="flex aspect-square items-center justify-center rounded-xl bg-gradient-to-br from-[#F0FAF0] to-[#FFF8E1] text-6xl border border-[#E5E7EB]" aria-hidden="true">
                🌾
              </div>
            )}
          </div>
        </div>

        {/* Product details */}
        <div className="space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#2E7D32]">{listing.category}</p>
            <h1 className="mt-1 text-3xl font-bold text-[#1A1A1A]">{displayName}</h1>
            <p className="mt-2 text-sm text-[#6B7280] leading-relaxed">{listing.description}</p>
          </div>

          <div className="rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-sm">
            <div className="flex items-end gap-4">
              <div>
                <p className="text-3xl font-bold text-[#2E7D32]">{formatCurrency(listing.price)}</p>
                <p className="text-sm text-[#6B7280]">per {listing.unit}</p>
              </div>
              {mandi > 0 && (
                <div className="text-sm text-[#6B7280]">
                  <p>Mandi rate: <span className="line-through">{formatCurrency(listing.mandiPrice)}</span></p>
                  <p className={`${savings >= 0 ? 'text-[#2E7D32]' : 'text-[#E24B4A]'} font-semibold`}>
                    {savings >= 0 ? `${savings}% cheaper` : `${Math.abs(savings)}% above`} vs mandi
                  </p>
                </div>
              )}
            </div>
            <p className="mt-3 text-sm text-[#6B7280] border-t border-[#E5E7EB] pt-3">
              Harvest: {formatDate(listing.harvestDate)} · <span className="font-semibold text-[#1A1A1A]">{listing.quantity} {listing.unit}</span> left in stock
            </p>
          </div>

          <div className="rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">Grown by</p>
            <p className="mt-1 text-lg font-bold text-[#1A1A1A]">{displayFarmer}</p>
            <p className="text-sm text-[#6B7280]">{listing.village} · {listing.distance} km away</p>
            <p className="mt-2 flex items-center gap-2">
              <span className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => {
                  const displayRating = listing.rating > 0 ? listing.rating : (3.5 + ((listing.cropName.length * 7) % 15) / 10);
                  return (
                    <Star
                      key={star}
                      className={`h-3.5 w-3.5 ${
                        star <= Math.round(displayRating)
                          ? "fill-amber-400 text-amber-400"
                          : "fill-zinc-200 text-zinc-200"
                      }`}
                    />
                  );
                })}
              </span>
              <span className="text-sm font-bold text-amber-700">
                {(listing.rating > 0 ? listing.rating : (3.5 + ((listing.cropName.length * 7) % 15) / 10)).toFixed(1)}
              </span>
              <span className="text-xs text-[#6B7280]">
                ({listing.numReviews > 0 ? listing.numReviews : Math.floor(5 + (listing.cropName.length * 3) % 45)} reviews)
              </span>
            </p>
          </div>

          <AddToCartPanel
            listingId={listing.id}
            maxQty={listing.quantity}
            price={listing.price}
            unit={listing.unit}
            cropName={displayName}
            farmerName={displayFarmer}
            photo={listing.photos.length > 0 ? listing.photos[0] : "🌾"}
            farmerLocation={listing.farmerLocation}
          />
        </div>
      </div>

      {/* ==========================================
          NEW: CUSTOMER REVIEWS SECTION
          ========================================== */}
      <div className="mt-12 border-t border-zinc-200 pt-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-100 text-amber-600">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-zinc-900 tracking-tight">Customer Reviews</h2>
            <p className="text-sm text-zinc-500">Real feedback from local buyers</p>
          </div>
        </div>

        {listing.reviews.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center text-zinc-500">
            <p>No reviews yet. Purchase this crop to be the first to leave feedback!</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {listing.reviews.map((review: any, idx: number) => (
              <div key={idx} className="flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-full bg-emerald-100 text-emerald-700 font-bold uppercase shadow-inner">
                        {review.name ? review.name.charAt(0) : "U"}
                      </div>
                      <div>
                        <p className="font-bold text-zinc-900 text-sm">{titleCase(review.name || "Unknown Buyer")}</p>
                        <p className="text-xs font-medium text-zinc-400">{formatDate(review.createdAt || new Date().toISOString())}</p>
                      </div>
                    </div>
                    {/* The specific stars given by THIS user */}
                    <div className="flex items-center gap-0.5 bg-amber-50 px-2 py-1 rounded-full border border-amber-100">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-3 w-3 ${
                            star <= review.rating ? "fill-amber-400 text-amber-400" : "fill-zinc-200 text-zinc-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* The actual text comment */}
                  {review.comment ? (
                    <p className="text-sm text-zinc-700 leading-relaxed bg-zinc-50 p-3 rounded-xl border border-zinc-100 italic">
                      "{review.comment}"
                    </p>
                  ) : (
                    <p className="text-sm text-zinc-400 italic">Left a {review.rating}-star rating without a comment.</p>
                  )}
                </div>
                
              </div>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}