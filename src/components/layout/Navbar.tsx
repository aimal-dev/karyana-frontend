"use client"

import Link from "next/link";
import { ShoppingCart, User, Search, Menu, Heart, LogOut, Loader2, Bell } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useCartStore } from "@/store/useCartStore";
import { ThemeToggle } from "./ThemeToggle";
import CartDrawer from "./CartDrawer";
import { useUser } from "@/hooks/useUser";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { useRouter } from "next/navigation";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

interface Notification {
  id: number;
  message: string;
  link: string | null;
  read: boolean;
  createdAt: string;
}


export default function Navbar() {
  const { items, setOpen } = useCartStore();
  const cartCount = items.reduce((acc, item) => acc + item.qty, 0);

  return (
    <>
      <nav className="fixed top-2 md:top-5 left-0 right-0 z-40 w-[95%] lg:w-[calc(100%-10rem)] mx-auto bg-white/80 backdrop-blur-md rounded-[50px] border border-white/20 shadow-lg text-foreground transition-all duration-300">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="size-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-black text-xl shadow-lg shadow-primary/20">
              K
            </div>
            <span className="text-xl md:text-2xl font-black tracking-tighter hidden sm:block">
              KARYANA <span className="text-primary italic">STORE</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-10 font-subheading-main">
            <Link href="/" className="text-[14px] font-bold font-black tracking-[0.2em] hover:text-primary transition-colors uppercase">HOME</Link>
            <Link href="/shop" className="text-[14px] font-bold font-black tracking-[0.2em] hover:text-primary transition-colors uppercase">SHOP</Link>
            <Link href="/about" className="text-[14px] font-bold font-black tracking-[0.2em] hover:text-primary transition-colors uppercase">ABOUT</Link>
            <Link href="/blog" className="text-[14px] font-bold font-black tracking-[0.2em] hover:text-primary transition-colors uppercase">BLOG</Link>
            <Link href="/contact" className="text-[14px] font-bold font-black tracking-[0.2em] hover:text-primary transition-colors uppercase">CONTACT</Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 md:gap-3">
            <ThemeToggle />
            <NotificationsMenu />
            
            <Button variant="ghost" size="icon" className="hidden sm:flex hover:text-primary rounded-full">
              <Search className="size-5" />
            </Button>
            
            <Button variant="ghost" size="icon" className="hidden sm:flex hover:text-primary rounded-full">
              <Heart className="size-5" />
            </Button>
            
            <UserMenu />

            <Button 
               variant="ghost" 
               size="icon" 
               onClick={() => setOpen(true)}
               className="relative hover:text-primary rounded-full"
            >
              <ShoppingCart className="size-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-1 -right-1 size-5 flex items-center justify-center p-0 text-[10px] font-black">
                  {cartCount}
                </Badge>
              )}
            </Button>

            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="size-6" />
            </Button>
          </div>
        </div>
      </nav>
      <CartDrawer />
    </>
  );
}

function UserMenu() {
  const { data: user, isLoading } = useUser();
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleLogout = () => {
    const role = user?.role;
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    queryClient.setQueryData(["user"], null);
    
    if (role === "ADMIN") router.push("/admin-login");
    else if (role === "SELLER") router.push("/seller-login");
    else router.push("/login");
  };


  if (isLoading) {
    return (
      <Button variant="ghost" size="icon" className="hidden sm:flex rounded-full">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </Button>
    );
  }

  if (!user) {
    return (
      <Link href="/login" className="hidden sm:flex">
        <Button variant="ghost" size="icon" className="hover:text-primary rounded-full">
          <User className="size-5" />
        </Button>
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="hidden sm:flex hover:text-primary rounded-full ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
          <div className="size-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-black text-sm shadow-md shadow-primary/20">
            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 bg-card/95 backdrop-blur-md border border-border/50 shadow-xl">
        <DropdownMenuLabel className="font-normal p-3">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-black leading-none uppercase tracking-wider">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border/50" />
        <Link href={user.role === 'ADMIN' ? '/admin' : user.role === 'SELLER' ? '/seller' : '/dashboard'}>
          <DropdownMenuItem className="rounded-xl p-3 cursor-pointer focus:bg-primary/10 focus:text-primary font-bold text-xs uppercase tracking-wider">
            <User className="mr-2 h-4 w-4" />
            <span>My Dashboard</span>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem 
          onClick={handleLogout}
          className="rounded-xl p-3 cursor-pointer focus:bg-destructive/10 focus:text-destructive text-destructive font-bold text-xs uppercase tracking-wider"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function NotificationsMenu() {
  const { data: user } = useUser();
  const router = useRouter();
  const { data, refetch } = useQuery<{ notifications: Notification[] }>({ 
     queryKey: ["notifications"], 
     queryFn: async () => (await api.get("/notification")).data,
     enabled: !!user,
     refetchInterval: 3000
  });
  const notifications = data?.notifications || [];

  const handleRead = async (id: number, link: string | null) => {
    try {
        await api.put(`/notification/read/${id}`);
        refetch();
        if (link) router.push(link);
    } catch {}
  };

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="hidden sm:flex hover:text-primary rounded-full relative">
          <Bell className="size-5" />
          {notifications.length > 0 && (
             <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full animate-pulse" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 rounded-2xl p-0 bg-card/95 backdrop-blur-md border border-border/50 shadow-xl overflow-hidden">
        <DropdownMenuLabel className="font-black p-4 bg-gray-50/50 border-b border-gray-100 flex justify-between items-center">
             <span className="uppercase tracking-wider">Notifications</span>
             <Badge variant="secondary" className="rounded-full px-2 text-xs">{notifications.length} New</Badge>
        </DropdownMenuLabel>
        <div className="max-h-[300px] overflow-y-auto">
           {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm font-medium">
                 No new notifications
              </div>
           ) : (
              notifications.map((n: Notification) => (
                 <DropdownMenuItem 
                   key={n.id} 
                   onClick={() => handleRead(n.id, n.link)}
                   className="p-4 cursor-pointer focus:bg-gray-50 border-b border-gray-50 last:border-0"
                 >
                    <div className="flex gap-3">
                       <div className="size-2 mt-1.5 rounded-full bg-primary shrink-0" />
                       <div>
                          <p className="text-sm font-medium text-gray-900 leading-snug">{n.message}</p>
                          <p className="text-[10px] uppercase font-bold text-gray-400 mt-1">{new Date(n.createdAt).toLocaleDateString()}</p>
                       </div>
                    </div>
                 </DropdownMenuItem>
              ))
           )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
