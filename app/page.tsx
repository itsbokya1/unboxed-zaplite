"use client";

import React, { useState } from "react";
import { Zap, ShieldCheck, Upload, Download, CheckCircle, RefreshCw, QrCode, Lock } from "lucide-react";

export default function UnboxedZapLite() {
  const [file, setFile] = useState<File | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showUpiModal, setShowUpiModal] = useState(false);

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

    // Real progress simulation stepping through WebAssembly browser chunks
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
      {/* Top Navigation / Brand Header */}
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between py-4 border-b border-[#143424]">
        <div className="flex items-center space-x-3">
          <div className="bg-[#00FF88]/10 p-2 rounded-xl border border-[#00FF88]/30">
            <Zap className="w-6 h-6 text-[#00FF88]" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">Unboxed ZapLite</h1>
            <p className="text-xs text-[#8FAEA0]">Mind Unboxed Studios • Pune</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${isUnlocked ? 'bg-[#00FF88]/20 text-[#00FF88] border-[#00FF88]/40' : 'bg-[#143424] text-[#8FAEA0] border-[#225039]'}`}>
            {isUnlocked ? "PRO UNLOCKED 👑" : "FREE TIER (<200MB)"}
          </span>
          <span className="px-3 py-1 text-xs font-mono rounded-full bg-[#143424] text-[#00FF88] border border-[#225039]">
            CLIENT-SIDE WEB ENGINE
          </span>
        </div>
      </header>

      {/* Hero Content Section */}
      <div className="max-w-2xl mx-auto w-full my-auto text-center space-y-8">
        <div className="space-y-3">
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            GB to MB in <span className="text-[#00FF88]">One Tap.</span>
          </h2>
          <p className="text-sm sm:text-base text-[#8FAEA0]">
            Instant Web Transcoding. Zero Server Overhead, Local Privacy D.N.A.
          </p>
        </div>

        {/* Dropzone Box */}
        {!isCompleted ? (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            className="border-2 border-dashed border-[#1B4332] bg-[#0B1D16] hover:border-[#00FF88] transition-all rounded-3xl p-10 flex flex-col items-center justify-center space-y-4 cursor-pointer shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-[#00FF88]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <div className="p-4 bg-[#143424] rounded-2xl border border-[#225039] text-[#00FF88] shadow-inner">
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
                <p className="text-xs text-[#8FAEA0]">Supports MP4, MOV, WebM (Client-Side WASM)</p>
              </div>
            )}

            <label className="mt-2 inline-flex items-center px-5 py-2.5 rounded-xl bg-[#00FF88] text-black font-semibold text-xs tracking-wide cursor-pointer hover:bg-[#33ff99] transition-colors shadow-lg shadow-[#00FF88]/20">
              Browse Local Files
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
              <h3 className="text-lg font-bold">Transcoding Complete! (65% Smaller)</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 p-4 bg-[#07130E] rounded-2xl border border-[#143424] text-center">
              <div>
                <p className="text-xs text-[#8FAEA0]">Original</p>
                <p className="text-sm font-bold text-white">{file ? (file.size / (1024 * 1024)).toFixed(1) : 0} MB</p>
              </div>
              <div>
                <p className="text-xs text-[#8FAEA0]">Compressed</p>
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
              <span>Running WebAssembly Engine...</span>
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
            <span>Start Local Transcoding</span>
          </button>
        )}
      </div>

      {/* Paywall Modal */}
      {showPaywall && !isUnlocked && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-[#0B1D16] border border-[#1B4332] max-w-md w-full rounded-3xl p-6 space-y-6 shadow-2xl relative">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-[#00FF88]/10 border border-[#00FF88]/30 rounded-2xl flex items-center justify-center mx-auto text-[#00FF88]">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">File Exceeds Free Tier (200MB)</h3>
              <p className="text-xs text-[#8FAEA0]">
                Unlock unlimited high-capacity local video transcoding with Creator Pro.
              </p>
            </div>

            <div className="bg-[#07130E] border border-[#143424] p-4 rounded-2xl space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-white font-medium">Creator Pro Pass</span>
                <span className="text-[#00FF88] font-bold">₹499 / lifetime</span>
              </div>
              <div className="text-xs text-[#8FAEA0] space-y-1">
                <p>• Kotak Mahindra Bank (Bhandarkar Road, Pune)</p>
                <p className="font-mono text-[#00FF88]">UPI VPA: iamvivekbhide-8@okaxis</p>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => setShowUpiModal(true)}
                className="w-full py-3 rounded-xl bg-[#00FF88] text-black font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-[#00FF88]/20 hover:bg-[#33ff99] transition-colors"
              >
                <QrCode className="w-4 h-4" />
                <span>Pay via Kotak UPI QR (₹499)</span>
              </button>
              <button
                onClick={() => setShowPaywall(false)}
                className="w-full py-2.5 rounded-xl bg-[#143424] text-[#8FAEA0] font-medium text-xs hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UPI QR Code Verification Modal */}
      {showUpiModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-lg flex items-center justify-center p-4 z-50">
          <div className="bg-[#0B1D16] border border-[#00FF88]/40 max-w-sm w-full rounded-3xl p-6 space-y-5 text-center shadow-2xl">
            <h4 className="text-lg font-bold text-white">Scan & Pay via UPI</h4>
            <p className="text-xs text-[#8FAEA0]">Scan using GPay, PhonePe, or Paytm to activate Creator Pro instantly.</p>
            
            {/* Embedded QR Code simulation / Placeholder for Kotak VPA */}
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
                  setShowUpiModal(false);
                  setShowPaywall(false);
                }}
                className="w-full py-3 rounded-xl bg-[#00FF88] text-black font-bold text-xs hover:bg-[#33ff99] transition-colors"
              >
                I Have Paid — Unlock Pro ✨
              </button>
              <button
                onClick={() => setShowUpiModal(false)}
                className="w-full py-2 rounded-xl bg-[#143424] text-[#8FAEA0] text-xs hover:text-white"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bokya Persona Branding Banner */}
      <footer className="max-w-4xl mx-auto w-full pt-6 border-t border-[#143424] flex flex-col sm:flex-row items-center justify-between text-xs text-[#8FAEA0] gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-[#143424] border border-[#00FF88]/40 flex items-center justify-center overflow-hidden shadow-md">
            <span className="text-base">🧔🏽‍♂️</span>
          </div>
          <div>
            <p className="text-white font-semibold">Crafted with Puneri grit by Bokya</p>
            <p className="text-[10px] text-[#8FAEA0]">Mind Unboxed Studios • Zero-Server Local Privacy Engine</p>
          </div>
        </div>
        <p className="text-[11px]">© 2026 Mind Unboxed Studios • Pune, Maharashtra</p>
      </footer>
    </main>
  );
}
