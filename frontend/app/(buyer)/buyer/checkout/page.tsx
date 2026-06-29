"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

import { checkoutAction } from "@/lib/actions";
import { useCartStore } from "@/lib/cart-store";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCartStore();
  const [fulfillment, setFulfillment] = useState<"Pickup" | "Delivery">("Delivery");
  const [address, setAddress] = useState("");
  const [timeSlot, setTimeSlot] = useState("4:00 PM - 6:00 PM");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }
    if (fulfillment === "Delivery" && !address.trim()) {
      toast.error("Enter delivery address");
      return;
    }

    setLoading(true);
    try {
      await checkoutAction({
        fulfillment,
        address: fulfillment === "Delivery" ? address : undefined,
        timeSlot,
        items: cart,
      });
      clearCart();
      toast.success("Order placed!");
      router.push("/buyer/orders");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900">Checkout</h1>
        <p className="mt-1 text-sm text-zinc-500">Review fulfillment details and confirm your order</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 lg:items-start lg:gap-8">
        <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-sm lg:col-span-2">
          <fieldset>
            <legend className="text-sm font-semibold text-zinc-700">Fulfillment Method</legend>
            <div className="mt-2.5 grid grid-cols-2 gap-3">
              {(["Pickup", "Delivery"] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setFulfillment(opt)}
                  className={`rounded-xl border py-3 text-sm font-semibold transition-all ${fulfillment === opt ? "border-emerald-500 bg-emerald-50 text-emerald-800 shadow-sm" : "border-zinc-200 text-zinc-600 hover:bg-zinc-50"}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </fieldset>

          {fulfillment === "Delivery" && (
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-zinc-700">Delivery Address</span>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none bg-zinc-50/30"
                placeholder="Street, area, landmark, pin code"
              />
            </label>
          )}

          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-zinc-700">Preferred Time Slot</span>
            <select
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-sm focus:border-emerald-500 focus:outline-none bg-zinc-50/30"
            >
              <option>Morning (8 AM - 11 AM)</option>
              <option>4:00 PM - 6:00 PM</option>
              <option>6:00 PM - 8:00 PM</option>
            </select>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-xl bg-emerald-600 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 disabled:opacity-60 transition-all"
          >
            {loading ? "Placing order…" : "Place order"}
          </button>
        </form>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-zinc-900 text-base border-b border-zinc-100 pb-3">Checkout Details</h3>
          <div className="space-y-3 text-xs sm:text-sm text-zinc-600">
            <p className="flex justify-between"><span>Selected Fulfillment:</span> <span className="font-bold text-zinc-900">{fulfillment}</span></p>
            <p className="flex justify-between"><span>Time Window:</span> <span className="font-bold text-zinc-900">{timeSlot}</span></p>
            <p className="flex justify-between"><span>Payment Method:</span> <span className="font-bold text-emerald-700">Cash on Pickup/Delivery</span></p>
          </div>
          <div className="rounded-xl bg-emerald-50 p-3.5 border border-emerald-100 text-xs text-emerald-800 leading-relaxed">
            🌿 Direct farm order. Zero middleman markup guaranteed!
          </div>
        </div>
      </div>
    </div>
  );
}
