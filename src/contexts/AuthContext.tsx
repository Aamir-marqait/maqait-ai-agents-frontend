"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";

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

  useEffect(() => {
    // Check if user is logged in (e.g., from localStorage)
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
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

  const signup = async (_name: string, _email: string, _password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Don't log the user in directly after signup
      // The user will be redirected to the OTP page

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


  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const value = {
    user,
    login,
    signup,
    verifyOtp,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
