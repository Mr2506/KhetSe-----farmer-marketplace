"use client";

import { useEffect, useState } from "react";
import { BuyerProfileForm } from "@/components/buyer/profile-form";
import { formatBuyerType } from "@/lib/roles";
import ProfileLocationSettings from "@/components/ProfileLocationSettings";

export default function BuyerProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("khetse_token");
      if (!token) return;

      try {
        const res = await fetch("https://khetse-backend.onrender.com/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl space-y-6 animate-pulse">
        <div className="h-20 bg-zinc-100 rounded-xl" />
        <div className="h-64 bg-zinc-100 rounded-xl" />
      </div>
    );
  }

  if (!user) {
    return <div className="p-10 text-center text-red-500 font-bold">Failed to load profile.</div>;
  }

  let mappedBuyerType: "HOUSEHOLD" | "RESTAURANT" | "SHOP" = "HOUSEHOLD";
  if (user.buyingFor === "Restaurant / Business") mappedBuyerType = "RESTAURANT";
  if (user.buyingFor === "Wholesale") mappedBuyerType = "SHOP";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900">Profile</h1>
        <p className="mt-1 text-sm text-zinc-500">Your buyer details and preferences</p>
      </div>

      <BuyerProfileForm
        defaultValues={{
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          phone: user.phone,
          buyerType: mappedBuyerType,
          addresses: [user.cityArea || ""],
          notifyNewOrders: user.notifyNewOrders !== undefined ? user.notifyNewOrders : true,
          notifyLowStock: user.notifyLowStock !== undefined ? user.notifyLowStock : false,
          notifySms: user.notifySms !== undefined ? user.notifySms : true,
        }}
      />

      {/* The map is now safely inside the main wrapper! */}
      <ProfileLocationSettings />

      <p className="text-xs text-zinc-400">
        Buyer type: {formatBuyerType(mappedBuyerType)}
      </p>
    </div>
  );
}