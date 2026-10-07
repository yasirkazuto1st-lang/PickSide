"use client";

import React, { useState } from "react";
import { ArrowLeft, ArrowRight, Clock, HelpCircle, CheckCircle2, FileText, BookOpen, Layers } from "lucide-react";
import { GameSettings } from "@/types/quiz";
import { PRESET_PACKS } from "@/data/presets";
import { sound } from "@/utils/sound";

interface SetupConfigProps {
  settings: GameSettings;
  onContinue: (updatedSettings: GameSettings, presetSelected?: string) => void;
  onBack: () => void;
}

export default function SetupConfig({
  settings,
  onContinue,
  onBack
}: SetupConfigProps) {
  const [questionCount, setQuestionCount] = useState<number>(settings.questionCount || 5);
  const [timerDuration, setTimerDuration] = useState<number>(settings.timerDuration || 10);
  const [selectedPreset, setSelectedPreset] = useState<string>("custom");

  const timerOptions = [5, 10, 15, 20, 30];
  const countOptions = [3, 5, 8, 10, 15];

  const handleContinue = () => {
    sound.playClick();
    const validCount = Math.max(1, questionCount);
    const validTimer = Math.max(3, timerDuration);
    const updatedSettings: GameSettings = {
      ...settings,
      questionCount: validCount,
      timerDuration: validTimer
    };
    onContinue(updatedSettings, selectedPreset !== "custom" ? selectedPreset : undefined);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between py-8 px-4 sm:px-6">
      {/* Top Header */}
      <div className="w-full max-w-4xl mx-auto flex items-center justify-between mb-8">
        <button
          onClick={() => {
            sound.playClick();
            onBack();
          }}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-all flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>

        <div className="text-xs font-semibold text-indigo-400 bg-indigo-950/60 border border-indigo-900/60 px-3 py-1.5 rounded-lg">
          Langkah 1: Setup Kuis
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-4xl mx-auto my-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2">
            Konfigurasi Permainan
          </h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Tentukan jumlah soal, durasi waktu countdown per soal, dan kategori template.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          {/* Jumlah Soal */}
          <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-indigo-950 text-indigo-400 border border-indigo-900 flex items-center justify-center font-bold">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">Jumlah Soal</h3>
                  <p className="text-xs text-slate-400">Berapa banyak soal yang dimainkan</p>
                </div>
              </div>

              {/* Quick selectors */}
              <div className="grid grid-cols-5 gap-1.5 mb-4">
                {countOptions.map((cnt) => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setQuestionCount(cnt);
                    }}
                    className={`py-2 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                      questionCount === cnt
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                    }`}
                  >
                    {cnt}
                  </button>
                ))}
              </div>

              {/* Custom Input */}
              <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl p-2.5">
                <span className="text-xs font-medium text-slate-400 pl-2">Input Manual:</span>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={questionCount}
                  onChange={(e) => setQuestionCount(parseInt(e.target.value) || 1)}
                  className="bg-transparent text-white font-bold text-base focus:outline-none w-full text-right pr-2"
                />
                <span className="text-xs font-bold text-indigo-400">Soal</span>
              </div>
            </div>
          </div>

          {/* Durasi Waktu */}
          <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-amber-950 text-amber-400 border border-amber-900 flex items-center justify-center font-bold">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">Durasi Waktu per Soal</h3>
                  <p className="text-xs text-slate-400">Waktu countdown sebelum jawaban dibuka</p>
                </div>
              </div>

              {/* Quick selectors */}
              <div className="grid grid-cols-5 gap-1.5 mb-4">
                {timerOptions.map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setTimerDuration(sec);
                    }}
                    className={`py-2 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                      timerDuration === sec
                        ? "bg-amber-600 text-white shadow-sm"
                        : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                    }`}
                  >
                    {sec}s
                  </button>
                ))}
              </div>

              {/* Custom Input */}
              <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl p-2.5">
                <span className="text-xs font-medium text-slate-400 pl-2">Input Detik:</span>
                <input
                  type="number"
                  min="3"
                  max="120"
                  value={timerDuration}
                  onChange={(e) => setTimerDuration(parseInt(e.target.value) || 5)}
                  className="bg-transparent text-white font-bold text-base focus:outline-none w-full text-right pr-2"
                />
                <span className="text-xs font-bold text-amber-400">Detik</span>
              </div>
            </div>
          </div>
        </div>

        {/* Kategori Template Soal */}
        <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <h3 className="font-bold text-sm text-white">
                Pilihan Kategori Soal (Template)
              </h3>
            </div>
            <span className="text-xs text-slate-400">Bisa diedit di langkah berikutnya</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            {/* Input Manual */}
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setSelectedPreset("custom");
              }}
              className={`p-4 rounded-xl text-left border transition-all cursor-pointer relative ${
                selectedPreset === "custom"
                  ? "bg-indigo-950/70 border-indigo-500 text-white shadow-md shadow-indigo-950"
                  : "bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300"
              }`}
            >
              {selectedPreset === "custom" && (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 absolute top-3.5 right-3.5" />
              )}
              <div className="w-7 h-7 rounded-lg bg-indigo-900/60 text-indigo-300 flex items-center justify-center mb-2.5">
                <FileText className="w-3.5 h-3.5" />
              </div>
              <div className="font-bold text-sm text-white">Input Manual</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Form kosong (isi sendiri)</div>
            </button>

            {/* Presets */}
            {PRESET_PACKS.map((pack) => {
              const isGrammar = pack.id === "grammar-basics";
              const isVocab = pack.id === "vocab-antonyms";
              const isExpressions = pack.id === "daily-expressions";

              const badgeColor = isGrammar
                ? "bg-blue-900/60 text-blue-300"
                : isVocab
                ? "bg-emerald-900/60 text-emerald-300"
                : "bg-cyan-900/60 text-cyan-300";

              return (
                <button
                  key={pack.id}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setSelectedPreset(selectedPreset === pack.id ? "custom" : pack.id);
                  }}
                  className={`p-4 rounded-xl text-left border transition-all cursor-pointer relative ${
                    selectedPreset === pack.id
                      ? "bg-indigo-950/70 border-indigo-500 text-white shadow-md shadow-indigo-950"
                      : "bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300"
                  }`}
                >
                  {selectedPreset === pack.id && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 absolute top-3.5 right-3.5" />
                  )}
                  <div className={`w-7 h-7 rounded-lg ${badgeColor} flex items-center justify-center mb-2.5`}>
                    <BookOpen className="w-3.5 h-3.5" />
                  </div>
                  <div className="font-bold text-sm text-white">{pack.title}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{pack.description}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Continue Button */}
        <div className="flex justify-center">
          <button
            onClick={handleContinue}
            className="w-full sm:w-auto min-w-[260px] px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-950 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
          >
            <span>Lanjut ke Input Soal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div />
    </div>
  );
}
