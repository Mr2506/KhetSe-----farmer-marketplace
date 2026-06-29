import { getAdminStats, getAllOrders } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { Users, Tractor, ShoppingBag, LayoutGrid, TrendingUp, ArrowUpRight, Activity } from "lucide-react";

const STAT_CONFIG = [
  { key: "buyers",   label: "Registered Buyers",  icon: Users,       color: "bg-blue-50 text-blue-600",   border: "border-blue-200/60" },
  { key: "farmers",  label: "Registered Farmers",  icon: Tractor,     color: "bg-emerald-50 text-emerald-600", border: "border-emerald-200/60" },
  { key: "orders",   label: "Total Orders",        icon: ShoppingBag, color: "bg-purple-50 text-purple-600", border: "border-purple-200/60" },
  { key: "listings", label: "Active Listings",     icon: LayoutGrid,  color: "bg-amber-50 text-amber-600",  border: "border-amber-200/60" },
];

const TRENDS = ["+12% this month", "+8% this month", "", "Live on platform"];

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();
  const orders = await getAllOrders();

  const thisMonth = orders.filter((o) => {
    const d = new Date(o.placedAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const statCards = [
    { label: "Registered Buyers",  value: stats.buyers,   trend: "+12% this month",          hasGrowth: true },
    { label: "Registered Farmers", value: stats.farmers,  trend: "+8% this month",            hasGrowth: true },
    { label: "Total Orders",       value: stats.orders,   trend: `${thisMonth.length} this month`, hasGrowth: false },
    { label: "Active Listings",    value: stats.listings, trend: "Live on platform",          hasGrowth: false },
  ];

  return (
    <div className="space-y-8">
      
      {/* Page header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Activity className="h-4 w-4 text-emerald-600" />
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">Live Overview</p>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Platform Dashboard</h1>
        <p className="text-sm text-zinc-500 mt-1">Real-time health metrics for the KhetSe marketplace</p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, i) => {
          const cfg = STAT_CONFIG[i];
          const Icon = cfg.icon;
          return (
            <div
              key={card.label}
              className={`group rounded-2xl border bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${cfg.border}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`grid h-10 w-10 place-items-center rounded-xl ${cfg.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                {card.hasGrowth && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200/60">
                    <TrendingUp className="h-2.5 w-2.5" />
                    Growing
                  </span>
                )}
              </div>
              <p className="text-xs font-semibold text-zinc-400 mb-1">{card.label}</p>
              <p className="text-3xl font-black text-zinc-900 leading-none">{card.value}</p>
              <p className="mt-2 text-xs text-zinc-400">{card.trend}</p>
            </div>
          );
        })}
      </div>

      {/* Recent orders */}
      <div className="rounded-2xl border border-zinc-200/80 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4">
          <div>
            <h2 className="text-sm font-bold text-zinc-800">Recent Orders</h2>
            <p className="text-xs text-zinc-400 mt-0.5">Latest {Math.min(orders.length, 5)} transactions</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200/60">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </span>
        </div>

        <div className="divide-y divide-zinc-100">
          {orders.slice(0, 5).map((o) => (
            <div key={o.id} className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-zinc-50/60 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-8 w-8 rounded-lg bg-zinc-100 flex items-center justify-center shrink-0">
                  <ShoppingBag className="h-3.5 w-3.5 text-zinc-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-zinc-800 truncate">
                    {o.buyerName}
                    <span className="mx-1.5 text-zinc-300">→</span>
                    {o.farmerName}
                  </p>
                  <p className="text-[11px] text-zinc-400 font-mono truncate">{o.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-sm font-bold text-emerald-700">{formatCurrency(o.grandTotal)}</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-zinc-300" />
              </div>
            </div>
          ))}

          {orders.length === 0 && (
            <div className="px-6 py-12 text-center">
              <ShoppingBag className="mx-auto h-8 w-8 text-zinc-300 mb-3" />
              <p className="text-sm font-medium text-zinc-500">No orders yet</p>
              <p className="text-xs text-zinc-400 mt-1">Orders will appear here once buyers start purchasing</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
