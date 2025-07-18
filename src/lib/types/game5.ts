export interface Game5State {
  isStarted: boolean;
  isComplete: boolean;
  startTime: Date | null;
  endTime: Date | null;
  timeSpent: number; // in milliseconds
  attempts: number;
  isCorrect: boolean;
  isLoading: boolean;
  error: string | null;
  allAnswers: Array<{
    answer: string;
    isCorrect: boolean;
    attemptTime: Date;
    timeSpent: number;
  }>;
}

export interface Game5Answer {
  _key?: string;
  answer: string;
  isCorrect: boolean;
  attemptTime: Date;
  timeSpent: number;
}

export interface Game5Attempt {
  _id?: string;
  user: { _ref: string };
  gameId: number;
  startTime: Date;
  endTime: Date;
  timeSpent: number;
  attempts: number;
  finalAnswer: string;
  isCorrect: boolean;
  isFirstAttempt: boolean;
}

export interface Game5Result {
  userId: string;
  game5: {
    score: number;
    timeSpent: number;
    attempts: number;
    gameId: number;
    startedAt: string;
    completedAt: string;
  };
} 