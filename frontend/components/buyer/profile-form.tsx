"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { User, Phone, MapPin, Bell, Save, ShoppingBag } from "lucide-react";

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

const BUYER_TYPE_OPTIONS = [
  { value: "HOUSEHOLD", label: "Household", description: "Personal family use" },
  { value: "RESTAURANT", label: "Restaurant", description: "Commercial kitchen" },
  { value: "SHOP", label: "Shop", description: "Retail reseller" },
];

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
      toast.success("Profile updated successfully");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      {/* Personal Info */}
      <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
            <User className="h-4 w-4" />
          </div>
          <h3 className="text-sm font-bold text-zinc-800">Personal Information</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Full Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 focus:outline-none transition-all bg-zinc-50/50"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Phone className="h-3 w-3" /> Phone
            </label>
            <input
              value={form.phone}
              disabled
              className="w-full rounded-xl border border-zinc-200 bg-zinc-100 px-4 py-3 text-sm text-zinc-400 cursor-not-allowed"
            />
            <p className="mt-1.5 text-[11px] text-zinc-400">Phone number cannot be changed</p>
          </div>
        </div>
      </div>

      {/* Buyer Type */}
      <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-blue-50 text-blue-600">
            <ShoppingBag className="h-4 w-4" />
          </div>
          <h3 className="text-sm font-bold text-zinc-800">Buyer Type</h3>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {BUYER_TYPE_OPTIONS.map(({ value, label, description }) => (
            <button
              key={value}
              type="button"
              onClick={() => setForm({ ...form, buyerType: value as Props["defaultValues"]["buyerType"] })}
              className={`rounded-xl border-2 p-3.5 text-left transition-all duration-200 ${
                form.buyerType === value
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-zinc-200 hover:border-zinc-300"
              }`}
            >
              <p className={`text-sm font-bold ${form.buyerType === value ? "text-emerald-800" : "text-zinc-700"}`}>
                {label}
              </p>
              <p className={`text-[11px] mt-0.5 ${form.buyerType === value ? "text-emerald-600" : "text-zinc-400"}`}>
                {description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Address */}
      <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-amber-50 text-amber-600">
            <MapPin className="h-4 w-4" />
          </div>
          <h3 className="text-sm font-bold text-zinc-800">Delivery Address</h3>
        </div>
        <textarea
          value={form.addresses[0] ?? ""}
          onChange={(e) => setForm({ ...form, addresses: [e.target.value] })}
          rows={3}
          placeholder="Enter your full delivery address..."
          className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 focus:outline-none transition-all bg-zinc-50/50 resize-none"
        />
      </div>

      {/* Notifications */}
      <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-purple-50 text-purple-600">
            <Bell className="h-4 w-4" />
          </div>
          <h3 className="text-sm font-bold text-zinc-800">Notification Preferences</h3>
        </div>

        <div className="space-y-3">
          {[
            { key: "notifyNewOrders", label: "New order updates", desc: "Get notified when your order status changes" },
            { key: "notifyLowStock", label: "Low stock alerts", desc: "Be warned when items in your wishlist run low" },
            { key: "notifySms", label: "SMS notifications", desc: "Receive updates via text message" },
          ].map(({ key, label, desc }) => (
            <label
              key={key}
              className={`flex items-center justify-between gap-4 rounded-xl border px-4 py-3.5 cursor-pointer select-none transition-all ${
                form[key as keyof typeof form]
                  ? "border-emerald-200 bg-emerald-50/40"
                  : "border-zinc-200 hover:border-zinc-300"
              }`}
            >
              <div>
                <p className="text-sm font-medium text-zinc-800">{label}</p>
                <p className="text-[11px] text-zinc-400 mt-0.5">{desc}</p>
              </div>
              <div
                className={`relative h-5 w-9 rounded-full transition-colors duration-200 shrink-0 ${
                  form[key as keyof typeof form] ? "bg-emerald-500" : "bg-zinc-300"
                }`}
              >
                <div
                  className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                    form[key as keyof typeof form] ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </div>
              <input
                type="checkbox"
                checked={form[key as keyof typeof form] as boolean}
                onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
                className="sr-only"
              />
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="group w-full flex items-center justify-center gap-2.5 h-12 rounded-xl bg-emerald-600 text-sm font-semibold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-500 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        <Save className="h-4 w-4" />
        {loading ? "Saving..." : "Save Profile"}
      </button>
    </form>
  );
}
