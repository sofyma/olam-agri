import { client } from '$lib/sanity';

export interface GameConfig {
  _id: string;
  gameId: 'game1' | 'game2' | 'game3' | 'game4' | 'game5' | 'game6';
  isActive: boolean;
  lockedUntil?: string;
}

export class GameAvailabilityService {
  private static instance: GameAvailabilityService;
  private gameConfigs: Map<string, GameConfig> = new Map();

  private constructor() {}

  public static getInstance(): GameAvailabilityService {
    if (!GameAvailabilityService.instance) {
      GameAvailabilityService.instance = new GameAvailabilityService();
    }
    return GameAvailabilityService.instance;
  }

  public async loadGameConfigs(): Promise<void> {
    try {
      const query = `*[_type == "gameSchedule"] {
        _id,
        gameId,
        isActive,
        lockedUntil
      }`;
      
      const configs = await client.fetch(query);
      
      // Clear existing configs and load new ones
      this.gameConfigs.clear();
      configs.forEach((config: GameConfig) => {
        this.gameConfigs.set(config.gameId, config);
      });
      
      console.log('Game configs loaded:', configs);
    } catch (error) {
      console.error('Error loading game configs:', error);
    }
  }

  public isGameAvailable(gameId: 'game1' | 'game2' | 'game3' | 'game4' | 'game5' | 'game6'): boolean {
    const config = this.gameConfigs.get(gameId);
    
    if (!config) {
      console.warn(`No config found for game: ${gameId}`);
      return false;
    }

    // Check if game is active
    if (!config.isActive) {
      return false;
    }

    const now = new Date();
    
    // Check if current time is before lockedUntil (if set)
    if (config.lockedUntil) {
      const lockedUntil = new Date(config.lockedUntil);
      if (now < lockedUntil) {
        return false;
      }
    }

    return true;
  }

  public getGameConfig(gameId: 'game1' | 'game2' | 'game3' | 'game4' | 'game5' | 'game6'): GameConfig | null {
    return this.gameConfigs.get(gameId) || null;
  }

  public getLockedUntilDate(gameId: 'game1' | 'game2' | 'game3' | 'game4' | 'game5' | 'game6'): Date | null {
    const config = this.gameConfigs.get(gameId);
    return config?.lockedUntil ? new Date(config.lockedUntil) : null;
  }

  public getTimeUntilAvailable(gameId: 'game1' | 'game2' | 'game3' | 'game4' | 'game5' | 'game6'): number | null {
    const config = this.gameConfigs.get(gameId);
    if (!config) return null;

    const now = new Date();
    
    // If game is not active, return null (no countdown)
    if (!config.isActive) return null;
    
    // If lockedUntil is set and in the future, return time until unlock
    if (config.lockedUntil) {
      const lockedUntil = new Date(config.lockedUntil);
      const timeDiff = lockedUntil.getTime() - now.getTime();
      return timeDiff > 0 ? timeDiff : null;
    }
    
    return null;
  }

  public getAllGameConfigs(): GameConfig[] {
    return Array.from(this.gameConfigs.values());
  }

  public getAvailableGames(): GameConfig[] {
    return Array.from(this.gameConfigs.values()).filter(config => 
      this.isGameAvailable(config.gameId)
    );
  }
} 