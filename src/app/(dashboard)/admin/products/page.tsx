"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import NextImage from "next/image";
import api from "@/lib/axios";
import { 
  Search, 
  Trash2, 
  Loader2,
  Store,
  ExternalLink
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminProductsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-all-products"],
    queryFn: async () => {
      const res = await api.get("/products/all");
      return res.data;
    }
  });

  const deleteProduct = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/product/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-all-products"] });
      toast({ variant: "success", title: "Deleted", description: "Product removed by admin" });
    }
  });

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="size-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  const products = data?.products || [];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
         <h1 className="text-4xl font-medium text-white tracking-tighter uppercase font-subheading-main">Global Inventory</h1>
         <p className="text-gray-400 font-medium uppercase tracking-[0.2em] text-[10px] mt-1 opacity-70">Monitor and manage all products across all sellers</p>
      </div>

      <div className="bg-white/5 border border-white/5 rounded-[2.5rem] p-8">
         <div className="flex items-center justify-between mb-8">
            <div className="relative w-96">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
               <input 
                 type="text" 
                 placeholder="Search global inventory..." 
                 className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500/30 transition-all font-medium"
               />
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="border-b border-white/5">
                     <th className="pb-4 text-[10px] font-medium text-gray-500 uppercase tracking-widest px-4">Product</th>
                     <th className="pb-4 text-[10px] font-medium text-gray-500 uppercase tracking-widest px-4">Seller</th>
                     <th className="pb-4 text-[10px] font-medium text-gray-500 uppercase tracking-widest px-4">Category</th>
                     <th className="pb-4 text-[10px] font-medium text-gray-500 uppercase tracking-widest px-4">Stock</th>
                     <th className="pb-4 text-[10px] font-medium text-gray-500 uppercase tracking-widest px-4 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {products.map((p: {
                    id: number;
                    image: string;
                    title: string;
                    price: number;
                    seller: { name: string };
                    category?: { name: string };
                    stock: number;
                  }) => (
                    <tr key={p.id} className="group hover:bg-white/[0.02] transition-colors">
                       <td className="py-6 px-4">
                          <div className="flex items-center gap-4">
                             <div className="relative size-12 rounded-xl bg-white/5 border border-white/5 overflow-hidden">
                                {p.image ? (
                                  <NextImage src={p.image} fill className="object-cover" alt="" unoptimized />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-600 font-medium">?</div>
                                )}
                             </div>
                             <div>
                                <p className="text-sm font-bold text-white">{p.title}</p>
                                <p className="text-xs font-medium text-indigo-400 mt-1">${p.price.toFixed(2)}</p>
                             </div>
                          </div>
                       </td>
                       <td className="py-6 px-4">
                          <div className="flex items-center gap-2 text-gray-300">
                             <Store className="size-3.5 text-indigo-500" />
                             <span className="text-xs font-bold">{p.seller?.name}</span>
                          </div>
                       </td>
                       <td className="py-6 px-4 text-xs font-bold text-gray-500">
                          {p.category?.name}
                       </td>
                       <td className="py-6 px-4">
                          <span className="text-xs font-black text-white">{p.stock} units</span>
                       </td>
                       <td className="py-6 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                             <button className="size-9 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                                <ExternalLink className="size-4 text-gray-500" />
                             </button>
                             <button 
                               onClick={() => {
                                 if (confirm("Delete this product from the platform?")) {
                                   deleteProduct.mutate(p.id);
                                 }
                               }}
                               className="size-9 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                             >
                                <Trash2 className="size-4 text-red-500 hover:text-white" />
                             </button>
                          </div>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
