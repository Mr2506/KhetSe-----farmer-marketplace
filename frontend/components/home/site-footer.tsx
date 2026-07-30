"use client";

import { useState } from "react";
import Link from "next/link";
import { Leaf, X } from "lucide-react";

export function SiteFooter() {
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  return (
    <>
      <footer className="bg-zinc-950 pt-16 pb-8 text-zinc-400 border-t border-zinc-800">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
            
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center gap-2.5 group w-fit">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-600 text-white transition-colors group-hover:bg-emerald-500">
                  <Leaf className="h-5 w-5" />
                </div>
                <span className="text-xl font-bold tracking-tight text-white group-hover:text-emerald-100 transition-colors">
                  KhetConnect
                </span>
              </Link>
              <p className="mt-6 max-w-sm text-sm leading-relaxed text-zinc-400">
                Direct marketplace connecting farmers and buyers across Gujarat. No middlemen. Just fresh produce.
              </p>
              
              <div className="mt-6 flex items-center gap-5 text-sm font-semibold">
                <a href="#" className="text-zinc-400 hover:text-emerald-400 transition-colors">Twitter</a>
                <a href="#" className="text-zinc-400 hover:text-emerald-400 transition-colors">Instagram</a>
                <a href="#" className="text-zinc-400 hover:text-emerald-400 transition-colors">Facebook</a>
              </div>
            </div>

            {/* Link Columns */}
            <div>
              <h3 className="text-xs font-black tracking-widest text-white uppercase mb-5">For Buyers</h3>
              <ul className="space-y-4 text-sm font-medium">
                <li><Link href="/login" className="hover:text-emerald-400 transition-colors">Browse Produce</Link></li>
                <li><Link href="#how-it-works" className="hover:text-emerald-400 transition-colors">How to Order</Link></li>
                <li><Link href="#" className="hover:text-emerald-400 transition-colors">Delivery Options</Link></li>
                <li><Link href="#faqs" className="hover:text-emerald-400 transition-colors">Buyer FAQ</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-black tracking-widest text-white uppercase mb-5">For Farmers</h3>
              <ul className="space-y-4 text-sm font-medium">
                <li><Link href="/login" className="hover:text-emerald-400 transition-colors">Start Selling</Link></li>
                <li><Link href="#" className="hover:text-emerald-400 transition-colors">Pricing & Fees</Link></li>
                <li><Link href="#" className="hover:text-emerald-400 transition-colors">Managing Orders</Link></li>
                <li><Link href="#faqs" className="hover:text-emerald-400 transition-colors">Farmer FAQ</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-black tracking-widest text-white uppercase mb-5">Company</h3>
              <ul className="space-y-4 text-sm font-medium">
                <li><Link href="#" className="hover:text-emerald-400 transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-emerald-400 transition-colors">Contact</Link></li>
                {/* 🟢 CHANGED: These are now buttons that open the pop-ups! */}
                <li>
                  <button onClick={() => setIsTermsOpen(true)} className="hover:text-emerald-400 transition-colors">
                    Terms of Service
                  </button>
                </li>
                <li>
                  <button onClick={() => setIsPrivacyOpen(true)} className="hover:text-emerald-400 transition-colors">
                    Privacy Policy
                  </button>
                </li>
              </ul>
            </div>

          </div>

          <div className="mt-16 flex flex-col-reverse md:flex-row items-center justify-between gap-4 border-t border-zinc-800/80 pt-8 text-xs font-medium text-zinc-500">
            <p>&copy; {new Date().getFullYear()} KhetConnect Marketplace. All rights reserved. Built in Gujarat.</p>
            <div className="rounded-md border border-zinc-700 bg-zinc-800/50 px-3 py-1.5 font-mono tracking-widest text-zinc-300 uppercase shadow-xs">
              Beta Program
            </div>
          </div>
        </div>
      </footer>

      {/* --- TERMS POP-UP MODAL --- */}
      {isTermsOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm" onClick={() => setIsTermsOpen(false)} />
          <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-10 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            <div className="sticky top-0 bg-white pb-4 mb-4 border-b border-zinc-100 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-600 text-white">
                  <Leaf className="h-4 w-4" />
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-zinc-950">Terms of Service</h2>
              </div>
              <button onClick={() => setIsTermsOpen(false)} className="grid h-10 w-10 place-items-center rounded-full bg-zinc-100 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6 text-zinc-600 leading-relaxed text-sm sm:text-base">
              <p>Last updated: July 2026</p>
              <h2 className="text-lg font-bold text-zinc-900 mt-6 mb-2">1. Welcome to KhetConnect</h2>
              <p>By accessing or using the KhetConnect platform, you agree to be bound by these Terms of Service. KhetConnect is a direct farm-to-consumer marketplace designed to connect local farmers in Gujarat with buyers.</p>
              <h2 className="text-lg font-bold text-zinc-900 mt-6 mb-2">2. Platform Role</h2>
              <p>KhetConnect provides a technological platform for Buyers to discover and purchase agricultural produce directly from Farmers. KhetConnect is not a party to the actual transaction between buyers and sellers, nor do we handle or store any physical produce.</p>
              <h2 className="text-lg font-bold text-zinc-900 mt-6 mb-2">3. User Responsibilities</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Farmers:</strong> Must provide accurate descriptions, pricing, and availability of their harvest. Farmers are responsible for fulfilling accepted orders.</li>
                <li><strong>Buyers:</strong> Must provide valid contact information for order fulfillment and commit to paying for the goods upon pickup or delivery.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* --- PRIVACY POP-UP MODAL --- */}
      {isPrivacyOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm" onClick={() => setIsPrivacyOpen(false)} />
          <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-10 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            <div className="sticky top-0 bg-white pb-4 mb-4 border-b border-zinc-100 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-600 text-white">
                  <Leaf className="h-4 w-4" />
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-zinc-950">Privacy Policy</h2>
              </div>
              <button onClick={() => setIsPrivacyOpen(false)} className="grid h-10 w-10 place-items-center rounded-full bg-zinc-100 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6 text-zinc-600 leading-relaxed text-sm sm:text-base">
              <p>Last updated: July 2026</p>
              <h2 className="text-lg font-bold text-zinc-900 mt-6 mb-2">1. Information We Collect</h2>
              <p>When you use KhetConnect, we collect the minimum amount of information necessary to facilitate direct farm transactions:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Account Data:</strong> Your phone number, first name, last name, and role (Buyer or Farmer).</li>
                <li><strong>Location Data:</strong> Your city/area or farm village to connect you with nearby users.</li>
              </ul>
              <h2 className="text-lg font-bold text-zinc-900 mt-6 mb-2">2. How We Use Your Information</h2>
              <p>We use your information exclusively to operate the marketplace. Phone numbers are used for secure OTP login. Location data is used to populate the local feed of fresh produce.</p>
              <h2 className="text-lg font-bold text-zinc-900 mt-6 mb-2">3. Information Sharing</h2>
              <p>To make direct trades possible, specific information is shared between transaction parties:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>When a Buyer places an order, the Farmer receives the Buyer's name and contact number to arrange fulfillment.</li>
                <li>When a Farmer lists produce, Buyers can see the Farmer's name and general farm location.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}