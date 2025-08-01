
import { useState } from "react";
import { Camera, KeyRound, AlertTriangle, User, Save, Trash2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Enhanced TabButton with better visual feedback
const TabButton = ({ active, onClick, children }: { active: boolean, onClick: () => void, children: React.ReactNode }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center text-left px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 ease-in-out ${
      active 
        ? 'bg-violet-600 text-white shadow-lg' 
        : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
    }`}
  >
    {children}
  </button>
);

const ProfilePage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto text-gray-100">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">Profile Settings</h1>
        <p className="text-gray-400 mt-1">Manage your account details and preferences.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Left Sidebar for Navigation */}
        <aside className="md:col-span-1">
          <nav className="flex flex-col space-y-2">
            <TabButton active={activeTab === "profile"} onClick={() => setActiveTab("profile")}>
              <User className="w-5 h-5 mr-3" />
              Profile
            </TabButton>
            <TabButton active={activeTab === "password"} onClick={() => setActiveTab("password")}>
              <KeyRound className="w-5 h-5 mr-3" />
              Password
            </TabButton>
            <TabButton active={activeTab === "danger"} onClick={() => setActiveTab("danger")}>
              <AlertTriangle className="w-5 h-5 mr-3" />
              Danger Zone
            </TabButton>
          </nav>
        </aside>

        {/* Right Content Area */}
        <main className="md:col-span-3">
          {activeTab === 'profile' && (
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Public Profile</CardTitle>
                <CardDescription className="text-gray-400">This information will be displayed publicly.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-6">
                  <div className="relative group cursor-pointer">
                    <Avatar className="w-24 h-24 border-2 border-gray-700 group-hover:border-violet-500 transition-colors">
                      <AvatarImage src={`https://api.dicebear.com/7.x/bottts/svg?seed=${user?.username}`} />
                      <AvatarFallback className="bg-violet-600 text-white text-2xl">
                        {user?.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                      <Camera className="text-white w-8 h-8" />
                    </div>
                  </div>
                   <Button variant="outline" className="border-gray-700 bg-black text-white hover:bg-gray-800 hover:text-white cursor-pointer">
                    Change Photo
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="displayName" className="text-gray-300">Display Name</Label>
                    <Input id="displayName" value={user?.name || ""} className="bg-gray-800 border-gray-700 text-white focus:bg-gray-700 focus:border-violet-500" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-gray-300">Username</Label>
                    <Input id="username" value={user?.username || ""} className="bg-gray-800 border-gray-700 text-white focus:bg-gray-700 focus:border-violet-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">Email</Label>
                  <Input id="email" type="email" value={user?.email || ""} disabled className="bg-gray-800 border-gray-700 opacity-50 cursor-not-allowed text-gray-400" />
                </div>
              </CardContent>
              <div className="border-t border-gray-800 px-6 py-4 flex justify-end">
                  <Button className="bg-violet-600 hover:bg-violet-500 text-white transition-colors cursor-pointer">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                </Button>
              </div>
            </Card>
          )}

          {activeTab === 'password' && (
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Password</CardTitle>
                <CardDescription className="text-gray-400">Change your password here. After saving, you'll be logged out.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword"  className="text-gray-300">Current Password</Label>
                  <Input id="currentPassword" type="password" className="bg-gray-800 border-gray-700 text-white focus:bg-gray-700 focus:border-violet-500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword"  className="text-gray-300">New Password</Label>
                  <Input id="newPassword" type="password" className="bg-gray-800 border-gray-700 text-white focus:bg-gray-700 focus:border-violet-500" />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="confirmPassword"  className="text-gray-300">Confirm Password</Label>
                  <Input id="confirmPassword" type="password" className="bg-gray-800 border-gray-700 text-white focus:bg-gray-700 focus:border-violet-500" />
                </div>
              </CardContent>
               <div className="border-t border-gray-800 px-6 py-4 flex justify-end">
                  <Button className="bg-violet-600 hover:bg-violet-500 text-white transition-colors cursor-pointer">
                    <KeyRound className="w-4 h-4 mr-2" />
                    Update Password
                </Button>
              </div>
            </Card>
          )}

          {activeTab === 'danger' && (
             <Card className="bg-gray-900/50 border-red-500/30">
              <CardHeader>
                <CardTitle className="text-red-400">Danger Zone</CardTitle>
                <CardDescription>These actions are permanent and cannot be undone.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                  <h4 className="font-semibold text-white">Delete Account</h4>
                  <p className="text-sm text-gray-400">
                    Your account and all associated data will be permanently deleted.
                  </p>
                  <Button variant="destructive" className="bg-red-600 hover:bg-red-500 text-white transition-colors cursor-pointer">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete My Account
                  </Button>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
