"use client";

import { Menu, X, Leaf, User } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export function HomeHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="sticky top-0 z-50 w-full bg-[#f6f4ef] pt-4 pb-2">
      <header className="mx-auto max-w-[1400px] px-4">
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-zinc-200/80 bg-white/85 px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.06)] backdrop-blur-md transition-all">
          
          {/* Mobile menu toggle & Logo */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-xl border border-zinc-200 text-zinc-700 md:hidden hover:bg-zinc-100 transition-colors"
              aria-label="Open navigation"
              aria-expanded={isMenuOpen}
              aria-controls="home-mobile-navigation"
              onClick={() => setIsMenuOpen((current) => !current)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-transform group-hover:scale-105">
                <Leaf className="h-5 w-5" />
              </div>
              <div>
                <p className="text-lg font-bold tracking-tight text-zinc-900 group-hover:text-emerald-700 transition-colors">
                  KhetSe
                </p>
                <p className="hidden sm:block text-[11px] text-zinc-500 font-medium">Direct Farm Marketplace</p>
              </div>
            </Link>
          </div>

          {/* 🟢 DESKTOP NAV: Using replace so the Back button works perfectly! */}
          <nav className="hidden md:flex flex-1 items-center justify-center gap-8">
            <Link 
              href="#about" 
              replace
              className="text-sm font-bold text-zinc-500 hover:text-emerald-700 transition-colors"
            >
              Why KhetSe?
            </Link>
            <Link 
              href="#how-it-works" 
              replace
              className="text-sm font-bold text-zinc-500 hover:text-emerald-700 transition-colors"
            >
              How to Use
            </Link>
            <Link 
              href="#faqs" 
              replace
              className="text-sm font-bold text-zinc-500 hover:text-emerald-700 transition-colors"
            >
              FAQs
            </Link>
          </nav>

          {/* Top-Right Sign In Button */}
          <div className="flex items-center gap-2.5">
            <div className="group relative">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-emerald-600/20 transition-all duration-200 hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-600/30 hover:-translate-y-0.5"
              >
                <User className="h-4 w-4" />
                <span>Sign In</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {isMenuOpen ? (
          <>
            <button
              type="button"
              className="fixed inset-0 z-30 cursor-default bg-black/30 backdrop-blur-xs transition-opacity"
              aria-label="Close navigation overlay"
              onClick={closeMenu}
            />

            <nav
              id="home-mobile-navigation"
              className="fixed left-0 top-0 z-40 flex h-full w-[min(18rem,85vw)] flex-col border-r border-zinc-200 bg-white px-5 py-5 shadow-2xl animate-in slide-in-from-left duration-300"
              aria-label="Site navigation"
            >
              <div className="mb-6 flex items-center justify-between border-b border-zinc-100 pb-4">
                <div className="flex items-center gap-2">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-600 text-white">
                    <Leaf className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-base font-bold tracking-tight">KhetSe</p>
                    <p className="text-[10px] text-zinc-400 font-medium">Gujarat Direct Farm</p>
                  </div>
                </div>

                <button
                  type="button"
                  className="grid h-9 w-9 place-items-center rounded-xl border border-zinc-200 text-zinc-700 hover:bg-zinc-100"
                  aria-label="Close navigation"
                  onClick={closeMenu}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex flex-1 flex-col gap-1.5 text-sm font-semibold">
                
                {/* 🟢 MOBILE NAV: Also using replace, and closing the menu when clicked */}
                <div className="flex flex-col gap-4 px-2 py-4">
                  <Link 
                    href="#about" 
                    replace 
                    onClick={closeMenu} 
                    className="text-left text-zinc-600 hover:text-emerald-700 text-lg"
                  >
                    Why KhetSe?
                  </Link>
                  <Link 
                    href="#how-it-works" 
                    replace 
                    onClick={closeMenu} 
                    className="text-left text-zinc-600 hover:text-emerald-700 text-lg"
                  >
                    How to Use
                  </Link>
                  <Link 
                    href="#faqs" 
                    replace 
                    onClick={closeMenu} 
                    className="text-left text-zinc-600 hover:text-emerald-700 text-lg"
                  >
                    FAQs
                  </Link>
                </div>

                <div className="mt-auto pt-4 border-t border-zinc-100">
                  <Link
                    href="/login"
                    className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-500"
                    onClick={closeMenu}
                  >
                    <User className="h-4 w-4" />
                    Sign In to Account
                  </Link>
                </div>
              </div>
            </nav>
          </>
        ) : null}
      </header>
    </div>
  );
}