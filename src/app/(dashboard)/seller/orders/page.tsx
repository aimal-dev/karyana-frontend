"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useState } from "react";
import { 
  Loader2, 
  Eye,
  Calendar,
  Package,
  User,
  MapPin,
  Phone,
  CreditCard,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const statusColors = {
  PENDING: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  PROCESSING: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  SHIPPED: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
  DELIVERED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  COMPLETED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  CANCELLED: "bg-red-500/10 text-red-500 border-red-500/20",
};

interface Order {
  id: number;
  status: string;
  total: number;
  createdAt: string;
  user?: { name: string; email: string };
  items: { qty: number; product?: { title: string; price: number } }[];
  shippingAddress?: string;
  shippingCity?: string;
  shippingPhone?: string;
}

export default function SellerOrdersPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ["seller-orders"],
    queryFn: async () => {
      const res = await api.get("/orders");
      return res.data.orders;
    }
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: number, status: string }) => {
      await api.put(`/orders/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller-orders"] });
      toast({ variant: "success", title: "Updated", description: "Order status updated successfully" });
    }
  });

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="size-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  const filteredOrders = filterStatus === "all" 
    ? orders 
    : orders?.filter(o => o.status === filterStatus);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
         <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium text-white tracking-tighter uppercase font-subheading-main">Order Management</h1>
         <p className="text-gray-400 font-medium uppercase tracking-[0.2em] text-[9px] md:text-[10px] mt-1 opacity-70">Manage process and track your customer orders</p>
      </div>

      {/* Filter Buttons */}
      <div className="flex items-center gap-4 overflow-x-auto pb-2">
         {["all", "PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "COMPLETED", "CANCELLED"].map((status) => (
           <button
             key={status}
             onClick={() => setFilterStatus(status)}
             className={cn(
               "px-5 py-2.5 rounded-xl text-[10px] font-medium uppercase tracking-widest transition-all whitespace-nowrap",
               filterStatus === status 
                ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20" 
                : "text-gray-500 hover:text-gray-300"
             )}
           >
             {status === "all" ? "All Orders" : status}
           </button>
         ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white/5 border border-white/5 rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden">
         {filteredOrders?.length === 0 ? (
            <div className="py-20 text-center">
               <Package className="size-16 text-gray-700 mx-auto mb-4" />
               <h3 className="text-2xl font-medium text-white uppercase font-subheading-main">No orders found</h3>
               <p className="text-gray-500 font-medium text-xs uppercase tracking-widest mt-2 opacity-70">
                  {filterStatus === "all" ? "Awaiting your first order." : `No orders with status ${filterStatus}.`}
               </p>
            </div>
         ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                     <tr className="bg-white/5 border-b border-white/5">
                        <th className="px-4 md:px-8 py-4 md:py-7 text-[9px] md:text-[10px] font-medium text-gray-500 uppercase tracking-[0.2em]">Order</th>
                        <th className="px-4 md:px-8 py-4 md:py-7 text-[9px] md:text-[10px] font-medium text-gray-500 uppercase tracking-[0.2em]">Customer</th>
                        <th className="px-4 md:px-8 py-4 md:py-7 text-[9px] md:text-[10px] font-medium text-gray-500 uppercase tracking-[0.2em]">Details</th>
                        <th className="px-4 md:px-8 py-4 md:py-7 text-[9px] md:text-[10px] font-medium text-gray-500 uppercase tracking-[0.2em]">Revenue</th>
                        <th className="px-4 md:px-8 py-4 md:py-7 text-[9px] md:text-[10px] font-medium text-gray-500 uppercase tracking-[0.2em]">Status Management</th>
                        <th className="px-4 md:px-8 py-4 md:py-7 text-[9px] md:text-[10px] font-medium text-gray-500 uppercase tracking-[0.2em] text-right pr-6 md:pr-12">View</th>
                     </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                    {filteredOrders?.map((order: Order) => (
                       <tr key={order.id} className="hover:bg-white/[0.02] transition-colors group">
                          <td className="px-4 md:px-8 py-6">
                             <div className="flex items-center gap-4">
                                <div className="size-10 md:size-12 rounded-xl md:rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-medium text-xs md:text-sm shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                                   #{order.id}
                                </div>
                               <div>
                                  <div className="text-xs font-medium text-white uppercase tracking-widest font-subheading-main">
                                     {new Date(order.createdAt).toLocaleDateString()}
                                  </div>
                                  <div className="text-[10px] font-medium text-gray-500 mt-1 flex items-center gap-1.5 opacity-60">
                                     <Calendar className="size-3" />
                                     {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </div>
                               </div>
                            </div>
                         </td>
                         <td className="px-8 py-6">
                            <div>
                               <p className="text-xs font-medium text-white">
                                  {order.user?.name || "Guest"}
                               </p>
                               <p className="text-[10px] font-medium text-gray-500 mt-1">{order.user?.email || "No email"}</p>
                            </div>
                         </td>
                         <td className="px-8 py-6">
                            <div className="flex flex-wrap gap-2 max-w-xs">
                               {order.items?.slice(0, 2).map((item, i) => (
                                 <span key={i} className="px-2 py-1 rounded-lg bg-indigo-500/5 border border-indigo-500/10 text-[9px] font-medium text-indigo-300">
                                    {item.qty}x {item.product?.title}
                                 </span>
                               ))}
                               {(order.items?.length || 0) > 2 && (
                                 <span className="px-2 py-1 rounded-lg bg-white/5 text-[9px] font-medium text-gray-500">
                                    +{(order.items?.length || 0) - 2} more
                                 </span>
                               )}
                            </div>
                         </td>
                         <td className="px-8 py-6">
                            <p className="text-sm font-medium text-emerald-400">
                               Rs {order.total?.toLocaleString()}
                            </p>
                         </td>
                         <td className="px-8 py-6">
                            <select
                              value={order.status}
                              onChange={(e) => updateStatus.mutate({ id: order.id, status: e.target.value })}
                              className={cn(
                                "w-full appearance-none bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 text-[10px] font-medium uppercase tracking-widest outline-none focus:border-indigo-500/50 transition-all cursor-pointer font-subheading-main",
                                statusColors[order.status as keyof typeof statusColors]
                              )}
                            >
                               <option value="PENDING">PENDING</option>
                               <option value="PROCESSING">PROCESSING</option>
                               <option value="SHIPPED">SHIPPED</option>
                               <option value="DELIVERED">DELIVERED</option>
                               <option value="COMPLETED">COMPLETED</option>
                               <option value="CANCELLED">CANCELLED</option>
                            </select>
                         </td>
                          <td className="px-4 md:px-8 py-6 text-right pr-6 md:pr-12">
                             <button
                               onClick={() => setViewingOrder(order)}
                               className="size-8 md:size-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 hover:bg-indigo-500 hover:text-white hover:border-indigo-500 transition-all group-hover:scale-110"
                             >
                                <Eye className="size-4" />
                             </button>
                          </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
            </div>
         )}
      </div>

      {/* Order Details Modal */}
      {viewingOrder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
           <div className="bg-[#0A0A0B] border border-white/10 rounded-[2rem] md:rounded-[3rem] max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              {/* Modal Header */}
              <div className="p-6 md:p-10 pb-4 flex flex-col md:flex-row items-start md:items-center justify-between border-b border-white/5 bg-white/[0.02] gap-4">
                 <div className="flex items-center gap-4 md:gap-6">
                    <div className="size-12 md:size-16 rounded-2xl md:rounded-[2rem] bg-indigo-500 flex items-center justify-center text-white font-medium text-xl md:text-2xl shadow-2xl shadow-indigo-500/40">
                       #{viewingOrder.id}
                    </div>
                    <div>
                       <h2 className="text-xl md:text-3xl font-medium text-white tracking-tight uppercase font-subheading-main">Order Details</h2>
                       <div className="flex items-center gap-3 mt-1.5">
                          <span className={cn(
                            "px-2 md:px-3 py-1 rounded-full text-[9px] md:text-[10px] font-medium uppercase tracking-widest border",
                            statusColors[viewingOrder.status as keyof typeof statusColors]
                          )}>
                             {viewingOrder.status}
                          </span>
                       </div>
                    </div>
                 </div>
                 <button 
                   onClick={() => setViewingOrder(null)}
                   className="absolute top-6 right-6 md:relative md:top-0 md:right-0 size-10 md:size-12 rounded-2xl bg-white/5 hover:bg-red-500/10 border border-white/5 hover:border-red-500/20 flex items-center justify-center text-gray-400 hover:text-red-500 transition-all"
                 >
                    <X className="size-5" />
                 </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 md:p-10 space-y-6 md:space-y-10">
                 
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
                    <div className="space-y-6">
                       <h4 className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-[0.2em] border-l-2 border-indigo-500 pl-4">
                          <User className="size-4" /> Customer Summary
                       </h4>
                       <div className="space-y-1 pl-4">
                          <p className="text-lg font-medium text-white">{viewingOrder.user?.name || "Guest Customer"}</p>
                          <p className="text-sm font-medium text-gray-500">{viewingOrder.user?.email || "No email available"}</p>
                       </div>
                    </div>

                    <div className="space-y-6">
                       <h4 className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-[0.2em] border-l-2 border-teal-500 pl-4">
                          <MapPin className="size-4" /> Shipping Info
                       </h4>
                       <div className="space-y-1 pl-4">
                          <p className="text-sm font-medium text-white">{viewingOrder.shippingAddress || "No address provided"}</p>
                          <p className="text-sm font-medium text-gray-500">{viewingOrder.shippingCity || "Unknown City"}</p>
                          <p className="text-sm font-bold text-indigo-400 mt-2 flex items-center gap-2">
                             <Phone className="size-3.5" /> {viewingOrder.shippingPhone || "No phone provided"}
                          </p>
                       </div>
                    </div>

                    <div className="space-y-6">
                       <h4 className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-[0.2em] border-l-2 border-amber-500 pl-4">
                          <CreditCard className="size-4" /> Payment Status
                       </h4>
                       <div className="space-y-1 pl-4">
                          <p className="text-sm font-medium text-white uppercase tracking-widest">Post-Delivery Collection</p>
                          <p className="text-2xl font-medium text-emerald-400 mt-1">Rs {viewingOrder.total?.toLocaleString()}</p>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-8">
                    <h4 className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-[0.2em] border-l-2 border-purple-500 pl-4">
                       <Package className="size-4" /> Item Inventory
                    </h4>
                    
                    <div className="grid gap-4">
                       {viewingOrder.items.map((item, i) => (
                         <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between group/item hover:bg-white/[0.08] transition-all">
                            <div className="flex items-center gap-4">
                               <div className="size-10 rounded-xl bg-indigo-500/10 flex items-center justify-center font-medium text-indigo-500 text-xs translate-y-0 group-hover/item:-translate-y-1 transition-transform">
                                  {item.qty}x
                               </div>
                               <div>
                                  <p className="text-sm font-medium text-white">{item.product?.title}</p>
                                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">Unit Price: Rs {(item.product?.price || 0).toLocaleString()}</p>
                               </div>
                            </div>
                            <p className="text-sm font-medium text-white">Rs {((item.product?.price || 0) * item.qty).toLocaleString()}</p>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 md:p-8 border-t border-white/5 bg-white/[0.02] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                 <div className="flex flex-col">
                    <span className="text-[9px] md:text-[10px] font-medium text-gray-600 uppercase tracking-widest">Total Transaction Value</span>
                    <span className="text-2xl md:text-3xl font-medium text-white">Rs {viewingOrder.total?.toLocaleString()}</span>
                 </div>
                 <button 
                   onClick={() => setViewingOrder(null)}
                   className="w-full md:w-auto px-8 h-12 md:h-14 rounded-2xl bg-indigo-500 text-white font-medium uppercase tracking-[0.15em] text-[10px] md:text-xs hover:bg-indigo-600 shadow-2xl shadow-indigo-500/30 transition-all hover:scale-105 active:scale-95"
                 >
                    Acknowledge Review
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
