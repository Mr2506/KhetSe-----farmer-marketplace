"use client";

import React, { useState, useEffect } from "react";
import { auth } from "@/lib/firebase"; 
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
import { useRouter } from "next/navigation"; 

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier | undefined;
  }
}

export default function LoginPage() {
  const router = useRouter(); 
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [selectedRole, setSelectedRole] = useState<"buyer" | "farmer" | null>(null);

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

  const requestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    const formattedNumber = `+91${phoneNumber}`;

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
      
      setMessage({ text: "Verifying with server...", type: "success" });

      // 2. Send token to Node.js Backend!
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firebaseToken })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // 3. Success! Save Token & Route based on Backend Database Role
      localStorage.setItem("khetse_token", data.token);
      localStorage.setItem("khetse_role", data.role);

      setMessage({ text: `Welcome back, ${data.firstName || 'User'}!`, type: "success" });

      // 4. THE MAGIC ROUTER
      setTimeout(() => {
        // Routes to Meet's specific dashboards based on backend truth
        if (data.role === "Admin") router.push("/admin"); 
        else if (data.role === "Farmer") router.push("/farmer");
        else router.push("/buyer");
      }, 1000);

    } catch (error: any) {
      console.error(error);
      // If the backend says "Account not found", tell them to sign up!
      if (error.message.includes("not found")) {
        setMessage({ text: "Account not found. Please select a role below and click Create Account.", type: "error" });
        setStep(1); // Send them back to step 1 to choose a role
      } else {
        setMessage({ text: "Invalid OTP or Login Failed.", type: "error" });
      }
    }
  };

  const handleSignupClick = () => {
    if (!selectedRole) {
      setMessage({ text: "Please select Buyer or Farmer above before creating an account.", type: "error" });
      return;
    }
    router.push(`/signup/${selectedRole}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f4ef] px-4 py-10 font-sans">
      <div className="w-full max-w-[440px] bg-white rounded-3xl p-8 shadow-sm border border-zinc-200 transition-all">
        
        {/* LOGO MATCHING MEET'S THEME */}
        <div className="flex flex-col items-center mb-6">
          <div className="bg-emerald-600 text-white p-2.5 rounded-xl mb-3 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">KhetSe</h1>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded-xl text-sm font-medium text-center ${message.type === "error" ? "bg-red-50 text-red-600 border border-red-100" : "bg-emerald-50 text-emerald-700 border border-emerald-100"}`}>
            {message.text}
          </div>
        )}

        {step === 1 ? (
          <div>
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-zinc-900 tracking-tight">Welcome back</h2>
              <p className="text-sm text-zinc-500 mt-1">Login to your account</p>
            </div>

            <form onSubmit={requestOTP} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-600 mb-1.5 uppercase tracking-wide">Phone number</label>
                <div className="flex">
                  <div className="flex items-center justify-center bg-zinc-50 border border-zinc-200 border-r-0 rounded-l-xl px-4 text-zinc-600 font-medium">+91</div>
                  <input type="tel" placeholder="98765 43210" maxLength={10} className="w-full p-3.5 border border-zinc-200 rounded-r-xl outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))} required />
                </div>
              </div>
              <div id="recaptcha-container"></div>
              <button type="submit" className="w-full bg-emerald-600 text-white font-semibold py-3.5 rounded-xl hover:bg-emerald-500 transition shadow-sm">
                Send OTP
              </button>
            </form>

            {/* NEW SIGNUP SECTION */}
            <div className="mt-8 mb-6 flex items-center justify-center text-xs text-zinc-400 font-medium">
              <span className="bg-zinc-200 h-px w-full"></span><span className="px-3 whitespace-nowrap">New to KhetSe?</span><span className="bg-zinc-200 h-px w-full"></span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div onClick={() => setSelectedRole("buyer")} className={`border rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition ${selectedRole === "buyer" ? "border-emerald-600 bg-emerald-50 text-emerald-700" : "border-zinc-200 text-zinc-600 hover:border-emerald-600 hover:bg-emerald-50"}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <span className="text-sm font-bold">Buyer</span>
              </div>
              
              <div onClick={() => setSelectedRole("farmer")} className={`border rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition ${selectedRole === "farmer" ? "border-emerald-600 bg-emerald-50 text-emerald-700" : "border-zinc-200 text-zinc-600 hover:border-emerald-600 hover:bg-emerald-50"}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2"><path d="M3 18h18"/><path d="M14 18v-4h4v4"/><path d="M8 12h4"/><path d="M8 18v-6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v6"/><path d="M15 8V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v4"/></svg>
                <span className="text-sm font-bold">Farmer</span>
              </div>
            </div>

            <button onClick={handleSignupClick} className="w-full bg-emerald-600 text-white font-semibold py-3.5 rounded-xl hover:bg-emerald-500 transition shadow-sm">
              Create Account
            </button>
          </div>
        ) : (
          <div>
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-zinc-900 tracking-tight">Enter OTP</h2>
              <p className="text-sm text-zinc-500 mt-1">Sent to +91 {phoneNumber} <button onClick={() => setStep(1)} className="text-emerald-600 font-medium hover:underline ml-1">Change</button></p>
            </div>
            <form onSubmit={verifyOTP} className="space-y-6">
              <div>
                <input type="text" placeholder="• • • • • •" maxLength={6} className="w-full p-4 border border-zinc-200 rounded-xl outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition text-center tracking-[1em] text-xl font-bold text-zinc-900 bg-zinc-50" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} required />
              </div>
              <button type="submit" className="w-full bg-emerald-600 text-white font-semibold py-3.5 rounded-xl hover:bg-emerald-500 transition shadow-sm">
                Verify & Login
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}