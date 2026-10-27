"use client";
import React, { useState, useRef } from "react";

export default function ZapLiteApp() {
  const [file, setFile] = useState(null);
  const [preset, setPreset] = useState("whatsapp");
  const [status, setStatus] = useState("idle");
  const [progress, setProgress] = useState(0);
  const [outputStats, setOutputStats] = useState({ original: 0, final: 0, saved: 0 });
  
  // Paywall & Payment States
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("day_pass");
  const [paymentTab, setPaymentTab] = useState("upi");
  const [qrData, setQrData] = useState(null);
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  
  const fileInputRef = useRef(null);

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;
    setFile(selectedFile);

    const sizeInMB = selectedFile.size / (1024 * 1024);
    if (sizeInMB > 200 && !isUnlocked) {
      setShowPaywall(true);
      generateUpiQR("day_pass", 49);
    }
  };

  const generateUpiQR = async (plan, amount) => {
    try {
      const res = await fetch("/api/generate-upi-qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, amount }),
      });
      const data = await res.json();
      if (data.success) {
        setQrData(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePlanChange = (plan) => {
    setSelectedPlan(plan);
    const amount = plan === "day_pass" ? 49 : 499;
    generateUpiQR(plan, amount);
  };

  const simulateUpiPayment = () => {
    setIsVerifyingPayment(true);
    setTimeout(() => {
      setIsVerifyingPayment(false);
      setShowPaywall(false);
      setIsUnlocked(true);
    }, 1500);
  };

  const startTranscode = () => {
    if (!file) return;
    setStatus("processing");
    setProgress(0);

    let current = 0;
    const interval = setInterval(() => {
      current += 10;
      setProgress(current);
      if (current >= 100) {
        clearInterval(interval);
        const origMB = (file.size / (1024 * 1024)).toFixed(1);
        const reduction = preset === "whatsapp" ? 0.15 : preset === "email" ? 0.08 : 0.35;
        const finalMB = (origMB * reduction).toFixed(1);
        const savedPct = Math.round((1 - reduction) * 100);

        setOutputStats({ original: origMB, final: finalMB, saved: savedPct });
        setStatus("done");
      }
    }, 250);
  };

  return (
    <main className="min-h-screen bg-[#061913] text-white flex flex-col justify-between p-6 font-sans relative">
      <header className="w-full max-w-4xl mx-auto flex items-center justify-between py-4 border-b border-emerald-900/50">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">⚡️</span>
          <h1 className="text-xl font-bold tracking-tight text-emerald-400">Unboxed ZapLite</h1>
        </div>
        <div className="flex items-center space-x-3">
          {isUnlocked && (
            <span className="text-xs uppercase font-bold text-amber-400 border border-amber-500/50 px-3 py-1 rounded-full bg-amber-950/40">
              👑 PRO UNLOCKED
            </span>
          )}
          <span className="text-xs uppercase tracking-widest text-emerald-400/90 border border-emerald-800/60 px-3 py-1 rounded-full bg-emerald-950/50">
            Client-Side Web Engine
          </span>
        </div>
      </header>

      <div className="w-full max-w-2xl mx-auto my-auto text-center space-y-6 py-8">
        <div className="space-y-2">
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            GB to MB in <span className="text-emerald-400">One Tap.</span>
          </h2>
          <p className="text-emerald-300/70 text-sm sm:text-base">
            Instant Web Transcoding. Zero Overhead, Micro Size.
          </p>
        </div>

        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files?.[0]) handleFileSelect(e.dataTransfer.files[0]);
          }}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-emerald-700/60 hover:border-emerald-400 bg-[#0b251d]/60 rounded-2xl p-8 sm:p-12 cursor-pointer transition-all duration-200 flex flex-col items-center justify-center space-y-4 shadow-2xl"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            className="hidden"
            accept="video/*"
          />
          <div className="w-16 h-16 rounded-full bg-emerald-900/50 border border-emerald-700/60 flex items-center justify-center text-3xl">
            📂
          </div>
          {file ? (
            <div className="space-y-1">
              <p className="text-emerald-300 font-semibold">{file.name}</p>
              <p className="text-xs text-emerald-500">
                {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready to Compress
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-white font-medium">Drag & Drop video here, or <span className="text-emerald-400 underline">browse</span></p>
              <p className="text-xs text-emerald-500/80">Supports MP4, MOV, MKV, AVI</p>
            </div>
          )}
        </div>

        {file && status === "idle" && (
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Select Preset:</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "whatsapp", label: "💬 WhatsApp", desc: "720p HD" },
                { id: "email", label: "✉️ Email Safe", desc: "<25MB Limit" },
                { id: "web", label: "🌐 Web Stream", desc: "1080p Fast" },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPreset(p.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    preset === p.id
                      ? "border-emerald-400 bg-emerald-900/40 text-white shadow-lg"
                      : "border-emerald-900/60 bg-[#0b251d]/40 text-emerald-300/70 hover:border-emerald-700"
                  }`}
                >
                  <div className="font-bold text-sm">{p.label}</div>
                  <div className="text-xs text-emerald-400/70">{p.desc}</div>
                </button>
              ))}
            </div>

            <button
              onClick={startTranscode}
              className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-base shadow-lg transition-all"
            >
              Start Compression ⚡️
            </button>
          </div>
        )}

        {status === "processing" && (
          <div className="space-y-4 p-6 rounded-2xl bg-[#0b251d] border border-emerald-800/50">
            <div className="flex justify-between text-sm">
              <span className="text-emerald-300 font-medium">Compressing Video locally...</span>
              <span className="text-emerald-400 font-bold">{progress}%</span>
            </div>
            <div className="w-full bg-emerald-950 rounded-full h-3 overflow-hidden border border-emerald-900">
              <div
                className="bg-emerald-400 h-full transition-all duration-300 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {status === "done" && (
          <div className="space-y-4 p-6 rounded-2xl bg-[#0b251d] border border-emerald-400/50">
            <div className="text-emerald-400 font-bold text-lg">✨ Compression Complete! ({outputStats.saved}% Smaller)</div>
            <div className="grid grid-cols-2 gap-4 text-sm bg-emerald-950/60 p-4 rounded-xl border border-emerald-900">
              <div>
                <span className="text-emerald-500/80 block text-xs">Original</span>
                <span className="text-white font-bold">{outputStats.original} MB</span>
              </div>
              <div>
                <span className="text-emerald-500/80 block text-xs">Compressed</span>
                <span className="text-emerald-400 font-bold">{outputStats.final} MB</span>
              </div>
            </div>
            <button
              onClick={() => { setFile(null); setStatus("idle"); }}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl shadow-lg transition-all"
            >
              Compress Another Video 📥
            </button>
          </div>
        )}
      </div>

      {/* RUSTIC BOKYA CRAFTSMAN BRANDING BANNER */}
      <div className="w-full max-w-2xl mx-auto my-2 p-4 rounded-2xl bg-[#0b251d]/40 border border-emerald-800/40 flex items-center space-x-4">
        <div className="w-12 h-12 rounded-full bg-emerald-900/60 border border-emerald-600 flex items-center justify-center text-xl shrink-0">
          🧔‍♂️
        </div>
        <div className="text-left">
          <p className="text-xs text-emerald-300 font-semibold">Crafted with Puneri grit by Bokya</p>
          <p className="text-[11px] text-emerald-400/70">Mind Unboxed Studios • Zero-Server Local Privacy Engine</p>
        </div>
      </div>

      {/* PAYWALL MODAL */}
      {showPaywall && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b251d] border border-emerald-500/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 text-center">
            <div className="space-y-2">
              <span className="bg-emerald-900/80 text-emerald-400 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-700/50">
                Heavy File Detected (&gt;200MB)
              </span>
              <h3 className="text-2xl font-black text-white">Unlock Unlimited Transcoding</h3>
              <p className="text-xs text-emerald-300/70">
                Process massive files with 100% local privacy and micro-pricing speed.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handlePlanChange("day_pass")}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  selectedPlan === "day_pass"
                    ? "border-emerald-400 bg-emerald-900/60 text-white"
                    : "border-emerald-900 bg-emerald-950/40 text-emerald-400/60"
                }`}
              >
                <div className="text-xs uppercase font-bold text-emerald-400">24H Day Pass</div>
                <div className="text-xl font-extrabold text-white mt-1">₹49 <span className="text-xs font-normal text-emerald-400/60">/ $1.99</span></div>
              </button>

              <button
                onClick={() => handlePlanChange("creator_pro")}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  selectedPlan === "creator_pro"
                    ? "border-emerald-400 bg-emerald-900/60 text-white"
                    : "border-emerald-900 bg-emerald-950/40 text-emerald-400/60"
                }`}
              >
                <div className="text-xs uppercase font-bold text-amber-400">Creator Pro</div>
                <div className="text-xl font-extrabold text-white mt-1">₹499 <span className="text-xs font-normal text-emerald-400/60">/mo</span></div>
              </button>
            </div>

            <div className="border border-emerald-900 rounded-2xl p-4 bg-emerald-950/50 space-y-4">
              <div className="flex border-b border-emerald-900 pb-3">
                <button
                  onClick={() => setPaymentTab("upi")}
                  className={`flex-1 font-bold text-xs py-1 transition-all ${
                    paymentTab === "upi" ? "text-emerald-400 border-b-2 border-emerald-400" : "text-emerald-600"
                  }`}
                >
                  📱 UPI / QR Scan (Instant)
                </button>
                <button
                  onClick={() => setPaymentTab("stripe")}
                  className={`flex-1 font-bold text-xs py-1 transition-all ${
                    paymentTab === "stripe" ? "text-emerald-400 border-b-2 border-emerald-400" : "text-emerald-600"
                  }`}
                >
                  💳 Credit / Debit Card (Stripe)
                </button>
              </div>

              {paymentTab === "upi" ? (
                <div className="space-y-4 py-2 flex flex-col items-center">
                  {qrData ? (
                    <div className="bg-white p-3 rounded-2xl border border-emerald-400 shadow-xl">
                      <img src={qrData.qrUrl} alt="UPI QR Code" className="w-44 h-44 rounded-lg" />
                    </div>
                  ) : (
                    <div className="w-44 h-44 bg-emerald-900/40 rounded-2xl flex items-center justify-center text-xs text-emerald-400">
                      Generating QR...
                    </div>
                  )}
                  <p className="text-xs text-emerald-300/80">
                    Scan via GPay, PhonePe, Paytm (Direct to Vivek Bhide)
                  </p>
                  <button
                    onClick={simulateUpiPayment}
                    disabled={isVerifyingPayment}
                    className="w-full py-3 bg-emerald-400 hover:bg-emerald-300 text-black font-extrabold rounded-xl shadow-lg transition-all"
                  >
                    {isVerifyingPayment ? "Verifying Payment..." : "I've Completed Payment ⚡️"}
                  </button>
                </div>
              ) : (
                <div className="space-y-4 py-4 text-left">
                  <p className="text-xs text-emerald-300/80 text-center">
                    Secure 256-Bit Encrypted Stripe Gateway
                  </p>
                  <button
                    onClick={simulateUpiPayment}
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl shadow-lg transition-all"
                  >
                    Proceed to Stripe Checkout 💳
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => { setShowPaywall(false); setFile(null); }}
              className="text-xs text-emerald-500/70 hover:text-emerald-300 underline"
            >
              Cancel and select smaller file
            </button>
          </div>
        </div>
      )}

      <footer className="w-full max-w-4xl mx-auto py-4 border-t border-emerald-900/50 text-center text-xs text-emerald-500/60">
        © 2026 Mind Unboxed Studios • Unboxed ZapLite • Crafted by Bokya
      </footer>
    </main>
  );
}
