export interface Question {
  question: string;
  options: {
    letter: string;
    text: string;
  }[];
  correctAnswer: string;
  explanation: {
    correct: string;
    incorrect: Record<string, string>;
    pegadinha: string;
    revisao: string;
  };
  category?: string;
  topic?: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface StudyTopic {
  id: string;
  name: string;
  category: "legislacao" | "didatica" | "especifico" | "ceara" | "comuns";
  completed: boolean;
  confidence: "low" | "medium" | "high" | null;
  questionsAnswered: number;
  questionsCorrect: number;
}

export interface SimulationState {
  active: boolean;
  currentQuestionIndex: number;
  questions: Question[];
  answers: Record<number, string>; // question index -> letter chosen
  timeLeft: number;
  duration: number;
  finished: boolean;
  startTime: string | null;
}

export interface UserProfile {
  name?: string;
  gender?: string;
  age?: number;
  isTeacher?: string;
  discipline: string;
  banca: string;
  studyHours: number;
  level: "beginner" | "intermediate" | "advanced";
  streak: number;
  totalQuestions: number;
  totalCorrect: number;
  totalSeconds: number;
  examDate?: string;
  studyStartDate?: string;
  editalFileName?: string;
  hasEdital?: boolean;
  editalTopics?: string[];
  history: {
    date: string;
    score: number;
    total: number;
    topic: string;
  }[];
}

export interface Flashcard {
  id: string;
  topic: string;
  front: string;
  back: string;
  pegadinha?: string;
  banca: string;
  createdAt: string;
}

