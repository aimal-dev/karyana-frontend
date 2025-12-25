"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Loader2, CheckCircle, XCircle, Mail, Calendar, UserCheck, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface Seller {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  approved: boolean;
}

export default function AdminSellersPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<"all" | "pending" | "active">("all");

  const { data: sellers, isLoading } = useQuery({
    queryKey: ["admin-sellers", filter],
    queryFn: async () => {
      let url = "/admin/sellers";
      if (filter === "pending") url += "?approved=false";
      if (filter === "active") url += "?approved=true";
      const response = await api.get(url);
      return response.data.sellers;
    }
  });

  const approveSeller = useMutation({
    mutationFn: async (id: number) => {
      await api.put(`/admin/sellers/${id}/approve`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-sellers"] });
      toast({ variant: "success", title: "Success", description: "Seller approved successfully" });
    }
  });

  const rejectSeller = useMutation({
    mutationFn: async (id: number) => {
      await api.put(`/admin/sellers/${id}/reject`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-sellers"] });
      toast({ variant: "destructive", title: "Rejected", description: "Seller application rejected" });
    }
  });

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="size-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-end justify-between">
         <div>
            <h1 className="text-4xl font-medium text-white tracking-tighter uppercase font-subheading-main">Seller Management</h1>
            <p className="text-gray-400 font-medium uppercase tracking-[0.2em] text-[10px] mt-1 opacity-70">Review and manage all marketplace sellers</p>
         </div>
         
         <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
            {[
              { id: "all", label: "All Sellers" },
              { id: "pending", label: "Pending" },
              { id: "active", label: "Approved" }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id as any)}
                className={`px-6 py-2 rounded-xl text-[10px] font-medium uppercase tracking-widest transition-all ${
                  filter === f.id 
                    ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20" 
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {f.label}
              </button>
            ))}
         </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
         {sellers?.length === 0 ? (
           <div className="bg-white/5 border border-dashed border-white/10 rounded-[2rem] p-20 flex flex-col items-center justify-center text-center">
              <div className="size-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                 <CheckCircle className="size-10 text-gray-600" />
              </div>
              <h3 className="text-xl font-medium text-white">No sellers found</h3>
              <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mt-2 italic">Try changing your filters</p>
           </div>
         ) : (
           sellers?.map((seller: { id: number, name: string, email: string, createdAt: string, approved: boolean }) => (
             <div key={seller.id} className="bg-white/5 border border-white/5 rounded-3xl p-8 flex items-center justify-between group hover:bg-white/[0.08] transition-all duration-300">
                <div className="flex items-center gap-8">
                   <div className={`size-16 rounded-2xl flex items-center justify-center font-medium text-2xl shadow-xl transition-all duration-500 ${
                     seller.approved 
                       ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 shadow-emerald-500/5" 
                       : "bg-amber-500/10 border border-amber-500/20 text-amber-500 shadow-amber-500/5"
                   }`}>
                      {seller.name?.[0]}
                   </div>
                   <div className="space-y-1">
                      <h3 className="text-xl font-medium text-white flex items-center gap-3">
                         {seller.name}
                         {seller.approved ? (
                           <span className="bg-emerald-500/10 text-emerald-500 text-[10px] px-3 py-1 rounded-full font-medium uppercase tracking-widest border border-emerald-500/20 flex items-center gap-1.5">
                              <UserCheck className="size-3" />
                              Active Seller
                           </span>
                         ) : (
                           <span className="bg-amber-500/10 text-amber-500 text-[10px] px-3 py-1 rounded-full font-medium uppercase tracking-widest border border-amber-500/20 flex items-center gap-1.5 italic">
                              <Clock className="size-3" />
                              Pending Approval
                           </span>
                         )}
                      </h3>
                      <div className="flex items-center gap-6 pt-2">
                         <div className="flex items-center gap-2 text-gray-500">
                            <Mail className="size-3.5" />
                            <span className="text-xs font-bold">{seller.email}</span>
                         </div>
                         <div className="flex items-center gap-2 text-gray-500">
                            <Calendar className="size-3.5" />
                            <span className="text-xs font-bold">Joined {new Date(seller.createdAt).toLocaleDateString()}</span>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="flex items-center gap-4">
                   {!seller.approved && (
                     <button 
                       onClick={() => approveSeller.mutate(seller.id)}
                       disabled={approveSeller.isPending}
                       className="px-8 py-3.5 rounded-xl bg-indigo-500 text-white font-medium text-xs uppercase tracking-widest shadow-lg shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                     >
                        {approveSeller.isPending ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle className="size-4" />}
                        Approve Seller
                     </button>
                   )}
                   {seller.approved ? (
                     <button 
                        onClick={() => {
                           if (confirm(`Are you sure you want to deactivate ${seller.name}?`)) {
                             rejectSeller.mutate(seller.id);
                           }
                        }}
                        disabled={rejectSeller.isPending}
                        className="px-8 py-3.5 rounded-xl bg-white/5 border border-white/5 text-red-400 font-medium text-xs uppercase tracking-widest hover:bg-red-500/10 transition-all flex items-center gap-2"
                      >
                         {rejectSeller.isPending ? <Loader2 className="size-4 animate-spin" /> : <XCircle className="size-4" />}
                         Deactivate
                      </button>
                   ) : (
                    <button 
                      onClick={() => {
                         if (confirm(`Are you sure you want to reject ${seller.name}?`)) {
                           rejectSeller.mutate(seller.id);
                         }
                      }}
                      disabled={rejectSeller.isPending}
                      className="px-8 py-3.5 rounded-xl bg-white/5 border border-white/5 text-gray-400 font-medium text-xs uppercase tracking-widest hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-all flex items-center gap-2"
                    >
                       {rejectSeller.isPending ? <Loader2 className="size-4 animate-spin" /> : <XCircle className="size-4" />}
                       Reject
                    </button>
                   )}
                </div>
             </div>
           ))
         )}
      </div>
    </div>
  );
}
