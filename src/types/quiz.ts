export interface QuestionItem {
  id: string;
  question: string;
  option1: string; // Left side
  option2: string; // Right side
  correctOption: 1 | 2; // 1 = Option 1 (Left), 2 = Option 2 (Right)
  explanation?: string;
}

export type AppStep = "landing" | "setup" | "input" | "game" | "summary";

export interface GameSettings {
  questionCount: number;
  timerDuration: number; // in seconds
  soundEnabled: boolean;
  mirrored: boolean;
}
