"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import logo from "../assets/app-logo/mainlogo.svg";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      toast.success("Logged out successfully!");
      navigate("/");
    } catch (error: any) {
      console.error("Logout error:", error);
      toast.error("Logout failed, but you've been signed out locally");
      // Even if API call fails, user is logged out locally
      navigate("/");
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Don't show header on dashboard pages
  if (
    window.location.pathname.startsWith("/dashboard") ||
    window.location.pathname.startsWith("/agents") ||
    window.location.pathname.startsWith("/profile") ||
    window.location.pathname.startsWith("/billing") ||
    window.location.pathname.startsWith("/buy-credits")
  ) {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-effect">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold ">
            <img src={logo} alt="logo" className="h-6" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Button
                  variant="ghost"
                  className="text-white hover:text-violet-400 hover:bg-violet-500/10"
                  onClick={() => navigate("/dashboard")}
                >
                  <User className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
                <Button
                  variant="ghost"
                  className="text-white hover:text-violet-400 hover:bg-violet-500/10 cursor-pointer"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="text-white hover:text-violet-400 hover:bg-violet-500/10 cursor-pointer"
                  onClick={() => navigate("/signin")}
                >
                  Sign In
                </Button>
                <Button
                  className="cursor-pointer bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white border-0"
                  onClick={() => navigate("/signup")}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-800">
            <div className="flex flex-col space-y-3 pt-4">
              {user ? (
                <>
                  <Button
                    variant="ghost"
                    className="text-white cursor-pointer hover:text-violet-400 hover:bg-violet-500/10 justify-start"
                    onClick={() => {
                      navigate("/dashboard");
                      setIsMenuOpen(false);
                    }}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                  <Button
                    variant="ghost"
                    className="text-white hover:text-violet-400 hover:bg-violet-500/10 justify-start cursor-pointer"
                    onClick={async () => {
                      setIsMenuOpen(false);
                      await handleLogout();
                    }}
                    disabled={isLoggingOut}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    className="text-white hover:text-violet-400 hover:bg-violet-500/10 justify-start cursor-pointer"
                    onClick={() => {
                      navigate("/signin");
                      setIsMenuOpen(false);
                    }}
                  >
                    Sign In
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white border-0 justify-start cursor-pointer"
                    onClick={() => {
                      navigate("/signup");
                      setIsMenuOpen(false);
                    }}
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;