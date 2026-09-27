import { create } from 'zustand';
import { IUser, UserRole } from '@oruvia/shared';
import { api } from '../services/api';

interface AuthState {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  hasRole: (role: UserRole) => boolean;
  setUser: (user: IUser, token: string) => void;
}

const ROLE_RANKS: Record<UserRole, number> = {
  PUBLIC: 0,
  CONTRIBUTOR: 1,
  EDITOR: 2,
  REVIEWER: 3,
  ADMIN: 4,
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: JSON.parse(localStorage.getItem('oruvia_user') || 'null'),
  token: localStorage.getItem('oruvia_token'),
  isAuthenticated: !!localStorage.getItem('oruvia_token'),
  isLoading: false,

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const { token, user } = await api.auth.login({ email, password });
      localStorage.setItem('oruvia_token', token);
      localStorage.setItem('oruvia_user', JSON.stringify(user));
      set({ user, token, isAuthenticated: true, isLoading: false });
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  register: async (userData) => {
    set({ isLoading: true });
    try {
      const { token, user } = await api.auth.register(userData);
      localStorage.setItem('oruvia_token', token);
      localStorage.setItem('oruvia_user', JSON.stringify(user));
      set({ user, token, isAuthenticated: true, isLoading: false });
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  logout: async () => {
    try {
      await api.auth.logout();
    } catch {
      // Ignore network failure on logout
    }
    localStorage.removeItem('oruvia_token');
    localStorage.removeItem('oruvia_user');
    set({ user: null, token: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('oruvia_token');
    if (!token) {
      set({ user: null, isAuthenticated: false });
      return;
    }
    try {
      const { user } = await api.auth.me();
      localStorage.setItem('oruvia_user', JSON.stringify(user));
      set({ user, isAuthenticated: true });
    } catch {
      localStorage.removeItem('oruvia_token');
      localStorage.removeItem('oruvia_user');
      set({ user: null, token: null, isAuthenticated: false });
    }
  },

  hasRole: (minRole: UserRole) => {
    const user = get().user;
    if (!user) return minRole === 'PUBLIC';
    return (ROLE_RANKS[user.role] ?? 0) >= (ROLE_RANKS[minRole] ?? 0);
  },

  setUser: (user: IUser, token: string) => {
    localStorage.setItem('oruvia_token', token);
    localStorage.setItem('oruvia_user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },
}));
