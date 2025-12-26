"use client"

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, User, Search, Menu, Heart, LogOut, Loader2, Bell, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { ThemeToggle } from "./ThemeToggle";
import CartDrawer from "./CartDrawer";
import { useUser } from "@/hooks/useUser";
import { motion, AnimatePresence } from "framer-motion";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const cartCount = items.reduce((acc, item) => acc + item.qty, 0);

  const { data: settingsData } = useQuery({
    queryKey: ["store-settings"],
    queryFn: async () => (await api.get("/admin/settings")).data
  });

  const logoUrl = settingsData?.settings?.logoUrl;
  const storeName = settingsData?.settings?.storeName || "KARYANA STORE";

  return (
    <>
      <nav className="fixed top-2 md:top-5 left-0 right-0 z-40 w-[95%] lg:w-[calc(100%-10rem)] mx-auto bg-white/80 backdrop-blur-md rounded-[50px] border border-white/20 shadow-lg text-foreground transition-all duration-300">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            {logoUrl ? (
              <img src={logoUrl} className="h-10 w-auto object-contain" alt={storeName} />
            ) : (
              <div className="size-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-black text-xl shadow-lg shadow-primary/20">
                {storeName.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="text-xl md:text-2xl font-black tracking-tighter hidden sm:block uppercase">
              {storeName.split(" ")[0]} <span className="text-primary italic">{storeName.split(" ")[1] || ""}</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-10 font-subheading-main">
            <Link href="/" className="text-[14px] font-bold font-black tracking-[0.2em] hover:text-primary transition-colors uppercase">HOME</Link>
            <Link href="/shop" className="text-[14px] font-bold font-black tracking-[0.2em] hover:text-primary transition-colors uppercase">SHOP</Link>
            <Link href="/about" className="text-[14px] font-bold font-black tracking-[0.2em] hover:text-primary transition-colors uppercase">ABOUT</Link>

            <Link href="/contact" className="text-[14px] font-bold font-black tracking-[0.2em] hover:text-primary transition-colors uppercase">CONTACT</Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 md:gap-3">
            {/* <ThemeToggle /> */}
            <NotificationsMenu />
            
            <SearchMenu />
            
            <WishlistButton />
            
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

            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="size-6" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <motion.div 
               initial={{ x: "100%" }}
               animate={{ x: 0 }}
               exit={{ x: "100%" }}
               transition={{ type: "spring", damping: 25, stiffness: 200 }}
               className="fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-background shadow-2xl p-6 lg:hidden flex flex-col"
            >
              <div className="flex items-center justify-between mb-8">
                 <span className="text-xl font-black uppercase tracking-tighter">Menu</span>
                 <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)} className="rounded-full">
                    <X className="size-6" />
                 </Button>
              </div>

              <div className="flex flex-col gap-6">
                 {[
                   { label: "Home", href: "/" },
                   { label: "Shop", href: "/shop" },
                   { label: "About", href: "/about" },
                   { label: "Contact", href: "/contact" },
                 ].map((link) => (
                   <Link 
                     key={link.href}
                     href={link.href}
                     onClick={() => setIsMobileMenuOpen(false)}
                     className="text-2xl font-black uppercase tracking-wider hover:text-primary transition-colors"
                   >
                     {link.label}
                   </Link>
                 ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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

function SearchMenu() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  
  // Debounce search query
  const { data: suggestions, isLoading } = useQuery({
     queryKey: ["search-suggestions", query],
     queryFn: async () => {
        if (!query.trim()) return [];
        const res = await api.get(`/products/suggestions?search=${encodeURIComponent(query)}`);
        return res.data.suggestions;
     },
     enabled: query.length > 2,
     staleTime: 1000 * 60
  });

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsOpen(false);
    if (query.trim()) {
      router.push(`/shop?search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="hidden sm:flex hover:text-primary rounded-full">
          <Search className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96 p-0 rounded-2xl bg-card/95 backdrop-blur-md border border-border overflow-hidden">
         <div className="p-4 border-b border-border">
           <form onSubmit={handleSearch} className="relative">
              <Input 
                 value={query}
                 onChange={(e) => setQuery(e.target.value)}
                 placeholder="Search products..." 
                 className="pr-10 h-10 bg-muted/50 border-border rounded-xl text-sm font-medium" 
                 autoFocus
              />
              <Button size="icon" type="submit" variant="ghost" className="absolute right-0 top-0 h-10 w-10 hover:bg-transparent text-muted-foreground hover:text-primary">
                 <Search className="size-4" />
              </Button>
           </form>
         </div>
         
         {isLoading && query.length > 2 && (
             <div className="py-8 text-center">
                 <Loader2 className="size-4 animate-spin mx-auto text-primary" />
                 <p className="text-[10px] uppercase font-bold text-muted-foreground mt-2 tracking-widest">Searching...</p>
             </div>
         )}

         {!isLoading && suggestions && suggestions.length === 0 && query.length > 2 && (
             <div className="py-8 text-center px-4">
                 <p className="text-sm font-bold text-foreground">No matches found</p>
                 <p className="text-[10px] text-muted-foreground mt-1">Press Enter to search broadly</p>
             </div>
         )}
         
         {suggestions && suggestions.length > 0 && (
            <div className="py-2">
               <p className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Suggestions</p>
               {suggestions.map((product: any) => (
                  <Link 
                    key={product.id} 
                    href={`/product/${product.id}`} 
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors"
                  >
                     <div className="size-10 rounded-lg bg-muted border border-border overflow-hidden flex-shrink-0 relative">
                        {product.image ? (
                           <img src={product.image} className="object-cover w-full h-full" alt="" />
                        ) : (
                           <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">?</div>
                        )}
                     </div>
                     <div>
                        <p className="text-sm font-bold text-foreground leading-tight">{product.title}</p>
                        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">{product.category.name}</p>
                     </div>
                  </Link>
               ))}
            </div>
         )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function WishlistButton() {
  const { items } = useWishlistStore();
  const count = items.length;

  return (
    <Link href="/wishlist">
       <Button variant="ghost" size="icon" className="hidden sm:flex hover:text-primary rounded-full relative">
         <Heart className="size-5" />
         {count > 0 && (
           <Badge className="absolute -top-1 -right-1 size-5 flex items-center justify-center p-0 text-[10px] font-black pointer-events-none">
             {count}
           </Badge>
         )}
       </Button>
    </Link>
  );
}
