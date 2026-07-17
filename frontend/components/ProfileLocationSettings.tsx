"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
const MapWrapper = dynamic(() => import("@/components/MapWrapper"), { ssr: false });
import { toast } from "sonner"; // Replace with your toast library if different

export default function ProfileLocationSettings() {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasLocation, setHasLocation] = useState(false);

  // Load existing location on page mount if it exists
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("khetse_token");
        if (!token) return;

        const res = await fetch("https://khetse-backend.onrender.com/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          if (data.user?.location?.lat) {
            setCoords({ lat: data.user.location.lat, lng: data.user.location.lng });
            setHasLocation(true);
          }
        }
      } catch (err) {
        console.error("Failed to load user profile", err);
      }
    };

    fetchUserProfile();
  }, []);

  const handleSaveLocation = async () => {
    if (!coords) {
      toast.error("Please select a location on the map first");
      return;
    }

    setIsSaving(true);
    try {
      const token = localStorage.getItem("khetse_token");
      const res = await fetch("https://khetse-backend.onrender.com/api/users/location", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(coords),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Default address updated perfectly!");
        setHasLocation(true);
      } else {
        toast.error(data.message || "Failed to update location");
      }
    } catch (error) {
      toast.error("Server connection error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm max-w-3xl space-y-6 mt-6">
      <div>
        <h2 className="text-lg font-bold text-zinc-900">Primary Delivery / Farm Location</h2>
        <p className="text-xs text-zinc-500 mt-0.5">
          This address determines your logistics route. Please pin your physical doorstep or warehouse correctly.
        </p>
      </div>

      {/* Notification Banner */}
      {hasLocation ? (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-medium text-emerald-800">
          ✓ Your primary coordinates are active. You can re-drag the pin below anytime to fine-tune your address.
        </div>
      ) : (
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-xs font-medium text-amber-800 animate-pulse">
          ⚠ Action Required: No location coordinates found on your profile. You will be restricted from placing/accepting orders until this is set.
        </div>
      )}

      {/* Interactive Map Section */}
      <div className="space-y-4">
        <MapWrapper
          onLocationSelect={(lat, lng) => {
            setCoords({ lat, lng });
          }}
        />

        {/* Display Current Coordinates Debug Stats */}
        {coords && (
          <div className="rounded-lg bg-zinc-50 p-3 text-xs font-mono text-zinc-500 flex justify-between items-center">
            <span>Latitude: {coords.lat.toFixed(6)}</span>
            <span>Longitude: {coords.lng.toFixed(6)}</span>
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="button"
            disabled={isSaving}
            onClick={handleSaveLocation}
            className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-emerald-700 transition disabled:opacity-60"
          >
            {isSaving ? "Saving Address..." : "Confirm & Save Location"}
          </button>
        </div>
      </div>
    </div>
  );
}