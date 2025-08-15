import { writable } from 'svelte/store';
import { Game1Service } from '$lib/services/game1Service';
import { RankingService } from '$lib/services/rankingService';
import { GameRecorderService } from '$lib/services/gameRecorderService';
import type { Question } from '$lib/types/game1';
import { getAuth } from '$lib/stores/authStore';

interface Game1State {
  currentSet: 'brands' | 'places';
  questions: Question[];
  currentQuestionIndex: number;
  brandScore: number;
  placeScore: number;
  isComplete: boolean;
  brandPhaseComplete: boolean;
  isLoading: boolean;
  error: string | null;
}

const createGame1Store = () => {
  const { subscribe, set, update } = writable<Game1State>({
    currentSet: 'brands',
    questions: [],
    currentQuestionIndex: 0,
    brandScore: 0,
    placeScore: 0,
    isComplete: false,
    brandPhaseComplete: false,
    isLoading: true,
    error: null
  });

  const gameRecorderService = GameRecorderService.getInstance();

  return {
    subscribe,
    initialize: async () => {
      try {
        const game1Service = Game1Service.getInstance();
        await game1Service.loadQuestions();
        const brandQuestions = game1Service.getQuestions(1);
        const placeQuestions = game1Service.getQuestions(2);
        
        console.log('Loaded questions:', { brandQuestions, placeQuestions });

        const auth = getAuth();
        if (auth.user) {
          gameRecorderService.start();
        }
        
        set({
          currentSet: 'brands',
          questions: [...brandQuestions, ...placeQuestions],
          currentQuestionIndex: 0,
          brandScore: 0,
          placeScore: 0,
          isComplete: false,
          brandPhaseComplete: false,
          isLoading: false,
          error: null
        });
      } catch (err) {
        console.error('Error initializing game:', err);
        set({
          currentSet: 'brands',
          questions: [],
          currentQuestionIndex: 0,
          brandScore: 0,
          placeScore: 0,
          isComplete: false,
          brandPhaseComplete: false,
          isLoading: false,
          error: err instanceof Error ? err.message : 'Failed to load questions'
        });
      }
    },

    start: () => {
      update(state => ({ ...state, isLoading: false }));
    },

    continueToPlaces: () => {
      update(state => ({
        ...state,
        brandPhaseComplete: false,
        currentSet: 'places',
        currentQuestionIndex: 9
      }));
    },

    answerQuestion: (answer: string) => {
      update(state => {
        const currentQuestion = state.questions[state.currentQuestionIndex];
        const isCorrect = currentQuestion.correctAnswer === answer;
        
        console.log('Processing answer:', {
          answer,
          isCorrect,
          currentQuestion,
          currentSet: state.currentSet,
          currentIndex: state.currentQuestionIndex
        });
        
        let newState = { ...state };
        
        // Record the answer
        gameRecorderService.recordAnswer(currentQuestion, answer, isCorrect, state.currentSet);
        
        // Only add points for correct brand answers
        // Only subtract points for incorrect place answers (but not below 0)
        if (state.currentSet === 'brands') {
          if (isCorrect) {
            newState.brandScore += 1;
          }
        } else if (!isCorrect) { // places section
          newState.placeScore = Math.max(0, newState.placeScore - 1);
        }

        // Move to next question or switch sets
        if (state.currentQuestionIndex === 8 && state.currentSet === 'brands') {
          newState.brandPhaseComplete = true;
        } else if (state.currentSet === 'places' && state.currentQuestionIndex === 17) {
          newState.isComplete = true;
          // Save the final attempt
          const { brandAnswers, placeAnswers, startTime } = gameRecorderService.getAnswers();
          const auth = getAuth();
          
          // Calculate the total score for Game 1
          const totalScore = newState.brandScore + newState.placeScore;
          
          console.log('Game completed, auth state:', auth);
          console.log('User object:', auth.user);
          console.log('Game 1 final scores:', {
            brandScore: newState.brandScore,
            placeScore: newState.placeScore,
            totalScore: totalScore
          });
          
          if (auth.user && auth.user._id) {
            console.log('Saving game result with user ID:', auth.user._id);
            console.log('Game 1 final state before saving:', {
              brandScore: newState.brandScore,
              placeScore: newState.placeScore,
              totalScore: totalScore,
              brandAnswers: brandAnswers.length,
              placeAnswers: placeAnswers.length
            });
            const rankingService = RankingService.getInstance();
            rankingService.saveGameResult(
              auth.user._id,
              1, // Game 1
              newState.brandScore,
              newState.placeScore,
              startTime.toISOString(),
              brandAnswers,
              placeAnswers
            ).catch(error => {
              console.error('Error saving game result:', error);
            });
          } else {
            console.error('Cannot save game result: User not authenticated or missing _id');
            console.error('Auth state:', auth);
            console.error('User object:', auth.user);
          }
        } else {
          newState.currentQuestionIndex++;
        }

        console.log('Updated state:', newState);
        return newState;
      });
    },

    reset: () => {
      update(state => {
        console.log('Resetting game state');
        gameRecorderService.reset();
        return {
          ...state,
          currentSet: 'brands',
          currentQuestionIndex: 0,
          brandScore: 0,
          placeScore: 0,
          isComplete: false,
          brandPhaseComplete: false
        };
      });
    }
  };
};

export const game1Store = createGame1Store(); 