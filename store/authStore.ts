'use client';
import { create } from 'zustand';
import { User } from '@/types';
import api from '@/lib/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; phone?: string }) => Promise<void>;
  logout: () => void;
  loadFromStorage: () => void;
  updateUser: (updated: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,

  loadFromStorage: () => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('spark_token');
    const userStr = localStorage.getItem('spark_user');
    if (token && userStr) {
      set({ token, user: JSON.parse(userStr) });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true });
    const res = await api.post('/auth/login', { email, password });
    const { token, user } = res.data;
    localStorage.setItem('spark_token', token);
    localStorage.setItem('spark_user', JSON.stringify(user));
    set({ token, user, isLoading: false });
  },

  register: async (data) => {
    set({ isLoading: true });
    const res = await api.post('/auth/register', data);
    const { token, user } = res.data;
    localStorage.setItem('spark_token', token);
    localStorage.setItem('spark_user', JSON.stringify(user));
    set({ token, user, isLoading: false });
  },

  logout: () => {
    localStorage.removeItem('spark_token');
    localStorage.removeItem('spark_user');
    set({ token: null, user: null });
  },

  updateUser: (updated: User) => {
    localStorage.setItem('spark_user', JSON.stringify(updated));
    set({ user: updated });
  },
}));
