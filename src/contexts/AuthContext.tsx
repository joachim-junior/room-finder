"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "@/types";
import { apiClient } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    role?: "GUEST" | "HOST" | "ADMIN";
  }) => Promise<void>;
  logout: () => void;
  updateProfile: (profileData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      if (initializing) return; // Prevent multiple simultaneous initializations

      setInitializing(true);
      console.log("=== AUTH INITIALIZATION START ===");

      // Check localStorage directly first
      if (typeof window !== "undefined") {
        const directToken = localStorage.getItem("token");
        console.log(
          "Direct localStorage token:",
          directToken ? "EXISTS" : "NOT FOUND"
        );
        if (directToken) {
          console.log(
            "Direct token value:",
            directToken.substring(0, 20) + "..."
          );
        }
      }

      const token = apiClient.getToken();
      console.log("ApiClient getToken result:", !!token);
      console.log(
        "ApiClient token value:",
        token ? token.substring(0, 20) + "..." : "null"
      );

      if (token) {
        try {
          console.log("Attempting to fetch user profile...");
          const response = await apiClient.getProfile();
          console.log("Profile API response:", response);

          // Handle different response structures from backend
          if (response.success && response.data) {
            console.log(
              "Profile fetch successful, setting user:",
              response.data
            );
            setUser(response.data);
          } else if ("user" in response && response.user) {
            // Backend returns { message, user } structure
            const backendResponse = response as { message: string; user: User };
            console.log(
              "Profile fetch successful (backend format), setting user:",
              backendResponse.user
            );
            setUser(backendResponse.user);
          } else {
            console.log("Profile fetch failed - response details:", response);
            console.log("Clearing token due to failed profile fetch");
            apiClient.setToken(null);
          }
        } catch (error) {
          console.error("Profile fetch error:", error);
          console.log("Clearing token due to profile fetch error");
          apiClient.setToken(null);
        }
      } else {
        console.log("No token available, user will remain null");
      }

      console.log("=== AUTH INITIALIZATION END ===");
      setLoading(false);
      setInitializing(false);
    };

    initializeAuth();
  }, []); // Remove initializing from dependencies to prevent infinite loop

  const login = async (email: string, password: string) => {
    console.log("=== LOGIN START ===");
    console.log("Attempting login for:", email);
    try {
      const response = await apiClient.login({ email, password });
      console.log("Login API response:", response);

      if (response.success && response.data) {
        console.log("Login successful, setting user:", response.data.user);
        console.log("Token should be stored by apiClient.setToken()");

        // Verify token was stored
        const storedToken = apiClient.getToken();
        console.log(
          "Token verification after login:",
          storedToken ? "STORED" : "NOT STORED"
        );

        setUser(response.data.user);
        console.log("User state updated");
      } else {
        console.log("Login failed:", response.message);
        throw new Error(response.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
    console.log("=== LOGIN END ===");
  };

  const register = async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    role?: "GUEST" | "HOST" | "ADMIN";
  }) => {
    const response = await apiClient.register(userData);
    if (!response.success) {
      throw new Error(response.message || "Registration failed");
    }
  };

  const logout = () => {
    apiClient.logout();
    setUser(null);
    // Redirect to login page after logout
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  };

  const updateProfile = async (profileData: Partial<User>) => {
    const response = await apiClient.updateProfile(profileData);
    if (response.success && response.data) {
      setUser(response.data);
    } else {
      throw new Error(response.message || "Profile update failed");
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
