"use client"

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useCartStore } from "@/store/useCartStore";
import { Button } from "@/components/ui/Button";
import { ShoppingCart, Star, Eye, Heart, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Product {
  id: number;
  title: string;
  price: number;
  oldPrice?: number;
  image?: string;
  isOnSale?: boolean;
  createdAt: string;
}

interface ProductSectionProps {
  title: string;
  subtitle: string;
  type: "trending" | "featured";
  limit?: number;
}

export default function ProductSection({ title, subtitle, type, limit = 10 }: ProductSectionProps) {
  const addToCart = useCartStore((state) => state.addToCart);
  
  // Calculate threshold inside useMemo to keep it stable
  const newThreshold = useMemo(() => {
    return new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  }, []);

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["products", type, limit],
    queryFn: async () => {
      const params = new URLSearchParams({
        limit: limit.toString(),
        [type === "trending" ? "isTrending" : "isFeatured"]: "true"
      });
      const res = await api.get(`/products/all?${params.toString()}`);
      return res.data.products;
    }
  });

  if (isLoading) {
    return (
      <div className="py-24 flex items-center justify-center">
        <Loader2 className="size-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16 space-y-2">
          <h2 className="text-primary font-semibold font-black tracking-[0.2em] uppercase text-[15px] letter-spacing-[0.5em] font-subheading">{title}</h2>
          <h3 className="font-subheading-main text-5xl font-black tracking-tighter uppercase">{subtitle}</h3>
          <div className="w-10 h-1 bg-primary mx-auto mt-4" />
        </div>

        {/* 5 columns grid: 2 rows of 5 totals 10 products */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-5">
          {products?.map((product) => (
            <div key={product.id} className="group relative bg-card border border-border rounded-xl p-3 transition-all hover:shadow-xl hover:border-primary/30 overflow-hidden font-subheading">
              {/* Image Area */}
              <div className="relative aspect-square rounded-lg overflow-hidden bg-muted/30 mb-4">
                <Image 
                  src={product.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400&auto=format&fit=crop"} 
                  alt={product.title} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                
                {/* Labels */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                   {product.isOnSale && (
                     <div className="bg-red-500 text-white text-[7px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest">SALE</div>
                   )}
                   {new Date(product.createdAt) > newThreshold && (
                     <div className="bg-primary text-primary-foreground text-[7px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest">NEW</div>
                   )}
                </div>

                {/* Quick Action Overlay */}
                <div className="absolute inset-x-2 bottom-2 translate-y-12 group-hover:translate-y-0 transition-transform duration-500 flex justify-center gap-1.5">
                   <Button variant="secondary" size="icon" className="size-7 rounded-full bg-background/90 backdrop-blur-md border border-border hover:bg-primary hover:text-primary-foreground shadow-sm">
                      <Eye className="size-3" />
                   </Button>
                   <Button variant="secondary" size="icon" className="size-7 rounded-full bg-background/90 backdrop-blur-md border border-border hover:bg-primary hover:text-primary-foreground shadow-sm">
                      <Heart className="size-3" />
                   </Button>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-1.5 px-0.5 font-subheading">
                <div className="flex items-center gap-0.5 text-yellow-500">
                   {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`size-2 ${i < 4 ? 'fill-current' : 'text-muted'}`} />
                   ))}
                   <span className="text-muted-foreground text-[7px] font-black ml-1 uppercase tracking-widest opacity-60">(4.0)</span>
                </div>

                <Link href={`/product/${product.id}`}>
                  <h4 className="font-black text-[12px] font-bold tracking-tight hover:text-primary transition-colors line-clamp-1 uppercase leading-tight font-subheading">{product.title}</h4>
                </Link>

                <div className="flex items-center gap-2">
                   <span className="text-primary font-black text-sm tracking-tighter">RS {product.price.toFixed(2)}</span>
                   {product.isOnSale && product.oldPrice && (
                     <span className="text-muted-foreground text-[10px] line-through font-black opacity-50 tracking-tighter font-subheading">RS {product.oldPrice.toFixed(2)}</span>
                   )}
                </div>

                {/* Add to Cart Button */}
                <Button 
                  onClick={() => addToCart({ ...product, productId: product.id, qty: 1 })}
                  className="w-full mt-3 bg-muted/50 hover:bg-primary hover:text-primary-foreground border-border text-foreground font-black tracking-[0.2em] text-[8px] h-8 group rounded-lg transition-all"
                >
                  <ShoppingCart className="size-3 mr-1.5 group-hover:scale-110 transition-transform" />
                  ADD TO BAG
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        {(!products || products.length === 0) && (
          <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed border-border font-subheading">
            <p className="text-gray-500 font-black uppercase tracking-widest text-xs">No products found in this category</p>
          </div>
        )}
      </div>
    </section>
  );
}
