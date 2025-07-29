import { client } from '$lib/sanity';
import type { User } from '$lib/types/user';

const AUTH_COOKIE_NAME = 'olam_auth';

export class AuthService {
  static async checkEmail(email: string): Promise<boolean> {
    const query = `*[_type == "user" && emailAddress == $email][0]`;
    const user = await client.fetch(query, { email });
    return !!user;
  }

  static async login(email: string): Promise<User | null> {
    const query = `*[_type == "user" && emailAddress == $email][0]`;
    const user = await client.fetch(query, { email });
    
    if (user) {
      this.setAuthCookie(user);
      return user;
    }
    return null;
  }

  static async register(userData: {
    displayName: string;
    emailAddress: string;
    country: string;
    region: string;
  }): Promise<User> {
    console.log('AuthService: Starting registration with data:', userData);
    console.log('AuthService: Making API call to /api/register-user');
    
    // Create new user document via API route
    const response = await fetch('/api/register-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    
    console.log('AuthService: Response status:', response.status);
    console.log('AuthService: Response headers:', Object.fromEntries(response.headers.entries()));
    
    const result = await response.json();
    console.log('AuthService: Response data:', result);
    
    if (!response.ok || !result.success) {
      console.error('AuthService: Registration failed:', result.error);
      throw new Error(result.error || 'Failed to create user');
    }
    
    console.log('AuthService: Registration successful, user created:', result.result);
    const user = result.result;
    const fullUser = await this.login(user.emailAddress);
    if (!fullUser) {
      throw new Error('Failed to create user');
    }
    return fullUser;
  }



  static isAuthenticated(): boolean {
    return !!this.getAuthCookie();
  }

  static logout(): void {
    localStorage.removeItem(AUTH_COOKIE_NAME);
  }

  static clearOldAuthData(): void {
    localStorage.removeItem(AUTH_COOKIE_NAME);
  }

  private static setAuthCookie(user: User): void {
    localStorage.setItem(AUTH_COOKIE_NAME, JSON.stringify(user));
  }

  static getAuthCookie(): User | null {
    const cookie = localStorage.getItem(AUTH_COOKIE_NAME);
    if (!cookie) return null;
    
    try {
      const userData = JSON.parse(cookie);
      
      // Handle old format (with 'id' instead of '_id')
      if (userData.id && !userData._id) {
        console.warn('Found old auth format, user needs to re-authenticate');
        localStorage.removeItem(AUTH_COOKIE_NAME);
        return null;
      }
      
      // Ensure we have a valid user object with _id
      if (userData._id && userData.displayName && userData.emailAddress) {
        return userData as User;
      }
      
      console.warn('Invalid user data in localStorage, clearing');
      localStorage.removeItem(AUTH_COOKIE_NAME);
      return null;
    } catch (error) {
      console.error('Error parsing auth cookie:', error);
      localStorage.removeItem(AUTH_COOKIE_NAME);
      return null;
    }
  }
} 