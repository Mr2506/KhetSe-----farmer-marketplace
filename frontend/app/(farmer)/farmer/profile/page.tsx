import { FarmerProfileForm } from "@/components/farmer/profile-form";
import { formatCurrency } from "@/lib/utils";

const mockFarmerProfile = {
  name: "Ramesh Patel",
  phone: "9825012345",
  farmSize: "5 acres",
  village: "Olpad",
  cropsGrown: ["Tomato", "Cabbage", "Rice"],
  verification: "Verified" as const,
  notifyNewOrders: true,
  notifyLowStock: true,
  notifySms: false,
  weekEarnings: 2287,
  vsMandi: 28,
};

export default async function FarmerProfilePage() {
  const farmer = mockFarmerProfile;

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Farm profile</h1>
        <p className="text-sm text-zinc-500">Account details & earnings</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-zinc-200 bg-white p-4">
          <p className="text-xs text-zinc-500">This week</p>
          <p className="text-2xl font-bold text-emerald-700">{formatCurrency(farmer.weekEarnings)}</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-4">
          <p className="text-xs text-zinc-500">vs mandi rate</p>
          <p className="text-2xl font-bold text-amber-700">+{farmer.vsMandi}%</p>
        </div>
      </div>

      <FarmerProfileForm
        defaultValues={{
          name: farmer.name,
          phone: farmer.phone,
          farmSize: farmer.farmSize,
          village: farmer.village,
          cropsGrown: farmer.cropsGrown,
          verification: farmer.verification,
          notifyNewOrders: farmer.notifyNewOrders,
          notifyLowStock: farmer.notifyLowStock,
          notifySms: farmer.notifySms,
        }}
      />
    </div>
  );
}
