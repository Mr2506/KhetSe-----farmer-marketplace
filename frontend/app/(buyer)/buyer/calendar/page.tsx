"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Leaf,
  Sun,
  CloudRain,
  Snowflake,
  Apple,
  Carrot,
  ArrowRight,
} from "lucide-react";

/* ═══════════════════════════════════════════════
   SEASONAL PRODUCE DATA — Gujarat / India
   ═══════════════════════════════════════════════ */

interface SeasonalItem {
  name: string;
  emoji: string;
  type: "fruit" | "vegetable";
  tip?: string;
}

const SEASONAL_DATA: Record<number, { season: string; items: SeasonalItem[] }> = {
  0: {
    // January
    season: "Winter",
    items: [
      { name: "Green Peas", emoji: "🫛", type: "vegetable", tip: "Peak freshness" },
      { name: "Cauliflower", emoji: "🥦", type: "vegetable", tip: "Best season" },
      { name: "Spinach", emoji: "🥬", type: "vegetable" },
      { name: "Methi (Fenugreek)", emoji: "🌿", type: "vegetable" },
      { name: "Carrots", emoji: "🥕", type: "vegetable" },
      { name: "Radish", emoji: "🫚", type: "vegetable" },
      { name: "Guava", emoji: "🍈", type: "fruit", tip: "Peak season" },
      { name: "Orange", emoji: "🍊", type: "fruit" },
      { name: "Strawberry", emoji: "🍓", type: "fruit" },
      { name: "Amla (Gooseberry)", emoji: "🫒", type: "fruit" },
    ],
  },
  1: {
    // February
    season: "Winter",
    items: [
      { name: "Cabbage", emoji: "🥬", type: "vegetable" },
      { name: "Broccoli", emoji: "🥦", type: "vegetable" },
      { name: "Beetroot", emoji: "🫒", type: "vegetable" },
      { name: "Green Peas", emoji: "🫛", type: "vegetable" },
      { name: "Turnip", emoji: "🫚", type: "vegetable" },
      { name: "Coriander", emoji: "🌿", type: "vegetable" },
      { name: "Papaya", emoji: "🍈", type: "fruit" },
      { name: "Guava", emoji: "🍏", type: "fruit" },
      { name: "Banana", emoji: "🍌", type: "fruit" },
      { name: "Chiku (Sapota)", emoji: "🥝", type: "fruit", tip: "Gujarat specialty" },
    ],
  },
  2: {
    // March
    season: "Spring",
    items: [
      { name: "Raw Mango", emoji: "🥭", type: "fruit", tip: "Aam-ras season starts!" },
      { name: "Watermelon", emoji: "🍉", type: "fruit" },
      { name: "Cucumber", emoji: "🥒", type: "vegetable" },
      { name: "Bottle Gourd", emoji: "🫛", type: "vegetable" },
      { name: "Ridge Gourd", emoji: "🌿", type: "vegetable" },
      { name: "Tinda", emoji: "🟢", type: "vegetable" },
      { name: "Spring Onion", emoji: "🧅", type: "vegetable" },
      { name: "Jackfruit", emoji: "🍈", type: "fruit" },
      { name: "Lemon", emoji: "🍋", type: "fruit" },
      { name: "Tomato", emoji: "🍅", type: "vegetable" },
    ],
  },
  3: {
    // April
    season: "Summer",
    items: [
      { name: "Mango (Kesar)", emoji: "🥭", type: "fruit", tip: "Gujarat's pride — Gir Kesar!" },
      { name: "Watermelon", emoji: "🍉", type: "fruit", tip: "Beat the heat" },
      { name: "Muskmelon", emoji: "🍈", type: "fruit" },
      { name: "Litchi", emoji: "🍒", type: "fruit" },
      { name: "Cucumber", emoji: "🥒", type: "vegetable" },
      { name: "Bitter Gourd", emoji: "🌿", type: "vegetable" },
      { name: "Bottle Gourd", emoji: "🫛", type: "vegetable" },
      { name: "Okra (Bhindi)", emoji: "🫑", type: "vegetable" },
      { name: "Cluster Beans", emoji: "🌿", type: "vegetable" },
      { name: "Drumstick", emoji: "🥒", type: "vegetable" },
    ],
  },
  4: {
    // May
    season: "Summer",
    items: [
      { name: "Alphonso Mango", emoji: "🥭", type: "fruit", tip: "King of fruits at peak!" },
      { name: "Kesar Mango", emoji: "🥭", type: "fruit", tip: "Best of season" },
      { name: "Muskmelon", emoji: "🍈", type: "fruit" },
      { name: "Watermelon", emoji: "🍉", type: "fruit" },
      { name: "Jamun (Black Plum)", emoji: "🫐", type: "fruit" },
      { name: "Okra", emoji: "🫑", type: "vegetable" },
      { name: "Snake Gourd", emoji: "🥒", type: "vegetable" },
      { name: "Ivy Gourd (Tindora)", emoji: "🟢", type: "vegetable", tip: "Gujarat favourite" },
      { name: "Raw Banana", emoji: "🍌", type: "vegetable" },
      { name: "Green Chilli", emoji: "🌶️", type: "vegetable" },
    ],
  },
  5: {
    // June
    season: "Monsoon",
    items: [
      { name: "Mango (Late)", emoji: "🥭", type: "fruit" },
      { name: "Jamun", emoji: "🫐", type: "fruit", tip: "Monsoon specialty" },
      { name: "Plum", emoji: "🍑", type: "fruit" },
      { name: "Pear", emoji: "🍐", type: "fruit" },
      { name: "Corn", emoji: "🌽", type: "vegetable", tip: "Roasted corn season!" },
      { name: "Green Tuvar", emoji: "🫛", type: "vegetable", tip: "Undhiyu time!" },
      { name: "Surti Papdi", emoji: "🫘", type: "vegetable", tip: "Gujarat specialty" },
      { name: "Valor (Broad Beans)", emoji: "🫘", type: "vegetable" },
      { name: "Brinjal", emoji: "🍆", type: "vegetable" },
      { name: "Bhavnagri Chilli", emoji: "🌶️", type: "vegetable" },
    ],
  },
  6: {
    // July
    season: "Monsoon",
    items: [
      { name: "Pomegranate", emoji: "🫒", type: "fruit" },
      { name: "Peach", emoji: "🍑", type: "fruit" },
      { name: "Custard Apple", emoji: "🍏", type: "fruit" },
      { name: "Corn (Bhutta)", emoji: "🌽", type: "vegetable", tip: "Street-side bhutta!" },
      { name: "Tuvar (Pigeon Pea)", emoji: "🫛", type: "vegetable" },
      { name: "Brinjal", emoji: "🍆", type: "vegetable" },
      { name: "Karela (Bitter Gourd)", emoji: "🥒", type: "vegetable" },
      { name: "Taro Root (Arbi)", emoji: "🫚", type: "vegetable" },
      { name: "Colocasia Leaves", emoji: "🍃", type: "vegetable", tip: "Patra season!" },
      { name: "Pointed Gourd", emoji: "🟢", type: "vegetable" },
    ],
  },
  7: {
    // August
    season: "Monsoon",
    items: [
      { name: "Custard Apple", emoji: "🍏", type: "fruit", tip: "Sitaphal season!" },
      { name: "Pear", emoji: "🍐", type: "fruit" },
      { name: "Pomegranate", emoji: "🫒", type: "fruit" },
      { name: "Snake Gourd", emoji: "🥒", type: "vegetable" },
      { name: "Ridge Gourd", emoji: "🌿", type: "vegetable" },
      { name: "Cluster Beans (Guar)", emoji: "🌿", type: "vegetable" },
      { name: "Yam", emoji: "🫚", type: "vegetable" },
      { name: "Colocasia", emoji: "🍃", type: "vegetable" },
      { name: "Padval", emoji: "🟢", type: "vegetable" },
      { name: "Dill (Suva)", emoji: "🌿", type: "vegetable" },
    ],
  },
  8: {
    // September
    season: "Autumn",
    items: [
      { name: "Pomegranate", emoji: "🫒", type: "fruit", tip: "Peak sweetness" },
      { name: "Custard Apple", emoji: "🍏", type: "fruit" },
      { name: "Sweet Lime (Mosambi)", emoji: "🍋", type: "fruit" },
      { name: "Fig", emoji: "🫒", type: "fruit" },
      { name: "Cabbage", emoji: "🥬", type: "vegetable" },
      { name: "French Beans", emoji: "🫘", type: "vegetable" },
      { name: "Capsicum", emoji: "🫑", type: "vegetable" },
      { name: "Tomato", emoji: "🍅", type: "vegetable" },
      { name: "Onion", emoji: "🧅", type: "vegetable" },
      { name: "Ginger", emoji: "🫚", type: "vegetable", tip: "Fresh crop arrives" },
    ],
  },
  9: {
    // October
    season: "Autumn",
    items: [
      { name: "Guava", emoji: "🍏", type: "fruit", tip: "Season starts!" },
      { name: "Pomegranate", emoji: "🫒", type: "fruit" },
      { name: "Sweet Lime", emoji: "🍋", type: "fruit" },
      { name: "Cranberry", emoji: "🫐", type: "fruit" },
      { name: "Cauliflower", emoji: "🥦", type: "vegetable" },
      { name: "Broccoli", emoji: "🥦", type: "vegetable" },
      { name: "Green Peas", emoji: "🫛", type: "vegetable", tip: "Early harvest" },
      { name: "Potato (New)", emoji: "🥔", type: "vegetable" },
      { name: "Garlic (Fresh)", emoji: "🧄", type: "vegetable" },
      { name: "Spinach", emoji: "🥬", type: "vegetable" },
    ],
  },
  10: {
    // November
    season: "Winter",
    items: [
      { name: "Orange", emoji: "🍊", type: "fruit", tip: "Nagpur oranges arrive!" },
      { name: "Guava", emoji: "🍏", type: "fruit" },
      { name: "Grapes (Early)", emoji: "🍇", type: "fruit" },
      { name: "Amla", emoji: "🫒", type: "fruit", tip: "Immunity booster season" },
      { name: "Green Peas", emoji: "🫛", type: "vegetable", tip: "Peak season" },
      { name: "Cauliflower", emoji: "🥦", type: "vegetable" },
      { name: "Carrots", emoji: "🥕", type: "vegetable" },
      { name: "Methi", emoji: "🌿", type: "vegetable", tip: "Thepla time!" },
      { name: "Radish", emoji: "🫚", type: "vegetable" },
      { name: "Surti Undhiyu Mix", emoji: "🥘", type: "vegetable", tip: "Festival season!" },
    ],
  },
  11: {
    // December
    season: "Winter",
    items: [
      { name: "Strawberry", emoji: "🍓", type: "fruit", tip: "Fresh from Mahabaleshwar" },
      { name: "Orange", emoji: "🍊", type: "fruit" },
      { name: "Grapes", emoji: "🍇", type: "fruit" },
      { name: "Guava", emoji: "🍏", type: "fruit" },
      { name: "Green Peas", emoji: "🫛", type: "vegetable" },
      { name: "Cauliflower", emoji: "🥦", type: "vegetable" },
      { name: "Spinach (Palak)", emoji: "🥬", type: "vegetable", tip: "Palak Paneer weather!" },
      { name: "Methi", emoji: "🌿", type: "vegetable" },
      { name: "Broccoli", emoji: "🥦", type: "vegetable" },
      { name: "Potato", emoji: "🥔", type: "vegetable" },
    ],
  },
};

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const SEASON_CONFIG: Record<string, { icon: React.ElementType; gradient: string; bgTint: string; badge: string }> = {
  Winter:  { icon: Snowflake,  gradient: "from-sky-500 to-blue-600",      bgTint: "bg-sky-50",    badge: "bg-sky-100 text-sky-700" },
  Spring:  { icon: Leaf,       gradient: "from-lime-500 to-emerald-600",  bgTint: "bg-lime-50",   badge: "bg-lime-100 text-lime-700" },
  Summer:  { icon: Sun,        gradient: "from-amber-400 to-orange-500",  bgTint: "bg-amber-50",  badge: "bg-amber-100 text-amber-700" },
  Monsoon: { icon: CloudRain,  gradient: "from-teal-500 to-cyan-600",     bgTint: "bg-teal-50",   badge: "bg-teal-100 text-teal-700" },
  Autumn:  { icon: Leaf,       gradient: "from-orange-400 to-red-500",    bgTint: "bg-orange-50", badge: "bg-orange-100 text-orange-700" },
};

/* ═══════════════════════════════════════
   HELPER — generate calendar days
   ═══════════════════════════════════════ */

function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const days: { day: number; currentMonth: boolean }[] = [];

  // Previous month fill
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({ day: prevMonthDays - i, currentMonth: false });
  }
  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    days.push({ day: d, currentMonth: true });
  }
  // Next month fill
  const remaining = 42 - days.length; // 6 rows × 7 cols
  for (let d = 1; d <= remaining; d++) {
    days.push({ day: d, currentMonth: false });
  }

  return days;
}

/* ═══════════════════════════════════════
   PAGE COMPONENT
   ═══════════════════════════════════════ */

export default function BuyerCalendarPage() {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [filter, setFilter] = useState<"all" | "fruit" | "vegetable">("all");

  const calendarDays = getCalendarDays(currentYear, currentMonth);
  const seasonData = SEASONAL_DATA[currentMonth];
  const seasonCfg = SEASON_CONFIG[seasonData.season];
  const SeasonIcon = seasonCfg.icon;

  const isToday = (day: number, isCurrent: boolean) =>
    isCurrent &&
    day === today.getDate() &&
    currentMonth === today.getMonth() &&
    currentYear === today.getFullYear();

  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const goToToday = () => {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
  };

  const filteredItems =
    filter === "all"
      ? seasonData.items
      : seasonData.items.filter((i) => i.type === filter);

  const fruitsCount = seasonData.items.filter((i) => i.type === "fruit").length;
  const veggiesCount = seasonData.items.filter((i) => i.type === "vegetable").length;

  return (
    <div className="space-y-7 animate-in fade-in duration-300">
      {/* ── Page Header ───────────────────── */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl tracking-tight">
            Seasonal Calendar
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Discover what&apos;s in season — Gujarat &amp; India
          </p>
        </div>
        <Link
          href="/buyer/browse"
          className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 shadow-sm hover:border-emerald-400 hover:text-emerald-700 transition-all"
        >
          Browse produce
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* ── Season Banner ─────────────────── */}
      <div
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${seasonCfg.gradient} p-6 sm:p-8 text-white shadow-lg`}
      >
        <div className="absolute right-4 top-4 opacity-15 sm:right-8 sm:top-6">
          <SeasonIcon className="h-24 w-24 sm:h-32 sm:w-32" strokeWidth={1} />
        </div>
        <p className="text-xs font-bold uppercase tracking-widest text-white/70">
          {currentYear} · {seasonData.season} Season
        </p>
        <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
          {MONTH_NAMES[currentMonth]}
        </h2>
        <p className="mt-2 text-sm text-white/80 max-w-md">
          {fruitsCount} fruits &amp; {veggiesCount} vegetables are in season this month.
          Eat fresh, eat local!
        </p>
      </div>

      {/* ── Calendar + Produce Grid ────────── */}
      <div className="grid gap-6 lg:grid-cols-[380px_1fr] xl:grid-cols-[420px_1fr]">
        {/* ──── Calendar Card ──────────────── */}
        <div className="rounded-2xl border border-zinc-200/80 bg-white shadow-sm overflow-hidden">
          {/* Calendar header — month navigation */}
          <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
            <button
              onClick={goToPrevMonth}
              className="grid h-9 w-9 place-items-center rounded-xl bg-zinc-100 text-zinc-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="text-center">
              <p className="text-base font-bold text-zinc-900">
                {MONTH_NAMES[currentMonth]} {currentYear}
              </p>
              {!(currentMonth === today.getMonth() && currentYear === today.getFullYear()) && (
                <button
                  onClick={goToToday}
                  className="mt-0.5 text-[11px] font-semibold text-emerald-600 hover:underline"
                >
                  Go to today
                </button>
              )}
            </div>

            <button
              onClick={goToNextMonth}
              className="grid h-9 w-9 place-items-center rounded-xl bg-zinc-100 text-zinc-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Day name headers */}
          <div className="grid grid-cols-7 border-b border-zinc-100 bg-zinc-50/60">
            {DAY_NAMES.map((d) => (
              <div
                key={d}
                className="py-2.5 text-center text-[11px] font-bold uppercase tracking-wider text-zinc-400"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7">
            {calendarDays.map((cell, idx) => (
              <div
                key={idx}
                className={`relative flex h-11 items-center justify-center text-sm transition-colors
                  ${cell.currentMonth ? "text-zinc-800 font-medium" : "text-zinc-300"}
                  ${isToday(cell.day, cell.currentMonth) ? "" : ""}
                `}
              >
                {isToday(cell.day, cell.currentMonth) ? (
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-emerald-600 font-bold text-white shadow-md shadow-emerald-600/30">
                    {cell.day}
                  </span>
                ) : (
                  <span>{cell.day}</span>
                )}
              </div>
            ))}
          </div>

          {/* Month quick-jump */}
          <div className="border-t border-zinc-100 p-4">
            <p className="mb-2.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              Quick Jump
            </p>
            <div className="grid grid-cols-4 gap-1.5">
              {MONTH_NAMES.map((m, i) => (
                <button
                  key={m}
                  onClick={() => setCurrentMonth(i)}
                  className={`rounded-lg px-1 py-1.5 text-xs font-semibold transition-all
                    ${
                      i === currentMonth
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "text-zinc-500 hover:bg-emerald-50 hover:text-emerald-700"
                    }
                  `}
                >
                  {m.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ──── Seasonal Produce List ─────── */}
        <div className="space-y-5">
          {/* Filter tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {(
              [
                { key: "all", label: "All", count: seasonData.items.length },
                { key: "fruit", label: "Fruits", count: fruitsCount, icon: Apple },
                { key: "vegetable", label: "Vegetables", count: veggiesCount, icon: Carrot },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-all
                  ${
                    filter === tab.key
                      ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/20"
                      : "bg-white text-zinc-600 border border-zinc-200 hover:border-emerald-300 hover:text-emerald-700"
                  }
                `}
              >
                {tab.icon && <tab.icon className="h-3.5 w-3.5" />}
                {tab.label}
                <span
                  className={`ml-0.5 text-xs ${filter === tab.key ? "text-white/70" : "text-zinc-400"}`}
                >
                  ({tab.count})
                </span>
              </button>
            ))}
          </div>

          {/* Produce cards */}
          <div className="grid gap-3 sm:grid-cols-2">
            {filteredItems.map((item) => (
              <div
                key={item.name}
                className={`group relative overflow-hidden rounded-2xl border bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5
                  ${
                    item.type === "fruit"
                      ? "border-amber-200/60 hover:border-amber-300"
                      : "border-emerald-200/60 hover:border-emerald-300"
                  }
                `}
              >
                {/* Type badge */}
                <span
                  className={`absolute top-3 right-3 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider
                    ${
                      item.type === "fruit"
                        ? "bg-amber-50 text-amber-600"
                        : "bg-emerald-50 text-emerald-600"
                    }
                  `}
                >
                  {item.type}
                </span>

                <div className="flex items-center gap-3">
                  <div
                    className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl text-2xl border transition-colors
                      ${
                        item.type === "fruit"
                          ? "bg-amber-50 border-amber-100 group-hover:bg-amber-100"
                          : "bg-emerald-50 border-emerald-100 group-hover:bg-emerald-100"
                      }
                    `}
                  >
                    {item.emoji}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[15px] font-bold text-zinc-900 truncate pr-14">
                      {item.name}
                    </h3>
                    {item.tip && (
                      <p className="mt-0.5 text-xs text-zinc-500 italic">{item.tip}</p>
                    )}
                  </div>
                </div>

                {/* Link to browse */}
                <Link
                  href={`/buyer/browse?q=${encodeURIComponent(item.name.split("(")[0].trim())}`}
                  className={`mt-3 inline-flex items-center gap-1 text-xs font-semibold transition-colors
                    ${
                      item.type === "fruit"
                        ? "text-amber-600 hover:text-amber-700"
                        : "text-emerald-600 hover:text-emerald-700"
                    }
                  `}
                >
                  Find listings →
                </Link>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-12 text-center">
              <p className="text-sm text-zinc-400">No {filter}s found this month.</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Year Overview Strip ────────────── */}
      <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-bold text-zinc-900 mb-4">Year at a Glance</h3>
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-2">
          {MONTH_NAMES.map((m, i) => {
            const s = SEASONAL_DATA[i];
            const cfg = SEASON_CONFIG[s.season];
            const isActive = i === currentMonth;
            return (
              <button
                key={m}
                onClick={() => {
                  setCurrentMonth(i);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`group relative rounded-xl p-3 text-center transition-all
                  ${isActive ? `bg-gradient-to-br ${cfg.gradient} text-white shadow-md` : `${cfg.bgTint} hover:shadow-sm`}
                `}
              >
                <p className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? "text-white/70" : "text-zinc-400"}`}>
                  {m.slice(0, 3)}
                </p>
                <p className={`mt-1 text-lg font-extrabold ${isActive ? "text-white" : "text-zinc-700"}`}>
                  {s.items.length}
                </p>
                <p className={`text-[10px] ${isActive ? "text-white/60" : "text-zinc-400"}`}>items</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
