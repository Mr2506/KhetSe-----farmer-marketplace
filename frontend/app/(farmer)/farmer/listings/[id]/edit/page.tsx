import { notFound } from "next/navigation";

import { ListingForm } from "@/components/farmer/listing-form";
import { getListingById } from "@/lib/data";

export default async function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const listing = await getListingById(id);
  if (!listing) notFound();

  return (
    <ListingForm
      initial={{
        id: listing.id,
        cropName: listing.cropName,
        category: listing.category,
        description: listing.description,
        price: listing.price,
        mandiPrice: listing.mandiPrice,
        quantity: listing.quantity,
        harvestDate: listing.harvestDate.slice(0, 10),
        isOrganic: listing.isOrganic,
        fulfillment: listing.fulfillment,
        photos: listing.photos,
      }}
    />
  );
}
