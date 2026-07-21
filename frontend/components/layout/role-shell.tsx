"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CalendarDays,
  ChevronDown,
  Leaf,
  LogOut,
  Menu,
  Package,
  RefreshCw,
  ShoppingCart,
  Sparkles,
  Store,
  User,
  X,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

import { navByRole } from "@/components/layout/nav-config";
import { AppRole, ROLE_HOME, ROLE_LABELS } from "@/lib/roles";
import { cn } from "@/lib/utils";
import { auth } from "@/lib/firebase"; 

type RoleShellProps = {
  role: AppRole;
  children: React.ReactNode;
};

/* ── Buyer-specific bottom nav items ─────────────────────── */
const buyerBottomNav = [
  { href: "/buyer/browse", label: "Products", icon: Store },
  { href: "/buyer/cart", label: "Cart", icon: ShoppingCart },
  { href: "/buyer/orders", label: "My Orders", icon: Package },
  { href: "/buyer/calendar", label: "Calendar", icon: CalendarDays },
];

export function RoleShell({ role, children }: RoleShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const mobileProfileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
      if (mobileProfileRef.current && !mobileProfileRef.current.contains(e.target as Node)) {
        setMobileProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ADDED THIS: States to hold the real user data
  const [userName, setUserName] = useState("User");
  const [userPhone, setUserPhone] = useState("");
  const [userRoles, setUserRoles] = useState<AppRole[]>([role]); 

  // Cart badge count (reads from localStorage, listens for updates)
  const [cartCount, setCartCount] = useState(0);

  // ADDED THIS: Fetch the real profile on load!
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("khetse_token");
      if (!token) return;

      try {
        const res = await fetch("https://khetse-backend.onrender.com/api/users/profile", {
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

  // Cart count listener — reads localStorage and listens for the cartUpdated event
  useEffect(() => {
    const readCart = () => {
      try {
        const saved = localStorage.getItem("khetse_cart");
        if (saved) {
          const items = JSON.parse(saved);
          setCartCount(Array.isArray(items) ? items.length : 0);
        } else {
          setCartCount(0);
        }
      } catch {
        setCartCount(0);
      }
    };

    readCart(); // initial read

    window.addEventListener("cartUpdated", readCart);
    window.addEventListener("storage", readCart);
    return () => {
      window.removeEventListener("cartUpdated", readCart);
      window.removeEventListener("storage", readCart);
    };
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

  // Whether to use the buyer-specific bottom nav
  const isBuyer = role === "BUYER";

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
          {/* Left: Logo + Brand */}
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

          {/* Right: Minimal profile avatar (dropdown on tap) */}
          <div className="group relative" ref={mobileProfileRef}>
            <button
              type="button"
              onClick={() => setMobileProfileOpen(!mobileProfileOpen)}
              className="grid h-9 w-9 place-items-center rounded-full bg-[#2E7D32] text-white text-xs font-black shadow-sm ring-2 ring-[#2E7D32]/20 ring-offset-1 transition-transform duration-150 active:scale-95"
              aria-label="Profile menu"
            >
              {initials}
            </button>

            {/* Mobile profile dropdown */}
            {mobileProfileOpen && (
            <div className="absolute right-0 top-full pt-2 z-50 animate-in fade-in zoom-in-95 duration-200">
              <div 
                className="w-56 rounded-2xl border border-[#E5E7EB] bg-white p-2.5 shadow-2xl shadow-black/10"
                onClick={() => setMobileProfileOpen(false)}
              >
                <div className="rounded-xl bg-[#F0FAF0] p-3 border border-[#2E7D32]/10 mb-2">
                <p className="text-xs font-bold text-[#1B5E20]">{userName}</p>
                {userPhone && (
                  <p className="text-[11px] text-[#2E7D32]/80 truncate mt-0.5">+91 {userPhone}</p>
                )}
              </div>

              <Link
                href={profileHref}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#6B7280] transition-colors duration-150 hover:bg-[#F0FAF0] hover:text-[#2E7D32]"
              >
                <User className="h-4 w-4 text-[#2E7D32]" />
                View Profile
              </Link>

              {otherRoles.length > 0 && (
                <div className="my-1.5 border-t border-[#E5E7EB] pt-1.5">
                  {otherRoles.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => switchRole(r)}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-[#6B7280] transition-all duration-150 hover:bg-[#F0FAF0] hover:text-[#2E7D32]"
                    >
                      <RefreshCw className="h-3.5 w-3.5 text-[#2E7D32]" />
                      Switch to {ROLE_LABELS[r]}
                    </button>
                  ))}
                </div>
              )}

              <div className="border-t border-[#E5E7EB] pt-1.5 mt-1">
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-600 transition-colors duration-150 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 text-red-500" />
                  Sign Out
                </button>
              </div>
              </div>
            </div>
            )}
          </div>
        </header>

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
                <div className="group relative" ref={profileRef}>
                  <button
                    type="button"
                    onClick={() => setProfileOpen(!profileOpen)}
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
                    <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", profileOpen ? "rotate-180 text-[#2E7D32]" : "text-[#9CA3AF] group-hover:text-[#2E7D32]")} />
                  </button>

                  {/* Click dropdown */}
                  {profileOpen && (
                  <div className="absolute right-0 top-full pt-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div 
                      className="w-72 rounded-2xl border border-[#E5E7EB] bg-white p-3 shadow-2xl shadow-black/10"
                      onClick={() => setProfileOpen(false)}
                    >
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
                  )}
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
      <nav
        className="fixed inset-x-0 bottom-0 z-50 border-t border-[#E5E7EB] bg-white lg:hidden shadow-[0_-2px_12px_rgba(0,0,0,0.06)] ks-safe-bottom"
        role="navigation"
        aria-label="Mobile navigation"
      >
        <div className="mx-auto flex max-w-lg justify-around px-1 py-1">
          {isBuyer ? (
            /* ── Buyer-specific 4-item bottom nav ── */
            buyerBottomNav.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              const isCart = item.href === "/buyer/cart";
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative flex flex-col items-center justify-center gap-0.5 rounded-xl px-3 min-w-[56px] min-h-[44px] py-1.5 text-[11px] font-bold transition-all duration-200",
                    active
                      ? "text-[#2E7D32] bg-[#F0FAF0]"
                      : "text-[#9CA3AF] hover:text-[#1A1A1A] active:bg-[#F7F8F5]"
                  )}
                >
                  <span className="relative">
                    <Icon className={cn("h-5 w-5 transition-colors duration-200", active ? "text-[#2E7D32]" : "text-[#9CA3AF]")} />
                    {/* Cart badge */}
                    {isCart && cartCount > 0 && (
                      <span className="absolute -top-1.5 -right-2 grid h-4 min-w-[16px] place-items-center rounded-full bg-[#EF9F27] px-1 text-[9px] font-black text-white leading-none shadow-sm">
                        {cartCount > 9 ? "9+" : cartCount}
                      </span>
                    )}
                  </span>
                  <span className="leading-tight">{item.label.split(" ")[0]}</span>
                  {/* Active indicator dot */}
                  {active && (
                    <span className="absolute -bottom-0.5 h-[3px] w-5 rounded-full bg-[#2E7D32]" />
                  )}
                </Link>
              );
            })
          ) : (
            /* ── Generic bottom nav for Farmer/Admin ── */
            <>
              {links.slice(0, 4).map((link) => {
                const Icon = link.icon;
                const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex flex-col items-center gap-0.5 rounded-xl px-3 min-h-[44px] py-1.5 text-[11px] font-bold transition-all duration-200",
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
                  "flex flex-col items-center gap-0.5 rounded-xl px-3 min-h-[44px] py-1.5 text-[11px] font-bold transition-all duration-200",
                  pathname === profileHref ? "text-[#2E7D32] bg-[#F0FAF0]" : "text-[#9CA3AF] hover:text-[#1A1A1A]"
                )}
              >
                <User className={cn("h-5 w-5", pathname === profileHref ? "text-[#2E7D32]" : "text-[#9CA3AF]")} />
                Profile
              </Link>
            </>
          )}
        </div>
      </nav>
      <div className="h-16 lg:hidden" />
    </div>
  );
}
