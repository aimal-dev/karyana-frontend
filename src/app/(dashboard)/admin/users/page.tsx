"use client"

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

export default function AdminUsersPage() {
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

  const users = data?.users || [];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
         <h1 className="text-4xl font-medium text-white tracking-tighter uppercase font-subheading-main">User Management</h1>
         <p className="text-gray-400 font-medium uppercase tracking-[0.2em] text-[10px] mt-1 opacity-70">View and manage all registered customers</p>
      </div>

      <div className="bg-white/5 border border-white/5 rounded-[2.5rem] p-8">
         <div className="flex items-center justify-between mb-8">
            <div className="relative w-96">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
               <input 
                 type="text" 
                 placeholder="Search users by name or email..." 
                 className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500/30 transition-all font-medium"
               />
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user: {
              id: number;
              name: string;
              email: string;
              city?: string;
              address?: string;
              phone?: string;
              createdAt: string;
              totalSales?: number;
              orderCount?: number;
            }) => (
              <div key={user.id} className="bg-white/5 border border-white/5 rounded-3xl p-6 hover:bg-white/[0.08] transition-all group">
                 <div className="flex items-center gap-4 mb-6">
                    <div className="size-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-medium text-xl shadow-lg shadow-indigo-500/20">
                       {user.name?.[0] || "U"}
                    </div>
                    <div>
                       <h3 className="text-lg font-medium text-white leading-tight uppercase tracking-tight font-subheading-main">{user.name || "Anonymous User"}</h3>
                       <div className="flex items-center gap-3 mt-1.5">
                          <p className="text-[10px] font-medium text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">Orders: {user.orderCount || 0}</p>
                          <p className="text-[10px] font-medium text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Value: Rs {(user.totalSales || 0).toLocaleString()}</p>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-3">
                    <div className="flex items-center gap-3 text-gray-400">
                       <Mail className="size-3.5 text-indigo-500" />
                       <span className="text-xs font-medium">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-400">
                       <MapPin className="size-3.5 text-indigo-500" />
                       <span className="text-xs font-medium">{user.city || "No City"}, {user.address || "No Address"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-400">
                       <Phone className="size-3.5 text-indigo-500" />
                       <span className="text-xs font-medium">{user.phone || "No Phone"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-400">
                       <Calendar className="size-3.5 text-indigo-500" />
                       <span className="text-xs font-medium text-gray-500">Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                 </div>

                 <button className="w-full mt-6 py-3 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-indigo-500 hover:text-white hover:border-indigo-500 transition-all flex items-center justify-center gap-2">
                    View Activity <ChevronRight className="size-3" />
                 </button>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
}
