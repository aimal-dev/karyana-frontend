"use client"

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  Store, 
  UserCog, 
  Loader2,
  AlertTriangle,
  Mail
} from "lucide-react";

export default function AdminSecurityPage() {
  const { toast } = useToast();
  
  // States for Admin Password Change
  const [adminData, setAdminData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // States for Seller Password Change
  const [sellerId, setSellerId] = useState("");
  const [sellerPassword, setSellerPassword] = useState("");

  // Fetch Sellers for selection
  const { data: sellersData, isLoading: sellersLoading } = useQuery({
    queryKey: ["admin-sellers-list"],
    queryFn: async () => (await api.get("/admin/sellers")).data,
  });

  const changeAdminPassword = useMutation({
    mutationFn: async () => {
      if (adminData.newPassword !== adminData.confirmPassword) {
        throw new Error("Passwords do not match");
      }
      await api.put("/auth/change-password", {
        currentPassword: adminData.currentPassword,
        newPassword: adminData.newPassword
      });
    },
    onSuccess: () => {
      toast({ variant: "success", title: "Success", description: "Your password has been updated" });
      setAdminData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    },
    onError: (err: any) => {
      toast({ variant: "destructive", title: "Update Failed", description: err.response?.data?.error || err.message });
    }
  });

  const changeSellerPassword = useMutation({
    mutationFn: async () => {
      if (!sellerId) throw new Error("Please select a seller");
      if (!sellerPassword) throw new Error("Please enter a new password");
      await api.put(`/admin/sellers/${sellerId}/change-password`, {
        newPassword: sellerPassword
      });
    },
    onSuccess: () => {
      toast({ variant: "success", title: "Seller Password Updated", description: "The seller's credentials have been changed successfully." });
      setSellerId("");
      setSellerPassword("");
    },
    onError: (err: any) => {
      toast({ variant: "destructive", title: "Update Failed", description: err.response?.data?.error || err.message });
    }
  });

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
         <h1 className="text-4xl font-medium text-white tracking-tighter uppercase font-subheading-main">Security & Access</h1>
         <p className="text-gray-400 font-medium uppercase tracking-[0.2em] text-[10px] mt-1 opacity-70">Manage administrative credentials and store security</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         {/* Admin Security Section */}
         <div className="bg-white/5 border border-white/5 rounded-[2rem] p-10 space-y-8">
            <div className="flex items-center gap-4 mb-2">
               <div className="size-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                  <UserCog className="size-6 text-indigo-500" />
               </div>
               <div>
                  <h3 className="text-xl font-medium text-white uppercase tracking-tight font-subheading-main">My Credentials</h3>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Update your admin login details</p>
               </div>
            </div>

            <div className="space-y-6">
               <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex gap-3 text-xs font-bold items-center">
                  <AlertTriangle className="size-4 shrink-0" />
                  Updating your password will require you to log back in on all devices.
               </div>

               <div className="space-y-4">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Current Password</label>
                     <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
                        <Input 
                          type="password"
                          value={adminData.currentPassword}
                          onChange={e => setAdminData({...adminData, currentPassword: e.target.value})}
                          className="bg-white/5 border-white/5 h-12 rounded-xl pl-12 text-sm text-white"
                          placeholder="••••••••"
                        />
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">New Password</label>
                     <div className="relative group">
                        <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
                        <Input 
                          type="password"
                          value={adminData.newPassword}
                          onChange={e => setAdminData({...adminData, newPassword: e.target.value})}
                          className="bg-white/5 border-white/5 h-12 rounded-xl pl-12 text-sm text-white"
                          placeholder="Enter new password"
                        />
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Confirm New Password</label>
                     <div className="relative group">
                        <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
                        <Input 
                          type="password"
                          value={adminData.confirmPassword}
                          onChange={e => setAdminData({...adminData, confirmPassword: e.target.value})}
                          className="bg-white/5 border-white/5 h-12 rounded-xl pl-12 text-sm text-white"
                          placeholder="Re-type new password"
                        />
                     </div>
                  </div>

                  <Button 
                    onClick={() => changeAdminPassword.mutate()}
                    disabled={changeAdminPassword.isPending}
                    className="w-full h-14 rounded-2xl bg-indigo-500 text-white font-bold uppercase tracking-widest hover:bg-indigo-600 transition-all mt-4"
                  >
                     {changeAdminPassword.isPending ? <Loader2 className="size-5 animate-spin" /> : "Update Admin Password"}
                  </Button>
               </div>
            </div>
         </div>

         {/* Seller Management Section */}
         <div className="bg-white/5 border border-white/5 rounded-[2rem] p-10 space-y-8">
            <div className="flex items-center gap-4 mb-2">
               <div className="size-12 rounded-2xl bg-teal-500/10 flex items-center justify-center border border-teal-500/20">
                  <Store className="size-6 text-teal-500" />
               </div>
               <div>
                  <h3 className="text-xl font-medium text-white uppercase tracking-tight font-subheading-main">Seller Passwords</h3>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Reset credentials for any seller</p>
               </div>
            </div>

            <div className="space-y-6">
               <div className="space-y-4">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Select Seller</label>
                     <select 
                       value={sellerId}
                       onChange={e => setSellerId(e.target.value)}
                       className="w-full bg-white/5 border border-white/10 h-12 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-teal-500/50 transition-colors appearance-none font-bold"
                     >
                        <option value="" className="bg-[#111]">Choose a seller account...</option>
                        {sellersData?.sellers.map((s: any) => (
                           <option key={s.id} value={s.id} className="bg-[#111]">{s.name} ({s.email})</option>
                        ))}
                     </select>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Set New Password</label>
                     <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
                        <Input 
                          type="password"
                          value={sellerPassword}
                          onChange={e => setSellerPassword(e.target.value)}
                          className="bg-white/5 border-white/5 h-12 rounded-xl pl-12 text-sm text-white focus:border-teal-500/30"
                          placeholder="Temporary password"
                        />
                     </div>
                  </div>

                  <Button 
                    onClick={() => changeSellerPassword.mutate()}
                    disabled={changeSellerPassword.isPending || !sellerId}
                    className="w-full h-14 rounded-2xl bg-teal-500/20 border border-teal-500/30 text-teal-400 font-bold uppercase tracking-widest hover:bg-teal-500 hover:text-white transition-all mt-4"
                  >
                     {changeSellerPassword.isPending ? <Loader2 className="size-5 animate-spin" /> : "Reset Seller Password"}
                  </Button>
               </div>

               <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start gap-4">
                  <div className="size-8 rounded-lg bg-teal-500/10 flex items-center justify-center shrink-0">
                     <Mail className="size-4 text-teal-500" />
                  </div>
                  <p className="text-[11px] text-gray-500 font-medium">
                     The seller will not be automatically notified of password changes. Please ensure you communicate the new temporary credentials to them securely.
                  </p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
