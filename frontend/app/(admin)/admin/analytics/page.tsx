"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function AdminAnalyticsPage() {
  const [data, setData] = useState({
    cropData: [],
    regionData: [],
    growthData: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem("khetse_token");
        if (!token) return;

        const res = await fetch("http://localhost:5000/api/admin/analytics", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.ok) {
          setData(await res.json());
        }
      } catch (error) {
        console.error("Failed to fetch analytics", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center text-zinc-500">
        <Loader2 className="h-6 w-6 animate-spin mr-2 text-emerald-600" />
        Crunching platform data...
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-sm text-zinc-500">Platform-wide buy/sell activity and trends</p>
      </div>

      {/* 1. CROPS CHART */}
      <section className="rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-sm font-bold text-zinc-700">Most traded crops</h2>
        <div className="mt-4 h-64">
          {data.cropData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%" minHeight={250}>
              <BarChart data={data.cropData} margin={{ top: 10, right: 10, left: 10, bottom: 15 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="crop" 
                  tick={{ fontSize: 12 }} 
                  label={{ value: "Crop Name", position: "insideBottom", offset: -10, fill: "#71717a", fontSize: 12 }} 
                />
                <YAxis 
                  tick={{ fontSize: 12 }} 
                  label={{ value: "Quantity Sold", angle: -90, position: "insideLeft", fill: "#71717a", fontSize: 12, style: { textAnchor: 'middle' } }} 
                />
                <Tooltip />
                <Bar dataKey="volume" fill="#16a34a" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-zinc-400 text-sm">Not enough order data yet.</div>
          )}
        </div>
      </section>

      {/* 2. REGION CHART */}
      <section className="rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-sm font-bold text-zinc-700">Revenue by region</h2>
        <div className="mt-4 h-64">
          {data.regionData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%" minHeight={250}>
              <BarChart data={data.regionData} margin={{ top: 10, right: 10, left: 15, bottom: 15 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="region" 
                  tick={{ fontSize: 12 }} 
                  label={{ value: "Village / Region", position: "insideBottom", offset: -10, fill: "#71717a", fontSize: 12 }} 
                />
                <YAxis 
                  tick={{ fontSize: 12 }} 
                  label={{ value: "Revenue (₹)", angle: -90, position: "insideLeft", fill: "#71717a", fontSize: 12, style: { textAnchor: 'middle' } }} 
                />
                <Tooltip formatter={(v: number) => `₹${v.toLocaleString("en-IN")}`} />
                <Bar dataKey="revenue" fill="#d97706" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-zinc-400 text-sm">Not enough order data yet.</div>
          )}
        </div>
      </section>

      {/* 3. GROWTH CHART */}
      <section className="rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-sm font-bold text-zinc-700">Farmer vs buyer growth</h2>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%" minHeight={250}>
            <LineChart data={data.growthData} margin={{ top: 10, right: 10, left: 10, bottom: 15 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }} 
                label={{ value: "Month (Last 6 Months)", position: "insideBottom", offset: -10, fill: "#71717a", fontSize: 12 }} 
              />
              <YAxis 
                tick={{ fontSize: 12 }} 
                label={{ value: "Number of Users", angle: -90, position: "insideLeft", fill: "#71717a", fontSize: 12, style: { textAnchor: 'middle' } }} 
              />
              <Tooltip />
              <Line type="monotone" dataKey="buyers" stroke="#16a34a" strokeWidth={2} name="Buyers" />
              <Line type="monotone" dataKey="farmers" stroke="#d97706" strokeWidth={2} name="Farmers" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}