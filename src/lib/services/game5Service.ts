export class Game5Service {
  private static instance: Game5Service;
  private readonly CORRECT_ANSWER = "We're Olam Agri";
  private readonly POINTS = 5;

  private constructor() {}

  static getInstance = (): Game5Service => {
    if (!Game5Service.instance) {
      Game5Service.instance = new Game5Service();
    }
    return Game5Service.instance;
  };

  validateAnswer = (answer: string): boolean => {
    return answer.trim() === this.CORRECT_ANSWER;
  };

  getCorrectAnswer = (): string => {
    return this.CORRECT_ANSWER;
  };

  getPoints = (): number => {
    return this.POINTS;
  };

  formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
} 