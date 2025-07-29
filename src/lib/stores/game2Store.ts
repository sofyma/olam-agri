import { writable } from 'svelte/store';
import { Game2Service } from '$lib/services/game2Service';
import { RankingService } from '$lib/services/rankingService';
import type { Statement, Game2Answer } from '$lib/types/game2';
import { getAuth } from '$lib/stores/authStore';

interface Game2State {
  statements: Statement[];
  score: number;
  answers: Game2Answer[];
  isPlaying: boolean;
  isLoading: boolean;
  error: string | null;
  isComplete: boolean;
  startTime: Date | null;
  destroyedLies: number;
  destroyedTruths: number;
}

const createGame2Store = () => {
  const { subscribe, set, update } = writable<Game2State>({
    statements: [],
    score: 0,
    answers: [],
    isPlaying: false,
    isLoading: true,
    error: null,
    isComplete: false,
    startTime: null,
    destroyedLies: 0,
    destroyedTruths: 0
  });

  let timerIntervals: Map<number, NodeJS.Timeout> = new Map();

  const startBubbleTimer = (statementIndex: number) => {
    console.log(`Starting timer for statement ${statementIndex}`);
    // Clear any existing timer for this statement
    if (timerIntervals.has(statementIndex)) {
      clearInterval(timerIntervals.get(statementIndex)!);
    }
    
    const interval = setInterval(() => {
      update(state => {
        const statement = state.statements[statementIndex];
        if (!statement || statement.exploded || statement.faded) return state;

        const newTimeRemaining = (statement.timeRemaining || 3) - 0.1;
        
        if (newTimeRemaining <= 0) {
          // Time's up - fade the bubble
          console.log(`Timer expired for statement ${statementIndex}:`, statement.title);
          
          // Clear this timer to prevent multiple executions
          clearInterval(interval);
          timerIntervals.delete(statementIndex);
          
          const isCorrect = statement.isTrue; // If true statement passes through, it's correct
          const newScore = isCorrect ? state.score + 1 : state.score - 1;

          const updatedStatements = [...state.statements];
          updatedStatements[statementIndex] = { ...statement, faded: true, isCorrect, timeRemaining: 0, processedTime: Date.now() };
          
          const answer: Game2Answer = {
            _key: `${statement.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            statementId: statement.id,
            statement: statement.title,
            isTrue: statement.isTrue,
            userClicked: false,
            isCorrect: isCorrect,
            answerTime: new Date()
          };

          // If true statement passes through (not clicked), it's correct (+1 point)
          // If false statement passes through (not clicked), it's incorrect (-1 point)
          const newAnswers = [...state.answers, answer];
          
          console.log(`Statement ${statementIndex} faded. isTrue: ${statement.isTrue}, isCorrect: ${isCorrect}, newScore: ${newScore}`);

          // Track destroyed counts for faded bubbles
          let newDestroyedLies = state.destroyedLies;
          let newDestroyedTruths = state.destroyedTruths;
          
          if (statement.isTrue) {
            // True statement passed through (not destroyed)
            // No change to destroyed counts
          } else {
            // False statement passed through (not destroyed) - this is incorrect
            // No change to destroyed counts since it wasn't destroyed
          }

          // Check if we've processed all statements
          const totalProcessed = updatedStatements.filter(s => s.exploded || s.faded).length;
          console.log(`Total processed: ${totalProcessed}, Total statements: ${state.statements.length}`);
          console.log('Processed statements:', updatedStatements.map((s, i) => ({ 
            index: i, 
            text: s.title.substring(0, 30) + '...', 
            exploded: s.exploded, 
            faded: s.faded 
          })));
          
          if (totalProcessed >= state.statements.length) {
            // Game complete
            console.log('Game complete!');
            console.log(`Total processed: ${totalProcessed}, Total statements: ${state.statements.length}`);
            console.log('All statements processed, ending game');
            
            const rankingService = RankingService.getInstance();
            const auth = getAuth();
            
            console.log('Game 2 completed, auth state:', auth);
            console.log('User object:', auth.user);
            
            if (auth.user && auth.user._id) {
              console.log('Saving Game 2 result with user ID:', auth.user._id);
              rankingService.saveGame2Result(
                auth.user._id,
                2, // Game 2
                newScore,
                state.startTime?.toISOString() || new Date().toISOString(),
                newAnswers,
                newDestroyedLies,
                newDestroyedTruths
              ).catch(error => {
                console.error('Error saving Game 2 result:', error);
              });
            } else {
              console.error('Cannot save Game 2 result: User not authenticated or missing _id');
              console.error('Auth state:', auth);
              console.error('User object:', auth.user);
            }
            return {
              ...state,
              statements: updatedStatements,
              score: newScore,
              answers: newAnswers,
              isComplete: true,
              isPlaying: false,
              destroyedLies: newDestroyedLies,
              destroyedTruths: newDestroyedTruths
            };
          }

          // Game continues - just update the statement
          return {
            ...state,
            statements: updatedStatements,
            score: newScore,
            answers: newAnswers,
            destroyedLies: newDestroyedLies,
            destroyedTruths: newDestroyedTruths
          };
        } else {
          // Update timer
          const updatedStatements = [...state.statements];
          updatedStatements[statementIndex] = { ...statement, timeRemaining: newTimeRemaining };
          return { ...state, statements: updatedStatements };
        }
      });
    }, 100);

    timerIntervals.set(statementIndex, interval);
  };

  const stopBubbleTimer = (statementIndex: number) => {
    if (timerIntervals.has(statementIndex)) {
      clearInterval(timerIntervals.get(statementIndex)!);
      timerIntervals.delete(statementIndex);
    }
  };

  const stopAllTimers = () => {
    timerIntervals.forEach(interval => clearInterval(interval));
    timerIntervals.clear();
  };

  const handleStatementAction = (statementIndex: number, wasClicked: boolean) => {
    update(state => {
      const statement = state.statements[statementIndex];
      if (!statement || statement.exploded || statement.faded) return state;

      console.log(`${wasClicked ? 'Clicking' : 'Passing'} statement ${statementIndex}:`, statement.title);

      if (timerIntervals.has(statementIndex)) {
        clearInterval(timerIntervals.get(statementIndex)!);
        timerIntervals.delete(statementIndex);
      }

      let isCorrect: boolean;
      if (wasClicked) {
        // Correct if a false statement is clicked
        isCorrect = statement.isTrue === false;
      } else {
        // Correct if a true statement is allowed to pass
        isCorrect = statement.isTrue === true;
      }
      
      const newScore = isCorrect ? state.score + 1 : state.score - 1;
      
      console.log(`Statement ${statementIndex} ${wasClicked ? 'clicked' : 'passed'}. isTrue: ${statement.isTrue}, isCorrect: ${isCorrect}, newScore: ${newScore}`);
      
      const answer: Game2Answer = {
        _key: `${statement.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        statementId: statement.id,
        statement: statement.title,
        isTrue: statement.isTrue,
        userClicked: wasClicked,
        isCorrect,
        answerTime: new Date()
      };

      const newAnswers = [...state.answers, answer];
      
      // Update destroyed counts only on click
      let newDestroyedLies = state.destroyedLies;
      let newDestroyedTruths = state.destroyedTruths;
      if(wasClicked) {
        newDestroyedLies = statement.isTrue ? state.destroyedLies : state.destroyedLies + 1;
        newDestroyedTruths = statement.isTrue ? state.destroyedTruths + 1 : state.destroyedTruths;
      }

      const updatedStatements = [...state.statements];
      updatedStatements[statementIndex] = { ...statement, exploded: true, isCorrect, processedTime: Date.now() };

      // Check if we've processed all statements
      const totalProcessed = updatedStatements.filter(s => s.exploded || s.faded).length;
      console.log(`Total processed: ${totalProcessed}, Total statements: ${state.statements.length}`);
      console.log('Processed statements:', updatedStatements.map((s, i) => ({ 
        index: i, 
        text: s.title.substring(0, 30) + '...', 
        exploded: s.exploded, 
        faded: s.faded 
      })));
      
      if (totalProcessed >= state.statements.length) {
        // Game complete
        console.log('Game complete!');
        console.log(`Total processed: ${totalProcessed}, Total statements: ${state.statements.length}`);
        console.log('All statements processed, ending game');
        
        const rankingService = RankingService.getInstance();
        const auth = getAuth();
        
        console.log('Game 2 completed, auth state:', auth);
        console.log('User object:', auth.user);
        
        if (auth.user && auth.user._id) {
          console.log('Saving Game 2 result with user ID:', auth.user._id);
          rankingService.saveGame2Result(
            auth.user._id,
            2, // Game 2
            newScore,
            state.startTime?.toISOString() || new Date().toISOString(),
            newAnswers,
            newDestroyedLies,
            newDestroyedTruths
          ).catch(error => {
            console.error('Error saving Game 2 result:', error);
          });
        } else {
          console.error('Cannot save Game 2 result: User not authenticated or missing _id');
          console.error('Auth state:', auth);
          console.error('User object:', auth.user);
        }
        return {
          ...state,
          statements: updatedStatements,
          score: newScore,
          answers: newAnswers,
          isComplete: true,
          isPlaying: false,
          destroyedLies: newDestroyedLies,
          destroyedTruths: newDestroyedTruths
        };
      }

      // Game continues - just update the statement
      return {
        ...state,
        statements: updatedStatements,
        score: newScore,
        answers: newAnswers,
        destroyedLies: newDestroyedLies,
        destroyedTruths: newDestroyedTruths
      };
    });
  };

  return {
    subscribe,
    initialize: async () => {
      try {
        const game2Service = Game2Service.getInstance();
        await game2Service.loadStatements();
        const statements = game2Service.getRandomStatements(10);
        console.log(`Loaded ${statements.length} statements for Game 2`);
        console.log('Statements:', statements.map((s, i) => ({ index: i, text: s.title.substring(0, 30) + '...', isTrue: s.isTrue })));
        
        if (statements.length === 0) {
          set({
            statements: [],
            score: 0,
            answers: [],
            isPlaying: false,
            isLoading: false,
            error: 'No Game 2 statements found. Please add some statements in Sanity Studio.',
            isComplete: false,
            startTime: null,
            destroyedLies: 0,
            destroyedTruths: 0
          });
          return;
        }
        
        set({
          statements: statements.map(s => ({ ...s, timeRemaining: 3 })),
          score: 0,
          answers: [],
          isPlaying: false,
          isLoading: false,
          error: null,
          isComplete: false,
          startTime: null,
          destroyedLies: 0,
          destroyedTruths: 0
        });
      } catch (err) {
        console.error('Error initializing game:', err);
        set({
          statements: [],
          score: 0,
          answers: [],
          isPlaying: false,
          isLoading: false,
          error: err instanceof Error ? err.message : 'Failed to load statements',
          isComplete: false,
          startTime: null,
          destroyedLies: 0,
          destroyedTruths: 0
        });
      }
    },

    start: () => {
      update(state => ({ ...state, isPlaying: true, isComplete: false, score: 0, answers: [], startTime: new Date() }));
    },

    answerStatement: handleStatementAction,

    reset: () => {
      stopAllTimers();
      update(state => ({
        ...state,
        score: 0,
        answers: [],
        isPlaying: false,
        isLoading: true,
        error: null,
        isComplete: false,
        startTime: null,
        destroyedLies: 0,
        destroyedTruths: 0
      }));
    },

    startBubbleTimer,
    stopBubbleTimer,
  };
};

export const game2Store = createGame2Store(); 