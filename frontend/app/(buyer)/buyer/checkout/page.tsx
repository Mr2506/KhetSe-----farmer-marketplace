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
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="text-2xl font-bold">Checkout</h1>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-5">
        <fieldset>
          <legend className="text-sm font-semibold">Fulfillment</legend>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {(["Pickup", "Delivery"] as const).map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setFulfillment(opt)}
                className={`rounded-xl border py-3 text-sm font-semibold ${fulfillment === opt ? "border-emerald-500 bg-emerald-50 text-emerald-800" : "border-zinc-200"}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </fieldset>

        {fulfillment === "Delivery" && (
          <label className="block space-y-1">
            <span className="text-sm font-medium">Address</span>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              placeholder="Street, area, pin code"
            />
          </label>
        )}

        <label className="block space-y-1">
          <span className="text-sm font-medium">Time slot</span>
          <select
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
          >
            <option>Morning (8 AM - 11 AM)</option>
            <option>4:00 PM - 6:00 PM</option>
            <option>6:00 PM - 8:00 PM</option>
          </select>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="h-12 w-full rounded-xl bg-emerald-600 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-60"
        >
          {loading ? "Placing order…" : "Place order"}
        </button>
      </form>
    </div>
  );
}
