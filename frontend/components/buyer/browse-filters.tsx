"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, Leaf, RotateCcw } from "lucide-react";

export function BrowseFilters({ categories }: { categories: string[] }) {
  const router = useRouter();
  const params = useSearchParams();

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.push(`/buyer/browse?${next.toString()}`);
  }

  const isOrganicChecked = params.get("organic") === "1";
  const hasFilters =
    params.get("q") || params.get("category") || params.get("distance") || params.get("maxPrice") || isOrganicChecked;

  const inputBase =
    "h-10 w-full rounded-xl border border-[#E5E7EB] bg-white px-3.5 text-sm text-[#1A1A1A] placeholder:text-[#9CA3AF] focus:border-[#2E7D32] focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/15 transition-all duration-150";

  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-white shadow-sm" style={{ padding: "16px" }}>
      <div className="flex flex-wrap items-center gap-3">

        {/* Search */}
        <div className="relative flex-1 min-w-[160px]">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
          <input
            type="search"
            placeholder="Search crops..."
            defaultValue={params.get("q") ?? ""}
            onChange={(e) => update("q", e.target.value)}
            className={`${inputBase} pl-10`}
          />
        </div>

        {/* Category */}
        <select
          defaultValue={params.get("category") ?? ""}
          onChange={(e) => update("category", e.target.value)}
          className={`${inputBase} min-w-[140px] flex-1 cursor-pointer appearance-none`}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Distance */}
        <select
          defaultValue={params.get("distance") ?? ""}
          onChange={(e) => update("distance", e.target.value)}
          className={`${inputBase} min-w-[130px] flex-1 cursor-pointer appearance-none`}
        >
          <option value="">Any distance</option>
          <option value="5">Within 5 km</option>
          <option value="10">Within 10 km</option>
          <option value="20">Within 20 km</option>
        </select>

        {/* Max price */}
        <select
          defaultValue={params.get("maxPrice") ?? ""}
          onChange={(e) => update("maxPrice", e.target.value)}
          className={`${inputBase} min-w-[130px] flex-1 cursor-pointer appearance-none`}
        >
          <option value="">Any price</option>
          <option value="30">Under ₹30/kg</option>
          <option value="50">Under ₹50/kg</option>
          <option value="100">Under ₹100/kg</option>
        </select>

        {/* Organic toggle */}
        <label className="flex h-10 cursor-pointer select-none items-center gap-2.5 rounded-xl border border-[#E5E7EB] bg-white px-3.5 transition-all duration-150 hover:border-[#2E7D32]/40">
          <Leaf className={`h-4 w-4 shrink-0 transition-colors duration-150 ${isOrganicChecked ? "text-[#2E7D32]" : "text-[#9CA3AF]"}`} />
          <span className={`text-sm font-semibold transition-colors duration-150 ${isOrganicChecked ? "text-[#2E7D32]" : "text-[#6B7280]"}`}>
            Organic
          </span>
          {/* Toggle switch */}
          <div
            className={`relative h-5 w-9 rounded-full transition-colors duration-200 shrink-0 ${isOrganicChecked ? "bg-[#2E7D32]" : "bg-[#D1D5DB]"}`}
          >
            <div
              className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${isOrganicChecked ? "translate-x-4" : "translate-x-0"}`}
            />
          </div>
          <input
            type="checkbox"
            defaultChecked={isOrganicChecked}
            onChange={(e) => update("organic", e.target.checked ? "1" : "")}
            className="sr-only"
          />
        </label>

        {/* Reset filters */}
        {hasFilters && (
          <button
            type="button"
            onClick={() => router.push("/buyer/browse")}
            className="flex h-10 items-center gap-1.5 rounded-xl border border-[#E5E7EB] bg-white px-3.5 text-sm font-semibold text-[#6B7280] hover:border-[#2E7D32]/40 hover:text-[#2E7D32] transition-all duration-150 shrink-0"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
