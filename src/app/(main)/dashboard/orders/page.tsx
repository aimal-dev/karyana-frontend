"use client"

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { 
  Search, 
  Filter, 
  ShoppingBag, 
  Eye,
  Loader2
} from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";

interface Order {
  id: number;
  total: number;
  status: string;
  createdAt: string;
  items: unknown[];
}

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["orders", search, status, page],
    queryFn: async () => {
      const params: Record<string, string | number> = { page, limit: 10 };
      if (search) params.search = search;
      if (status !== "ALL") params.status = status;
      
      const res = await api.get("/orders", { params });
      return res.data;
    },
    refetchInterval: 5000
    });

  const orders = data?.orders || [];
  const totalPages = data ? Math.ceil(data.total / data.limit) : 1;

  const STATUS_COLORS: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    PROCESSING: "bg-blue-100 text-blue-700",
    DELIVERED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
    PAYMENT_FAILED: "bg-red-100 text-red-700",
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-3xl font-black text-gray-900 tracking-tight">My Orders</h1>
           <p className="text-gray-500 font-medium text-sm mt-1">Track and manage your recent orders.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
         <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <Input 
              placeholder="Search by Order ID..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-12 bg-white border-gray-200 rounded-xl"
            />
         </div>
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Button variant="outline" className="h-12 px-6 rounded-xl border-gray-200 gap-2 bg-white">
                 <Filter className="size-4" />
                 Status: <span className="text-primary font-bold">{status}</span>
               </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl">
               {["ALL", "PENDING", "PROCESSING", "DELIVERED", "CANCELLED"].map(s => (
                 <DropdownMenuItem 
                   key={s} 
                   onClick={() => setStatus(s)}
                   className="font-bold text-xs p-3 cursor-pointer"
                 >
                   {s}
                 </DropdownMenuItem>
               ))}
            </DropdownMenuContent>
         </DropdownMenu>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden overflow-x-auto">
        {isLoading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center p-12 space-y-4">
            <div className="size-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
               <ShoppingBag className="size-8" />
            </div>
            <p className="text-gray-500 font-medium">No orders found.</p>
          </div>
        ) : (
          <table className="w-full text-left">
             <thead className="bg-[#F8F9FC] border-b border-gray-100">
                <tr>
                   <th className="p-6 font-black text-xs text-gray-400 uppercase tracking-wider">Order ID</th>
                   <th className="p-6 font-black text-xs text-gray-400 uppercase tracking-wider">Date</th>
                   <th className="p-6 font-black text-xs text-gray-400 uppercase tracking-wider">Status</th>
                   <th className="p-6 font-black text-xs text-gray-400 uppercase tracking-wider text-right">Total</th>
                   <th className="p-6 font-black text-xs text-gray-400 uppercase tracking-wider text-center">Action</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-gray-100">
                {orders.map((order: Order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                     <td className="p-6 font-bold text-gray-900">#{order.id}</td>
                     <td className="p-6 text-sm text-gray-500 font-medium">
                       {new Date(order.createdAt).toLocaleDateString()}
                     </td>
                     <td className="p-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-700"}`}>
                           {order.status}
                        </span>
                     </td>
                     <td className="p-6 text-right font-black text-gray-900">
                        Rs {order.total.toLocaleString()}
                     </td>
                     <td className="p-6 flex justify-center">
                        <Link href={`/orders/${order.id}`}>
                           <Button variant="ghost" size="icon" className="rounded-xl hover:text-primary">
                             <Eye className="size-5" />
                           </Button>
                        </Link>
                     </td>
                  </tr>
                ))}
             </tbody>
          </table>
        )}

        {/* Simple Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 p-6 border-t border-gray-100">
             <Button 
               variant="outline" 
               disabled={page === 1}
               onClick={() => setPage(p => p - 1)}
               className="rounded-xl font-bold"
             >
               Previous
             </Button>
             <span className="flex items-center px-4 font-black text-sm text-gray-400">
               Page {page} of {totalPages}
             </span>
             <Button 
               variant="outline" 
               disabled={page === totalPages}
               onClick={() => setPage(p => p + 1)}
               className="rounded-xl font-bold"
             >
               Next
             </Button>
          </div>
        )}
      </div>
    </div>
  );
}
