"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { verifyFarmerAction } from "@/lib/actions";

export function VerifyFarmerButton({ userId }: { userId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function decide(decision: "Verified" | "Rejected") {
    setLoading(true);
    try {
      await verifyFarmerAction(userId, decision);
      toast.success(decision === "Verified" ? "Farmer approved" : "Farmer rejected");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex gap-2">
      <button type="button" disabled={loading} onClick={() => decide("Verified")} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60">
        Approve
      </button>
      <button type="button" disabled={loading} onClick={() => decide("Rejected")} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 disabled:opacity-60">
        Reject
      </button>
    </div>
  );
}
