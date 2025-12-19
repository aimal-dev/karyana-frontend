"use client"

import { useCartStore } from "@/store/useCartStore"
import { ShoppingCart, X, Plus, Minus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

export default function CartDrawer() {
  const { items, isOpen, setOpen, updateQty, removeFromCart, totalPrice } = useCartStore()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-background border-l border-border shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-2">
                <ShoppingCart className="size-5 text-primary" />
                <h2 className="text-xl font-black uppercase tracking-tighter">Your Cart</h2>
                <span className="bg-primary/10 text-primary text-[10px] font-black px-2 py-0.5 rounded-full ml-2">
                  {items.length} ITEMS
                </span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="rounded-full">
                <X className="size-5" />
              </Button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="size-20 bg-muted rounded-full flex items-center justify-center text-muted-foreground">
                    <ShoppingCart className="size-10" />
                  </div>
                  <h3 className="font-bold text-lg">Your cart is empty</h3>
                  <p className="text-muted-foreground text-sm">Looks like you haven&apos;t added anything yet.</p>
                  <Button onClick={() => setOpen(false)} className="font-bold">START SHOPPING</Button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.productId} className="flex gap-4 group">
                    <div className="relative size-24 rounded-xl overflow-hidden bg-muted border border-border">
                      {item.image ? (
                        <Image src={item.image} alt={item.title} fill className="object-cover" />
                      ) : (
                        <div className="size-full flex items-center justify-center text-muted-foreground">
                          <ShoppingCart className="size-8" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between gap-2">
                        <div>
                          <h4 className="font-bold text-sm hover:text-primary transition-colors line-clamp-1">{item.title}</h4>
                          <p className="text-primary font-black text-sm">${item.price.toFixed(2)}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeFromCart(item.productId)}
                          className="size-8 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-border rounded-lg p-1">
                          <Button 
                             variant="ghost" 
                             size="icon" 
                             className="size-6 rounded-md" 
                             onClick={() => updateQty(item.productId, item.qty - 1)}
                          >
                            <Minus className="size-3" />
                          </Button>
                          <span className="w-8 text-center text-xs font-bold">{item.qty}</span>
                          <Button 
                             variant="ghost" 
                             size="icon" 
                             className="size-6 rounded-md" 
                             onClick={() => updateQty(item.productId, item.qty + 1)}
                          >
                            <Plus className="size-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-border bg-muted/30 space-y-4">
                <div className="flex items-center justify-between text-lg">
                  <span className="font-medium text-muted-foreground uppercase text-xs tracking-widest">Total Amount</span>
                  <span className="font-black text-2xl tracking-tighter text-primary">${totalPrice().toFixed(2)}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                   <Link href="/cart" onClick={() => setOpen(false)} className="w-full">
                      <Button variant="outline" className="w-full h-12 font-bold tracking-widest text-xs">VIEW CART</Button>
                   </Link>
                   <Link href="/checkout" onClick={() => setOpen(false)} className="w-full">
                      <Button className="w-full h-12 font-bold tracking-widest text-xs">CHECKOUT</Button>
                   </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
