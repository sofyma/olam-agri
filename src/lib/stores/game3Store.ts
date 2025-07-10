import { writable } from 'svelte/store';
import { Game3Service } from '$lib/services/game3Service';
import { RankingService } from '$lib/services/rankingService';
import { GameRecorderService } from '$lib/services/gameRecorderService';
import type { Question, BallPosition, Wall, Checkpoint, Exit } from '$lib/types/game3';
import { getAuth } from '$lib/stores/authStore';

interface Game3State {
  questions: Question[];
  currentQuestionIndex: number;
  score: number;
  isComplete: boolean;
  isLoading: boolean;
  error: string | null;
  ballPosition: BallPosition;
  walls: Wall[];
  checkpoints: Checkpoint[];
  exit: Exit;
  showQuestionModal: boolean;
  currentCheckpoint: number | null;
  checkpointsReached: number;
  gridSize: number; // Grid square size
  correctAnswersCount: number; // Track number of correct answers
  answers: Array<{
    question: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    questionNumber: number;
  }>; // Track all answers for database storage
}

const createGame3Store = () => {
  const { subscribe, set, update } = writable<Game3State>({
    questions: [],
    currentQuestionIndex: 0,
    score: 0,
    isComplete: false,
    isLoading: true,
    error: null,
    ballPosition: { x: 20, y: 150 }, // Proper starting position outside maze walls
    walls: [],
    checkpoints: [
      {
        id: 1,
        x: 1065.65,
        y: 135.09,
        width: 40,
        height: 40,
        isReached: false
      },
      {
        id: 2,
        x: 294.39,
        y: 603.85,
        width: 40,
        height: 40,
        isReached: false
      }
    ],
    exit: {
      x: 1200,
      y: 890,
      width: 20,
      height: 20
    },
    showQuestionModal: false,
    currentCheckpoint: null,
    checkpointsReached: 0,
    gridSize: 30, // 30px grid size
    correctAnswersCount: 0,
    answers: []
  });

  const gameRecorderService = GameRecorderService.getInstance();

  // Parse walls from SVG data
  const parseWalls = (): Wall[] => {
    const wallPaths = [
      // Vertical walls
      { x1: 18.12, y1: 183.05, x2: 18.12, y2: 890.71 },
      { x1: 77.23, y1: 417.8, x2: 77.23, y2: 713.36 },
      { x1: 18.12, y1: 4, x2: 18.12, y2: 122.23 },
      { x1: 80.61, y1: 4, x2: 80.61, y2: 122.23 },
      { x1: 77.23, y1: 181.34, x2: 77.23, y2: 240.46 },
      { x1: 77.23, y1: 299.569, x2: 77.23, y2: 358.679 },
      { x1: 550.14, y1: 358.68, x2: 550.14, y2: 417.8 },
      { x1: 550.14, y1: 4, x2: 550.14, y2: 63.12 },
      { x1: 786.6, y1: 4, x2: 786.6, y2: 63.12 },
      { x1: 904.82, y1: 595.14, x2: 904.82, y2: 654.25 },
      { x1: 904.82, y1: 417.489, x2: 904.82, y2: 476.599 },
      { x1: 372.8, y1: 4, x2: 372.8, y2: 63.12 },
      { x1: 963.94, y1: 4, x2: 963.94, y2: 63.12 },
      { x1: 372.8, y1: 831.59, x2: 372.8, y2: 890.71 },
      { x1: 431.91, y1: 595.14, x2: 431.91, y2: 654.25 },
      { x1: 431.91, y1: 772.479, x2: 431.91, y2: 831.589 },
      { x1: 845.71, y1: 772.479, x2: 845.71, y2: 831.589 },
      { x1: 1023.05, y1: 772.479, x2: 1023.05, y2: 831.589 },
      { x1: 1023.05, y1: 476.909, x2: 1023.05, y2: 595.139 },
      { x1: 963.94, y1: 476.909, x2: 963.94, y2: 654.249 },
      { x1: 491.03, y1: 63.1191, x2: 491.03, y2: 122.229 },
      { x1: 609.25, y1: 299.569, x2: 609.25, y2: 358.679 },
      { x1: 609.25, y1: 595.14, x2: 609.25, y2: 713.36 },
      { x1: 609.25, y1: 772.479, x2: 609.25, y2: 831.589 },
      { x1: 786.6, y1: 299.569, x2: 786.6, y2: 358.679 },
      { x1: 668.37, y1: 417.8, x2: 668.37, y2: 476.91 },
      { x1: 668.37, y1: 536.02, x2: 668.37, y2: 595.14 },
      { x1: 668.37, y1: 831.59, x2: 668.37, y2: 890.71 },
      { x1: 786.6, y1: 831.59, x2: 786.6, y2: 890.71 },
      { x1: 491.03, y1: 654.25, x2: 491.03, y2: 713.36 },
      { x1: 491.03, y1: 713.359, x2: 491.03, y2: 772.479 },
      { x1: 550.14, y1: 536.02, x2: 550.14, y2: 595.14 },
      { x1: 550.14, y1: 595.14, x2: 550.14, y2: 713.36 },
      { x1: 550.14, y1: 831.59, x2: 550.14, y2: 890.71 },
      { x1: 136.35, y1: 63.1191, x2: 136.35, y2: 181.339 },
      { x1: 136.35, y1: 417.8, x2: 136.35, y2: 536.02 },
      { x1: 136.35, y1: 654.25, x2: 136.35, y2: 831.59 },
      { x1: 195.46, y1: 122.229, x2: 195.46, y2: 181.34 },
      { x1: 195.46, y1: 358.68, x2: 195.46, y2: 417.8 },
      { x1: 136.35, y1: 240.46, x2: 136.35, y2: 299.57 },
      { x1: 195.46, y1: 831.59, x2: 195.46, y2: 890.71 },
      { x1: 254.57, y1: 772.479, x2: 254.57, y2: 831.589 },
      { x1: 254.57, y1: 299.569, x2: 254.57, y2: 358.679 },
      { x1: 254.57, y1: 181.34, x2: 254.57, y2: 240.46 },
      { x1: 254.57, y1: 63.1191, x2: 254.57, y2: 122.229 },
      { x1: 195.46, y1: 536.02, x2: 195.46, y2: 654.25 },
      { x1: 254.57, y1: 595.14, x2: 254.57, y2: 713.36 },
      { x1: 313.69, y1: 181.34, x2: 313.69, y2: 299.57 },
      { x1: 372.8, y1: 536.02, x2: 372.8, y2: 654.25 },
      { x1: 313.69, y1: 476.909, x2: 313.69, y2: 595.139 },
      { x1: 313.69, y1: 358.68, x2: 313.69, y2: 417.8 },
      { x1: 372.8, y1: 181.34, x2: 372.8, y2: 417.8 },
      { x1: 431.91, y1: 63.1191, x2: 431.91, y2: 476.909 },
      { x1: 491.03, y1: 358.68, x2: 491.03, y2: 476.91 },
      { x1: 550.14, y1: 122.229, x2: 550.14, y2: 299.569 },
      { x1: 609.25, y1: 63.1191, x2: 609.25, y2: 181.339 },
      { x1: 668.37, y1: 654.25, x2: 668.37, y2: 772.48 },
      { x1: 727.48, y1: 4, x2: 727.48, y2: 122.23 },
      { x1: 727.48, y1: 476.909, x2: 727.48, y2: 536.019 },
      { x1: 727.48, y1: 358.369, x2: 727.48, y2: 417.489 },
      { x1: 727.48, y1: 594.829, x2: 727.48, y2: 653.939 },
      { x1: 727.48, y1: 772.479, x2: 727.48, y2: 831.589 },
      { x1: 786.6, y1: 417.8, x2: 786.6, y2: 595.14 },
      { x1: 845.71, y1: 240.46, x2: 845.71, y2: 417.8 },
      { x1: 845.71, y1: 63.1191, x2: 845.71, y2: 181.339 },
      { x1: 845.71, y1: 536.02, x2: 845.71, y2: 654.25 },
      { x1: 904.82, y1: 240.46, x2: 904.82, y2: 358.68 },
      { x1: 904.82, y1: 63.1191, x2: 904.82, y2: 181.339 },
      { x1: 963.94, y1: 654.25, x2: 963.94, y2: 772.48 },
      { x1: 963.94, y1: 299.26, x2: 963.94, y2: 417.49 },
      { x1: 963.94, y1: 122.229, x2: 963.94, y2: 240.459 },
      { x1: 1023.05, y1: 122.229, x2: 1023.05, y2: 476.91 },
      { x1: 1082.16, y1: 181.34, x2: 1082.16, y2: 240.46 },
      { x1: 1082.16, y1: 476.909, x2: 1082.16, y2: 653.939 },
      { x1: 1141.59, y1: 417.489, x2: 1141.59, y2: 595.139 },
      { x1: 1082.16, y1: 831.59, x2: 1082.16, y2: 890.71 },
      { x1: 1141.28, y1: 240.46, x2: 1141.28, y2: 358.68 },
      { x1: 1141.28, y1: 63.1191, x2: 1141.28, y2: 181.339 },
      { x1: 1200.39, y1: 4.62988, x2: 1200.39, y2: 890.71 },
      // Horizontal walls
      { x1: 1200.39, y1: 4, x2: 18.12, y2: 4 },
      { x1: 254.57, y1: 63.1191, x2: 136.35, y2: 63.1191 },
      { x1: 372.8, y1: 63.1191, x2: 313.69, y2: 63.1191 },
      { x1: 491.03, y1: 240.46, x2: 431.91, y2: 240.46 },
      { x1: 1141.28, y1: 240.46, x2: 1082.16, y2: 240.46 },
      { x1: 372.8, y1: 358.68, x2: 313.69, y2: 358.68 },
      { x1: 786.6, y1: 358.68, x2: 727.48, y2: 358.68 },
      { x1: 609.25, y1: 299.569, x2: 491.03, y2: 299.569 },
      { x1: 786.6, y1: 299.569, x2: 668.37, y2: 299.569 },
      { x1: 1082.16, y1: 299.569, x2: 1023.05, y2: 299.569 },
      { x1: 550.14, y1: 536.02, x2: 372.8, y2: 536.02 },
      { x1: 136.35, y1: 713.359, x2: 77.23, y2: 713.359 },
      { x1: 609.25, y1: 713.359, x2: 550.14, y2: 713.359 },
      { x1: 1200.39, y1: 654.25, x2: 1141.28, y2: 654.25 },
      { x1: 77.23, y1: 772.479, x2: 18.12, y2: 772.479 },
      { x1: 372.8, y1: 654.25, x2: 313.69, y2: 654.25 },
      { x1: 1023.05, y1: 476.909, x2: 963.94, y2: 476.909 },
      { x1: 904.82, y1: 476.909, x2: 786.6, y2: 476.909 },
      { x1: 195.46, y1: 654.25, x2: 136.35, y2: 654.25 },
      { x1: 845.71, y1: 654.25, x2: 786.6, y2: 654.25 },
      { x1: 963.94, y1: 654.25, x2: 904.82, y2: 654.25 },
      { x1: 1141.28, y1: 654.25, x2: 1023.05, y2: 654.25 },
      { x1: 550.14, y1: 595.14, x2: 491.03, y2: 595.14 },
      { x1: 313.69, y1: 595.14, x2: 254.57, y2: 595.14 },
      { x1: 136.35, y1: 595.14, x2: 77.23, y2: 595.14 },
      { x1: 550.14, y1: 63.1191, x2: 491.03, y2: 63.1191 },
      { x1: 668.37, y1: 63.1191, x2: 609.25, y2: 63.1191 },
      { x1: 845.71, y1: 63.1191, x2: 786.6, y2: 63.1191 },
      { x1: 963.94, y1: 63.1191, x2: 904.82, y2: 63.1191 },
      { x1: 1141.28, y1: 63.1191, x2: 1023.05, y2: 63.1191 },
      { x1: 431.91, y1: 122.229, x2: 254.57, y2: 122.229 },
      { x1: 1141.28, y1: 122.229, x2: 963.94, y2: 122.229 },
      { x1: 786.6, y1: 122.229, x2: 668.37, y2: 122.229 },
      { x1: 609.25, y1: 122.229, x2: 550.14, y2: 122.229 },
      { x1: 136.35, y1: 181.34, x2: 77.23, y2: 181.34 },
      { x1: 550.14, y1: 181.34, x2: 431.91, y2: 181.34 },
      { x1: 313.69, y1: 181.34, x2: 195.46, y2: 181.34 },
      { x1: 845.71, y1: 181.34, x2: 609.25, y2: 181.34 },
      { x1: 195.46, y1: 240.46, x2: 77.23, y2: 240.46 },
      { x1: 963.94, y1: 240.46, x2: 609.25, y2: 240.46 },
      { x1: 313.69, y1: 299.569, x2: 136.35, y2: 299.569 },
      { x1: 195.46, y1: 358.68, x2: 77.86, y2: 358.68 },
      { x1: 667.75, y1: 358.68, x2: 550.14, y2: 358.68 },
      { x1: 1200.39, y1: 358.68, x2: 1082.79, y2: 358.68 },
      { x1: 1141.59, y1: 417.489, x2: 1023.67, y2: 417.489 },
      { x1: 727.48, y1: 417.489, x2: 609.88, y2: 417.489 },
      { x1: 963.94, y1: 417.489, x2: 846.33, y2: 417.489 },
      { x1: 314.31, y1: 417.8, x2: 136.35, y2: 417.8 },
      { x1: 668.37, y1: 476.909, x2: 194.84, y2: 476.909 },
      { x1: 727.48, y1: 536.02, x2: 550.14, y2: 536.02 },
      { x1: 963.94, y1: 536.02, x2: 845.71, y2: 536.02 },
      { x1: 254.57, y1: 536.02, x2: 136.35, y2: 536.02 },
      { x1: 786.6, y1: 595.14, x2: 668.37, y2: 595.14 },
      { x1: 491.03, y1: 654.029, x2: 431.91, y2: 654.249 },
      { x1: 491.03, y1: 713.359, x2: 195.46, y2: 713.359 },
      { x1: 904.82, y1: 713.359, x2: 668.37, y2: 713.359 },
      { x1: 1141.28, y1: 713.359, x2: 963.94, y2: 713.359 },
      { x1: 431.91, y1: 772.479, x2: 136.35, y2: 772.479 },
      { x1: 668.37, y1: 772.479, x2: 491.03, y2: 772.479 },
      { x1: 963.94, y1: 772.479, x2: 727.48, y2: 772.479 },
      { x1: 1200.39, y1: 772.479, x2: 1023.05, y2: 772.479 },
      { x1: 545.79, y1: 831.59, x2: 431.91, y2: 831.59 },
      { x1: 1023.05, y1: 831.59, x2: 909.18, y2: 831.59 },
      { x1: 372.8, y1: 831.59, x2: 313.69, y2: 831.59 },
      { x1: 135.1, y1: 831.59, x2: 75.99, y2: 831.59 },
      { x1: 727.48, y1: 831.59, x2: 668.37, y2: 831.59 },
      { x1: 1141.28, y1: 831.59, x2: 1082.16, y2: 831.59 },
      { x1: 1141.28, y1: 890.71, x2: 18.12, y2: 890.71 }
    ];

    return wallPaths;
  };

  // Utility to auto-detect grid size from wall data
  function autoDetectGridSize(walls: Wall[]): number {
    const positions: number[] = [];
    walls.forEach(wall => {
      if (wall.x1 === wall.x2) {
        positions.push(wall.x1);
      }
      if (wall.y1 === wall.y2) {
        positions.push(wall.y1);
      }
    });
    positions.sort((a, b) => a - b);
    const diffs: number[] = [];
    for (let i = 1; i < positions.length; i++) {
      const diff = Math.abs(positions[i] - positions[i - 1]);
      if (diff > 0.5) diffs.push(diff);
    }
    // Find the most common difference
    const freq: Record<number, number> = {};
    diffs.forEach(d => {
      const rounded = Math.round(d);
      freq[rounded] = (freq[rounded] || 0) + 1;
    });
    let mostCommon = 30;
    let maxCount = 0;
    for (const d in freq) {
      if (freq[d] > maxCount) {
        mostCommon = parseInt(d);
        maxCount = freq[d];
      }
    }
    return mostCommon;
  }

  return {
    subscribe,
    initialize: async () => {
      try {
        const game3Service = Game3Service.getInstance();
        await game3Service.loadQuestions();
        const questions = game3Service.getQuestions();
        
        console.log('Loaded Game 3 questions:', questions);

        const auth = getAuth();
        if (auth.user) {
          gameRecorderService.start();
        }
        
        const walls = parseWalls();
        const gridSize = autoDetectGridSize(walls);
        
        set({
          questions,
          currentQuestionIndex: 0,
          score: 0,
          isComplete: false,
          isLoading: false,
          error: null,
          ballPosition: { x: 20, y: 150 },
          walls,
          checkpoints: [
            {
              id: 1,
              x: 1035.65,
              y: 135.09,
              width: 40,
              height: 40,
              isReached: false
            },
            {
              id: 2,
              x: 264.39,
              y: 603.85,
              width: 40,
              height: 40,
              isReached: false
            }
          ],
          exit: {
            x: 1200,
            y: 890,
            width: 20,
            height: 20
          },
          showQuestionModal: false,
          currentCheckpoint: null,
          checkpointsReached: 0,
          gridSize,
          correctAnswersCount: 0,
          answers: []
        });
      } catch (err) {
        console.error('Error initializing Game 3:', err);
        set({
          questions: [],
          currentQuestionIndex: 0,
          score: 0,
          isComplete: false,
          isLoading: false,
          error: err instanceof Error ? err.message : 'Failed to load questions',
          ballPosition: { x: 20, y: 150 },
          walls: parseWalls(),
          checkpoints: [
            {
              id: 1,
              x: 1035.65,
              y: 135.09,
              width: 40,
              height: 40,
              isReached: false
            },
            {
              id: 2,
              x: 264.39,
              y: 603.85,
              width: 40,
              height: 40,
              isReached: false
            }
          ],
          exit: {
            x: 1200,
            y: 890,
            width: 20,
            height: 20
          },
          showQuestionModal: false,
          currentCheckpoint: null,
          checkpointsReached: 0,
          gridSize: 30, // 30px grid size
          correctAnswersCount: 0,
          answers: []
        });
      }
    },

    start: () => {
      update(state => ({ ...state, isLoading: false }));
    },

    moveBall: (direction: 'up' | 'down' | 'left' | 'right') => {
      update(state => {
        const ballRadius = 15.6; // From SVG circle radius
        const stepSize = 10;
        let newX = state.ballPosition.x;
        let newY = state.ballPosition.y;

        switch (direction) {
          case 'up':
            newY -= stepSize;
            break;
          case 'down':
            newY += stepSize;
            break;
          case 'left':
            newX -= stepSize;
            break;
          case 'right':
            newX += stepSize;
            break;
        }

        // Check wall collisions
        const epsilon = 0.5;
        const wouldCollide = state.walls.some(wall => {
          const ballLeft = newX - ballRadius + epsilon;
          const ballRight = newX + ballRadius - epsilon;
          const ballTop = newY - ballRadius + epsilon;
          const ballBottom = newY + ballRadius - epsilon;

          if (wall.x1 === wall.x2) {
            // Vertical wall
            return ballLeft <= wall.x1 && ballRight >= wall.x1 &&
                   ballTop <= Math.max(wall.y1, wall.y2) && ballBottom >= Math.min(wall.y1, wall.y2);
          } else {
            // Horizontal wall
            return ballTop <= wall.y1 && ballBottom >= wall.y1 &&
                   ballLeft <= Math.max(wall.x1, wall.x2) && ballRight >= Math.min(wall.x1, wall.x2);
          }
        });

        if (wouldCollide) {
          return state; // Don't move if would collide
        }

        // Check checkpoint collisions
        const checkpoint = state.checkpoints.find(cp => !cp.isReached && 
          newX > cp.x && newX < cp.x + cp.width &&
          newY > cp.y && newY < cp.y + cp.height
        );

        if (checkpoint) {
          return {
            ...state,
            ballPosition: { x: newX, y: newY },
            showQuestionModal: true,
            currentCheckpoint: checkpoint.id,
            checkpointsReached: state.checkpointsReached + 1
          };
        }

        // Check exit collision - detect when ball hits the finish line
        const finishLineY = 890.71;
        const finishLineX1 = 1141.28;
        const finishLineX2 = 1200.39;
        
        if (newY >= finishLineY - ballRadius && newY <= finishLineY + ballRadius &&
            newX >= finishLineX1 && newX <= finishLineX2) {
          console.log('Game 3 completed! Ball hit finish line');
          return {
            ...state,
            ballPosition: { x: newX, y: newY },
            isComplete: true,
            score: state.score + 1
          };
        }

        return {
          ...state,
          ballPosition: { x: newX, y: newY }
        };
      });
    },

    moveBallSmooth: (direction: 'up' | 'down' | 'left' | 'right') => {
      update(state => {
        const ballRadius = 15.6;
        const gridSize = state.gridSize; // Move exactly one grid square
        const wallBuffer = 10; // Stop 10px before hitting the wall
        
        let currentX = state.ballPosition.x;
        let currentY = state.ballPosition.y;
        
        // Calculate next position (one grid square in the direction)
        let nextX = currentX;
        let nextY = currentY;
        
        switch (direction) {
          case 'up':
            nextY -= gridSize;
            break;
          case 'down':
            nextY += gridSize;
            break;
          case 'left':
            nextX -= gridSize;
            break;
          case 'right':
            nextX += gridSize;
            break;
        }
        
        // Check wall collisions with epsilon
        const epsilon = 0.5;
        const wouldCollide = state.walls.some(wall => {
          const ballLeft = nextX - ballRadius + epsilon;
          const ballRight = nextX + ballRadius - epsilon;
          const ballTop = nextY - ballRadius + epsilon;
          const ballBottom = nextY + ballRadius - epsilon;

          if (wall.x1 === wall.x2) {
            // Vertical wall
            return ballLeft <= wall.x1 && ballRight >= wall.x1 &&
                   ballTop <= Math.max(wall.y1, wall.y2) && ballBottom >= Math.min(wall.y1, wall.y2);
          } else {
            // Horizontal wall
            return ballTop <= wall.y1 && ballBottom >= wall.y1 &&
                   ballLeft <= Math.max(wall.x1, wall.x2) && ballRight >= Math.min(wall.x1, wall.x2);
          }
        });
        
        if (wouldCollide) {
          return state; // Don't move if would collide
        }
        
        // Check checkpoint collisions
        const checkpoint = state.checkpoints.find(cp => !cp.isReached && 
          nextX > cp.x && nextX < cp.x + cp.width &&
          nextY > cp.y && nextY < cp.y + cp.height
        );

        if (checkpoint) {
          console.log('Checkpoint reached!', {
            checkpoint,
            ballPosition: { x: nextX, y: nextY },
            checkpointBounds: {
              x: checkpoint.x,
              y: checkpoint.y,
              width: checkpoint.width,
              height: checkpoint.height
            }
          });
          return {
            ...state,
            ballPosition: { x: nextX, y: nextY },
            showQuestionModal: true,
            currentCheckpoint: checkpoint.id,
            checkpointsReached: state.checkpointsReached + 1
          };
        }

        // Check exit collision - detect when ball hits the finish line
        const finishLineY = 890.71;
        const finishLineX1 = 1141.28;
        const finishLineX2 = 1200.39;
        
        if (nextY >= finishLineY - ballRadius && nextY <= finishLineY + ballRadius &&
            nextX >= finishLineX1 && nextX <= finishLineX2) {
          console.log('Game 3 completed! Ball hit finish line');
          return {
            ...state,
            ballPosition: { x: nextX, y: nextY },
            isComplete: true,
            score: state.score + 1
          };
        }
        
        // Move to next position
        return {
          ...state,
          ballPosition: { x: nextX, y: nextY }
        };
      });
    },

    answerQuestion: (answer: string) => {
      update(state => {
        const currentQuestion = state.questions[state.currentQuestionIndex];
        const isCorrect = currentQuestion.correctAnswer === answer;
        
        console.log('Processing Game 3 answer:', {
          answer,
          isCorrect,
          currentQuestion,
          currentIndex: state.currentQuestionIndex
        });
        
        let newState = { ...state };
        
        // Record the answer
        gameRecorderService.recordAnswer(currentQuestion, answer, isCorrect, 'maze');
        
        // Add the answer to our tracking array
        newState.answers = [
          ...state.answers,
          {
            question: currentQuestion.question,
            userAnswer: answer,
            correctAnswer: currentQuestion.correctAnswer,
            isCorrect,
            questionNumber: state.currentQuestionIndex + 1
          }
        ];
        
        // Add point for correct answer
        if (isCorrect) {
          newState.score += 1;
          newState.correctAnswersCount += 1;
        }

        // Move to next question or close modal
        if (state.currentQuestionIndex === 4) {
          // All 5 questions completed
          newState.showQuestionModal = false;
          newState.currentQuestionIndex = 0; // Reset for next checkpoint
          
          // Mark checkpoint as reached
          if (state.currentCheckpoint) {
            newState.checkpoints = state.checkpoints.map(cp => 
              cp.id === state.currentCheckpoint ? { ...cp, isReached: true } : cp
            );
          }
          newState.currentCheckpoint = null;
        } else {
          newState.currentQuestionIndex++;
        }

        console.log('Updated Game 3 state:', newState);
        return newState;
      });
    },

    reset: () => {
      update(state => {
        console.log('Resetting Game 3 state');
        gameRecorderService.reset();
        return {
          ...state,
          currentQuestionIndex: 0,
          score: 0,
          isComplete: false,
          ballPosition: { x: 20, y: 150 },
          checkpoints: state.checkpoints.map(cp => ({ ...cp, isReached: false })),
          showQuestionModal: false,
          currentCheckpoint: null,
          checkpointsReached: 0,
          correctAnswersCount: 0,
          answers: []
        };
      });
    }
  };
};

export const game3Store = createGame3Store(); 