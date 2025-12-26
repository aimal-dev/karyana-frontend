"use client"

import { useState, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Search, Grid, List, ChevronDown, Star, ShoppingCart, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useSearchParams, useRouter } from "next/navigation";

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  title: string;
  price: number;
  image?: string;
  description?: string;
  category?: Category;
  reviews?: { rating: number }[];
}

function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("default");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [tempPriceRange, setTempPriceRange] = useState({ min: 0, max: 1000 });
  const category = searchParams.get("category");
  const addToCart = useCartStore((state) => state.addToCart);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();

  const { data: catData } = useQuery<{ categories: Category[] }>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/category/all");
      return res.data;
    }
  });

  const { data, isLoading } = useQuery<{ products: Product[] }>({
    queryKey: ["products", search, category],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      
      let finalCategoryId = category;
      // If category is a slug (e.g. "fresh"), find its ID
      if (category && isNaN(Number(category)) && catData?.categories) {
        const found = catData.categories.find(c => 
          c.name.toLowerCase().includes(category.toLowerCase())
        );
        if (found) finalCategoryId = found.id.toString();
      }

      if (finalCategoryId) params.append("categoryId", finalCategoryId);
      const res = await api.get(`/products/all?${params.toString()}`);
      return res.data;
    },
    enabled: !!catData || !category // Wait for categories if we have a slug to match
  });

  // Filter and sort products
  const filteredProducts = data?.products
    .filter(p => p.price >= priceRange.min && p.price <= priceRange.max)
    .sort((a, b) => {
      switch(sortBy) {
        case "price-low": return a.price - b.price;
        case "price-high": return b.price - a.price;
        case "name-asc": return a.title.localeCompare(b.title);
        case "name-desc": return b.title.localeCompare(a.title);
        default: return 0;
      }
    }) || [];

  const handleCategoryChange = (catId: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (catId) {
      params.set("category", catId);
    } else {
      params.delete("category");
    }
    router.push(`/shop?${params.toString()}`, { scroll: false });
  };

  const applyPriceFilter = () => {
    setPriceRange(tempPriceRange);
  };

  const clearPriceFilter = () => {
    setPriceRange({ min: 0, max: 1000 });
    setTempPriceRange({ min: 0, max: 1000 });
  };

  return (
    <>
      {/* Header / Breadcrumb */}
      <div className="relative py-16 overflow-hidden border-b border-border bg-accent/20 mt-28 md:mt-32">
        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center space-y-2">
           <h1 className="text-4xl md:text-5xl font-bold font-black tracking-tighter uppercase font-subheading-main">OUR <span className="text-primary font-subheading-main">SHOP</span></h1>
           <p className="text-muted-foreground font-medium font-black tracking-[0.2em] uppercase text-[14px] font-subheading">Home // Shop</p>
        </div>
      </div>

      <div className="min-h-screen bg-background pb-20 px-4 md:px-8 lg:px-20">

      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar / Filters */}
          <aside className="w-full lg:w-72 space-y-10 shrink-0">
            {/* Search */}
            <div className="space-y-4">
              <h3 className="font-black text-[14px] font-medium uppercase tracking-[0.2em] border-l-2 border-primary pl-4 font-subheading">Search</h3>
              <div className="relative group">
                <Input 
                  placeholder="SEARCH PRODUCTS..." 
                  className="bg-muted/50 border-border h-11 pl-10 rounded-xl text-[10px] font-black tracking-widest" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-4">
              <h3 className="font-black text-[14px] font-medium uppercase tracking-[0.2em] border-l-2 border-primary pl-4 font-subheading">Categories</h3>
              <ul className="space-y-1">
                <li>
                  <button 
                    onClick={() => handleCategoryChange(null)}
                    className={`w-full text-left py-2 transition-colors text-xs font-black uppercase tracking-widest flex justify-between group font-subheading ${!category ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
                  >
                    <span className="flex items-center gap-3">
                      <div className={`size-1 transition-colors rounded-full ${!category ? 'bg-primary' : 'bg-muted-foreground/30 group-hover:bg-primary'}`} />
                      All Categories
                    </span>
                  </button>
                </li>
                {catData?.categories.map((cat) => (
                  <li key={cat.id}>
                    <button 
                      onClick={() => handleCategoryChange(cat.id.toString())}
                      className={`w-full text-left py-2 transition-colors text-xs font-black uppercase tracking-widest flex justify-between group font-subheading ${category === cat.id.toString() ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
                    >
                      <span className="flex items-center gap-3">
                        <div className={`size-1 transition-colors rounded-full ${category === cat.id.toString() ? 'bg-primary' : 'bg-muted-foreground/30 group-hover:bg-primary'}`} />
                        {cat.name}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Filter by Price */}
            <div className="space-y-4">
              <h3 className="font-black text-[14px] font-medium uppercase tracking-[0.2em] border-l-2 border-primary pl-4 font-subheading">Filter By Price</h3>
              <div className="pt-4 space-y-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Min: RS {tempPriceRange.min}</label>
                    <input 
                      type="range" 
                      min="0" 
                      max="1000" 
                      step="10"
                      value={tempPriceRange.min}
                      onChange={(e) => setTempPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                      className="w-full h-1 bg-muted rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Max: RS {tempPriceRange.max}</label>
                    <input 
                      type="range" 
                      min="0" 
                      max="1000" 
                      step="10"
                      value={tempPriceRange.max}
                      onChange={(e) => setTempPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                      className="w-full h-1 bg-muted rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer"
                    />
                 </div>
                 <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                    <span className="text-muted-foreground">Price: <span className="text-foreground">RS {priceRange.min} — RS {priceRange.max}</span></span>
                    <div className="flex gap-2">
                       <button onClick={clearPriceFilter} className="text-red-500 hover:underline">Clear</button>
                       <button onClick={applyPriceFilter} className="text-primary hover:underline">Filter</button>
                    </div>
                 </div>
              </div>
            </div>

            {/* Specialized Ad / Banner */}
            <div className="relative rounded-2xl overflow-hidden aspect-[3/4] group border border-border bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
               <div className="absolute bottom-6 left-6 right-6 space-y-2">
                  <p className="text-primary-foreground font-medium text-[8px] bg-primary inline-block px-2 py-1 rounded-md uppercase tracking-widest font-subheading">Save 20%</p>
                  <h4 className="text-white font-medium text-lg leading-none tracking-tighter">FRESH ORGANIC HONEY</h4>
                  <Button className="w-full bg-white text-black hover:bg-white/90 font-black h-9 text-[9px] tracking-widest rounded-xl mt-2">SHOP NOW</Button>
               </div>
            </div>
          </aside>

          {/* Main Grid */}
          <main className="flex-1 space-y-8">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-card border border-border p-3 px-6 rounded-2xl shadow-sm">
               <p className="text-muted-foreground text-[14px] font-medium uppercase tracking-widest font-subheading">Showing 1–{filteredProducts.length} results</p>
               <div className="flex items-center gap-4">
                  <div className="flex bg-muted/30 rounded-lg p-1 border border-border">
                    <button 
                      onClick={() => setViewMode("grid")}
                      className={`p-1.5 rounded-md transition-colors ${viewMode === "grid" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-primary"}`}
                    >
                      <Grid className="size-3.5" />
                    </button>
                    <button 
                      onClick={() => setViewMode("list")}
                      className={`p-1.5 rounded-md transition-colors ${viewMode === "list" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-primary"}`}
                    >
                      <List className="size-3.5" />
                    </button>
                  </div>
                  <div className="relative group">
                     <select 
                       value={sortBy}
                       onChange={(e) => setSortBy(e.target.value)}
                       className="bg-muted/30 border border-border text-foreground text-[14px] font-medium uppercase tracking-widest px-4 py-2 rounded-lg appearance-none pr-10 outline-none focus:border-primary transition-all font-subheading"
                     >
                        <option value="default">Default Sorting</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="name-asc">Name: A to Z</option>
                        <option value="name-desc">Name: Z to A</option>
                     </select>
                     <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-3 text-muted-foreground pointer-events-none" />
                  </div>
               </div>
            </div>

            {/* Products Grid/List */}
            <div className={viewMode === "grid" 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" 
              : "flex flex-wrap gap-8"
            }>
              {isLoading ? (
                [1,2,3,4,5,6].map((i) => (
                  <div key={i} className="aspect-[3/4] bg-muted animate-pulse rounded-2xl border border-border" />
                ))
              ) : filteredProducts.length === 0 ? (
                <div className="col-span-full h-[400px] flex flex-col items-center justify-center text-center space-y-4 rounded-3xl bg-muted/20 border-2 border-dashed border-border p-8">
                   <div className="size-20 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                      <Search className="size-8" />
                   </div>
                   <div className="space-y-1">
                      <h3 className="text-xl font-bold uppercase tracking-tight">No products found</h3>
                      <p className="text-muted-foreground text-sm font-medium">
                         We couldn&apos;t find any products matching &quot;{search}&quot;
                      </p>
                   </div>
                   <Button 
                      onClick={() => {
                        setSearch("");
                        router.push("/shop");
                      }}
                      className="h-12 px-8 rounded-xl bg-primary text-primary-foreground font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform"
                   >
                      Clear Search
                   </Button>
                </div>
              ) : (
                filteredProducts.map((product: Product) => (
                  <div key={product.id} className={`group relative bg-card border border-border rounded-2xl p-4 transition-all hover:shadow-xl hover:border-primary/30 overflow-hidden ${viewMode === "list" ? "w-[calc(25%-1.5rem)]" : ""}`}>
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
                        <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-[8px] font-medium px-2 py-0.5 rounded tracking-tighter uppercase transition-transform group-hover:scale-110 font-subheading">HOT</div>
                        
                        <button
                          onClick={(e) => {
                             e.preventDefault();
                             e.stopPropagation();
                             if (isInWishlist(product.id)) {
                               removeFromWishlist(product.id);
                             } else {
                               addToWishlist(product);
                             }
                          }}
                          className="absolute top-3 right-3 bg-white/80 p-2 rounded-full text-muted-foreground hover:text-red-500 transition-colors z-20 backdrop-blur-sm opacity-0 group-hover:opacity-100"
                        >
                           <Heart className={`size-4 ${isInWishlist(product.id) ? "fill-red-500 text-red-500" : ""}`} />
                        </button>
                      </div>
                    </Link>
                    
                    <div className="space-y-2 px-1">
                      {(() => {
                        const avgRating = product.reviews && product.reviews.length > 0
                          ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
                          : 0;
                        const fullStars = Math.floor(avgRating);
                        const hasHalfStar = avgRating % 1 >= 0.5;
                        
                        return (
                          <div className="flex items-center gap-1 text-yellow-500">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`size-2.5 ${
                                  i < fullStars 
                                    ? "fill-current" 
                                    : i === fullStars && hasHalfStar 
                                      ? "fill-current opacity-50" 
                                      : "fill-none stroke-current"
                                }`} 
                              />
                            ))}
                            <span className="text-muted-foreground text-[8px] font-medium ml-1 uppercase tracking-widest font-subheading">
                              ({avgRating > 0 ? avgRating.toFixed(1) : "No reviews"})
                            </span>
                          </div>
                        );
                      })()}

                      <Link href={`/product/${product.id}`} className="block">
                         <h4 className="text-[12px] tracking-tight hover:text-primary transition-colors line-clamp-1">
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
                ))
              )}
            </div>

            {/* Pagination */}
            {filteredProducts.length > 10 && (
              <div className="flex justify-center gap-3 pt-12">
                {[1, 2, 3].map((n, i) => (
                  <button key={i} className={`size-10 rounded-xl border border-border flex items-center justify-center font-black text-[10px] transition-all shadow-sm ${n === 1 ? 'bg-primary border-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:border-primary hover:text-primary'}`}>
                    0{n}
                  </button>
                ))}
                <button className="px-6 rounded-xl border border-border bg-card flex items-center justify-center font-medium text-[14px] uppercase tracking-[0.2em] text-muted-foreground hover:border-primary hover:text-primary transition-all shadow-sm font-subheading">Next</button>
              </div>
            )}
          </main>
        </div>
      </div>
      </div>
    </>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center pt-20"><div className="size-16 border-t-2 border-primary rounded-full animate-spin" /></div>}>
      <ShopContent />
    </Suspense>
  );
}
