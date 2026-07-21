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

const SEASON_CONFIG: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  Winter:  { icon: Snowflake,  color: "text-zinc-600", bg: "bg-zinc-50" },
  Spring:  { icon: Leaf,       color: "text-[#2E7D32]", bg: "bg-[#2E7D32]/5" },
  Summer:  { icon: Sun,        color: "text-[#EF9F27]", bg: "bg-[#EF9F27]/5" },
  Monsoon: { icon: CloudRain,  color: "text-zinc-800", bg: "bg-zinc-100" },
  Autumn:  { icon: Leaf,       color: "text-zinc-600", bg: "bg-zinc-50" },
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
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans">
      {/* ── Page Header ───────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div className="max-w-xl">
          <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-zinc-900">
            Harvest Calendar
          </h1>
          <p className="mt-4 text-base text-zinc-600 leading-relaxed">
            Plan your sourcing based on natural growing cycles. Buying in-season produce means better quality, lower farm-gate prices, and less reliance on cold-storage stock.
          </p>
        </div>
        <Link
          href="/buyer/browse"
          className="inline-flex items-center gap-2 rounded-sm bg-[#EF9F27] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#d68b20] focus:outline-none focus:ring-2 focus:ring-[#EF9F27] focus:ring-offset-2"
        >
          View active market prices
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12 lg:gap-20 items-start">
        {/* ──── Left Column: Calendar & Filters ──────────────── */}
        <div className="flex flex-col gap-10 lg:sticky lg:top-8">
          
          {/* Functional Calendar */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-zinc-900">
                {MONTH_NAMES[currentMonth]} {currentYear}
              </h2>
              <div className="flex gap-1">
                <button
                  onClick={goToPrevMonth}
                  className="p-1.5 text-zinc-400 hover:text-zinc-900 transition-colors"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={goToNextMonth}
                  className="p-1.5 text-zinc-400 hover:text-zinc-900 transition-colors"
                  aria-label="Next month"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 mb-2">
              {DAY_NAMES.map((d) => (
                <div key={d} className="text-center text-[10px] font-medium uppercase tracking-widest text-zinc-500">
                  {d.charAt(0)}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-y-1">
              {calendarDays.map((cell, idx) => {
                const isCurrentToday = isToday(cell.day, cell.currentMonth);
                return (
                  <div
                    key={idx}
                    className={`flex h-8 items-center justify-center text-sm
                      ${!cell.currentMonth ? "text-zinc-300" : "text-zinc-700"}
                    `}
                  >
                    {isCurrentToday ? (
                      <span className="flex h-7 w-7 items-center justify-center rounded-sm bg-[#2E7D32] text-white font-medium">
                        {cell.day}
                      </span>
                    ) : (
                      <span>{cell.day}</span>
                    )}
                  </div>
                );
              })}
            </div>

            {!(currentMonth === today.getMonth() && currentYear === today.getFullYear()) && (
              <button
                onClick={goToToday}
                className="mt-4 text-xs font-medium text-zinc-500 hover:text-[#2E7D32] transition-colors"
              >
                Return to today
              </button>
            )}
          </div>

          {/* Type Filter */}
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400 mb-3 border-b border-zinc-100 pb-2">
              Filter Produce
            </h3>
            <div className="flex flex-col gap-1.5">
              {(
                [
                  { key: "all", label: "Everything in season", count: seasonData.items.length },
                  { key: "fruit", label: "Fruits only", count: fruitsCount },
                  { key: "vegetable", label: "Vegetables only", count: veggiesCount },
                ]
              ).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key as "all" | "fruit" | "vegetable")}
                  className={`flex items-center justify-between px-2 py-1.5 text-sm transition-colors text-left
                    ${filter === tab.key
                      ? "font-medium text-[#2E7D32] bg-[#2E7D32]/5 rounded-sm"
                      : "text-zinc-600 hover:text-zinc-900"
                    }
                  `}
                >
                  <span>{tab.label}</span>
                  <span className={`text-xs ${filter === tab.key ? "text-[#2E7D32]" : "text-zinc-400"}`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Year Strip / Quick Jump */}
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400 mb-3 border-b border-zinc-100 pb-2">
              Jump to month
            </h3>
            <div className="grid grid-cols-3 gap-1">
              {MONTH_NAMES.map((m, i) => (
                <button
                  key={m}
                  onClick={() => {
                    setCurrentMonth(i);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`py-1.5 text-xs transition-colors rounded-sm
                    ${i === currentMonth
                      ? "bg-zinc-800 text-white font-medium"
                      : "text-zinc-500 hover:bg-zinc-100"
                    }
                  `}
                >
                  {m.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ──── Right Column: Seasonal Produce List ─────── */}
        <div>
          {/* Season Banner - Earthy, asymmetric */}
          <div className={`mb-10 border-l-2 border-[#2E7D32] ${seasonCfg.bg} px-6 py-8 sm:px-8 flex flex-col sm:flex-row sm:items-start justify-between gap-6`}>
            <div>
              <div className={`flex items-center gap-2 mb-2 ${seasonCfg.color}`}>
                <SeasonIcon className="h-4 w-4" strokeWidth={2} />
                <span className="text-[11px] font-bold uppercase tracking-widest">
                  {seasonData.season} Harvest
                </span>
              </div>
              <h2 className="text-2xl font-medium text-zinc-900">
                Peak availability for {MONTH_NAMES[currentMonth]}
              </h2>
            </div>
            
            <div className="text-sm text-zinc-600 sm:max-w-[220px] sm:border-l sm:border-zinc-300/60 sm:pl-6">
              Prices for {MONTH_NAMES[currentMonth]} staples tend to drop mid-month as regional supply peaks.
            </div>
          </div>

          {/* Produce List (Minimalist, row-based) */}
          <div className="flex flex-col">
            <div className="grid grid-cols-12 gap-4 border-b border-zinc-200 pb-3 mb-2 px-2 text-xs font-medium text-zinc-400 uppercase tracking-wider hidden sm:grid">
              <div className="col-span-6">Crop</div>
              <div className="col-span-3">Category</div>
              <div className="col-span-3 text-right">Action</div>
            </div>

            {filteredItems.map((item) => (
              <div
                key={item.name}
                className="group grid grid-cols-1 sm:grid-cols-12 gap-4 items-center py-4 px-2 border-b border-zinc-100 last:border-0 hover:bg-zinc-50/50 transition-colors"
              >
                <div className="col-span-1 sm:col-span-6 flex items-start gap-3">
                  <span className="text-xl pt-0.5" aria-hidden="true">{item.emoji}</span>
                  <div>
                    <h3 className="text-base font-medium text-zinc-900">
                      {item.name}
                    </h3>
                    {item.tip && (
                      <p className="mt-0.5 text-sm text-zinc-500">
                        {item.tip}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="col-span-1 sm:col-span-3 hidden sm:block">
                  <span className="text-xs text-zinc-500 capitalize">
                    {item.type}
                  </span>
                </div>
                
                <div className="col-span-1 sm:col-span-3 sm:text-right mt-2 sm:mt-0">
                  <Link
                    href={`/buyer/browse?q=${encodeURIComponent(item.name.split("(")[0].trim())}`}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[#2E7D32] hover:text-[#236326] transition-colors"
                  >
                    Check farmers
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            ))}

            {filteredItems.length === 0 && (
              <div className="py-16 text-center">
                <p className="text-sm text-zinc-500">No {filter}s are recorded for this month's peak season.</p>
                <button 
                  onClick={() => setFilter("all")}
                  className="mt-2 text-sm font-medium text-[#2E7D32] hover:underline"
                >
                  View all produce
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
