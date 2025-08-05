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
      const allQuery = `*[_type == "game4"] { _id, title, isActive, image, isTrue }`;
      const allResults = await client.fetch(allQuery);
      console.log('All game4 documents (without filters):', allResults);
      
      const query = `
        *[_type == "game4" && isActive == true] {
          _id,
          title,
          "image": image.asset->url,
          isTrue,
          _updatedAt
        } | order(_updatedAt desc)
      `;
      
      const results = await client.fetch(query, {}, { cache: 'no-store' });
      
      console.log('Raw results from Sanity (with isActive filter):', results);
      
      if (!results || results.length === 0) {
        throw new Error('No game4 statements found. Please add some statements in your Sanity Studio.');
      }

      // Convert to our Statement interface
      const statements = results.map((item: any) => ({
        id: item._id,
        title: item.title,
        image: item.image,
        isTrue: item.isTrue
      }));

      console.log('Converted statements:', statements);

      // Use all available statements (up to a reasonable limit of 20)
      const maxStatements = 20;
      const availableStatements = statements.length;
      
      if (availableStatements === 0) {
        throw new Error('No active game4 statements found. Please add some statements in your Sanity Studio.');
      }
      
      // If we have fewer than 5 statements, repeat some to ensure minimum game length
      const minStatements = 5;
      const finalStatements = [];
      
      if (availableStatements < minStatements) {
        // Repeat statements to reach minimum
        for (let i = 0; i < minStatements; i++) {
          const statementIndex = i % availableStatements;
          const originalStatement = statements[statementIndex];
          
          // Create a unique ID for repeated statements
          const uniqueId = i < availableStatements 
            ? originalStatement.id 
            : `${originalStatement.id}_repeat_${i}`;
          
          finalStatements.push({
            ...originalStatement,
            id: uniqueId
          });
        }
      } else {
        // Use all available statements (up to max limit)
        const statementsToUse = Math.min(availableStatements, maxStatements);
        finalStatements.push(...statements.slice(0, statementsToUse));
      }

      console.log('Final statements (5 total):', finalStatements);
      return finalStatements;
    } catch (error) {
      console.error('Error fetching game4 statements:', error);
      throw error;
    }
  }
} 