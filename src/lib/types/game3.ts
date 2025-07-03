export interface Question {
  id: number;
  question: string;
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
  game3: {
    score: number;
    answers: GameAnswer[];
    checkpointsReached: number;
  };
  isFirstAttempt: boolean;
}

export interface BallPosition {
  x: number;
  y: number;
}

export interface Wall {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface Checkpoint {
  x: number;
  y: number;
  width: number;
  height: number;
  id: number;
  isReached: boolean;
}

export interface Exit {
  x: number;
  y: number;
  width: number;
  height: number;
} 