import Link from "next/link";

import { getSeasonalCrops, getLiveListings } from "@/lib/data";

const mockFarmerCalendar = {
  village: "Olpad",
  orders: [
    { id: "order-2", orderNumber: "ORD-4589", status: "Accepted", buyer: { name: "Mehul Parikh" }, timeSlot: "Morning (8 AM - 11 AM)" },
    { id: "order-3", orderNumber: "ORD-4602", status: "Placed", buyer: { name: "Anita Shah" }, timeSlot: "6:00 PM - 8:00 PM" },
  ],
  nearbyFarmers: [
    { id: "farmer-3", user: { name: "Jayesh Bhatt" }, village: "Kamrej" },
  ],
};

export default async function FarmerCalendarPage() {
  const month = new Date().getMonth() + 1;
  const monthName = new Date().toLocaleString("en-IN", { month: "long" });
  const inSeason = await getSeasonalCrops(month);
  const farmer = mockFarmerCalendar;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Calendar & delivery</h1>
        <p className="text-sm text-zinc-500">Seasonal crops + your delivery schedule</p>
      </div>

      <section>
        <h2 className="text-sm font-bold uppercase tracking-wide text-zinc-400">In season — {monthName}</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {inSeason.map((crop) => (
            <div key={crop.id} className="rounded-2xl border border-zinc-200 bg-white p-4">
              <span className="text-2xl">{crop.photos?.[0] ?? "🌱"}</span>
              <p className="mt-2 font-bold">{crop.cropName}</p>
              <Link href="/farmer/listings/new" className="mt-1 inline-block text-xs font-semibold text-emerald-700">
                List this crop →
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-bold uppercase tracking-wide text-zinc-400">Your delivery schedule</h2>
        <div className="mt-3 space-y-2">
          {farmer.orders.length ? (
            farmer.orders.map((order) => (
              <div key={order.id} className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm">
                <span className="font-bold">{order.id}</span> → {(order as any).buyerName ?? (order as any).buyer?.name}
                {order.timeSlot && <span className="text-zinc-500"> · {order.timeSlot}</span>}
              </div>
            ))
          ) : (
            <p className="text-sm text-zinc-500">No active deliveries scheduled</p>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-bold uppercase tracking-wide text-zinc-400">Grouped delivery — nearby farmers</h2>
        <div className="mt-3 space-y-2">
          {farmer.nearbyFarmers.length ? (
            farmer.nearbyFarmers.map((f) => (
              <div key={f.id} className="rounded-xl border border-amber-100 bg-amber-50/50 px-4 py-3 text-sm">
                <span className="font-bold">{(f as any).name ?? (f as any).user?.name}</span> ({f.village}) — coordinate bulk drops
              </div>
            ))
          ) : (
            <p className="text-sm text-zinc-500">No nearby farmers in {farmer.village} yet</p>
          )}
        </div>
      </section>
    </div>
  );
}
