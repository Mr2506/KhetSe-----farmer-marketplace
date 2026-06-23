import Link from "next/link";
import { Leaf, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#f6f4ef] text-zinc-900">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-4 py-12 sm:px-6">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-medium text-emerald-800">
          <Leaf className="h-4 w-4" />
          KhetSe — farm to table
        </div>
        <h1 className="mt-6 max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
          Fresh produce, direct from farmers near you.
        </h1>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-zinc-600">
          One phone number. Three roles. Buyers browse local harvests, farmers manage listings and orders,
          and admins keep the marketplace running — all in one mobile-first app.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-500"
          >
            Sign in with phone
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center rounded-xl border border-zinc-200 bg-white px-6 py-3 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
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
            <div key={card.title} className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm">
              <p className="font-bold text-zinc-900">{card.title}</p>
              <p className="mt-1 text-sm text-zinc-500">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
