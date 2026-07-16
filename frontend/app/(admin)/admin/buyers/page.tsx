"use client";

import { useEffect, useState } from "react";
import { formatBuyerType } from "@/lib/roles";
import { formatCurrency } from "@/lib/utils";
import { Loader2, Users } from "lucide-react";

export default function AdminBuyersPage() {
  const [buyers, setBuyers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBuyers = async () => {
      try {
        const token = localStorage.getItem("khetse_token");
        if (!token) return;

        const res = await fetch("http://localhost:5000/api/admin/buyers", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.ok) {
          setBuyers(await res.json());
        }
      } catch (error) {
        console.error("Failed to fetch buyers", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBuyers();
  }, []);

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center text-zinc-500">
        <Loader2 className="h-6 w-6 animate-spin mr-2 text-emerald-600" />
        Loading buyer database...
      </div>
    );
  }

  const breakdown = {
    HOUSEHOLD: buyers.filter((b: any) => b.buyerType === "Household").length,
    RESTAURANT: buyers.filter((b: any) => b.buyerType === "Restaurant").length,
    SHOP: buyers.filter((b: any) => b.buyerType === "Shop").length,
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Users className="h-4 w-4 text-emerald-600" />
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">Customer Base</p>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Buyers</h1>
        <p className="text-sm text-zinc-500 mt-1">{buyers.length} registered customers across the platform</p>
      </div>

      {/* Analytics Strip */}
      <div className="flex flex-wrap gap-3">
        {Object.entries(breakdown).map(([type, count]) => (
          <div key={type} className="rounded-xl border border-zinc-200/80 bg-white px-5 py-3 text-sm shadow-sm">
            <span className="font-bold text-zinc-800">{formatBuyerType(type)}</span>
            <span className="ml-2 text-zinc-500 text-xs font-semibold px-2 py-0.5 bg-zinc-100 rounded-full">{count}</span>
          </div>
        ))}
      </div>

      {/* Buyer List */}
      <div className="space-y-3">
        {buyers.map((buyer: any) => (
          <div key={buyer.id} className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm hover:border-emerald-200 transition-colors">
            <div className="flex flex-wrap justify-between gap-2">
              <div>
                <p className="font-bold text-zinc-900 text-lg">{buyer.name}</p>
                <p className="text-sm text-zinc-500 mt-0.5">
                  +91 {buyer.phone} <span className="mx-1.5 text-zinc-300">|</span> 
                  <span className="font-semibold text-emerald-700">{formatBuyerType(buyer.buyerType)}</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-emerald-700">{formatCurrency(buyer.totalSpent)}</p>
                <p className="text-xs text-zinc-400 font-medium uppercase tracking-wide">Lifetime Spent</p>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-zinc-100 flex items-center justify-between">
              <p className="text-xs text-zinc-500">
                <span className="font-bold text-zinc-700">{buyer.orderCount}</span> total orders
              </p>
              <p className="text-xs text-zinc-400 font-mono bg-zinc-50 px-2 py-1 rounded border border-zinc-100">
                Last: #{buyer.lastOrderNumber}
              </p>
            </div>
          </div>
        ))}

        {buyers.length === 0 && (
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-12 text-center">
            <p className="text-sm text-zinc-400">No buyers have registered yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}