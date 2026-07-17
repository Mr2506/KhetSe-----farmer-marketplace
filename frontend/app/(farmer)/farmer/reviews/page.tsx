"use client";

import { useEffect, useState } from "react";
import { Star, MessageSquare, TrendingUp, Package, Loader2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

// Helper to capitalize names
function titleCase(str: string): string {
  if (!str) return "";
  return str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function FarmerReviewsPage() {
  const [crops, setCrops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyCrops = async () => {
      try {
        const token = localStorage.getItem("khetse_token");
        if (!token) return;

        // Fetching the farmer's own crops 
        // (Update this URL if your specific route for "my crops" is named differently)
        const response = await fetch("https://khetse-backend.onrender.com/api/produce/farmer/my-produce", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          console.log("MY CROPS FROM BACKEND:", data);
          setCrops(data);
        }
      } catch (error) {
        console.error("Failed to load crops:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyCrops();
  }, []);

  // ─── DATA AGGREGATION ENGINE ───
  // 1. Flatten all reviews from all crops into one single list
  const allReviews = crops.flatMap(crop => 
    (crop.reviews || []).map((review: any) => ({
      ...review,
      cropName: crop.name,
      cropPhoto: crop.photos?.[0] || "🌾"
    }))
  );

  // 2. Sort them newest first
  allReviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // 3. Calculate Dashboard Stats
  const totalReviews = allReviews.length;
  const averageRating = totalReviews > 0 
    ? allReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews 
    : 0;

  // Find best performing crop
  const bestCrop = [...crops].sort((a, b) => (b.rating || 0) - (a.rating || 0))[0];

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="space-y-7 animate-in fade-in duration-300 max-w-5xl mx-auto">
      
      {/* ── Page Header ── */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl tracking-tight">
          Customer Feedback
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          See what buyers are saying about your harvest.
        </p>
      </div>

      {/* ── Analytics Overview Cards ── */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-50 text-amber-500">
              <Star className="h-5 w-5 fill-amber-400" />
            </div>
            <p className="text-sm font-bold uppercase tracking-wider text-zinc-500">Overall Rating</p>
          </div>
          <p className="text-3xl font-extrabold text-zinc-900">
            {averageRating.toFixed(1)} <span className="text-base font-medium text-zinc-400">/ 5.0</span>
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-500">
              <MessageSquare className="h-5 w-5" />
            </div>
            <p className="text-sm font-bold uppercase tracking-wider text-zinc-500">Total Reviews</p>
          </div>
          <p className="text-3xl font-extrabold text-zinc-900">
            {totalReviews} <span className="text-base font-medium text-zinc-400">lifetime</span>
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-500">
              <TrendingUp className="h-5 w-5" />
            </div>
            <p className="text-sm font-bold uppercase tracking-wider text-zinc-500">Top Rated Crop</p>
          </div>
          <p className="text-xl font-bold text-zinc-900 truncate mt-1">
            {bestCrop?.rating > 0 ? titleCase(bestCrop.name) : "No ratings yet"}
          </p>
          {bestCrop?.rating > 0 && (
            <p className="text-sm font-medium text-amber-600 flex items-center gap-1 mt-1">
              <Star className="h-3.5 w-3.5 fill-amber-500" /> {bestCrop.rating.toFixed(1)} Average
            </p>
          )}
        </div>
      </div>

      {/* ── Review Feed ── */}
      <div className="rounded-2xl border border-zinc-200/80 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-zinc-100 bg-zinc-50/60 px-6 py-4">
          <h2 className="font-bold text-zinc-900">Recent Reviews</h2>
        </div>

        {allReviews.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-zinc-50 text-zinc-400">
              <MessageSquare className="h-6 w-6" />
            </div>
            <p className="font-bold text-zinc-900">No feedback yet</p>
            <p className="text-sm text-zinc-500 mt-1">When buyers review your crops, they will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {allReviews.map((review, idx) => {
              const isImage = typeof review.cropPhoto === 'string' && review.cropPhoto.startsWith("http");

              return (
                <div key={idx} className="p-6 sm:flex sm:gap-6 hover:bg-zinc-50/50 transition-colors">
                  
                  {/* Review Context (What crop they bought) */}
                  <div className="sm:w-48 shrink-0 mb-4 sm:mb-0">
                    <div className="flex items-center gap-3 bg-zinc-50 p-2.5 rounded-xl border border-zinc-100">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-emerald-50 text-xl border border-emerald-100/50 overflow-hidden">
                        {isImage ? (
                          <img src={review.cropPhoto} alt="" className="h-full w-full object-cover" />
                        ) : (
                          review.cropPhoto
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Reviewed</p>
                        <p className="text-sm font-bold text-zinc-900 truncate">{titleCase(review.cropName)}</p>
                      </div>
                    </div>
                  </div>

                  {/* The Actual Review */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-bold text-zinc-900">{titleCase(review.name || "Anonymous Buyer")}</p>
                        <p className="text-xs font-medium text-zinc-400">{formatDate(review.createdAt)}</p>
                      </div>
                      
                      <div className="flex items-center gap-0.5 bg-amber-50 px-2 py-1 rounded-full border border-amber-100">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-3.5 w-3.5 ${
                              star <= review.rating ? "fill-amber-400 text-amber-500" : "fill-zinc-200 text-zinc-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    
                    {review.comment ? (
                      <p className="text-sm text-zinc-700 leading-relaxed mt-2">"{review.comment}"</p>
                    ) : (
                      <p className="text-sm text-zinc-400 italic mt-2">Left a rating without a written comment.</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}