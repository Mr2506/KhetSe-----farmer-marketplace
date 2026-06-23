"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Leaf, Shield, ShoppingBag, Tractor } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppRole, ROLE_HOME } from "@/lib/roles";

const userButtons: Array<{
  role: AppRole;
  label: string;
  phone: string;
  icon: typeof ShoppingBag;
  className: string;
}> = [
  {
    role: "BUYER",
    label: "Buyer",
    phone: "9825012345",
    icon: ShoppingBag,
    className: "border-emerald-200 bg-emerald-50 text-emerald-950 hover:border-emerald-500",
  },
  {
    role: "FARMER",
    label: "Farmer",
    phone: "9825012345",
    icon: Tractor,
    className: "border-amber-200 bg-amber-50 text-amber-950 hover:border-amber-500",
  },
  {
    role: "ADMIN",
    label: "Admin",
    phone: "9000000000",
    icon: Shield,
    className: "border-zinc-300 bg-zinc-50 text-zinc-950 hover:border-zinc-600",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<AppRole | null>(null);

  async function openRole(role: AppRole, phone: string) {
    setLoading(role);
    try {
      router.push(ROLE_HOME[role]);
    } finally {
      setLoading(null);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7f4eb] text-zinc-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.16),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(217,119,6,0.12),_transparent_30%)]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-lg items-center px-4 py-8">
        <div className="w-full rounded-[2rem] border border-emerald-900/10 bg-white p-6 shadow-xl sm:p-8">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-600 text-white">
              <Leaf className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-semibold">KhetSe</p>
              <p className="text-sm text-zinc-500">Choose user</p>
            </div>
          </div>

          <div className="mt-8 space-y-5">
            <div>
              <h2 className="text-xl font-semibold">Open page</h2>
              <p className="mt-1 text-sm text-zinc-500">Select a user type to continue.</p>
            </div>

            <div className="grid gap-3">
              {userButtons.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.role}
                    type="button"
                    disabled={!!loading}
                    onClick={() => openRole(item.role, item.phone)}
                    className={`flex h-16 w-full items-center gap-4 rounded-2xl border px-4 text-left font-semibold transition-all disabled:opacity-60 ${item.className}`}
                  >
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-white shadow-sm">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span>{loading === item.role ? "Opening..." : item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <p className="mt-4 text-center text-sm text-zinc-500">
            <Link href="/" className="hover:text-zinc-800">
              Back to home
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
