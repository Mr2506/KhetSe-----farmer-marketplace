"use client";

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

const cropData = [
  { crop: "Tomatoes", volume: 420 },
  { crop: "Okra", volume: 280 },
  { crop: "Rice", volume: 190 },
  { crop: "Spinach", volume: 150 },
  { crop: "Carrots", volume: 120 },
];

const regionData = [
  { region: "Surat", revenue: 125000 },
  { region: "Olpad", revenue: 89000 },
  { region: "Sachin", revenue: 67000 },
  { region: "Kamrej", revenue: 45000 },
];

const growthData = [
  { month: "Jan", buyers: 120, farmers: 45 },
  { month: "Feb", buyers: 145, farmers: 52 },
  { month: "Mar", buyers: 168, farmers: 58 },
  { month: "Apr", buyers: 190, farmers: 64 },
  { month: "May", buyers: 215, farmers: 71 },
  { month: "Jun", buyers: 240, farmers: 78 },
];

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-sm text-zinc-500">Platform-wide buy/sell activity and trends</p>
      </div>

      <section className="rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-sm font-bold text-zinc-700">Most traded crops</h2>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={cropData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="crop" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="volume" fill="#16a34a" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-sm font-bold text-zinc-700">Revenue by region</h2>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={regionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="region" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v: number) => `₹${v.toLocaleString("en-IN")}`} />
              <Bar dataKey="revenue" fill="#d97706" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-sm font-bold text-zinc-700">Farmer vs buyer growth</h2>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="buyers" stroke="#16a34a" strokeWidth={2} />
              <Line type="monotone" dataKey="farmers" stroke="#d97706" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
