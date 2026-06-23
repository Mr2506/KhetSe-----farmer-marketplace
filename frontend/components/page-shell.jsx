"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf } from "lucide-react";

import { navigationLinks } from "./navigation-links";
import { cn } from "../lib/utils";

export function PageShell({
  title,
  description,
  children,
  className,
  contentClassName,
  footerHref = "/",
  footerLabel = "Back to home",
  customHeader = false,
}) {
  const pathname = usePathname();

  return (
    <main className="min-h-screen bg-[#f6f4ef] text-zinc-950 font-sans">
      <div className="mx-auto grid min-h-screen w-full max-w-7xl gap-0 lg:grid-cols-[260px_minmax(0,1fr)]">
        {/* Sidebar */}
        <aside className="border-r border-zinc-200/80 bg-white px-4 py-6 lg:sticky lg:top-0 lg:h-screen flex flex-col gap-8 shadow-sm">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-3 px-2 cursor-pointer">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#22c55e] text-black shadow-lg shadow-emerald-500/10">
              <Leaf className="h-5 w-5 fill-current" />
            </div>
            <span className="text-xl font-bold text-zinc-950 tracking-tight">KhetSe</span>
          </Link>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1 text-[15px] font-semibold">
            {navigationLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3.5 rounded-xl px-4 py-3 text-zinc-500 transition-all hover:bg-zinc-50 hover:text-zinc-900 cursor-pointer",
                    isActive && "bg-[#f0fdf4] text-[#16a34a]"
                  )}
                >
                  <Icon className={cn("h-5 w-5", isActive ? "text-[#16a34a]" : "text-zinc-400")} />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Content Section */}
        <section className={cn("flex min-w-0 flex-col gap-6 bg-[#f6f4ef] px-6 py-8 sm:px-8 lg:px-10", className)}>
          {!customHeader && (
            <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#16a34a]">Page</p>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900">{title}</h1>
              <p className="mt-2 max-w-2xl text-sm text-zinc-500">{description}</p>
            </div>
          )}

          <div className={cn("grid gap-6", contentClassName)}>{children}</div>

          <div className="mt-auto pt-6 border-t border-zinc-200/50">
            <Link href={footerHref} className="text-xs text-zinc-400 transition-colors hover:text-zinc-600">
              {footerLabel}
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}