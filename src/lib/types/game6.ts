export interface Answer {
  answerText: string;
  nextQuestion?: {
    _id: string;
    questionId: string;
    questionText: string;
  };
  isEndGame?: boolean;
  endGameMessage?: string;
}

export interface BranchingQuestion {
  _id: string;
  questionId: string;
  questionText: string;
  answers: Answer[];
  isStartQuestion: boolean;
  isActive: boolean;
  order: number;
}

export interface Question {
  id: string;
  question: string;
  optionA: string;
  optionB: string;
  answered?: boolean;
  selectedOption?: 'A' | 'B';
  answerTime?: number;
}

export interface Game6State {
  questions: Question[];
  currentQuestionIndex: number;
  score: number;
  isComplete: boolean;
  isLoading: boolean;
  error: string | null;
  isPlaying: boolean;
  startTime: Date | null;
  totalQuestions: number;
}

export interface Game6Answer {
  _key: string;
  questionId: string;
  question: string;
  optionA: string;
  optionB: string;
  selectedOption: 'A' | 'B';
  answerTime: Date;
}

export interface Game6Result {
  userId: string;
  game6: {
    score: number;
    gameId: number;
    startedAt: string;
    completedAt: string;
    totalQuestions: number;
    answers: Game6Answer[];
  };
} 