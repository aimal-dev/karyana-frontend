"use client"

import StoreBanner from "@/components/home/StoreBanner";
import CategoryGrid from "@/components/home/CategoryGrid";
import CategorySection from "@/components/home/CategorySection";
import ProductSection from "@/components/home/ProductSection";
import DealSection from "@/components/home/DealSection";
import VideoSection from "@/components/home/VideoSection";
import TestimonialSection from "@/components/home/TestimonialSection";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

export default function HomePage() {
  const { data: settingsData } = useQuery({
    queryKey: ["store-settings"],
    queryFn: async () => (await api.get("/settings")).data
  });

  const limits = {
    trending: settingsData?.settings?.trendingLimit || 10,
    featured: settingsData?.settings?.featuredLimit || 10,
    categories: settingsData?.settings?.categoriesLimit || 10
  };

  return (
    <main className="min-h-screen bg-background">
      <StoreBanner />
      <CategoryGrid />
      
      <div className="px-4 md:px-8 lg:px-20">
        <CategorySection limit={limits.categories} />
        
        {/* Trendy Products */}
        <ProductSection 
          type="trending" 
          title="TRENDY PRODUCTS" 
          subtitle="OUR TRENDY PRODUCTS" 
          limit={limits.trending} 
        />
        
        <DealSection />
        
        {/* Featured Products */}
        <ProductSection 
          type="featured" 
          title="FEATURED PRODUCTS" 
          subtitle="BEST SELLING ITEMS" 
          limit={limits.featured} 
        />
      </div>
      
      <VideoSection />
      
      <div className="px-4 md:px-8 lg:px-20">
        <TestimonialSection />
        

        
        {/* Value Proposition Row */}
        <section className="py-20 border-t border-border bg-card/30">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex flex-wrap justify-between items-center gap-8">
              {["Curated Products", "Handmade", "Natural Food", "Free Home Delivery"].map((item, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-sm">
                    <div className="size-2 rounded-full bg-current animate-pulse" />
                  </div>
                  <span className="text-[16px] font-medium font-black tracking-[0.2em] uppercase font-subheading">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}