import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthResponse, apiClient } from "@/lib/api";

interface AuthState {
  user: AuthResponse["user"] | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setUser: (user: AuthResponse["user"]) => void;
  setToken: (token: string) => void;
  clearError: () => void;
  initializeAuth: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await apiClient.login({ email, password });
          console.log("Login response:", response);

          if (response.success && response.data) {
            const { user, token } = response.data;
            console.log(
              "Login successful, setting token:",
              token ? "Present" : "Missing"
            );
            apiClient.setToken(token);

            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            return true;
          } else {
            set({
              isLoading: false,
              error: response.message || "Login failed",
            });
            return false;
          }
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : "Login failed",
          });
          return false;
        }
      },

      logout: () => {
        apiClient.clearToken();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },

      setUser: (user: AuthResponse["user"]) => {
        set({ user });
      },

      setToken: (token: string) => {
        console.log(
          "Setting token in auth store:",
          token ? "Present" : "Missing"
        );
        apiClient.setToken(token);
        set({ token, isAuthenticated: true });
      },

      clearError: () => {
        set({ error: null });
      },

      initializeAuth: () => {
        const state = get();
        if (state.token) {
          apiClient.setToken(state.token);
          console.log("Auth initialized with token from store");
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
