"use client"

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import api from "@/lib/axios";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Image as ImageIcon, Globe, Palette, Save, Loader2 } from "lucide-react";

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    logoUrl: "",
    bannerUrl: "",
    storeName: "Karyana Store",
    primaryColor: "#80B500"
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
          primaryColor: response.data.settings.primaryColor || "#80B500"
        });
      }
      return response.data.settings;
    }
  });

  const updateSettings = useMutation({
    mutationFn: async (newSettings: { logoUrl: string, bannerUrl: string, storeName: string, primaryColor: string }) => {
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
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
         <h1 className="text-4xl font-medium text-white tracking-tighter uppercase font-subheading-main">App Settings</h1>
         <p className="text-gray-400 font-medium uppercase tracking-[0.2em] text-[10px] mt-1 opacity-70">Configure global appearance and information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         {/* Appearance Card */}
         <div className="bg-white/5 border border-white/5 rounded-[2rem] p-10 space-y-8">
            <div className="flex items-center gap-4 mb-2">
               <div className="size-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                  <Palette className="size-6 text-indigo-500" />
               </div>
               <div>
                  <h3 className="text-xl font-medium text-white uppercase tracking-tight font-subheading-main">Visual Branding</h3>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Update logos and theme colors</p>
               </div>
            </div>

            <div className="space-y-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Store Logo URL</label>
                  <div className="relative group">
                     <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                     <Input 
                       value={settings.logoUrl}
                       onChange={e => setSettings({...settings, logoUrl: e.target.value})}
                       className="bg-white/5 border-white/5 h-12 rounded-xl pl-12 text-sm text-white"
                       placeholder="https://example.com/logo.png"
                     />
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Store Name</label>
                  <div className="relative group">
                     <Globe className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                     <Input 
                       value={settings.storeName}
                       onChange={e => setSettings({...settings, storeName: e.target.value})}
                       className="bg-white/5 border-white/5 h-12 rounded-xl pl-12 text-sm text-white"
                     />
                  </div>
               </div>
            </div>
         </div>

         {/* Banner Card */}
         <div className="bg-white/5 border border-white/5 rounded-[2rem] p-10 space-y-8">
            <div className="flex items-center gap-4 mb-2">
               <div className="size-12 rounded-2xl bg-teal-500/10 flex items-center justify-center border border-teal-500/20">
                  <ImageIcon className="size-6 text-teal-500" />
               </div>
               <div>
                  <h3 className="text-xl font-medium text-white uppercase tracking-tight font-subheading-main">Global Banner</h3>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Update the main storefront banner</p>
               </div>
            </div>

            <div className="space-y-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Banner Image URL</label>
                  <Input 
                    value={settings.bannerUrl}
                    onChange={e => setSettings({...settings, bannerUrl: e.target.value})}
                    className="bg-white/5 border-white/5 h-12 rounded-xl text-sm text-white"
                    placeholder="https://example.com/banner.jpg"
                  />
               </div>
               
               <div className="p-6 rounded-2xl bg-white/5 border border-white/5 aspect-video flex flex-col items-center justify-center text-center">
                  {settings.bannerUrl ? (
                    <div className="relative w-full h-full"><Image src={settings.bannerUrl} fill className="object-contain rounded-lg" alt="Preview" unoptimized /></div>
                  ) : (
                    <>
                       <ImageIcon className="size-10 text-gray-600 mb-2" />
                       <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Image Preview</p>
                    </>
                  )}
               </div>
            </div>
         </div>
      </div>

      <div className="flex justify-end">
         <Button 
           onClick={() => updateSettings.mutate(settings)}
           disabled={updateSettings.isPending}
           className="h-14 px-12 rounded-2xl bg-indigo-500 text-white font-medium uppercase tracking-widest hover:bg-indigo-600 shadow-2xl shadow-indigo-500/30 gap-3 text-sm font-subheading-main"
         >
            {updateSettings.isPending ? <Loader2 className="size-5 animate-spin" /> : <Save className="size-5" />}
            Save All Changes
         </Button>
      </div>
    </div>
  );
}
