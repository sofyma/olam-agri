import { client } from '$lib/sanity';
import { urlFor } from '$lib/sanity';
import type { Question } from '$lib/types/game3';

interface SanityQuestion {
  _id: string;
  order: number;
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
        order,
        question,
        "imageAsset": image.asset->{
          _id,
          _type,
          url
        },
        options,
        correctAnswer
      } | order(order asc)`;

      const sanityQuestions = await client.fetch(query);

      console.log('Raw Sanity questions:', sanityQuestions);

      this.questions = sanityQuestions
        .map((q: SanityQuestion, index: number) => {
          try {
            // Use the order field if available, otherwise fall back to index + 1
            const orderValue = q.order || (index + 1);
            
            return {
              id: orderValue, // Use the order field as the ID
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
        .filter(Boolean)
        .sort((a: Question, b: Question) => a.id - b.id); // Sort by order value

      console.log('Processed questions:', this.questions);

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