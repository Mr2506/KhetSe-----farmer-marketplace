"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="mb-6 flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-emerald-700 transition-colors"
    >
      <ArrowLeft className="h-4 w-4" />
      Back to Browse
    </button>
  );
}