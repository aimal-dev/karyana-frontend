"use client"

import { AdminSidebar } from "@/components/dashboard/AdminSidebar";
import { NotificationsMenu } from "@/components/dashboard/NotificationsMenu";
import { Search } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "ADMIN")) {
      router.push("/admin-login");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || user.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
        <Loader2 className="size-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0A0A0B] text-white">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 sticky top-0 bg-[#0A0A0B]/80 backdrop-blur-xl z-30">
           <div className="relative w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-500 group-focus-within:text-indigo-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search global records..." 
                className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-indigo-500/30 focus:bg-white/[0.08] transition-all"
              />
           </div>

           <div className="flex items-center gap-6">
              <NotificationsMenu role="ADMIN" />
              
              <div className="flex items-center gap-4 pl-6 border-l border-white/5">
                 <div className="flex flex-col items-end">
                    <span className="text-sm font-bold text-white">System Admin</span>
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-tighter">Superuser</span>
                 </div>
                 <div className="size-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-500/20">
                    S
                 </div>
              </div>
           </div>
        </header>

        <div className="p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
