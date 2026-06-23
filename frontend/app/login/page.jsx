import Link from "next/link";

import { ArrowRight, Leaf, PhoneCall, ShieldCheck, Truck, Users } from "lucide-react";

const trustPoints = [
  {
    icon: ShieldCheck,
    title: "Quick sign in",
    description: "Phone-based login keeps the flow quick and familiar.",
  },
  {
    icon: Truck,
    title: "Community connection",
    description: "Bring farmers and buyers into one shared space.",
  },
  {
    icon: Users,
    title: "Buyer and farmer access",
    description: "One entry point, two tailored experiences.",
  },
];

const roleCards = [
  {
    title: "Buyer",
    description: "Order fresh produce for your home or business.",
    href: "/signup",
    accent: "border-emerald-400 bg-emerald-50/80 text-emerald-950",
  },
  {
    title: "Farmer",
    description: "Sell your harvest and manage orders from one place.",
    href: "/signup",
    accent: "border-zinc-700 bg-zinc-800 text-white",
  },
];

export default function LoginPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7f4eb] text-zinc-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.16),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(217,119,6,0.12),_transparent_30%),linear-gradient(180deg,_#fbf8f1_0%,_#f2efe6_100%)]" />
      <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(22,101,52,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(22,101,52,0.16)_1px,transparent_1px)] [background-size:56px_56px]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid w-full gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="flex flex-col justify-between rounded-[2rem] border border-emerald-900/10 bg-white/70 p-6 shadow-[0_24px_80px_rgba(16,24,16,0.08)] backdrop-blur-md sm:p-8 lg:min-h-[760px] lg:p-10">
            <div>
              <div className="inline-flex items-center gap-3 rounded-full border border-emerald-600/15 bg-emerald-600/8 px-4 py-2 text-sm font-medium text-emerald-800">
                <Leaf className="h-4 w-4" />
                KhetSe access gateway
              </div>

              <div className="mt-10 max-w-2xl">
                <p className="text-sm uppercase tracking-[0.3em] text-emerald-700">Fresh produce, faster</p>
                <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
                  Sign in with your phone number and join the KhetSe community.
                </h1>
                <p className="mt-4 max-w-xl text-base leading-7 text-zinc-600 sm:text-lg">
                  KhetSe keeps the entry flow light: enter your number and continue as a buyer or farmer in one
                  connected community.
                </p>
              </div>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {trustPoints.map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.title} className="rounded-3xl border border-emerald-900/10 bg-white/80 p-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h2 className="mt-4 text-sm font-semibold text-zinc-900">{item.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-zinc-600">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="flex items-center justify-center">
            <div className="w-full max-w-[560px] rounded-[2rem] border border-emerald-900/10 bg-white p-5 shadow-[0_28px_90px_rgba(16,24,16,0.08)] backdrop-blur sm:p-8">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20">
                  <Leaf className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-semibold tracking-tight text-zinc-900">KhetSe</p>
                  <p className="text-sm text-zinc-500">Login with your phone number</p>
                </div>
              </div>

              <div className="mt-8 rounded-[1.5rem] border border-emerald-900/10 bg-[#f9f7f0] p-5 sm:p-6">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-700">Welcome back</p>
                <h2 className="mt-3 text-2xl font-semibold text-zinc-900">Enter your mobile number</h2>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  Continue with your registered phone number.
                </p>

                <form className="mt-6 space-y-5">
                  <label className="block space-y-2">
                    <span className="text-sm font-medium text-zinc-700">Phone number</span>
                    <div className="flex gap-2">
                      <div className="flex h-12 items-center rounded-xl border border-emerald-900/10 bg-white px-4 text-sm font-medium text-zinc-700">
                        +91
                      </div>
                      <input
                        type="tel"
                        inputMode="numeric"
                        placeholder="98765 43210"
                        className="h-12 flex-1 rounded-xl border border-emerald-900/10 bg-white px-4 text-base text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <p className="text-sm text-zinc-500">No code needed at this time.</p>
                  </label>

                  <button
                    type="submit"
                    className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 hover:bg-emerald-500"
                  >
                    Login
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>

                <div className="my-7 flex items-center gap-4 text-sm text-zinc-500">
                  <div className="h-px flex-1 bg-emerald-900/10" />
                  <span>or continue as</span>
                  <div className="h-px flex-1 bg-emerald-900/10" />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {roleCards.map((card) => (
                    <Link
                      key={card.title}
                      href={card.href}
                      className={`rounded-3xl border p-4 transition-transform duration-200 hover:-translate-y-1 ${card.accent}`}
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 text-current">
                        <PhoneCall className="h-5 w-5" />
                      </div>
                      <h3 className="mt-4 text-base font-semibold">{card.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-current/75">{card.description}</p>
                    </Link>
                  ))}
                </div>

                <div className="mt-6 flex flex-col gap-2 text-center text-sm text-zinc-600 sm:flex-row sm:items-center sm:justify-center sm:gap-1">
                  <span>New here?</span>
                  <Link href="/signup" className="font-semibold text-emerald-700 transition-colors hover:text-emerald-600">
                    Create an account
                  </Link>
                </div>

                <div className="mt-3 text-center text-sm text-zinc-500">
                  <Link href="/" className="transition-colors hover:text-zinc-800">
                    Back to home
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
