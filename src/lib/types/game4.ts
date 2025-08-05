export interface Statement {
  id: string;
  title: string;
  image: string;
  isTrue: boolean;
  swiped?: boolean;
  swipedDirection?: 'left' | 'right';
  isCorrect?: boolean;
  processedTime?: number;
}

export interface Game4State {
  statements: Statement[];
  currentStatementIndex: number;
  score: number;
  isComplete: boolean;
  isLoading: boolean;
  error: string | null;
  isPlaying: boolean;
  startTime: Date | null;
  correctSwipes: number;
  incorrectSwipes: number;
}

export interface Game4Answer {
  _key: string;
  statementId: string;
  title: string;
  image: string;
  isTrue: boolean;
  swipedDirection: 'left' | 'right';
  isCorrect: boolean;
  answerTime: Date;
}

export interface Game4Result {
  userId: string;
  game4: {
    score: number;
    gameId: number;
    startedAt: string;
    completedAt: string;
    correctSwipes: number;
    incorrectSwipes: number;
    answers: Game4Answer[];
  };
} 