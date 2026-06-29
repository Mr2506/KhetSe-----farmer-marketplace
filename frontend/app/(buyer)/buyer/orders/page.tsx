"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, ArrowRight, AlertCircle } from "lucide-react";
import { BuyerOrderCard } from "@/components/buyer/order-card";

export default function BuyerOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        {[1, 2].map((i) => (
          <div key={i} className="h-40 animate-pulse rounded-2xl bg-white border border-zinc-200/80 shadow-sm" />
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

  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl tracking-tight">My Orders</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {orders.length} order{orders.length !== 1 ? "s" : ""} · live status tracking
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
            <Package className="h-8 w-8" />
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
        <div className="space-y-4">
          {orders.map((order) => (
            <BuyerOrderCard key={order._id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}