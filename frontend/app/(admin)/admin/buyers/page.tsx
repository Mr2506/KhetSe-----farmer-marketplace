import { getAllBuyers } from "@/lib/data";
import { formatBuyerType } from "@/lib/roles";
import { formatCurrency } from "@/lib/utils";

export default async function AdminBuyersPage() {
  const buyers = await getAllBuyers();

  const breakdown = {
    HOUSEHOLD: buyers.filter((b: any) => b.buyerType === "Household").length,
    RESTAURANT: buyers.filter((b: any) => b.buyerType === "Restaurant").length,
    SHOP: buyers.filter((b: any) => b.buyerType === "Shop").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Buyers</h1>
        <p className="text-sm text-zinc-500">{buyers.length} registered customers</p>
      </div>

      <div className="flex flex-wrap gap-3">
        {Object.entries(breakdown).map(([type, count]) => (
          <div key={type} className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm">
            <span className="font-bold">{formatBuyerType(type)}</span>: {count}
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {buyers.map((buyer: any) => {
          const spent = buyer.ordersAsBuyer?.reduce((s: any, o: any) => s + o.grandTotal, 0) ?? 0;
          return (
            <div key={buyer.id} className="rounded-2xl border border-zinc-200 bg-white p-4">
              <div className="flex flex-wrap justify-between gap-2">
                <div>
                  <p className="font-bold">{buyer.name}</p>
                  <p className="text-sm text-zinc-500">{buyer.phone} · {formatBuyerType(buyer.buyerType ?? "Household")}</p>
                </div>
                <p className="text-sm font-bold text-emerald-700">{formatCurrency(spent)} spent</p>
              </div>
              <p className="mt-2 text-xs text-zinc-500">
                {buyer.ordersAsBuyer?.length ?? 0} orders · last: {buyer.ordersAsBuyer?.[0]?.orderNumber ?? "—"}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
