"use client"

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import NextImage from "next/image";
import api from "@/lib/axios";
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Loader2,
  Store,
  Layers,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CategoryModal } from "@/components/dashboard/CategoryModal";
import { BulkOperations } from "@/components/dashboard/BulkOperations";
import { useToast } from "@/hooks/use-toast";

export default function AdminCategoriesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<{
    id: number;
    name: string;
    image: string | null;
  } | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-categories-list"],
    queryFn: async () => {
      const res = await api.get("/category/all");
      return res.data;
    }
  });

  const deleteCategory = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/category/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories-list"] });
      toast({ variant: "success", title: "Deleted", description: "Category removed globally" });
    },
    onError: (error: any) => {
      toast({ 
        variant: "destructive", 
        title: "Error", 
        description: error.response?.data?.error || "Failed to delete category" 
      });
    }
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: number[]) => {
      await api.post("/category/delete-many", { ids });
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories-list"] });
      toast({ variant: "success", title: "Deleted", description: `${data?.count || 'Selected'} categories removed.` });
      setSelectedIds([]);
    },
    onError: (error: any) => {
      toast({ 
        variant: "destructive", 
        title: "Error", 
        description: error.response?.data?.error || "Failed to delete categories" 
      });
    }
  });

  const handleEdit = (cat: { id: number; name: string; image: string | null }) => {
    setSelectedCategory(cat);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="size-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  const categories = data?.categories || [];

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 font-subheading-main">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
         <div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight uppercase">Global Categories</h1>
            <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px] mt-1 opacity-70">Manage all product categories on the platform</p>
         </div>
         <Button 
           onClick={handleCreate}
           className="h-12 md:h-14 px-6 md:px-8 rounded-2xl bg-indigo-600 text-white font-black uppercase tracking-widest shadow-lg shadow-indigo-600/20 hover:scale-[1.02] active:scale-95 transition-all gap-3 w-full sm:w-auto"
         >
            <Plus className="size-4 md:size-5" />
            <span className="text-xs md:text-sm">Create Category</span>
         </Button>
      </div>
      
      {/* Bulk Operations */}
      <div className="flex justify-end -mt-4 sm:-mt-6 gap-3">
        {selectedIds.length > 0 && (
           <button 
             onClick={() => {
                if (confirm(`Delete ${selectedIds.length} categories?`)) {
                   bulkDeleteMutation.mutate(selectedIds);
                }
             }}
             disabled={bulkDeleteMutation.isPending}
             className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-red-500/20 flex items-center gap-2 animate-in fade-in zoom-in"
           >
              {bulkDeleteMutation.isPending ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
              Delete ({selectedIds.length})
           </button>
        )}
        <button 
          onClick={() => {
             if (selectedIds.length === categories.length) {
                setSelectedIds([]);
             } else {
                setSelectedIds(categories.map((c: { id: number }) => c.id));
             }
          }}
          className="px-4 py-2 bg-white/5 border border-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all"
        >
           {selectedIds.length === categories.length ? "Deselect All" : "Select All"}
        </button>
        <BulkOperations 
          type="categories" 
          onSuccess={() => queryClient.invalidateQueries({ queryKey: ["admin-categories-list"] })} 
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
         {categories.map((cat: { id: number; name: string; image: string | null; seller?: { name: string } }) => (
           <div 
             key={cat.id} 
             className={`group relative border rounded-[2rem] md:rounded-[2.5rem] p-5 md:p-6 transition-all duration-500 ${selectedIds.includes(cat.id) ? "bg-indigo-500/10 border-indigo-500/50" : "bg-white/5 border-white/5 hover:border-indigo-500/30"}`}
           >
              <div className="absolute top-6 left-6 z-10">
                 <input 
                   type="checkbox" 
                   className="size-5 rounded-md border-white/20 bg-black/40 checked:bg-indigo-500 checked:border-indigo-500 transition-all cursor-pointer backdrop-blur-md"
                   checked={selectedIds.includes(cat.id)}
                   onChange={(e) => {
                      if (e.target.checked) setSelectedIds([...selectedIds, cat.id]);
                      else setSelectedIds(selectedIds.filter(id => id !== cat.id));
                   }}
                 />
              </div>

              <div className="aspect-square rounded-2xl bg-white/5 border border-white/5 mb-5 md:mb-6 overflow-hidden relative flex items-center justify-center shadow-2xl">
                 {cat.image ? (
                   <NextImage 
                     src={cat.image} 
                     fill 
                     className="object-cover group-hover:scale-110 transition-transform duration-700" 
                     alt={cat.name} 
                     unoptimized 
                   />
                 ) : (
                   <div className="flex flex-col items-center gap-2 opacity-20 group-hover:opacity-40 transition-opacity">
                     <Layers className="size-12" />
                     <span className="text-[10px] font-black uppercase tracking-widest">No Image</span>
                   </div>
                 )}
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              
              <div className="space-y-4 md:space-y-6">
                 <div>
                    <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-tight truncate group-hover:text-indigo-400 transition-colors">{cat.name}</h3>
                    <div className="flex items-center gap-2 mt-1.5 min-h-[16px]">
                       {cat.seller ? (
                         <div className="flex items-center gap-1.5 opacity-50">
                            <Store className="size-3 text-indigo-400" />
                            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400 truncate max-w-[120px]">{cat.seller.name}</span>
                         </div>
                       ) : (
                         <div className="flex items-center gap-1.5 opacity-30">
                            <Layers className="size-3 text-emerald-400" />
                            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-emerald-400">System Core</span>
                         </div>
                       )}
                    </div>
                 </div>

                 <div className="flex items-center gap-2 md:gap-3">
                    <button 
                      onClick={() => handleEdit(cat)}
                      className="flex-1 h-10 md:h-12 rounded-xl md:rounded-2xl bg-white/5 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center justify-center gap-2 hover:bg-white/10 hover:text-white transition-all shadow-sm"
                    >
                       <Edit3 className="size-3 md:size-3.5" /> Edit
                    </button>
                    <button 
                      onClick={() => {
                        if (confirm("Permanently delete this category? All products under it might lose their classification.")) {
                          deleteCategory.mutate(cat.id);
                        }
                      }}
                      className="size-10 md:size-12 rounded-xl md:rounded-2xl bg-red-500/10 flex items-center justify-center hover:bg-red-500 group/del transition-all shadow-sm"
                    >
                       <Trash2 className="size-4 md:size-5 text-red-500 group-hover/del:text-white" />
                    </button>
                 </div>
              </div>

              {/* Decorative Corner Glow */}
              <div className="absolute -top-1 -right-1 size-16 bg-indigo-500/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
           </div>
         ))}
      </div>

      {categories.length === 0 && (
        <div className="h-[40vh] border-2 border-dashed border-white/5 rounded-[3rem] flex flex-col items-center justify-center text-center p-10">
           <Layers className="size-16 text-gray-800 mb-4" />
           <h2 className="text-xl font-medium text-white uppercase tracking-tight">No Categories Found</h2>
           <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-2">Get started by creating your first global category</p>
        </div>
      )}

      <CategoryModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category={selectedCategory}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["admin-categories-list"] });
          queryClient.invalidateQueries({ queryKey: ["seller-categories"] });
          toast({ variant: "success", title: "Success", description: "Category list updated" });
        }}
      />
    </div>
  );
}
