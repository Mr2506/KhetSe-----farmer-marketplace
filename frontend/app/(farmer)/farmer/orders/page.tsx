import { FarmerOrderCard } from "@/components/farmer/order-card";
import { getFarmerOrders } from "@/lib/data";

export default async function FarmerOrdersPage() {
  const orders = await getFarmerOrders();

  const pending = orders.filter((o) => o.status === "Placed").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Incoming orders</h1>
        <p className="text-sm text-zinc-500">{orders.length} total · {pending} awaiting response</p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <FarmerOrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}
