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
      console.log('All game6 documents (without filters):', allResults);
      
      const query = `
        *[_type == "game6" && isActive == true] {
          _id,
          question,
          optionA,
          optionB
        } | order(_createdAt desc)
      `;
      
      const results = await client.fetch(query);
      
      console.log('Raw results from Sanity (with isActive filter):', results);
      
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

      console.log('Converted questions:', questions);

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

      console.log('Final questions:', finalQuestions);
      return finalQuestions;
    } catch (error) {
      console.error('Error fetching game6 questions:', error);
      throw error;
    }
  }
} 