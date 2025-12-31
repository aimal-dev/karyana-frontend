"use client"

import { useState, useEffect } from "react";
import { X, Loader2, Upload, Star } from "lucide-react";
import NextImage from "next/image";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import api from "@/lib/axios";
import { ImageUpload } from "./ImageUpload";
import { cn } from "@/lib/utils";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: {
    id: number;
    name: string;
    image: string | null;
    isStarred?: boolean;
  } | null;
  onSuccess: () => void;
}

export function CategoryModal({ isOpen, onClose, category, onSuccess }: CategoryModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    isStarred: false
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || "",
        image: category.image || "",
        isStarred: category.isStarred || false
      });
    } else {
      setFormData({
        name: "",
        image: "",
        isStarred: false
      });
    }
  }, [category, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (category) {
        await api.put(`/category/${category.id}`, formData);
      } else {
        await api.post("/category", formData);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to save category", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-6">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-[#111] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
        <div className="p-6 md:p-8 border-b border-white/5 flex items-center justify-between">
           <div>
              <h2 className="text-xl md:text-2xl font-medium text-white uppercase tracking-tight">{category ? "Edit Category" : "New Category"}</h2>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1 opacity-70">Define product classification</p>
           </div>
           <button onClick={onClose} className="size-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
              <X className="size-5 text-gray-400" />
           </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
           <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Category Name</label>
              <Input 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="e.g. Beverages"
                className="bg-white/5 border-white/10 h-12 rounded-xl text-white font-medium"
                required
              />
           </div>

           <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10 group hover:border-indigo-500/50 transition-all">
              <div className="flex items-center gap-3">
                 <div className={cn("size-10 rounded-xl flex items-center justify-center transition-all shadow-lg", formData.isStarred ? "bg-amber-500 text-white shadow-amber-500/20" : "bg-white/5 text-gray-500")}>
                    <Star className={cn("size-5", formData.isStarred && "fill-current")} />
                 </div>
                 <div>
                    <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Featured on Storefront</h4>
                    <p className="text-[8px] font-bold text-gray-500 uppercase tracking-wider">Starred categories appear first in results</p>
                 </div>
              </div>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, isStarred: !prev.isStarred }))}
                className={cn(
                   "relative w-12 h-6 rounded-full transition-all duration-300",
                   formData.isStarred ? "bg-indigo-600 shadow-lg shadow-indigo-600/20" : "bg-white/5 border border-white/10"
                )}
              >
                 <div className={cn(
                    "absolute top-1 size-4 rounded-full bg-white transition-all duration-300 shadow-sm",
                    formData.isStarred ? "left-7" : "left-1"
                 )} />
              </button>
           </div>

            <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                   <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Category Image</label>
                   <ImageUpload 
                     label="Upload Image" 
                     onUploadSuccess={(url) => setFormData(prev => ({ ...prev, image: url }))} 
                     className="w-full sm:w-40"
                   />
                </div>
                <div className="relative">
                   <Upload className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
                   <Input 
                     value={formData.image}
                     onChange={e => setFormData({...formData, image: e.target.value})}
                     placeholder="Paste Image URL or use Upload"
                     className="bg-white/5 border-white/10 h-12 rounded-xl text-white pl-12 text-xs"
                     required
                   />
                </div>
                {formData.image && (
                   <div className="relative size-24 md:size-32 rounded-[2rem] overflow-hidden border border-indigo-500/30 group mx-auto shadow-2xl">
                      <NextImage 
                        src={formData.image} 
                        alt="Category Preview" 
                        fill 
                        className="object-cover" 
                        unoptimized 
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <span className="text-[10px] font-black uppercase text-white tracking-widest">Preview</span>
                      </div>
                   </div>
                 )}
            </div>

           <div className="pt-4 flex flex-col-reverse sm:flex-row gap-3">
              <Button 
                type="button" 
                onClick={onClose}
                className="flex-1 h-12 rounded-2xl bg-white/5 border border-white/5 text-gray-400 font-black uppercase tracking-widest hover:bg-white/10 transition-all text-[10px]"
              >
                 Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                className="flex-[2] h-12 rounded-2xl bg-indigo-600 text-white font-black uppercase tracking-widest shadow-lg shadow-indigo-600/20 hover:scale-[1.02] active:scale-95 transition-all"
              >
                 {loading ? <Loader2 className="size-5 animate-spin" /> : (category ? "Save Changes" : "Create Category")}
              </Button>
           </div>
        </form>
      </div>
    </div>
  );
}
