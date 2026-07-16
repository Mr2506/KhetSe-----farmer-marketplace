"use client";

import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { Loader2, ShoppingBag, AlertCircle, PackageX } from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("khetse_token");
        if (!token) return;

        const res = await fetch("http://localhost:5000/api/admin/orders", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.ok) {
          setOrders(await res.json());
        }
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center text-zinc-500">
        <Loader2 className="h-6 w-6 animate-spin mr-2 text-purple-600" />
        Loading platform transactions...
      </div>
    );
  }

  // Analytics Math
  const cancelled = orders.filter((o) => o.status === "Cancelled").length;
  const cancelRate = orders.length ? Math.round((cancelled / orders.length) * 100) : 0;
  const disputed = orders.filter((o: any) => o.dispute).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <ShoppingBag className="h-4 w-4 text-purple-600" />
          <p className="text-xs font-bold uppercase tracking-widest text-purple-600">Transaction Log</p>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">All Orders</h1>
        <p className="text-sm text-zinc-500 mt-1">
          {orders.length} platform-wide · {cancelRate}% cancellation rate · {disputed} disputes
        </p>
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {orders.map((order: any) => {
          const isCancelled = order.status === "Cancelled";
          
          return (
            <div 
              key={order.id} 
              className={`rounded-2xl border bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md ${
                isCancelled ? "border-red-200/60 bg-red-50/10" : "border-zinc-200/80 hover:border-purple-200"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                
                {/* Order Details */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-zinc-900 font-mono text-sm">
                      #{order.id.slice(-8).toUpperCase()}
                    </p>
                    <span className="text-zinc-300">|</span>
                    <p className="text-xs text-zinc-500 font-medium">
                      {new Date(order.placedAt).toLocaleDateString("en-IN", { 
                        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>
                  
                  <p className="text-sm font-semibold text-zinc-700">
                    <span className="text-blue-700">{order.buyerName}</span> 
                    <span className="mx-2 text-zinc-300">→</span> 
                    <span className="text-emerald-700">{order.farmerName}</span>
                  </p>
                  
                  {order.items?.length > 0 ? (
                    <p className="mt-2 text-xs text-zinc-500 max-w-md truncate">
                      <span className="font-semibold text-zinc-600">Items:</span> {order.items.join(", ")}
                    </p>
                  ) : (
                    <p className="mt-2 text-xs text-zinc-400 italic">No items listed</p>
                  )}
                </div>
                
                {/* Status & Price */}
                <div className="text-right shrink-0">
                  <div className="flex items-center justify-end gap-2 mb-2">
                    {order.dispute && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 border border-red-200 px-2 py-0.5 text-[10px] font-bold text-red-700 uppercase tracking-wider">
                        <AlertCircle className="h-3 w-3" />
                        Dispute
                      </span>
                    )}
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider border ${
                      isCancelled ? "bg-red-50 text-red-700 border-red-200/60" :
                      order.status === "Delivered" ? "bg-emerald-50 text-emerald-700 border-emerald-200/60" :
                      "bg-amber-50 text-amber-700 border-amber-200/60"
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-lg font-black text-zinc-900">
                    {formatCurrency(order.grandTotal)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {orders.length === 0 && (
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-12 text-center">
            <PackageX className="mx-auto h-8 w-8 text-zinc-300 mb-3" />
            <p className="text-sm font-medium text-zinc-500">No orders found</p>
            <p className="text-xs text-zinc-400 mt-1">Transactions will appear here when buyers start ordering.</p>
          </div>
        )}
      </div>
    </div>
  );
}