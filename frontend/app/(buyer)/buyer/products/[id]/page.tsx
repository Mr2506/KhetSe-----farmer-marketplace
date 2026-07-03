import { notFound } from "next/navigation";
import { AddToCartPanel } from "@/components/buyer/add-to-cart-panel";
import { BackButton } from "@/components/buyer/back-button";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let item = null;

  try {
    const res = await fetch(`http://localhost:5000/api/produce/${id}`, {
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
    rating: 4.8,
    distance: Math.floor(Math.random() * 14) + 2, 
  };

  const mandi = listing.mandiPrice;
  const savings = mandi > 0 ? Math.round(((mandi - listing.price) / mandi) * 100) : 0;

  return (
    <div>
      {/* THE NEW BACK BUTTON */}
      <BackButton />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {listing.photos.map((photo: string, i: number) => {
              const isImage = typeof photo === 'string' && photo.startsWith("http");

              return (
                <div
                  key={i}
                  className="flex aspect-square items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-50 to-amber-50 text-6xl overflow-hidden relative border border-zinc-100"
                >
                  {isImage ? (
                    <img
                      src={photo}
                      alt={listing.cropName}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  ) : (
                    photo
                  )}
                </div>
              );
            })}
            
            {listing.photos.length === 0 && (
              <div className="flex aspect-square items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-50 to-amber-50 text-6xl">
                🌾
              </div>
            )}
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">{listing.category}</p>
            <h1 className="mt-1 text-3xl font-bold text-zinc-900">{listing.cropName}</h1>
            <p className="mt-2 text-sm text-zinc-600 leading-relaxed">{listing.description}</p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
            <div className="flex items-end gap-4">
              <div>
                <p className="text-3xl font-bold text-emerald-700">{formatCurrency(listing.price)}</p>
                <p className="text-sm text-zinc-400">per {listing.unit}</p>
              </div>
              {mandi > 0 && (
                <div className="text-sm text-zinc-500">
                  <p>Mandi rate: <span className="line-through">{formatCurrency(listing.mandiPrice)}</span></p>
                  <p className={`${savings >= 0 ? 'text-emerald-600' : 'text-red-500'} font-semibold`}>
                    {savings >= 0 ? `${savings}% cheaper` : `${Math.abs(savings)}% above`} vs mandi
                  </p>
                </div>
              )}
            </div>
            <p className="mt-3 text-sm text-zinc-500 border-t border-zinc-100 pt-3">
              Harvest: {formatDate(listing.harvestDate)} · <span className="font-semibold text-zinc-700">{listing.quantity} {listing.unit}</span> left in stock
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Grown by</p>
            <p className="mt-1 text-lg font-bold text-zinc-900">{listing.farmerName}</p>
            <p className="text-sm text-zinc-500">{listing.village} · {listing.distance} km away</p>
            <p className="mt-2 text-xs font-semibold text-amber-600 bg-amber-50 rounded-lg px-2.5 py-1 w-max">
              ★ {listing.rating.toFixed(1)} Community Rating
            </p>
          </div>

          <AddToCartPanel 
            listingId={listing.id} 
            maxQty={listing.quantity} 
            price={listing.price} 
            unit={listing.unit} 
            cropName={listing.cropName}
            farmerName={listing.farmerName}
            photo={listing.photos.length > 0 ? listing.photos[0] : "🌾"}
          />
        </div>
      </div>
    </div>
  );
}