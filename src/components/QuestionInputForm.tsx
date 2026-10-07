"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Play, Plus, Trash2, AlertCircle } from "lucide-react";
import { QuestionItem, GameSettings } from "@/types/quiz";
import { sound } from "@/utils/sound";

interface QuestionInputFormProps {
  questions: QuestionItem[];
  settings: GameSettings;
  onSaveAndStart: (questions: QuestionItem[]) => void;
  onBack: () => void;
}

export default function QuestionInputForm({
  questions: initialQuestions,
  settings,
  onSaveAndStart,
  onBack
}: QuestionInputFormProps) {
  const [questions, setQuestions] = useState<QuestionItem[]>(() => {
    if (initialQuestions && initialQuestions.length > 0) {
      return initialQuestions;
    }
    return Array.from({ length: settings.questionCount }, (_, i) => ({
      id: `question-${i + 1}`,
      question: "",
      option1: "",
      option2: "",
      correctOption: 1
    }));
  });

  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (initialQuestions && initialQuestions.length > 0) {
      setQuestions(initialQuestions);
    }
  }, [initialQuestions]);

  const handleUpdateField = (index: number, field: keyof QuestionItem, value: any) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value
      };
      return updated;
    });
    setValidationError(null);
  };

  const handleAddQuestion = () => {
    sound.playClick();
    setQuestions((prev) => [
      ...prev,
      {
        id: `question-${prev.length + 1}`,
        question: "",
        option1: "",
        option2: "",
        correctOption: 1
      }
    ]);
  };

  const handleRemoveQuestion = (index: number) => {
    sound.playClick();
    if (questions.length <= 1) {
      setValidationError("Kuis harus memiliki minimal 1 soal.");
      return;
    }
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleStartGame = () => {
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) {
        setValidationError(`Soal nomor ${i + 1} belum diisi teks pertanyaannya.`);
        return;
      }
      if (!q.option1.trim()) {
        setValidationError(`Pilihan 1 (Kiri) pada soal nomor ${i + 1} masih kosong.`);
        return;
      }
      if (!q.option2.trim()) {
        setValidationError(`Pilihan 2 (Kanan) pada soal nomor ${i + 1} masih kosong.`);
        return;
      }
    }

    sound.playClick();
    onSaveAndStart(questions);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between py-8 px-4 sm:px-6">
      {/* Top Bar */}
      <div className="w-full max-w-4xl mx-auto flex items-center justify-between mb-6">
        <button
          onClick={() => {
            sound.playClick();
            onBack();
          }}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-all flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Pengaturan</span>
        </button>

        <div className="flex items-center gap-2.5 text-xs">
          <span className="bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-300">
            Total Soal: <strong className="text-indigo-400">{questions.length}</strong>
          </span>
          <span className="bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-300">
            Timer: <strong className="text-amber-400">{settings.timerDuration}s</strong>
          </span>
        </div>
      </div>

      {/* Header */}
      <div className="w-full max-w-4xl mx-auto mb-6">
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-1">
          Input Soal & Kunci Jawaban
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm">
          Tulis pertanyaan Bahasa Inggris, Pilihan 1 (Kiri), Pilihan 2 (Kanan), lalu tentukan mana kunci yang Benar.
        </p>

        {validationError && (
          <div className="mt-4 p-3.5 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-200 text-xs font-medium flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <div className="flex-1">{validationError}</div>
          </div>
        )}
      </div>

      {/* Questions Form List */}
      <div className="w-full max-w-4xl mx-auto space-y-4 mb-10">
        {questions.map((item, index) => (
          <div
            key={item.id || index}
            className="bg-slate-900/90 rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-md"
          >
            {/* Header of Item */}
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-md bg-indigo-950 text-indigo-400 border border-indigo-900 font-bold flex items-center justify-center text-xs">
                  {index + 1}
                </span>
                <span className="font-bold text-slate-200 text-sm">
                  Soal Nomor {index + 1}
                </span>
              </div>

              {questions.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveQuestion(index)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Hapus Soal"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Question Text Input */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Pertanyaan Bahasa Inggris:
              </label>
              <input
                type="text"
                placeholder="Contoh: What is the past tense of 'Drink'?"
                value={item.question}
                onChange={(e) => handleUpdateField(index, "question", e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-white text-sm placeholder:text-slate-600 focus:outline-none transition-colors"
              />
            </div>

            {/* Two Options: Left & Right */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {/* Option 1: Left */}
              <div
                className={`p-3.5 rounded-xl border transition-all ${
                  item.correctOption === 1
                    ? "bg-emerald-950/40 border-emerald-500/80"
                    : "bg-slate-950 border-slate-800"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
                    Sisi Kiri (Pilihan 1)
                  </span>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name={`correct-${item.id || index}`}
                      checked={item.correctOption === 1}
                      onChange={() => {
                        sound.playClick();
                        handleUpdateField(index, "correctOption", 1);
                      }}
                      className="w-3.5 h-3.5 accent-emerald-500 cursor-pointer"
                    />
                    <span
                      className={`text-[11px] font-bold ${
                        item.correctOption === 1 ? "text-emerald-400" : "text-slate-500"
                      }`}
                    >
                      Kunci Benar
                    </span>
                  </label>
                </div>
                <input
                  type="text"
                  placeholder="Contoh: Drank"
                  value={item.option1}
                  onChange={(e) => handleUpdateField(index, "option1", e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none"
                />
              </div>

              {/* Option 2: Right */}
              <div
                className={`p-3.5 rounded-xl border transition-all ${
                  item.correctOption === 2
                    ? "bg-emerald-950/40 border-emerald-500/80"
                    : "bg-slate-950 border-slate-800"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                    Sisi Kanan (Pilihan 2)
                  </span>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name={`correct-${item.id || index}`}
                      checked={item.correctOption === 2}
                      onChange={() => {
                        sound.playClick();
                        handleUpdateField(index, "correctOption", 2);
                      }}
                      className="w-3.5 h-3.5 accent-emerald-500 cursor-pointer"
                    />
                    <span
                      className={`text-[11px] font-bold ${
                        item.correctOption === 2 ? "text-emerald-400" : "text-slate-500"
                      }`}
                    >
                      Kunci Benar
                    </span>
                  </label>
                </div>
                <input
                  type="text"
                  placeholder="Contoh: Drunk"
                  value={item.option2}
                  onChange={(e) => handleUpdateField(index, "option2", e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none"
                />
              </div>
            </div>
          </div>
        ))}

        {/* Add Question Button */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleAddQuestion}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-semibold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4 text-indigo-400" />
            <span>Tambah Soal Baru</span>
          </button>
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="sticky bottom-4 w-full max-w-4xl mx-auto z-20">
        <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            Pastikan izin kamera laptop/HP diizinkan saat game dimulai.
          </div>

          <button
            type="button"
            onClick={handleStartGame}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Mulai Game (Live Camera)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
