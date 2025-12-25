"use client"

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { 
  User, 
  Mail, 
  Lock, 
  Save, 
  Loader2,
  Shield,
  Key
} from "lucide-react";

export default function SellerProfilePage() {
  const { toast } = useToast();
  const [profileData, setProfileData] = useState({
    name: "",
    email: ""
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const { data: user, isLoading } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const response = await api.get("/users/me");
      setProfileData({
        name: response.data.user.name || "",
        email: response.data.user.email || ""
      });
      return response.data.user;
    }
  });

  const updateProfile = useMutation({
    mutationFn: async (data: { name: string; email: string }) => {
      await api.put("/users/profile", data);
    },
    onSuccess: () => {
      toast({ variant: "success", title: "Success", description: "Profile updated successfully" });
    },
    onError: () => {
      toast({ variant: "destructive", title: "Error", description: "Failed to update profile" });
    }
  });

  const updatePassword = useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      await api.put("/users/password", data);
    },
    onSuccess: () => {
      toast({ variant: "success", title: "Success", description: "Password updated successfully" });
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    },
    onError: (error: any) => {
      toast({ 
        variant: "destructive", 
        title: "Error", 
        description: error.response?.data?.message || "Failed to update password" 
      });
    }
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate(profileData);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({ variant: "destructive", title: "Error", description: "Passwords do not match" });
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast({ variant: "destructive", title: "Error", description: "Password must be at least 6 characters" });
      return;
    }
    updatePassword.mutate({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    });
  };

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="size-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
         <h1 className="text-4xl font-medium text-white tracking-tighter uppercase font-subheading-main">My Account</h1>
         <p className="text-gray-400 font-medium uppercase tracking-[0.2em] text-[10px] mt-1 opacity-70">Manage your profile and security settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         {/* Profile Information */}
         <div className="bg-white/5 border border-white/5 rounded-[2rem] p-10 space-y-8">
            <div className="flex items-center gap-4 mb-2">
               <div className="size-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                  <User className="size-6 text-indigo-500" />
               </div>
               <div>
                  <h3 className="text-xl font-medium text-white uppercase tracking-tight font-subheading-main">Profile Information</h3>
                  <p className="text-[10px] font-medium text-gray-500 uppercase tracking-widest opacity-70">Update your account details</p>
               </div>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-medium text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative group">
                     <User className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                     <Input 
                       value={profileData.name}
                       onChange={e => setProfileData({...profileData, name: e.target.value})}
                       className="bg-white/5 border-white/5 h-12 rounded-xl pl-12 text-sm text-white"
                       placeholder="Enter your name"
                     />
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-medium text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                  <div className="relative group">
                     <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                     <Input 
                       value={profileData.email}
                       onChange={e => setProfileData({...profileData, email: e.target.value})}
                       className="bg-white/5 border-white/5 h-12 rounded-xl pl-12 text-sm text-white"
                       placeholder="Enter your email"
                       type="email"
                     />
                  </div>
               </div>

               <Button 
                 type="submit"
                 disabled={updateProfile.isPending}
                 className="w-full h-12 rounded-xl bg-indigo-500 text-white font-medium uppercase tracking-widest hover:bg-indigo-600 shadow-lg shadow-indigo-500/20 gap-2"
               >
                  {updateProfile.isPending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                  Save Changes
               </Button>
            </form>
         </div>

         {/* Password Security */}
         <div className="bg-white/5 border border-white/5 rounded-[2rem] p-10 space-y-8">
            <div className="flex items-center gap-4 mb-2">
               <div className="size-12 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                  <Shield className="size-6 text-amber-500" />
               </div>
               <div>
                  <h3 className="text-xl font-medium text-white uppercase tracking-tight font-subheading-main">Password Security</h3>
                  <p className="text-[10px] font-medium text-gray-500 uppercase tracking-widest opacity-70">Update your password</p>
               </div>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-medium text-gray-500 uppercase tracking-widest ml-1">Current Password</label>
                  <div className="relative group">
                     <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-400 group-focus-within:text-amber-500 transition-colors" />
                     <Input 
                       type="password"
                       value={passwordData.currentPassword}
                       onChange={e => setPasswordData({...passwordData, currentPassword: e.target.value})}
                       className="bg-white/5 border-white/5 h-12 rounded-xl pl-12 text-sm text-white"
                       placeholder="Enter current password"
                     />
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-medium text-gray-500 uppercase tracking-widest ml-1">New Password</label>
                  <div className="relative group">
                     <Key className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-400 group-focus-within:text-amber-500 transition-colors" />
                     <Input 
                       type="password"
                       value={passwordData.newPassword}
                       onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})}
                       className="bg-white/5 border-white/5 h-12 rounded-xl pl-12 text-sm text-white"
                       placeholder="Enter new password"
                     />
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-medium text-gray-500 uppercase tracking-widest ml-1">Confirm New Password</label>
                  <div className="relative group">
                     <Key className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-400 group-focus-within:text-amber-500 transition-colors" />
                     <Input 
                       type="password"
                       value={passwordData.confirmPassword}
                       onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                       className="bg-white/5 border-white/5 h-12 rounded-xl pl-12 text-sm text-white"
                       placeholder="Confirm new password"
                     />
                  </div>
               </div>

               <Button 
                 type="submit"
                 disabled={updatePassword.isPending}
                 className="w-full h-12 rounded-xl bg-amber-500 text-white font-medium uppercase tracking-widest hover:bg-amber-600 shadow-lg shadow-amber-500/20 gap-2"
               >
                  {updatePassword.isPending ? <Loader2 className="size-4 animate-spin" /> : <Lock className="size-4" />}
                  Update Password
               </Button>
            </form>
         </div>
      </div>

      {/* Account Info Card */}
      <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-[2rem] p-8">
         <div className="flex items-center justify-between">
            <div>
               <h4 className="text-lg font-medium text-white uppercase tracking-tight font-subheading-main">Account Status</h4>
               <p className="text-sm font-medium text-gray-400 mt-1">Your account is active and verified</p>
            </div>
            <div className="flex items-center gap-3">
               <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium uppercase tracking-widest">
                  {user?.role || "SELLER"}
               </div>
               <div className="size-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-medium text-xl shadow-lg shadow-indigo-500/20">
                  {user?.name?.[0] || "S"}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
