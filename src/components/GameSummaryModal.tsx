"use client";

import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import { CheckCircle2, RotateCcw, Edit3, Home, Trophy } from "lucide-react";
import { QuestionItem } from "@/types/quiz";
import { sound } from "@/utils/sound";

interface GameSummaryModalProps {
  questions: QuestionItem[];
  onPlayAgain: () => void;
  onEditQuestions: () => void;
  onHome: () => void;
}

export default function GameSummaryModal({
  questions,
  onPlayAgain,
  onEditQuestions,
  onHome
}: GameSummaryModalProps) {
  useEffect(() => {
    try {
      confetti({
        particleCount: 75,
        spread: 80,
        origin: { y: 0.5 }
      });
    } catch {
      // Ignore
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between py-8 px-4 sm:px-6">
      {/* Header */}
      <div className="w-full max-w-3xl mx-auto text-center pt-4">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-950/60 border border-amber-800/80 mb-3 shadow-md">
          <Trophy className="w-7 h-7 text-amber-400" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-2">
          Permainan Selesai
        </h1>
        <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
          Seluruh {questions.length} pertanyaan telah selesai dimainkan. Berikut adalah ringkasan kunci jawaban.
        </p>
      </div>

      {/* Review List */}
      <div className="w-full max-w-3xl mx-auto space-y-3 mb-8">
        <div className="flex items-center justify-between px-1">
          <h2 className="font-bold text-sm text-slate-200">
            Daftar Soal & Kunci Jawaban
          </h2>
          <span className="text-xs text-slate-500">{questions.length} Soal</span>
        </div>

        <div className="space-y-3 max-h-[52vh] overflow-y-auto pr-1">
          {questions.map((q, idx) => (
            <div
              key={q.id || idx}
              className="bg-slate-900/90 rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-md bg-indigo-950 text-indigo-400 border border-indigo-900 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                  #{idx + 1}
                </span>
                <div className="flex-1">
                  <h3 className="font-bold text-white text-sm sm:text-base mb-2.5">
                    {q.question}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {/* Left Option */}
                    <div
                      className={`p-2.5 rounded-xl border flex items-center justify-between ${
                        q.correctOption === 1
                          ? "bg-emerald-950/50 border-emerald-500/80 text-emerald-300 font-semibold"
                          : "bg-slate-950 border-slate-800 text-slate-400"
                      }`}
                    >
                      <span>
                        <span className="text-indigo-400 font-bold">Kiri: </span>
                        {q.option1}
                      </span>
                      {q.correctOption === 1 && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                    </div>

                    {/* Right Option */}
                    <div
                      className={`p-2.5 rounded-xl border flex items-center justify-between ${
                        q.correctOption === 2
                          ? "bg-emerald-950/50 border-emerald-500/80 text-emerald-300 font-semibold"
                          : "bg-slate-950 border-slate-800 text-slate-400"
                      }`}
                    >
                      <span>
                        <span className="text-cyan-400 font-bold">Kanan: </span>
                        {q.option2}
                      </span>
                      {q.correctOption === 2 && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="w-full max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={() => {
            sound.playClick();
            onPlayAgain();
          }}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Mainkan Lagi</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            onEditQuestions();
          }}
          className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Edit3 className="w-4 h-4 text-indigo-400" />
          <span>Edit Soal</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            onHome();
          }}
          className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span>Menu Utama</span>
        </button>
      </div>
    </div>
  );
}
