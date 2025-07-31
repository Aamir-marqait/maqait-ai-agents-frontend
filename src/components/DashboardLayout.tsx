"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LayoutDashboard, Bot, User, Receipt, Menu, X, Coins, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "../contexts/AuthContext"
import logo from "../assets/app-logo/mainlogo.svg";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Agents", href: "/agents", icon: Bot },
  { name: "Buy Credits", href: "/buy-credits", icon: Coins },
  { name: "Billing", href: "/billing", icon: Receipt },
]

const UserDropdown = ({ user, onLogout }: { user: any, onLogout: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 hover:bg-gray-800 rounded-lg p-2 transition-colors cursor-pointer"
      >
        <Avatar className="w-8 h-8">
          <AvatarImage src={`https://api.dicebear.com/7.x/bottts/svg?seed=${user?.username || 'user'}`} />
          <AvatarFallback className="bg-violet-600 text-white text-sm">
            {user?.name?.split(" ").map((n: string) => n[0]).join("") || "U"}
          </AvatarFallback>
        </Avatar>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
          <div className="py-1">
            <button
              onClick={() => {
                navigate('/profile');
                setIsOpen(false);
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors cursor-pointer"
            >
              <User className="w-4 h-4 mr-2" />
              Profile
            </button>
            <button
              onClick={() => {
                onLogout();
                setIsOpen(false);
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate();
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900/95 backdrop-blur-xl border-r border-gray-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-gray-800">
            <Link to="/dashboard" className="flex items-center justify-start cursor-pointer">
              <img src={logo} alt="logo" className="h-6" />
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-gray-400 hover:text-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = item.href === "/agents" ? location.pathname.startsWith(item.href) : location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                    isActive
                      ? "bg-violet-600/20 text-violet-400 border border-violet-500/30"
                      : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header bar */}
        <div className="sticky top-0 z-40 flex h-16 items-center gap-x-4 border-b border-gray-800 bg-gray-900/95 backdrop-blur-xl px-6">
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white cursor-pointer"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
          <div className="lg:hidden text-xl font-bold gradient-text ml-2">MARQAIT</div>
          <div className="ml-auto flex items-center space-x-4">
            <div className="lg:hidden text-right">
              <p className="text-white text-sm font-medium">{user?.name}</p>
              <Badge variant="secondary" className="bg-violet-600/20 text-violet-400 border-violet-500/30">
                {user?.credits} credits
              </Badge>
            </div>
            <div className="hidden lg:flex items-center space-x-2">
              <Badge variant="secondary" className="bg-violet-600/20 text-violet-400 border-violet-500/30">
                {user?.credits} credits
              </Badge>
            </div>
            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
            <div className="hidden lg:block">
              <UserDropdown user={user} onLogout={handleLogout} />
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="min-h-screen p-6">{children}</main>
      </div>
    </div>
  )
}

export default DashboardLayout