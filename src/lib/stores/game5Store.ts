import { writable } from 'svelte/store';
import { Game5Service } from '$lib/services/game5Service';
import { RankingService } from '$lib/services/rankingService';
import { getAuth } from '$lib/stores/authStore';
import type { Game5State } from '$lib/types/game5';

const createGame5Store = () => {
  const { subscribe, set, update } = writable<Game5State>({
    isStarted: false,
    isComplete: false,
    startTime: null,
    endTime: null,
    timeSpent: 0,
    attempts: 0,
    isCorrect: false,
    isLoading: false,
    error: null,
    allAnswers: []
  });

  let timerInterval: NodeJS.Timeout | null = null;
  let lastSavedTime = 0;

  const saveTimer = () => {
    update(state => {
      if (state.startTime && !state.isComplete) {
        const currentTime = Date.now() - state.startTime.getTime();
        lastSavedTime = currentTime;
        // Save to localStorage every 5 seconds
        localStorage.setItem('game5_timer', currentTime.toString());
        localStorage.setItem('game5_startTime', state.startTime.toISOString());
        
        console.log('Game 5: Timer saved to localStorage', {
          currentTime,
          timeSpent: currentTime,
          startTime: state.startTime.toISOString()
        });
      }
      return state;
    });
  };

  const startTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    
    timerInterval = setInterval(() => {
      update(state => {
        if (state.startTime && !state.isComplete) {
          const currentTime = Date.now() - state.startTime.getTime();
          return { ...state, timeSpent: currentTime };
        }
        return state;
      });
    }, 100);

    // Save timer every 5 seconds
    setInterval(saveTimer, 5000);
  };

  return {
    subscribe,
    
    initialize: () => {
      // Check for saved timer state
      const savedTimer = localStorage.getItem('game5_timer');
      const savedStartTime = localStorage.getItem('game5_startTime');
      
      if (savedTimer && savedStartTime) {
        const startTime = new Date(savedStartTime);
        const timeSpent = parseInt(savedTimer);
        lastSavedTime = timeSpent;
        
        set({
          isStarted: true,
          isComplete: false,
          startTime,
          endTime: null,
          timeSpent,
          attempts: 0,
          isCorrect: false,
          isLoading: false,
          error: null,
          allAnswers: []
        });
        
        startTimer();
      } else {
        set({
          isStarted: false,
          isComplete: false,
          startTime: null,
          endTime: null,
          timeSpent: 0,
          attempts: 0,
          isCorrect: false,
          isLoading: false,
          error: null,
          allAnswers: []
        });
      }
    },

    start: () => {
      // Check if there's a saved timer state
      const savedTimer = localStorage.getItem('game5_timer');
      const savedStartTime = localStorage.getItem('game5_startTime');
      
      if (savedTimer && savedStartTime) {
        // Resume from saved state
        const startTime = new Date(savedStartTime);
        const timeSpent = parseInt(savedTimer);
        
        console.log('Game 5: Resuming from saved timer state', {
          savedTimer,
          savedStartTime,
          timeSpent,
          startTime
        });
        
        set({
          isStarted: true,
          isComplete: false,
          startTime,
          endTime: null,
          timeSpent,
          attempts: 0,
          isCorrect: false,
          isLoading: false,
          error: null,
          allAnswers: []
        });
      } else {
        // Start new game
        const startTime = new Date();
        console.log('Game 5: Starting new game');
        set({
          isStarted: true,
          isComplete: false,
          startTime,
          endTime: null,
          timeSpent: 0,
          attempts: 0,
          isCorrect: false,
          isLoading: false,
          error: null,
          allAnswers: []
        });
      }
      
      startTimer();
    },

    submitAnswer: (answer: string) => {
      update(state => {
        const gameService = Game5Service.getInstance();
        const isCorrect = gameService.validateAnswer(answer);
        const newAttempts = state.attempts + 1;
        const attemptTime = new Date();
        
        // Add this attempt to allAnswers
        const newAnswer = {
          answer,
          isCorrect,
          attemptTime,
          timeSpent: state.timeSpent
        };
        
        if (isCorrect && !state.isComplete) {
          // Stop timer and complete game
          if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
          }
          
          const endTime = new Date();
          const finalTimeSpent = state.startTime ? endTime.getTime() - state.startTime.getTime() : 0;
          
          // Clear saved timer
          localStorage.removeItem('game5_timer');
          localStorage.removeItem('game5_startTime');
          
          // Save game result
          const auth = getAuth();
          if (auth.user && auth.user._id) {
            const rankingService = RankingService.getInstance();
            rankingService.saveGame5Result(
              auth.user._id,
              5, // Game 5
              gameService.getPoints(),
              finalTimeSpent,
              newAttempts,
              state.startTime?.toISOString() || '',
              endTime.toISOString(),
              answer,
              [...state.allAnswers, newAnswer]
            ).catch((error: any) => {
              console.error('Error saving game 5 result:', error);
            });
          }
          
          return {
            ...state,
            isComplete: true,
            endTime,
            timeSpent: finalTimeSpent,
            attempts: newAttempts,
            isCorrect: true,
            allAnswers: [...state.allAnswers, newAnswer]
          };
        } else {
          // Incorrect answer, continue game
          return {
            ...state,
            attempts: newAttempts,
            isCorrect: false,
            allAnswers: [...state.allAnswers, newAnswer]
          };
        }
      });
    },

    reset: () => {
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
      
      // Clear saved timer
      localStorage.removeItem('game5_timer');
      localStorage.removeItem('game5_startTime');
      
      set({
        isStarted: false,
        isComplete: false,
        startTime: null,
        endTime: null,
        timeSpent: 0,
        attempts: 0,
        isCorrect: false,
        isLoading: false,
        error: null,
        allAnswers: []
      });
    },

    cleanup: () => {
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
    }
  };
};

export const game5Store = createGame5Store(); 