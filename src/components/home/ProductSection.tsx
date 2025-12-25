"use client"

import { useCartStore } from "@/store/useCartStore";
import { Button } from "@/components/ui/Button";
import { ShoppingCart, Star, Eye, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const mockProducts = [
  {
    id: 1,
    title: "Fresh Red Tomato",
    price: 3.50,
    oldPrice: 4.90,
    image: "https://images.unsplash.com/photo-1518977676601-b53f02ac6d5d?q=80&w=400&auto=format&fit=crop",
    category: "Fresh Produce",
    rating: 4.8
  },
  {
    id: 2,
    title: "Organic Avocados",
    price: 12.00,
    oldPrice: 15.00,
    image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b56d?q=80&w=400&auto=format&fit=crop",
    category: "Fresh Produce",
    rating: 4.9
  },
  {
    id: 3,
    title: "Sweet Orange Juice",
    price: 5.50,
    oldPrice: 8.00,
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=400&auto=format&fit=crop",
    category: "Beverages",
    rating: 4.5
  },
  {
    id: 4,
    title: "Premium Honey Jar",
    price: 24.00,
    oldPrice: 29.99,
    image: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?q=80&w=400&auto=format&fit=crop",
    category: "Pantry",
    rating: 5.0
  },
  {
    id: 5,
    title: "Organic Spinach",
    price: 4.20,
    oldPrice: 6.00,
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=400&auto=format&fit=crop",
    category: "Leafy Greens",
    rating: 4.7
  }
];

export default function ProductSection({ title = "TRENDY PRODUCTS", subtitle = "OUR TRENDY PRODUCTS" }) {
  const addToCart = useCartStore((state) => state.addToCart);

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16 space-y-2">
          <h2 className="text-primary font-semibold font-black tracking-[0.2em] uppercase text-[15px] letter-spacing-[0.5em] font-subheading">{title}</h2>
          <h3 className="font-subheading-main text-5xl font-black tracking-tighter uppercase">{subtitle}</h3>
          <div className="w-10 h-1 bg-primary mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-5">
          {mockProducts.map((product) => (
            <div key={product.id} className="group relative bg-card border border-border rounded-xl p-3 transition-all hover:shadow-xl hover:border-primary/30 overflow-hidden">
              {/* Image Area */}
              <div className="relative aspect-square rounded-lg overflow-hidden bg-muted/30 mb-4">
                <Image 
                  src={product.image} 
                  alt={product.title} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                
                {/* Labels */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                   <div className="bg-primary text-primary-foreground text-[7px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest">NEW</div>
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
              <div className="space-y-1.5 px-0.5">
                <div className="flex items-center gap-0.5 text-yellow-500">
                   {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`size-2 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-muted'}`} />
                   ))}
                   <span className="text-muted-foreground text-[7px] font-black ml-1 uppercase tracking-widest opacity-60">({product.rating})</span>
                </div>

                <Link href={`/product/${product.id}`}>
                  <h4 className="font-black text-[12px] font-bold tracking-tight hover:text-primary transition-colors line-clamp-1 uppercase leading-tight font-subheading">{product.title}</h4>
                </Link>

                <div className="flex items-center gap-2">
                   <span className="text-primary font-black text-sm tracking-tighter">RS {product.price.toFixed(2)}</span>
                   {product.oldPrice && (
                     <span className="text-muted-foreground text-[10px] line-through font-black opacity-50 tracking-tighter">RS {product.oldPrice.toFixed(2)}</span>
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
      </div>
    </section>
  );
}
