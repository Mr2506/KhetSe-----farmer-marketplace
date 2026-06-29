import { VerifyFarmerButton } from "@/components/admin/verify-farmer-button";
import { getAllFarmers } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { Tractor, AlertCircle, CheckCircle2, XCircle, Clock, ShieldCheck, TrendingUp, Package } from "lucide-react";

const VERIFICATION_CONFIG: Record<string, { icon: React.ReactNode; className: string }> = {
  Verified: { icon: <CheckCircle2 className="h-3.5 w-3.5" />, className: "bg-emerald-50 text-emerald-700 border-emerald-200/80" },
  Rejected: { icon: <XCircle className="h-3.5 w-3.5" />,      className: "bg-red-50 text-red-700 border-red-200/80" },
  Pending:  { icon: <Clock className="h-3.5 w-3.5" />,         className: "bg-amber-50 text-amber-700 border-amber-200/80" },
};

export default async function AdminFarmersPage() {
  const farmers = await getAllFarmers();
  const pending = farmers.filter((f: any) => f.verification === "Pending");
  const verified = farmers.filter((f: any) => f.verification === "Verified");

  return (
    <div className="space-y-8">
      
      {/* Page header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Tractor className="h-4 w-4 text-emerald-600" />
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">Farmer Management</p>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Farmers</h1>
        <p className="text-sm text-zinc-500 mt-1">
          {farmers.length} registered · {verified.length} verified · {pending.length} awaiting review
        </p>
      </div>

      {/* Verification queue */}
      {pending.length > 0 && (
        <div className="rounded-2xl border border-amber-200/80 bg-amber-50/50 overflow-hidden">
          <div className="flex items-center gap-3 border-b border-amber-200/60 px-6 py-4">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-amber-100 text-amber-700">
              <AlertCircle className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-amber-900">Verification Queue</h2>
              <p className="text-xs text-amber-700/80 mt-0.5">{pending.length} farmer{pending.length > 1 ? "s" : ""} awaiting approval</p>
            </div>
          </div>
          <div className="divide-y divide-amber-100/80 p-4 space-y-2">
            {pending.map((f) => (
              <div
                key={f.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-white border border-amber-100/60 px-4 py-3.5 shadow-xs"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-zinc-900">{f.name}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {(f as any).village}
                    <span className="mx-1.5 text-zinc-300">·</span>
                    Aadhaar {(f as any).aadhaarUploaded ? (
                      <span className="text-emerald-600 font-medium">uploaded</span>
                    ) : (
                      <span className="text-red-500 font-medium">missing</span>
                    )}
                  </p>
                </div>
                <VerifyFarmerButton userId={f.id} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All farmers */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck className="h-4 w-4 text-zinc-400" />
          <h2 className="text-sm font-bold text-zinc-700">All Registered Farmers</h2>
        </div>
        <div className="space-y-3">
          {farmers.map((farmer: any) => {
            const sold = farmer.ordersAsFarmer?.filter((o: any) => o.status === "Delivered").length ?? 0;
            const revenue = farmer.ordersAsFarmer?.reduce((s: any, o: any) => s + o.grandTotal, 0) ?? 0;
            const vConfig = VERIFICATION_CONFIG[farmer.verification] ?? VERIFICATION_CONFIG["Pending"];

            return (
              <div
                key={farmer.id}
                className="group rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700 font-black text-base shrink-0">
                      {farmer.name?.charAt(0)?.toUpperCase() ?? "F"}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-bold text-zinc-900">{farmer.name}</h3>
                        <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-bold ${vConfig.className}`}>
                          {vConfig.icon}
                          {farmer.verification}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500">
                        {farmer.village}
                        {farmer.farmSize && <span> · {farmer.farmSize}</span>}
                      </p>
                      {farmer.cropsGrown?.length > 0 && (
                        <p className="text-xs text-zinc-400 mt-1 truncate max-w-xs">
                          Grows: {farmer.cropsGrown.join(", ")}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-6 shrink-0">
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm font-bold text-emerald-700">
                        <TrendingUp className="h-3.5 w-3.5" />
                        {formatCurrency(revenue)}
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5">Revenue</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm font-bold text-zinc-700">
                        <Package className="h-3.5 w-3.5 text-zinc-400" />
                        {sold}
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5">Delivered</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-zinc-700">{farmer.listings?.length ?? 0}</p>
                      <p className="text-[11px] text-zinc-400 mt-0.5">Listings</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {farmers.length === 0 && (
            <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-12 text-center">
              <Tractor className="mx-auto h-8 w-8 text-zinc-300 mb-3" />
              <p className="text-sm font-medium text-zinc-500">No farmers registered yet</p>
              <p className="text-xs text-zinc-400 mt-1">Farmer registrations will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
