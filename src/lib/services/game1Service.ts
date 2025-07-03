import { client } from '$lib/sanity';
import { urlFor } from '$lib/sanity';
import type { Question } from '$lib/types/game1';

interface SanityQuestion {
  _id: string;
  type: 'brand' | 'place';
  question: string;
  image: {
    asset: {
      _ref: string;
    };
  };
  options: string[];
  correctAnswer: string;
}

export class Game1Service {
  private static instance: Game1Service;
  private questions = new Map<number, Question[]>();
  private contentUrl?: string;

  private constructor() {}

  static getInstance = (): Game1Service => {
    if (!Game1Service.instance) {
      Game1Service.instance = new Game1Service();
    }
    return Game1Service.instance;
  };

  loadQuestions = async (): Promise<void> => {
    try {
      const query = `*[_type == "game1"] {
        _id,
        type,
        question,
        "imageAsset": image.asset->{
          _id,
          _type,
          url
        },
        options,
        correctAnswer
      } | order(_createdAt asc)`;

      const sanityQuestions = await client.fetch(query);

      const groupedQuestions = sanityQuestions.reduce((acc, q) => {
        if (!q.imageAsset) {
          console.warn(`Question ${q._id} has no image, skipping...`);
          return acc;
        }

        try {
          const question: Question = {
            id: parseInt(q._id.replace(/^[^0-9]*/, '')),
            image: urlFor(q.imageAsset).url(),
            imageAlt: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer
          };

          if (q.type === 'brand') {
            acc.phase1.push(question);
          } else {
            acc.phase2.push(question);
          }
        } catch (err) {
          console.warn(`Error processing question ${q._id}:`, err);
        }

        return acc;
      }, { phase1: [] as Question[], phase2: [] as Question[] });

      this.questions.set(1, groupedQuestions.phase1);
      this.questions.set(2, groupedQuestions.phase2);

      if (!groupedQuestions.phase1.length || !groupedQuestions.phase2.length) {
        console.warn('Warning: Some phases have no questions', {
          phase1Count: groupedQuestions.phase1.length,
          phase2Count: groupedQuestions.phase2.length
        });
      }
    } catch (error) {
      console.error('Error loading questions:', error);
      throw new Error('Failed to load game questions');
    }
  };

  getQuestions = (phase: number): Question[] => {
    const questions = this.questions.get(phase);
    if (!questions?.length) {
      throw new Error(`No questions found for phase ${phase}`);
    }
    return questions;
  };

  getContentUrl = (): string => this.contentUrl ?? '#';
} 