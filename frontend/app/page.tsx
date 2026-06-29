import Link from "next/link";
import { Leaf, ArrowRight, ArrowDown, Search, ShoppingCart, ShoppingBag, ChevronDown, Sparkles, ShieldCheck, TrendingUp } from "lucide-react";
import { HomeHeader } from "@/components/home/home-header";

export default function LandingPage() {
  const faqs = [
    {
      q: "Do you deliver to my house, or do I have to pick it up?",
      a: "It depends on the farmer! When you browse listings, each farmer specifies if they offer home delivery, farm pickup, or both. You can choose your preferred method during checkout."
    },
    {
      q: "How do you guarantee the produce is fresh?",
      a: "KhetSe cuts out the middlemen and storage warehouses entirely. The produce you buy on our platform is often harvested the exact same morning you receive it."
    },
    {
      q: "Is the produce certified organic?",
      a: "We feature both organic and conventionally grown produce. You can easily use the 'Organic only' filter on the Browse page to find certified or naturally grown items."
    },
    {
      q: "How does the farmer get paid?",
      a: "You pay the farmer directly upon delivery or pickup. KhetSe does not take massive commissions, ensuring the farmer keeps the money they deserve."
    }
  ];

  return (
    <main className="min-h-screen bg-[#f6f4ef] text-zinc-900 pb-24 font-sans overflow-x-hidden">
      
      {/* Top Navbar Header */}
      <HomeHeader />

      {/* --- SECTION 1: HERO (The Elevated Box) --- */}
      <div className="mx-auto w-full max-w-[1400px] px-4 pt-6 sm:px-6 lg:pt-10">
        <div className="relative overflow-hidden flex flex-col justify-center rounded-3xl border border-emerald-600/20 bg-white p-8 shadow-[0_10px_40px_rgba(45,138,78,0.08)] sm:p-12 lg:p-16">
          
          {/* Subtle background glow blob */}
          <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />

          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200/80 bg-emerald-50/80 px-4 py-1.5 text-sm font-semibold text-emerald-800 shadow-xs backdrop-blur-xs">
            <Sparkles className="h-4 w-4 text-emerald-600" />
            KhetSe — Direct Farm Marketplace
          </div>
          
          <h1 className="mt-6 max-w-4xl text-4xl font-black tracking-tight text-zinc-950 sm:text-5xl lg:text-6xl xl:text-7xl">
            Fresh produce, direct from farmers near you.
          </h1>
          
          <p className="mt-4 max-w-2xl text-lg sm:text-xl leading-relaxed text-zinc-600 font-normal">
            One phone number. Three roles. Buyers browse local harvests, farmers manage listings and orders,
            and admins keep the marketplace running — all in one seamless app.
          </p>
          
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/login"
              className="group inline-flex items-center gap-2.5 rounded-2xl bg-emerald-600 px-7 py-4 text-base font-bold text-white shadow-lg shadow-emerald-600/25 transition-all duration-300 hover:-translate-y-1 hover:bg-emerald-500 hover:shadow-xl hover:shadow-emerald-600/35"
            >
              Sign in with phone
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center rounded-2xl border border-zinc-200 bg-zinc-50/80 px-7 py-4 text-base font-bold text-zinc-800 shadow-xs transition-all duration-300 hover:border-zinc-300 hover:bg-white hover:shadow-md"
            >
              Explore Demo Portal
            </Link>
          </div>
          
          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {[
              { title: "Buyer", desc: "Browse fresh harvests, cart, checkout, track delivery", icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-50" },
              { title: "Farmer", desc: "List crops direct, fulfill orders, maximize profits", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
              { title: "Admin", desc: "Verify farmers, monitor overall marketplace health", icon: ShieldCheck, color: "text-purple-600", bg: "bg-purple-50" },
            ].map((card) => {
              const IconComp = card.icon;
              return (
                <div 
                  key={card.title} 
                  className="group cursor-pointer rounded-2xl border border-zinc-200/90 bg-[#fdfdf9] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/10"
                >
                  <div className={`mb-3 grid h-10 w-10 place-items-center rounded-xl ${card.bg} ${card.color} transition-transform duration-300 group-hover:scale-110`}>
                    <IconComp className="h-5 w-5" />
                  </div>
                  <p className="text-lg font-bold text-zinc-900 transition-colors group-hover:text-emerald-700">{card.title}</p>
                  <p className="mt-1.5 text-sm text-zinc-500 leading-relaxed">{card.desc}</p>
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* --- SECTION 2: NO MIDDLEMEN (Visual Graphic) --- */}
      <div className="mx-auto w-full max-w-[1400px] px-4 pt-20 sm:px-6 lg:pt-28">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-100/70 px-3 py-1 rounded-full border border-emerald-200">
            Transparent Pricing
          </span>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl text-zinc-950">
            No middlemen. Just farmers and you.
          </h2>
          <p className="mt-4 text-lg text-zinc-600 leading-relaxed">
            KhetSe connects local farmers directly to your neighborhood — cutting out the agents and retailers who take 80% of the price difference.
          </p>
        </div>

        {/* The Old Way */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-10 shadow-sm transition-all hover:shadow-md">
          <p className="text-center text-xs font-black text-zinc-400 mb-6 uppercase tracking-widest">The Old Way</p>
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
            
            <div className="w-full md:w-1/4 rounded-2xl border border-red-100 bg-red-50/40 p-5 text-center shadow-xs">
              <span className="text-4xl">🧑‍🌾</span>
              <p className="mt-2 font-bold text-zinc-900">Farmer</p>
              <p className="text-sm font-bold text-emerald-600 mt-0.5">₹10/kg</p>
            </div>
            
            <ArrowRight className="hidden md:block text-zinc-300 w-6 h-6 shrink-0" />
            <ArrowDown className="md:hidden text-zinc-300 w-5 h-5 my-2" />
            
            <div className="w-full md:w-1/4 rounded-2xl border border-red-200 bg-red-50/80 p-5 text-center shadow-xs">
              <span className="text-4xl">🤝</span>
              <p className="mt-2 font-bold text-zinc-900">Agents</p>
              <p className="text-sm font-bold text-red-500 mt-0.5">₹25/kg</p>
            </div>
            
            <ArrowRight className="hidden md:block text-zinc-300 w-6 h-6 shrink-0" />
            <ArrowDown className="md:hidden text-zinc-300 w-5 h-5 my-2" />
            
            <div className="w-full md:w-1/4 rounded-2xl border border-red-200 bg-red-50/80 p-5 text-center shadow-xs">
              <span className="text-4xl">🏪</span>
              <p className="mt-2 font-bold text-zinc-900">Retailer</p>
              <p className="text-sm font-bold text-red-500 mt-0.5">₹40/kg</p>
            </div>
            
            <ArrowRight className="hidden md:block text-zinc-300 w-6 h-6 shrink-0" />
            <ArrowDown className="md:hidden text-zinc-300 w-5 h-5 my-2" />
            
            <div className="w-full md:w-1/4 rounded-2xl border-2 border-red-200 bg-white p-5 text-center shadow-md">
              <span className="text-4xl">🏠</span>
              <p className="mt-2 font-bold text-zinc-900">You Pay</p>
              <p className="text-base font-black text-red-600 mt-0.5">₹50/kg</p>
            </div>
          </div>
          <p className="text-center text-xs text-zinc-500 mt-6 font-medium">The farmer receives ₹10 while you pay ₹50 — massive markup with zero benefit.</p>
        </div>

        {/* The KhetSe Way */}
        <div className="relative mt-8 rounded-3xl border-2 border-emerald-500 bg-gradient-to-br from-emerald-50/50 to-teal-50/30 p-6 sm:p-10 shadow-xl shadow-emerald-600/10">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-emerald-600 px-5 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-md">
            The KhetSe Way
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 mt-4">
            
            <div className="w-full md:w-1/3 rounded-2xl border-2 border-emerald-200 bg-white p-6 text-center shadow-md transition-transform duration-300 hover:-translate-y-1">
              <span className="text-5xl">🧑‍🌾</span>
              <p className="mt-3 text-lg font-bold text-zinc-900">Farmer Earns</p>
              <p className="text-3xl font-black text-emerald-600 mt-1">₹35/kg</p>
              <div className="mx-auto mt-3 w-fit rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
                Earns 3.5x more
              </div>
            </div>
            
            <div className="flex flex-col items-center">
              <ArrowRight className="hidden md:block text-emerald-500 w-10 h-10 animate-pulse" />
              <ArrowDown className="md:hidden text-emerald-500 w-8 h-8 my-4" />
              <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mt-2 hidden md:block bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                Direct
              </span>
            </div>
            
            <div className="w-full md:w-1/3 rounded-2xl border-2 border-emerald-200 bg-white p-6 text-center shadow-md transition-transform duration-300 hover:-translate-y-1">
              <span className="text-5xl">🏠</span>
              <p className="mt-3 text-lg font-bold text-zinc-900">You Pay</p>
              <p className="text-3xl font-black text-emerald-600 mt-1">₹35/kg</p>
              <div className="mx-auto mt-3 w-fit rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
                Save ₹15 vs market
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* --- SECTION 3: HOW IT WORKS (3 Simple Steps) --- */}
      <div className="mx-auto w-full max-w-[1400px] px-4 pt-24 sm:px-6 lg:pt-32">
        <div className="text-center mb-12">
          <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-2 bg-emerald-100/60 w-fit mx-auto px-3 py-1 rounded-full">
            For Buyers
          </p>
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl text-zinc-950">
            Order fresh produce in 3 simple steps
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Step 1 */}
          <div className="rounded-3xl border border-zinc-200/90 bg-white p-8 text-center shadow-sm transition-all duration-300 hover:shadow-xl hover:border-emerald-300 hover:-translate-y-1">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-6 shadow-sm">
              <Search className="h-8 w-8" />
            </div>
            <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900 text-xs font-black text-white mb-4 shadow-sm">1</div>
            <h3 className="text-xl font-bold text-zinc-900">Browse & Search</h3>
            <p className="mt-2.5 text-sm leading-relaxed text-zinc-500">Filter by crop, farm distance, or organic certification. Compare direct farm prices side by side.</p>
          </div>

          {/* Step 2 */}
          <div className="rounded-3xl border border-zinc-200/90 bg-white p-8 text-center shadow-sm transition-all duration-300 hover:shadow-xl hover:border-emerald-300 hover:-translate-y-1">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-6 shadow-sm">
              <ShoppingCart className="h-8 w-8" />
            </div>
            <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900 text-xs font-black text-white mb-4 shadow-sm">2</div>
            <h3 className="text-xl font-bold text-zinc-900">Place Your Order</h3>
            <p className="mt-2.5 text-sm leading-relaxed text-zinc-500">Select how many kilograms you need, add to cart, and confirm your order direct with local farmers.</p>
          </div>

          {/* Step 3 */}
          <div className="rounded-3xl border border-zinc-200/90 bg-white p-8 text-center shadow-sm transition-all duration-300 hover:shadow-xl hover:border-emerald-300 hover:-translate-y-1">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-6 shadow-sm">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900 text-xs font-black text-white mb-4 shadow-sm">3</div>
            <h3 className="text-xl font-bold text-zinc-900">Get Fresh Harvest</h3>
            <p className="mt-2.5 text-sm leading-relaxed text-zinc-500">Pick up direct from the farm or choose doorstep delivery. Enjoy healthier, morning-harvested produce.</p>
          </div>
        </div>
      </div>

      {/* --- SECTION 4: FREQUENTLY ASKED QUESTIONS --- */}
      <div className="mx-auto w-full max-w-4xl px-4 pt-24 sm:px-6 lg:pt-32 mb-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black tracking-tight text-zinc-950">Frequently Asked Questions</h2>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <details 
              key={i} 
              className="group rounded-2xl border border-zinc-200/90 bg-white p-6 shadow-xs transition-all duration-200 hover:border-emerald-400 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-4 text-base font-bold text-zinc-900 outline-none">
                {faq.q}
                <ChevronDown className="h-5 w-5 shrink-0 text-emerald-600 transition-transform duration-300 group-open:-rotate-180" />
              </summary>
              <p className="mt-4 text-sm leading-relaxed text-zinc-600 font-normal">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </div>

    </main>
  );
}