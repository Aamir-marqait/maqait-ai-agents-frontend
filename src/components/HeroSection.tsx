"use client";

import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import mainLogo from "../assets/app-logo/mainlogo.svg";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center hero-gradient">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <img
              src={mainLogo}
              alt="Marqait"
              className="mx-auto h-16 md:h-14"
            />
          </h1>
          <h2 className="text-2xl md:text-4xl font-semibold mb-6 text-gray-200">
            Your all-in-one AI powerhouse
            <br />
            <span className="gradient-text">
              for marketing, content & business growth
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
            Access 15+ AI tools designed to help you create stunning content,
            build marketing campaigns, launch websites, and grow your business.
          </p>
          <Button
            size="lg"
            className="cursor-pointer bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white border-0 px-8 py-6 text-lg font-semibold rounded-full"
            onClick={() => navigate("/signup")}
          >
            Get Started
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
