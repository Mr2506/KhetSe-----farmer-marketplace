"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

export function ListingForm({
  initial,
}: {
  initial?: {
    id: string;
    cropName: string;
    category: string;
    description: string;
    price: number;
    mandiPrice: number;
    quantity: number;
    harvestDate: string;
    isOrganic: boolean;
    fulfillment: "Pickup" | "Delivery" | "Both";
    photos: string[];
  };
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false); // Track image upload status

  const [form, setForm] = useState<{
    cropName: string;
    category: string;
    description: string;
    price: number;
    mandiPrice: number;
    quantity: number;
    harvestDate: string;
    isOrganic: boolean;
    fulfillment: "Pickup" | "Delivery" | "Both";
    photos: string[];
  }>(
    initial ?? {
      cropName: "",
      category: "Vegetables",
      description: "",
      price: 30,
      mandiPrice: 25,
      quantity: 100,
      harvestDate: new Date().toISOString().slice(0, 10),
      isOrganic: false,
      fulfillment: "Both",
      photos: [], // Start with an empty array for real photos
    },
  );

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadingImages(true);
    const newPhotoUrls: string[] = [];

    try {
      // Loop through each selected file and upload to backend one by one
      for (const file of files) {
        const formData = new FormData();
        formData.append("image", file); // 'image' MUST match upload.single('image') in backend

        // Send to your Node.js upload route
        const res = await fetch("http://localhost:5000/api/upload", {
          method: "POST",
          body: formData, // Notice: No Content-Type header! Browser sets it automatically for FormData
        });

        const data = await res.json();
        
        if (res.ok) {
          // Cloudinary successfully returned the URL!
          newPhotoUrls.push(data.imageUrl);
        } else {
          toast.error(data.message || "Failed to upload an image");
        }
      }

      // Add the new Cloudinary URLs to our form state
      setForm(prev => ({ ...prev, photos: [...prev.photos, ...newPhotoUrls] }));
      toast.success("Images uploaded successfully!");
    } catch (error) {
      toast.error("Error uploading images");
      console.error(error);
    } finally {
      setUploadingImages(false);
    }
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (form.photos.length === 0) {
        throw new Error("Please upload at least one photo.");
      }

      const token = localStorage.getItem("khetse_token");
      if (!token) throw new Error("You must be logged in to post a listing.");

      const url = initial 
        ? `http://localhost:5000/api/produce/${initial.id}` 
        : `http://localhost:5000/api/produce`;
      
      const method = initial ? "PUT" : "POST";

      // THE FIX: We match the frontend state exactly to the backend MongoDB Schema
      const payload = {
        name: form.cropName,
        category: form.category,
        description: form.description,
        pricePerUnit: form.price,
        mandiPrice: form.mandiPrice,
        quantityAvailable: form.quantity,
        harvestDate: form.harvestDate,
        isOrganic: form.isOrganic,
        fulfillment: form.fulfillment,
        photos: form.photos
      };

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(payload) // We send the mapped payload here!
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to save listing");

      toast.success(initial ? "Listing updated successfully!" : "Listing created successfully!");
      router.push("/farmer/listings");
      router.refresh();
    } catch (err: any) {
      toast.error(err instanceof Error ? err.message : "Failed to save to database");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-lg space-y-4 rounded-2xl border border-zinc-200 bg-white p-5">
      <h1 className="text-xl font-bold">{initial ? "Edit listing" : "New listing"}</h1>

      {[
        ["cropName", "Crop name"],
        ["category", "Category"],
        ["description", "Description"],
      ].map(([key, label]) => (
        <label key={key} className="block space-y-1">
          <span className="text-sm font-medium">{label}</span>
          {key === "description" ? (
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full rounded-xl border px-3 py-2 text-sm" />
          ) : (
            <input
              value={form[key as "cropName" | "category"]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className="w-full rounded-xl border px-3 py-2 text-sm"
              required
            />
          )}
        </label>
      ))}

      <div className="grid grid-cols-2 gap-3">
        <label className="block space-y-1">
          <span className="text-sm font-medium">Your price (₹)</span>
          <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className="w-full rounded-xl border px-3 py-2 text-sm" />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium">Mandi reference (₹)</span>
          <input type="number" value={form.mandiPrice} onChange={(e) => setForm({ ...form, mandiPrice: Number(e.target.value) })} className="w-full rounded-xl border px-3 py-2 text-sm" />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="block space-y-1">
          <span className="text-sm font-medium">Quantity (kg)</span>
          <input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} className="w-full rounded-xl border px-3 py-2 text-sm" />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium">Harvest date</span>
          <input type="date" value={form.harvestDate} onChange={(e) => setForm({ ...form, harvestDate: e.target.value })} className="w-full rounded-xl border px-3 py-2 text-sm" />
        </label>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={form.isOrganic} onChange={(e) => setForm({ ...form, isOrganic: e.target.checked })} />
        Organic produce
      </label>

      <label className="block space-y-1">
        <span className="text-sm font-medium">Fulfillment</span>
        <select value={form.fulfillment} onChange={(e) => setForm({ ...form, fulfillment: e.target.value as "Pickup" | "Delivery" | "Both" })} className="w-full rounded-xl border px-3 py-2 text-sm">
          <option value="Both">Pickup & Delivery</option>
          <option value="Pickup">Pickup only</option>
          <option value="Delivery">Delivery only</option>
        </select>
      </label>

      {}
      <fieldset className="space-y-2 p-3 border border-dashed border-zinc-300 rounded-xl">
        <legend className="text-sm font-medium px-1">Photos (Real Images)</legend>
        
        <input 
          type="file" 
          accept="image/jpeg, image/png, image/jpg, image/webp"
          multiple
          onChange={handleImageUpload}
          disabled={uploadingImages}
          className="w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 disabled:opacity-50 cursor-pointer"
        />
        
        {uploadingImages && (
          <p className="text-sm text-emerald-600 font-medium animate-pulse">
            Uploading images to Cloudinary...
          </p>
        )}
        
        {/* Render small preview boxes for uploaded images */}
        {form.photos.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {form.photos.map((photoUrl, i) => (
              <div key={i} className="relative h-16 w-16 rounded-xl overflow-hidden border border-zinc-200 shadow-sm">
                <img src={photoUrl} alt="Preview" className="object-cover w-full h-full" />
                <button 
                  type="button"
                  onClick={() => setForm({...form, photos: form.photos.filter((_, index) => index !== i)})}
                  className="absolute top-1 right-1 h-5 w-5 flex items-center justify-center rounded-full bg-red-500/90 text-white text-[10px] font-bold hover:bg-red-600 transition"
                  title="Remove image"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </fieldset>

      <button type="submit" disabled={loading || uploadingImages} className="h-12 w-full rounded-xl bg-emerald-600 text-sm font-semibold text-white disabled:opacity-50">
        {loading ? "Saving…" : initial ? "Update listing" : "Publish listing"}
      </button>
    </form>
  );
}