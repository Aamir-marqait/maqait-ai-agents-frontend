/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "../contexts/AuthContext";
import logo from "../assets/app-logo/mainlogo.svg";
import { Toaster, toast } from "sonner";
import "../loader.css";

const OTPPage = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const navigate = useNavigate();
  const { verifyOtp, resendOtp, isLoading } = useAuth();
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const [resendTimer, setResendTimer] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setResendTimer((prevTimer) => {
        if (prevTimer === 1) {
          clearInterval(timer);
          setIsResendDisabled(false);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isResendDisabled]);

  const handleResendOtp = async () => {
    try {
      await resendOtp();
      toast.success("A new OTP has been sent to your email.");
      setIsResendDisabled(true);
      setResendTimer(60);
    } catch (error) {
      toast.error("Failed to resend OTP. Please try again later.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await verifyOtp(otp.join(""));
      toast.success("OTP verified successfully!");
      navigate("/dashboard");
    } catch (err) {
      toast.error("Invalid OTP. Please try again.");
    }
  };

  const handleChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    if (isNaN(Number(value))) return; // Only allow numbers

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input
    if (value !== "" && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 hero-gradient">
      <Toaster richColors />
      <div className="w-full max-w-md">
        <div className="text-center flex items-center justify-center mb-8">
          <Link to="/" className="text-3xl font-bold gradient-text ">
            <img src={logo} alt="logo" className="h-6 " />
          </Link>
        </div>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white">
              Enter Verification Code
            </CardTitle>
            <CardDescription className="text-gray-400">
              We've sent a 6-digit code to your email.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-center space-x-2">
                  {otp.map((data, index) => {
                    return (
                      <Input
                        key={index}
                        type="text"
                        maxLength={1}
                        value={data}
                        onChange={(e) => handleChange(index, e)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        ref={(el) => {
                          if (el) {
                            inputRefs.current[index] = el;
                          }
                        }}
                        className="w-12 h-12 text-center text-xl bg-gray-800 border-gray-700 text-white focus:border-violet-500"
                      />
                    );
                  })}
                </div>
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="cursor-pointer w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white border-0 py-6"
              >
                {isLoading ? (
                  <>
                    <div className="loader" />
                    Verifying...
                  </>
                ) : (
                  "Verify"
                )}
              </Button>
            </form>
            <div className="text-center mt-4">
              {isResendDisabled ? (
                <p className="text-gray-400">
                  Resend OTP in {resendTimer}s
                </p>
              ) : (
                <Button
                  onClick={handleResendOtp}
                  disabled={isResendDisabled || isLoading}
                  className="text-violet-400 hover:text-violet-300"
                >
                  Resend OTP
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OTPPage;
