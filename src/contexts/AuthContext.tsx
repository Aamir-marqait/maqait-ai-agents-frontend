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
  getOtpStatus: () => Promise<any>;
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
      const response = await apiClient.post("/api/v0/login", {
        email,
        password,
      });
      const { access_token } = response.data;
      localStorage.setItem("authToken", access_token);
      await getProfile();
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
      await getProfile();
    } catch (error) {
      throw new Error("Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const getProfile = async () => {
    try {
      const response = await apiClient.get("/api/v0/users/profile");
      const user = response.data;
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
      // Handle error
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

  const getOtpStatus = async () => {
    if (!signupData.email) {
      throw new Error("No email found to get OTP status.");
    }
    try {
      const response = await apiClient.get(
        `/api/v0/register/otp-status/${signupData.email}`
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to get OTP status.");
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
