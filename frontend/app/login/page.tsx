"use client";

import React, { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Leaf, ShoppingBag, Tractor, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";

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
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
    const formattedNumber = `+91${phoneNumber}`;

    try {
      // 1. SMART PRE-CHECK: Ask Node.js if this number exists in MongoDB
      const checkRes = await fetch("http://localhost:5000/api/users/check-phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: formattedNumber })
      });

      const checkData = await checkRes.json();

      // If the backend says the user doesn't exist, stop immediately!
      if (!checkRes.ok || !checkData.exists) {
        throw new Error("ACCOUNT_NOT_FOUND");
      }

      // 2. If they do exist, proceed with Firebase SMS
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
      // Catch our custom error and show the exact message you wanted
      if (error.message === "ACCOUNT_NOT_FOUND") {
        setMessage({ text: "Account not found. Please select a role below and click Create Account.", type: "error" });
      } else {
        setMessage({ text: "Error sending OTP: " + error.message, type: "error" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsLoading(true);

    if (!confirmationResult) {
      setMessage({ text: "Please request OTP first", type: "error" });
      setIsLoading(false);
      return;
    }

    try {
      const result = await confirmationResult.confirm(otp);
      const firebaseToken = await result.user.getIdToken();

      setMessage({ text: "Verifying with server...", type: "success" });

      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firebaseToken })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("khetse_token", data.token);
      localStorage.setItem("khetse_role", data.role);

      setMessage({ text: `Welcome back, ${data.firstName || 'User'}!`, type: "success" });

      setTimeout(() => {
        if (data.role === "Admin") router.push("/admin");
        else if (data.role === "Farmer") router.push("/farmer");
        else router.push("/buyer");
      }, 1000);

    } catch (error: any) {
      console.error(error);
      if (error.message.includes("not found")) {
        setMessage({ text: "Account not found. Please select a role below and click Create Account.", type: "error" });
        setStep(1);
      } else {
        setMessage({ text: "Invalid OTP or Login Failed.", type: "error" });
      }
    } finally {
      setIsLoading(false);
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
    <div className="min-h-screen flex font-sans bg-[#f6f4ef]">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-[44%] flex-col justify-between bg-emerald-950 text-white p-12 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 h-96 w-96 rounded-full bg-emerald-400 blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-teal-400 blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm">
              <Leaf className="h-5 w-5 text-emerald-300" />
            </div>
            <span className="text-xl font-bold tracking-tight">KhetSe</span>
          </div>
        </div>

        <div className="relative space-y-6">
          <div>
            <p className="text-emerald-400 text-sm font-semibold uppercase tracking-widest mb-3">Direct Farm Marketplace</p>
            <h2 className="text-4xl font-bold leading-tight text-white">
              Farm fresh produce, straight to your table
            </h2>
            <p className="mt-4 text-emerald-200/80 text-lg leading-relaxed">
              Connect directly with verified local farmers. Zero middlemen, maximum freshness.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {[
              "Harvested same-morning produce",
              "Verified local farmers only",
              "Transparent farm-direct pricing",
            ].map((text) => (
              <div key={text} className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                </div>
                <span className="text-sm text-emerald-100/90">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <p className="text-emerald-400/60 text-xs">&copy; 2026 KhetSe. Built in Gujarat.</p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 lg:px-16">
        <div className="w-full max-w-[400px]">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-600 text-white">
              <Leaf className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold text-zinc-900">KhetSe</span>
          </div>

          {message && (
            <div className={`mb-6 flex items-start gap-3 rounded-2xl p-4 text-sm font-medium border ${message.type === "error"
                ? "bg-red-50 text-red-700 border-red-200/60"
                : "bg-emerald-50 text-emerald-800 border-emerald-200/60"
              }`}>
              {message.type === "error"
                ? <AlertCircle className="h-4 w-4 mt-0.5 shrink-0 text-red-500" />
                : <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-emerald-600" />
              }
              {message.text}
            </div>
          )}

          {step === 1 ? (
            <div>
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Welcome back</h1>
                <p className="text-sm text-zinc-500 mt-1.5 leading-relaxed">Sign in using your registered phone number</p>
              </div>

              <form onSubmit={requestOTP} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-zinc-600 mb-2 uppercase tracking-wider">
                    Phone Number
                  </label>
                  <div className="flex rounded-xl overflow-hidden border border-zinc-300 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/15 transition-all">
                    <div className="flex items-center justify-center bg-zinc-50 border-r border-zinc-300 px-4 py-3 text-zinc-700 font-semibold text-sm shrink-0">
                      +91
                    </div>
                    <input
                      type="tel"
                      placeholder="98765 43210"
                      maxLength={10}
                      className="flex-1 px-4 py-3 bg-white text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                      required
                    />
                  </div>
                </div>
                <div id="recaptcha-container" />
                <button
                  type="submit"
                  disabled={isLoading || phoneNumber.length < 10}
                  className="group w-full flex items-center justify-center gap-2 bg-emerald-600 text-white font-semibold py-3.5 rounded-xl hover:bg-emerald-500 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-emerald-600/20"
                >
                  {isLoading ? "Checking..." : "Send OTP"}
                  {!isLoading && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />}
                </button>
              </form>

              <div className="mt-10 mb-7">
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-zinc-200" />
                  <span className="text-xs font-medium text-zinc-400 whitespace-nowrap">New to KhetSe?</span>
                  <div className="flex-1 h-px bg-zinc-200" />
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-xs font-semibold text-zinc-600 uppercase tracking-wider">Select your role to register</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      role: "buyer" as const,
                      label: "Buyer",
                      subtitle: "Shop fresh produce",
                      icon: ShoppingBag,
                    },
                    {
                      role: "farmer" as const,
                      label: "Farmer",
                      subtitle: "Sell your harvest",
                      icon: Tractor,
                    },
                  ].map(({ role, label, subtitle, icon: Icon }) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setSelectedRole(role)}
                      className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-left transition-all duration-200 ${selectedRole === role
                          ? "border-emerald-500 bg-emerald-50 shadow-sm shadow-emerald-500/10"
                          : "border-zinc-200 bg-white hover:border-emerald-400 hover:bg-emerald-50/40"
                        }`}
                    >
                      <div className={`grid h-10 w-10 place-items-center rounded-xl transition-colors ${selectedRole === role ? "bg-emerald-100 text-emerald-700" : "bg-zinc-100 text-zinc-500"
                        }`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="text-center">
                        <p className={`text-sm font-bold transition-colors ${selectedRole === role ? "text-emerald-800" : "text-zinc-700"}`}>
                          {label}
                        </p>
                        <p className={`text-[11px] transition-colors ${selectedRole === role ? "text-emerald-600" : "text-zinc-400"}`}>
                          {subtitle}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleSignupClick}
                  disabled={!selectedRole}
                  className="w-full rounded-xl border-2 border-zinc-200 bg-white py-3.5 text-sm font-semibold text-zinc-700 hover:border-emerald-400 hover:text-emerald-700 hover:bg-emerald-50/40 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Create Account
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Enter your OTP</h1>
                <p className="text-sm text-zinc-500 mt-1.5">
                  Sent to +91 {phoneNumber}{" "}
                  <button onClick={() => setStep(1)} className="text-emerald-600 font-semibold hover:underline ml-1 transition-colors">
                    Change
                  </button>
                </p>
              </div>

              <form onSubmit={verifyOTP} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-zinc-600 mb-2 uppercase tracking-wider">
                    6-Digit Code
                  </label>
                  <input
                    type="text"
                    placeholder="• • • • • •"
                    maxLength={6}
                    className="w-full rounded-xl border-2 border-zinc-200 px-4 py-4 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 transition-all text-center tracking-[0.5em] text-2xl font-bold text-zinc-900 bg-zinc-50/50"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading || otp.length < 6}
                  className="group w-full flex items-center justify-center gap-2 bg-emerald-600 text-white font-semibold py-3.5 rounded-xl hover:bg-emerald-500 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-emerald-600/20"
                >
                  {isLoading ? "Verifying..." : "Verify & Sign In"}
                  {!isLoading && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}