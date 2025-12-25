"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Star, 
  MessageSquareWarning, 
  User,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const sidebarItems = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "My Orders",
    href: "/dashboard/orders",
    icon: ShoppingBag,
  },
  {
    title: "My Reviews",
    href: "/dashboard/reviews",
    icon: Star,
  },
  {
    title: "Complaints",
    href: "/dashboard/complaints",
    icon: MessageSquareWarning,
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleLogout = () => {
    localStorage.removeItem("token");
    queryClient.setQueryData(["user"], null);
    router.push("/login");
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-100 min-h-[calc(100vh-5rem)] hidden lg:block">
      <div className="flex flex-col h-full py-6">
        <div className="px-6 mb-8">
           <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Menu</h2>
           <nav className="space-y-1">
             {sidebarItems.map((item) => (
               <Link
                 key={item.href}
                 href={item.href}
                 className={cn(
                   "flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-all duration-200 group",
                   pathname === item.href 
                     ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                     : "text-gray-500 hover:bg-gray-50 hover:text-primary"
                 )}
               >
                 <item.icon className={cn("size-5", pathname === item.href ? "text-primary-foreground" : "text-gray-400 group-hover:text-primary")} />
                 {item.title}
               </Link>
             ))}
           </nav>
        </div>

        <div className="mt-auto px-6">
           <button 
             onClick={handleLogout}
             className="flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl text-red-500 hover:bg-red-50 w-full transition-all"
           >
             <LogOut className="size-5" />
             Logout
           </button>
        </div>
      </div>
    </aside>
  );
}
