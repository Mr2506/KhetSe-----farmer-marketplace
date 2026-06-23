"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";

import { updateFarmerProfileAction } from "@/lib/actions";

type Props = {
  defaultValues: {
    name: string;
    phone: string;
    farmSize: string;
    village: string;
    cropsGrown: string[];
    verification: string;
    notifyNewOrders: boolean;
    notifyLowStock: boolean;
    notifySms: boolean;
  };
};

export function FarmerProfileForm({ defaultValues }: Props) {
  const [form, setForm] = useState(defaultValues);
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await updateFarmerProfileAction({
        name: form.name,
        farmSize: form.farmSize,
        village: form.village,
        cropsGrown: form.cropsGrown,
        notifyNewOrders: form.notifyNewOrders,
        notifyLowStock: form.notifyLowStock,
        notifySms: form.notifySms,
      });
      toast.success("Profile updated");
    } finally {
      setLoading(false);
    }
  }

  const verificationBadge =
    form.verification === "Verified" ? "bg-emerald-50 text-emerald-700" :
    form.verification === "Rejected" ? "bg-red-50 text-red-700" :
    "bg-amber-50 text-amber-700";

  return (
    <form onSubmit={submit} className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">Verification</p>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${verificationBadge}`}>{form.verification}</span>
      </div>

      <label className="block space-y-1">
        <span className="text-sm font-medium">Name</span>
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-xl border px-3 py-2 text-sm" />
      </label>
      <label className="block space-y-1">
        <span className="text-sm font-medium">Phone</span>
        <input value={form.phone} disabled className="w-full rounded-xl border bg-zinc-50 px-3 py-2 text-sm text-zinc-500" />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="block space-y-1">
          <span className="text-sm font-medium">Farm size</span>
          <input value={form.farmSize} onChange={(e) => setForm({ ...form, farmSize: e.target.value })} className="w-full rounded-xl border px-3 py-2 text-sm" />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium">Village</span>
          <input value={form.village} onChange={(e) => setForm({ ...form, village: e.target.value })} className="w-full rounded-xl border px-3 py-2 text-sm" />
        </label>
      </div>
      <label className="block space-y-1">
        <span className="text-sm font-medium">Crops grown (comma-separated)</span>
        <input
          value={form.cropsGrown.join(", ")}
          onChange={(e) => setForm({ ...form, cropsGrown: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
          className="w-full rounded-xl border px-3 py-2 text-sm"
        />
      </label>
      <button type="submit" disabled={loading} className="h-11 w-full rounded-xl bg-emerald-600 text-sm font-semibold text-white">
        Save profile
      </button>
    </form>
  );
}
