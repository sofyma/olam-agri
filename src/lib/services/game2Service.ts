import { client } from '$lib/sanity';
import type { Statement } from '$lib/types/game2';

interface SanityStatement {
  _id: string;
  title: string;
  image: {
    asset: {
      _ref: string;
    };
    hotspot?: {
      x: number;
      y: number;
      height: number;
      width: number;
    };
  };
  isTrue: boolean;
}

export class Game2Service {
  private static instance: Game2Service;
  private statements: Statement[] = [];

  private constructor() {}

  static getInstance = (): Game2Service => {
    if (!Game2Service.instance) {
      Game2Service.instance = new Game2Service();
    }
    return Game2Service.instance;
  };

  loadStatements = async (): Promise<void> => {
    try {
      const query = `*[_type == "game2"] {
        _id,
        title,
        image,
        isTrue
      } | order(_createdAt asc)`;

      const sanityStatements = await client.fetch(query);

      this.statements = sanityStatements.map((s: SanityStatement) => ({
        id: s._id,
        title: s.title,
        image: s.image,
        isTrue: s.isTrue
      }));

      if (!this.statements.length) {
        console.warn('Warning: No statements found for Game 2');
      }
    } catch (error) {
      console.error('Error loading statements:', error);
      throw new Error('Failed to load game statements');
    }
  };

  getStatements = (): Statement[] => {
    if (!this.statements.length) {
      throw new Error('No statements found for Game 2');
    }
    return this.statements;
  };

  getRandomStatements = (count: number = 10): Statement[] => {
    const shuffled = [...this.statements].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };
} 