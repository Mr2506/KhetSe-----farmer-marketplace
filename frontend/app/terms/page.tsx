import Link from "next/link";
import { ArrowLeft, Leaf } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#f6f4ef] font-sans text-zinc-900 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        
        {/* Header / Back Button */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-emerald-700 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-600 text-white">
              <Leaf className="h-4 w-4" />
            </div>
            <span className="font-bold tracking-tight text-zinc-900">KhetSe</span>
          </div>
        </div>

        {/* Content Box */}
        <div className="bg-white rounded-3xl border border-zinc-200 p-8 sm:p-12 shadow-sm">
          <p className="text-emerald-600 font-bold text-sm tracking-widest uppercase mb-3">Legal</p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-950 mb-8">Terms of Service</h1>
          
          <div className="space-y-6 text-zinc-600 leading-relaxed text-sm sm:text-base">
            <p>Last updated: July 2026</p>

            <h2 className="text-xl font-bold text-zinc-900 mt-8 mb-4">1. Welcome to KhetSe</h2>
            <p>
              By accessing or using the KhetSe platform, you agree to be bound by these Terms of Service. KhetSe is a direct farm-to-consumer marketplace designed to connect local farmers in Gujarat with buyers.
            </p>

            <h2 className="text-xl font-bold text-zinc-900 mt-8 mb-4">2. Platform Role</h2>
            <p>
              KhetSe provides a technological platform for Buyers to discover and purchase agricultural produce directly from Farmers. KhetSe is not a party to the actual transaction between buyers and sellers, nor do we handle or store any physical produce.
            </p>

            <h2 className="text-xl font-bold text-zinc-900 mt-8 mb-4">3. User Responsibilities</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Farmers:</strong> Must provide accurate descriptions, pricing, and availability of their harvest. Farmers are responsible for fulfilling accepted orders.</li>
              <li><strong>Buyers:</strong> Must provide valid contact information for order fulfillment and commit to paying for the goods upon pickup or delivery.</li>
            </ul>

            <h2 className="text-xl font-bold text-zinc-900 mt-8 mb-4">4. Payments</h2>
            <p>
              Currently, all payments are handled directly between the Buyer and the Farmer upon delivery or pickup. KhetSe does not charge commission fees on transactions to ensure maximum profit for farmers and savings for buyers.
            </p>

            <h2 className="text-xl font-bold text-zinc-900 mt-8 mb-4">5. Account Registration</h2>
            <p>
              Users must register using a valid phone number. We use One-Time Passwords (OTP) via Firebase for authentication. You are responsible for maintaining the confidentiality of your account access.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}