import { create } from 'zustand';
import axios from 'axios';

const API_URL = '/api/auth';

const useAuthStore = create((set, get) => ({
  token: localStorage.getItem('sf_token') || null,
  user: JSON.parse(localStorage.getItem('sf_user') || 'null'),
  loading: false,
  error: null,

  get isAuthenticated() {
    return !!get().token;
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post(`${API_URL}/login`, { email, password });
      const { token, user } = res.data;
      localStorage.setItem('sf_token', token);
      localStorage.setItem('sf_user', JSON.stringify(user));
      set({ token, user, loading: false });
      return true;
    } catch (err) {
      const message = err.response?.data?.error || 'Login failed.';
      set({ error: message, loading: false });
      return false;
    }
  },

  register: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post(`${API_URL}/register`, { email, password });
      const { token, user } = res.data;
      localStorage.setItem('sf_token', token);
      localStorage.setItem('sf_user', JSON.stringify(user));
      set({ token, user, loading: false });
      return true;
    } catch (err) {
      const message = err.response?.data?.error || 'Registration failed.';
      set({ error: message, loading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('sf_token');
    localStorage.removeItem('sf_user');
    set({ token: null, user: null, error: null });
  },

  clearError: () => set({ error: null }),

  getAuthHeader: () => {
    const token = get().token;
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
}));

export default useAuthStore;
