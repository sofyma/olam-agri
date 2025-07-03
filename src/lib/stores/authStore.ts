import { writable, get } from 'svelte/store';
import type { User } from '$lib/types/user';
import { AuthService } from '$lib/services/authService';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

const createAuthStore = () => {
  // Try to restore user from localStorage
  const savedUser = AuthService.getAuthCookie();
  const { subscribe, set, update } = writable<AuthState>({
    isAuthenticated: !!savedUser,
    user: savedUser,
    isLoading: false,
    error: null
  });

  return {
    subscribe,
    setUser: (user: User | null) => {
      set({ 
        isAuthenticated: !!user,
        user,
        isLoading: false,
        error: null
      });
    },
    setError: (error: string) => {
      set({ 
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error
      });
    },
    clearError: () => {
      update(state => ({ ...state, error: null }));
    },
    logout: () => {
      AuthService.logout();
      set({ 
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: null
      });
    },
    checkEmail: async (email: string): Promise<boolean> => {
      return await AuthService.checkEmail(email);
    },
    login: async (email: string): Promise<boolean> => {
      const user = await AuthService.login(email);
      if (user) {
        set({
          isAuthenticated: true,
          user,
          isLoading: false,
          error: null
        });
        return true;
      }
      return false;
    },
    register: async (userData: {
      displayName: string;
      emailAddress: string;
      country: string;
      region: string;
    }): Promise<void> => {
      const user = await AuthService.register(userData);
      set({
        isAuthenticated: true,
        user,
        isLoading: false,
        error: null
      });
    }
  };
};

export const authStore = createAuthStore();

export const getAuth = () => get(authStore); 