export interface Statement {
  id: string;
  text: string;
  isTrue: boolean;
  exploded?: boolean;
  faded?: boolean;
  timeRemaining?: number;
  processedTime?: number;
  isCorrect?: boolean;
}

export interface Game2State {
  statements: Statement[];
  currentStatementIndex: number;
  score: number;
  isComplete: boolean;
  isLoading: boolean;
  error: string | null;
  timeRemaining: number;
  isPlaying: boolean;
}

export interface Game2Answer {
  _key: string;
  statementId: string;
  statement: string;
  isTrue: boolean;
  userClicked: boolean;
  isCorrect: boolean;
  answerTime: Date;
}

export interface Game2Result {
  userId: string;
  game2: {
    score: number;
    gameId: number;
    startedAt: string;
    completedAt: string;
    destroyedLies: number;
    destroyedTruths: number;
    answers: Game2Answer[];
  };
} 