"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ListingForm } from "@/components/farmer/listing-form";

export default function EditListingPage() {
  const params = useParams(); // Gets the ID from the website URL
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        // Fetch the specific crop from your new Node.js route!
        const res = await fetch(`http://localhost:5000/api/produce/${params.id}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setListing(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    if (params.id) {
      fetchListing();
    }
  }, [params.id]);

  if (loading) {
    return <div className="p-10 text-center text-zinc-500 animate-pulse font-medium">Loading your crop details...</div>;
  }

  if (!listing) {
    return <div className="p-10 text-center text-red-500 font-bold">Crop not found.</div>;
  }

  return (
    // We pass the data we just fetched into the Form we built earlier!
    <ListingForm
      initial={{
        id: listing._id,
        cropName: listing.name, // Mapping DB 'name' to form 'cropName'
        category: listing.category,
        description: listing.description || "",
        price: listing.pricePerUnit,
        mandiPrice: listing.mandiPrice,
        quantity: listing.quantityAvailable,
        harvestDate: listing.harvestDate ? listing.harvestDate.slice(0, 10) : "",
        isOrganic: listing.isOrganic,
        fulfillment: listing.fulfillment,
        photos: listing.photos || [],
      }}
    />
  );
}