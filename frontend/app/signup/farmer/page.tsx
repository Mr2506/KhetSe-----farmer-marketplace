"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { auth } from "@/lib/firebase"; 
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier | undefined;
  }
}

export default function FarmerSignup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    farmVillageName: "",
    district: "Surat",
    pincode: "",
    farmSize: "Under 1 acre",
  });
  
  const [selectedCrops, setSelectedCrops] = useState<string[]>([]);
  const cropOptions = ["Vegetables", "Fruits", "Grains", "Spices", "Dairy"];

  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = undefined;
      }
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
      });
    }
    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = undefined;
      }
    };
  }, []);

  const toggleCrop = (crop: string) => {
    if (selectedCrops.includes(crop)) {
      setSelectedCrops(selectedCrops.filter(c => c !== crop));
    } else {
      setSelectedCrops([...selectedCrops, crop]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const requestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    const formattedNumber = `+91${formData.phone}`;

    try {
      if (typeof window === "undefined" || !window.recaptchaVerifier) {
        throw new Error("Security check is still loading, please try again.");
      }
      const appVerifier = window.recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(auth, formattedNumber, appVerifier);
      setConfirmationResult(confirmation);
      setStep(2);
      setMessage({ text: "OTP Sent successfully!", type: "success" });
    } catch (error: any) {
      console.error(error);
      setMessage({ text: "Error sending OTP: " + error.message, type: "error" });
    }
  };

  const verifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!confirmationResult) {
      setMessage({ text: "Please request OTP first", type: "error" });
      return;
    }

    try {
      // 1. Verify with Google Firebase
      const result = await confirmationResult.confirm(otp);
      const firebaseToken = await result.user.getIdToken();
      
      setMessage({ text: "Account Verified! Creating your profile...", type: "success" });

      // 2. Send all data to Node.js Backend
      const response = await fetch("https://khetse-backend.onrender.com/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firebaseToken,
          ...formData,
          role: "Farmer",
          cropsGrown: selectedCrops
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // 3. Save Backend Token and Redirect!
      localStorage.setItem("khetse_token", data.token);
      localStorage.setItem("khetse_role", data.role);
      
      setMessage({ text: "Account created! Welcome to KhetSe.", type: "success" });
      
      setTimeout(() => {
        router.push("/farmer");
      }, 1000);

    } catch (error: any) {
      console.error(error);
      setMessage({ text: error.message || "Invalid OTP. Please try again.", type: "error" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFDF9] px-4 py-10 font-sans">
      <div className="w-full max-w-[440px] bg-white rounded-2xl p-8 shadow-[0_0_25px_rgba(45,138,78,0.08)] border border-[#2D8A4E]/20 transition-all">
        
        <div className="flex flex-col items-center mb-6">
          <div className="bg-[#2D8A4E] text-white p-2 rounded-lg mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">KhetSe</h1>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded-lg text-sm font-medium text-center ${message.type === "error" ? "bg-red-50 text-red-600 border border-red-100" : "bg-green-50 text-green-700 border border-green-100"}`}>
            {message.text}
          </div>
        )}

        {step === 1 ? (
          <div>
            <div className="text-center mb-6">
              <h2 className="text-lg font-bold text-gray-900">Create farmer account</h2>
              <p className="text-sm text-gray-500 mt-1">Takes less than 2 minutes</p>
            </div>

            <form onSubmit={requestOTP} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-wider">First Name</label>
                  <input type="text" name="firstName" placeholder="Ramesh" onChange={handleChange} className="w-full p-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#2D8A4E] focus:ring-1 focus:ring-[#2D8A4E] transition text-sm" required />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Last Name</label>
                  <input type="text" name="lastName" placeholder="Patel" onChange={handleChange} className="w-full p-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#2D8A4E] focus:ring-1 focus:ring-[#2D8A4E] transition text-sm" required />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Phone number</label>
                <div className="flex">
                  <div className="flex items-center justify-center bg-gray-50 border border-gray-200 border-r-0 rounded-l-lg px-3 text-gray-600 font-medium text-sm">+91</div>
                  <input type="tel" name="phone" placeholder="98765 43210" maxLength={10} onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})} className="w-full p-2.5 border border-gray-200 rounded-r-lg outline-none focus:border-[#2D8A4E] focus:ring-1 focus:ring-[#2D8A4E] transition text-sm" required />
                </div>
              </div>

              <hr className="my-2 border-gray-100" />

              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Farm / village name</label>
                <input type="text" name="farmVillageName" placeholder="e.g. Patel Farm, Olpad" onChange={handleChange} className="w-full p-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#2D8A4E] focus:ring-1 focus:ring-[#2D8A4E] transition text-sm" required />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-wider">District</label>
                  <select name="district" onChange={handleChange} className="w-full p-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#2D8A4E] focus:ring-1 focus:ring-[#2D8A4E] transition bg-white text-sm">
                    <option value="Surat">Surat</option>
                    <option value="Navsari">Navsari</option>
                    <option value="Tapi">Tapi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Pincode</label>
                  <input type="text" name="pincode" placeholder="395001" maxLength={6} onChange={handleChange} className="w-full p-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#2D8A4E] focus:ring-1 focus:ring-[#2D8A4E] transition text-sm" required />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Farm size</label>
                <select name="farmSize" onChange={handleChange} className="w-full p-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#2D8A4E] focus:ring-1 focus:ring-[#2D8A4E] transition bg-white text-sm">
                  <option value="Under 1 acre">Under 1 acre</option>
                  <option value="1-5 acres">1-5 acres</option>
                  <option value="More than 5 acres">More than 5 acres</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-wider">What do you grow?</label>
                <div className="flex flex-wrap gap-2 mt-1.5">
                  {cropOptions.map(crop => (
                    <button key={crop} type="button" onClick={() => toggleCrop(crop)} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${selectedCrops.includes(crop) ? "bg-green-50 border-[#2D8A4E] text-[#2D8A4E]" : "bg-white border-gray-200 text-gray-600 hover:border-[#2D8A4E] hover:text-[#2D8A4E]"}`}>
                      {crop}
                    </button>
                  ))}
                </div>
              </div>

              <div id="recaptcha-container"></div>
              <div className="pt-4">
                <button type="submit" className="w-full bg-[#2D8A4E] border border-[#2D8A4E] text-white font-bold py-3 rounded-lg hover:bg-green-700 transition shadow-sm">
                  Create account & send OTP
                </button>
              </div>
              <p className="text-center text-xs text-gray-500 mt-4">
                Already have an account? <Link href="/login" className="text-[#2D8A4E] font-bold hover:underline">Log in</Link>
              </p>
            </form>
          </div>
        ) : (
          <div>
            <div className="text-center mb-6">
              <h2 className="text-lg font-bold text-gray-900">Enter OTP</h2>
              <p className="text-sm text-gray-500 mt-1">Sent to +91 {formData.phone} <button onClick={() => setStep(1)} className="text-[#2D8A4E] font-medium hover:underline ml-1">Change</button></p>
            </div>
            <form onSubmit={verifyOTP} className="space-y-6">
              <div>
                <input type="text" placeholder="• • • • • •" maxLength={6} className="w-full p-4 border border-gray-200 rounded-lg outline-none focus:border-[#2D8A4E] focus:ring-1 focus:ring-[#2D8A4E] transition text-center tracking-[1em] text-xl font-bold" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} required />
              </div>
              <button type="submit" className="w-full bg-emerald-600 text-white font-semibold py-3.5 rounded-xl hover:bg-emerald-500 transition shadow-sm">
                Verify & create account
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}