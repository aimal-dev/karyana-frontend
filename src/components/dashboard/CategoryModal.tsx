"use client"

import { useState, useEffect } from "react";
import { X, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import api from "@/lib/axios";
import { ImageUpload } from "./ImageUpload";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: {
    id: number;
    name: string;
    image: string | null;
  } | null;
  onSuccess: () => void;
}

export function CategoryModal({ isOpen, onClose, category, onSuccess }: CategoryModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    image: ""
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || "",
        image: category.image || ""
      });
    } else {
      setFormData({
        name: "",
        image: ""
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
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-[#111] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
           <div>
              <h2 className="text-2xl font-medium text-white">{category ? "Edit Category" : "Add New Category"}</h2>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Define product categories</p>
           </div>
           <button onClick={onClose} className="size-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
              <X className="size-5 text-gray-400" />
           </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
           <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Category Name</label>
              <Input 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="e.g. Beverages"
                className="bg-white/5 border-white/10 h-12 rounded-xl text-white"
                required
              />
           </div>

            <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex items-center justify-between">
                   <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Category Image</label>
                   <ImageUpload 
                     label="Upload Image" 
                     onUploadSuccess={(url) => setFormData(prev => ({ ...prev, image: url }))} 
                     className="w-40"
                   />
                </div>
                <div className="relative">
                   <Upload className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
                   <Input 
                     value={formData.image}
                     onChange={e => setFormData({...formData, image: e.target.value})}
                     placeholder="Paste Image URL or use Upload button"
                     className="bg-white/5 border-white/10 h-11 rounded-xl text-white pl-12 text-xs"
                     required
                   />
                </div>
                {formData.image && (
                   <div className="relative size-24 rounded-2xl overflow-hidden border border-primary/30 group mx-auto">
                      <img src={formData.image} alt="Category Preview" className="size-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <span className="text-[8px] font-black uppercase text-white">Preview</span>
                      </div>
                   </div>
                )}
            </div>

           <div className="pt-4 flex gap-4">
              <Button 
                type="submit" 
                disabled={loading}
                className="flex-1 h-14 rounded-2xl bg-primary text-white font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
              >
                 {loading ? <Loader2 className="size-5 animate-spin" /> : (category ? "Save Changes" : "Create Category")}
              </Button>
              <Button 
                type="button" 
                onClick={onClose}
                className="px-10 h-14 rounded-2xl bg-white/5 border border-white/5 text-gray-400 font-black uppercase tracking-widest hover:bg-white/10 transition-all text-xs"
              >
                 Cancel
              </Button>
           </div>
        </form>
      </div>
    </div>
  );
}
