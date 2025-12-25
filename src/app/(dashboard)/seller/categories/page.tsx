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
  FolderOpen
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CategoryModal } from "@/components/dashboard/CategoryModal";
import { useToast } from "@/hooks/use-toast";

export default function CategoriesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<{
    id: number;
    name: string;
    image: string | null;
  } | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["seller-categories-list"],
    queryFn: async () => {
      const res = await api.get("/category");
      return res.data;
    }
  });

  const deleteCategory = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/category/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller-categories-list"] });
      toast({ variant: "success", title: "Deleted", description: "Category removed" });
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
        <Loader2 className="size-10 text-primary animate-spin" />
      </div>
    );
  }

  const categories = data?.categories || [];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
         <div>
            <h1 className="text-4xl font-black text-white tracking-tight leading-none uppercase font-subheading-main">Categories</h1>
            <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px] mt-1 opacity-70">Organize your products into logical groups</p>
         </div>
         <Button 
           onClick={handleCreate}
           className="h-14 px-8 rounded-2xl bg-primary text-white font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all gap-3"
         >
            <Plus className="size-5" />
            New Category
         </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
         {categories.length === 0 ? (
           <div className="col-span-full py-20 text-center bg-white/5 rounded-[2.5rem] border border-white/5 border-dashed">
              <FolderOpen className="size-12 text-gray-700 mx-auto mb-4" />
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">No categories found</p>
           </div>
         ) : (
           categories.map((cat: { id: number; name: string; image: string | null }) => (
             <div key={cat.id} className="group relative bg-[#111] border border-white/5 rounded-[2.5rem] p-6 hover:border-primary/30 transition-all hover:shadow-2xl">
                <div className="aspect-[4/3] rounded-2xl bg-white/5 border border-white/5 mb-6 overflow-hidden relative flex items-center justify-center">
                   {cat.image ? (
                     <NextImage src={cat.image} fill className="object-cover transition-transform duration-500 group-hover:scale-110" alt={cat.name} unoptimized />
                   ) : (
                     <FolderOpen className="size-10 text-gray-700" />
                   )}
                </div>
                
                <div className="flex items-center justify-between">
                   <h3 className="text-xl font-black text-white uppercase tracking-tight font-subheading-main">{cat.name}</h3>
                   <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleEdit(cat)}
                        className="size-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                      >
                         <Edit3 className="size-3.5 text-gray-500" />
                      </button>
                      <button 
                        onClick={() => {
                          if (confirm("Are you sure? Products in this category might remain uncategorized.")) {
                            deleteCategory.mutate(cat.id);
                          }
                        }}
                        className="size-8 rounded-lg bg-red-500/10 flex items-center justify-center hover:bg-red-500 group/del transition-all"
                      >
                         <Trash2 className="size-3.5 text-red-500 group-hover/del:text-white" />
                      </button>
                   </div>
                </div>
             </div>
           ))
         )}
      </div>

      <CategoryModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category={selectedCategory}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ["seller-categories-list"] })}
      />
    </div>
  );
}
