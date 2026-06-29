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
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900">Farm profile</h1>
        <p className="mt-1 text-sm text-zinc-500">Account details & earnings</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">This week earnings</p>
          <p className="text-2xl sm:text-3xl font-bold text-emerald-700 mt-1">{formatCurrency(farmer.weekEarnings)}</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">vs mandi rate</p>
          <p className="text-2xl sm:text-3xl font-bold text-amber-700 mt-1">+{farmer.vsMandi}%</p>
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
