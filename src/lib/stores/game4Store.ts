import { writable, get } from 'svelte/store';
import { Game4Service } from '$lib/services/game4Service';
import { RankingService } from '$lib/services/rankingService';
import type { Statement, Game4Answer } from '$lib/types/game4';

console.log('🎯 Game4Store module loaded');
console.log('🎯 Game4Store module loaded - SECOND LOG');
console.log('🎯 Game4Store module loaded - THIRD LOG');

interface Game4State {
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
  answers: Game4Answer[];
}

const createGame4Store = () => {
  const { subscribe, set, update } = writable<Game4State>({
    statements: [],
    currentStatementIndex: 0,
    score: 5,
    isComplete: false,
    isLoading: true,
    error: null,
    isPlaying: false,
    startTime: null,
    correctSwipes: 0,
    incorrectSwipes: 0,
    answers: []
  });

  const initialize = async () => {
    update(state => ({ ...state, isLoading: true, error: null }));
    
    try {
      const game4Service = Game4Service.getInstance();
      const statements = await game4Service.getStatements();
      
      set({
        statements: statements,
        currentStatementIndex: 0,
        score: statements.length, // Start with score equal to number of questions
        isComplete: false,
        isLoading: false,
        error: null,
        isPlaying: false,
        startTime: null,
        correctSwipes: 0,
        incorrectSwipes: 0,
        answers: []
      });
    } catch (error) {
      update(state => ({
        ...state,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load game4'
      }));
    }
  };

  const start = () => {
    update(state => ({
      ...state,
      isPlaying: true,
      startTime: new Date(),
      currentStatementIndex: 0
    }));
  };

  const swipeStatement = (direction: 'left' | 'right') => {
    console.log('🎯 SWIPE STATEMENT CALLED with direction:', direction);
    update(state => {
      console.log('🎯 Inside update function, state:', {
        isPlaying: state.isPlaying,
        currentIndex: state.currentStatementIndex,
        totalStatements: state.statements.length
      });
      if (!state.isPlaying || state.currentStatementIndex >= state.statements.length) {
        console.log('❌ Early return - not playing or index out of bounds');
        return state;
      }

      const currentStatement = state.statements[state.currentStatementIndex];
      if (!currentStatement || currentStatement.swiped) {
        return state;
      }

      const isCorrect = (direction === 'left' && !currentStatement.isTrue) || 
                       (direction === 'right' && currentStatement.isTrue);
      
      console.log('🔥 GAME4 SWIPE DEBUG 🔥:', {
        direction,
        isTrue: currentStatement.isTrue,
        isCorrect,
        title: currentStatement.title
      });

      const newScore = isCorrect ? state.score : Math.max(0, state.score - 1);
      const newCorrectSwipes = isCorrect ? state.correctSwipes + 1 : state.correctSwipes;
      const newIncorrectSwipes = isCorrect ? state.incorrectSwipes : state.incorrectSwipes + 1;

      const updatedStatements = [...state.statements];
      updatedStatements[state.currentStatementIndex] = {
        ...currentStatement,
        swiped: true,
        swipedDirection: direction,
        isCorrect,
        processedTime: Date.now()
      };

      // Record the answer
      const answer: Game4Answer = {
        _key: `${currentStatement.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        statementId: currentStatement.id,
        title: currentStatement.title,
        image: currentStatement.image,
        isTrue: currentStatement.isTrue,
        swipedDirection: direction,
        isCorrect,
        answerTime: new Date()
      };

      const updatedAnswers = [...state.answers, answer];

      const nextIndex = state.currentStatementIndex + 1;
      const isComplete = nextIndex >= state.statements.length;

      console.log('Store swipeStatement debug:', {
        currentIndex: state.currentStatementIndex,
        nextIndex,
        totalStatements: state.statements.length,
        isComplete,
        direction
      });

      return {
        ...state,
        statements: updatedStatements,
        answers: updatedAnswers,
        currentStatementIndex: isComplete ? state.currentStatementIndex : nextIndex,
        score: newScore,
        correctSwipes: newCorrectSwipes,
        incorrectSwipes: newIncorrectSwipes,
        isComplete,
        isPlaying: true
      };
    });
  };

  const reset = () => {
    set({
      statements: [],
      currentStatementIndex: 0,
      score: 0, // Will be set properly when initialize() is called
      isComplete: false,
      isLoading: false,
      error: null,
      isPlaying: false,
      startTime: null,
      correctSwipes: 0,
      incorrectSwipes: 0,
      answers: []
    });
  };

  const saveResult = async (userId: string) => {
    let currentState: Game4State;
    subscribe(state => {
      currentState = state;
    })();
    
    if (!currentState!.isComplete || !currentState!.startTime) {
      console.error('Cannot save result: game not complete or no start time');
      return;
    }

    try {
      const rankingService = RankingService.getInstance();
      await rankingService.saveGame4Result(
        userId,
        4, // Game ID for Game 4
        currentState!.score,
        currentState!.startTime.toISOString(),
        currentState!.answers,
        currentState!.correctSwipes,
        currentState!.incorrectSwipes
      );
      console.log('Game 4 result saved successfully');
    } catch (error) {
      console.error('Error saving Game 4 result:', error);
      throw error;
    }
  };

  return {
    subscribe,
    initialize,
    start,
    swipeStatement,
    reset,
    saveResult
  };
};

export const game4Store = createGame4Store(); 