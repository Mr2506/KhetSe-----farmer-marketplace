"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, ArrowRight, ArrowLeft, AlertCircle, ChevronRight, ShoppingBag } from "lucide-react";
import { BuyerOrderCard } from "@/components/buyer/order-card";
import { formatCurrency } from "@/lib/utils";

export default function BuyerOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Track the specific Cart Session ID the user clicked on
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("khetse_token");
        if (!token) {
          setError("Please log in to view your orders.");
          setLoading(false);
          return;
        }
        const response = await fetch("http://localhost:5000/api/orders/myorders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch orders");
        const data = await response.json();
        
        // Sort newest first
        setOrders(data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      } catch (err: any) {
        setError("Could not load your orders at this time.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">My Orders</h1>
          <p className="text-sm text-zinc-500 mt-1">Loading your order history...</p>
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
        <Link
          href="/login"
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-500 transition-colors"
        >
          Go to Login
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  // --- GROUP ORDERS BY CHECKOUT SESSION ---
  // Groups items bought within a 10-second window into the same "Cart"
  const groupedOrders = orders.reduce((acc: any[], order: any) => {
    const orderTime = new Date(order.createdAt).getTime();
    
    // Look for an existing group that was created at the exact same time
    const existingGroup = acc.find(g => Math.abs(g.timestamp - orderTime) < 10000); // 10 second window
    
    if (existingGroup) {
      existingGroup.items.push(order);
    } else {
      // Create a nice display title with Date and Time
      const timeStr = new Date(order.createdAt).toLocaleString("en-US", { 
        day: "numeric", month: "short", year: "numeric", 
        hour: "numeric", minute: "2-digit" 
      });
      
      acc.push({ 
        id: order._id, // Use the first order's ID as the unique group ID
        title: timeStr, 
        timestamp: orderTime, 
        items: [order] 
      });
    }
    return acc;
  }, []);

  // ==========================================
  // VIEW 2: DETAILED VIEW (When a session is clicked)
  // ==========================================
  if (selectedGroupId) {
    const activeGroup = groupedOrders.find((g) => g.id === selectedGroupId);
    
    if (!activeGroup) {
      setSelectedGroupId(null);
      return null; 
    }

    const dailyTotal = activeGroup.items.reduce((sum: number, order: any) => sum + (order.totalPrice || 0), 0);

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
          <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl tracking-tight">{activeGroup.title}</h1>
          <p className="mt-1 text-sm font-medium text-zinc-500">
            {activeGroup.items.length} item{activeGroup.items.length !== 1 ? "s" : ""} · Total: <span className="text-emerald-700">{formatCurrency(dailyTotal)}</span>
          </p>
        </div>

        <div className="space-y-4">
          {activeGroup.items.map((order: any) => (
            <BuyerOrderCard key={order._id} order={order} />
          ))}
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 1: MAIN LIST VIEW
  // ==========================================
  return (
    <div className="space-y-7 animate-in fade-in duration-300">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl tracking-tight">My Orders</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {orders.length} total item{orders.length !== 1 ? "s" : ""} across {groupedOrders.length} checkout{groupedOrders.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/buyer/browse"
          className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 shadow-sm hover:border-emerald-400 hover:text-emerald-700 transition-all"
        >
          Browse more produce
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-16 text-center shadow-sm">
          <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
            <ShoppingBag className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900">No orders yet</h3>
          <p className="mt-2 text-sm text-zinc-500 max-w-sm mx-auto leading-relaxed">
            You haven't bought any fresh produce yet. Start browsing local farms near you.
          </p>
          <Link
            href="/buyer/browse"
            className="mt-6 inline-flex items-center gap-2.5 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-500 transition-all"
          >
            Browse Fresh Produce
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {/* Render the checkout sessions as clickable cards */}
          {groupedOrders.map((group) => {
            const totalAmount = group.items.reduce((sum: number, order: any) => sum + (order.totalPrice || 0), 0);
            
            return (
              <div 
                key={group.id}
                onClick={() => setSelectedGroupId(group.id)}
                className="group flex cursor-pointer items-center justify-between rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all active:scale-[0.98]"
              >
                <div className="flex items-center gap-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100 transition-colors">
                    <ShoppingBag className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-zinc-900">{group.title}</h2>
                    <p className="mt-0.5 text-sm font-medium text-zinc-500">
                      {group.items.length} item{group.items.length !== 1 ? "s" : ""} · <span className="text-emerald-700">{formatCurrency(totalAmount)}</span>
                    </p>
                  </div>
                </div>
                <div className="grid h-8 w-8 place-items-center rounded-full bg-zinc-50 text-zinc-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}