"use client"

import { useState, useEffect } from "react";
import { useUser } from "@/hooks/useUser";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/axios";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";

export default function ProfilePage() {
  const { data: user, isLoading, refetch } = useUser();
  const { toast } = useToast();
  
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [profileData, setProfileData] = useState({ address: "", city: "", phone: "" });
  const [passLoading, setPassLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        address: user.address || "",
        city: user.city || "",
        phone: user.phone || ""
      });
    }
  }, [user]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
        toast({ variant: "destructive", title: "Error", description: "Passwords do not match" });
        return;
    }
    setPassLoading(true);
    try {
        await api.put("/auth/change-password", { 
            currentPassword: passwords.current, 
            newPassword: passwords.new 
        });
        toast({ variant: "success", title: "Success", description: "Password updated successfully" });
        setPasswords({ current: "", new: "", confirm: "" });
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const err = error as AxiosError<{ error: string }>;
            toast({ variant: "destructive", title: "Error", description: err.response?.data?.error || "Failed to update password" });
        } else {
            toast({ variant: "destructive", title: "Error", description: "An unexpected error occurred" });
        }
    } finally {
        setPassLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
        await api.put("/auth/profile", profileData);
        await refetch(); // Refresh user data
        toast({ variant: "success", title: "Success", description: "Profile updated successfully" });
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const err = error as AxiosError<{ error: string }>;
            toast({ variant: "destructive", title: "Error", description: err.response?.data?.error || "Failed to update profile" });
        } else {
            toast({ variant: "destructive", title: "Error", description: "An unexpected error occurred" });
        }
    } finally {
        setProfileLoading(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
       <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm h-fit">
              <h2 className="text-xl font-medium mb-6 text-gray-900">Personal Information</h2>
              <div className="space-y-4">
                 <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Full Name</label>
                    <div className="font-bold text-lg text-gray-900">{user?.name}</div>
                 </div>
                 <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
                    <div className="font-bold text-lg text-gray-900">{user?.email}</div>
                 </div>
              </div>
          </div>

           <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h2 className="text-xl font-medium mb-6 text-gray-900">Shipping Details</h2>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Address</label>
                    <Input 
                       value={profileData.address}
                       onChange={e => setProfileData({...profileData, address: e.target.value})}
                       placeholder="House No, Street, Area"
                       className="bg-gray-50 border-gray-200 h-12 rounded-xl focus:bg-white transition-colors"
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">City</label>
                        <Input 
                           value={profileData.city}
                           onChange={e => setProfileData({...profileData, city: e.target.value})}
                           placeholder="City Name"
                           className="bg-gray-50 border-gray-200 h-12 rounded-xl focus:bg-white transition-colors"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Phone</label>
                        <Input 
                           value={profileData.phone}
                           onChange={e => setProfileData({...profileData, phone: e.target.value})}
                           placeholder="0300-1234567"
                           className="bg-gray-50 border-gray-200 h-12 rounded-xl focus:bg-white transition-colors"
                        />
                     </div>
                 </div>
                 <Button disabled={profileLoading} className="w-full h-12 rounded-xl font-bold uppercase tracking-wider shadow-lg shadow-primary/20">
                    {profileLoading && <Loader2 className="mr-2 size-4 animate-spin"/>}
                    Update Details
                 </Button>
              </form>
           </div>
       </div>

       <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm max-w-2xl">
          <h2 className="text-xl font-medium mb-6 text-gray-900">Security (Change Password)</h2>
          <form onSubmit={handlePasswordChange} className="space-y-4">
             <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Current Password</label>
                <Input 
                   type="password"
                   value={passwords.current}
                   onChange={e => setPasswords({...passwords, current: e.target.value})}
                   className="bg-gray-50 border-gray-200 h-12 rounded-xl focus:bg-white transition-colors"
                />
             </div>
             <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">New Password</label>
                <Input 
                   type="password"
                   value={passwords.new}
                   onChange={e => setPasswords({...passwords, new: e.target.value})}
                   className="bg-gray-50 border-gray-200 h-12 rounded-xl focus:bg-white transition-colors"
                />
             </div>
             <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Confirm New Password</label>
                <Input 
                   type="password"
                   value={passwords.confirm}
                   onChange={e => setPasswords({...passwords, confirm: e.target.value})}
                   className="bg-gray-50 border-gray-200 h-12 rounded-xl focus:bg-white transition-colors"
                />
             </div>
             <Button disabled={passLoading} className="w-full h-12 rounded-xl font-bold uppercase tracking-wider shadow-lg shadow-primary/20">
                {passLoading && <Loader2 className="mr-2 size-4 animate-spin"/>}
                Update Password
             </Button>
          </form>
       </div>
    </div>
  );
}
