import { getAllOrders } from "@/lib/data";
import { formatOrderStatus } from "@/lib/roles";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function AdminOrdersPage() {
  const orders = await getAllOrders();
  const cancelled = orders.filter((o) => o.status === "Cancelled").length;
  const cancelRate = orders.length ? Math.round((cancelled / orders.length) * 100) : 0;
  const disputed = orders.filter((o: any) => o.dispute).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">All orders</h1>
        <p className="text-sm text-zinc-500">
          {orders.length} platform-wide · {cancelRate}% cancellation · {disputed} disputes
        </p>
      </div>

      <div className="space-y-3">
        {orders.map((order: any) => (
          <div key={order.id} className="rounded-2xl border border-zinc-200 bg-white p-4">
            <div className="flex flex-wrap justify-between gap-2">
              <div>
                <p className="font-bold">{order.id}</p>
                <p className="text-sm text-zinc-500">{order.buyerName} → {order.farmerName}</p>
              </div>
              <div className="text-right">
                <span className="rounded-lg bg-zinc-100 px-2 py-1 text-xs font-bold">{formatOrderStatus(order.status)}</span>
                {order.dispute && <span className="ml-2 rounded-lg bg-red-50 px-2 py-1 text-xs font-bold text-red-700">Dispute</span>}
              </div>
            </div>
            <p className="mt-2 text-sm text-zinc-600">
              {order.items.map((i) => i.cropName).join(", ")} · {formatCurrency(order.grandTotal)} · {formatDate(order.placedAt)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
