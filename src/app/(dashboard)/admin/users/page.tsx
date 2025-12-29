"use client"

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { 
  Mail, 
  MapPin, 
  Phone, 
  Calendar,
  Search,
  Loader2,
  ChevronRight
} from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  city?: string;
  address?: string;
  phone?: string;
  createdAt: string;
  totalSales?: number;
  orderCount?: number;
}

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const res = await api.get("/admin/users");
      return res.data;
    }
  });

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="size-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  const users: User[] = data?.users || [];
  const filteredUsers = users.filter((u) => {
    // Safety check: Never show system admin in user management
    if (u.name === "System Admin" || u.email === "admin@example.com") return false;
    
    return (
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
         <div>
            <h1 className="text-3xl md:text-4xl font-medium text-white tracking-tighter uppercase font-subheading-main">User Management</h1>
            <p className="text-gray-400 font-medium uppercase tracking-[0.2em] text-[10px] mt-1 opacity-70">View and manage all registered customers</p>
         </div>
      </div>

      <div className="bg-white/5 border border-white/5 rounded-[2rem] md:rounded-[2.5rem] p-4 md:p-8">
         <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div className="relative w-full md:w-96">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
               <input 
                 type="text" 
                 placeholder="Search users by name or email..." 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500/30 transition-all font-medium"
               />
            </div>
         </div>

         {filteredUsers.length === 0 ? (
            <div className="text-center py-20 opacity-50">
               <p className="text-sm font-bold uppercase tracking-widest text-gray-500">No users found matching your search</p>
            </div>
         ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
               {filteredUsers.map((user) => (
                 <div key={user.id} className="bg-white/5 border border-white/5 rounded-3xl p-5 md:p-6 hover:bg-white/[0.08] transition-all group flex flex-col h-full">
                    <div className="flex items-center gap-4 mb-6">
                       <div className="size-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-medium text-xl shadow-lg shadow-indigo-500/20 shrink-0">
                          {user.name?.[0] || "U"}
                       </div>
                       <div className="min-w-0">
                          <h3 className="text-lg font-medium text-white leading-tight uppercase tracking-tight font-subheading-main truncate">{user.name || "Anonymous User"}</h3>
                          <div className="flex flex-wrap items-center gap-2 mt-1.5 font-bold">
                             <p className="text-[9px] font-medium text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">Orders: {user.orderCount || 0}</p>
                             <p className="text-[9px] font-medium text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 whitespace-nowrap">Rs {(user.totalSales || 0).toLocaleString()}</p>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-3 flex-1">
                       <div className="flex items-center gap-3 text-gray-400">
                          <Mail className="size-3.5 text-indigo-500 shrink-0" />
                          <span className="text-xs font-medium truncate">{user.email}</span>
                       </div>
                       <div className="flex items-start gap-3 text-gray-400">
                          <MapPin className="size-3.5 text-indigo-500 mt-0.5 shrink-0" />
                          <span className="text-xs font-medium leading-relaxed">
                             {user.city ? `${user.city}, ` : ""}{user.address || "No Address Provided"}
                          </span>
                       </div>
                       <div className="flex items-center gap-3 text-gray-400">
                          <Phone className="size-3.5 text-indigo-500 shrink-0" />
                          <span className="text-xs font-medium">{user.phone || "No Phone Recorded"}</span>
                       </div>
                       <div className="flex items-center gap-3 text-gray-400">
                          <Calendar className="size-3.5 text-indigo-500 shrink-0" />
                          <span className="text-[11px] font-medium text-gray-500">Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                       </div>
                    </div>

                    <button className="w-full mt-6 py-3 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-indigo-500 hover:text-white hover:border-indigo-500 transition-all flex items-center justify-center gap-2">
                       View Activity <ChevronRight className="size-3" />
                    </button>
                 </div>
               ))}
            </div>
         )}
      </div>
    </div>
  );
}
