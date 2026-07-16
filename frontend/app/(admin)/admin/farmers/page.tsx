"use client";

import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { Tractor, Loader2, ShieldCheck, TrendingUp, Package, Star } from "lucide-react";

export default function AdminFarmersPage() {
  const [farmers, setFarmers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const token = localStorage.getItem("khetse_token");
        if (!token) return;

        const res = await fetch("http://localhost:5000/api/admin/farmers", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.ok) {
          setFarmers(await res.json());
        }
      } catch (error) {
        console.error("Failed to fetch farmers", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFarmers();
  }, []);

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center text-zinc-500">
        <Loader2 className="h-6 w-6 animate-spin mr-2 text-emerald-600" />
        Loading farmer database...
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Page header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Tractor className="h-4 w-4 text-emerald-600" />
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">Farmer Management</p>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Active Farmers</h1>
        <p className="text-sm text-zinc-500 mt-1">
          {farmers.length} registered sellers on the platform
        </p>
      </div>

      {/* All farmers */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck className="h-4 w-4 text-zinc-400" />
          <h2 className="text-sm font-bold text-zinc-700">All Registered Farmers</h2>
        </div>
        
        <div className="space-y-3">
          {farmers.map((farmer: any) => (
            <div
              key={farmer.id}
              className="group rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                
                {/* Farmer Info */}
                <div className="flex items-start gap-4 min-w-0">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700 font-black text-base shrink-0">
                    {farmer.name?.charAt(0)?.toUpperCase() ?? "F"}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-bold text-zinc-900">{farmer.name}</h3>
                      
                      {/* ⭐ THE NEW RATING BADGE ⭐ */}
                      {farmer.reviewCount > 0 ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-700">
                          <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                          {farmer.rating} ({farmer.reviewCount})
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[11px] font-bold text-zinc-500">
                          New
                        </span>
                      )}
                    </div>
                    
                    <p className="text-xs text-zinc-500">
                      {farmer.village}
                      {farmer.farmSize && <span> · {farmer.farmSize}</span>}
                    </p>
                    {farmer.cropsGrown?.length > 0 && (
                      <p className="text-xs text-zinc-400 mt-1 truncate max-w-xs">
                        Grows: {farmer.cropsGrown.join(", ")}
                      </p>
                    )}
                  </div>
                </div>

                {/* Farmer Stats */}
                <div className="flex items-start gap-6 shrink-0">
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm font-bold text-emerald-700">
                      <TrendingUp className="h-3.5 w-3.5" />
                      {formatCurrency(farmer.revenue)}
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-0.5">Revenue</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm font-bold text-zinc-700">
                      <Package className="h-3.5 w-3.5 text-zinc-400" />
                      {farmer.sold}
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-0.5">Delivered</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-zinc-700">{farmer.listings}</p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">Listings</p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {farmers.length === 0 && (
            <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-12 text-center">
              <Tractor className="mx-auto h-8 w-8 text-zinc-300 mb-3" />
              <p className="text-sm font-medium text-zinc-500">No farmers registered yet</p>
              <p className="text-xs text-zinc-400 mt-1">Farmer registrations will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}