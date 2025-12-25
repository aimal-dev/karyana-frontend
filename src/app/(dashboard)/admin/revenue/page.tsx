"use client"

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { 
  BarChart3, 
  Loader2, 
  TrendingUp, 
  ShoppingBag, 
  DollarSign, 
  Calendar,
  Filter,
  ArrowUpRight,
  Package
} from "lucide-react";
import { useState } from "react";

interface RevenueProduct {
  productId: number;
  title: string;
  totalQty: number;
  totalRevenue: number;
}

interface RevenueReport {
  totalItems: number;
  products: RevenueProduct[];
}

export default function AdminRevenuePage() {
  const [range, setRange] = useState<"all" | "monthly" | "yearly" | "custom">("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { data: report, isLoading } = useQuery({
    queryKey: ["admin-revenue", range, startDate, endDate],
    queryFn: async () => {
      const url = "/admin/revenue-report";
      const params = new URLSearchParams();
      
      if (range === "monthly") {
        const d = new Date();
        params.append("startDate", new Date(d.getFullYear(), d.getMonth(), 1).toISOString());
      } else if (range === "yearly") {
        const d = new Date();
        params.append("startDate", new Date(d.getFullYear(), 0, 1).toISOString());
      } else if (range === "custom" && startDate && endDate) {
        params.append("startDate", new Date(startDate).toISOString());
        params.append("endDate", new Date(endDate).toISOString());
      }

      const response = await api.get(`${url}?${params.toString()}`);
      return response.data;
    }
  });

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="size-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  const totalRevenue = report?.products?.reduce((sum: number, p: RevenueProduct) => sum + p.totalRevenue, 0) || 0;
  const totalQty = report?.products?.reduce((sum: number, p: RevenueProduct) => sum + p.totalQty, 0) || 0;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-end justify-between">
         <div>
            <h1 className="text-4xl font-medium text-white tracking-tighter uppercase font-subheading-main">Revenue Analytics</h1>
            <p className="text-gray-400 font-medium uppercase tracking-[0.2em] text-[10px] mt-1 opacity-70">Real-time financial performance and sales summary</p>
         </div>

         <div className="flex items-center gap-4 bg-white/5 p-1.5 rounded-2xl border border-white/5">
            {[
              { id: "all", label: "All Time" },
              { id: "monthly", label: "This Month" },
              { id: "yearly", label: "This Year" },
              { id: "custom", label: "Custom Range" }
            ].map((r) => (
              <button
                key={r.id}
                onClick={() => setRange(r.id as any)}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-medium uppercase tracking-widest transition-all ${
                  range === r.id 
                    ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20" 
                    : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                }`}
              >
                {r.label}
              </button>
            ))}
         </div>
      </div>

      {range === "custom" && (
        <div className="bg-white/5 border border-white/5 rounded-3xl p-6 flex items-center gap-6 animate-in zoom-in-95 duration-300">
           <div className="flex-1 space-y-2">
              <label className="text-[10px] font-medium text-gray-500 uppercase tracking-widest ml-1">Start Date</label>
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500/50 transition-all"
              />
           </div>
           <div className="flex-1 space-y-2">
              <label className="text-[10px] font-medium text-gray-500 uppercase tracking-widest ml-1">End Date</label>
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500/50 transition-all"
              />
           </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-500/20 group">
            <div className="relative z-10">
               <div className="size-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-6">
                  <DollarSign className="size-6" />
               </div>
               <p className="text-white/60 font-medium text-[10px] uppercase tracking-[0.2em]">Total Revenue</p>
               <h2 className="text-4xl font-medium mt-2">Rs {totalRevenue.toLocaleString()}</h2>
               <div className="flex items-center gap-2 mt-4 text-white/80 font-bold text-xs">
                  <TrendingUp className="size-4" />
                  <span>Gross income before taxes</span>
               </div>
            </div>
            <BarChart3 className="absolute -right-8 -bottom-8 size-48 text-white/10 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
         </div>

         <div className="bg-white/5 border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden group">
            <div className="size-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 text-emerald-500">
               <ShoppingBag className="size-6" />
            </div>
            <p className="text-gray-500 font-medium text-[10px] uppercase tracking-[0.2em]">Products Sold</p>
            <h2 className="text-4xl font-medium text-white mt-2">{totalQty.toLocaleString()}</h2>
            <div className="flex items-center gap-2 mt-4 text-emerald-500 font-bold text-xs">
               <ArrowUpRight className="size-4" />
               <span>Collective units shipped</span>
            </div>
            <Package className="absolute -right-8 -bottom-8 size-48 text-white/[0.02] -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
         </div>

         <div className="bg-white/5 border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden group">
            <div className="size-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6 text-amber-500">
               <Filter className="size-6" />
            </div>
            <p className="text-gray-500 font-medium text-[10px] uppercase tracking-[0.2em]">Active Report</p>
            <h2 className="text-4xl font-medium text-white mt-2 uppercase">{range}</h2>
            <div className="flex items-center gap-2 mt-4 text-amber-500 font-bold text-xs uppercase tracking-tighter">
               <Calendar className="size-4" />
               <span>{new Date().toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
            </div>
         </div>
      </div>

      {/* Per Product Revenue Table */}
      <div className="bg-white/5 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
         <div className="px-10 py-8 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-xl font-medium text-white flex items-center gap-3 uppercase tracking-tight font-subheading-main">
               <TrendingUp className="size-5 text-indigo-500" />
               Product-wise Breakdown
            </h3>
            <span className="text-[10px] font-medium text-gray-500 uppercase tracking-[0.2em] opacity-70">Detailed Ledger</span>
         </div>
         
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-white/[0.02]">
                     <th className="px-10 py-6 text-[10px] font-medium text-gray-500 uppercase tracking-[0.2em]">Product Details</th>
                     <th className="px-10 py-6 text-[10px] font-medium text-gray-500 uppercase tracking-[0.2em]">Quantity</th>
                     <th className="px-10 py-6 text-[10px] font-medium text-gray-500 uppercase tracking-[0.2em]">Price Avg.</th>
                     <th className="px-10 py-6 text-[10px] font-medium text-gray-500 uppercase tracking-[0.2em] text-right">Net Revenue</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {report?.products?.map((p: RevenueProduct) => (
                    <tr key={p.productId} className="hover:bg-white/[0.02] transition-colors group">
                       <td className="px-10 py-6">
                          <div className="flex items-center gap-4">
                             <div className="size-12 rounded-xl bg-white/5 flex items-center justify-center text-white font-medium group-hover:bg-indigo-500 transition-colors">
                                {p.title?.[0]}
                             </div>
                             <div>
                                <h4 className="text-sm font-medium text-white">{p.title}</h4>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">ID: #{p.productId}</p>
                             </div>
                          </div>
                       </td>
                       <td className="px-10 py-6">
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/5 border border-white/5 text-xs font-medium text-gray-300">
                             {p.totalQty} Units
                          </span>
                       </td>
                       <td className="px-10 py-6">
                          <span className="text-xs font-bold text-gray-400">Rs {(p.totalRevenue / p.totalQty).toFixed(0)}</span>
                       </td>
                       <td className="px-10 py-6 text-right">
                          <span className="text-sm font-medium text-white">Rs {p.totalRevenue.toLocaleString()}</span>
                       </td>
                    </tr>
                  ))}
                  {(!report?.products || report.products.length === 0) && (
                    <tr>
                       <td colSpan={4} className="px-10 py-20 text-center">
                          <p className="text-gray-500 font-medium text-xs uppercase tracking-[0.2em]">No revenue data found for this period</p>
                       </td>
                    </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
