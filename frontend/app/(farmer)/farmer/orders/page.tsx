"use client";

import { useEffect, useState } from "react";
import { FarmerOrderCard } from "@/components/farmer/order-card";
import { Package, AlertCircle, ArrowLeft, ChevronRight, User, Clock } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function FarmerOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  const fetchOrders = async (showLoadingScreen = true) => {
    if (showLoadingScreen) setLoading(true);
    
    try {
      const token = localStorage.getItem("khetse_token");
      if (!token) {
        setError("Please log in to view your orders.");
        if (showLoadingScreen) setLoading(false);
        return;
      }
      
      const response = await fetch("http://localhost:5000/api/orders/sales", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!response.ok) throw new Error("Failed to fetch orders");
      const data = await response.json();
      
      setOrders(data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (err: any) {
      if (showLoadingScreen) setError("Could not load incoming orders.");
    } finally {
      if (showLoadingScreen) setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(true);
  }, []);

  if (loading) {
    return (
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl">Incoming Orders</h1>
          <p className="text-sm text-zinc-500 mt-1">Loading your sales...</p>
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 animate-pulse rounded-2xl bg-white border border-zinc-200/80 shadow-sm" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
        <AlertCircle className="mx-auto h-8 w-8 text-red-400 mb-3" />
        <p className="font-bold text-red-700">{error}</p>
      </div>
    );
  }

  const groupedOrders = orders.reduce((acc: any[], order: any) => {
    const orderTime = new Date(order.createdAt).getTime();
    const buyerId = order.buyer?._id || "unknown";
    
    const existingGroup = acc.find((g: any) => g.buyerId === buyerId && Math.abs(g.timestamp - orderTime) < 10000);
    
    if (existingGroup) {
      existingGroup.items.push(order);
    } else {
      const timeStr = new Date(order.createdAt).toLocaleString("en-US", { 
        day: "numeric", month: "short", year: "numeric", 
        hour: "numeric", minute: "2-digit" 
      });
      const buyerName = order.buyer ? `${order.buyer.firstName} ${order.buyer.lastName}` : "Unknown Buyer";

      acc.push({ 
        id: order._id,
        buyerId,
        buyerName,
        title: timeStr, 
        timestamp: orderTime, 
        items: [order] 
      });
    }
    return acc;
  }, []);

  const pendingItems = orders.filter((o) => o.status === "Pending").length;
  const activeItems = orders.filter((o) => o.status === "Confirmed").length;
  const completedItems = orders.filter((o) => o.status === "Delivered").length;

  // DETAILED VIEW
  if (selectedGroupId) {
    const activeGroup = groupedOrders.find((g: any) => g.id === selectedGroupId);
    
    if (!activeGroup) {
      setSelectedGroupId(null);
      return null; 
    }

    const sessionTotal = activeGroup.items.reduce((sum: number, order: any) => sum + (order.totalPrice || 0), 0);

    return (
      <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
        <button
          onClick={() => setSelectedGroupId(null)}
          className="group inline-flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-emerald-700 transition-colors"
        >
          <div className="grid h-8 w-8 place-items-center rounded-full bg-zinc-100 group-hover:bg-emerald-50 transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </div>
          Back to all orders
        </button>

        <div className="border-b border-zinc-200 pb-5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 mb-1">Order Session</p>
          <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl tracking-tight">{activeGroup.buyerName}</h1>
          <p className="mt-1 text-sm font-medium text-zinc-500">
            {activeGroup.title} · {activeGroup.items.length} item{activeGroup.items.length !== 1 ? "s" : ""} · Total: <span className="text-emerald-700">{formatCurrency(sessionTotal)}</span>
          </p>
        </div>

        <div className="space-y-4">
          {activeGroup.items.map((order: any) => (
            <FarmerOrderCard key={order._id} order={order} onUpdate={() => fetchOrders(false)} />
          ))}
        </div>
      </div>
    );
  }

  // MAIN LIST VIEW
  return (
    <div className="space-y-7 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl tracking-tight">Incoming Orders</h1>
        <p className="mt-1 text-sm text-zinc-500">
          {orders.length} items across {groupedOrders.length} session{groupedOrders.length !== 1 ? "s" : ""}
        </p>
      </div>

      {pendingItems > 0 && (
        <div className="flex items-center gap-3 rounded-2xl border border-amber-200/80 bg-amber-50 px-5 py-4">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-700">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-amber-900">
              {pendingItems} new item{pendingItems > 1 ? "s" : ""} need{pendingItems === 1 ? "s" : ""} your response
            </p>
            <p className="text-xs text-amber-700/80 mt-0.5">Check your order sessions below and accept them quickly.</p>
          </div>
        </div>
      )}

      {orders.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Awaiting", count: pendingItems, color: "bg-amber-50 text-amber-700 border-amber-200/60" },
            { label: "In Progress", count: activeItems, color: "bg-blue-50 text-blue-700 border-blue-200/60" },
            { label: "Delivered", count: completedItems, color: "bg-emerald-50 text-emerald-700 border-emerald-200/60" },
          ].map(({ label, count, color }) => (
            <div key={label} className={`rounded-xl border px-4 py-3 text-center ${color}`}>
              <p className="text-xl font-black">{count}</p>
              <p className="text-xs font-semibold mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      )}

      {groupedOrders.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {groupedOrders.map((group: any) => {
            const sessionTotal = group.items.reduce((sum: number, order: any) => sum + (order.totalPrice || 0), 0);
            const groupPending = group.items.filter((i: any) => i.status === "Pending").length;
            
            const isFinished = group.items.every((i: any) => ["Delivered", "Cancelled"].includes(i.status));
            const isAllDeclined = group.items.every((i: any) => i.status === "Cancelled");

            return (
              <div 
                key={group.id}
                onClick={() => setSelectedGroupId(group.id)}
                className="group relative flex cursor-pointer items-center justify-between rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all active:scale-[0.98]"
              >
                <div className="flex items-center gap-4">
                  <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-full transition-colors ${
                    isFinished 
                      ? "bg-zinc-100 text-zinc-400" 
                      : "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100"
                  }`}>
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className={`text-base font-bold ${isFinished ? "text-zinc-500" : "text-zinc-900"}`}>
                        {group.buyerName}
                      </h2>
                      {groupPending > 0 && (
                        <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                          Action needed
                        </span>
                      )}
                    </div>
                    <p className={`mt-0.5 text-sm font-medium ${isFinished ? "text-zinc-400" : "text-zinc-500"}`}>
                      <Clock className="inline h-3 w-3 mr-1 -mt-0.5" />
                      {group.title.split(",")[1]} 
                      <span className="mx-1.5 text-zinc-200">|</span>
                      {group.items.length} item{group.items.length !== 1 ? "s" : ""} · <span className={isFinished ? "text-zinc-400" : "text-emerald-700"}>{formatCurrency(sessionTotal)}</span>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  {isFinished && !isAllDeclined && (
                    <span className="text-sm font-bold text-emerald-600">Completed</span>
                  )}
                  {isAllDeclined && (
                    <span className="text-sm font-bold text-red-600">Declined</span>
                  )}
                  <div className="grid h-8 w-8 place-items-center rounded-full bg-zinc-50 text-zinc-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-16 text-center shadow-sm">
          <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-zinc-100 text-zinc-400">
            <Package className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900">No orders yet</h3>
          <p className="mt-2 text-sm text-zinc-500 max-w-sm mx-auto leading-relaxed">
            Orders will appear here when buyers purchase from your listings. Make sure your listings are live!
          </p>
        </div>
      )}
    </div>
  );
}