import { writable, derived } from 'svelte/store';
import { GameAvailabilityService, type GameConfig } from '$lib/services/gameAvailabilityService';

export interface GameAvailabilityState {
  isLoading: boolean;
  gameConfigs: GameConfig[];
  availableGames: GameConfig[];
}

const createGameAvailabilityStore = () => {
  const { subscribe, set, update } = writable<GameAvailabilityState>({
    isLoading: true,
    gameConfigs: [],
    availableGames: []
  });

  const service = GameAvailabilityService.getInstance();

  return {
    subscribe,
    
    async loadGameConfigs() {
      update(state => ({ ...state, isLoading: true }));
      
      try {
        await service.loadGameConfigs();
        const allConfigs = service.getAllGameConfigs();
        const availableGames = service.getAvailableGames();
        
        set({
          isLoading: false,
          gameConfigs: allConfigs,
          availableGames
        });
      } catch (error) {
        console.error('Error loading game configs:', error);
        set({
          isLoading: false,
          gameConfigs: [],
          availableGames: []
        });
      }
    },

    isGameAvailable(gameId: 'game1' | 'game2' | 'game3' | 'game4' | 'game6'): boolean {
      return service.isGameAvailable(gameId);
    },

    getGameConfig(gameId: 'game1' | 'game2' | 'game3' | 'game4' | 'game6'): GameConfig | null {
      return service.getGameConfig(gameId);
    },

    getAvailableFromDate(gameId: 'game1' | 'game2' | 'game3' | 'game4' | 'game6'): Date | null {
      return service.getAvailableFromDate(gameId);
    },

    getTimeUntilAvailable(gameId: 'game1' | 'game2' | 'game3' | 'game4' | 'game6'): number | null {
      return service.getTimeUntilAvailable(gameId);
    },

    refreshAvailability() {
      update(state => {
        const availableGames = service.getAvailableGames();
        return { ...state, availableGames };
      });
    }
  };
};

export const gameAvailabilityStore = createGameAvailabilityStore();

// Derived stores for individual games
export const game1Availability = derived(
  gameAvailabilityStore,
  ($store) => {
    const service = GameAvailabilityService.getInstance();
    return {
      isAvailable: service.isGameAvailable('game1'),
      config: $store.gameConfigs.find(config => config.gameId === 'game1') || null
    };
  }
);

export const game2Availability = derived(
  gameAvailabilityStore,
  ($store) => {
    const service = GameAvailabilityService.getInstance();
    return {
      isAvailable: service.isGameAvailable('game2'),
      config: $store.gameConfigs.find(config => config.gameId === 'game2') || null
    };
  }
);

export const game3Availability = derived(
  gameAvailabilityStore,
  ($store) => {
    const service = GameAvailabilityService.getInstance();
    return {
      isAvailable: service.isGameAvailable('game3'),
      config: $store.gameConfigs.find(config => config.gameId === 'game3') || null
    };
  }
);

export const game4Availability = derived(
  gameAvailabilityStore,
  ($store) => {
    const service = GameAvailabilityService.getInstance();
    return {
      isAvailable: service.isGameAvailable('game4'),
      config: $store.gameConfigs.find(config => config.gameId === 'game4') || null
    };
  }
);

export const game6Availability = derived(
  gameAvailabilityStore,
  ($store) => {
    const service = GameAvailabilityService.getInstance();
    return {
      isAvailable: service.isGameAvailable('game6'),
      config: $store.gameConfigs.find(config => config.gameId === 'game6') || null
    };
  }
); 