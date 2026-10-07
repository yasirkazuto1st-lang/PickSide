import { QuestionItem } from "@/types/quiz";

export interface PresetPack {
  id: string;
  title: string;
  description: string;
  category: string;
  questions: QuestionItem[];
}

export const PRESET_PACKS: PresetPack[] = [
  {
    id: "grammar-basics",
    title: "Grammar & Tenses",
    description: "Soal mengenai Present, Past, dan Subject-Verb Agreement.",
    category: "Grammar",
    questions: [
      {
        id: "q-1",
        question: "She _____ to the library every Friday afternoon.",
        option1: "Goes",
        option2: "Go",
        correctOption: 1
      },
      {
        id: "q-2",
        question: "Yesterday, we _____ a very exciting movie together.",
        option1: "Watch",
        option2: "Watched",
        correctOption: 2
      },
      {
        id: "q-3",
        question: "Neither of the students _____ finished the assignment.",
        option1: "Has",
        option2: "Have",
        correctOption: 1
      },
      {
        id: "q-4",
        question: "They _____ playing soccer in the field right now.",
        option1: "Are",
        option2: "Is",
        correctOption: 1
      },
      {
        id: "q-5",
        question: "If it rains tomorrow, I _____ stay at home.",
        option1: "Would",
        option2: "Will",
        correctOption: 2
      }
    ]
  },
  {
    id: "vocab-antonyms",
    title: "Vocabulary & Antonyms",
    description: "Latihan antonim, sinonim, dan ejaan kata bahasa Inggris.",
    category: "Vocabulary",
    questions: [
      {
        id: "q-v1",
        question: "What is the opposite (antonym) of 'ANCIENT'?",
        option1: "Modern",
        option2: "Old",
        correctOption: 1
      },
      {
        id: "q-v2",
        question: "Which word means 'extremely happy'?",
        option1: "Depressed",
        option2: "Ecstatic",
        correctOption: 2
      },
      {
        id: "q-v3",
        question: "What is the antonym of 'GENEROUS'?",
        option1: "Selfish",
        option2: "Kind",
        correctOption: 1
      },
      {
        id: "q-v4",
        question: "Choose the correct spelling:",
        option1: "Necessary",
        option2: "Neccessary",
        correctOption: 1
      },
      {
        id: "q-v5",
        question: "The weather today is 'CHILLY'. It means:",
        option1: "Very hot",
        option2: "Cold",
        correctOption: 2
      }
    ]
  },
  {
    id: "daily-expressions",
    title: "Everyday English & Idioms",
    description: "Ungkapan sehari-hari dan idiom populer dalam bahasa Inggris.",
    category: "Expressions",
    questions: [
      {
        id: "q-d1",
        question: "The idiom 'Break a leg' means:",
        option1: "Good luck",
        option2: "Get hurt",
        correctOption: 1
      },
      {
        id: "q-d2",
        question: "When someone says 'Never mind', they mean:",
        option1: "Forget about it",
        option2: "Listen carefully",
        correctOption: 1
      },
      {
        id: "q-d3",
        question: "The idiom 'Piece of cake' describes something that is:",
        option1: "Delicious",
        option2: "Very easy",
        correctOption: 2
      },
      {
        id: "q-d4",
        question: "How do you politely decline an invitation?",
        option1: "I'd love to, but I have plans",
        option2: "I refuse your party",
        correctOption: 1
      },
      {
        id: "q-d5",
        question: "Feeling 'under the weather' means:",
        option1: "Feeling slightly unwell",
        option2: "Enjoying the rain",
        correctOption: 1
      }
    ]
  }
];
