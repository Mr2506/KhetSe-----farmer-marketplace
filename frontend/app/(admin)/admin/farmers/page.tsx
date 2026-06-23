import { VerifyFarmerButton } from "@/components/admin/verify-farmer-button";
import { getAllFarmers } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

export default async function AdminFarmersPage() {
  const farmers = await getAllFarmers();
  const pending = farmers.filter((f: any) => f.verification === "Pending");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Farmers</h1>
        <p className="text-sm text-zinc-500">{farmers.length} registered · {pending.length} pending verification</p>
      </div>

      {pending.length > 0 && (
        <section className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4">
          <h2 className="text-sm font-bold uppercase tracking-wide text-amber-800">Verification queue</h2>
          <div className="mt-3 space-y-2">
            {pending.map((f) => (
              <div key={f.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white p-3">
                <div>
                  <p className="font-bold">{f.name}</p>
                  <p className="text-xs text-zinc-500">{(f as any).village} · Aadhaar {(f as any).aadhaarUploaded ? "uploaded" : "missing"}</p>
                </div>
                <VerifyFarmerButton userId={f.id} />
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="space-y-3">
        {farmers.map((farmer: any) => {
          const sold = farmer.ordersAsFarmer?.filter((o: any) => o.status === "Delivered").length ?? 0;
          const revenue = farmer.ordersAsFarmer?.reduce((s: any, o: any) => s + o.grandTotal, 0) ?? 0;
          return (
            <div key={farmer.id} className="rounded-2xl border border-zinc-200 bg-white p-4">
              <div className="flex flex-wrap justify-between gap-2">
                <div>
                  <p className="font-bold">{farmer.name}</p>
                  <p className="text-sm text-zinc-500">{farmer.village} · {farmer.farmSize} · {farmer.verification}</p>
                </div>
                <p className="text-sm font-bold">{formatCurrency(revenue)} revenue</p>
              </div>
              <p className="mt-2 text-xs text-zinc-500">
                {farmer.listings?.length ?? 0} listings · {sold} orders delivered · crops: {farmer.cropsGrown?.join(", ") ?? ""}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
