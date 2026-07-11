"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { User, Phone, Sprout, MapPin, Bell, Save, ShieldCheck, ShieldAlert, ShieldQuestion } from "lucide-react";

type Props = {
  defaultValues: {
    firstName: string;
    lastName: string;
    phone: string;
    farmSize: string;
    farmVillageName: string;
    farmAddress: string; // <-- NEW: Added address field
    cropsGrown: string[];
    verification: string;
    notifyNewOrders: boolean;
    notifyLowStock: boolean;
    notifySms: boolean;
  };
};

const VERIFICATION_CONFIG: Record<string, { icon: React.ReactNode; className: string; label: string; desc: string }> = {
  Verified:  { icon: <ShieldCheck className="h-4 w-4" />, className: "bg-emerald-50 text-emerald-700 border-emerald-200", label: "Verified Farmer", desc: "Your account is approved to sell on KhetSe." },
  Rejected:  { icon: <ShieldAlert className="h-4 w-4" />, className: "bg-red-50 text-red-700 border-red-200",             label: "Verification Rejected", desc: "Please contact support for assistance." },
  Pending:   { icon: <ShieldQuestion className="h-4 w-4" />, className: "bg-amber-50 text-amber-700 border-amber-200",   label: "Verification Pending", desc: "Our team is reviewing your documents." },
};

export function FarmerProfileForm({ defaultValues }: Props) {
  const [form, setForm] = useState(defaultValues);
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem("khetse_token");
      if (!token) throw new Error("Not authenticated");

      const res = await fetch("http://localhost:5000/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          farmSize: form.farmSize,
          farmVillageName: form.farmVillageName,
          farmAddress: form.farmAddress, // <-- NEW: Sending to backend
          cropsGrown: form.cropsGrown,
          notifyNewOrders: form.notifyNewOrders,
          notifyLowStock: form.notifyLowStock,
          notifySms: form.notifySms
        })
      });

      if (!res.ok) throw new Error("Failed to update profile");

      toast.success("Profile updated successfully!");
      
      // Refresh to update header name instantly
      window.location.reload(); 
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const vConfig = VERIFICATION_CONFIG[form.verification] ?? VERIFICATION_CONFIG["Pending"];

  return (
    <form onSubmit={submit} className="space-y-6">
      {/* Verification badge */}
      <div className={`flex items-start gap-3 rounded-2xl border p-4 ${vConfig.className}`}>
        <div className="mt-0.5 shrink-0">{vConfig.icon}</div>
        <div>
          <p className="text-sm font-bold">{vConfig.label}</p>
          <p className="text-xs mt-0.5 opacity-80">{vConfig.desc}</p>
        </div>
      </div>

      {/* Personal Info */}
      <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
            <User className="h-4 w-4" />
          </div>
          <h3 className="text-sm font-bold text-zinc-800">Personal Information</h3>
        </div>
        
        <div className="space-y-4">
          {/* SIDE-BY-SIDE FIRST & LAST NAME */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">First Name</label>
              <input
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 focus:outline-none transition-all bg-zinc-50/50"
                placeholder="Ramesh"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Last Name</label>
              <input
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 focus:outline-none transition-all bg-zinc-50/50"
                placeholder="Patel"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
              <span className="flex items-center gap-1.5"><Phone className="h-3 w-3" /> Phone</span>
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

      {/* Farm Details */}
      <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-teal-50 text-teal-600">
            <Sprout className="h-4 w-4" />
          </div>
          <h3 className="text-sm font-bold text-zinc-800">Farm Information</h3>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Farm Size</label>
              <div className="flex rounded-xl overflow-hidden border border-zinc-200 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/15 transition-all bg-zinc-50/50">
                <input
                  value={form.farmSize.replace(/ acres?/g, "")}
                  onChange={(e) => setForm({ ...form, farmSize: e.target.value ? `${e.target.value} acres` : "" })}
                  placeholder="e.g. 5"
                  className="flex-1 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none bg-transparent"
                />
                <div className="flex items-center justify-center bg-zinc-100 border-l border-zinc-200 px-4 text-zinc-500 font-semibold text-sm shrink-0 select-none">
                  acres
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                Village
              </label>
              <input
                value={form.farmVillageName}
                onChange={(e) => setForm({ ...form, farmVillageName: e.target.value })}
                placeholder="Village name"
                className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 focus:outline-none transition-all bg-zinc-50/50"
              />
            </div>
          </div>

          {/* NEW: Full Address / Landmarks Textarea */}
          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
              <span className="flex items-center gap-1.5"><MapPin className="h-3 w-3" /> Full Address & Landmarks</span>
            </label>
            <textarea
              value={form.farmAddress}
              onChange={(e) => setForm({ ...form, farmAddress: e.target.value })}
              placeholder="e.g., Next to the primary school, behind the old banyan tree. Please call when reaching the main road."
              className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 focus:outline-none transition-all bg-zinc-50/50 resize-y min-h-[80px]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Crops Grown</label>
            <input
              value={form.cropsGrown.join(", ")}
              onChange={(e) =>
                setForm({ ...form, cropsGrown: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })
              }
              placeholder="e.g. Tomatoes, Potatoes, Wheat"
              className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 focus:outline-none transition-all bg-zinc-50/50"
            />
            <p className="mt-1.5 text-[11px] text-zinc-400">Separate multiple crops with commas</p>
          </div>
        </div>
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
            { key: "notifyNewOrders", label: "New order alerts", desc: "Get notified when a buyer places an order" },
            { key: "notifyLowStock",  label: "Low stock warnings", desc: "Alert when a listing quantity runs low" },
            { key: "notifySms",       label: "SMS notifications", desc: "Receive alerts via text message" },
          ].map(({ key, label, desc }) => (
            <label
              key={key}
              className={`flex items-center justify-between gap-4 rounded-xl border px-4 py-3.5 cursor-pointer select-none transition-all ${
                form[key as keyof typeof form] ? "border-emerald-200 bg-emerald-50/40" : "border-zinc-200 hover:border-zinc-300"
              }`}
            >
              <div>
                <p className="text-sm font-medium text-zinc-800">{label}</p>
                <p className="text-[11px] text-zinc-400 mt-0.5">{desc}</p>
              </div>
              <div className={`relative h-5 w-9 rounded-full transition-colors duration-200 shrink-0 ${form[key as keyof typeof form] ? "bg-emerald-500" : "bg-zinc-300"}`}>
                <div className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${form[key as keyof typeof form] ? "translate-x-4" : "translate-x-0"}`} />
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