"use client"

import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8F9FC] pt-24 lg:pt-32">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 py-8">
           {/* Sidebar - Responsive */}
           <div className={
             `fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 lg:relative lg:translate-x-0 lg:z-0
             ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`
           }>
             <DashboardSidebar onClose={() => setIsSidebarOpen(false)} />
           </div>

           <div className="flex-1 min-w-0">
             {/* Mobile Menu Toggle */}
             <div className="lg:hidden mb-6 flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3">
                   <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                      <Menu className="size-6" />
                   </div>
                   <div>
                      <h3 className="font-bold text-gray-900">Dashboard Menu</h3>
                      <p className="text-xs text-gray-500">Quick access to account</p>
                   </div>
                </div>
                <button 
                  onClick={() => setIsSidebarOpen(true)}
                  className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-primary/20"
                >
                  Open
                </button>
             </div>

             <main>
               {children}
             </main>
           </div>
        </div>
      </div>
    </div>
  );
}
