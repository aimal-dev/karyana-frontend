"use client"

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useState } from "react";
import { 
  Loader2, 
  DollarSign, 
  ShoppingBag, 
  TrendingUp, 
  Filter,
  Calendar,
  ArrowUpRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductRevenue {
  productId: number;
  title: string;
  totalQty: number;
  totalRevenue: number;
}

export default function SellerRevenuePage() {
  const [range, setRange] = useState("week");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["seller-revenue", range, startDate, endDate],
    queryFn: async () => {
      let url = `/revenue/seller?range=${range}`;
      if (range === "custom" && startDate && endDate) {
        url += `&startDate=${startDate}&endDate=${endDate}`;
      }
      const response = await api.get(url);
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

  const totalRevenue = data?.products?.reduce((sum: number, p: ProductRevenue) => sum + p.totalRevenue, 0) || 0;
  const totalQty = data?.products?.reduce((sum: number, p: ProductRevenue) => sum + p.totalQty, 0) || 0;

  const ranges = [
    { id: "week", label: "This Week" },
    { id: "month", label: "This Month" },
    { id: "year", label: "This Year" },
    { id: "custom", label: "Custom Range" }
  ];

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
         <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium text-white tracking-tighter uppercase font-subheading-main">Revenue Analytics</h1>
            <p className="text-gray-400 font-medium uppercase tracking-[0.2em] text-[9px] md:text-[10px] mt-1 opacity-70">Track your sales performance and product revenue</p>
         </div>

         <div className="w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
            <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/5 min-w-max">
               {ranges.map(r => (
                 <button
                   key={r.id}
                   onClick={() => setRange(r.id as any)}
                   className={cn(
                     "px-4 md:px-6 py-2 md:py-2.5 rounded-xl text-[9px] md:text-[10px] font-medium uppercase tracking-widest transition-all",
                     range === r.id 
                       ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20" 
                       : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                   )}
                 >
                   {r.label}
                 </button>
               ))}
            </div>
         </div>
      </div>

      {range === "custom" && (
        <div className="grid grid-cols-1 md:grid-cols-2 bg-white/5 border border-white/5 rounded-3xl p-6 gap-6 animate-in zoom-in-95 duration-300">
           <div className="space-y-2">
              <label className="text-[10px] font-medium text-gray-500 uppercase tracking-widest ml-1">Start Date</label>
              <input 
                type="date" 
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50"
              />
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-medium text-gray-500 uppercase tracking-widest ml-1">End Date</label>
              <input 
                type="date" 
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50"
              />
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 text-white shadow-2xl shadow-indigo-500/20">
            <div className="size-10 md:size-12 rounded-xl md:rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-6">
               <DollarSign className="size-5 md:size-6" />
            </div>
            <p className="text-white/60 font-medium text-[9px] md:text-[10px] uppercase tracking-[0.2em]">Total Revenue</p>
            <h2 className="text-3xl md:text-4xl font-medium mt-2">Rs {totalRevenue.toLocaleString()}</h2>
            <div className="flex items-center gap-2 mt-4 text-white/80 font-bold text-[10px] md:text-xs">
               <TrendingUp className="size-3 md:size-4" />
               <span>Gross income before taxes</span>
            </div>
         </div>

         <div className="bg-white/5 border border-white/5 rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8">
            <div className="size-10 md:size-12 rounded-xl md:rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 text-emerald-500">
               <ShoppingBag className="size-5 md:size-6" />
            </div>
            <p className="text-gray-500 font-medium text-[9px] md:text-[10px] uppercase tracking-[0.2em]">Products Sold</p>
            <h2 className="text-3xl md:text-4xl font-medium text-white mt-2">{totalQty.toLocaleString()}</h2>
            <div className="flex items-center gap-2 mt-4 text-emerald-500 font-bold text-[10px] md:text-xs">
               <ArrowUpRight className="size-3 md:size-4" />
               <span>Collective units shipped</span>
            </div>
         </div>

         <div className="bg-white/5 border border-white/5 rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8">
            <div className="size-10 md:size-12 rounded-xl md:rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6 text-amber-500">
               <Filter className="size-5 md:size-6" />
            </div>
            <p className="text-gray-500 font-medium text-[9px] md:text-[10px] uppercase tracking-[0.2em]">Active Report</p>
            <h2 className="text-3xl md:text-4xl font-medium text-white mt-2 uppercase">{range}</h2>
            <div className="flex items-center gap-2 mt-4 text-amber-500 font-bold text-[10px] md:text-xs uppercase tracking-tighter">
               <Calendar className="size-3 md:size-4" />
               <span>{new Date().toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
            </div>
         </div>
      </div>

      {/* Product-wise Revenue Table */}
      <div className="bg-white/5 border border-white/5 rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl">
         <div className="px-6 md:px-10 py-6 md:py-8 border-b border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h3 className="text-lg md:text-xl font-medium text-white flex items-center gap-3 uppercase tracking-tight font-subheading-main">
               <TrendingUp className="size-4 md:size-5 text-indigo-500" />
               Product-wise Breakdown
            </h3>
            <span className="text-[9px] md:text-[10px] font-medium text-gray-500 uppercase tracking-[0.2em] opacity-70">Detailed Ledger</span>
         </div>
         
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-white/[0.02]">
                     <th className="px-6 md:px-10 py-4 md:py-6 text-[9px] md:text-[10px] font-medium text-gray-500 uppercase tracking-[0.2em]">Product Details</th>
                     <th className="px-6 md:px-10 py-4 md:py-6 text-[9px] md:text-[10px] font-medium text-gray-500 uppercase tracking-[0.2em]">Quantity</th>
                     <th className="px-6 md:px-10 py-4 md:py-6 text-[9px] md:text-[10px] font-medium text-gray-500 uppercase tracking-[0.2em]">Price Avg.</th>
                     <th className="px-6 md:px-10 py-4 md:py-6 text-[9px] md:text-[10px] font-medium text-gray-500 uppercase tracking-[0.2em] text-right pr-6 md:pr-10">Net Revenue</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {data?.products?.map((p: ProductRevenue) => (
                    <tr key={p.productId} className="hover:bg-white/[0.02] transition-colors group">
                       <td className="px-6 md:px-10 py-4 md:py-6">
                          <div className="flex items-center gap-4">
                             <div className="size-10 md:size-12 rounded-xl bg-white/5 flex items-center justify-center text-white font-medium group-hover:bg-indigo-500 transition-colors">
                                {p.title?.[0]}
                             </div>
                             <div>
                                <h4 className="text-xs md:text-sm font-medium text-white">{p.title}</h4>
                                <p className="text-[9px] md:text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">ID: #{p.productId}</p>
                             </div>
                          </div>
                       </td>
                       <td className="px-6 md:px-10 py-4 md:py-6">
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] md:text-xs font-medium text-gray-300">
                             {p.totalQty} Units
                          </span>
                       </td>
                       <td className="px-6 md:px-10 py-4 md:py-6">
                          <span className="text-[10px] md:text-xs font-bold text-gray-400">Rs {(p.totalRevenue / p.totalQty).toFixed(0)}</span>
                       </td>
                       <td className="px-6 md:px-10 py-4 md:py-6 text-right pr-6 md:pr-10">
                          <span className="text-xs md:text-sm font-medium text-white">Rs {p.totalRevenue.toLocaleString()}</span>
                       </td>
                    </tr>
                  ))}
                  {(!data?.products || data.products.length === 0) && (
                    <tr>
                       <td colSpan={4} className="px-6 md:px-10 py-20 text-center">
                          <p className="text-gray-500 font-medium text-[10px] md:text-xs uppercase tracking-[0.2em]">No revenue data found for this period</p>
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
