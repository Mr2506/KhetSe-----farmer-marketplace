"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

import { upsertListingAction } from "@/lib/actions";

const EMOJI_OPTIONS = ["🍅", "🥬", "🥕", "🫑", "🌾", "🌶️", "🥔", "🥒"];

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
      photos: ["🍅", "🥬"],
    },
  );

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await upsertListingAction({
        id: initial?.id,
        ...form,
        fulfillment: form.fulfillment,
      });
      toast.success(initial ? "Listing updated" : "Listing created");
      router.push("/farmer/listings");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
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

      <fieldset>
        <legend className="text-sm font-medium">Photos (min 2 — pick emoji placeholders)</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {EMOJI_OPTIONS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => {
                const has = form.photos.includes(emoji);
                setForm({
                  ...form,
                  photos: has ? form.photos.filter((p) => p !== emoji) : [...form.photos, emoji].slice(0, 4),
                });
              }}
              className={`h-12 w-12 rounded-xl text-xl ${form.photos.includes(emoji) ? "ring-2 ring-emerald-500 bg-emerald-50" : "bg-zinc-100"}`}
            >
              {emoji}
            </button>
          ))}
        </div>
        <p className="mt-1 text-xs text-zinc-500">Selected: {form.photos.join(" ") || "none"}</p>
      </fieldset>

      <button type="submit" disabled={loading} className="h-12 w-full rounded-xl bg-emerald-600 text-sm font-semibold text-white">
        {loading ? "Saving…" : initial ? "Update listing" : "Publish listing"}
      </button>
    </form>
  );
}
