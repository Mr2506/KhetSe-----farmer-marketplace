import Link from "next/link";

import { BuyerOrderCard } from "@/components/buyer/order-card";
import { getBuyerOrders } from "@/lib/data";

export default async function BuyerOrdersPage() {
  const orders = await getBuyerOrders();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My orders</h1>
        <p className="text-sm text-zinc-500">{orders.length} orders · live status tracking</p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <BuyerOrderCard key={order.id} order={order} />
        ))}
      </div>

      {orders.length === 0 && (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-10 text-center">
          <p className="text-zinc-600">No orders yet</p>
          <Link href="/buyer/browse" className="mt-2 inline-block text-sm font-semibold text-emerald-700">
            Start shopping
          </Link>
        </div>
      )}
    </div>
  );
}
