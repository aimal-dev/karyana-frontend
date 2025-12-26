"use client";

import { useWishlistStore } from "@/store/useWishlistStore";
import { useCartStore } from "@/store/useCartStore";
import { Trash2, ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";

export default function WishlistPage() {
  const { items, removeFromWishlist } = useWishlistStore();
  const addToCart = useCartStore((state) => state.addToCart);

  return (
    <div className="min-h-screen bg-background pt-20 pb-20">
      {/* Hero Header */}
      <div className="relative py-24 overflow-hidden border-b border-border bg-accent/20">
        <div className="container mx-auto px-4 lg:px-20 relative z-10 space-y-4 text-center">
           <p className="text-primary font-medium tracking-[0.4em] uppercase text-[14px] font-subheading">Your Favorites</p>
           <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none uppercase font-subheading-main">MY <span className="text-primary font-subheading-main">WISHLIST</span></h1>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-20 py-24 px-20">
        {items.length === 0 ? (
          <div className="text-center space-y-6 py-20">
             <div className="size-24 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
                <Heart className="size-10" />
             </div>
             <h2 className="text-2xl font-medium uppercase tracking-tight">Your wishlist is empty</h2>
             <p className="text-muted-foreground font-medium uppercase tracking-wide">Start saving your favorite items now!</p>
             <Link href="/shop">
                <Button className="h-12 px-8 text-[10px] font-black tracking-[0.2em] rounded-xl uppercase mt-4">
                   Browse Shop
                </Button>
             </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
             {items.map((product) => (
                <div key={product.id} className="group relative bg-card border border-border rounded-2xl p-4 transition-all hover:shadow-xl hover:border-primary/30 overflow-hidden">
                   {/* Image Area */}
                   <Link href={`/product/${product.id}`} className="block">
                      <div className="relative aspect-square rounded-xl overflow-hidden bg-muted mb-6 cursor-pointer flex items-center justify-center">
                         {product.image ? (
                            <Image 
                               src={product.image} 
                               alt={product.title} 
                               fill 
                               className="object-cover transition-transform duration-500 group-hover:scale-110" 
                            />
                         ) : (
                            <div className="text-muted-foreground/30">
                               <svg className="size-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                               </svg>
                            </div>
                         )}
                         <button 
                            onClick={(e) => {
                               e.preventDefault();
                               removeFromWishlist(product.id);
                            }}
                            className="absolute top-3 right-3 bg-white/80 hover:bg-red-500 hover:text-white text-destructive p-2 rounded-lg transition-colors backdrop-blur-sm z-10"
                            title="Remove from Wishlist"
                         >
                            <Trash2 className="size-4" />
                         </button>
                      </div>
                   </Link>
                   
                   <div className="space-y-2 px-1">
                      <Link href={`/product/${product.id}`} className="block">
                         <h4 className="text-[12px] tracking-tight hover:text-primary transition-colors line-clamp-1 font-bold uppercase">
                           {product.title}
                         </h4>
                      </Link>

                      <div className="flex items-center gap-2">
                         <span className="text-primary font-black text-lg tracking-tighter">RS {product.price.toFixed(2)}</span>
                      </div>

                      <Button 
                         onClick={() => addToCart({ ...product, productId: product.id, qty: 1 })}
                         className="w-full mt-4 bg-muted/50 hover:bg-primary hover:text-primary-foreground border-border text-foreground font-medium tracking-widest text-[9px] h-9 group rounded-xl font-subheading"
                      >
                         <ShoppingCart className="size-3.5 mr-2 group-hover:scale-110 transition-transform" />
                         ADD TO CART
                      </Button>
                   </div>
                </div>
             ))}
          </div>
        )}
      </div>
    </div>
  );
}
