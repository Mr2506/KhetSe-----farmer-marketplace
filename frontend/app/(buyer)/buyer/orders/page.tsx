"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, ArrowRight, ArrowLeft, AlertCircle, ChevronRight, ShoppingBag, Star, X, MessageSquare, Loader2 } from "lucide-react";
import { BuyerOrderCard } from "@/components/buyer/order-card";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

export default function BuyerOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Track the specific Cart Session ID the user clicked on
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  // --- NEW: RATING MODAL STATES ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduce, setSelectedProduce] = useState<{ id: string; name: string } | null>(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("khetse_token");
        if (!token) {
          setError("Please log in to view your orders.");
          setLoading(false);
          return;
        }
        const response = await fetch("https://khetse-backend.onrender.com/api/orders/myorders", {
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

  // --- NEW: RATING FUNCTIONS ---
  const openReviewModal = (produceId: string, cropName: string) => {
    setSelectedProduce({ id: produceId, name: cropName });
    setRating(0);
    setHoverRating(0);
    setComment("");
    setIsModalOpen(true);
  };

  const submitReview = async () => {
    if (rating === 0) {
      toast.error("Please select a star rating!");
      return;
    }

    const token = localStorage.getItem("khetse_token");
    setSubmittingReview(true);

    try {
      const res = await fetch(`https://khetse-backend.onrender.com/api/produce/${selectedProduce?.id}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ rating, comment }),
      });

      if (res.ok) {
        toast.success(`You rated ${selectedProduce?.name} ${rating} stars!`);
        setIsModalOpen(false);
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Failed to submit review");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setSubmittingReview(false);
    }
  };

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
  const groupedOrders = orders.reduce((acc: any[], order: any) => {
    const orderTime = new Date(order.createdAt).getTime();
    const existingGroup = acc.find(g => Math.abs(g.timestamp - orderTime) < 10000); 
    
    if (existingGroup) {
      existingGroup.items.push(order);
    } else {
      const timeStr = new Date(order.createdAt).toLocaleString("en-US", { 
        day: "numeric", month: "short", year: "numeric", 
        hour: "numeric", minute: "2-digit" 
      });
      acc.push({ 
        id: order._id, 
        title: timeStr, 
        timestamp: orderTime, 
        items: [order] 
      });
    }
    return acc;
  }, []);

  return (
    <div className="space-y-7 animate-in fade-in duration-300">
      
      {/* ==========================================
          VIEW 2: DETAILED VIEW (When a session is clicked)
          ========================================== */}
      {selectedGroupId ? (
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
            <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl tracking-tight">
              {groupedOrders.find(g => g.id === selectedGroupId)?.title}
            </h1>
            <p className="mt-1 text-sm font-medium text-zinc-500">
              {groupedOrders.find(g => g.id === selectedGroupId)?.items.length} items · Total: <span className="text-emerald-700">{formatCurrency(groupedOrders.find(g => g.id === selectedGroupId)?.items.reduce((sum: number, order: any) => sum + (order.totalPrice || 0), 0))}</span>
            </p>
          </div>

          <div className="space-y-4">
            {groupedOrders.find(g => g.id === selectedGroupId)?.items.map((order: any) => (
              <div key={order._id} className="relative">
                <BuyerOrderCard order={order} onRate={openReviewModal} />
                {/* INJECTED: The Rate Button right under the card */}
                {order.items?.map((item: any, idx: number) => (
                   <button
                     key={idx}
                     onClick={() => openReviewModal(item.produceId, item.cropName)}
                     className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-600 shadow-sm hover:border-amber-300 hover:text-amber-600 hover:bg-amber-50 transition-colors ml-4"
                   >
                     <Star className="h-3.5 w-3.5" />
                     Rate {item.cropName || "this Crop"}
                   </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : (
        
        /* ==========================================
           VIEW 1: MAIN LIST VIEW
           ========================================== */
        <>
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
            <div className="flex flex-col gap-3">
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
        </>
      )}

      {/* ==========================================
          THE 5-STAR RATING MODAL (INJECTED)
          ========================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            
            <div className="px-6 py-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50">
              <h3 className="font-bold text-zinc-900 text-lg">Rate your purchase</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-zinc-400 hover:text-zinc-800 hover:bg-zinc-200 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 flex flex-col items-center">
              <p className="text-sm font-medium text-zinc-500 mb-1">How was the quality of</p>
              <h4 className="text-xl font-bold text-zinc-900 mb-6">{selectedProduce?.name}?</h4>

              <div className="flex gap-2 mb-6" onMouseLeave={() => setHoverRating(0)}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    className="transition-transform hover:scale-110 active:scale-90 focus:outline-none"
                  >
                    <Star
                      className={`h-10 w-10 transition-colors duration-150 ${
                        star <= (hoverRating || rating)
                          ? "fill-amber-400 text-amber-400"
                          : "fill-zinc-100 text-zinc-200"
                      }`}
                    />
                  </button>
                ))}
              </div>

              <div className="w-full space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
                  <MessageSquare className="h-3 w-3" />
                  Leave a comment (Optional)
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell others what you loved about this produce..."
                  className="w-full resize-none rounded-xl border border-zinc-300 p-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  rows={3}
                />
              </div>

              <button
                onClick={submitReview}
                disabled={submittingReview}
                className="mt-6 w-full rounded-xl bg-zinc-900 py-3.5 text-sm font-bold text-white shadow-md hover:bg-zinc-800 active:scale-[0.98] transition-all disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {submittingReview ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit Review"}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}