"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  ChevronDown,
  Leaf,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

import { navByRole } from "@/components/layout/nav-config";
import { AppRole, ROLE_HOME, ROLE_LABELS } from "@/lib/roles";
import { cn } from "@/lib/utils";

type RoleShellProps = {
  role: AppRole;
  children: React.ReactNode;
};

export function RoleShell({ role, children }: RoleShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const links = navByRole[role];
  const otherRoles = ((session?.user as any)?.roles ?? []).filter((r: AppRole) => r !== role);

  async function switchRole(nextRole: AppRole) {
    await fetch("/api/role/switch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: nextRole }),
    });
    router.push(ROLE_HOME[nextRole]);
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#f6f4ef] text-zinc-950">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col lg:flex-row">
        {/* Desktop sidebar */}
        <aside className="hidden border-r border-zinc-200/80 bg-white lg:flex lg:w-64 lg:flex-col lg:sticky lg:top-0 lg:h-screen">
          <ShellHeader
            role={role}
            session={session}
            otherRoles={otherRoles}
            roleMenuOpen={roleMenuOpen}
            setRoleMenuOpen={setRoleMenuOpen}
            onSwitchRole={switchRole}
          />
          <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
            {links.map((link) => {
              const Icon = link.icon;
              const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors",
                    active ? "bg-emerald-50 text-emerald-700" : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900",
                  )}
                >
                  <Icon className={cn("h-5 w-5", active ? "text-emerald-600" : "text-zinc-400")} />
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="mx-3 mb-4 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </aside>

        {/* Mobile top bar */}
        <header className="flex items-center justify-between border-b border-zinc-200/80 bg-white px-4 py-3 lg:hidden">
          <Link href={ROLE_HOME[role]} className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-600 text-white">
              <Leaf className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold">KhetSe</p>
              <p className="text-xs text-zinc-500">{ROLE_LABELS[role]}</p>
            </div>
          </Link>
          <button type="button" onClick={() => setMobileOpen((v) => !v)} className="rounded-lg p-2 hover:bg-zinc-100">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </header>

        {mobileOpen && (
          <div className="border-b border-zinc-200 bg-white px-4 py-3 lg:hidden">
            <nav className="flex flex-col gap-1">
              {links.map((link) => {
                const Icon = link.icon;
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold",
                      active ? "bg-emerald-50 text-emerald-700" : "text-zinc-600",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
            {otherRoles.length > 0 && (
              <div className="mt-3 border-t border-zinc-100 pt-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">Switch role</p>
                <div className="flex flex-wrap gap-2">
                  {otherRoles.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => switchRole(r)}
                      className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800"
                    >
                      {ROLE_LABELS[r]}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="mt-3 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-zinc-500"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        )}

        <main className="flex min-w-0 flex-1 flex-col">
          <div className="hidden border-b border-zinc-200/80 bg-white px-6 py-4 lg:block">
            <ShellHeader
              role={role}
              session={session}
              otherRoles={otherRoles}
              roleMenuOpen={roleMenuOpen}
              setRoleMenuOpen={setRoleMenuOpen}
              onSwitchRole={switchRole}
              compact
            />
          </div>
          <div className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-200 bg-white/95 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-lg justify-around px-2 py-2">
          {links.slice(0, 5).map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 rounded-lg px-2 py-1 text-[10px] font-semibold",
                  active ? "text-emerald-700" : "text-zinc-400",
                )}
              >
                <Icon className="h-5 w-5" />
                {link.label.split(" ")[0]}
              </Link>
            );
          })}
        </div>
      </nav>
      <div className="h-16 lg:hidden" />
    </div>
  );
}

function ShellHeader({
  role,
  session,
  otherRoles,
  roleMenuOpen,
  setRoleMenuOpen,
  onSwitchRole,
  compact = false,
}: {
  role: AppRole;
  session: ReturnType<typeof useSession>["data"];
  otherRoles: AppRole[];
  roleMenuOpen: boolean;
  setRoleMenuOpen: (v: boolean) => void;
  onSwitchRole: (role: AppRole) => void;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">{ROLE_LABELS[role]} view</p>
          <p className="text-lg font-bold text-zinc-900">Welcome, {session?.user?.name ?? "User"}</p>
        </div>
        {otherRoles.length > 0 && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium"
            >
              Switch role
              <ChevronDown className="h-4 w-4" />
            </button>
            {roleMenuOpen && (
              <div className="absolute right-0 z-50 mt-2 w-40 rounded-xl border border-zinc-200 bg-white py-1 shadow-lg">
                {otherRoles.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      setRoleMenuOpen(false);
                      onSwitchRole(r);
                    }}
                    className="block w-full px-4 py-2 text-left text-sm hover:bg-zinc-50"
                  >
                    {ROLE_LABELS[r]}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="border-b border-zinc-100 px-4 py-5">
      <Link href={ROLE_HOME[role]} className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20">
          <Leaf className="h-5 w-5" />
        </div>
        <div>
          <p className="text-lg font-bold tracking-tight">KhetSe</p>
          <p className="text-xs text-zinc-500">{ROLE_LABELS[role]}</p>
        </div>
      </Link>
      {otherRoles.length > 0 && (
        <div className="relative mt-4">
          <button
            type="button"
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="flex w-full items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800"
          >
            Switch role
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
          {roleMenuOpen && (
            <div className="absolute left-0 right-0 z-50 mt-1 rounded-xl border border-zinc-200 bg-white py-1 shadow-lg">
              {otherRoles.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    setRoleMenuOpen(false);
                    onSwitchRole(r);
                  }}
                  className="block w-full px-3 py-2 text-left text-sm hover:bg-zinc-50"
                >
                  {ROLE_LABELS[r]}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
