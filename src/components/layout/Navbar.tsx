"use client"

import Link from "next/link";
import { ShoppingCart, User, Search, Menu, Heart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useCartStore } from "@/store/useCartStore";
import { ThemeToggle } from "./ThemeToggle";
import CartDrawer from "./CartDrawer";

export default function Navbar() {
  const { items, setOpen } = useCartStore();
  const cartCount = items.reduce((acc, item) => acc + item.qty, 0);

  return (
    <>
      <nav className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="size-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-black text-xl shadow-lg shadow-primary/20">
              K
            </div>
            <span className="text-2xl font-black tracking-tighter hidden sm:block">
              KARYANA <span className="text-primary italic">STORE</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-10 font-subheading">
            <Link href="/" className="text-[10px] font-black tracking-[0.2em] hover:text-primary transition-colors uppercase">HOME</Link>
            <Link href="/shop" className="text-[10px] font-black tracking-[0.2em] hover:text-primary transition-colors uppercase">SHOP</Link>
            <Link href="/about" className="text-[10px] font-black tracking-[0.2em] hover:text-primary transition-colors uppercase">ABOUT</Link>
            <Link href="/blog" className="text-[10px] font-black tracking-[0.2em] hover:text-primary transition-colors uppercase">BLOG</Link>
            <Link href="/contact" className="text-[10px] font-black tracking-[0.2em] hover:text-primary transition-colors uppercase">CONTACT</Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 md:gap-3">
            <ThemeToggle />
            
            <Button variant="ghost" size="icon" className="hidden sm:flex hover:text-primary rounded-full">
              <Search className="size-5" />
            </Button>
            
            <Button variant="ghost" size="icon" className="hidden sm:flex hover:text-primary rounded-full">
              <Heart className="size-5" />
            </Button>
            
            <Link href="/login" className="hidden sm:flex">
              <Button variant="ghost" size="icon" className="hover:text-primary rounded-full">
                <User className="size-5" />
              </Button>
            </Link>

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
