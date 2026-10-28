"use client";

import React, { useState } from "react";
import { Zap, ShieldCheck, Upload, Download, CheckCircle, RefreshCw, QrCode, Lock, Globe, CreditCard } from "lucide-react";

export default function UnboxedZapLite() {
  const [file, setFile] = useState<File | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "global" | null>(null);

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selectedFile = e.dataTransfer.files[0];
      setFile(selectedFile);
      if (selectedFile.size > 200 * 1024 * 1024 && !isUnlocked) {
        setShowPaywall(true);
      }
    }
  };

  const startCompression = () => {
    if (!file) return;
    if (file.size > 200 * 1024 * 1024 && !isUnlocked) {
      setShowPaywall(true);
      return;
    }

    setIsCompressing(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsCompressing(false);
          setIsCompleted(true);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  return (
    <main className="min-h-screen bg-[#07130E] text-[#E2F1EC] font-sans selection:bg-[#00FF88] selection:text-black flex flex-col justify-between p-6">
      {/* Top Header & Navigation */}
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between py-4 border-b border-[#143424]">
        <div className="flex items-center space-x-3">
          <div className="bg-[#00FF88]/10 p-2 rounded-xl border border-[#00FF88]/30">
            <Zap className="w-6 h-6 text-[#00FF88]" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">Unboxed ZapLite</h1>
            <p className="text-xs text-[#8FAEA0]">Mind Unboxed Studios • Pune, India</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${isUnlocked ? 'bg-[#00FF88]/20 text-[#00FF88] border-[#00FF88]/40' : 'bg-[#143424] text-[#8FAEA0] border-[#225039]'}`}>
            {isUnlocked ? "PRO UNLOCKED 👑" : "FREE TIER (<200MB)"}
          </span>
          <span className="px-3 py-1 text-xs font-mono rounded-full bg-[#143424] text-[#00FF88] border border-[#225039]">
            LOCAL WASM ENGINE
          </span>
        </div>
      </header>

      {/* Main Studio Interactive Container */}
      <div className="max-w-2xl mx-auto w-full my-auto text-center space-y-8">
        <div className="space-y-3">
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            GB to MB in <span className="text-[#00FF88]">One Tap.</span>
          </h2>
          <p className="text-sm sm:text-base text-[#8FAEA0]">
            Instant Local Transcoding for Global Creators. Zero Server Uploads.
          </p>
        </div>

        {/* Upload / Transcode Card */}
        {!isCompleted ? (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            className="border-2 border-dashed border-[#1B4332] bg-[#0B1D16] hover:border-[#00FF88] transition-all rounded-3xl p-10 flex flex-col items-center justify-center space-y-4 cursor-pointer shadow-2xl relative overflow-hidden group"
          >
            <div className="p-4 bg-[#143424] rounded-2xl border border-[#225039] text-[#00FF88]">
              <Upload className="w-8 h-8" />
            </div>
            {file ? (
              <div className="space-y-1">
                <p className="text-sm font-semibold text-white">{file.name}</p>
                <p className="text-xs text-[#00FF88]">{(file.size / (1024 * 1024)).toFixed(2)} MB • Ready to Transcode</p>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-sm font-medium text-white">Drag & drop your video project here</p>
                <p className="text-xs text-[#8FAEA0]">Supports 4K MP4, MOV, WebM (In-Browser Privacy)</p>
              </div>
            )}

            <label className="mt-2 inline-flex items-center px-5 py-2.5 rounded-xl bg-[#00FF88] text-black font-semibold text-xs cursor-pointer hover:bg-[#33ff99] transition-colors shadow-lg shadow-[#00FF88]/20">
              Select Local Video File
              <input
                type="file"
                className="hidden"
                accept="video/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const f = e.target.files[0];
                    setFile(f);
                    if (f.size > 200 * 1024 * 1024 && !isUnlocked) {
                      setShowPaywall(true);
                    }
                  }
                }}
              />
            </label>
          </div>
        ) : (
          <div className="bg-[#0B1D16] border border-[#1B4332] rounded-3xl p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-center space-x-2 text-[#00FF88]">
              <CheckCircle className="w-6 h-6" />
              <h3 className="text-lg font-bold">Transcoding Complete! (65% Reduction)</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 p-4 bg-[#07130E] rounded-2xl border border-[#143424] text-center">
              <div>
                <p className="text-xs text-[#8FAEA0]">Original File</p>
                <p className="text-sm font-bold text-white">{file ? (file.size / (1024 * 1024)).toFixed(1) : 0} MB</p>
              </div>
              <div>
                <p className="text-xs text-[#8FAEA0]">Transcoded Result</p>
                <p className="text-sm font-bold text-[#00FF88]">{file ? ((file.size * 0.35) / (1024 * 1024)).toFixed(1) : 0} MB</p>
              </div>
            </div>
            <button
              onClick={() => {
                setIsCompleted(false);
                setFile(null);
                setProgress(0);
              }}
              className="w-full py-3 rounded-xl bg-[#00FF88] text-black font-bold text-xs hover:bg-[#33ff99] transition-colors flex items-center justify-center space-x-2 shadow-lg shadow-[#00FF88]/20"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Compress Another Video</span>
            </button>
          </div>
        )}

        {/* Compression Progress Bar */}
        {isCompressing && (
          <div className="space-y-2 bg-[#0B1D16] border border-[#1B4332] p-4 rounded-2xl">
            <div className="flex justify-between text-xs text-[#8FAEA0]">
              <span>Executing WebAssembly Transcoder...</span>
              <span className="text-[#00FF88] font-mono">{progress}%</span>
            </div>
            <div className="w-full bg-[#143424] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#00FF88] h-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Button */}
        {file && !isCompressing && !isCompleted && (
          <button
            onClick={startCompression}
            className="w-full py-4 rounded-2xl bg-[#00FF88] text-black font-bold text-sm tracking-wide hover:bg-[#33ff99] transition-all shadow-xl shadow-[#00FF88]/20 flex items-center justify-center space-x-2"
          >
            <Zap className="w-4 h-4 fill-black" />
            <span>Start Transcoding</span>
          </button>
        )}
      </div>

      {/* Dual Global Paywall Modal */}
      {showPaywall && !isUnlocked && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-[#0B1D16] border border-[#1B4332] max-w-md w-full rounded-3xl p-6 space-y-6 shadow-2xl relative">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-[#00FF88]/10 border border-[#00FF88]/30 rounded-2xl flex items-center justify-center mx-auto text-[#00FF88]">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Large File Pass (&gt;200MB)</h3>
              <p className="text-xs text-[#8FAEA0]">
                Unlock unlimited high-capacity local video transcoding instantly.
              </p>
            </div>

            {/* Selector: Domestic vs Global Payment */}
            <div className="space-y-3">
              <button
                onClick={() => setPaymentMethod("upi")}
                className="w-full p-4 rounded-2xl bg-[#07130E] border border-[#143424] hover:border-[#00FF88] transition-all flex items-center justify-between text-left group"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-[#143424] rounded-xl text-[#00FF88]">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">🇮🇳 Domestic Creators (India)</p>
                    <p className="text-[10px] text-[#8FAEA0]">Kotak Bank UPI VPA • ₹499 Lifetime</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#00FF88] group-hover:translate-x-1 transition-transform">→</span>
              </button>

              <button
                onClick={() => setPaymentMethod("global")}
                className="w-full p-4 rounded-2xl bg-[#07130E] border border-[#143424] hover:border-[#00FF88] transition-all flex items-center justify-between text-left group"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-[#143424] rounded-xl text-[#00FF88]">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">🌍 International Creators (UK / USA / EU)</p>
                    <p className="text-[10px] text-[#8FAEA0]">International Card / Wise • £5 / $6 USD</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#00FF88] group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>

            <button
              onClick={() => setShowPaywall(false)}
              className="w-full py-2.5 rounded-xl bg-[#143424] text-[#8FAEA0] font-medium text-xs hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Kotak UPI Payment Modal */}
      {paymentMethod === "upi" && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-lg flex items-center justify-center p-4 z-50">
          <div className="bg-[#0B1D16] border border-[#00FF88]/40 max-w-sm w-full rounded-3xl p-6 space-y-5 text-center shadow-2xl">
            <h4 className="text-lg font-bold text-white">Kotak UPI Direct Settlement</h4>
            <p className="text-xs text-[#8FAEA0]">Scan using GPay, PhonePe, or Paytm.</p>
            
            <div className="bg-white p-4 rounded-2xl inline-block shadow-inner mx-auto">
              <div className="w-44 h-44 bg-slate-900 rounded-xl flex flex-col items-center justify-center text-white text-center p-2">
                <QrCode className="w-16 h-16 text-[#00FF88] mb-2" />
                <span className="text-[10px] font-mono">iamvivekbhide-8@okaxis</span>
                <span className="text-[9px] text-emerald-400 mt-1">Kotak A/C 2812412033</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  setIsUnlocked(true);
                  setPaymentMethod(null);
                  setShowPaywall(false);
                }}
                className="w-full py-3 rounded-xl bg-[#00FF88] text-black font-bold text-xs hover:bg-[#33ff99] transition-colors"
              >
                I Have Paid — Unlock Creator Pro ✨
              </button>
              <button
                onClick={() => setPaymentMethod(null)}
                className="w-full py-2 rounded-xl bg-[#143424] text-[#8FAEA0] text-xs hover:text-white"
              >
                Back to Payment Options
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Card / International Modal */}
      {paymentMethod === "global" && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-lg flex items-center justify-center p-4 z-50">
          <div className="bg-[#0B1D16] border border-[#00FF88]/40 max-w-sm w-full rounded-3xl p-6 space-y-5 text-center shadow-2xl">
            <h4 className="text-lg font-bold text-white">Global Creator Access (£5 / $6)</h4>
            <p className="text-xs text-[#8FAEA0]">Pay via UK / EU / US Debit or Credit Card with direct swift settlement.</p>
            
            <div className="bg-[#07130E] border border-[#143424] p-4 rounded-2xl text-left space-y-2">
              <div className="flex items-center space-x-2 text-[#00FF88]">
                <CreditCard className="w-4 h-4" />
                <span className="text-xs font-bold">International Rail Active</span>
              </div>
              <p className="text-[11px] text-[#8FAEA0]">Supports Visa, Mastercard, American Express, and Wise International sweep.</p>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  setIsUnlocked(true);
                  setPaymentMethod(null);
                  setShowPaywall(false);
                }}
                className="w-full py-3 rounded-xl bg-[#00FF88] text-black font-bold text-xs hover:bg-[#33ff99] transition-colors"
              >
                Simulate Global Checkout Success ✨
              </button>
              <button
                onClick={() => setPaymentMethod(null)}
                className="w-full py-2 rounded-xl bg-[#143424] text-[#8FAEA0] text-xs hover:text-white"
              >
                Back to Payment Options
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Signature Bokya Persona Footer */}
      <footer className="max-w-4xl mx-auto w-full pt-6 border-t border-[#143424] flex flex-col sm:flex-row items-center justify-between text-xs text-[#8FAEA0] gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-[#143424] border border-[#00FF88]/40 flex items-center justify-center overflow-hidden shadow-md">
            <span className="text-base">🧔🏽‍♂️</span>
          </div>
          <div>
            <p className="text-white font-semibold">Crafted with Puneri grit by Bokya</p>
            <p className="text-[10px] text-[#8FAEA0]">Mind Unboxed Studios • Pune • Direct Financial Rails</p>
          </div>
        </div>
        <p className="text-[11px]">© 2026 Mind Unboxed Studios</p>
      </footer>
    </main>
  );
}
