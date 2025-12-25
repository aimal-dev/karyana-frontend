"use client"

import { useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";
import { Button } from "@/components/ui/Button";
import { Trash2, Trash, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const updateQty = useCartStore((state) => state.updateQty);
  const clearCart = useCartStore((state) => state.clearCart);
  const totalPrice = useCartStore((state) => state.totalPrice);
  const fetchCart = useCartStore((state) => state.fetchCart);

  // Fetch cart from backend on mount
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="size-24 rounded-full bg-muted/50 border border-border flex items-center justify-center mb-8 shadow-inner">
           <ShoppingBag className="size-10 text-muted-foreground opacity-30" />
        </div>
        <h2 className="text-3xl font-black tracking-tighter mb-2 uppercase font-subheading-main">YOUR BAG IS EMPTY</h2>
        <p className="text-muted-foreground font-medium text-[14px] uppercase tracking-widest mb-8 text-center max-w-xs opacity-70 font-subheading">Looks like you haven&apos;t added any products to your bag yet.</p>
        <Link href="/shop">
          <Button size="lg" className="h-12 px-10 gap-3 group font-black tracking-[0.2em] text-[10px] rounded-xl uppercase">
            CONTINUE SHOPPING <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-20">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          
          {/* Items List */}
          <div className="flex-1 space-y-8">
             <div className="flex justify-between items-end border-b border-border pb-6 font-subheading-main">
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase">MY <span className="text-primary italic">BAG ({items.length})</span></h1>
                <button 
                  onClick={clearCart}
                  className="text-[9px] font-black tracking-[0.2em] text-muted-foreground hover:text-destructive flex items-center gap-2 transition-colors uppercase font-subheading"
                >
                  <Trash className="size-3" /> CLEAR ALL
                </button>
             </div>

             <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="group relative bg-card border border-border rounded-3xl p-6 flex flex-col md:flex-row items-center gap-8 transition-all hover:shadow-xl hover:border-primary/20">
                     <div className="size-28 rounded-2xl bg-muted/30 border border-border relative overflow-hidden shrink-0 flex items-center justify-center">
                        {item.image ? (
                          <Image src={item.image} alt={item.title} fill className="object-cover p-1 transition-transform group-hover:scale-110" />
                        ) : (
                          <div className="text-muted-foreground">
                            <svg className="size-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                     </div>
                     
                     <div className="flex-1 space-y-1 text-center md:text-left">
                        <p className="text-primary font-black text-[8px] uppercase tracking-[0.2em] font-subheading">STAPLES • PREMIUM</p>
                        <h3 className="font-black text-lg md:text-xl leading-tight uppercase font-subheading-main">{item.title}</h3>
                        <p className="text-muted-foreground font-medium text-[14px] uppercase tracking-widest font-subheading">In Stock • Ready to dispatch</p>
                        <div className="flex items-center justify-center md:justify-start gap-4 pt-1">
                           <span className="text-primary font-black text-xl tracking-tighter">Rs {item.price.toFixed(2)}</span>
                        </div>
                     </div>

                     <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center bg-muted/30 border border-border rounded-xl h-10 px-3 gap-4">
                           <button onClick={() => updateQty(item.id, item.qty - 1)} className="hover:text-primary transition-colors"><Minus className="size-3.5" /></button>
                           <span className="font-black text-sm w-6 text-center tabular-nums">{item.qty}</span>
                           <button onClick={() => updateQty(item.id, item.qty + 1)} className="hover:text-primary transition-colors"><Plus className="size-3.5" /></button>
                        </div>
                        <p className="text-muted-foreground text-[8px] font-black uppercase tracking-[0.2em] font-subheading">Quantity</p>
                     </div>

                     <div className="w-full md:w-32 text-center md:text-right space-y-1">
                        <p className="text-muted-foreground text-[8px] font-black uppercase tracking-[0.2em] font-subheading">Total</p>
                        <p className="font-black text-xl tracking-tighter font-subheading-main text-primary">Rs {(item.price * item.qty).toFixed(2)}</p>
                     </div>

                     <button 
                       onClick={() => removeFromCart(item.id)}
                       className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-destructive hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
                     >
                        <Trash2 className="size-4" />
                     </button>
                  </div>
                ))}
             </div>
          </div>

          {/* Summary / Sidebar */}
          <aside className="w-full lg:w-96 shrink-0">
             <div className="bg-card border border-border rounded-[2.5rem] p-10 space-y-10 sticky top-32 shadow-sm">
                <div className="space-y-4 font-subheading-main">
                   <h2 className="font-black text-3xl uppercase tracking-tighter leading-none italic">ORDER <span className="text-primary">SUMMARY</span></h2>
                   <div className="w-8 h-1 bg-primary" />
                </div>

                <div className="space-y-6">
                   <div className="flex justify-between items-center font-medium text-[14px] uppercase tracking-widest font-subheading">
                      <span className="text-muted-foreground">Subtotal ({items.length} items)</span>
                      <span className="font-black tracking-tighter text-lg">Rs {totalPrice().toFixed(2)}</span>
                   </div>
                   <div className="flex justify-between items-center font-medium text-[14px] uppercase tracking-widest text-primary font-subheading">
                      <span>Delivery Fee</span>
                      <span className="font-black">FREE</span>
                   </div>
                   <div className="flex justify-between items-center font-medium text-[14px] uppercase tracking-widest font-subheading">
                      <span className="text-muted-foreground">Est. Taxes</span>
                      <span className="font-black tracking-tighter text-lg">Rs 0.00</span>
                   </div>
                   
                   <div className="border-t border-border pt-6 flex justify-between items-end font-subheading-main">
                      <span className="font-black text-2xl uppercase tracking-tighter">Total Price</span>
                      <div className="text-right">
                         <span className="block text-primary font-black text-4xl tracking-tighter leading-none">Rs {totalPrice().toFixed(2)}</span>
                         <span className="text-muted-foreground text-[8px] font-black uppercase tracking-[0.2em] italic font-subheading">Includes all taxes</span>
                      </div>
                   </div>
                </div>

                <div className="space-y-4 pt-4">
                   <Link href="/checkout" className="block">
                      <Button className="w-full h-14 text-[10px] font-black tracking-[0.3em] rounded-2xl gap-3 group shadow-lg shadow-primary/20 uppercase">
                         CHECKOUT NOW <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                   </Link>
                   <Link href="/shop" className="block">
                      <Button variant="outline" className="w-full h-12 text-[9px] font-black tracking-[0.2em] rounded-xl border-border text-muted-foreground hover:text-primary transition-all uppercase">
                         CONTINUE SHOPPING
                      </Button>
                   </Link>
                </div>
                
                 <div className="flex flex-col items-center gap-6 text-center">
                    <p className="text-[8px] font-black tracking-[0.2em] text-muted-foreground uppercase font-subheading">Accepted Secure Payments</p>
                    <div className="flex gap-3 flex-wrap justify-center">
                      <div className="px-3 py-1.5 bg-muted/50 border border-border rounded-lg">
                        <span className="text-[10px] font-black tracking-wider text-muted-foreground">PAYPAL</span>
                      </div>
                      <div className="px-3 py-1.5 bg-muted/50 border border-border rounded-lg">
                        <span className="text-[10px] font-black tracking-wider text-muted-foreground">VISA</span>
                      </div>
                      <div className="px-3 py-1.5 bg-muted/50 border border-border rounded-lg">
                        <span className="text-[10px] font-black tracking-wider text-muted-foreground">MASTERCARD</span>
                      </div>
                    </div>
                 </div>
             </div>
          </aside>

        </div>
      </div>
    </div>
  );
}
