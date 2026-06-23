"use client";

import { Menu, Search, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

import { navigationLinks } from "../navigation-links";

export function HomeHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-4 z-20 rounded-2xl border border-zinc-200/80 bg-white/90 px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.06)] backdrop-blur">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="grid h-11 w-11 place-items-center rounded-xl border border-zinc-200 text-zinc-700"
          aria-label="Open navigation"
          aria-expanded={isMenuOpen}
          aria-controls="home-mobile-navigation"
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <div className="min-w-0 flex-1">
          <p className="text-lg font-semibold tracking-tight">KhetSe</p>
          <p className="text-sm text-zinc-500">Connecting farmers and buyers · Gandhinagar, Gujarat</p>
        </div>

        <label className="hidden flex-1 items-center gap-3 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-500 md:flex">
          <Search className="h-4 w-4" />
          <span className="text-sm">Search vegetables, fruits, staples...</span>
        </label>

        <Link
          href="/login"
          className="rounded-full px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100"
        >
          Login
        </Link>

        <Link href="/orders" aria-label="Cart" className="grid h-11 w-11 place-items-center rounded-xl border border-zinc-200 bg-zinc-100 text-zinc-700">
          <span>🧺</span>
        </Link>
      </div>

      {isMenuOpen ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-30 cursor-default bg-black/25"
            aria-label="Close navigation overlay"
            onClick={closeMenu}
          />

          <nav
            id="home-mobile-navigation"
            className="fixed left-0 top-0 z-40 flex h-full w-[min(18rem,85vw)] flex-col border-r border-zinc-200 bg-white px-4 py-4 shadow-[12px_0_40px_rgba(0,0,0,0.12)]"
            aria-label="Site navigation"
          >
            <div className="mb-4 flex items-center justify-between border-b border-zinc-200 pb-4">
              <div>
                <p className="text-lg font-semibold tracking-tight">KhetSe</p>
                <p className="text-xs text-zinc-500">Quick links</p>
              </div>

              <button
                type="button"
                className="grid h-10 w-10 place-items-center rounded-xl border border-zinc-200 text-zinc-700"
                aria-label="Close navigation"
                onClick={closeMenu}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-1 flex-col gap-2 text-sm font-medium">
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-xl px-3 py-3 text-zinc-700 transition-colors hover:bg-zinc-50"
                  onClick={closeMenu}
                >
                  {link.label}
                </Link>
              ))}

              <Link
                href="/login"
                className="mt-auto rounded-xl border border-zinc-200 px-3 py-3 text-zinc-700 transition-colors hover:bg-zinc-50"
                onClick={closeMenu}
              >
                Login
              </Link>
            </div>
          </nav>
        </>
      ) : null}
    </header>
  );
}
