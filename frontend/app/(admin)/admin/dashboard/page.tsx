import { getAdminStats, getAllOrders } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();
  const orders = await getAllOrders();
  const thisMonth = orders.filter((o) => {
    const d = new Date(o.placedAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Platform dashboard</h1>
        <p className="text-sm text-zinc-500">Overview of KhetSe marketplace health</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Registered buyers", value: stats.buyers, trend: "+12% this month" },
          { label: "Registered farmers", value: stats.farmers, trend: "+8% this month" },
          { label: "Total orders", value: stats.orders, trend: `${thisMonth.length} this month` },
          { label: "Active listings", value: stats.listings, trend: "Live on platform" },
        ].map((card) => (
          <div key={card.label} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold text-zinc-500">{card.label}</p>
            <p className="mt-2 text-3xl font-bold text-zinc-900">{card.value}</p>
            <p className="mt-1 text-xs text-emerald-600">{card.trend}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-5">
        <p className="text-sm font-semibold">Recent activity</p>
        <ul className="mt-3 divide-y divide-zinc-100 text-sm">
          {orders.slice(0, 5).map((o) => (
            <li key={o.id} className="flex justify-between py-2">
              <span>{o.id} · {o.buyerName} → {o.farmerName}</span>
              <span className="font-medium text-emerald-700">{formatCurrency(o.grandTotal)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
