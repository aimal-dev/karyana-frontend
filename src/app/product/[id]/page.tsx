"use client"

import { useState, use } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Button } from "@/components/ui/Button";
import { Star, Minus, Plus, ShoppingCart, Heart, ShieldCheck, Truck, RefreshCcw } from "lucide-react";
import Image from "next/image";
import { useCartStore } from "@/store/useCartStore";
import ProductSection from "@/components/home/ProductSection";

export default function ProductSinglePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [qty, setQty] = useState(1);
  const addToCart = useCartStore((state) => state.addToCart);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await api.get(`/products/${id}`);
      return res.data.product;
    }
  });
  if (isLoading) return <div className="min-h-screen bg-background flex items-center justify-center pt-20"><div className="size-16 border-t-2 border-primary rounded-full animate-spin" /></div>;
  if (!product) return <div className="min-h-screen bg-background flex items-center justify-center pt-20 font-black text-4xl uppercase tracking-tighter shadow-sm">Product Not Found</div>;

  return (
    <div className="min-h-screen bg-background pt-20 pb-20">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 item-start">
          
          {/* Gallery Area */}
          <div className="space-y-6">
            <div className="relative aspect-square rounded-[2rem] overflow-hidden border border-border p-10 bg-muted/30">
               <Image 
                 src={product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e'} 
                 alt={product.title} 
                 fill 
                 className="object-contain transition-transform duration-700 hover:scale-105" 
               />
               <div className="absolute top-8 left-8 bg-primary text-primary-foreground font-black text-[10px] px-4 py-2 rounded-full uppercase tracking-widest shadow-lg shadow-primary/20">
                  {product.category?.name}
               </div>
            </div>
            
            <div className="grid grid-cols-4 gap-4">
               {[1,2,3,4].map((i) => (
                 <div key={i} className={`aspect-square rounded-2xl border border-border bg-muted/30 relative overflow-hidden cursor-pointer hover:border-primary transition-all ${i === 1 ? 'ring-1 ring-primary border-primary' : ''}`}>
                    <Image src={product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e'} alt="thumb" fill className="object-contain p-2" />
                 </div>
               ))}
            </div>
          </div>

          {/* Details Area */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-yellow-500">
                 {[...Array(5)].map((_, i) => <Star key={i} className="size-3.5 fill-current" />)}
                 <span className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] ml-2">(128 Reviews)</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none uppercase font-rajdhani">{product.title}</h1>
              <div className="flex items-center gap-4 pt-2">
                 <span className="text-primary font-black text-4xl tracking-tighter">${product.price.toFixed(2)}</span>
                 <span className="text-muted-foreground line-through text-lg font-black opacity-50 tracking-tighter">${(product.price * 1.2).toFixed(2)}</span>
              </div>
            </div>

            <p className="text-muted-foreground text-sm leading-relaxed font-medium uppercase tracking-wide">
               {product.description || "Indulge in the pure, unadulterated goodness of our premium organic products. Sourced directly from local farms, ensuring maximum freshness and nutrient density for your daily health needs."}
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-y border-border py-10">
               <div className="flex items-center bg-muted/30 border border-border rounded-2xl h-14 px-4 gap-6 shrink-0">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="hover:text-primary transition-colors"><Minus className="size-4" /></button>
                  <span className="font-black text-lg w-8 text-center tabular-nums">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className="hover:text-primary transition-colors"><Plus className="size-4" /></button>
               </div>
               
               <Button 
                 onClick={() => addToCart({ ...product, productId: product.id, qty })}
                 className="flex-1 h-14 text-[10px] font-black tracking-[0.2em] rounded-2xl gap-3 group shadow-lg shadow-primary/20"
               >
                  <ShoppingCart className="size-4 group-hover:translate-x-1 transition-transform" /> ADD TO BAG
               </Button>

               <Button variant="outline" size="icon" className="h-14 w-14 rounded-2xl border-border shrink-0 hover:bg-primary/10 hover:text-primary transition-colors">
                  <Heart className="size-5" />
               </Button>
            </div>

            <div className="space-y-3 pt-2">
               <div className="flex items-center gap-3">
                  <span className="text-muted-foreground text-[10px] font-black uppercase tracking-widest w-24">SKU:</span>
                  <span className="font-black text-[10px] uppercase tracking-widest">KRYN-{product.id}024</span>
               </div>
               <div className="flex items-center gap-3">
                  <span className="text-muted-foreground text-[10px] font-black uppercase tracking-widest w-24">Category:</span>
                  <span className="text-primary font-black text-[10px] uppercase tracking-widest">{product.category?.name}</span>
               </div>
               <div className="flex items-center gap-3">
                  <span className="text-muted-foreground text-[10px] font-black uppercase tracking-widest w-24">Tags:</span>
                  <span className="font-black text-[10px] uppercase tracking-widest">Organic, Fresh, Premium</span>
               </div>
            </div>

            {/* Features Row */}
            <div className="grid grid-cols-3 gap-4 pt-8">
               {[
                 { icon: Truck, label: "Fast Delivery" },
                 { icon: ShieldCheck, label: "Secure Pay" },
                 { icon: RefreshCcw, label: "Easy Returns" }
               ].map((item, i) => (
                 <div key={i} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-muted/20 border border-border gap-2 group hover:border-primary transition-colors">
                    <item.icon className="size-5 text-primary group-hover:scale-110 transition-transform" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-center leading-none">{item.label}</span>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Tabs / Description / Reviews */}
        <div className="mt-24 space-y-12">
            <div className="flex gap-12 border-b border-border">
              <button className="text-primary font-black text-[10px] uppercase tracking-[0.2em] border-b-2 border-primary pb-4 -mb-[2px]">Description</button>
              <button className="text-muted-foreground hover:text-primary transition-colors font-black text-[10px] uppercase tracking-[0.2em] pb-4">Reviews (128)</button>
              <button className="text-muted-foreground hover:text-primary transition-colors font-black text-[10px] uppercase tracking-[0.2em] pb-4">Shipping</button>
            </div>
           
            <div className="max-w-4xl space-y-6">
              <h3 className="font-black text-2xl tracking-tighter uppercase font-rajdhani">Pure Organic Excellence</h3>
              <p className="text-muted-foreground leading-relaxed text-sm font-medium uppercase tracking-wide">
                 Our {product.title} is sourced strictly from artisanal farms that follow zero-chemical protocols. We believe in providing you with food that is not just a commodity, but a medicine for the body. Every package is sealed with freshness and checked for quality by our expert selectors.
              </p>
              <ul className="space-y-4 pt-4">
                 {[
                   "100% Organic certified produce",
                   "No artificial preservatives or colors",
                   "Freshly harvested within 24 hours of dispatch",
                   "Sustainable and carbon-neutral packaging"
                 ].map((li, i) => (
                   <li key={i} className="flex items-center gap-3 text-muted-foreground text-[10px] font-black tracking-widest uppercase">
                      <div className="size-1 bg-primary rounded-full" /> {li}
                   </li>
                 ))}
              </ul>
            </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-32 border-t border-border pt-20">
           <ProductSection title="Related Products" subtitle="YOU MAY ALSO LIKE" />
        </div>
      </div>
    </div>
  );
}
