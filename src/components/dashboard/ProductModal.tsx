"use client"

import { useState, useEffect } from "react";
import { X, Loader2, Upload, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { ImageUpload } from "./ImageUpload";
import { useUser } from "@/hooks/useUser";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: {
    id: number;
    title: string;
    description: string;
    price: number;
    stock: number;
    categoryId: number;
    image: string;
    isFeatured?: boolean;
    isTrending?: boolean;
    isOnSale?: boolean;
    oldPrice?: number;
    sellerId?: number;
    images?: { url: string }[];
    tags?: string[];
  } | null;
  onSuccess: () => void;
}

export function ProductModal({ isOpen, onClose, product, onSuccess }: ProductModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    image: "", // featured
    images: [] as string[], // gallery
    isFeatured: false,
    isTrending: false,
    isOnSale: false,
    oldPrice: "",
    tags: "",
    sellerId: ""
  });

  const { data: user } = useUser();
  const isAdmin = user?.role === "ADMIN";

  const { data: categoriesData } = useQuery({
    queryKey: ["seller-categories"],
    queryFn: async () => {
      const res = await api.get("/category");
      return res.data.categories;
    },
    enabled: isOpen
  });

  const { data: sellersData } = useQuery({
    queryKey: ["admin-sellers-list"],
    queryFn: async () => {
      const res = await api.get("/admin/sellers?approved=true");
      return res.data.sellers;
    },
    enabled: isOpen && isAdmin
  });

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || "",
        description: product.description || "",
        price: product.price?.toString() || "",
        stock: product.stock?.toString() || "",
        categoryId: product.categoryId?.toString() || "",
        image: product.image || "",
        images: product.images?.map(img => img.url) || [],
        isFeatured: product.isFeatured || false,
        isTrending: product.isTrending || false,
        isOnSale: product.isOnSale || false,
        oldPrice: product.oldPrice?.toString() || "",
        tags: product.tags ? product.tags.join(", ") : "",
        sellerId: product.sellerId?.toString() || ""
      });
    } else {
      setFormData({
        title: "",
        description: "",
        price: "",
        stock: "",
        categoryId: "",
        image: "",
        images: [],
        isFeatured: false,
        isTrending: false,
        isOnSale: false,
        oldPrice: "",
        tags: "",
        sellerId: ""
      });
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleAddImageUrl = () => {
    setFormData(prev => ({ ...prev, images: [...prev.images, ""] }));
  };

  const handleImageUrlChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const handleRemoveImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const setFeaturedImage = (url: string) => {
    setFormData(prev => ({ ...prev, image: url }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
      categoryId: Number(formData.categoryId),
      oldPrice: formData.oldPrice ? Number(formData.oldPrice) : null,
      sellerId: isAdmin && formData.sellerId ? Number(formData.sellerId) : undefined
    };

    try {
      if (product) {
        await api.put(`/products/${product.id}`, payload);
      } else {
        await api.post("/products", payload);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to save product", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-[#111] border-x border-t md:border border-white/10 rounded-t-[2rem] md:rounded-[2.5rem] shadow-2xl overflow-y-auto max-h-[92vh] md:max-h-[90vh] animate-in fade-in zoom-in-95 slide-in-from-bottom-10 md:slide-in-from-bottom-0 duration-300 mt-auto md:mt-0">
        <div className="p-6 md:p-8 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#111]/90 backdrop-blur-md z-10">
           <div>
              <h2 className="text-xl md:text-2xl font-medium text-white">{product ? "Edit Product" : "Add New Product"}</h2>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Fill in the details for your inventory</p>
           </div>
           <button onClick={onClose} className="size-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors shrink-0">
              <X className="size-5 text-gray-400" />
           </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6 md:space-y-8">
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Product Title</label>
                 <Input 
                   value={formData.title}
                   onChange={e => setFormData({...formData, title: e.target.value})}
                   placeholder="e.g. Fresh Organic Milk"
                   className="bg-white/5 border-white/10 h-12 rounded-xl text-white"
                   required
                 />
              </div>
              <div className="space-y-2 text-left">
                 <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Category</label>
                 <div className="relative">
                 <select 
                   value={formData.categoryId}
                   onChange={e => setFormData({...formData, categoryId: e.target.value})}
                   className="w-full bg-white/5 border border-white/10 h-12 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors appearance-none"
                   required
                 >
                    <option value="" className="bg-[#111]">Select Category</option>
                    {categoriesData?.map((cat: { id: number; name: string }) => (
                      <option key={cat.id} value={cat.id} className="bg-[#111]">{cat.name}</option>
                    ))}
                 </select>
                 <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                    <Plus className="size-3.5 rotate-45" />
                 </div>
                 </div>
              </div>

              {isAdmin && (
                <div className="space-y-2 col-span-1 sm:col-span-2 border-t border-white/5 pt-6">
                   <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest ml-1">Assign to Seller (Admin Only)</label>
                   <div className="relative">
                     <select 
                       value={formData.sellerId}
                       onChange={e => setFormData({...formData, sellerId: e.target.value})}
                       className="w-full bg-indigo-500/5 border border-indigo-500/20 h-14 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-colors appearance-none font-bold shadow-inner"
                       required={isAdmin}
                     >
                        <option value="" className="bg-[#111]">Select Seller</option>
                        {sellersData?.map((s: { id: number; name: string }) => (
                          <option key={s.id} value={s.id} className="bg-[#111]">{s.name}</option>
                        ))}
                     </select>
                   </div>
                </div>
              )}
           </div>

           <div className="space-y-2 text-left">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Description</label>
              <textarea 
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors min-h-[100px] md:min-h-[120px]"
                placeholder="Describe your product..."
                required
              />
           </div>

            <div className="space-y-2 text-left">
               <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Product Tags (Search Keywords)</label>
               <Input 
                 value={formData.tags}
                 onChange={e => setFormData({...formData, tags: e.target.value})}
                 placeholder="e.g. juice, orange, drink"
                 className="bg-white/5 border-white/10 h-12 rounded-xl text-white"
               />
                <p className="text-[9px] text-gray-600 ml-1 font-medium leading-relaxed">Add keywords like synonyms to help users find this product (e.g. &apos;ata&apos; for flour)</p>
            </div>

           <div className="space-y-4 pt-4 border-t border-white/5 text-left">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Settings</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                 <button 
                   type="button"
                   onClick={() => setFormData({...formData, isFeatured: !formData.isFeatured})}
                   className={cn(
                     "flex items-center justify-center py-3 rounded-xl border transition-all gap-2",
                     formData.isFeatured ? "bg-amber-500/10 border-amber-500/50 text-amber-500" : "bg-white/5 border-white/10 text-gray-500 hover:bg-white/10"
                   )}
                 >
                    <div className={cn("size-1.5 rounded-full", formData.isFeatured ? "bg-amber-500 animate-pulse" : "bg-gray-600")} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Featured</span>
                 </button>
                 
                 <button 
                   type="button"
                   onClick={() => setFormData({...formData, isTrending: !formData.isTrending})}
                   className={cn(
                     "flex items-center justify-center py-3 rounded-xl border transition-all gap-2",
                     formData.isTrending ? "bg-indigo-500/10 border-indigo-500/50 text-indigo-500" : "bg-white/5 border-white/10 text-gray-500 hover:bg-white/10"
                   )}
                 >
                    <div className={cn("size-1.5 rounded-full", formData.isTrending ? "bg-indigo-500 animate-pulse" : "bg-gray-600")} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Trending</span>
                 </button>

                 <button 
                   type="button"
                   onClick={() => setFormData({...formData, isOnSale: !formData.isOnSale})}
                   className={cn(
                     "flex items-center justify-center py-3 rounded-xl border transition-all gap-2 col-span-2 md:col-span-1",
                     formData.isOnSale ? "bg-red-500/10 border-red-500/50 text-red-500" : "bg-white/5 border-white/10 text-gray-500 hover:bg-white/10"
                   )}
                 >
                    <div className={cn("size-1.5 rounded-full", formData.isOnSale ? "bg-red-500 animate-pulse" : "bg-gray-600")} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Sale</span>
                 </button>
              </div>

              {formData.isOnSale && (
                <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
                   <label className="text-[9px] font-black text-red-500 uppercase tracking-widest ml-1">Original Price ($)</label>
                   <Input 
                     type="number"
                     value={formData.oldPrice}
                     onChange={e => setFormData({...formData, oldPrice: e.target.value})}
                     placeholder="e.g. 199.99"
                     className="bg-red-500/5 border-red-500/20 h-11 rounded-xl text-white focus:border-red-500/50 text-xs"
                     required={formData.isOnSale}
                   />
                </div>
              )}
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
              <div className="space-y-2 text-left">
                 <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Price ($)</label>
                 <Input 
                   type="number"
                   value={formData.price}
                   onChange={e => setFormData({...formData, price: e.target.value})}
                   placeholder="0.00"
                   className="bg-white/5 border-white/10 h-12 rounded-xl text-white"
                   required
                 />
              </div>
              <div className="space-y-2 text-left">
                 <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Stock Quantity</label>
                 <Input 
                   type="number"
                   value={formData.stock}
                   onChange={e => setFormData({...formData, stock: e.target.value})}
                   placeholder="0"
                   className="bg-white/5 border-white/10 h-12 rounded-xl text-white"
                   required
                 />
              </div>
           </div>

           <div className="space-y-6 pt-4 border-t border-white/5 text-left">
              <div className="space-y-4">
                 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Main Featured Image (Required)</label>
                    <ImageUpload 
                      label="Upload Main Image" 
                      onUploadSuccess={(url) => setFormData(prev => ({ ...prev, image: url }))} 
                      className="w-full sm:w-44"
                    />
                 </div>
                 <div className="relative">
                    <Upload className="absolute left-4 top-1/2 -translate-y-1/2 size-3.5 text-gray-500" />
                    <Input 
                      value={formData.image}
                      onChange={e => setFormData({...formData, image: e.target.value})}
                      placeholder="Paste Image URL or use Upload button"
                      className="bg-white/5 border-white/10 h-11 rounded-xl text-white pl-12 text-xs"
                      required
                    />
                 </div>
              </div>

              <div className="space-y-4">
                 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                   <div className="flex flex-col">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Product Gallery</label>
                      <span className="text-[8px] text-gray-600 ml-1">Add more pictures of your product</span>
                   </div>
                   <div className="flex items-center gap-3">
                     <ImageUpload 
                       label="Add to Gallery" 
                       onUploadSuccess={(url) => {
                         setFormData(prev => {
                           const newImages = [...prev.images, url];
                           const newMain = prev.image === "" ? url : prev.image;
                           return { ...prev, images: newImages, image: newMain };
                         });
                       }} 
                       className="flex-1 sm:w-40"
                     />
                     <button type="button" onClick={handleAddImageUrl} className="size-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors border border-white/10 shrink-0">
                       <Plus className="size-4 text-primary" />
                     </button>
                   </div>
                 </div>
                 
                 <div className="grid grid-cols-1 gap-3">
                    {formData.images.map((url, index) => (
                      <div key={index} className="flex gap-3">
                         <div className="relative flex-1 group min-w-0">
                            <Input 
                              value={url}
                              onChange={e => handleImageUrlChange(index, e.target.value)}
                              placeholder="Image URL"
                              className="bg-white/5 border-white/10 h-12 rounded-xl text-white pl-4 pr-24 md:pr-32 text-[10px] md:text-xs"
                            />
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                               {formData.image === url ? (
                                 <span className="px-2 md:px-3 py-1 bg-primary text-white rounded-lg text-[7px] md:text-[8px] font-black uppercase tracking-widest leading-none">
                                   Featured
                                 </span>
                               ) : (
                                 <button 
                                   type="button" 
                                   onClick={() => setFeaturedImage(url)}
                                   className="px-2 md:px-3 py-1 bg-white/5 text-gray-400 hover:text-white border border-white/10 rounded-lg text-[7px] md:text-[8px] font-black uppercase tracking-widest transition-all"
                                 >
                                    Set Main
                                 </button>
                               )}
                            </div>
                         </div>
                         <button 
                           type="button" 
                           onClick={() => handleRemoveImage(index)}
                           className="size-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center hover:bg-red-500 text-red-500 hover:text-white transition-all shadow-sm shrink-0"
                         >
                            <X className="size-4" />
                         </button>
                      </div>
                    ))}
                    {formData.images.length === 0 && (
                      <div className="text-center py-8 border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.02]">
                         <p className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">Gallery is Empty</p>
                      </div>
                    )}
                 </div>
              </div>
           </div>

           <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <Button 
                type="submit" 
                disabled={loading}
                className="flex-1 h-14 rounded-2xl bg-primary text-white font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-95 transition-all"
              >
                 {loading ? <Loader2 className="size-5 animate-spin" /> : (product ? "Save Changes" : "Create Product")}
              </Button>
              <Button 
                type="button" 
                onClick={onClose}
                className="w-full sm:w-auto px-10 h-14 rounded-2xl bg-white/5 border border-white/5 text-gray-400 font-black uppercase tracking-widest hover:bg-white/10 transition-all text-[10px]"
              >
                 Cancel
              </Button>
           </div>
        </form>
      </div>
    </div>
  );
}
