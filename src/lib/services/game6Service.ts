import { client } from '$lib/sanity';
import type { Question } from '$lib/types/game6';

export class Game6Service {
  private static instance: Game6Service;

  private constructor() {}

  public static getInstance(): Game6Service {
    if (!Game6Service.instance) {
      Game6Service.instance = new Game6Service();
    }
    return Game6Service.instance;
  }

  async getQuestions(): Promise<Question[]> {
    try {
      // First, let's see all game6 documents without filters
      const allQuery = `*[_type == "game6"] { _id, isActive, question, optionA, optionB }`;
      const allResults = await client.fetch(allQuery);
      
      const query = `
        *[_type == "game6" && isActive == true] {
          _id,
          question,
          optionA,
          optionB
        } | order(_createdAt desc)
      `;
      
      const results = await client.fetch(query);
      
      if (!results || results.length === 0) {
        throw new Error('No game6 questions found. Please add some questions in your Sanity Studio.');
      }

      // Convert to our Question interface
      const questions = results.map((item: any) => ({
        id: item._id,
        question: item.question,
        optionA: item.optionA,
        optionB: item.optionB
      }));

      // Ensure we have between 5 to 10 questions for the game
      // If we have fewer than 5, repeat some questions to make 5 total
      // If we have more than 10, take only the first 10
      const minQuestions = 5;
      const maxQuestions = 10;
      const requiredQuestions = Math.min(Math.max(questions.length, minQuestions), maxQuestions);
      const finalQuestions = [];
      
      for (let i = 0; i < requiredQuestions; i++) {
        const questionIndex = i % questions.length;
        const originalQuestion = questions[questionIndex];
        
        // Create a unique ID for repeated questions
        const uniqueId = i < questions.length 
          ? originalQuestion.id 
          : `${originalQuestion.id}_repeat_${i}`;
        
        finalQuestions.push({
          ...originalQuestion,
          id: uniqueId
        });
      }

      return finalQuestions;
    } catch (error) {
      console.error('Error fetching game6 questions:', error);
      throw error;
    }
  }

  async getStartQuestion(): Promise<any> {
    try {
      const query = `
        *[_type == "game6" && isStartQuestion == true && isActive == true] {
          _id,
          questionId,
          questionText,
          answers[] {
            answerText,
            nextQuestion,
            isEndGame,
            endGameMessage
          },
          isStartQuestion,
          isActive,
          order
        } | order(order asc) [0]
      `;
      
      const result = await client.fetch(query);
      
      if (!result) {
        throw new Error('No start question found. Please mark a question as "Is Start Question" in your Sanity Studio.');
      }

      return result;
    } catch (error) {
      console.error('Error fetching start question:', error);
      throw error;
    }
  }

  async getQuestion(questionId: string): Promise<any> {
    try {
      const query = `
        *[_id == $questionId && isActive == true] {
          _id,
          questionId,
          questionText,
          answers[] {
            answerText,
            nextQuestion,
            isEndGame,
            endGameMessage
          },
          isStartQuestion,
          isActive,
          order
        } [0]
      `;
      
      const result = await client.fetch(query, { questionId });
      
      if (!result) {
        throw new Error(`Question with ID ${questionId} not found or not active.`);
      }

      return result;
    } catch (error) {
      console.error('Error fetching question:', error);
      throw error;
    }
  }
} 