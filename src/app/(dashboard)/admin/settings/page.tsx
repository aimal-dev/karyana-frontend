"use client"

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import NextImage from "next/image";
import api from "@/lib/axios";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Image as ImageIcon, Globe, Palette, Save, Loader2, X } from "lucide-react";
import { ImageUpload } from "@/components/dashboard/ImageUpload";

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    logoUrl: "",
    bannerUrl: "",
    storeName: "Karyana Store",
    primaryColor: "#80B500",
    trendingLimit: 10,
    featuredLimit: 10,
    categoriesLimit: 10
  });

  const { isLoading } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: async () => {
      const response = await api.get("/admin/settings");
      if (response.data.settings) {
        setSettings({
          logoUrl: response.data.settings.logoUrl || "",
          bannerUrl: response.data.settings.bannerUrl || "",
          storeName: response.data.settings.storeName || "Karyana Store",
          primaryColor: response.data.settings.primaryColor || "#80B500",
          trendingLimit: response.data.settings.trendingLimit || 10,
          featuredLimit: response.data.settings.featuredLimit || 10,
          categoriesLimit: response.data.settings.categoriesLimit || 10
        });
      }
      return response.data.settings;
    }
  });

  const updateSettings = useMutation({
    mutationFn: async (newSettings: typeof settings) => {
      await api.put("/admin/settings", newSettings);
    },
    onSuccess: () => {
      toast({ variant: "success", title: "Success", description: "Settings updated successfully" });
    }
  });

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="size-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
         <div>
            <h1 className="text-3xl md:text-4xl font-medium text-white tracking-tighter uppercase font-subheading-main">App Settings</h1>
            <p className="text-gray-400 font-medium uppercase tracking-[0.2em] text-[10px] mt-1 opacity-70">Configure global appearance and information</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
         {/* Appearance Card */}
         <div className="bg-white/5 border border-white/5 rounded-[2rem] p-6 md:p-10 space-y-8">
            <div className="flex items-center gap-4 mb-2">
               <div className="size-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shrink-0">
                  <Palette className="size-6 text-indigo-500" />
               </div>
               <div>
                  <h3 className="text-xl font-medium text-white uppercase tracking-tight font-subheading-main">Visual Branding</h3>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Update logos and theme colors</p>
               </div>
            </div>

            <div className="space-y-6">
               <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Store Logo</label>
                     <ImageUpload 
                       label="Upload New Logo" 
                       onUploadSuccess={(url) => setSettings(prev => ({ ...prev, logoUrl: url }))} 
                       className="w-full sm:w-auto"
                     />
                  </div>
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/5 h-32 flex items-center justify-center relative group">
                     {settings.logoUrl ? (
                        <>
                           <div className="relative w-full h-full flex items-center justify-center">
                              <NextImage src={settings.logoUrl} fill className="object-contain" alt="Logo" unoptimized />
                           </div>
                           <button
                              type="button"
                              onClick={() => setSettings(prev => ({ ...prev, logoUrl: "" }))}
                              className="absolute top-2 right-2 size-8 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-500 hover:text-white z-10"
                              title="Remove Logo"
                           >
                              <X className="size-4" />
                           </button>
                        </>
                     ) : (
                        <ImageIcon className="size-8 text-gray-700" />
                     )}
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Store Name</label>
                  <div className="relative group">
                     <Globe className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                     <Input 
                       value={settings.storeName}
                       onChange={e => setSettings({...settings, storeName: e.target.value})}
                       className="bg-white/5 border-white/5 h-12 rounded-xl pl-12 text-sm text-white"
                     />
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Theme Color</label>
                  <div className="flex gap-4">
                     <input 
                       type="color" 
                       value={settings.primaryColor}
                       onChange={e => setSettings({...settings, primaryColor: e.target.value})}
                       className="size-12 rounded-xl bg-white/5 border border-white/5 p-1 cursor-pointer shrink-0"
                     />
                     <Input 
                       value={settings.primaryColor}
                       onChange={e => setSettings({...settings, primaryColor: e.target.value})}
                       className="bg-white/5 border-white/5 h-12 rounded-xl text-sm text-white flex-1"
                       placeholder="#80B500"
                     />
                  </div>
               </div>
            </div>
         </div>

         {/* Banner Card */}
         <div className="bg-white/5 border border-white/5 rounded-[2rem] p-6 md:p-10 space-y-8">
            <div className="flex items-center gap-4 mb-2">
               <div className="size-12 rounded-2xl bg-teal-500/10 flex items-center justify-center border border-teal-500/20 shrink-0">
                  <ImageIcon className="size-6 text-teal-500" />
               </div>
               <div>
                  <h3 className="text-xl font-medium text-white uppercase tracking-tight font-subheading-main">Global Banner</h3>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Update the main storefront banner</p>
               </div>
            </div>

            <div className="space-y-6">
               <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Banner Image</label>
                     <ImageUpload 
                        label="Upload New Banner"
                        onUploadSuccess={(url) => setSettings(prev => ({ ...prev, bannerUrl: url }))}
                        className="w-full sm:w-auto"
                     />
                  </div>
                  <div className="p-4 md:p-6 rounded-2xl bg-white/5 border border-white/5 aspect-video md:aspect-auto md:h-48 flex flex-col items-center justify-center text-center overflow-hidden relative">
                     {settings.bannerUrl ? (
                        <NextImage src={settings.bannerUrl} fill className="object-cover rounded-lg" alt="Preview" unoptimized />
                     ) : (
                        <>
                           <ImageIcon className="size-10 text-gray-600 mb-2" />
                           <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">No Banner Selected</p>
                        </>
                     )}
                  </div>
               </div>
            </div>
         </div>

         {/* Home Section Card */}
         <div className="bg-white/5 border border-white/5 rounded-[2rem] p-6 md:p-10 space-y-8 lg:col-span-2">
            <div className="flex items-center gap-4 mb-2">
               <div className="size-12 rounded-2xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20 shrink-0">
                  <Palette className="size-6 text-orange-500" />
               </div>
               <div>
                  <h3 className="text-xl font-medium text-white uppercase tracking-tight font-subheading-main">Home Page Layout</h3>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Control product display limits</p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Trending Products Limit</label>
                  <Input 
                    type="number"
                    value={settings.trendingLimit}
                    onChange={e => setSettings({...settings, trendingLimit: parseInt(e.target.value)})}
                    className="bg-white/5 border-white/5 h-12 rounded-xl text-sm text-white"
                  />
                  <p className="text-[8px] text-gray-500 uppercase tracking-widest font-bold ml-1">Number of products in Trending section</p>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Featured Products Limit</label>
                  <Input 
                    type="number"
                    value={settings.featuredLimit}
                    onChange={e => setSettings({...settings, featuredLimit: parseInt(e.target.value)})}
                    className="bg-white/5 border-white/5 h-12 rounded-xl text-sm text-white"
                  />
                  <p className="text-[8px] text-gray-500 uppercase tracking-widest font-bold ml-1">Number of products in Featured section</p>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Categories Limit</label>
                  <Input 
                    type="number"
                    value={settings.categoriesLimit}
                    onChange={e => setSettings({...settings, categoriesLimit: parseInt(e.target.value)})}
                    className="bg-white/5 border-white/5 h-12 rounded-xl text-sm text-white"
                  />
                  <p className="text-[8px] text-gray-500 uppercase tracking-widest font-bold ml-1">Number of categories on Home Page</p>
               </div>
            </div>
         </div>
      </div>

      <div className="flex justify-end sticky bottom-6 z-10 sm:relative sm:bottom-0">
         <Button 
           onClick={() => updateSettings.mutate(settings)}
           disabled={updateSettings.isPending}
           className="w-full sm:w-auto h-14 px-12 rounded-2xl bg-indigo-500 text-white font-medium uppercase tracking-widest hover:bg-indigo-600 shadow-2xl shadow-indigo-500/30 gap-3 text-sm font-subheading-main"
         >
            {updateSettings.isPending ? <Loader2 className="size-5 animate-spin" /> : <Save className="size-5" />}
            Save All Changes
         </Button>
      </div>
    </div>
  );
}
