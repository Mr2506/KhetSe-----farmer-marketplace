"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, Leaf, RotateCcw, SlidersHorizontal, X } from "lucide-react";
import { useState, useCallback, useEffect } from "react";

export function BrowseFilters({ categories }: { categories: string[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetClosing, setSheetClosing] = useState(false);

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.push(`/buyer/browse?${next.toString()}`, { scroll: false });
  }

  const isOrganicChecked = params.get("organic") === "1";
  const hasFilters =
    params.get("q") || params.get("category") || params.get("distance") || params.get("maxPrice") || isOrganicChecked;

  // Count active filters (excluding search)
  const activeFilterCount = [
    params.get("category"),
    params.get("distance"),
    params.get("maxPrice"),
    isOrganicChecked ? "1" : null,
  ].filter(Boolean).length;

  const inputBase =
    "h-11 w-full rounded-xl border border-[#E5E7EB] bg-white px-3.5 text-sm text-[#1A1A1A] placeholder:text-[#6B7280] focus:border-[#2E7D32] focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/15 transition-all duration-150";

  // Close bottom sheet with exit animation
  const closeSheet = useCallback(() => {
    setSheetClosing(true);
    setTimeout(() => {
      setSheetOpen(false);
      setSheetClosing(false);
    }, 250);
  }, []);

  // Lock body scroll when sheet is open
  useEffect(() => {
    if (sheetOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sheetOpen]);

  /* ── Shared filter controls (used in both desktop inline and mobile sheet) ── */
  const filterControls = (
    <>
      {/* Category */}
      <div className="flex-1 sm:min-w-[140px]">
        <label htmlFor="browse-category" className="block text-xs font-bold text-[#6B7280] mb-1.5 md:hidden">
          Category
        </label>
        <label htmlFor="browse-category" className="sr-only md:not-sr-only hidden">Category</label>
        <select
          id="browse-category"
          defaultValue={params.get("category") ?? ""}
          onChange={(e) => update("category", e.target.value)}
          className={`${inputBase} cursor-pointer appearance-none`}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Distance */}
      <div className="flex-1 sm:min-w-[130px]">
        <label htmlFor="browse-distance" className="block text-xs font-bold text-[#6B7280] mb-1.5 md:hidden">
          Distance
        </label>
        <label htmlFor="browse-distance" className="sr-only md:not-sr-only hidden">Distance</label>
        <select
          id="browse-distance"
          defaultValue={params.get("distance") ?? ""}
          onChange={(e) => update("distance", e.target.value)}
          className={`${inputBase} cursor-pointer appearance-none`}
        >
          <option value="">Any distance</option>
          <option value="5">Within 5 km</option>
          <option value="10">Within 10 km</option>
          <option value="20">Within 20 km</option>
        </select>
      </div>

      {/* Max price */}
      <div className="flex-1 sm:min-w-[130px]">
        <label htmlFor="browse-price" className="block text-xs font-bold text-[#6B7280] mb-1.5 md:hidden">
          Max Price
        </label>
        <label htmlFor="browse-price" className="sr-only md:not-sr-only hidden">Maximum price</label>
        <select
          id="browse-price"
          defaultValue={params.get("maxPrice") ?? ""}
          onChange={(e) => update("maxPrice", e.target.value)}
          className={`${inputBase} cursor-pointer appearance-none`}
        >
          <option value="">Any price</option>
          <option value="30">Under ₹30/kg</option>
          <option value="50">Under ₹50/kg</option>
          <option value="100">Under ₹100/kg</option>
        </select>
      </div>

      {/* Organic toggle */}
      <div>
        <span className="block text-xs font-bold text-[#6B7280] mb-1.5 md:hidden">
          Organic Only
        </span>
        <label
          htmlFor="browse-organic"
          className="flex h-11 cursor-pointer select-none items-center gap-2.5 rounded-xl border border-[#E5E7EB] bg-white px-3.5 transition-all duration-150 hover:border-[#2E7D32]/40"
        >
          <Leaf
            className={`h-4 w-4 shrink-0 transition-colors duration-150 ${isOrganicChecked ? "text-[#2E7D32]" : "text-[#6B7280]"}`}
            aria-hidden="true"
          />
          <span className={`text-sm font-semibold transition-colors duration-150 ${isOrganicChecked ? "text-[#2E7D32]" : "text-[#6B7280]"}`}>
            Organic
          </span>
          {/* Toggle switch with proper accessibility */}
          <div
            role="switch"
            aria-checked={isOrganicChecked}
            aria-label="Filter organic produce only"
            tabIndex={0}
            onClick={() => update("organic", isOrganicChecked ? "" : "1")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                update("organic", isOrganicChecked ? "" : "1");
              }
            }}
            className={`relative h-6 w-11 rounded-full transition-colors duration-200 shrink-0 cursor-pointer ${isOrganicChecked ? "bg-[#2E7D32]" : "bg-[#D1D5DB]"}`}
          >
            <div
              className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${isOrganicChecked ? "translate-x-5" : "translate-x-0"}`}
            />
          </div>
          <input
            id="browse-organic"
            type="checkbox"
            checked={isOrganicChecked}
            onChange={(e) => update("organic", e.target.checked ? "1" : "")}
            className="sr-only"
            aria-hidden="true"
          />
        </label>
      </div>

      {/* Reset filters */}
      {hasFilters && (
        <button
          type="button"
          onClick={() => {
            router.push("/buyer/browse", { scroll: false });
            if (sheetOpen) closeSheet();
          }}
          className="flex h-11 items-center gap-1.5 rounded-xl border border-[#E5E7EB] bg-white px-3.5 text-sm font-semibold text-[#6B7280] hover:border-[#2E7D32]/40 hover:text-[#2E7D32] transition-all duration-150 shrink-0"
          aria-label="Reset all filters"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          Reset
        </button>
      )}
    </>
  );

  return (
    <>
      <div
        className="rounded-xl border border-[#E5E7EB] bg-white shadow-sm p-4"
        role="search"
        aria-label="Filter produce listings"
      >
        {/* ── Desktop: all filters inline (unchanged) ── */}
        <div className="hidden md:flex md:flex-row md:flex-wrap md:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 sm:min-w-[160px]">
            <label htmlFor="browse-search-desktop" className="sr-only">Search crops</label>
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280]" aria-hidden="true" />
            <input
              id="browse-search-desktop"
              type="search"
              placeholder="Search crops..."
              defaultValue={params.get("q") ?? ""}
              onChange={(e) => update("q", e.target.value)}
              className={`${inputBase} pl-10`}
            />
          </div>
          {filterControls}
        </div>

        {/* ── Mobile: search + filter button ── */}
        <div className="flex md:hidden items-center gap-2.5">
          {/* Search bar */}
          <div className="relative flex-1">
            <label htmlFor="browse-search-mobile" className="sr-only">Search crops</label>
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280]" aria-hidden="true" />
            <input
              id="browse-search-mobile"
              type="search"
              placeholder="Search crops..."
              defaultValue={params.get("q") ?? ""}
              onChange={(e) => update("q", e.target.value)}
              className={`${inputBase} pl-10`}
            />
          </div>

          {/* Single Filter button */}
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="relative flex h-11 items-center gap-1.5 rounded-xl border border-[#E5E7EB] bg-white px-3.5 text-sm font-semibold text-[#6B7280] hover:border-[#2E7D32]/40 hover:text-[#2E7D32] active:scale-[0.97] transition-all duration-150 shrink-0"
            aria-label="Open filter options"
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            <span>Filters</span>
            {/* Active filter count badge */}
            {activeFilterCount > 0 && (
              <span className="grid h-5 min-w-[20px] place-items-center rounded-full bg-[#2E7D32] px-1 text-[10px] font-black text-white leading-none">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── Mobile Filter Bottom Sheet ── */}
      {sheetOpen && (
        <div
          className={`fixed inset-0 z-50 md:hidden ${sheetClosing ? "ks-backdrop-exit" : "ks-backdrop-enter"}`}
          aria-modal="true"
          role="dialog"
          aria-label="Filter options"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={closeSheet}
            aria-hidden="true"
          />

          {/* Sheet panel */}
          <div
            className={`absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white shadow-2xl ${sheetClosing ? "ks-sheet-exit" : "ks-sheet-enter"}`}
          >
            {/* Handle + header */}
            <div className="sticky top-0 z-10 bg-white border-b border-[#E5E7EB] px-5 pt-3 pb-4 rounded-t-2xl">
              {/* Drag handle */}
              <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-[#D1D5DB]" />
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-[#1A1A1A]">Filter Produce</h2>
                <button
                  type="button"
                  onClick={closeSheet}
                  className="grid h-8 w-8 place-items-center rounded-full text-[#6B7280] hover:bg-[#F7F8F5] hover:text-[#1A1A1A] transition-colors duration-150"
                  aria-label="Close filters"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>

            {/* Filter controls in vertical layout */}
            <div className="px-5 py-5 space-y-4">
              {filterControls}
            </div>

            {/* Bottom action bar */}
            <div className="sticky bottom-0 bg-white border-t border-[#E5E7EB] px-5 py-4 ks-safe-bottom">
              <button
                type="button"
                onClick={closeSheet}
                className="w-full rounded-xl bg-[#EF9F27] py-3 text-sm font-bold text-white shadow-sm hover:bg-[#E08E1E] active:scale-[0.98] transition-all duration-150"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
