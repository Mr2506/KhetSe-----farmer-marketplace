"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Leaf, Shield, ShoppingBag, Tractor } from "lucide-react";
import { useState } from "react";

import { AppRole, ROLE_HOME, ROLE_LABELS } from "@/lib/roles";

const roleMeta: Record<
  AppRole,
  { icon: typeof ShoppingBag; description: string; accent: string }
> = {
  BUYER: {
    icon: ShoppingBag,
    description: "Browse produce, manage cart, track deliveries",
    accent: "border-emerald-200 bg-emerald-50 hover:border-emerald-400",
  },
  FARMER: {
    icon: Tractor,
    description: "Manage listings, fulfill orders, view earnings",
    accent: "border-amber-200 bg-amber-50 hover:border-amber-400",
  },
  ADMIN: {
    icon: Shield,
    description: "Platform dashboard, verification, analytics",
    accent: "border-zinc-300 bg-zinc-50 hover:border-zinc-500",
  },
};

export default function RoleSelectPage() {
  const sessionContext = useSession();
  const session = sessionContext?.data;  const router = useRouter();
  const [loading, setLoading] = useState<AppRole | null>(null);

  const roles = (session?.user as any)?.roles ?? [];

  async function pickRole(role: AppRole) {
    setLoading(role);
    await fetch("/api/role/switch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    router.push(ROLE_HOME[role]);
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f6f4ef] px-4 py-12">
      <div className="w-full max-w-lg rounded-3xl border border-zinc-200 bg-white p-8 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-600 text-white">
            <Leaf className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Choose your view</h1>
            <p className="text-sm text-zinc-500">
              Hi {session?.user?.name} — your number has {roles.length} role{roles.length > 1 ? "s" : ""}.
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {roles.map((role) => {
            const meta = roleMeta[role];
            const Icon = meta.icon;
            return (
              <button
                key={role}
                type="button"
                disabled={!!loading}
                onClick={() => pickRole(role)}
                className={`flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition-all ${meta.accent} disabled:opacity-60`}
              >
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white shadow-sm">
                  <Icon className="h-5 w-5 text-zinc-700" />
                </div>
                <div>
                  <p className="font-bold text-zinc-900">{ROLE_LABELS[role]}</p>
                  <p className="mt-0.5 text-sm text-zinc-600">{meta.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
}
