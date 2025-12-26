"use client"

import { AdminSidebar } from "@/components/dashboard/AdminSidebar";
import { NotificationsMenu } from "@/components/dashboard/NotificationsMenu";
import { Search, Menu } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: user, isLoading } = useUser();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
      {/* Mobile Sidebar Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden ${isSidebarOpen ? "block" : "hidden"}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar - Responsive */}
      <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <AdminSidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-4 lg:px-10 sticky top-0 bg-[#0A0A0B]/80 backdrop-blur-xl z-30">
           <div className="flex items-center gap-4">
             <button 
               className="lg:hidden p-2 text-gray-400 hover:text-white"
               onClick={() => setIsSidebarOpen(true)}
             >
               <Menu className="size-6" />
             </button>
             
             <div className="relative w-full max-w-sm hidden md:block group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-500 group-focus-within:text-indigo-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search global records..." 
                  className="w-64 lg:w-96 bg-white/5 border border-white/5 rounded-xl py-2.5 pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-indigo-500/30 focus:bg-white/[0.08] transition-all"
                />
             </div>
           </div>

           <div className="flex items-center gap-2 lg:gap-6">
              <NotificationsMenu role="ADMIN" />
              
              <div className="flex items-center gap-4 pl-4 lg:pl-6 lg:border-l lg:border-white/5">
                 <div className="hidden lg:flex flex-col items-end">
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
