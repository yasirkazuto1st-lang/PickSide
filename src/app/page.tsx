"use client";

import React, { useState } from "react";
import LandingPage from "@/components/LandingPage";
import SetupConfig from "@/components/SetupConfig";
import QuestionInputForm from "@/components/QuestionInputForm";
import GameCameraView from "@/components/GameCameraView";
import GameSummaryModal from "@/components/GameSummaryModal";
import { AppStep, QuestionItem, GameSettings } from "@/types/quiz";
import { PRESET_PACKS } from "@/data/presets";

const createBlankQuestions = (count: number): QuestionItem[] => {
  return Array.from({ length: Math.max(1, count) }, (_, i) => ({
    id: `question-${i + 1}`,
    question: "",
    option1: "",
    option2: "",
    correctOption: 1
  }));
};

export default function Home() {
  const [currentStep, setCurrentStep] = useState<AppStep>("landing");

  const [settings, setSettings] = useState<GameSettings>({
    questionCount: 5,
    timerDuration: 10,
    soundEnabled: true,
    mirrored: true
  });

  const [questions, setQuestions] = useState<QuestionItem[]>(() => createBlankQuestions(5));

  // Step Transitions
  const handleStartLanding = () => {
    setCurrentStep("setup");
  };

  const handleContinueSetup = (updatedSettings: GameSettings, presetId?: string) => {
    setSettings(updatedSettings);

    const count = updatedSettings.questionCount;
    if (presetId) {
      const selected = PRESET_PACKS.find((p) => p.id === presetId);
      if (selected) {
        const list: QuestionItem[] = selected.questions.slice(0, count).map((q, i) => ({
          ...q,
          id: `question-${i + 1}`
        }));
        while (list.length < count) {
          list.push({
            id: `question-${list.length + 1}`,
            question: "",
            option1: "",
            option2: "",
            correctOption: 1
          });
        }
        setQuestions(list);
      } else {
        setQuestions(createBlankQuestions(count));
      }
    } else {
      setQuestions(createBlankQuestions(count));
    }
    setCurrentStep("input");
  };

  const handleSaveAndStartGame = (updatedQuestions: QuestionItem[]) => {
    setQuestions(updatedQuestions);
    setCurrentStep("game");
  };

  const handleFinishGame = () => {
    setCurrentStep("summary");
  };

  const handlePlayAgain = () => {
    setCurrentStep("game");
  };

  const handleEditQuestions = () => {
    setCurrentStep("input");
  };

  const handleHome = () => {
    setCurrentStep("landing");
  };

  return (
    <main className="w-full min-h-screen bg-slate-950 text-slate-100">
      {currentStep === "landing" && (
        <LandingPage onStart={handleStartLanding} />
      )}

      {currentStep === "setup" && (
        <SetupConfig
          settings={settings}
          onContinue={handleContinueSetup}
          onBack={() => setCurrentStep("landing")}
        />
      )}

      {currentStep === "input" && (
        <QuestionInputForm
          questions={questions}
          settings={settings}
          onSaveAndStart={handleSaveAndStartGame}
          onBack={() => setCurrentStep("setup")}
        />
      )}

      {currentStep === "game" && (
        <GameCameraView
          questions={questions}
          settings={settings}
          onFinishGame={handleFinishGame}
          onExitGame={() => setCurrentStep("input")}
        />
      )}

      {currentStep === "summary" && (
        <GameSummaryModal
          questions={questions}
          onPlayAgain={handlePlayAgain}
          onEditQuestions={handleEditQuestions}
          onHome={handleHome}
        />
      )}
    </main>
  );
}
