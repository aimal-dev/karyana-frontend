"use client"

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import NextImage from "next/image";
import api from "@/lib/axios";
import { 
  Package, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Loader2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ProductModal } from "@/components/dashboard/ProductModal";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { BulkOperations } from "@/components/dashboard/BulkOperations";

export default function SellerProductsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{
    id: number;
    title: string;
    description: string;
    price: number;
    stock: number;
    categoryId: number;
    image: string;
  } | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["seller-products"],
    queryFn: async () => {
      const res = await api.get("/products");
      return res.data;
    }
  });

  const deleteProduct = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/product/${id}`); // Correct: singular /product/:id from router
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller-products"] });
      toast({ variant: "success", title: "Deleted", description: "Product removed successfully" });
    }
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: number[]) => {
      await api.post("/products/delete-many", { ids });
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["seller-products"] });
      toast({ variant: "success", title: "Deleted", description: `${data?.count || 'Selected'} products removed.` });
      setSelectedIds([]);
    }
  });

  const handleEdit = (product: {
    id: number;
    title: string;
    description: string;
    price: number;
    stock: number;
    categoryId: number;
    image: string;
    tags?: string[];
    isFeatured?: boolean;
    isTrending?: boolean;
    isOnSale?: boolean;
    oldPrice?: number;
    images?: { url: string }[];
  }) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="size-10 text-primary animate-spin" />
      </div>
    );
  }

  const products = data?.products || [];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
         <div>
            <h1 className="text-4xl font-black text-white tracking-tight">Products</h1>
            <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px] mt-1">Manage your storefront inventory and stock</p>
         </div>
         <Button 
           onClick={handleCreate}
           className="h-14 px-8 rounded-2xl bg-primary text-white font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all gap-3"
         >
            <Plus className="size-5" />
            Add New Product
         </Button>
      </div>

      {/* Bulk Operations */}
      <div className="flex justify-end -mt-6">
        <BulkOperations onSuccess={() => queryClient.invalidateQueries({ queryKey: ["seller-products"] })} />
      </div>

      <div className="bg-white/5 border border-white/5 rounded-[2.5rem] p-8">
         <div className="flex items-center justify-between mb-8 overflow-hidden">
            <div className="relative w-96">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
               <input 
                 type="text" 
                 placeholder="Search your products..." 
                 className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-primary/30 transition-all font-medium"
               />
            </div>
            
            {selectedIds.length > 0 && (
               <div className="flex items-center gap-4 bg-red-500/10 border border-red-500/20 px-6 py-2 rounded-2xl animate-in fade-in slide-in-from-right-2">
                  <span className="text-red-500 font-black uppercase tracking-widest text-xs whitespace-nowrap">{selectedIds.length} Selected</span>
                  <button 
                    onClick={() => {
                        if (confirm(`Delete ${selectedIds.length} products?`)) {
                            bulkDeleteMutation.mutate(selectedIds);
                        }
                    }}
                    disabled={bulkDeleteMutation.isPending}
                    className="flex items-center gap-2 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-red-500/20"
                  >
                     {bulkDeleteMutation.isPending ? <Loader2 className="size-3 animate-spin" /> : <Trash2 className="size-3" />}
                     Delete
                  </button>
               </div>
            )}

            <div className="flex gap-4">
               <select className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-gray-400 outline-none">
                  <option>All Categories</option>
               </select>
               <select className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-gray-400 outline-none">
                  <option>Latest First</option>
                  <option>Oldest First</option>
                  <option>Price: Low to High</option>
               </select>
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="border-b border-white/5">
                     <th className="pb-4 px-4 w-12">
                        <div className="flex items-center justify-center">
                           <input 
                             type="checkbox" 
                             className="size-4 rounded border-white/20 bg-white/5 checked:bg-primary checked:border-primary transition-all cursor-pointer"
                             checked={products.length > 0 && selectedIds.length === products.length}
                             onChange={(e) => {
                                if (e.target.checked) setSelectedIds(products.map((p: any) => p.id));
                                else setSelectedIds([]);
                             }}
                           />
                        </div>
                     </th>
                     <th className="pb-4 text-[10px] font-black text-gray-500 uppercase tracking-widest px-4">Product Info</th>
                     <th className="pb-4 text-[10px] font-black text-gray-500 uppercase tracking-widest px-4">Category</th>
                     <th className="pb-4 text-[10px] font-black text-gray-500 uppercase tracking-widest px-4">Price</th>
                     <th className="pb-4 text-[10px] font-black text-gray-500 uppercase tracking-widest px-4">Stock Status</th>
                     <th className="pb-4 text-[10px] font-black text-gray-500 uppercase tracking-widest px-4">Created At</th>
                     <th className="pb-4 text-[10px] font-black text-gray-500 uppercase tracking-widest px-4 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {products.length === 0 ? (
                    <tr>
                       <td colSpan={7} className="py-20 text-center">
                          <Package className="size-12 text-gray-700 mx-auto mb-4" />
                          <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">No products found</p>
                       </td>
                    </tr>
                  ) : (
                    products.map((p: {
                      id: number;
                      title: string;
                      description: string;
                      price: number;
                      stock: number;
                      categoryId: number;
                      image: string;
                      createdAt: string;
                      isFeatured?: boolean;
                      isTrending?: boolean;
                      isOnSale?: boolean;
                      category?: { name: string };
                    }) => (
                      <tr key={p.id} className={`group transition-colors ${selectedIds.includes(p.id) ? "bg-primary/5" : "hover:bg-white/[0.02]"}`}>
                         <td className="py-6 px-4">
                            <div className="flex items-center justify-center">
                               <input 
                                 type="checkbox" 
                                 className="size-4 rounded border-white/20 bg-white/5 checked:bg-primary checked:border-primary transition-all cursor-pointer"
                                 checked={selectedIds.includes(p.id)}
                                 onChange={(e) => {
                                    if (e.target.checked) setSelectedIds([...selectedIds, p.id]);
                                    else setSelectedIds(selectedIds.filter(id => id !== p.id));
                                 }}
                               />
                            </div>
                         </td>
                         <td className="py-6 px-4">
                            <div className="flex items-center gap-4">
                               <div className="relative size-12 rounded-xl bg-white/5 border border-white/5 overflow-hidden flex items-center justify-center p-1">
                                  {p.image ? (
                                    <NextImage src={p.image} fill className="object-cover rounded-lg" alt={p.title} unoptimized />
                                  ) : (
                                    <Package className="size-6 text-gray-600" />
                                  )}
                               </div>
                               <div>
                                  <div className="flex items-center gap-2">
                                     <p className="text-sm font-bold text-white leading-tight">{p.title}</p>
                                     <div className="flex gap-1">
                                        {p.isFeatured && (
                                          <span className="bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-tighter">Featured</span>
                                        )}
                                        {p.isTrending && (
                                          <span className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-tighter">Trending</span>
                                        )}
                                        {p.isOnSale && (
                                          <span className="bg-red-500/10 border border-red-500/20 text-red-500 text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-tighter">On Sale</span>
                                        )}
                                     </div>
                                  </div>
                                  <p className="text-[10px] text-gray-500 font-medium truncate max-w-[200px] mt-1">{p.description}</p>
                               </div>
                            </div>
                         </td>
                         <td className="py-6 px-4">
                            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest text-gray-400">
                               {p.category?.name || "Uncategorized"}
                            </span>
                         </td>
                         <td className="py-6 px-4 text-sm font-black text-white">
                            ${p.price.toFixed(2)}
                         </td>
                         <td className="py-6 px-4">
                            <div className="flex flex-col gap-1">
                               <div className="flex items-center gap-2">
                                  <div className={cn(
                                    "size-2 rounded-full",
                                    p.stock > 10 ? "bg-emerald-500" : p.stock > 0 ? "bg-amber-500" : "bg-red-500"
                                  )} />
                                  <span className="text-xs font-black text-white">{p.stock} in stock</span>
                               </div>
                               {p.stock <= 5 && (
                                 <span className="text-[10px] font-bold text-amber-500 uppercase tracking-tighter flex items-center gap-1">
                                    <AlertCircle className="size-3" /> Low Stock
                                 </span>
                               )}
                            </div>
                         </td>
                         <td className="py-6 px-4 text-xs font-bold text-gray-500">
                            {new Date(p.createdAt).toLocaleDateString()}
                         </td>
                         <td className="py-6 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                               <button 
                                 onClick={() => handleEdit(p)}
                                 className="size-9 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 transition-colors group/btn"
                               >
                                  <Edit3 className="size-4 text-gray-500 group-hover/btn:text-white transition-colors" />
                               </button>
                               <button 
                                 onClick={() => {
                                   if (confirm("Are you sure you want to delete this product?")) {
                                     deleteProduct.mutate(p.id);
                                   }
                                 }}
                                 className="size-9 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all group/btn"
                               >
                                  <Trash2 className="size-4 text-red-500 group-hover/btn:text-white transition-colors" />
                               </button>
                            </div>
                         </td>
                      </tr>
                    ))
                  )}
               </tbody>
            </table>
         </div>

         {products.length > 0 && (
           <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-between">
              <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
                 Showing {products.length} of {data?.total || 0} products
              </p>
              <div className="flex gap-2">
                 <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/5 text-[10px] font-black uppercase text-gray-500 hover:bg-white/10 transition-colors">Previous</button>
                 <button className="px-4 py-2 rounded-lg bg-white/10 border border-white/10 text-[10px] font-black uppercase text-white hover:bg-white/20 transition-colors">Next</button>
              </div>
           </div>
         )}
      </div>

      <ProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        product={selectedProduct}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ["seller-products"] })}
      />
    </div>
  );
}
