import { create } from "zustand";
import { setTokens, clearTokens } from "@/lib/auth";
import api from "@/lib/api";

interface User {
  id: number;
  email: string;
  username: string;
  role: string;
  created_at: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const response = await api.post("/auth/jwt/create/", {
        email,
        password,
      });
      const { access, refresh } = response.data;
      setTokens(access, refresh);
      set({ isAuthenticated: true });

      // Fetch user profile after login
      const userResponse = await api.get("/auth/users/me/");
      set({ user: userResponse.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    clearTokens();
    set({ user: null, isAuthenticated: false });
    window.location.href = "/login";
  },

  fetchUser: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get("/auth/users/me/");
      set({ user: response.data, isAuthenticated: true, isLoading: false });
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
