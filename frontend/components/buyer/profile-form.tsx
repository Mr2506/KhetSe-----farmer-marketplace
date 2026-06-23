"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";

import { updateBuyerProfileAction } from "@/lib/actions";

type Props = {
  defaultValues: {
    name: string;
    phone: string;
    buyerType: "HOUSEHOLD" | "RESTAURANT" | "SHOP";
    addresses: string[];
    notifyNewOrders: boolean;
    notifyLowStock: boolean;
    notifySms: boolean;
  };
};

export function BuyerProfileForm({ defaultValues }: Props) {
  const [form, setForm] = useState(defaultValues);
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await updateBuyerProfileAction({
        name: form.name,
        buyerType: form.buyerType,
        addresses: form.addresses.filter(Boolean),
        notifyNewOrders: form.notifyNewOrders,
        notifyLowStock: form.notifyLowStock,
        notifySms: form.notifySms,
      });
      toast.success("Profile updated");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-5">
      <label className="block space-y-1">
        <span className="text-sm font-medium">Name</span>
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-xl border px-3 py-2 text-sm" />
      </label>
      <label className="block space-y-1">
        <span className="text-sm font-medium">Phone</span>
        <input value={form.phone} disabled className="w-full rounded-xl border bg-zinc-50 px-3 py-2 text-sm text-zinc-500" />
      </label>
      <label className="block space-y-1">
        <span className="text-sm font-medium">Buyer type</span>
        <select value={form.buyerType} onChange={(e) => setForm({ ...form, buyerType: e.target.value as typeof form.buyerType })} className="w-full rounded-xl border px-3 py-2 text-sm">
          <option value="HOUSEHOLD">Household</option>
          <option value="RESTAURANT">Restaurant</option>
          <option value="SHOP">Shop</option>
        </select>
      </label>
      <label className="block space-y-1">
        <span className="text-sm font-medium">Address</span>
        <textarea
          value={form.addresses[0] ?? ""}
          onChange={(e) => setForm({ ...form, addresses: [e.target.value] })}
          rows={2}
          className="w-full rounded-xl border px-3 py-2 text-sm"
        />
      </label>
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">Notifications</legend>
        {[
          ["notifyNewOrders", "New order updates"],
          ["notifyLowStock", "Low stock alerts"],
          ["notifySms", "SMS notifications"],
        ].map(([key, label]) => (
          <label key={key} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form[key as keyof typeof form] as boolean}
              onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
            />
            {label}
          </label>
        ))}
      </fieldset>
      <button type="submit" disabled={loading} className="h-11 w-full rounded-xl bg-emerald-600 text-sm font-semibold text-white">
        Save profile
      </button>
    </form>
  );
}
