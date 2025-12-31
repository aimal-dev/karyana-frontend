"use client"

import { cn } from "@/lib/utils";
import { Eye } from "lucide-react";

interface OrderItem {
  id: string | number;
  customer: string;
  email: string;
  product: string;
  date: string;
  status: string;
  price: string | number;
}

interface OrdersTableProps {
  orders?: OrderItem[];
  title?: string;
  subtitle?: string;
  onView?: (id: string | number) => void;
}

const defaultOrders: OrderItem[] = [
  { id: "#1001", customer: "John Doe", email: "john@example.com", product: "Fresh Milk", date: "03-03-2024", status: "DELIVERED", price: "$45.00" },
  { id: "#1002", customer: "Jane Smith", email: "jane@example.com", product: "Organic Eggs", date: "07-03-2024", status: "PENDING", price: "$12.00" },
  { id: "#1003", customer: "Bob Johnson", email: "bob@example.com", product: "Basmati Rice", date: "10-03-2024", status: "PROCESSING", price: "$89.00" },
];

const statusStyles = {
  DELIVERED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  PENDING: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  PROCESSING: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  SHIPPED: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  COMPLETED: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  CANCELLED: "bg-red-500/10 text-red-400 border-red-500/20",
};

export function OrdersTable({ orders = defaultOrders, title = "Recent Orders", subtitle = "A list of recent orders with their details", onView }: OrdersTableProps) {
  return (
    <div className="bg-white/5 border border-white/5 rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-8 overflow-hidden">
      <div className="flex items-center justify-between mb-8">
         <div>
            <h3 className="text-xl font-medium text-white uppercase tracking-tight font-subheading-main">{title}</h3>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">{subtitle}</p>
         </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5">
              <th className="pb-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest px-4">Order ID</th>
              <th className="pb-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest px-4">Customer Name</th>
              <th className="pb-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest px-4">Product</th>
              <th className="pb-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest px-4">Date</th>
              <th className="pb-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest px-4">Status</th>
              <th className="pb-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest px-4">Price</th>
              <th className="pb-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {orders.length === 0 ? (
               <tr>
                  <td colSpan={7} className="py-10 text-center text-gray-500 font-bold uppercase tracking-widest text-xs">No recent orders found</td>
               </tr>
            ) : (
               orders.map((order, idx) => (
               <tr key={idx} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-4 text-sm font-bold text-white">#{order.id}</td>
                  <td className="py-4 px-4">
                     <div className="flex flex-col">
                        <span className="text-sm font-bold text-white">{order.customer}</span>
                        <span className="text-[10px] font-medium text-gray-500">{order.email}</span>
                     </div>
                  </td>
                  <td className="py-4 px-4 text-sm font-bold text-gray-300 line-clamp-1 max-w-[150px]">{order.product}</td>
                  <td className="py-4 px-4 text-sm font-bold text-gray-400">{order.date}</td>
                  <td className="py-4 px-4">
                     <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                        statusStyles[order.status as keyof typeof statusStyles] || "bg-gray-500/10 text-gray-400 border-gray-500/20"
                     )}>
                        {order.status}
                     </span>
                  </td>
                  <td className="py-4 px-4 text-sm font-black text-white">{typeof order.price === 'number' ? `Rs ${order.price.toLocaleString()}` : order.price}</td>
                  <td className="py-4 px-4 text-right">
                     <button 
                       onClick={() => onView?.(order.id)}
                       className="size-8 ml-auto rounded-lg bg-white/5 border border-white/5 flex items-center justify-center hover:bg-indigo-500 hover:text-white hover:border-indigo-500 transition-all group/btn shadow-xl"
                     >
                        <Eye className="size-4 text-gray-400 group-hover/btn:text-white transition-colors" />
                     </button>
                  </td>
               </tr>
               ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
