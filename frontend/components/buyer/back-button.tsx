"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      aria-label="Go back to browse page"
      className="mb-6 flex items-center gap-2 h-11 px-3 -ml-3 rounded-xl text-sm font-semibold text-[#6B7280] hover:text-[#2E7D32] hover:bg-[#F0FAF0] transition-all duration-150"
    >
      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
      Back to Browse
    </button>
  );
}