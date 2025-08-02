/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { apiClient } from "../lib/apiClient";

interface User {
  id: string;
  email: string;
  full_name: string;
  name: string; // Alias for full_name
  username: string; // Generated from email
  credits: number; // From wallet_balance
  is_active: boolean;
  is_verified: boolean;
  wallet_balance: number;
  is_trial_active: boolean;
  trial_expires_at: string | null;
  created_at: string;
  updated_at: string;
}

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  wallet_balance: number;
  is_trial_active: boolean;
  trial_expires_at: string | null;
}

interface UserStats {
  total_executions: number;
  successful_executions: number;
  failed_executions: number;
  total_credits_spent: number;
  total_credits_added: number;
  account_age_days: number;
}

interface UserUpdateData {
  full_name?: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  userStats: UserStats | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  verifyOtp: (otp: string) => Promise<void>;
  resendOtp: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: UserUpdateData) => Promise<void>;
  deleteAccount: () => Promise<void>;
  refreshUserProfile: (silent?: boolean) => Promise<void>;
  getUserStats: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [signupData, setSignupData] = useState<{
    full_name?: string;
    email?: string;
    password?: string;
  }>({});

  // Helper function to transform backend user data to frontend format
  const transformUserData = (backendUser: UserProfile): User => {
    const username = backendUser.email.split('@')[0]; // Generate username from email
    return {
      id: backendUser.id,
      email: backendUser.email,
      full_name: backendUser.full_name || '',
      name: backendUser.full_name || '', // Alias
      username,
      credits: backendUser.wallet_balance || 0,
      is_active: backendUser.is_active,
      is_verified: backendUser.is_verified,
      wallet_balance: backendUser.wallet_balance || 0,
      is_trial_active: backendUser.is_trial_active,
      trial_expires_at: backendUser.trial_expires_at,
      created_at: backendUser.created_at,
      updated_at: backendUser.updated_at,
    };
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const authToken = localStorage.getItem("authToken");

    if (savedUser && savedUser !== "undefined" && authToken) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        // Refresh user data from server
        getCurrentUser();
      } catch (error) {
        localStorage.removeItem("user");
        localStorage.removeItem("authToken");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post("/api/v0/login", {
        email,
        password,
      });
      const { access_token } = response.data;
      localStorage.setItem("authToken", access_token);
      await getCurrentUser();
    } catch (error) {
      throw new Error("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (full_name: string, email: string, password: string) => {
    setIsLoading(true);
    setSignupData({ full_name, email, password });
    try {
      await apiClient.post("/api/v0/register/initiate", {
        email,
        password,
        full_name,
      });
    } catch (error) {
      throw new Error("Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (otp: string) => {
    setIsLoading(true);
    if (!signupData.email || !signupData.password) {
      throw new Error("Email or password not found");
    }
    try {
      const response = await apiClient.post(
        `/api/v0/register/verify?password=${signupData.password}`,
        {
          email: signupData.email,
          otp_code: otp,
        }
      );

      const { access_token } = response.data;
      localStorage.setItem("authToken", access_token);
      await getCurrentUser();
    } catch (error) {
      throw new Error("Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentUser = async () => {
    try {
      console.log("Fetching current user...");
      const response = await apiClient.get("/api/v0/me");
      console.log("User response:", response.data);

      if (response.data) {
        const transformedUser = transformUserData(response.data);
        setUser(transformedUser);
        localStorage.setItem("user", JSON.stringify(transformedUser));
        console.log("User data saved:", transformedUser);
      } else {
        console.error("No user data received from API");
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      setUser(null);
    }
  };

  const refreshUserProfile = async (silent = false) => {
    if (!user) return;

    try {
      if (!silent) {
        setIsLoading(true);
      }
      const response = await apiClient.get("/api/v0/users/profile");

      if (response.data) {
        const transformedUser = transformUserData(response.data);
        setUser(transformedUser);
        localStorage.setItem("user", JSON.stringify(transformedUser));
      }
    } catch (error) {
      console.error("Error refreshing user profile:", error);
      if (!silent) {
        throw new Error("Failed to refresh profile");
      }
    } finally {
      if (!silent) {
        setIsLoading(false);
      }
    }
  };

  const updateProfile = async (data: UserUpdateData) => {
    if (!user) throw new Error("No user logged in");

    try {
      setIsLoading(true);
      const response = await apiClient.put("/api/v0/users/profile", data);

      if (response.data) {
        const transformedUser = transformUserData(response.data);
        setUser(transformedUser);
        localStorage.setItem("user", JSON.stringify(transformedUser));
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      const errorMessage = error.response?.data?.detail || "Failed to update profile";
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getUserStats = async () => {
    if (!user) return;

    try {
      const response = await apiClient.get("/api/v0/users/stats");
      setUserStats(response.data);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      throw new Error("Failed to fetch user statistics");
    }
  };

  const deleteAccount = async () => {
    if (!user) throw new Error("No user logged in");

    try {
      setIsLoading(true);
      await apiClient.delete("/api/v0/users/account");

      // Clear all user data
      setUser(null);
      setUserStats(null);
      localStorage.removeItem("user");
      localStorage.removeItem("authToken");
    } catch (error: any) {
      console.error("Error deleting account:", error);
      const errorMessage = error.response?.data?.detail || "Failed to delete account";
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async () => {
    if (!signupData.email) {
      throw new Error("No email found for resending OTP.");
    }
    try {
      await apiClient.post("/api/v0/register/resend-otp", {
        email: signupData.email,
      });
    } catch (error) {
      throw new Error("Failed to resend OTP.");
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      // Call backend logout endpoint
      await apiClient.post("/api/v0/logout");
    } catch (error) {
      console.error("Error calling logout API:", error);
      // Continue with logout even if API call fails
    } finally {
      // Clear all local data
      setUser(null);
      setUserStats(null);
      localStorage.removeItem("user");
      localStorage.removeItem("authToken");
      setIsLoading(false);
    }
  };

  const value = {
    user,
    userStats,
    login,
    signup,
    verifyOtp,
    resendOtp,
    logout,
    updateProfile,
    deleteAccount,
    refreshUserProfile,
    getUserStats,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};