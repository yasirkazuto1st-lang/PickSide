"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import confetti from "canvas-confetti";
import {
  Volume2,
  VolumeX,
  Camera,
  CameraOff,
  Maximize,
  Minimize,
  X,
  CheckCircle2,
  XCircle,
  FlipHorizontal,
  ChevronRight,
  RefreshCw,
  Trophy
} from "lucide-react";
import { QuestionItem, GameSettings } from "@/types/quiz";
import { sound } from "@/utils/sound";

interface GameCameraViewProps {
  questions: QuestionItem[];
  settings: GameSettings;
  onFinishGame: () => void;
  onExitGame: () => void;
}

export default function GameCameraView({
  questions,
  settings,
  onFinishGame,
  onExitGame
}: GameCameraViewProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(settings.timerDuration);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [soundMuted, setSoundMuted] = useState<boolean>(!settings.soundEnabled);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isMirrored, setIsMirrored] = useState<boolean>(settings.mirrored ?? true);
  const [virtualMode, setVirtualMode] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentQuestion = questions[currentIndex] || {
    question: "",
    option1: "",
    option2: "",
    correctOption: 1
  };
  const isLastQuestion = currentIndex >= questions.length - 1;

  // Initialize camera
  const startCamera = useCallback(async () => {
    try {
      setCameraError(null);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          facingMode: "user"
        },
        audio: false
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
      setCameraActive(true);
      setVirtualMode(false);
    } catch {
      setCameraError("Kamera tidak dapat diakses atau izin ditolak. Mengaktifkan mode virtual.");
      setCameraActive(false);
      setVirtualMode(true);
    }
  }, []);

  // Cleanup camera stream
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  // Trigger confetti burst on reveal
  const triggerConfetti = useCallback(() => {
    try {
      confetti({
        particleCount: 75,
        spread: 75,
        origin: { y: 0.6 }
      });
    } catch {
      // Ignore
    }
  }, []);

  // Handle revealing the answer
  const handleReveal = useCallback(() => {
    setIsRevealed(true);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    sound.playCorrect();
    triggerConfetti();
  }, [triggerConfetti]);

  // Start question timer
  useEffect(() => {
    setTimeLeft(settings.timerDuration);
    setIsRevealed(false);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleReveal();
          return 0;
        }
        if (prev <= 4) {
          sound.playTick(true);
        } else {
          sound.playTick(false);
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentIndex, settings.timerDuration, handleReveal]);

  // Mount/Unmount camera
  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  useEffect(() => {
    sound.enabled = !soundMuted;
  }, [soundMuted]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handleNext = () => {
    sound.playClick();
    if (isLastQuestion) {
      sound.playVictory();
      onFinishGame();
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const timerProgress = (timeLeft / settings.timerDuration) * 100;
  const isCorrectLeft = currentQuestion.correctOption === 1;
  const isCorrectRight = currentQuestion.correctOption === 2;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 select-none flex flex-col justify-between">
      {/* 1. CAMERA BACKGROUND (Mirrored WebRTC Video - Jernih Tanpa Blur) */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        {cameraActive && !virtualMode ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover ${isMirrored ? "video-mirrored" : ""}`}
          />
        ) : (
          /* Virtual Stage fallback if camera unavailable */
          <div className="w-full h-full bg-slate-900 relative flex items-center justify-center">
            <div className="text-center z-10 p-6 max-w-sm bg-slate-900/95 rounded-3xl border border-white/15 shadow-2xl">
              <CameraOff className="w-10 h-10 text-indigo-400 mx-auto mb-2" />
              <h3 className="font-bold text-base text-white mb-1">Mode Kamera Virtual</h3>
              <p className="text-xs text-slate-300 mb-4">
                Kamera fisik sedang tidak aktif. Permainan tetap dapat berjalan di layar.
              </p>
              <button
                type="button"
                onClick={startCamera}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-all cursor-pointer inline-flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Coba Sambungkan Kamera</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 2. FULL SCREEN SPLIT OVERLAY (Sisi Kiri & Kanan Langsung Full Tanpa Card & Tanpa Blur) */}
      <div className="absolute inset-0 z-10 grid grid-cols-2 pointer-events-none">
        {/* SISI KIRI (FULL HALF) */}
        <div
          className={`w-full h-full flex flex-col justify-between p-6 transition-all duration-300 border-r border-white/20 relative ${
            isRevealed
              ? isCorrectLeft
                ? "bg-emerald-500/35 border-r-4 border-emerald-400 animate-pulse-green"
                : "bg-rose-500/35 border-r-4 border-rose-500 animate-pulse-red"
              : "bg-transparent"
          }`}
        >
          {/* Top Label Kiri */}
          <div className="pt-28 sm:pt-32 flex items-center justify-between">
            <span className="px-3.5 py-1.5 rounded-xl bg-black/60 border border-white/20 text-white text-xs sm:text-sm font-black uppercase tracking-wider drop-shadow-lg">
              👈 SISI KIRI (OPTION 1)
            </span>

            {isRevealed && (
              <div
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider ${
                  isCorrectLeft
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/50 animate-bounce"
                    : "bg-rose-600 text-white shadow-lg shadow-rose-600/50"
                }`}
              >
                {isCorrectLeft ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>BENAR ✓</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4" />
                    <span>SALAH ✗</span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Option 1 Text (Langsung bersih tanpa card) */}
          <div className="text-center my-auto px-4">
            <p className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight break-words drop-shadow-[0_4px_18px_rgba(0,0,0,0.95)]">
              {currentQuestion.option1}
            </p>
          </div>

          {/* Bottom Footprint hint */}
          <div className="pb-16 text-center text-xs sm:text-sm font-bold text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
            Berdiri di Sisi Kiri
          </div>
        </div>

        {/* SISI KANAN (FULL HALF) */}
        <div
          className={`w-full h-full flex flex-col justify-between p-6 transition-all duration-300 border-l border-white/20 relative ${
            isRevealed
              ? isCorrectRight
                ? "bg-emerald-500/35 border-l-4 border-emerald-400 animate-pulse-green"
                : "bg-rose-500/35 border-l-4 border-rose-500 animate-pulse-red"
              : "bg-transparent"
          }`}
        >
          {/* Top Label Kanan */}
          <div className="pt-28 sm:pt-32 flex items-center justify-between">
            {isRevealed && (
              <div
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider ${
                  isCorrectRight
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/50 animate-bounce"
                    : "bg-rose-600 text-white shadow-lg shadow-rose-600/50"
                }`}
              >
                {isCorrectRight ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>BENAR ✓</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4" />
                    <span>SALAH ✗</span>
                  </>
                )}
              </div>
            )}

            <span className="px-3.5 py-1.5 rounded-xl bg-black/60 border border-white/20 text-white text-xs sm:text-sm font-black uppercase tracking-wider drop-shadow-lg ml-auto">
              SISI KANAN (OPTION 2) 👉
            </span>
          </div>

          {/* Option 2 Text (Langsung bersih tanpa card) */}
          <div className="text-center my-auto px-4">
            <p className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight break-words drop-shadow-[0_4px_18px_rgba(0,0,0,0.95)]">
              {currentQuestion.option2}
            </p>
          </div>

          {/* Bottom Footprint hint */}
          <div className="pb-16 text-center text-xs sm:text-sm font-bold text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
            Berdiri di Sisi Kanan
          </div>
        </div>

        {/* Center Divider Line & VS Badge */}
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center pointer-events-none z-20">
          <div className="w-0.5 h-full border-r-2 border-dashed border-white/40" />
          <div className="absolute top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-full bg-black/80 border border-white/30 text-[11px] font-black text-white uppercase tracking-widest shadow-2xl">
            VS
          </div>
        </div>
      </div>

      {/* 3. TOP HEADER BAR & WHITE QUESTION CARD */}
      <div className="relative z-30 w-full px-4 sm:px-6 pt-3 pointer-events-auto">
        {/* Navigation Bar */}
        <header className="flex items-center justify-between mb-2">
          {/* Left: Exit button & Progress Pill */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                sound.playClick();
                onExitGame();
              }}
              className="p-2 rounded-xl bg-black/60 hover:bg-black/80 border border-white/20 text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Keluar dari Game"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="px-3.5 py-1.5 rounded-xl bg-black/60 border border-white/20 flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-300">Soal</span>
              <span className="text-xs font-black text-indigo-400">
                {currentIndex + 1}
              </span>
              <span className="text-xs text-slate-400">/</span>
              <span className="text-xs font-semibold text-slate-300">{questions.length}</span>
            </div>
          </div>

          {/* Center Brand */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-white text-zinc-950 font-black text-[11px] flex items-center justify-center">
              PS
            </div>
            <span className="font-bold text-sm tracking-wide text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
              PickSide
            </span>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                setIsMirrored((prev) => !prev);
                sound.playClick();
              }}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isMirrored
                  ? "bg-indigo-600/60 border-indigo-400 text-indigo-100"
                  : "bg-black/60 border-white/20 text-slate-300 hover:text-white"
              }`}
              title={isMirrored ? "Cermin Aktif (Mirrored)" : "Normal Video"}
            >
              <FlipHorizontal className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setSoundMuted((prev) => !prev);
                sound.playClick();
              }}
              className="p-2 rounded-xl bg-black/60 hover:bg-black/80 border border-white/20 text-slate-300 hover:text-white transition-all cursor-pointer"
              title={soundMuted ? "Aktifkan Suara" : "Matikan Suara"}
            >
              {soundMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-xl bg-black/60 hover:bg-black/80 border border-white/20 text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Mode Layar Penuh"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* 4. SOLID WHITE QUESTION CARD (Hanya soal yang memakai card putih, posisi pas dan jelas) */}
        <div className="max-w-3xl mx-auto mt-1">
          <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 sm:p-5 shadow-2xl text-center">
            <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
              {currentQuestion.question}
            </h2>
          </div>
        </div>
      </div>

      {/* 5. BOTTOM BAR WITH COUNTDOWN TIMER & CONTROLS */}
      <footer className="relative z-30 w-full px-4 sm:px-8 py-3 flex items-center justify-between pointer-events-auto">
        {/* Left: Manual Reveal Button */}
        <div className="w-1/3 flex items-center">
          {!isRevealed ? (
            <button
              onClick={() => {
                sound.playClick();
                handleReveal();
              }}
              className="px-3.5 py-2 rounded-xl bg-black/70 hover:bg-black/90 border border-white/20 text-xs font-semibold text-slate-200 hover:text-white transition-all cursor-pointer shadow-md"
            >
              Buka Jawaban
            </button>
          ) : (
            <div className="text-xs font-medium text-slate-300 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
              Jawaban terbuka.
            </div>
          )}
        </div>

        {/* Center: Circular Countdown Timer */}
        <div className="w-1/3 flex justify-center">
          <div className="relative flex items-center justify-center">
            <svg className="w-16 h-16 sm:w-20 sm:h-20 -rotate-90 transform">
              <circle
                cx="50%"
                cy="50%"
                r="40%"
                className="stroke-black/60 fill-black/60"
                strokeWidth="7"
              />
              <circle
                cx="50%"
                cy="50%"
                r="40%"
                className={`transition-all duration-300 ${
                  timeLeft <= 3
                    ? "stroke-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.6)]"
                    : "stroke-white"
                }`}
                strokeWidth="7"
                strokeDasharray="251"
                strokeDashoffset={251 - (251 * timerProgress) / 100}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            <div
              className={`absolute flex flex-col items-center justify-center font-black ${
                timeLeft <= 3 && !isRevealed ? "text-rose-400 animate-pulse" : "text-white"
              }`}
            >
              <span className="text-xl sm:text-2xl leading-none drop-shadow">
                {isRevealed ? "0" : timeLeft}
              </span>
              <span className="text-[8px] uppercase font-bold text-slate-300 tracking-wider">
                {isRevealed ? "STOP" : "DETIK"}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Next Question Button */}
        <div className="w-1/3 flex justify-end">
          {isRevealed ? (
            <button
              onClick={handleNext}
              className="px-6 py-3 rounded-xl font-bold text-sm text-zinc-950 bg-white hover:bg-zinc-200 shadow-xl flex items-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95"
            >
              <span>{isLastQuestion ? "Selesai (Ringkasan)" : "Soal Selanjutnya"}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="text-xs font-semibold text-slate-300 text-right drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
              Pilih sisi sebelum waktu habis!
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}
