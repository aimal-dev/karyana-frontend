import Hero from "@/components/home/Hero";
import CategorySection from "@/components/home/CategorySection";
import ProductSection from "@/components/home/ProductSection";
import DealSection from "@/components/home/DealSection";
import VideoSection from "@/components/home/VideoSection";
import TestimonialSection from "@/components/home/TestimonialSection";
import BlogSection from "@/components/home/BlogSection";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <Hero />
      <CategorySection />
      
      {/* Trendy Products */}
      <ProductSection title="TRENDY PRODUCTS" subtitle="OUR TRENDY PRODUCTS" />
      
      <DealSection />
      
      {/* Featured Products */}
      <ProductSection title="FEATURED PRODUCTS" subtitle="BEST SELLING ITEMS" />
      
      <VideoSection />
      
      <TestimonialSection />
      
      <BlogSection />
      
      {/* Value Proposition Row */}
      <section className="py-20 border-t border-border bg-card/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-wrap justify-between items-center gap-8">
            {["Curated Products", "Handmade", "Natural Food", "Free Home Delivery"].map((item, i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-sm">
                  <div className="size-2 rounded-full bg-current animate-pulse" />
                </div>
                <span className="text-[10px] font-black tracking-[0.2em] uppercase font-subheading">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}