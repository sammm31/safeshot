import { useState, useEffect } from 'react';
import { UserProfile } from '../types/auth';

const DEFAULT_USER: UserProfile = {
  id: 'USR-89421',
  name: 'Dr. Sarah Jenkins',
  employeeId: 'EMP-92041',
  email: 's.jenkins@safeshot.health',
  role: 'Senior Vaccine Safety Officer',
  department: 'Pediatric Immunization Unit',
  facility: 'Metropolitan General Hospital',
  avatarInitials: 'SJ',
  joinedDate: '2024-03-15',
  totalInspections: 148,
  totalDispensed: 92,
};

type AuthListener = () => void;

class AuthStore {
  private user: UserProfile | null = null;
  private authenticated: boolean = false; // start on Login screen
  private listeners: Set<AuthListener> = new Set();

  public getUser(): UserProfile | null {
    return this.user;
  }

  public isAuthenticated(): boolean {
    return this.authenticated && this.user !== null;
  }

  public login(identifier: string, _password: string): { success: boolean; error?: string } {
    if (!identifier || identifier.trim().length === 0) {
      return { success: false, error: 'Please enter your Email or Employee ID.' };
    }
    // Accept any password for mock auth
    this.user = {
      ...DEFAULT_USER,
      employeeId: identifier.includes('@') ? DEFAULT_USER.employeeId : identifier.toUpperCase(),
      email: identifier.includes('@') ? identifier.toLowerCase() : DEFAULT_USER.email,
    };
    this.authenticated = true;
    this.notify();
    return { success: true };
  }

  public demoLogin(): void {
    this.user = { ...DEFAULT_USER };
    this.authenticated = true;
    this.notify();
  }

  public logout(): void {
    this.authenticated = false;
    this.user = null;
    this.notify();
  }

  public updateProfile(updates: Partial<UserProfile>): void {
    if (this.user) {
      this.user = { ...this.user, ...updates };
      this.notify();
    }
  }

  public subscribe(listener: AuthListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.error('AuthStore notification error:', err);
      }
    });
  }
}

export const authStore = new AuthStore();

export function useAuth() {
  const [, setTick] = useState(0);

  useEffect(() => {
    return authStore.subscribe(() => {
      setTick((t) => t + 1);
    });
  }, []);

  return {
    user: authStore.getUser(),
    isAuthenticated: authStore.isAuthenticated(),
    login: authStore.login.bind(authStore),
    demoLogin: authStore.demoLogin.bind(authStore),
    logout: authStore.logout.bind(authStore),
    updateProfile: authStore.updateProfile.bind(authStore),
  };
}
