"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  BarChart3, 
  Globe, 
  Star, 
  UserCircle,
  LogOut,
  Bell,
  MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const sellerSidebarItems = [
  {
    title: "Dashboard",
    href: "/seller",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    href: "/seller/products",
    icon: Package,
  },
  {
    title: "Orders",
    href: "/seller/orders",
    icon: ShoppingBag,
  },
  {
    title: "Customers",
    href: "/seller/customers",
    icon: Users,
  },
  {
    title: "Revenue",
    href: "/seller/revenue",
    icon: BarChart3,
  },
  {
    title: "Reviews",
    href: "/seller/reviews",
    icon: Star,
  },
  {
    title: "Complaints",
    href: "/seller/complaints",
    icon: MessageSquare,
  },
  {
    title: "Online Store",
    href: "/shop",
    icon: Globe,
  },
  {
    title: "Categories",
    href: "/seller/categories",
    icon: ShoppingBag,
  },
  {
    title: "My Account",
    href: "/seller/profile",
    icon: UserCircle,
  },
];

export function SellerSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    queryClient.setQueryData(["user"], null);
    router.push("/seller-login");
  };

  return (
    <aside className="w-72 bg-[#0A0A0B] border-r border-white/5 min-h-screen flex flex-col sticky top-0">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-10">
           <div className="size-10 bg-primary rounded-xl flex items-center justify-center font-black text-white text-xl shadow-lg shadow-primary/20">
             K
           </div>
           <div>
              <h1 className="text-white font-black text-lg leading-none">Karyana Store</h1>
              <p className="text-primary text-[10px] font-bold uppercase tracking-widest mt-1">Verified Seller</p>
           </div>
        </div>

        <nav className="space-y-2">
          {sellerSidebarItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-4 px-4 py-3.5 text-sm font-bold rounded-xl transition-all duration-300 group relative overflow-hidden",
                pathname === item.href 
                  ? "bg-white/5 text-white" 
                  : "text-gray-500 hover:text-white hover:bg-white/[0.02]"
              )}
            >
              {pathname === item.href && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
              )}
              <item.icon className={cn(
                "size-5 transition-colors duration-300", 
                pathname === item.href ? "text-primary" : "text-gray-600 group-hover:text-gray-300"
              )} />
              {item.title}
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-8 space-y-4">
         <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
            <div className="flex items-center justify-between mb-2">
               <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Support</span>
               <Bell className="size-4 text-primary animate-pulse" />
            </div>
            <p className="text-xs text-gray-400 font-medium leading-relaxed">
               Need help with your store? Our support is 24/7.
            </p>
         </div>

         <button 
           onClick={handleLogout}
           className="flex items-center gap-4 px-4 py-4 text-sm font-bold rounded-xl text-red-400 hover:bg-red-500/10 w-full transition-all group"
         >
           <LogOut className="size-5 group-hover:-translate-x-1 transition-transform" />
           Logout
         </button>
      </div>
    </aside>
  );
}
