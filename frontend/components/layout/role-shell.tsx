"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  Leaf,
  LogOut,
  Menu,
  User,
  X,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { useState, useEffect } from "react";

import { navByRole } from "@/components/layout/nav-config";
import { AppRole, ROLE_HOME, ROLE_LABELS } from "@/lib/roles";
import { cn } from "@/lib/utils";
import { auth } from "@/lib/firebase"; 

type RoleShellProps = {
  role: AppRole;
  children: React.ReactNode;
};

export function RoleShell({ role, children }: RoleShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  // ADDED THIS: States to hold the real user data
  const [userName, setUserName] = useState("User");
  const [userPhone, setUserPhone] = useState("");
  const [userRoles, setUserRoles] = useState<AppRole[]>([role]); 

  // ADDED THIS: Fetch the real profile on load!
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("khetse_token");
      if (!token) return;

      try {
        const res = await fetch("http://localhost:5000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        
        if (res.ok) {
          setUserName(data.firstName || "User");
          setUserPhone(data.phone || "");
          // If they have multiple roles in the DB in the future, set them here
        }
      } catch (error) {
        console.error("Failed to fetch profile", error);
      }
    };

    fetchProfile();
  }, []);

  const links = navByRole[role].filter(
    (link) => link.label.toLowerCase() !== "profile"
  );

  const otherRoles = userRoles.filter((r: AppRole) => r !== role);

  async function switchRole(nextRole: AppRole) {
    await fetch("/api/role/switch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: nextRole }),
    });
    router.push(ROLE_HOME[nextRole]);
    router.refresh();
  }

  const handleSignOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Firebase signout error", error);
    }
    localStorage.removeItem("khetse_token");
    localStorage.removeItem("khetse_role");
    router.push("/login");
  };

  const profileHref = `/${role.toLowerCase()}/profile`;
  
  // Calculate initials dynamically from our fetched name!
  const initials = userName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-[#F7F8F5] text-[#1A1A1A] font-sans">
      <div className="mx-auto flex min-h-screen w-full max-w-[1920px] flex-col lg:flex-row">

        {/* ── Desktop Sidebar ─────────────────────────────── */}
        <aside className="hidden lg:flex lg:w-64 xl:w-72 lg:flex-col lg:sticky lg:top-0 lg:h-screen shrink-0 border-r border-[#E5E7EB] bg-white shadow-[1px_0_0_0_#E5E7EB]">

          {/* Logo area */}
          <div className="border-b border-[#E5E7EB] px-6 py-5">
            <Link href={ROLE_HOME[role]} className="flex items-center gap-3 group">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#2E7D32] text-white shadow-md shadow-[#2E7D32]/20 transition-transform duration-200 group-hover:scale-105">
                <Leaf className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[17px] font-bold tracking-tight text-[#1A1A1A] group-hover:text-[#2E7D32] transition-colors duration-150">
                  KhetSe
                </p>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#F0FAF0] px-2 py-0.5 text-[11px] font-semibold text-[#2E7D32] border border-[#2E7D32]/15">
                  <Sparkles className="h-2.5 w-2.5" />
                  {ROLE_LABELS[role]}
                </span>
              </div>
            </Link>
          </div>

          {/* Nav links */}
          <nav className="flex flex-1 flex-col gap-1 px-3 py-5">
            <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-[#6B7280]">
              Navigation
            </p>
            {links.map((link) => {
              const Icon = link.icon;
              const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative flex items-center gap-3 rounded-[8px] px-3 py-2.5 text-sm font-semibold transition-all duration-150",
                    active
                      ? "ks-nav-active bg-[#2E7D32] text-white shadow-sm shadow-[#2E7D32]/25"
                      : "text-[#6B7280] hover:bg-[#F0FAF0] hover:text-[#2E7D32]"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4.5 w-4.5 shrink-0",
                      active ? "text-white" : "text-[#9CA3AF] group-hover:text-[#2E7D32]"
                    )}
                  />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Bottom status card */}
          <div className="p-4 border-t border-[#E5E7EB]">
            <div className="rounded-xl border-l-[3px] border-l-[#2E7D32] border border-[#E5E7EB] bg-white px-4 py-3.5 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <span className="h-2 w-2 rounded-full bg-[#2E7D32] animate-pulse" />
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#2E7D32]">Marketplace Status</p>
              </div>
              <p className="text-sm font-bold text-[#1A1A1A]">Direct Farm Connect</p>
              <p className="mt-0.5 text-[11px] text-[#6B7280] leading-snug">Zero middleman margins. Farm-fresh guarantee.</p>
            </div>
          </div>
        </aside>

        {/* ── Mobile Top Header ───────────────────────────── */}
        <header className="flex items-center justify-between border-b border-[#E5E7EB] bg-white px-4 py-3 sticky top-0 z-40 lg:hidden shadow-sm">
          <Link href={ROLE_HOME[role]} className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#2E7D32] text-white shadow-sm">
              <Leaf className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold tracking-tight text-[#1A1A1A]">KhetSe</p>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#2E7D32]">
                {ROLE_LABELS[role]}
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href={profileHref}
              className="flex items-center gap-1.5 rounded-full border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-bold text-[#1A1A1A] hover:border-[#2E7D32] hover:text-[#2E7D32] transition-colors duration-150"
            >
              <div className="grid h-5 w-5 place-items-center rounded-full bg-[#2E7D32] text-white text-[9px] font-black">
                {initials}
              </div>
              Profile
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="rounded-xl border border-[#E5E7EB] p-2 text-[#6B7280] hover:bg-[#F7F8F5] active:scale-95 transition-all duration-150"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </header>

        {/* Mobile expanded menu */}
        {mobileOpen && (
          <div className="border-b border-[#E5E7EB] bg-white px-4 py-4 lg:hidden animate-in slide-in-from-top-2 duration-200">
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
                      "flex items-center gap-3 rounded-[8px] px-3.5 py-2.5 text-sm font-semibold transition-colors duration-150",
                      active ? "bg-[#2E7D32] text-white" : "text-[#6B7280] hover:bg-[#F0FAF0] hover:text-[#2E7D32]"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {otherRoles.length > 0 && (
              <div className="mt-4 border-t border-[#E5E7EB] pt-3">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#6B7280]">Switch Role</p>
                <div className="flex flex-wrap gap-2">
                  {otherRoles.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => switchRole(r)}
                      className="flex items-center gap-1.5 rounded-full border border-[#E5E7EB] bg-[#F7F8F5] px-3 py-1.5 text-xs font-semibold text-[#1A1A1A] hover:border-[#2E7D32] hover:text-[#2E7D32] transition-colors duration-150"
                    >
                      <RefreshCw className="h-3 w-3" />
                      {ROLE_LABELS[r]}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleSignOut}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-bold text-red-600 hover:bg-red-100 transition-colors duration-150"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        )}

        {/* ── Main Content + Top Desktop Header ───────────── */}
        <main className="flex min-w-0 flex-1 flex-col">

          {/* Desktop sticky header */}
          <header className="hidden sticky top-0 z-30 border-b border-[#E5E7EB] bg-white px-6 xl:px-10 py-3.5 lg:block shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between">
              <div>
                <span className="inline-block rounded-full bg-[#2E7D32] px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white">
                  {ROLE_LABELS[role]} Dashboard
                </span>
                <h1 className="mt-1.5 text-[22px] font-bold tracking-tight text-[#1A1A1A] leading-tight">
                  Welcome back, {userName}
                </h1>
              </div>

              {/* Profile dropdown */}
              <div className="flex items-center gap-4">
                <div className="group relative">
                  <button
                    type="button"
                    className="flex items-center gap-3 rounded-2xl border border-[#E5E7EB] bg-white px-3.5 py-2 text-left shadow-sm transition-all duration-150 hover:border-[#2E7D32] hover:shadow-md hover:shadow-[#2E7D32]/10"
                  >
                    {/* Avatar with ring */}
                    <div className="relative grid h-9 w-9 place-items-center rounded-xl bg-[#2E7D32] text-white font-bold text-sm shadow-sm ring-2 ring-[#2E7D32]/20 ring-offset-1">
                      {initials}
                    </div>
                    <div className="hidden sm:block text-left">
                      <p className="text-xs font-bold text-[#1A1A1A] leading-tight flex items-center gap-1.5">
                        {userName}
                        <span className="h-1.5 w-1.5 rounded-full bg-[#2E7D32] inline-block animate-pulse" />
                      </p>
                      <p className="text-[11px] text-[#6B7280] font-medium">{ROLE_LABELS[role]}</p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-[#9CA3AF] transition-transform duration-200 group-hover:rotate-180 group-hover:text-[#2E7D32]" />
                  </button>

                  {/* Hover dropdown */}
                  <div className="nav-popover-hover absolute right-0 top-full mt-2 w-72 rounded-2xl border border-[#E5E7EB] bg-white p-3 shadow-2xl shadow-black/10 z-50">
                    <div className="rounded-xl bg-[#F0FAF0] p-3 border border-[#2E7D32]/10 mb-2">
                      <p className="text-xs font-bold text-[#1B5E20]">{userName}</p>
                      {userPhone && (
                        <p className="text-[11px] text-[#2E7D32]/80 truncate mt-0.5">+91 {userPhone}</p>
                      )}
                      <div className="mt-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#2E7D32] bg-white px-2 py-0.5 rounded-md border border-[#2E7D32]/20">
                          Active: {ROLE_LABELS[role]}
                        </span>
                      </div>
                    </div>

                    <Link
                      href={profileHref}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#6B7280] transition-colors duration-150 hover:bg-[#F0FAF0] hover:text-[#2E7D32]"
                    >
                      <User className="h-4 w-4 text-[#2E7D32]" />
                      View Profile Details
                    </Link>

                    {otherRoles.length > 0 && (
                      <div className="my-2 border-t border-[#E5E7EB] pt-2">
                        <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-[#9CA3AF] mb-1">
                          Switch Role
                        </p>
                        {otherRoles.map((r) => (
                          <button
                            key={r}
                            type="button"
                            onClick={() => switchRole(r)}
                            className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-[#6B7280] transition-all duration-150 hover:bg-[#F0FAF0] hover:text-[#2E7D32]"
                          >
                            <span className="flex items-center gap-2">
                              <RefreshCw className="h-3.5 w-3.5 text-[#2E7D32]" />
                              Switch to {ROLE_LABELS[r]}
                            </span>
                            <span className="text-[10px] text-[#2E7D32] font-bold bg-[#F0FAF0] px-1.5 py-0.5 rounded border border-[#2E7D32]/15">
                              Go →
                            </span>
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="border-t border-[#E5E7EB] pt-2 mt-1">
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-600 transition-colors duration-150 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4 text-red-500" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <div className="flex-1 px-4 py-6 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
            {children}
          </div>
        </main>
      </div>

      {/* ── Mobile Bottom Nav ────────────────────────────── */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[#E5E7EB] bg-white lg:hidden shadow-[0_-2px_12px_rgba(0,0,0,0.06)]">
        <div className="mx-auto flex max-w-lg justify-around px-2 py-2">
          {links.slice(0, 4).map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-xl px-3 py-1.5 text-[11px] font-bold transition-all duration-150",
                  active ? "text-[#2E7D32] bg-[#F0FAF0]" : "text-[#9CA3AF] hover:text-[#1A1A1A]"
                )}
              >
                <Icon className={cn("h-5 w-5", active ? "text-[#2E7D32]" : "text-[#9CA3AF]")} />
                {link.label.split(" ")[0]}
              </Link>
            );
          })}

          <Link
            href={profileHref}
            className={cn(
              "flex flex-col items-center gap-1 rounded-xl px-3 py-1.5 text-[11px] font-bold transition-all duration-150",
              pathname === profileHref ? "text-[#2E7D32] bg-[#F0FAF0]" : "text-[#9CA3AF] hover:text-[#1A1A1A]"
            )}
          >
            <User className={cn("h-5 w-5", pathname === profileHref ? "text-[#2E7D32]" : "text-[#9CA3AF]")} />
            Profile
          </Link>
        </div>
      </nav>
      <div className="h-16 lg:hidden" />
    </div>
  );
}