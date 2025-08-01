/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { apiClient } from "../lib/apiClient";

interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  credits: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  verifyOtp: (otp: string) => Promise<void>;
  resendOtp: () => Promise<void>;
  logout: () => void;
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
  const [isLoading, setIsLoading] = useState(true);
  const [signupData, setSignupData] = useState<{
    full_name?: string;
    email?: string;
    password?: string;
  }>({});

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser && savedUser !== "undefined") {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem("user");
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
      const user = response.data;
      if (user) {
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
        console.log("User data saved:", user);
      } else {
        console.error("No user data received from API");
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
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

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
  };

  const value = {
    user,
    login,
    signup,
    verifyOtp,
    resendOtp,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
