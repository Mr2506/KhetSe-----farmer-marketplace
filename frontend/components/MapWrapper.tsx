"use client";

import dynamic from "next/dynamic";

const LocationPicker = dynamic(() => import("./LocationPicker"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] w-full bg-zinc-100 animate-pulse rounded-xl flex items-center justify-center text-zinc-400">
      Loading Map Engine...
    </div>
  ),
});

export default function MapWrapper({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  return <LocationPicker onLocationSelect={onLocationSelect} />;
}