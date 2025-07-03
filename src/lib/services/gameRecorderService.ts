import type { Question, GameAnswer } from '$lib/types/game1';
import type { Question as Game3Question, GameAnswer as Game3Answer } from '$lib/types/game3';

export class GameRecorderService {
  private static instance: GameRecorderService;
  private brandAnswers: GameAnswer[] = [];
  private placeAnswers: GameAnswer[] = [];
  private mazeAnswers: Game3Answer[] = [];
  private startTime: Date | null = null;

  private constructor() {}

  static getInstance(): GameRecorderService {
    if (!GameRecorderService.instance) {
      GameRecorderService.instance = new GameRecorderService();
    }
    return GameRecorderService.instance;
  }

  public start(): void {
    this.startTime = new Date();
    this.brandAnswers = [];
    this.placeAnswers = [];
    this.mazeAnswers = [];
  }

  public recordAnswer(question: Question | Game3Question, userAnswer: string, isCorrect: boolean, type: 'brands' | 'places' | 'maze'): void {
    const answerDetail: (GameAnswer | Game3Answer) & { _key: string } = {
      _key: `${type}_${question.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      questionId: question.id.toString(),
      question: question.imageAlt || '',
      image: question.image,
      correctAnswer: question.correctAnswer,
      userAnswer,
      isCorrect,
      answerTime: new Date()
    };

    if (type === 'brands') {
      this.brandAnswers.push(answerDetail as GameAnswer);
    } else if (type === 'places') {
      this.placeAnswers.push(answerDetail as GameAnswer);
    } else if (type === 'maze') {
      this.mazeAnswers.push(answerDetail as Game3Answer);
    }
  }

  public getAnswers(): { brandAnswers: GameAnswer[], placeAnswers: GameAnswer[], mazeAnswers: Game3Answer[], startTime: Date } {
    return {
      brandAnswers: this.brandAnswers,
      placeAnswers: this.placeAnswers,
      mazeAnswers: this.mazeAnswers,
      startTime: this.startTime || new Date()
    };
  }

  public reset(): void {
    this.startTime = null;
    this.brandAnswers = [];
    this.placeAnswers = [];
    this.mazeAnswers = [];
  }
} 