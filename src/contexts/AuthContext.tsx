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
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (email === "anas@marqait.com" && password === "anas") {
        const mockUser: User = {
          id: "1",
          email,
          name: "Anas",
          username: "anas",
          credits: 300,
        };
        setUser(mockUser);
        localStorage.setItem("user", JSON.stringify(mockUser));
      } else {
        throw new Error("Invalid email or password");
      }
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
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (otp === "123456") {
        const mockUser: User = {
          id: "1",
          email: "user@example.com", // You might want to get this from signup state
          name: "New User", // You might want to get this from signup state
          username: "newuser",
          credits: 100,
        };
        setUser(mockUser);
        localStorage.setItem("user", JSON.stringify(mockUser));
      } else {
        throw new Error("Invalid OTP");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async () => {
    if (!signupData.email) {
      throw new Error("No email found for resending OTP.");
    }
    try {
      await apiClient.post("/api/v0/register/initiate", {
        email: signupData.email,
        password: signupData.password,
        full_name: signupData.full_name,
      });
    } catch (error) {
      throw new Error("Failed to resend OTP.");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
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
