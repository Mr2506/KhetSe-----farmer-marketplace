import { FarmerListingRow } from "@/components/farmer/listing-row";
import { getFarmerListings } from "@/lib/data";
import Link from "next/link";

export default async function FarmerListingsPage() {
  const listings = await getFarmerListings();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">My listings</h1>
          <p className="text-sm text-zinc-500">{listings.length} products · live stock & pricing</p>
        </div>
        <Link href="/farmer/listings/new" className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500">
          + New listing
        </Link>
      </div>

      <div className="space-y-3">
        {listings.map((listing) => (
          <FarmerListingRow key={listing.id} listing={listing} />
        ))}
      </div>

      {listings.length === 0 && (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-10 text-center">
          <p className="text-zinc-600">No listings yet</p>
          <Link href="/farmer/listings/new" className="mt-2 inline-block text-sm font-semibold text-emerald-700">
            Create your first listing
          </Link>
        </div>
      )}
    </div>
  );
}
