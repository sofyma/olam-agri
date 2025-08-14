import { writable, get } from 'svelte/store';
import { Game6Service } from '$lib/services/game6Service';
import { RankingService } from '$lib/services/rankingService';
import type { Question, Game6Answer } from '$lib/types/game6';

interface Game6State {
  questions: Question[];
  currentQuestionIndex: number;
  score: number;
  isComplete: boolean;
  isLoading: boolean;
  error: string | null;
  isPlaying: boolean;
  startTime: Date | null;
  totalQuestions: number;
  answers: Game6Answer[];
}

const createGame6Store = () => {
  const { subscribe, set, update } = writable<Game6State>({
    questions: [],
    currentQuestionIndex: 0,
    score: 10, // Fixed score for completing the game
    isComplete: false,
    isLoading: true,
    error: null,
    isPlaying: false,
    startTime: null,
    totalQuestions: 0,
    answers: []
  });

  const initialize = async () => {
    update(state => ({ ...state, isLoading: true, error: null }));
    
    try {
      const game6Service = Game6Service.getInstance();
      const questions = await game6Service.getQuestions();
      
      set({
        questions: questions,
        currentQuestionIndex: 0,
        score: 10,
        isComplete: false,
        isLoading: false,
        error: null,
        isPlaying: false,
        startTime: null,
        totalQuestions: questions.length,
        answers: []
      });
    } catch (error) {
      update(state => ({
        ...state,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load game6'
      }));
    }
  };

  const start = () => {
    update(state => ({
      ...state,
      isPlaying: true,
      startTime: new Date(),
      currentQuestionIndex: 0
    }));
  };

  const getStartQuestion = async () => {
    try {
      const game6Service = Game6Service.getInstance();
      const startQuestion = await game6Service.getStartQuestion();
      return startQuestion;
    } catch (error) {
      console.error('Failed to get start question:', error);
      return null;
    }
  };

  const getQuestion = async (questionId: string) => {
    try {
      const game6Service = Game6Service.getInstance();
      const question = await game6Service.getQuestion(questionId);
      return question;
    } catch (error) {
      console.error('Failed to get question:', error);
      return null;
    }
  };

  const answerQuestion = (selectedOption: 'A' | 'B') => {
    update(state => {
      if (!state.isPlaying || state.currentQuestionIndex >= state.questions.length) {
        return state;
      }

      const currentQuestion = state.questions[state.currentQuestionIndex];
      if (!currentQuestion || currentQuestion.answered) {
        return state;
      }

      // Record the answer
      const answer: Game6Answer = {
        _key: `${currentQuestion.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        questionId: currentQuestion.id,
        question: currentQuestion.question,
        optionA: currentQuestion.optionA,
        optionB: currentQuestion.optionB,
        selectedOption,
        answerTime: new Date()
      };

      const updatedAnswers = [...state.answers, answer];

      // Update the question with answer data
      const updatedQuestions = [...state.questions];
      updatedQuestions[state.currentQuestionIndex] = {
        ...currentQuestion,
        answered: true,
        selectedOption,
        answerTime: Date.now()
      };

      const nextIndex = state.currentQuestionIndex + 1;
      const isComplete = nextIndex >= state.questions.length;

      console.log('Store answerQuestion debug:', {
        currentIndex: state.currentQuestionIndex,
        nextIndex,
        totalQuestions: state.questions.length,
        isComplete,
        selectedOption
      });

      return {
        ...state,
        questions: updatedQuestions,
        answers: updatedAnswers,
        currentQuestionIndex: isComplete ? state.currentQuestionIndex : nextIndex,
        isComplete,
        isPlaying: true
      };
    });
  };

  const reset = () => {
    set({
      questions: [],
      currentQuestionIndex: 0,
      score: 5,
      isComplete: false,
      isLoading: false,
      error: null,
      isPlaying: false,
      startTime: null,
      totalQuestions: 0,
      answers: []
    });
  };

  const markComplete = () => {
    update(state => ({
      ...state,
      isComplete: true
    }));
  };

  const saveResult = async (userId: string) => {
    let currentState: Game6State;
    subscribe(state => {
      currentState = state;
    })();
    
    if (!currentState!.startTime) {
      console.error('Cannot save result: no start time');
      return;
    }

    try {
      const rankingService = RankingService.getInstance();
      await rankingService.saveGame6Result(
        userId,
        6, // Game ID for Game 6
        currentState!.score,
        currentState!.startTime.toISOString(),
        currentState!.answers,
        currentState!.totalQuestions
      );
      console.log('Game 6 result saved successfully');
    } catch (error) {
      console.error('Error saving Game 6 result:', error);
      throw error;
    }
  };

  return {
    subscribe,
    initialize,
    start,
    getStartQuestion,
    getQuestion,
    answerQuestion,
    reset,
    markComplete,
    saveResult
  };
};

export const game6Store = createGame6Store(); 