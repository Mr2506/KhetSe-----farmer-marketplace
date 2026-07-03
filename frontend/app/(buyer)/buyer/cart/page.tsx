"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Trash2, ShoppingCart } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem("khetse_cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
    setMounted(true);
  }, []);

  const saveCart = (newCart: any[]) => {
    setCartItems(newCart);
    localStorage.setItem("khetse_cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const updateQuantity = (produceId: string, newQty: number) => {
    const updatedCart = cartItems.map(item => {
      if (item.produceId === produceId) {
        // Enforce limits
        const safeQty = Math.max(1, Math.min(newQty, item.maxQty));
        return { ...item, quantityOrdered: safeQty };
      }
      return item;
    });
    saveCart(updatedCart);
  };

  const removeItem = (produceId: string) => {
    const updatedCart = cartItems.filter(item => item.produceId !== produceId);
    saveCart(updatedCart);
    toast.success("Item removed from cart");
  };

  const placeOrder = async () => {
    const token = localStorage.getItem("khetse_token");
    if (!token) {
      toast.error("Please log in to place an order.");
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      // Trigger bulk checkout
      const res = await fetch("http://localhost:5000/api/orders/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cartItems.map(item => ({
            produceId: item.produceId,
            quantityOrdered: item.quantityOrdered
          }))
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to place order");
      }

      // Success! Clear cart, toast, and bounce to Orders dashboard
      localStorage.removeItem("khetse_cart");
      window.dispatchEvent(new Event('cartUpdated'));
      toast.success("Order placed successfully!");
      router.push("/buyer/orders");

    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null; // Prevent hydration errors

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantityOrdered, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantityOrdered), 0);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl tracking-tight">Your cart</h1>
        <p className="mt-1 text-sm text-zinc-500">
          {totalItems} item(s) pending checkout
        </p>
      </div>

      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-300 bg-white py-20 text-center shadow-sm">
          <div className="mb-4 grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-emerald-600">
            <ShoppingCart className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900 mb-2">Your cart is currently empty</h3>
          <Link
            href="/buyer/browse"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-500 shadow-sm transition-all"
          >
            Browse produce <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
              const isImage = typeof item.photo === "string" && item.photo.startsWith("http");

              return (
                <div key={item.produceId} className="flex flex-col sm:flex-row items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
                  
                  {/* Image */}
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-emerald-50 flex items-center justify-center text-4xl border border-zinc-100">
                    {isImage ? (
                      <img src={item.photo} alt={item.cropName} className="h-full w-full object-cover" />
                    ) : (
                      item.photo
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 w-full text-center sm:text-left">
                    <h3 className="font-bold text-zinc-900 text-lg">{item.cropName}</h3>
                    <p className="text-xs text-zinc-500 mb-2">Grown by {item.farmerName}</p>
                    <p className="font-bold text-emerald-700">{formatCurrency(item.price)} <span className="text-xs font-medium text-zinc-400">/{item.unit}</span></p>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-4 sm:pt-0 border-zinc-100">
                    <div className="flex items-center rounded-xl border border-zinc-200 bg-zinc-50 p-1">
                      <button
                        onClick={() => updateQuantity(item.produceId, item.quantityOrdered - 1)}
                        className="h-8 w-8 rounded-lg bg-white text-zinc-600 shadow-sm hover:text-emerald-600 transition font-bold"
                      >
                        −
                      </button>
                      <span className="w-10 text-center font-bold text-sm">{item.quantityOrdered}</span>
                      <button
                        onClick={() => updateQuantity(item.produceId, item.quantityOrdered + 1)}
                        className="h-8 w-8 rounded-lg bg-white text-zinc-600 shadow-sm hover:text-emerald-600 transition font-bold"
                      >
                        +
                      </button>
                    </div>
                    
                    <button
                      onClick={() => removeItem(item.produceId)}
                      className="p-2 text-zinc-400 hover:text-red-500 transition-colors bg-red-50 sm:bg-transparent rounded-lg sm:rounded-none"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

          {/* Checkout Summary */}
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm h-fit sticky top-24">
            <h2 className="text-lg font-bold text-zinc-900 mb-4 border-b border-zinc-100 pb-4">Order Summary</h2>
            
            <div className="space-y-3 text-sm text-zinc-600 mb-6">
              <div className="flex justify-between">
                <span>Subtotal ({totalItems} items)</span>
                <span className="font-medium text-zinc-900">{formatCurrency(totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Platform Fee</span>
                <span className="font-medium text-emerald-600">Free</span>
              </div>
              <div className="flex justify-between border-t border-dashed border-zinc-200 pt-3 text-base">
                <span className="font-bold text-zinc-900">Total</span>
                <span className="font-black text-emerald-700">{formatCurrency(totalPrice)}</span>
              </div>
            </div>

            <button
              onClick={placeOrder}
              disabled={loading || cartItems.length === 0}
              className="w-full rounded-xl bg-emerald-600 py-3.5 text-sm font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-500 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? "Processing..." : "Place Order Now"}
            </button>
            <p className="text-center text-[10px] text-zinc-400 mt-3 flex items-center justify-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block"></span> 100% of payment goes to farmers
            </p>
          </div>

        </div>
      )}
    </div>
  );
}