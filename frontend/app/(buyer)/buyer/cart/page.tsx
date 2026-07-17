"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Trash2, ShoppingCart, MapPin, Truck, AlertCircle, X } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import dynamic from "next/dynamic";
const LocationPicker = dynamic(() => import("@/components/LocationPicker"), { ssr: false });

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Logistics & Checkout States
  const [buyerLocation, setBuyerLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [deliveryDistance, setDeliveryDistance] = useState<number | null>(null);
  const [deliveryBreakdown, setDeliveryBreakdown] = useState<{farmerName: string, distance: number, fee: number}[]>([]);
  const [isChangingLocation, setIsChangingLocation] = useState(false);
  const [isCalculatingLocation, setIsCalculatingLocation] = useState(false);

  // Constants for pricing
  const COST_PER_KM = 8; // ₹8 per kilometer for delivery

  useEffect(() => {
    const savedCart = localStorage.getItem("khetse_cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
    setMounted(true);

// Fetch the buyer's saved location for delivery math
    const fetchLogisticsData = async () => {
      const token = localStorage.getItem("khetse_token");
      if (!token) return;

      setIsCalculatingLocation(true);
      try {
        const profileRes = await fetch("https://khetse-backend.onrender.com/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (profileRes.ok) {
          const data = await profileRes.json();
          
          if (data.location?.lat) {
            // They have a location, run the math!
            setBuyerLocation(data.location);
            calculateDeliveryRoute(data.location);
            
            // NEW: Friendly reminder to verify their address every time they enter the cart
            toast("📍 Delivery set to your last location.", {
              description: "Please click 'Change' in the Delivery Routing box if you need to update it.",
              duration: 5000,
            });
            
          } else {
            // NEW: If they have absolutely no location, physically force the map modal open!
            setIsChangingLocation(true);
            toast.error("Delivery address missing!", {
              description: "Please pin your destination so we can calculate your delivery fee.",
              duration: 5000,
            });
          }
        }
      } catch (error) {
        console.error("Failed to load logistics data", error);
      } finally {
        setIsCalculatingLocation(false);
      }
    };

    fetchLogisticsData();
  }, []);

  // NEW: Multi-Vendor Route Calculation
  const calculateDeliveryRoute = async (buyerCoords: { lat: number; lng: number }) => {
    try {
      setIsCalculatingLocation(true);
      const token = localStorage.getItem("khetse_token");
      
      // 1. Group the cart items by unique farmers
      const uniqueFarmers = Array.from(new Set(cartItems.map(item => item.farmerName)));
      
      let totalAccumulatedDistance = 0;
      const tempBreakdown = []; // Array to hold individual math

      // 2. Calculate the route for EACH farmer independently
      for (const farmer of uniqueFarmers) {
        
        const farmerItem = cartItems.find(item => item.farmerName === farmer);
        
        if (!farmerItem || !farmerItem.farmerLocation || !farmerItem.farmerLocation.lat) {
          console.warn(`No location found for ${farmer}`);
          continue;
        }

        const realFarmerCoords = farmerItem.farmerLocation;

        const res = await fetch("https://khetse-backend.onrender.com/api/map/route", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            pickupLat: realFarmerCoords.lat, 
            pickupLng: realFarmerCoords.lng,
            dropoffLat: buyerCoords.lat,
            dropoffLng: buyerCoords.lng
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.distance) {
            const dist = parseFloat(data.distance);
            const fee = Math.ceil(dist * COST_PER_KM); // Calculate fee for this specific farmer
            
            totalAccumulatedDistance += dist;
            
            // Save the exact math for this farmer
            tempBreakdown.push({
              farmerName: farmer,
              distance: dist,
              fee: fee
            });
          }
        }
      }

      // 3. Set the final combined distance and the breakdown!
      setDeliveryDistance(totalAccumulatedDistance);
      setDeliveryBreakdown(tempBreakdown);
      
    } catch (error) {
      console.error("OSRM Route calculation failed", error);
    } finally {
      setIsCalculatingLocation(false);
    }
  };
  
  const saveCart = (newCart: any[]) => {
    setCartItems(newCart);
    localStorage.setItem("khetse_cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const updateQuantity = (produceId: string, newQty: number) => {
    const updatedCart = cartItems.map(item => {
      if (item.produceId === produceId) {
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

    if (!buyerLocation) {
      toast.error("Please set your delivery location in your profile first!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("https://khetse-backend.onrender.com/api/orders/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cartItems.map(item => ({
            produceId: item.produceId,
            quantityOrdered: item.quantityOrdered
          })),
          deliveryDistanceKm: deliveryDistance,
          deliveryFee: deliveryFee
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to place order");
      }

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

  if (!mounted) return null; 

  // Math Calculations
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantityOrdered, 0);
  const produceSubtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantityOrdered), 0);
  
  // Dynamic Delivery Fee (Only calculated if we successfully got a distance)
  const deliveryFee = deliveryDistance ? Math.ceil(deliveryDistance * COST_PER_KM) : 0;
  const grandTotal = produceSubtotal + deliveryFee;

  return (
    <div className="mx-auto max-w-4xl space-y-6 relative">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl tracking-tight">Checkout</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Review your items and logistics before payment
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
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-emerald-50 flex items-center justify-center text-4xl border border-zinc-100">
                    {isImage ? (
                      <img src={item.photo} alt={item.cropName} className="h-full w-full object-cover" />
                    ) : (
                      item.photo
                    )}
                  </div>

                  <div className="flex-1 w-full text-center sm:text-left">
                    <h3 className="font-bold text-zinc-900 text-lg">{item.cropName}</h3>
                    <p className="text-xs text-zinc-500 mb-2">Grown by {item.farmerName}</p>
                    <p className="font-bold text-emerald-700">{formatCurrency(item.price)} <span className="text-xs font-medium text-zinc-400">/{item.unit}</span></p>
                  </div>

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

          {/* Checkout Summary & Logistics Block */}
          <div className="space-y-4 lg:sticky lg:top-24 h-fit">
            
            {/* Logistics UI Box */}
            <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                  <Truck className="h-4 w-4 text-emerald-600" />
                  Delivery Routing
                </h2>
                
                <button 
                  onClick={() => setIsChangingLocation(true)}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition"
                >
                  Change
                </button>
              </div>
              
              {isCalculatingLocation ? (
                <div className="animate-pulse flex items-center gap-2 text-sm text-zinc-500">
                  <div className="h-4 w-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                  Calculating route...
                </div>
              ) : !buyerLocation ? (
                <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 flex gap-2 items-start">
                  <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-amber-800">No Location Found</p>
                    <p className="text-[11px] text-amber-700 mt-1">Please pin your delivery address to calculate shipping.</p>
                    <button 
                      onClick={() => setIsChangingLocation(true)}
                      className="text-[11px] font-bold text-emerald-700 mt-2 inline-block hover:underline"
                    >
                      Pin Location Now →
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-zinc-600">
                    <span className="flex items-center gap-1.5"><MapPin className="h-3 w-3" /> Distance to Farm:</span>
                    <span className="font-bold text-zinc-900">
                      {deliveryDistance ? `${deliveryDistance.toFixed(1)} km` : "Routing..."}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-zinc-600">
                    <span>Rate (per km):</span>
                    <span className="font-medium">{formatCurrency(COST_PER_KM)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Financial Summary */}
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-zinc-900 mb-4 border-b border-zinc-100 pb-4">Order Summary</h2>
              
              <div className="space-y-3 text-sm text-zinc-600 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal ({totalItems} items)</span>
                  <span className="font-medium text-zinc-900">{formatCurrency(produceSubtotal)}</span>
                </div>
                
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    {buyerLocation && deliveryDistance ? (
                      <span className="font-medium text-zinc-900">{formatCurrency(deliveryFee)}</span>
                    ) : (
                      <span className="font-medium text-amber-600 text-xs">Pending address</span>
                    )}
                  </div>
                  
                  {/* NEW: The Transparent Breakdown UI */}
                  {deliveryBreakdown.length > 0 && (
                    <div className="pl-3 border-l-2 border-emerald-100 space-y-1 text-xs text-zinc-500">
                      {deliveryBreakdown.map((route, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span className="truncate pr-2">↳ From {route.farmerName} ({route.distance.toFixed(1)} km)</span>
                          <span className="shrink-0">{formatCurrency(route.fee)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-between border-t border-dashed border-zinc-200 pt-3 text-base">
                  <span className="font-bold text-zinc-900">Grand Total</span>
                  <span className="font-black text-emerald-700">{formatCurrency(grandTotal)}</span>
                </div>
              </div>

              <button
                onClick={placeOrder}
                disabled={loading || cartItems.length === 0 || !buyerLocation}
                className="w-full rounded-xl bg-emerald-600 py-3.5 text-sm font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-500 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? "Processing..." : "Place Order Now"}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* NEW: The Floating Map Modal */}
      {isChangingLocation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50">
              <div>
                <h3 className="font-bold text-zinc-900 text-lg">Pin Delivery Destination</h3>
                <p className="text-xs text-zinc-500">Search your address or drag the pin to calibrate.</p>
              </div>
              <button 
                onClick={() => setIsChangingLocation(false)}
                className="p-2 text-zinc-400 hover:text-zinc-800 hover:bg-zinc-200 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 bg-zinc-50/50">
              <LocationPicker 
                onLocationSelect={(lat, lng) => {
                  setBuyerLocation({ lat, lng });
                  calculateDeliveryRoute({ lat, lng });
                }} 
              />
              
              {/* NEW: Dedicated Confirm Button */}
              <button
                onClick={() => setIsChangingLocation(false)}
                className="mt-6 w-full rounded-xl bg-zinc-900 py-3.5 text-sm font-bold text-white shadow-md shadow-zinc-900/20 hover:bg-zinc-800 active:scale-[0.98] transition-all flex justify-center items-center gap-2"
              >
                <MapPin className="w-4 h-4" />
                Confirm Location & Close
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}