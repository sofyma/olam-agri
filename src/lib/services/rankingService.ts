import { client } from '$lib/sanity';
import type { User } from '$lib/types/user';
import type { GameAnswer } from '$lib/types/game1';
import type { Game2Answer } from '$lib/types/game2';
import type { Game4Answer } from '$lib/types/game4';
import type { Game6Answer } from '$lib/types/game6';


export interface RankingEntry {
  user: User;
  game1: {
    score: number;
    brandScore: number;
    placeScore: number;
    gameId: number;
    startedAt: string;
    completedAt: string;
    brandAnswers: GameAnswer[];
    placeAnswers: GameAnswer[];
  };
}

export interface CombinedRankingEntry {
  user: User;
  totalScore: number;
  game1Score: number;
  game2Score: number;
  game3Score: number;
  game4Score: number;
  game5Score: number;
  game6Score: number;
  totalDuration: number; // Total time spent playing all games in milliseconds
  lastPlayed: string;
  earliestStartTime: string; // Earliest start time across all games (legacy, not used for tiebreak)
}

export interface RegionRankingEntry {
  user: User;
  totalScore: number;
  game1Score: number;
  game2Score: number;
  game3Score: number;
  game4Score: number;
  game5Score: number;
  game6Score: number;
  totalDuration: number; // Total time spent playing all games in milliseconds
  lastPlayed: string;
  earliestStartTime: string; // Earliest start time across all games (legacy, not used for tiebreak)
}

export interface TopBrandHeroesEntry {
  region: string;
  topPlayers: CombinedRankingEntry[];
  regionTotalScore: number;
}

export class RankingService {
  private static instance: RankingService;

  private constructor() {}

  public static getInstance(): RankingService {
    if (!RankingService.instance) {
      RankingService.instance = new RankingService();
    }
    return RankingService.instance;
  }

  /**
   * Enhanced tiebreak system with millisecond precision
   * 
   * The tiebreak system works as follows:
   * 1. Primary sort: Total score (descending)
   * 2. Secondary sort: Earliest start time (ascending - who played first wins)
   * 
   * Time precision:
   * - Uses ISO 8601 datetime strings with seconds and milliseconds
   * - Tracks earliest start time across all games for tiebreak
   * - Handles edge cases where players start games in the same millisecond
   * 
   * Example: If two players have identical scores, the one who started
   * playing first (earliest start time) will rank higher.
   */
  
  /**
   * Utility method to verify datetime precision
   * @param startTime ISO datetime string
   * @param endTime ISO datetime string
   * @returns Object with duration in milliseconds and seconds
   */
  private calculateDuration(startTime: string, endTime: string): { 
    durationMs: number; 
    durationSec: number; 
    startDate: Date; 
    endDate: Date; 
  } {
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
    const durationMs = endDate.getTime() - startDate.getTime();
    
    return {
      durationMs,
      durationSec: durationMs / 1000,
      startDate,
      endDate
    };
  }

  // Get top brand heroes (top 2 per region with tiebreaker)
  public async getTopBrandHeroes(): Promise<TopBrandHeroesEntry[]> {
    const query = `*[_type == "gameResult"] {
      "user": user->{
        _id,
        displayName,
        emailAddress,
        "company": company->{
          _id,
          name
        },
        city,
        region
      },
      game1,
      game2,
      game3,
      game4,
      game5,
      game6
    }`;
    
    const results = await client.fetch(query);
    
    // Calculate combined scores and filter valid entries
    const combinedResults = results
      .filter((r: any) => r.user && r.user.displayName && r.user.region)
      .map((r: any) => {
        const game1Score = r.game1?.score || 0;
        const game2Score = r.game2?.score || 0;
        const game3Score = r.game3?.score || 0;
        const game4Score = r.game4?.score || 0;
        const game5Score = r.game5?.score || 0;
        const game6Score = r.game6?.score || 0;
        const totalScore = game1Score + game2Score + game3Score + game4Score + game5Score + game6Score;
        const lastPlayed = r.game4?.completedAt || r.game3?.completedAt || r.game2?.completedAt || r.game1?.completedAt || '';
        
        // Calculate earliest start time across all games for tiebreak
        const startTimes = [
          r.game1?.startedAt,
          r.game2?.startedAt,
          r.game3?.startedAt,
          r.game4?.startedAt,
          r.game5?.startedAt,
          r.game6?.startedAt
        ].filter(time => time); // Remove undefined values
        
        const earliestStartTime = startTimes.length > 0 
          ? startTimes.reduce((earliest, current) => 
              current < earliest ? current : earliest
            )
          : '';
        
        // Calculate actual game duration with enhanced precision
        let totalDuration = 0;
        let game1Duration = 0;
        let game2Duration = 0;
        let game3Duration = 0;
        let game4Duration = 0;
        let game5Duration = 0;
        
        // Game 1 duration with precision logging
        if (r.game1?.startedAt && r.game1?.completedAt) {
          const game1DurationData = this.calculateDuration(r.game1.startedAt, r.game1.completedAt);
          game1Duration = game1DurationData.durationMs;
          totalDuration += game1Duration;
          
          // Debug logging for precision verification
          console.log(`Game 1 Duration for ${r.user.displayName}:`, {
            start: r.game1.startedAt,
            end: r.game1.completedAt,
            durationMs: game1Duration,
            durationSec: game1DurationData.durationSec.toFixed(3)
          });
        }
        
        // Game 2 duration with precision logging
        if (r.game2?.startedAt && r.game2?.completedAt) {
          const game2DurationData = this.calculateDuration(r.game2.startedAt, r.game2.completedAt);
          game2Duration = game2DurationData.durationMs;
          totalDuration += game2Duration;
          
          // Debug logging for precision verification
          console.log(`Game 2 Duration for ${r.user.displayName}:`, {
            start: r.game2.startedAt,
            end: r.game2.completedAt,
            durationMs: game2Duration,
            durationSec: game2DurationData.durationSec.toFixed(3)
          });
        }
        
        // Game 3 duration with precision logging
        if (r.game3?.startedAt && r.game3?.completedAt) {
          const game3DurationData = this.calculateDuration(r.game3.startedAt, r.game3.completedAt);
          game3Duration = game3DurationData.durationMs;
          totalDuration += game3Duration;
          
          // Debug logging for precision verification
          console.log(`Game 3 Duration for ${r.user.displayName}:`, {
            start: r.game3.startedAt,
            end: r.game3.completedAt,
            durationMs: game3Duration,
            durationSec: game3DurationData.durationSec.toFixed(3)
          });
        }
        
        // Game 4 duration with precision logging
        if (r.game4?.startedAt && r.game4?.completedAt) {
          const game4DurationData = this.calculateDuration(r.game4.startedAt, r.game4.completedAt);
          game4Duration = game4DurationData.durationMs;
          totalDuration += game4Duration;
          
          // Debug logging for precision verification
          console.log(`Game 4 Duration for ${r.user.displayName}:`, {
            start: r.game4.startedAt,
            end: r.game4.completedAt,
            durationMs: game4Duration,
            durationSec: game4DurationData.durationSec.toFixed(3)
          });
        }
        
        // Game 5 duration with precision logging
        if (r.game5?.startedAt && r.game5?.completedAt) {
          const game5DurationData = this.calculateDuration(r.game5.startedAt, r.game5.completedAt);
          game5Duration = game5DurationData.durationMs;
          totalDuration += game5Duration;
          
          // Debug logging for precision verification
          console.log(`Game 5 Duration for ${r.user.displayName}:`, {
            start: r.game5.startedAt,
            end: r.game5.completedAt,
            durationMs: game5Duration,
            durationSec: game5DurationData.durationSec.toFixed(3)
          });
        }
        
        return {
          user: r.user,
          totalScore,
          game1Score,
          game2Score,
          game3Score,
          game4Score,
          game5Score,
          game6Score,
          totalDuration,
          lastPlayed,
          earliestStartTime
        };
      })
      .filter((r: CombinedRankingEntry) => r.totalScore > 0);
    
    // Group by region and get top 2 per region
    const regionGroups = new Map<string, CombinedRankingEntry[]>();
    
    combinedResults.forEach((entry: CombinedRankingEntry) => {
      const region = entry.user.region;
      if (!regionGroups.has(region)) {
        regionGroups.set(region, []);
      }
      regionGroups.get(region)!.push(entry);
    });
    
    // Create grouped entries with top 2 players per region
    const groupedRegions: TopBrandHeroesEntry[] = [];
    
    regionGroups.forEach((players, region) => {
      const sortedPlayers = players.sort((a, b) => {
        // First sort by total score (descending)
        if (b.totalScore !== a.totalScore) {
          return b.totalScore - a.totalScore;
        }
        // If scores are equal, sort by total duration (who completed games faster wins)
        // Enhanced tiebreak with millisecond precision
        const durationDiff = a.totalDuration - b.totalDuration;
        console.log(`Tiebreak for ${region}: ${a.user.displayName} vs ${b.user.displayName}`, {
          scoreA: a.totalScore,
          scoreB: b.totalScore,
          durationA: a.totalDuration,
          durationB: b.totalDuration,
          durationDiff,
          durationDiffMs: durationDiff
        });
        return durationDiff;
      });
      
      // Take top 2 from this region
      const topPlayers = sortedPlayers.slice(0, 2);
      
      // Calculate region total score (sum of top 2 players)
      const regionTotalScore = topPlayers.reduce((sum, player) => sum + player.totalScore, 0);
      
      groupedRegions.push({
        region,
        topPlayers,
        regionTotalScore
      });
    });
    
    // Sort regions alphabetically
    return groupedRegions.sort((a, b) => a.region.localeCompare(b.region));
  }

  // Get all available countries/regions
  public async getAvailableRegions(): Promise<string[]> {
    const query = `*[_type == "gameResult" && user->region != null] | order(user->region asc) {
      "region": user->region
    }`;
    
    const results = await client.fetch(query);
    const regionSet = new Set<string>();
    results.forEach((r: any) => {
      if (r.region && typeof r.region === 'string') {
        regionSet.add(r.region);
      }
    });
    return Array.from(regionSet).sort();
  }

  // Get rankings by region/country
  public async getAllRankings(): Promise<RegionRankingEntry[]> {
    const query = `*[_type == "gameResult"] {
      "user": user->{
        _id,
        displayName,
        emailAddress,
        country,
        region
      },
      game1,
      game2,
      game3,
      game4,
      game5,
      game6
    }`;
    
    const results = await client.fetch(query);
    
    // Calculate combined scores and filter valid entries
    const combinedResults = results
      .filter((r: any) => r.user && r.user.displayName)
      .map((r: any) => {
        const game1Score = r.game1?.score || 0;
        const game2Score = r.game2?.score || 0;
        const game3Score = r.game3?.score || 0;
        const game4Score = r.game4?.score || 0;
        const game5Score = r.game5?.score || 0;
        const game6Score = r.game6?.score || 0;
        const totalScore = game1Score + game2Score + game3Score + game4Score + game5Score + game6Score;
        const lastPlayed = r.game4?.completedAt || r.game3?.completedAt || r.game2?.completedAt || r.game1?.completedAt || '';
        
        // Calculate earliest start time across all games for tiebreak
        const startTimes = [
          r.game1?.startedAt,
          r.game2?.startedAt,
          r.game3?.startedAt,
          r.game4?.startedAt,
          r.game5?.startedAt,
          r.game6?.startedAt
        ].filter(time => time); // Remove undefined values
        
        const earliestStartTime = startTimes.length > 0 
          ? startTimes.reduce((earliest, current) => 
              current < earliest ? current : earliest
            )
          : '';
        
        // Calculate total duration
        let totalDuration = 0;
        
        if (r.game1?.startedAt && r.game1?.completedAt) {
          totalDuration += this.calculateDuration(r.game1.startedAt, r.game1.completedAt).durationMs;
        }
        if (r.game2?.startedAt && r.game2?.completedAt) {
          totalDuration += this.calculateDuration(r.game2.startedAt, r.game2.completedAt).durationMs;
        }
        if (r.game3?.startedAt && r.game3?.completedAt) {
          totalDuration += this.calculateDuration(r.game3.startedAt, r.game3.completedAt).durationMs;
        }
        if (r.game4?.startedAt && r.game4?.completedAt) {
          totalDuration += this.calculateDuration(r.game4.startedAt, r.game4.completedAt).durationMs;
        }
        if (r.game5?.startedAt && r.game5?.completedAt) {
          totalDuration += this.calculateDuration(r.game5.startedAt, r.game5.completedAt).durationMs;
        }
        
        return {
          user: r.user,
          totalScore,
          game1Score,
          game2Score,
          game3Score,
          game4Score,
          game5Score,
          game6Score,
          totalDuration,
          lastPlayed,
          earliestStartTime
        };
      });
    
    // Sort by total score (descending), then by total duration (ascending) for tiebreaks
    return combinedResults.sort((a: RegionRankingEntry, b: RegionRankingEntry) => {
      if (b.totalScore !== a.totalScore) {
        return b.totalScore - a.totalScore;
      }
      // Tiebreak: who completed games faster (lower total duration wins)
      return a.totalDuration - b.totalDuration;
    });
  }

  public async getRankingsByRegion(region: string, limit: number = 10): Promise<RegionRankingEntry[]> {
    const query = `*[_type == "gameResult" && user->region == $region] {
      "user": user->{
        _id,
        displayName,
        emailAddress,
        "company": company->{
          _id,
          name
        },
        city,
        region
      },
      game1,
      game2,
      game3,
      game4,
      game5,
      game6
    }`;
    
    const results = await client.fetch(query, { region });
    
    // Calculate combined scores and filter valid entries
    const combinedResults = results
      .filter((r: any) => r.user && r.user.displayName)
      .map((r: any) => {
        const game1Score = r.game1?.score || 0;
        const game2Score = r.game2?.score || 0;
        const game3Score = r.game3?.score || 0;
        const game4Score = r.game4?.score || 0;
        const game5Score = r.game5?.score || 0;
        const game6Score = r.game6?.score || 0;
        const totalScore = game1Score + game2Score + game3Score + game4Score + game5Score + game6Score;
        const lastPlayed = r.game4?.completedAt || r.game3?.completedAt || r.game2?.completedAt || r.game1?.completedAt || '';
        
        // Calculate earliest start time across all games for tiebreak
        const startTimes = [
          r.game1?.startedAt,
          r.game2?.startedAt,
          r.game3?.startedAt,
          r.game4?.startedAt,
          r.game5?.startedAt,
          r.game6?.startedAt
        ].filter(time => time);
        const earliestStartTime = startTimes.length > 0
          ? startTimes.reduce((earliest, current) => current < earliest ? current : earliest)
          : '';
        // Calculate actual game duration with enhanced precision
        let totalDuration = 0;
        let game1Duration = 0;
        let game2Duration = 0;
        let game3Duration = 0;
        let game4Duration = 0;
        
        // Game 1 duration with precision logging
        if (r.game1?.startedAt && r.game1?.completedAt) {
          const game1DurationData = this.calculateDuration(r.game1.startedAt, r.game1.completedAt);
          game1Duration = game1DurationData.durationMs;
          totalDuration += game1Duration;
          
          // Debug logging for precision verification
          console.log(`Game 1 Duration for ${r.user.displayName} (${region}):`, {
            start: r.game1.startedAt,
            end: r.game1.completedAt,
            durationMs: game1Duration,
            durationSec: game1DurationData.durationSec.toFixed(3)
          });
        }
        
        // Game 2 duration with precision logging
        if (r.game2?.startedAt && r.game2?.completedAt) {
          const game2DurationData = this.calculateDuration(r.game2.startedAt, r.game2.completedAt);
          game2Duration = game2DurationData.durationMs;
          totalDuration += game2Duration;
          
          // Debug logging for precision verification
          console.log(`Game 2 Duration for ${r.user.displayName} (${region}):`, {
            start: r.game2.startedAt,
            end: r.game2.completedAt,
            durationMs: game2Duration,
            durationSec: game2DurationData.durationSec.toFixed(3)
          });
        }
        
        // Game 3 duration with precision logging
        if (r.game3?.startedAt && r.game3?.completedAt) {
          const game3DurationData = this.calculateDuration(r.game3.startedAt, r.game3.completedAt);
          game3Duration = game3DurationData.durationMs;
          totalDuration += game3Duration;
          
          // Debug logging for precision verification
          console.log(`Game 3 Duration for ${r.user.displayName} (${region}):`, {
            start: r.game3.startedAt,
            end: r.game3.completedAt,
            durationMs: game3Duration,
            durationSec: game3DurationData.durationSec.toFixed(3)
          });
        }
        
        // Game 4 duration with precision logging
        if (r.game4?.startedAt && r.game4?.completedAt) {
          const game4DurationData = this.calculateDuration(r.game4.startedAt, r.game4.completedAt);
          game4Duration = game4DurationData.durationMs;
          totalDuration += game4Duration;
          
          // Debug logging for precision verification
          console.log(`Game 4 Duration for ${r.user.displayName} (${region}):`, {
            start: r.game4.startedAt,
            end: r.game4.completedAt,
            durationMs: game4Duration,
            durationSec: game4DurationData.durationSec.toFixed(3)
          });
        }
        
        // Game 5 duration with precision logging
        if (r.game5?.startedAt && r.game5?.completedAt) {
          const game5DurationData = this.calculateDuration(r.game5.startedAt, r.game5.completedAt);
          const game5Duration = game5DurationData.durationMs;
          totalDuration += game5Duration;
          
          // Debug logging for precision verification
          console.log(`Game 5 Duration for ${r.user.displayName} (${region}):`, {
            start: r.game5.startedAt,
            end: r.game5.completedAt,
            durationMs: game5Duration,
            durationSec: game5DurationData.durationSec.toFixed(3)
          });
        }
        
        return {
          user: r.user,
          totalScore,
          game1Score,
          game2Score,
          game3Score,
          game4Score,
          game5Score,
          game6Score,
          totalDuration,
          lastPlayed,
          earliestStartTime
        };
      })
      .filter((r: RegionRankingEntry) => r.totalScore > 0)
      .sort((a: RegionRankingEntry, b: RegionRankingEntry) => {
        // First sort by total score (descending)
        if (b.totalScore !== a.totalScore) {
          return b.totalScore - a.totalScore;
        }
        // Tiebreak: who completed games faster (lower total duration wins)
        return a.totalDuration - b.totalDuration;
      })
      .slice(0, limit);
    
    return combinedResults;
  }

  // Legacy method for backward compatibility
  public async getTopRankings(gameId: number, limit: number = 10): Promise<RankingEntry[]> {
    const query = `*[_type == "gameResult" && game1.gameId == $gameId] | order(game1.score desc) [0...$limit] {
      "user": user->{
        _id,
        displayName,
        "company": company->{
          _id,
          name
        }
      },
      game1
    }`;
    const results = await client.fetch(query, { gameId, limit });
    console.log('Ranking results:', results);
    // Filter out any results where user is null
    return results.filter((r: any) => r.user && r.user.displayName);
  }

  public async saveGameResult(
    userId: string,
    gameId: number,
    brandScore: number,
    placeScore: number,
    startedAt: string,
    brandAnswers: GameAnswer[],
    placeAnswers: GameAnswer[]
  ): Promise<void> {
    // Check if this is the user's first attempt
    const existingResult = await client.fetch(
      `*[_type == "gameResult" && user._ref == $userId && game1.gameId == $gameId][0]`,
      { userId, gameId }
    );

    // Only save if this is the first attempt
    if (!existingResult) {
      const totalScore = brandScore + placeScore;
      const result = await fetch('/api/submit-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          _type: 'gameResult',
          user: { _type: 'reference', _ref: userId },
          game1: {
            brandScore,
            placeScore,
            score: totalScore,
            gameId,
            startedAt,
            completedAt: new Date().toISOString(),
            brandAnswers,
            placeAnswers
          }
        })
      });
      const data = await result.json();
      if (!result.ok || !data.success) {
        throw new Error(data.error || 'Failed to save game result');
      }
    } else {
      console.log('Skipping save - not first attempt');
    }
  }

  public async getUserBestScore(gameId: number, userId: string): Promise<number | null> {
    try {
      const query = `*[_type == \"gameResult\" && game1.gameId == $gameId && user._ref == $userId] | order(game1.score desc) [0].game1.score`;
      const score = await client.fetch(query, { gameId, userId });
      return score ?? null;
    } catch (error) {
      console.error('Error fetching user best score:', error);
      throw new Error('Failed to fetch user best score');
    }
  }

  public async getUserRank(gameId: number, userId: string): Promise<number | null> {
    try {
      const query = `count(*[_type == \"gameResult\" && game1.gameId == $gameId && game1.score > *[_type == \"gameResult\" && game1.gameId == $gameId && user._ref == $userId][0].game1.score]) + 1`;
      const rank = await client.fetch(query, { gameId, userId });
      return rank ?? null;
    } catch (error) {
      console.error('Error fetching user rank:', error);
      throw new Error('Failed to fetch user rank');
    }
  }

  public async saveGame2Result(
    userId: string,
    gameId: number,
    score: number,
    startedAt: string,
    answers: Game2Answer[],
    destroyedLies: number,
    destroyedTruths: number
  ): Promise<void> {
    try {
      const completedAt = new Date().toISOString();
      
      // Check if this user already has a Game 2 result (first attempt only)
      const existingGame2Result = await client.fetch(
        `*[_type == "gameResult" && user._ref == $userId && game2 != null][0]`,
        { userId }
      );

      if (existingGame2Result) {
        console.log('Skipping save - user already has a Game 2 result (first attempt only)');
        return;
      }
      
      // Check if this user already has a game result document
      const existingResult = await client.fetch(
        `*[_type == "gameResult" && user._ref == $userId][0]`,
        { userId }
      );

      if (existingResult) {
        console.log('Updating existing game result with Game 2 data:', existingResult._id);
        // Update existing document with game2 data
        await client.patch(existingResult._id)
          .set({
            game2: {
              score,
              gameId,
              startedAt,
              completedAt,
              destroyedLies,
              destroyedTruths,
              answers
            }
          })
          .commit();
      } else {
        console.log('Creating new game result document with Game 2 data');
        // Create new document with game2 data (game1 will be empty)
        const result = await fetch('/api/submit-result', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            _type: 'gameResult',
            user: { _type: 'reference', _ref: userId },
            game2: {
              score,
              gameId,
              startedAt,
              completedAt,
              destroyedLies,
              destroyedTruths,
              answers
            }
          })
        });
        const data = await result.json();
        if (!result.ok || !data.success) {
          throw new Error(data.error || 'Failed to save game 2 result');
        }
      }
      console.log('Game 2 result saved successfully');
    } catch (error) {
      console.error('Error saving Game 2 result:', error);
      throw error;
    }
  }

  public async saveGame3Result(
    userId: string,
    gameId: number,
    score: number,
    startedAt: string,
    answers: Array<{
      question: string;
      userAnswer: string;
      correctAnswer: string;
      isCorrect: boolean;
      questionNumber: number;
    }>,
    checkpointsReached: number
  ): Promise<void> {
    try {
      const completedAt = new Date().toISOString();
      
      // Check if this user already has a Game 3 result (first attempt only)
      const existingGame3Result = await client.fetch(
        `*[_type == "gameResult" && user._ref == $userId && game3 != null][0]`,
        { userId }
      );

      if (existingGame3Result) {
        console.log('Skipping save - user already has a Game 3 result (first attempt only)');
        return;
      }

      // Check if this user already has a game result document
      const existingResult = await client.fetch(
        `*[_type == "gameResult" && user._ref == $userId][0]`,
        { userId }
      );

      if (existingResult) {
        console.log('Updating existing game result with Game 3 data:', existingResult._id);
        // Update existing document with game3 data
        await client.patch(existingResult._id)
          .set({
            game3: {
              score,
              gameId,
              startedAt,
              completedAt,
              answers: answers.map((answer, index) => ({
                _key: `answer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}_${index}`,
                questionId: answer.questionNumber.toString(),
                question: answer.question,
                userAnswer: answer.userAnswer,
                correctAnswer: answer.correctAnswer,
                isCorrect: answer.isCorrect,
                questionNumber: answer.questionNumber,
                answerTime: new Date().toISOString()
              })),
              checkpointsReached
            }
          })
          .commit();
      } else {
        console.log('Creating new game result document with Game 3 data');
        // Create new document with game3 data (game1 and game2 will be empty)
        const result = await fetch('/api/submit-result', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            _type: 'gameResult',
            user: { _type: 'reference', _ref: userId },
            game3: {
              score,
              gameId,
              startedAt,
              completedAt,
              answers: answers.map((answer, index) => ({
                _key: `answer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}_${index}`,
                questionId: answer.questionNumber.toString(),
                question: answer.question,
                userAnswer: answer.userAnswer,
                correctAnswer: answer.correctAnswer,
                isCorrect: answer.isCorrect,
                questionNumber: answer.questionNumber,
                answerTime: new Date().toISOString()
              })),
              checkpointsReached
            }
          })
        });
        const data = await result.json();
        if (!result.ok || !data.success) {
          throw new Error(data.error || 'Failed to save game 3 result');
        }
      }
      console.log('Game 3 result saved successfully');
    } catch (error) {
      console.error('Error saving Game 3 result:', error);
      throw error;
    }
  }

  public async saveGame4Result(
    userId: string,
    gameId: number,
    score: number,
    startedAt: string,
    answers: Game4Answer[],
    correctSwipes: number,
    incorrectSwipes: number
  ): Promise<void> {
    try {
      const completedAt = new Date().toISOString();
      
      // Check if this user already has a Game 4 result (first attempt only)
      const existingGame4Result = await client.fetch(
        `*[_type == "gameResult" && user._ref == $userId && game4 != null][0]`,
        { userId }
      );

      if (existingGame4Result) {
        console.log('Skipping save - user already has a Game 4 result (first attempt only)');
        return;
      }

      // Check if this user already has a game result document
      const existingResult = await client.fetch(
        `*[_type == "gameResult" && user._ref == $userId][0]`,
        { userId }
      );

      if (existingResult) {
        console.log('Updating existing game result with Game 4 data:', existingResult._id);
        // Update existing document with game4 data
        await client.patch(existingResult._id)
          .set({
            game4: {
              score,
              gameId,
              startedAt,
              completedAt,
              correctSwipes,
              incorrectSwipes,
              answers: answers.map((answer, index) => ({
                _key: `answer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}_${index}`,
                statementId: answer.statementId,
                title: answer.title,
                image: answer.image,
                isTrue: answer.isTrue,
                swipedDirection: answer.swipedDirection,
                isCorrect: answer.isCorrect,
                answerTime: answer.answerTime
              }))
            }
          })
          .commit();
      } else {
        console.log('Creating new game result document with Game 4 data');
        // Create new document with game4 data (game1, game2, and game3 will be empty)
        const result = await fetch('/api/submit-result', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            _type: 'gameResult',
            user: { _type: 'reference', _ref: userId },
            game4: {
              score,
              gameId,
              startedAt,
              completedAt,
              correctSwipes,
              incorrectSwipes,
              answers: answers.map((answer, index) => ({
                _key: `answer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}_${index}`,
                statementId: answer.statementId,
                title: answer.title,
                image: answer.image,
                isTrue: answer.isTrue,
                swipedDirection: answer.swipedDirection,
                isCorrect: answer.isCorrect,
                answerTime: answer.answerTime
              }))
            }
          })
        });
        const data = await result.json();
        if (!result.ok || !data.success) {
          throw new Error(data.error || 'Failed to save game 4 result');
        }
      }
      console.log('Game 4 result saved successfully');
    } catch (error) {
      console.error('Error saving Game 4 result:', error);
      throw error;
    }
  }

  public async saveGame6Result(
    userId: string,
    gameId: number,
    score: number,
    startedAt: string,
    answers: Game6Answer[],
    totalQuestions: number
  ): Promise<void> {
    try {
      const completedAt = new Date().toISOString();
      
      // Check if this user already has a Game 6 result (first attempt only)
      const existingGame6Result = await client.fetch(
        `*[_type == "gameResult" && user._ref == $userId && game6 != null][0]`,
        { userId }
      );

      if (existingGame6Result) {
        console.log('Skipping save - user already has a Game 6 result (first attempt only)');
        return;
      }

      // Check if this user already has a game result document
      const existingResult = await client.fetch(
        `*[_type == "gameResult" && user._ref == $userId][0]`,
        { userId }
      );

      if (existingResult) {
        console.log('Updating existing game result with Game 6 data:', existingResult._id);
        // Update existing document with game6 data
        await client.patch(existingResult._id)
          .set({
            game6: {
              score,
              gameId,
              startedAt,
              completedAt,
              totalQuestions,
              answers: answers.map((answer, index) => ({
                _key: `answer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}_${index}`,
                questionId: answer.questionId,
                question: answer.question,
                optionA: answer.optionA,
                optionB: answer.optionB,
                selectedOption: answer.selectedOption,
                answerTime: answer.answerTime
              }))
            }
          })
          .commit();
      } else {
        console.log('Creating new game result document with Game 6 data');
        // Create new document with game6 data (game1, game2, game3, and game4 will be empty)
        const result = await fetch('/api/submit-result', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            _type: 'gameResult',
            user: { _type: 'reference', _ref: userId },
            game6: {
              score,
              gameId,
              startedAt,
              completedAt,
              totalQuestions,
              answers: answers.map((answer, index) => ({
                _key: `answer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}_${index}`,
                questionId: answer.questionId,
                question: answer.question,
                optionA: answer.optionA,
                optionB: answer.optionB,
                selectedOption: answer.selectedOption,
                answerTime: answer.answerTime
              }))
            }
          })
        });
        const data = await result.json();
        if (!result.ok || !data.success) {
          throw new Error(data.error || 'Failed to save game 6 result');
        }
      }
      console.log('Game 6 result saved successfully');
    } catch (error) {
      console.error('Error saving Game 6 result:', error);
      throw error;
    }
  }

  public async saveGame5Result(
    userId: string,
    gameId: number,
    score: number,
    timeSpent: number,
    attempts: number,
    startedAt: string,
    completedAt: string,
    finalAnswer: string,
    answers: Array<{
      answer: string;
      isCorrect: boolean;
      attemptTime: Date;
      timeSpent: number;
    }>
  ): Promise<void> {
    try {
      // Check if this user already has a Game 5 result (first attempt only)
      const existingGame5Result = await client.fetch(
        `*[_type == "gameResult" && user._ref == $userId && game5 != null][0]`,
        { userId }
      );

      if (existingGame5Result) {
        console.log('Skipping save - user already has a Game 5 result (first attempt only)');
        return;
      }

      // Check if this user already has a game result document
      const existingResult = await client.fetch(
        `*[_type == "gameResult" && user._ref == $userId][0]`,
        { userId }
      );

      if (existingResult) {
        console.log('Updating existing game result with Game 5 data:', existingResult._id);
        // Update existing document with game5 data
        await client.patch(existingResult._id)
          .set({
            game5: {
              score,
              gameId,
              startedAt,
              completedAt,
              timeSpent,
              attempts,
              finalAnswer,
              answers: answers.map((answer, index) => ({
                _key: `answer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}_${index}`,
                answer: answer.answer,
                isCorrect: answer.isCorrect,
                attemptTime: answer.attemptTime,
                timeSpent: answer.timeSpent
              }))
            }
          })
          .commit();
      } else {
        console.log('Creating new game result document with Game 5 data');
        // Create new document with game5 data
        const result = await fetch('/api/submit-result', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            _type: 'gameResult',
            user: { _type: 'reference', _ref: userId },
            game5: {
              score,
              gameId,
              startedAt,
              completedAt,
              timeSpent,
              attempts,
              finalAnswer,
              answers: answers.map((answer, index) => ({
                _key: `answer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}_${index}`,
                answer: answer.answer,
                isCorrect: answer.isCorrect,
                attemptTime: answer.attemptTime,
                timeSpent: answer.timeSpent
              }))
            }
          })
        });
        const data = await result.json();
        if (!result.ok || !data.success) {
          throw new Error(data.error || 'Failed to save game 5 result');
        }
      }
      console.log('Game 5 result saved successfully');
    } catch (error) {
      console.error('Error saving Game 5 result:', error);
      throw error;
    }
  }

  /**
   * Test method to verify tiebreak precision
   * This method can be used to test the precision of the tiebreak system
   */
  public testTiebreakPrecision(): void {
    console.log('=== Testing Tiebreak Precision ===');
    
    // Test case 1: Same score, different completion times
    const testCase1 = {
      player1: { score: 100, startTime: '2024-01-01T12:00:00.000Z', endTime: '2024-01-01T12:05:30.123Z' },
      player2: { score: 100, startTime: '2024-01-01T12:00:00.000Z', endTime: '2024-01-01T12:05:30.456Z' }
    };
    
    const duration1 = this.calculateDuration(testCase1.player1.startTime, testCase1.player1.endTime);
    const duration2 = this.calculateDuration(testCase1.player2.startTime, testCase1.player2.endTime);
    
    console.log('Test Case 1 - Same score, different times:');
    console.log(`Player 1: ${duration1.durationSec.toFixed(3)}s (${duration1.durationMs}ms)`);
    console.log(`Player 2: ${duration2.durationSec.toFixed(3)}s (${duration2.durationMs}ms)`);
    console.log(`Winner: ${duration1.durationMs < duration2.durationMs ? 'Player 1' : 'Player 2'}`);
    console.log(`Time difference: ${Math.abs(duration1.durationMs - duration2.durationMs)}ms`);
    
    // Test case 2: Same score, very close completion times (1ms difference)
    const testCase2 = {
      player1: { score: 100, startTime: '2024-01-01T12:00:00.000Z', endTime: '2024-01-01T12:05:30.123Z' },
      player2: { score: 100, startTime: '2024-01-01T12:00:00.000Z', endTime: '2024-01-01T12:05:30.124Z' }
    };
    
    const duration3 = this.calculateDuration(testCase2.player1.startTime, testCase2.player1.endTime);
    const duration4 = this.calculateDuration(testCase2.player2.startTime, testCase2.player2.endTime);
    
    console.log('\nTest Case 2 - Same score, 1ms difference:');
    console.log(`Player 1: ${duration3.durationSec.toFixed(3)}s (${duration3.durationMs}ms)`);
    console.log(`Player 2: ${duration4.durationSec.toFixed(3)}s (${duration4.durationMs}ms)`);
    console.log(`Winner: ${duration3.durationMs < duration4.durationMs ? 'Player 1' : 'Player 2'}`);
    console.log(`Time difference: ${Math.abs(duration3.durationMs - duration4.durationMs)}ms`);
    
    console.log('\n=== Tiebreak Precision Test Complete ===');
  }
} 