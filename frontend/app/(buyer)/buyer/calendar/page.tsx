import Link from "next/link";

import { getLiveListings, getSeasonalCrops } from "@/lib/data";

export default async function BuyerCalendarPage() {
  const month = new Date().getMonth() + 1;
  const monthName = new Date().toLocaleString("en-IN", { month: "long" });
  const inSeason = await getSeasonalCrops(month);
  const listings = await getLiveListings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Seasonal calendar</h1>
        <p className="text-sm text-zinc-500">What&apos;s in season in {monthName} — Gujarat</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {inSeason.map((crop) => {
          const live = listings.filter((l) => l.cropName.toLowerCase().includes(crop.cropName.toLowerCase()));
          return (
            <div key={crop.id} className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{crop.photos?.[0] ?? "🌱"}</span>
                <div>
                  <p className="font-bold">{crop.cropName}</p>
                  <p className="text-xs text-zinc-500">{crop.category}</p>
                </div>
              </div>
              {live.length > 0 ? (
                <Link href={`/buyer/browse?q=${encodeURIComponent(crop.cropName)}`} className="mt-3 inline-block text-sm font-semibold text-emerald-700">
                  {live.length} live listing{live.length > 1 ? "s" : ""} →
                </Link>
              ) : (
                <p className="mt-3 text-xs text-zinc-400">No live listings right now</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
