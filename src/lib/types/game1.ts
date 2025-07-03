export interface Question {
  id: number;
  image: string;
  imageAlt: string;
  options: string[];
  correctAnswer: string;
}

export interface GameAnswer {
  _key?: string;
  questionId: string;
  question: string;
  image: any;
  correctAnswer: string;
  userAnswer: string;
  isCorrect: boolean;
  answerTime: Date;
}

export interface GameAttempt {
  _id?: string;
  user: { _ref: string };
  gameId: number;
  startTime: Date;
  endTime: Date;
  game1: {
    brandScore: number;
    placeScore: number;
    brandAnswers: GameAnswer[];
    placeAnswers: GameAnswer[];
  };
  isFirstAttempt: boolean;
}

export interface GameResult {
  userId: string;
  game1: {
    brandScore: number;
    placeScore: number;
    score: number;
    gameId: number;
    startedAt: string;
    completedAt: string;
  };
} 