"use client"

import { SellerSidebar } from "@/components/dashboard/SellerSidebar";
import { NotificationsMenu } from "@/components/dashboard/NotificationsMenu";
import { Search, Menu, UserCircle, LogOut } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: user, isLoading } = useUser();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

   const [isProfileOpen, setIsProfileOpen] = useState(false);
   const queryClient = useQueryClient();

   const handleLogout = () => {
     localStorage.removeItem("token");
     localStorage.removeItem("role");
     queryClient.setQueryData(["user"], null);
     router.push("/seller-login");
   };

   useEffect(() => {
     if (!isLoading && (!user || (user.role !== "SELLER" && user.role !== "ADMIN"))) {
       router.push("/seller-login");
     }
   }, [user, isLoading, router]);

   if (isLoading || !user || (user.role !== "SELLER" && user.role !== "ADMIN")) {
     return (
       <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
         <Loader2 className="size-10 text-primary animate-spin" />
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
        <SellerSidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Navbar for Dashboard */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-4 lg:px-10 sticky top-0 bg-[#0A0A0B]/80 backdrop-blur-xl z-30">
           <div className="flex items-center gap-4 flex-1">
             <button 
               className="lg:hidden p-2 text-gray-400 hover:text-white"
               onClick={() => setIsSidebarOpen(true)}
             >
               <Menu className="size-6" />
             </button>
             
             <div className="relative w-full max-w-sm hidden md:block group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-500 group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search analytics, orders, or products..." 
                  className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-primary/30 focus:bg-white/[0.08] transition-all"
                />
             </div>
           </div>

           <div className="flex items-center gap-2 lg:gap-6">
              <NotificationsMenu role="SELLER" />
              
              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-3 pl-2 lg:pl-6 lg:border-l lg:border-white/5 hover:opacity-80 transition-all outline-none"
                >
                   <div className="hidden lg:flex flex-col items-end">
                      <span className="text-sm font-bold text-white">{user?.name}</span>
                      <span className="text-[10px] font-bold text-primary uppercase tracking-tighter">{user?.role}</span>
                   </div>
                   <div className="size-8 md:size-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-black shadow-lg shadow-primary/20 text-xs md:text-sm">
                      {user?.name?.[0]}
                   </div>
                </button>

                {isProfileOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)} />
                    <div className="absolute right-0 mt-4 w-56 bg-[#111] border border-white/10 rounded-2xl shadow-2xl py-2 z-20 animate-in fade-in zoom-in-95 duration-200">
                       <div className="px-4 py-3 border-b border-white/5 mb-1 lg:hidden">
                          <p className="text-sm font-bold text-white">{user?.name}</p>
                          <p className="text-[10px] font-bold text-primary uppercase tracking-widest mt-0.5">{user?.role}</p>
                       </div>
                       
                       <button 
                         onClick={() => {
                           router.push("/seller/profile");
                           setIsProfileOpen(false);
                         }}
                         className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-all text-left"
                       >
                          <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                             <UserCircle size={14} />
                          </div>
                          Profile Settings
                       </button>

                       <button 
                         onClick={handleLogout}
                         className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-red-400 hover:bg-red-500/10 transition-all text-left"
                       >
                          <div className="size-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400">
                             <LogOut size={14} />
                          </div>
                          Logout Session
                       </button>
                    </div>
                  </>
                )}
              </div>
           </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="p-4 md:p-8 lg:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
