import { FarmerOrderCard } from "@/components/farmer/order-card";
import { getFarmerOrders } from "@/lib/data";
import { Package, Clock, AlertCircle } from "lucide-react";

export default async function FarmerOrdersPage() {
  const orders = await getFarmerOrders();

  const pending   = orders.filter((o) => o.status === "Placed").length;
  const active    = orders.filter((o) => !["Placed", "Delivered", "Cancelled"].includes(o.status)).length;
  const completed = orders.filter((o) => o.status === "Delivered").length;

  return (
    <div className="space-y-7">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl tracking-tight">Incoming Orders</h1>
        <p className="mt-1 text-sm text-zinc-500">
          {orders.length} total · {pending} awaiting response · {completed} delivered
        </p>
      </div>

      {/* Pending alert banner */}
      {pending > 0 && (
        <div className="flex items-center gap-3 rounded-2xl border border-amber-200/80 bg-amber-50 px-5 py-4">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-700">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-amber-900">
              {pending} new order{pending > 1 ? "s" : ""} need{pending === 1 ? "s" : ""} your response
            </p>
            <p className="text-xs text-amber-700/80 mt-0.5">Accept or decline them quickly to keep your response rate high.</p>
          </div>
        </div>
      )}

      {/* Stat strip */}
      {orders.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Awaiting", count: pending,   color: "bg-amber-50 text-amber-700 border-amber-200/60" },
            { label: "In Progress", count: active,  color: "bg-blue-50 text-blue-700 border-blue-200/60" },
            { label: "Delivered", count: completed, color: "bg-emerald-50 text-emerald-700 border-emerald-200/60" },
          ].map(({ label, count, color }) => (
            <div key={label} className={`rounded-xl border px-4 py-3 text-center ${color}`}>
              <p className="text-xl font-black">{count}</p>
              <p className="text-xs font-semibold mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Orders */}
      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <FarmerOrderCard key={order.id} order={order} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-16 text-center shadow-sm">
          <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-zinc-100 text-zinc-400">
            <Package className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900">No orders yet</h3>
          <p className="mt-2 text-sm text-zinc-500 max-w-sm mx-auto leading-relaxed">
            Orders will appear here when buyers purchase from your listings. Make sure your listings are live!
          </p>
        </div>
      )}
    </div>
  );
}
