"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Bell, ShoppingBag, MessageSquareWarning, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface Notification {
  id: number;
  message: string;
  link: string | null;
  read: boolean;
  createdAt: string;
}

export function NotificationsMenu({ role }: { role: "SELLER" | "ADMIN" }) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data } = useQuery<{ notifications: Notification[] }>({
    queryKey: ["notifications", role],
    queryFn: async () => {
      const response = await api.get("/notification");
      return response.data;
    },
    refetchInterval: 3000
  });

  const notifications = data?.notifications || [];

  const markAsRead = useMutation({
    mutationFn: async (id: number) => {
      await api.put(`/notification/read/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", role] });
    }
  });

  const unreadCount = notifications.filter((n: Notification) => !n.read).length;

  const getIcon = (message: string) => {
    if (message.includes("order")) return <ShoppingBag className="size-4 text-emerald-400" />;
    if (message.includes("complaint")) return <MessageSquareWarning className="size-4 text-amber-400" />;
    if (message.includes("review")) return <Star className="size-4 text-purple-400" />;
    return <Bell className="size-4 text-blue-400" />;
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative size-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group"
      >
        <Bell className="size-5 text-gray-400 group-hover:text-white transition-colors" />
        {unreadCount > 0 && (
          <span className="absolute top-2.5 right-2.5 size-2 bg-primary rounded-full border-2 border-[#0A0A0B]" />
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-4 w-96 bg-[#111] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
               <h3 className="text-sm font-black text-white uppercase tracking-widest">Notifications</h3>
               <span className="bg-primary/20 text-primary text-[10px] px-2 py-0.5 rounded-full font-black">{unreadCount} New</span>
            </div>
            
            <div className="max-h-[400px] overflow-y-auto">
               {notifications?.length === 0 ? (
                 <div className="p-8 text-center text-gray-500 text-xs font-bold uppercase tracking-widest">
                    No notifications yet
                 </div>
               ) : (
                 notifications?.map((n: Notification) => (
                   <div 
                     key={n.id} 
                     className={cn(
                       "p-4 border-b border-white/5 flex gap-4 hover:bg-white/[0.02] transition-colors cursor-pointer group",
                       !n.read && "bg-primary/[0.02]"
                     )}
                     onClick={() => !n.read && markAsRead.mutate(n.id)}
                   >
                      <div className="mt-1">
                        {getIcon(n.message)}
                      </div>
                      <div className="flex-1">
                         <p className={cn("text-xs font-medium leading-relaxed", n.read ? "text-gray-400" : "text-white")}>
                            {n.message}
                         </p>
                         <span className="text-[10px] text-gray-600 font-bold mt-1 block">
                            {new Date(n.createdAt).toLocaleDateString()}
                         </span>
                      </div>
                      {!n.read && (
                        <div className="size-2 rounded-full bg-primary self-center" />
                      )}
                   </div>
                 ))
               )}
            </div>
            
            <button className="w-full p-3 text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-white transition-colors border-t border-white/5">
               View All Notifications
            </button>
          </div>
        </>
      )}
    </div>
  );
}
