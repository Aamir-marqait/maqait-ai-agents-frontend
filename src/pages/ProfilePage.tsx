import { useState, useEffect } from "react";
import { Camera, KeyRound, AlertTriangle, User, Save, Trash2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { apiClient } from "../lib/apiClient";

// Enhanced TabButton with better visual feedback
const TabButton = ({ active, onClick, children }: { active: boolean, onClick: () => void, children: React.ReactNode }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center text-left px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 ease-in-out ${active
        ? 'bg-violet-600 text-white shadow-lg'
        : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
      }`}
  >
    {children}
  </button>
);

const ProfilePage = () => {
  const { user, updateProfile, deleteAccount, refreshUserProfile, getUserStats, userStats, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    full_name: "",
    email: "",
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  // Initialize form data when user loads
  useEffect(() => {
    if (user) {
      setProfileForm({
        full_name: user.full_name || "",
        email: user.email || "",
      });
      // Load user stats when component mounts
      getUserStats().catch(console.error);
    }
  }, [user]);

  // Handle profile form changes
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [id]: value,
    }));
  };

  // Handle password form changes
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [id]: value,
    }));
  };

  // Save profile changes
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setIsSubmitting(true);

      // Only send changed fields
      const updates: any = {};
      if (profileForm.full_name !== user.full_name) {
        updates.full_name = profileForm.full_name;
      }
      if (profileForm.email !== user.email) {
        updates.email = profileForm.email;
      }

      if (Object.keys(updates).length === 0) {
        toast.info("No changes to save");
        return;
      }

      await updateProfile(updates);
      toast.success("Profile updated successfully!");

      // Refresh the profile data
      await refreshUserProfile();
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Change password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordForm.new_password !== passwordForm.confirm_password) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordForm.new_password.length < 8) {
      toast.error("New password must be at least 8 characters long");
      return;
    }

    try {
      setIsSubmitting(true);

      await apiClient.post("/api/v0/change-password", {
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password,
      });

      toast.success("Password changed successfully! Please log in again.");

      // Clear form
      setPasswordForm({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });

      // Redirect to login after password change
      setTimeout(() => {
        navigate("/signin");
      }, 2000);

    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || "Failed to change password";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete account
  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }

    try {
      setIsSubmitting(true);
      await deleteAccount();
      toast.success("Account deleted successfully");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete account");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">Please log in to view your profile.</div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto text-gray-100">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">Profile Settings</h1>
        <p className="text-gray-400 mt-1">Manage your account details and preferences.</p>

        {/* Account Stats */}
        {userStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-gray-800/50 p-3 rounded-lg">
              <div className="text-2xl font-bold text-violet-400">{userStats.total_executions}</div>
              <div className="text-sm text-gray-400">Total Executions</div>
            </div>
            <div className="bg-gray-800/50 p-3 rounded-lg">
              <div className="text-2xl font-bold text-green-400">₹{userStats.total_credits_added}</div>
              <div className="text-sm text-gray-400">Credits Added</div>
            </div>
            <div className="bg-gray-800/50 p-3 rounded-lg">
              <div className="text-2xl font-bold text-red-400">₹{userStats.total_credits_spent}</div>
              <div className="text-sm text-gray-400">Credits Spent</div>
            </div>
            <div className="bg-gray-800/50 p-3 rounded-lg">
              <div className="text-2xl font-bold text-blue-400">{userStats.account_age_days}</div>
              <div className="text-sm text-gray-400">Days Old</div>
            </div>
          </div>
        )}
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
                <CardDescription className="text-gray-400">
                  This information will be displayed publicly. Current balance: ₹{user.credits}
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSaveProfile}>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-6">
                    <div className="relative group cursor-pointer">
                      <Avatar className="w-24 h-24 border-2 border-gray-700 group-hover:border-violet-500 transition-colors">
                        <AvatarImage src={`https://api.dicebear.com/7.x/bottts/svg?seed=${user.username}`} />
                        <AvatarFallback className="bg-violet-600 text-white text-2xl">
                          {user.full_name?.split(" ").map((n) => n[0]).join("") || user.email[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                        <Camera className="text-white w-8 h-8" />
                      </div>
                    </div>
                    <Button type="button" variant="outline" className="border-gray-700 bg-black text-white hover:bg-gray-800 hover:text-white cursor-pointer">
                      Change Photo
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="full_name" className="text-gray-300">Display Name</Label>
                      <Input
                        id="full_name"
                        value={profileForm.full_name}
                        onChange={handleProfileChange}
                        className="bg-gray-800 border-gray-700 text-white focus:bg-gray-700 focus:border-violet-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-gray-300">Username</Label>
                      <Input
                        id="username"
                        value={user.username}
                        disabled
                        className="bg-gray-800 border-gray-700 opacity-50 cursor-not-allowed text-gray-400"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-300">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileForm.email}
                      onChange={handleProfileChange}
                      className="bg-gray-800 border-gray-700 text-white focus:bg-gray-700 focus:border-violet-500"
                    />
                    <p className="text-xs text-gray-400">Changing email will require re-verification</p>
                  </div>
                </CardContent>
                <div className="border-t border-gray-800 px-6 py-4 flex justify-end">
                  <Button
                    type="submit"
                    disabled={isSubmitting || isLoading}
                    className="bg-violet-600 hover:bg-violet-500 text-white transition-colors cursor-pointer"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {activeTab === 'password' && (
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Password</CardTitle>
                <CardDescription className="text-gray-400">Change your password here. After saving, you'll be logged out.</CardDescription>
              </CardHeader>
              <form onSubmit={handleChangePassword}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current_password" className="text-gray-300">Current Password</Label>
                    <Input
                      id="current_password"
                      type="password"
                      value={passwordForm.current_password}
                      onChange={handlePasswordChange}
                      required
                      className="bg-gray-800 border-gray-700 text-white focus:bg-gray-700 focus:border-violet-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new_password" className="text-gray-300">New Password</Label>
                    <Input
                      id="new_password"
                      type="password"
                      value={passwordForm.new_password}
                      onChange={handlePasswordChange}
                      required
                      minLength={8}
                      className="bg-gray-800 border-gray-700 text-white focus:bg-gray-700 focus:border-violet-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm_password" className="text-gray-300">Confirm Password</Label>
                    <Input
                      id="confirm_password"
                      type="password"
                      value={passwordForm.confirm_password}
                      onChange={handlePasswordChange}
                      required
                      minLength={8}
                      className="bg-gray-800 border-gray-700 text-white focus:bg-gray-700 focus:border-violet-500"
                    />
                  </div>
                </CardContent>
                <div className="border-t border-gray-800 px-6 py-4 flex justify-end">
                  <Button
                    type="submit"
                    disabled={isSubmitting || isLoading}
                    className="bg-violet-600 hover:bg-violet-500 text-white transition-colors cursor-pointer"
                  >
                    <KeyRound className="w-4 h-4 mr-2" />
                    {isSubmitting ? "Updating..." : "Update Password"}
                  </Button>
                </div>
              </form>
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
                  Current wallet balance: ₹{user.credits}
                </p>
                <Button
                  type="button"
                  variant="destructive"
                  disabled={isSubmitting || isLoading}
                  onClick={handleDeleteAccount}
                  className="bg-red-600 hover:bg-red-500 text-white transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {isSubmitting ? "Deleting..." : "Delete My Account"}
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