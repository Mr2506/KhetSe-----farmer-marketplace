"use client";

import { useEffect, useState } from "react";
import { FarmerProfileForm } from "@/components/farmer/profile-form";
import { formatCurrency } from "@/lib/utils";
import ProfileLocationSettings from "@/components/ProfileLocationSettings";

export default function FarmerProfilePage() {
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

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900">Farm profile</h1>
        <p className="mt-1 text-sm text-zinc-500">Account details & earnings</p>
      </div>

      {/* Leaving Meet's fake earnings stats here for now until we build the order aggregation */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">This week earnings</p>
          <p className="text-2xl sm:text-3xl font-bold text-emerald-700 mt-1">{formatCurrency(2287)}</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">vs mandi rate</p>
          <p className="text-2xl sm:text-3xl font-bold text-amber-700 mt-1">+28%</p>
        </div>
      </div>
    {/* @ts-ignore */}
     <FarmerProfileForm
        defaultValues={{
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          phone: user.phone,
          farmSize: user.farmSize || "",
          farmVillageName: user.farmVillageName || "",
          farmAddress: user.farmAddress || "", 
          cropsGrown: user.cropsGrown || [],
          // Keep verification static as "Pending" until we build an admin approval system
          verification: "Pending",
          notifyNewOrders: user.notifyNewOrders !== undefined ? user.notifyNewOrders : true,
          notifyLowStock: user.notifyLowStock !== undefined ? user.notifyLowStock : true,
          notifySms: user.notifySms !== undefined ? user.notifySms : false,
        }}
      />

      {/* The map is now safely inside the main wrapper! */}
      <ProfileLocationSettings />
      
    </div>
  );
}