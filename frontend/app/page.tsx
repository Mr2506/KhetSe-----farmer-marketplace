import Link from "next/link";
import { Leaf, ArrowRight, ArrowDown, Search, ShoppingCart, ShoppingBag, ChevronDown } from "lucide-react";

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
      
      {/* --- SECTION 1: HERO (The Elevated Box) --- */}
      <div className="mx-auto w-full max-w-5xl px-4 pt-12 sm:px-6 lg:pt-20">
        <div className="flex flex-col justify-center rounded-3xl border border-emerald-600/20 bg-white p-8 shadow-[0_0_40px_rgba(45,138,78,0.06)] sm:p-12 lg:p-16">
          
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-medium text-emerald-800">
            <Leaf className="h-4 w-4" />
            KhetSe — farm to table
          </div>
          
          <h1 className="mt-6 max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Fresh produce, direct from farmers near you.
          </h1>
          
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-zinc-600">
            One phone number. Three roles. Buyers browse local harvests, farmers manage listings and orders,
            and admins keep the marketplace running — all in one mobile-first app.
          </p>
          
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/login"
              className="group inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-600/25"
            >
              Sign in with phone
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center rounded-xl border border-zinc-200 bg-zinc-50 px-6 py-3.5 text-sm font-bold text-zinc-800 transition-all hover:border-zinc-300 hover:bg-zinc-100"
            >
              Explore demo
            </Link>
          </div>
          
          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {[
              { title: "Buyer", desc: "Browse, cart, checkout, track orders" },
              { title: "Farmer", desc: "List crops, fulfill orders, earn more" },
              { title: "Admin", desc: "Verify farmers, monitor platform health" },
            ].map((card) => (
              <div 
                key={card.title} 
                className="group cursor-default rounded-2xl border border-zinc-200 bg-[#fdfdf9] p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/10"
              >
                <p className="font-bold text-zinc-900 transition-colors group-hover:text-emerald-700">{card.title}</p>
                <p className="mt-1 text-sm text-zinc-500">{card.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* --- SECTION 2: NO MIDDLEMEN (Visual Graphic) --- */}
      <div className="mx-auto w-full max-w-5xl px-4 pt-20 sm:px-6 lg:pt-32">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-zinc-900">No middlemen. Just farmers and you.</h2>
          <p className="mt-4 text-lg text-zinc-600">
            KhetSe connects local farmers directly to your neighborhood — cutting out the agents and retailers who take 80% of the price difference.
          </p>
        </div>

        {/* The Old Way */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-10 shadow-sm">
          <p className="text-center text-sm font-bold text-zinc-400 mb-6 uppercase tracking-widest">The Old Way</p>
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 md:gap-4">
            
            <div className="w-full md:w-1/4 rounded-2xl border border-red-100 bg-red-50/50 p-4 text-center shadow-sm">
              <span className="text-2xl">🧑‍🌾</span><p className="mt-2 font-bold text-zinc-900">Farmer</p><p className="text-sm font-bold text-emerald-600">₹10/kg</p>
            </div>
            
            <ArrowRight className="hidden md:block text-zinc-300 w-6 h-6" />
            <ArrowDown className="md:hidden text-zinc-300 w-5 h-5 my-2" />
            
            <div className="w-full md:w-1/4 rounded-2xl border border-red-200 bg-red-50 p-4 text-center shadow-sm">
              <span className="text-2xl">🤝</span><p className="mt-2 font-bold text-zinc-900">Agents</p><p className="text-sm font-bold text-red-500">₹25/kg</p>
            </div>
            
            <ArrowRight className="hidden md:block text-zinc-300 w-6 h-6" />
            <ArrowDown className="md:hidden text-zinc-300 w-5 h-5 my-2" />
            
            <div className="w-full md:w-1/4 rounded-2xl border border-red-200 bg-red-50 p-4 text-center shadow-sm">
              <span className="text-2xl">🏪</span><p className="mt-2 font-bold text-zinc-900">Retailer</p><p className="text-sm font-bold text-red-500">₹40/kg</p>
            </div>
            
            <ArrowRight className="hidden md:block text-zinc-300 w-6 h-6" />
            <ArrowDown className="md:hidden text-zinc-300 w-5 h-5 my-2" />
            
            <div className="w-full md:w-1/4 rounded-2xl border border-red-200 bg-white p-4 text-center shadow-md border-b-4 border-b-red-200">
              <span className="text-2xl">🏠</span><p className="mt-2 font-bold text-zinc-900">You pay</p><p className="text-sm font-bold text-red-600">₹50/kg</p>
            </div>
          </div>
          <p className="text-center text-sm text-zinc-500 mt-6 italic">The farmer gets ₹10, you pay ₹50. Massive markup with zero benefit.</p>
        </div>

        {/* The KhetSe Way */}
        <div className="relative mt-8 rounded-3xl border-2 border-emerald-500 bg-emerald-50/30 p-6 sm:p-10 shadow-lg shadow-emerald-600/10">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-emerald-500 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm">
            The KhetSe Way
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-12 mt-4">
            
            <div className="w-full md:w-1/3 rounded-2xl border-2 border-emerald-200 bg-white p-6 text-center shadow-sm transition-transform hover:-translate-y-1">
              <span className="text-4xl">🧑‍🌾</span>
              <p className="mt-3 text-lg font-bold text-zinc-900">Farmer</p>
              <p className="text-2xl font-black text-emerald-600 mt-1">₹35/kg</p>
              <div className="mx-auto mt-3 w-fit rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">Earns 3.5x more</div>
            </div>
            
            <div className="flex flex-col items-center">
              <ArrowRight className="hidden md:block text-emerald-500 w-10 h-10" />
              <ArrowDown className="md:hidden text-emerald-500 w-8 h-8 my-4" />
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-2 hidden md:block">Direct</span>
            </div>
            
            <div className="w-full md:w-1/3 rounded-2xl border-2 border-emerald-200 bg-white p-6 text-center shadow-sm transition-transform hover:-translate-y-1">
              <span className="text-4xl">🏠</span>
              <p className="mt-3 text-lg font-bold text-zinc-900">You pay</p>
              <p className="text-2xl font-black text-emerald-600 mt-1">₹35/kg</p>
              <div className="mx-auto mt-3 w-fit rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">Save ₹15 vs market</div>
            </div>

          </div>
        </div>
      </div>

      {/* --- SECTION 3: HOW IT WORKS (3 Simple Steps) --- */}
      <div className="mx-auto w-full max-w-5xl px-4 pt-24 sm:px-6 lg:pt-32">
        <div className="text-center mb-12">
          <p className="text-sm font-bold text-emerald-600 uppercase tracking-widest mb-2">For Buyers</p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-zinc-900">Order in 3 simple steps</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Step 1 */}
          <div className="rounded-3xl border border-zinc-200 bg-white p-8 text-center shadow-sm transition-all hover:shadow-md hover:border-emerald-200">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-6">
              <Search className="h-8 w-8" />
            </div>
            <div className="mx-auto flex h-6 w-6 items-center justify-center rounded-full bg-zinc-900 text-xs font-bold text-white mb-4">1</div>
            <h3 className="text-lg font-bold text-zinc-900">Browse & Search</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-500">Filter by crop, distance, or organic certification. See farm prices vs mandi prices side by side.</p>
          </div>

          {/* Step 2 */}
          <div className="rounded-3xl border border-zinc-200 bg-white p-8 text-center shadow-sm transition-all hover:shadow-md hover:border-emerald-200">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-6">
              <ShoppingCart className="h-8 w-8" />
            </div>
            <div className="mx-auto flex h-6 w-6 items-center justify-center rounded-full bg-zinc-900 text-xs font-bold text-white mb-4">2</div>
            <h3 className="text-lg font-bold text-zinc-900">Place your order</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-500">Select how many kgs you need, add to cart, and confirm your order directly with the farmer.</p>
          </div>

          {/* Step 3 */}
          <div className="rounded-3xl border border-zinc-200 bg-white p-8 text-center shadow-sm transition-all hover:shadow-md hover:border-emerald-200">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-6">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <div className="mx-auto flex h-6 w-6 items-center justify-center rounded-full bg-zinc-900 text-xs font-bold text-white mb-4">3</div>
            <h3 className="text-lg font-bold text-zinc-900">Get fresh produce</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-500">Pick it up from the farm or have it delivered. Enjoy fresher, healthier food for your family.</p>
          </div>
        </div>
      </div>

      {/* --- SECTION 4: FREQUENTLY ASKED QUESTIONS --- */}
      <div className="mx-auto w-full max-w-3xl px-4 pt-24 sm:px-6 lg:pt-32 mb-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900">Frequently asked questions</h2>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <details 
              key={i} 
              className="group rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:border-emerald-200 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-4 font-bold text-zinc-900 outline-none">
                {faq.q}
                <ChevronDown className="h-5 w-5 shrink-0 text-emerald-600 transition-transform duration-300 group-open:-rotate-180" />
              </summary>
              <p className="mt-4 text-sm leading-relaxed text-zinc-500">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </div>

    </main>
  );
}