"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import {
  Sprout, Tag, FileText, DollarSign, Weight, Calendar, Leaf, Truck, ImagePlus, X, ArrowRight, Upload,
} from "lucide-react";

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
  const [uploadingImages, setUploadingImages] = useState(false);

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
      photos: [],
    },
  );

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadingImages(true);
    const newPhotoUrls: string[] = [];

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("image", file);
        const res = await fetch("http://localhost:5000/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (res.ok) newPhotoUrls.push(data.imageUrl);
        else toast.error(data.message || "Failed to upload an image");
      }
      setForm((prev) => ({ ...prev, photos: [...prev.photos, ...newPhotoUrls] }));
      toast.success("Images uploaded successfully");
    } catch {
      toast.error("Error uploading images");
    } finally {
      setUploadingImages(false);
    }
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (form.photos.length === 0) throw new Error("Please upload at least one photo.");
      const token = localStorage.getItem("khetse_token");
      if (!token) throw new Error("You must be logged in to post a listing.");

      const url = initial ? `http://localhost:5000/api/produce/${initial.id}` : `http://localhost:5000/api/produce`;
      const method = initial ? "PUT" : "POST";

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
        photos: form.photos,
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to save listing");

      toast.success(initial ? "Listing updated!" : "Listing published!");
      router.push("/farmer/listings");
      router.refresh();
    } catch (err: any) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  }

  const CATEGORY_OPTIONS = ["Vegetables", "Fruits", "Grains", "Dairy", "Spices", "Other"];
  const FULFILLMENT_OPTIONS = [
    { value: "Both",     label: "Pickup & Delivery" },
    { value: "Pickup",   label: "Pickup only" },
    { value: "Delivery", label: "Delivery only" },
  ];

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
          {initial ? "Edit Listing" : "New Listing"}
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          {initial ? "Update your crop details below." : "Fill in the details to publish your crop on KhetSe."}
        </p>
      </div>

      <form onSubmit={submit} className="space-y-6">

        {/* Basic Info */}
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
              <Sprout className="h-4 w-4" />
            </div>
            <h2 className="text-sm font-bold text-zinc-800">Crop Details</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                Crop Name <span className="text-red-400">*</span>
              </label>
              <input
                value={form.cropName}
                onChange={(e) => setForm({ ...form, cropName: e.target.value })}
                placeholder="e.g. Fresh Tomatoes"
                required
                className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 focus:outline-none transition-all bg-zinc-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Category</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORY_OPTIONS.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setForm({ ...form, category: cat })}
                    className={`rounded-full border px-3.5 py-1.5 text-xs font-bold transition-all ${
                      form.category === cat
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-800"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                <span className="flex items-center gap-1.5"><FileText className="h-3 w-3" /> Description</span>
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                placeholder="Describe your produce — variety, growing method, freshness..."
                className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 focus:outline-none transition-all bg-zinc-50/50 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-blue-50 text-blue-600">
              <DollarSign className="h-4 w-4" />
            </div>
            <h2 className="text-sm font-bold text-zinc-800">Pricing & Stock</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Your Price (₹/kg)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-zinc-400">₹</span>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                  className="w-full rounded-xl border border-zinc-200 pl-8 pr-4 py-3 text-sm font-bold text-zinc-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 focus:outline-none transition-all bg-zinc-50/50"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Mandi Reference (₹)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-zinc-400">₹</span>
                <input
                  type="number"
                  value={form.mandiPrice}
                  onChange={(e) => setForm({ ...form, mandiPrice: Number(e.target.value) })}
                  className="w-full rounded-xl border border-zinc-200 pl-8 pr-4 py-3 text-sm text-zinc-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 focus:outline-none transition-all bg-zinc-50/50"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                <span className="flex items-center gap-1.5"><Weight className="h-3 w-3" /> Quantity (kg)</span>
              </label>
              <input
                type="number"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
                className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm font-bold text-zinc-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 focus:outline-none transition-all bg-zinc-50/50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> Harvest Date</span>
              </label>
              <input
                type="date"
                value={form.harvestDate}
                onChange={(e) => setForm({ ...form, harvestDate: e.target.value })}
                className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 focus:outline-none transition-all bg-zinc-50/50"
              />
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-teal-50 text-teal-600">
              <Truck className="h-4 w-4" />
            </div>
            <h2 className="text-sm font-bold text-zinc-800">Fulfillment & Options</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Fulfillment Method</label>
              <div className="grid grid-cols-3 gap-2">
                {FULFILLMENT_OPTIONS.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setForm({ ...form, fulfillment: value as typeof form.fulfillment })}
                    className={`rounded-xl border-2 px-3 py-2.5 text-xs font-bold transition-all ${
                      form.fulfillment === value
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-zinc-200 text-zinc-600 hover:border-zinc-300"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <label className={`flex items-center justify-between gap-4 rounded-xl border px-4 py-3.5 cursor-pointer select-none transition-all ${
              form.isOrganic ? "border-emerald-200 bg-emerald-50/40" : "border-zinc-200 hover:border-zinc-300"
            }`}>
              <div className="flex items-center gap-2.5">
                <Leaf className={`h-4 w-4 shrink-0 ${form.isOrganic ? "text-emerald-600" : "text-zinc-400"}`} />
                <div>
                  <p className="text-sm font-medium text-zinc-800">Organic Produce</p>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Grown without synthetic pesticides</p>
                </div>
              </div>
              <div className={`relative h-5 w-9 rounded-full transition-colors duration-200 shrink-0 ${form.isOrganic ? "bg-emerald-500" : "bg-zinc-300"}`}>
                <div className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${form.isOrganic ? "translate-x-4" : "translate-x-0"}`} />
              </div>
              <input
                type="checkbox"
                checked={form.isOrganic}
                onChange={(e) => setForm({ ...form, isOrganic: e.target.checked })}
                className="sr-only"
              />
            </label>
          </div>
        </div>

        {/* Photos */}
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-amber-50 text-amber-600">
              <ImagePlus className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-zinc-800">Product Photos</h2>
              <p className="text-[11px] text-zinc-400 mt-0.5">At least 1 photo required</p>
            </div>
          </div>

          <label className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-8 cursor-pointer transition-all ${
            uploadingImages ? "border-emerald-400 bg-emerald-50/40" : "border-zinc-300 hover:border-emerald-400 hover:bg-emerald-50/20"
          }`}>
            <div className="grid h-12 w-12 place-items-center rounded-full bg-zinc-100 text-zinc-500">
              <Upload className="h-5 w-5" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-zinc-700">
                {uploadingImages ? "Uploading to Cloudinary..." : "Click to upload photos"}
              </p>
              <p className="text-xs text-zinc-400 mt-0.5">JPEG, PNG, WebP — multiple allowed</p>
            </div>
            <input
              type="file"
              accept="image/jpeg, image/png, image/jpg, image/webp"
              multiple
              onChange={handleImageUpload}
              disabled={uploadingImages}
              className="sr-only"
            />
          </label>

          {form.photos.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-3">
              {form.photos.map((photoUrl, i) => (
                <div key={i} className="relative h-20 w-20 overflow-hidden rounded-xl border border-zinc-200 shadow-sm group">
                  <img src={photoUrl} alt="Preview" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, photos: form.photos.filter((_, idx) => idx !== i) })}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-5 w-5 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || uploadingImages}
          className="group w-full flex items-center justify-center gap-2.5 h-13 py-3.5 rounded-xl bg-emerald-600 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 hover:bg-emerald-500 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? "Saving..." : initial ? "Update Listing" : "Publish Listing"}
          {!loading && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />}
        </button>
      </form>
    </div>
  );
}