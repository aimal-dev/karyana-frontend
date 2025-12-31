"use client"

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Loader2, User } from "lucide-react";


interface Customer {
  id: number;
  name: string;
  email: string;
  orderCount: number;
  totalSales: number;
}

export default function SellerCustomersPage() {
  const { data: customers, isLoading } = useQuery<Customer[]>({
    queryKey: ["seller-customers"],
    queryFn: async () => {
      const response = await api.get("/user/seller-customers");
      return response.data.customers;
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
    <div className="space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
         <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium text-white tracking-tighter uppercase font-subheading-main">Customer Management</h1>
         <p className="text-gray-400 font-medium uppercase tracking-[0.2em] text-[9px] md:text-[10px] mt-1 opacity-70">View your customers and their purchase history</p>
      </div>

      <div className="bg-white/5 border border-white/5 rounded-[1.5rem] md:rounded-[2.5rem] p-4 md:p-8">
          {customers?.length === 0 ? (
            <div className="py-20 text-center">
               <User className="size-12 md:size-16 text-gray-700 mx-auto mb-4" />
               <h3 className="text-xl font-medium text-white uppercase font-subheading-main">No customers yet</h3>
               <p className="text-gray-500 font-medium text-[10px] md:text-xs uppercase tracking-widest mt-2 opacity-70">Customers will appear here once they purchase from the store</p>
            </div>
         ) : (
            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="bg-white/5 border-b border-white/5">
                        <th className="px-4 md:px-8 py-4 md:py-7 text-[9px] md:text-[10px] font-medium text-gray-500 uppercase tracking-[0.2em]">Customer Name</th>
                        <th className="px-4 md:px-8 py-4 md:py-7 text-[9px] md:text-[10px] font-medium text-gray-500 uppercase tracking-[0.2em]">Email</th>
                        <th className="px-4 md:px-8 py-4 md:py-7 text-[9px] md:text-[10px] font-medium text-gray-500 uppercase tracking-[0.2em] text-center">Total Orders</th>
                        <th className="px-4 md:px-8 py-4 md:py-7 text-[9px] md:text-[10px] font-medium text-gray-500 uppercase tracking-[0.2em] text-right pr-6 md:pr-10">Lifetime Value</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                     {customers?.map((user: Customer) => (
                       <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                          <td className="px-4 md:px-8 py-4 md:py-6">
                             <div className="flex items-center gap-4">
                                <div className="size-8 md:size-10 rounded-lg md:rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-medium text-xs md:text-sm shadow-lg shadow-indigo-500/20">
                                   {user.name?.[0] || "U"}
                                </div>
                                <span className="text-xs md:text-sm font-medium text-white uppercase tracking-tight font-subheading-main">{user.name || "Anonymous"}</span>
                             </div>
                          </td>
                          <td className="px-4 md:px-8 py-4 md:py-6">
                             <span className="text-[10px] md:text-xs font-medium text-gray-500">{user.email}</span>
                          </td>
                          <td className="px-4 md:px-8 py-4 md:py-6 text-center">
                             <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] md:text-xs font-medium text-white">
                                {user.orderCount}
                             </span>
                          </td>
                          <td className="px-4 md:px-8 py-4 md:py-6 text-right pr-6 md:pr-10">
                             <span className="text-xs md:text-sm font-medium text-emerald-400">Rs {user.totalSales?.toLocaleString()}</span>
                          </td>
                       </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         )}
      </div>
    </div>
  );
}
