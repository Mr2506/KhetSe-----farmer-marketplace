import { CircleChevronRight, Leaf } from "lucide-react";

import { highlights } from "./home-data";
import { SectionHeading } from "./section-heading";

export function HeroSection() {
  return (
    <section className="grid gap-4 lg:grid-cols-[1.55fr_0.9fr]">
      {/* Left Main Hero Card */}
      <div className="relative overflow-hidden rounded-[1.5rem] border border-zinc-200 bg-[#fbfaf7] p-5 shadow-[0_12px_30px_rgba(0,0,0,0.04)] sm:min-h-[20rem] sm:p-8 lg:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(122,155,80,0.12),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(239,108,29,0.1),transparent_30%)]" />
        <div className="relative grid gap-6 lg:grid-cols-[1.25fr_0.75fr] lg:items-center lg:gap-6">
          <div className="space-y-4">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-semibold text-zinc-600 shadow-sm border border-zinc-100/50">
              <Leaf className="h-3.5 w-3.5 text-[#7a9b50]" />
              Direct From Farm
            </span>
            <div className="space-y-2">
              <h1 className="max-w-xl text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl lg:text-4xl leading-tight">
                Sell Crops Directly & Buy Fresh Farm Produce
              </h1>
            </div>
            <p className="max-w-lg text-sm leading-relaxed text-zinc-600 sm:text-base">
              No middlemen. Farmers get better prices for their hard work, and buyers get the freshest food straight from local fields.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#7a9b50] hover:bg-[#688444] px-5 py-2.5 text-xs sm:text-sm font-bold text-white transition-colors shadow-sm cursor-pointer"
              >
                Buy Fresh Produce
                <CircleChevronRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="rounded-full border border-zinc-200 bg-white px-5 py-2.5 text-xs sm:text-sm font-bold text-zinc-700 hover:bg-zinc-50 transition-colors shadow-sm cursor-pointer"
              >
                Sell Your Harvest
              </button>
            </div>
          </div>

          <div className="grid gap-2.5 sm:grid-cols-3 lg:grid-cols-1 lg:justify-self-end w-full">
            {highlights.map(({ label, icon: Icon }) => (
              <div
                key={label}
                className="flex items-center gap-2.5 rounded-xl border border-white/80 bg-white/70 p-3 shadow-sm backdrop-blur sm:min-h-[4rem]"
              >
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#f1f6ea] text-[#6d8f46]">
                  <Icon className="h-4 w-4" />
                </div>
                <p className="text-xs font-semibold text-zinc-700 leading-snug">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Sidebar Card */}
      <aside className="grid gap-3.5 rounded-[1.5rem] border border-zinc-200 bg-white p-4 shadow-[0_12px_30px_rgba(0,0,0,0.04)]">
        <SectionHeading title="Today's Special Deals" action="Ends in 02:18:45" />
        
        <div className="rounded-2xl bg-[#eef6e4] p-4 flex flex-col justify-between h-full">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-[#6f8f46] uppercase tracking-wider">Trusted Partner</p>
              <p className="mt-1 text-lg font-bold tracking-tight text-zinc-950">Verified Local Farms</p>
            </div>
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white text-[#6f8f46] shadow-sm">
              <Leaf className="h-6 w-6" />
            </div>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-zinc-600">
            Get fresh vegetables, fruits, and grains directly from verified local farmers near you.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-xl bg-[#fcf0e6] p-2.5 text-center">
            <p className="text-lg font-extrabold text-zinc-950">4.8 ★</p>
            <p className="mt-0.5 text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Quality</p>
          </div>
          <div className="rounded-xl bg-[#eef6e4] p-2.5 text-center">
            <p className="text-lg font-extrabold text-zinc-950">24k+</p>
            <p className="mt-0.5 text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Deals Done</p>
          </div>
          <div className="rounded-xl bg-[#eef2fb] p-2.5 text-center">
            <p className="text-lg font-extrabold text-zinc-950">Fast</p>
            <p className="mt-0.5 text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Delivery</p>
          </div>
        </div>
      </aside>
    </section>
  );
}