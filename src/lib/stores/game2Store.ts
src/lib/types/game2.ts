export interface Game2Answer {
  _key: string;
  statementId: string;
  statement: string;
  isTrue: boolean;
}

if (timerIntervals.has(statementIndex)) {
  clearInterval(timerIntervals.get(statementIndex)!);
}

const interval = setInterval(() => {
  const updatedStatements = [...state.statements];
  updatedStatements[statementIndex] = { ...statement, faded: true, isCorrect, timeRemaining: 0, processedTime: Date.now() };
  
  const answer: Game2Answer = {
    _key: `${statement.id}-${Date.now()}`,
    statementId: statement.id,
    statement: statement.text,
    isTrue: statement.isTrue,
  };

  console.log(`Statement ${statementIndex} ${wasClicked ? 'clicked' : 'passed'}. isTrue: ${statement.isTrue}, isCorrect: ${isCorrect}, newScore: ${newScore}`);
} 