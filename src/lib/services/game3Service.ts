import { client } from '$lib/sanity';
import { urlFor } from '$lib/sanity';
import type { Question } from '$lib/types/game3';

interface SanityQuestion {
  _id: string;
  question: string;
  image?: {
    asset: {
      _ref: string;
    };
  };
  imageAsset?: {
    _id: string;
    _type: string;
    url: string;
  };
  options: string[];
  correctAnswer: string;
}

export class Game3Service {
  private static instance: Game3Service;
  private questions: Question[] = [];
  private contentUrl?: string;

  private constructor() {}

  static getInstance = (): Game3Service => {
    if (!Game3Service.instance) {
      Game3Service.instance = new Game3Service();
    }
    return Game3Service.instance;
  };

  loadQuestions = async (): Promise<void> => {
    try {
      const query = `*[_type == "game3"] {
        _id,
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

      this.questions = sanityQuestions
        .map((q: SanityQuestion) => {
          try {
            return {
              id: parseInt(q._id.replace(/^[^0-9]*/, '')),
              question: q.question,
              image: q.imageAsset ? urlFor(q.imageAsset).url() : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDgwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNjAwIiBmaWxsPSIjRkY1QkFGIi8+Cjx0ZXh0IHg9IjQwMCIgeT0iMzAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNDgiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+TWF6ZSBDaGFsbGVuZ2U8L3RleHQ+Cjwvc3ZnPgo=',
              imageAlt: q.question,
              options: q.options,
              correctAnswer: q.correctAnswer
            };
          } catch (err) {
            console.warn(`Error processing question ${q._id}:`, err);
            return null;
          }
        })
        .filter(Boolean);

      if (!this.questions.length) {
        console.warn('Warning: No questions found for Game 3');
      }
    } catch (error) {
      console.error('Error loading questions:', error);
      throw new Error('Failed to load game questions');
    }
  };

  getQuestions = (): Question[] => {
    if (!this.questions.length) {
      throw new Error('No questions found for Game 3');
    }
    return this.questions;
  };

  getContentUrl = (): string => this.contentUrl ?? '#';
} 