import type { PersistStorage } from 'zustand/middleware';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/entities/user/model/types';

const AUTH_STORAGE_KEY = 'auth-storage';

interface PersistedAuthState {
  user: User | null;
  token: string | null;
  rememberMe: boolean;
}

const createAuthStorage = (): PersistStorage<PersistedAuthState> => ({
  getItem: (name) => {
    const local = localStorage.getItem(name);
    if (local) {
      try {
        const parsed = JSON.parse(local) as {
          state?: PersistedAuthState;
          version?: number;
        };
        if (parsed.state?.rememberMe) return { state: parsed.state, version: parsed.version };
      } catch {
        // ignore
      }
    }
    const session = sessionStorage.getItem(name);
    if (session) {
      try {
        const parsed = JSON.parse(session) as {
          state?: PersistedAuthState;
          version?: number;
        };
        if (parsed.state) return { state: parsed.state, version: parsed.version };
      } catch {
        // ignore
      }
    }
    return null;
  },
  setItem: (name, value) => {
    const str = JSON.stringify(value);
    if (value.state?.rememberMe) {
      localStorage.setItem(name, str);
      sessionStorage.removeItem(name);
    } else {
      sessionStorage.setItem(name, str);
      localStorage.removeItem(name);
    }
  },
  removeItem: (name) => {
    localStorage.removeItem(name);
    sessionStorage.removeItem(name);
  },
});

interface AuthState extends PersistedAuthState {
  setAuth: (user: User, token: string, rememberMe: boolean) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      rememberMe: false,
      setAuth: (user, token, rememberMe) => set({ user, token, rememberMe }),
      clearAuth: () => set({ user: null, token: null, rememberMe: false }),
    }),
    {
      name: AUTH_STORAGE_KEY,
      storage: createAuthStorage(),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        rememberMe: state.rememberMe,
      }),
    },
  ),
);
