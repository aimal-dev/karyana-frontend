   "use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Store, 
  ShoppingBag, 
  BarChart3, 
  ShieldCheck,
  Settings,
  LogOut,
  MessageSquare,
  Star
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const adminSidebarItems = [
  {
    title: "Overview",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Manage Sellers",
    href: "/admin/sellers",
    icon: Store,
  },
  {
    title: "Manage Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "All Products",
    href: "/admin/products",
    icon: ShoppingBag,
  },
  {
    title: "Orders",
    href: "/admin/orders",
    icon: ShoppingBag,
  },
  {
    title: "Complaints",
    href: "/admin/complaints",
    icon: MessageSquare,
  },
  {
    title: "Reviews",
    href: "/admin/reviews",
    icon: Star,
  },
  {
    title: "Revenue",
    href: "/admin/revenue",
    icon: BarChart3,
  },
  {
    title: "Security",
    href: "/admin/security",
    icon: ShieldCheck,
  },
  {
    title: "Categories",
    href: "/admin/categories",
    icon: Settings,
  },
  {
    title: "App Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    queryClient.setQueryData(["user"], null);
    router.push("/admin-login");
  };

  return (
    <aside className="w-72 bg-[#0A0A0B] border-r border-white/5 min-h-screen flex flex-col sticky top-0">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-10">
           <div className="size-10 bg-indigo-600 rounded-xl flex items-center justify-center font-black text-white text-xl shadow-lg shadow-indigo-500/20">
             A
           </div>
           <div>
              <h1 className="text-white font-black text-lg leading-none">Admin Panel</h1>
              <p className="text-indigo-400 text-[10px] font-bold uppercase tracking-widest mt-1">Super Controls</p>
           </div>
        </div>

        <nav className="space-y-2">
          {adminSidebarItems.map((item) => (
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
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-500 rounded-r-full" />
              )}
              <item.icon className={cn(
                "size-5 transition-colors duration-300", 
                pathname === item.href ? "text-indigo-500" : "text-gray-600 group-hover:text-gray-300"
              )} />
              {item.title}
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-8 space-y-4">
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
