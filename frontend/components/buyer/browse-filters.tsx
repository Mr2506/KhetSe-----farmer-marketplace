"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";

export function BrowseFilters({ categories }: { categories: string[] }) {
  const router = useRouter();
  const params = useSearchParams();

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.push(`/buyer/browse?${next.toString()}`);
  }

  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-700">
        <SlidersHorizontal className="h-4 w-4" />
        Filters
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <input
          type="search"
          placeholder="Search crops..."
          defaultValue={params.get("q") ?? ""}
          onChange={(e) => update("q", e.target.value)}
          className="rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
        />
        <select
          defaultValue={params.get("category") ?? ""}
          onChange={(e) => update("category", e.target.value)}
          className="rounded-xl border border-zinc-200 px-3 py-2 text-sm"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          defaultValue={params.get("distance") ?? ""}
          onChange={(e) => update("distance", e.target.value)}
          className="rounded-xl border border-zinc-200 px-3 py-2 text-sm"
        >
          <option value="">Any distance</option>
          <option value="5">Within 5 km</option>
          <option value="10">Within 10 km</option>
          <option value="20">Within 20 km</option>
        </select>
        <select
          defaultValue={params.get("maxPrice") ?? ""}
          onChange={(e) => update("maxPrice", e.target.value)}
          className="rounded-xl border border-zinc-200 px-3 py-2 text-sm"
        >
          <option value="">Any price</option>
          <option value="30">Under ₹30/kg</option>
          <option value="50">Under ₹50/kg</option>
          <option value="100">Under ₹100/kg</option>
        </select>
        <label className="flex items-center gap-2 rounded-xl border border-zinc-200 px-3 py-2 text-sm">
          <input
            type="checkbox"
            defaultChecked={params.get("organic") === "1"}
            onChange={(e) => update("organic", e.target.checked ? "1" : "")}
          />
          Organic only
        </label>
      </div>
    </div>
  );
}
