"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, ArrowRight } from "lucide-react";
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
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();
        
        // Sort orders by newest first
        const sortedData = data.sort((a: any, b: any) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        setOrders(sortedData);
      } catch (err: any) {
        console.error(err);
        setError("Could not load your orders at this time.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl">My Orders</h1>
          <p className="mt-1 text-sm text-zinc-500">Track your recent purchases</p>
        </div>
        <div className="h-40 animate-pulse rounded-2xl border border-zinc-100 bg-white shadow-sm" />
        <div className="h-40 animate-pulse rounded-2xl border border-zinc-100 bg-white shadow-sm" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-700">
        <p className="font-bold">{error}</p>
        <Link href="/login" className="mt-4 inline-block font-semibold underline">Go to Login</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl">My Orders</h1>
        <p className="mt-1 text-sm text-zinc-500">{orders.length} orders · live status tracking</p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-zinc-300 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <Package className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900">No orders yet</h3>
          <p className="mt-2 text-sm text-zinc-500">Looks like you haven't bought any fresh produce yet.</p>
          <Link
            href="/buyer/browse"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-500"
          >
            Start browsing <ArrowRight className="h-4 w-4" />
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