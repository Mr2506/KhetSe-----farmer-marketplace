import { BuyerProfileForm } from "@/components/buyer/profile-form";
import { formatBuyerType } from "@/lib/roles";

const mockUser = {
  name: "Anita Shah",
  phone: "9825098250",
  buyerProfile: {
    buyerType: "HOUSEHOLD" as const,
    addresses: ["Block C-402, Green Avenue, Vesu, Surat - 395007"],
    notifyNewOrders: true,
    notifyLowStock: false,
    notifySms: false,
  },
  savedFarmers: [
    {
      id: "saved-1",
      farmer: {
        village: "Olpad",
        user: { name: "Ramesh Patel" },
      },
    },
  ],
};

export default async function BuyerProfilePage() {
  const user = mockUser;

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-sm text-zinc-500">Your buyer details and preferences</p>
      </div>

      <BuyerProfileForm
        defaultValues={{
          name: user.name,
          phone: user.phone,
          buyerType: user.buyerProfile.buyerType,
          addresses: user.buyerProfile.addresses,
          notifyNewOrders: user.buyerProfile.notifyNewOrders,
          notifyLowStock: user.buyerProfile.notifyLowStock,
          notifySms: user.buyerProfile.notifySms,
        }}
      />

      {user.savedFarmers.length > 0 && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-4">
          <p className="text-sm font-semibold">Saved farmers</p>
          <ul className="mt-2 space-y-1 text-sm text-zinc-600">
            {user.savedFarmers.map((s) => (
              <li key={s.id}>{(s.farmer as any).user?.name ?? (s.farmer as any).name} — {s.farmer.village}</li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-xs text-zinc-400">
        Buyer type: {formatBuyerType(user.buyerProfile.buyerType)}
      </p>
    </div>
  );
}
