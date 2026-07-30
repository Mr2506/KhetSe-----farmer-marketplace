import Link from "next/link";
import { ArrowLeft, Leaf } from "lucide-react";

export default function PrivacyPolicy() {
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
            <span className="font-bold tracking-tight text-zinc-900">KhetConnect</span>
          </div>
        </div>

        {/* Content Box */}
        <div className="bg-white rounded-3xl border border-zinc-200 p-8 sm:p-12 shadow-sm">
          <p className="text-emerald-600 font-bold text-sm tracking-widest uppercase mb-3">Legal</p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-950 mb-8">Privacy Policy</h1>
          
          <div className="space-y-6 text-zinc-600 leading-relaxed text-sm sm:text-base">
            <p>Last updated: July 2026</p>

            <h2 className="text-xl font-bold text-zinc-900 mt-8 mb-4">1. Information We Collect</h2>
            <p>
              When you use KhetConnect, we collect the minimum amount of information necessary to facilitate direct farm transactions:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Account Data:</strong> Your phone number, first name, last name, and role (Buyer or Farmer).</li>
              <li><strong>Location Data:</strong> Your city/area or farm village to connect you with nearby users.</li>
              <li><strong>Transaction Data:</strong> Records of items ordered, quantities, and order statuses.</li>
            </ul>

            <h2 className="text-xl font-bold text-zinc-900 mt-8 mb-4">2. How We Use Your Information</h2>
            <p>
              We use your information exclusively to operate the marketplace. Phone numbers are used for secure OTP login. Location data is used to populate the local feed of fresh produce.
            </p>

            <h2 className="text-xl font-bold text-zinc-900 mt-8 mb-4">3. Information Sharing (Crucial for Marketplaces)</h2>
            <p>
              To make direct trades possible, specific information is shared between transaction parties:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>When a Buyer places an order, the Farmer receives the Buyer's name and contact number to arrange fulfillment.</li>
              <li>When a Farmer lists produce, Buyers can see the Farmer's name and general farm location.</li>
            </ul>
            <p>We do not sell your personal data to third-party advertisers or data brokers.</p>

            <h2 className="text-xl font-bold text-zinc-900 mt-8 mb-4">4. Data Security</h2>
            <p>
              We implement industry-standard security measures, including secure Firebase authentication, to protect your personal information from unauthorized access.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}