"use client";

import { useState, useRef, useMemo } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapPin, Navigation, Loader2 } from "lucide-react"; 

// Fix for default Leaflet icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  map.flyTo(center, 15);
  return null;
}

export default function LocationPicker({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  const [position, setPosition] = useState<[number, number]>([23.2156, 72.6369]); 
  const [searchQuery, setSearchQuery] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const markerRef = useRef<L.Marker>(null);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const { lat, lng } = marker.getLatLng();
          setPosition([lat, lng]);
          onLocationSelect(lat, lng);
        }
      },
    }),
    [onLocationSelect]
  );

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    
    setIsLoading(true); 

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setPosition([lat, lng]);
        onLocationSelect(lat, lng);
        setIsLoading(false); 
      },
      (err) => {
        alert("Could not get your location. Please check your browser permissions.");
        setIsLoading(false); 
      },
      { enableHighAccuracy: true }
    );
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;

    try {
      setIsLoading(true); 

      const token = localStorage.getItem("khetse_token");
      const url = `https://khetse-backend.onrender.com/api/map/search?q=${encodeURIComponent(searchQuery)}`;
      
      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // THIS IS THE NEW ERROR CHECKER
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(`BACKEND REJECTED (${res.status}): ${errorData.message || 'Unknown error'}`);
      }

      const data = await res.json();
      
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        setPosition([lat, lng]);
        onLocationSelect(lat, lng);
      } else {
        alert("Location not found. Try being more specific.");
      }
    } catch (error: any) {
      console.error("Search failed:", error);
      alert(error.message); // This will pop up the exact error on your screen!
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <div className="space-y-4 w-full">
      <div className="flex gap-2">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <input
            type="text"
            placeholder="Search your area (e.g., Sector 11, Gandhinagar)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm disabled:opacity-60 disabled:cursor-not-allowed bg-white"
          />
          <button 
            type="submit" 
            disabled={isLoading}
            className="bg-zinc-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-700 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center min-w-[80px]"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
          </button>
        </form>
        
        <button 
          onClick={handleLocateMe}
          type="button"
          disabled={isLoading}
          className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-emerald-200 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
          Locate Me
        </button>
      </div>

      <div className="h-[400px] w-full rounded-xl overflow-hidden border border-zinc-200 relative z-0">
        
        {isLoading && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm transition-all duration-300">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent shadow-md"></div>
            <p className="mt-3 font-bold text-zinc-800 tracking-wide text-sm bg-white/90 px-4 py-1.5 rounded-full shadow-sm">
              Processing location...
            </p>
          </div>
        )}

{/* @ts-ignore */}
        <MapContainer center={position} zoom={13} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }}>
          
          {/* @ts-ignore */}
            <TileLayer
            // @ts-ignore
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <ChangeView center={position} />
          
          {/* @ts-ignore */}
          <Marker draggable={true} eventHandlers={eventHandlers} position={position} ref={markerRef} />
        </MapContainer>
      </div>

      <p className="text-xs text-zinc-500 flex items-center gap-1">
        <MapPin className="w-3 h-3" />
        Drag the pin to perfectly calibrate your delivery or farm coordinates.
      </p>
    </div>
  );
}