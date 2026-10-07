"use client";

import React from "react";
import { ArrowRight, Play, Camera, Clock, MoveHorizontal, BookOpen, Sparkles, Award } from "lucide-react";
import { sound } from "@/utils/sound";
import PickSideLogo from "@/components/PickSideLogo";

interface LandingPageProps {
  onStart: () => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden">
      {/* Subtle Dark Ambient Tints */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-indigo-900/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-900/15 rounded-full blur-3xl pointer-events-none" />

      {/* Navigation Header */}
      <header className="w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <PickSideLogo size={40} />
          <div>
            <span className="font-extrabold text-xl tracking-tight text-white">
              PickSide
            </span>
            <span className="block text-[11px] text-indigo-400 font-semibold tracking-wide">
              Interactive English Quiz
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-indigo-900/60 text-xs font-semibold text-indigo-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Camera Game Engine</span>
        </div>
      </header>

      {/* Main Hero Content */}
      <main className="w-full max-w-4xl mx-auto px-6 py-10 flex flex-col items-center text-center my-auto z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-700/40 text-indigo-300 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Game Interaktif Pembelajaran Bahasa Inggris</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-6 leading-tight">
          Pilih Jawaban Berdiri di Sisi{" "}
          <span className="text-indigo-400">Kiri</span> atau{" "}
          <span className="text-cyan-400">Kanan</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed mb-10 text-balance">
          Bawa pembelajaran Bahasa Inggris menjadi aktif dan interaktif. Kamera laptop atau smartphone mendeteksi posisi berdiri pemain di sisi kiri atau kanan layar secara live.
        </p>

        {/* Start Button */}
        <div className="mb-14">
          <button
            onClick={() => {
              sound.playClick();
              onStart();
            }}
            className="px-9 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base tracking-wide shadow-lg shadow-indigo-900/50 hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Mulai Permainan</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 2 Sides Cards Guide */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 text-left mb-10">
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-indigo-900/60 shadow-lg relative overflow-hidden">
            <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">
              Sisi Kiri — Pilihan 1
            </div>
            <h3 className="font-bold text-base text-white mb-1">Posisi Berdiri Kiri</h3>
            <p className="text-slate-300 text-sm">
              Pemain yang berada di area kiri kamera akan memilih opsi jawaban pertama.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/90 border border-cyan-900/60 shadow-lg relative overflow-hidden">
            <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">
              Sisi Kanan — Pilihan 2
            </div>
            <h3 className="font-bold text-base text-white mb-1">Posisi Berdiri Kanan</h3>
            <p className="text-slate-300 text-sm">
              Pemain yang berada di area kanan kamera akan memilih opsi jawaban kedua.
            </p>
          </div>
        </div>

        {/* Features highlight */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-xl text-xs font-semibold text-slate-300">
          <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center justify-center gap-2">
            <Camera className="w-4 h-4 text-indigo-400" />
            <span>Kamera Mirrored</span>
          </div>
          <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center justify-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Countdown Timer</span>
          </div>
          <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center justify-center gap-2">
            <MoveHorizontal className="w-4 h-4 text-cyan-400" />
            <span>Split Screen 2 Sisi</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-6xl mx-auto px-6 py-6 text-center text-xs text-slate-500 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-2 z-10">
        <p>PickSide — Interactive Quiz Studio</p>
        <p>Client-side Only • Tanpa Database</p>
      </footer>
    </div>
  );
}
