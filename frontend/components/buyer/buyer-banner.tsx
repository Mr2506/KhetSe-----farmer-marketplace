"use client";

import { ArrowRight, Leaf, Zap } from "lucide-react";

export function BuyerBanner() {
  return (
    <div
      className="ks-grain relative overflow-hidden rounded-2xl bg-[#1B3A2A] shadow-lg shadow-[#1B3A2A]/20"
      role="banner"
      aria-label="KhetSe farm-direct marketplace introduction"
    >

      {/* Soft radial glow — left */}
      <div
        className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, #4CAF50 0%, transparent 70%)" }}
        aria-hidden="true"
      />
      {/* Soft radial glow — right */}
      <div
        className="pointer-events-none absolute -bottom-16 -right-16 h-72 w-72 rounded-full opacity-15"
        style={{ background: "radial-gradient(circle, #F9A825 0%, transparent 70%)" }}
        aria-hidden="true"
      />

      {/* Dot grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
        aria-hidden="true"
      />

      {/* Wheat / plant silhouette — pure CSS right panel */}
      <div className="pointer-events-none absolute right-0 top-0 h-full w-52 overflow-hidden opacity-10" aria-hidden="true">
        {/* Stylised stalks using CSS shapes */}
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="absolute bottom-0"
            style={{
              left: `${i * 22}%`,
              width: "2px",
              height: `${55 + i * 8}%`,
              background: "linear-gradient(to top, #A5D6A7, transparent)",
              borderRadius: "2px",
            }}
          >
            {/* Grain head */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full"
              style={{ background: "rgba(165,214,167,0.8)" }}
            />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-5 py-5 sm:px-8 sm:py-8">
        <div className="space-y-3 max-w-lg">
          {/* Eyebrow */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-full border border-[#4CAF50]/40 bg-[#2E7D32]/50 px-3 py-1 backdrop-blur-sm">
              <Zap className="h-3 w-3 text-[#F9A825]" aria-hidden="true" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#A5D6A7]">
                Farm Direct
              </span>
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold leading-tight text-white">
            Fresh from the field,{" "}
            <span className="text-[#F9A825]">straight to you</span>
          </h2>

          {/* Body — hidden on very small screens to save space */}
          <p className="hidden sm:block text-sm sm:text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.70)" }}>
            Shop directly from verified local farmers. No middlemen, no markups — just the freshest produce at honest prices.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <a
              href="#listings"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-[#2E7D32] shadow-sm hover:bg-[#F0FAF0] transition-all duration-150 active:scale-95"
            >
              <Leaf className="h-4 w-4" aria-hidden="true" />
              Shop Now
            </a>
            <a
              href="#how-it-works"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-[#F9A825]/60 bg-transparent px-4 py-2.5 text-sm font-bold text-[#F9A825] hover:bg-[#F9A825]/10 transition-all duration-150 active:scale-95"
            >
              Learn how it works
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Right side stat / trust badges — hidden on mobile to keep products in view */}
        <div className="hidden md:flex shrink-0 flex-col gap-3 sm:items-end">
          {[
            { value: "500+", label: "Local Farmers" },
            { value: "100%", label: "Verified Produce" },
            { value: "0%",   label: "Middleman Markup" },
          ].map(({ value, label }) => (
            <div
              key={label}
              className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm px-4 py-2.5 text-right"
            >
              <p className="text-lg font-extrabold text-white leading-none">{value}</p>
              <p className="text-[11px] text-white/50 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
