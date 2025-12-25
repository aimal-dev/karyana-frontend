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
  FolderOpen,
  Store
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CategoryModal } from "@/components/dashboard/CategoryModal";
import { useToast } from "@/hooks/use-toast";

export default function AdminCategoriesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<{
    id: number;
    name: string;
    image: string | null;
  } | null>(null);
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
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
         <div>
            <h1 className="text-4xl font-black text-white tracking-tight uppercase font-subheading-main">Global Categories</h1>
            <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px] mt-1 opacity-70">Manage all product categories on the platform</p>
         </div>
         <Button 
           onClick={handleCreate}
           className="h-14 px-8 rounded-2xl bg-indigo-600 text-white font-black uppercase tracking-widest shadow-lg shadow-indigo-600/20 hover:scale-105 active:scale-95 transition-all gap-3"
         >
            <Plus className="size-5" />
            Create Category
         </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {categories.map((cat: { id: number; name: string; image: string | null; seller?: { name: string } }) => (
           <div key={cat.id} className="group relative bg-white/5 border border-white/5 rounded-[2.5rem] p-6 hover:border-indigo-500/30 transition-all">
              <div className="aspect-square rounded-2xl bg-white/5 border border-white/5 mb-6 overflow-hidden relative flex items-center justify-center">
                 {cat.image ? (
                   <NextImage src={cat.image} fill className="object-cover" alt={cat.name} unoptimized />
                 ) : (
                   <FolderOpen className="size-10 text-gray-700" />
                 )}
              </div>
              
              <div className="space-y-4">
                 <div>
                    <h3 className="text-lg font-black text-white uppercase tracking-tight">{cat.name}</h3>
                    {cat.seller && (
                      <div className="flex items-center gap-2 mt-1 opacity-50">
                         <Store className="size-3 text-indigo-400" />
                         <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{cat.seller.name}</span>
                      </div>
                    )}
                 </div>

                 <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleEdit(cat)}
                      className="flex-1 h-10 rounded-xl bg-white/5 text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
                    >
                       <Edit3 className="size-3" /> Edit
                    </button>
                    <button 
                      onClick={() => {
                        if (confirm("Delete this category?")) {
                          deleteCategory.mutate(cat.id);
                        }
                      }}
                      className="size-10 rounded-xl bg-red-500/10 flex items-center justify-center hover:bg-red-500 group/del transition-all"
                    >
                       <Trash2 className="size-4 text-red-500 group-hover/del:text-white" />
                    </button>
                 </div>
              </div>
           </div>
         ))}
      </div>

      <CategoryModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category={selectedCategory}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ["admin-categories-list"] })}
      />
    </div>
  );
}
