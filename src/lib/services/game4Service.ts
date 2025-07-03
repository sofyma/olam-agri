import { client } from '$lib/sanity';
import type { Statement } from '$lib/types/game4';

export class Game4Service {
  private static instance: Game4Service;

  private constructor() {}

  public static getInstance(): Game4Service {
    if (!Game4Service.instance) {
      Game4Service.instance = new Game4Service();
    }
    return Game4Service.instance;
  }

  async getStatements(): Promise<Statement[]> {
    try {
      // First, let's see all game4 documents without filters
      const allQuery = `*[_type == "game4"] { _id, isActive, image, isTrue }`;
      const allResults = await client.fetch(allQuery);
      console.log('All game4 documents (without filters):', allResults);
      
      const query = `
        *[_type == "game4" && isActive == true] {
          _id,
          "image": image.asset->url,
          isTrue
        } | order(_createdAt desc)
      `;
      
      const results = await client.fetch(query);
      
      console.log('Raw results from Sanity (with isActive filter):', results);
      
      if (!results || results.length === 0) {
        throw new Error('No game4 statements found. Please add some statements in your Sanity Studio.');
      }

      // Convert to our Statement interface
      const statements = results.map((item: any) => ({
        id: item._id,
        image: item.image,
        isTrue: item.isTrue
      }));

      console.log('Converted statements:', statements);

      // Ensure we have exactly 5 statements for the game
      // If we have fewer than 5, repeat some statements to make 5 total
      const requiredStatements = 5;
      const finalStatements = [];
      
      for (let i = 0; i < requiredStatements; i++) {
        const statementIndex = i % statements.length;
        const originalStatement = statements[statementIndex];
        
        // Create a unique ID for repeated statements
        const uniqueId = i < statements.length 
          ? originalStatement.id 
          : `${originalStatement.id}_repeat_${i}`;
        
        finalStatements.push({
          ...originalStatement,
          id: uniqueId
        });
      }

      console.log('Final statements (5 total):', finalStatements);
      return finalStatements;
    } catch (error) {
      console.error('Error fetching game4 statements:', error);
      throw error;
    }
  }
} 